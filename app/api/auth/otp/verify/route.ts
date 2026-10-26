import { NextRequest, NextResponse } from 'next/server';
import { sanitizeEmail, verifyOtp } from '@/lib/security';
import { query } from '@/lib/db';
import { randomBytes, randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawEmail = body.email;
    const rawCode = body.code;

    const email = sanitizeEmail(rawEmail);
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!rawCode || typeof rawCode !== 'string' || rawCode.trim().length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Please enter a complete 6-digit verification code.' },
        { status: 400 }
      );
    }

    // 0. Enforce Deleted Account Check
    try {
      const delCheck = await query(
        `SELECT "email" FROM "deleted_accounts" WHERE LOWER("email") = $1`,
        [email.toLowerCase()]
      );
      if (delCheck.rows.length > 0) {
        return NextResponse.json(
          {
            success: false,
            accountBanned: true,
            accountDeleted: true,
            error: 'Your ID is ban',
          },
          { status: 403 }
        );
      }
    } catch {
      // offline/fallback
    }

    // Run verification with 4-attempt brute-force protection & 24h lockout
    const result = await verifyOtp(email, rawCode);

    if (result.success) {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      const token = randomBytes(32).toString('hex');
      const sessionId = `sess_${randomUUID()}`;
      const defaultName = email.split('@')[0] || 'Athlete';
      let finalUserId = `usr_${randomUUID()}`;

      try {
        // 1. Create or update user in "user" table
        const userRes = await query(
          `INSERT INTO "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, true, $4, $4)
           ON CONFLICT ("email")
           DO UPDATE SET "emailVerified" = true, "updatedAt" = $4
           RETURNING "id", "name"`,
          [finalUserId, defaultName, email, now]
        );
        let actualName = defaultName;
        if (userRes.rows.length > 0) {
          finalUserId = userRes.rows[0].id;
          actualName = userRes.rows[0].name || defaultName;
        }

        // 2. Create active session in "session" table
        try {
          await query(
            `INSERT INTO "session" ("id", "token", "userId", "expiresAt", "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, $5, $5)`,
            [sessionId, token, finalUserId, expiresAt, now]
          );
        } catch {}

        // 3. Record login in "account" table with user_name, user_email, entered_otp, sent_otp
        await query(
          `INSERT INTO "account" ("id", "accountId", "providerId", "userId", "user_name", "user_email", "entered_otp", "sent_otp", "logged_in_at", "createdAt", "updatedAt")
           VALUES ($1, $2, 'email', $3, $4, $2, $5, $5, $6, $6, $6)
           ON CONFLICT ("id") DO UPDATE SET
             "user_name" = EXCLUDED."user_name",
             "user_email" = EXCLUDED."user_email",
             "entered_otp" = EXCLUDED."entered_otp",
             "sent_otp" = EXCLUDED."sent_otp",
             "logged_in_at" = EXCLUDED."logged_in_at",
             "updatedAt" = EXCLUDED."updatedAt"`,
          [`acc_${finalUserId}`, email, finalUserId, actualName, rawCode.trim(), now]
        );

        // 4. Update verification status
        try {
          await query(
            `UPDATE "verification" SET "status" = 'Verified', "updatedAt" = $1 WHERE "identifier" = $2`,
            [now, email]
          );
        } catch {}
      } catch (dbErr) {
        console.warn('[API /auth/otp/verify] DB session creation error:', dbErr);
      }

      const response = NextResponse.json({
        success: true,
        verified: true,
        message: 'Email successfully verified.',
        token,
        userId: finalUserId,
      });

      response.cookies.set('better-auth.session_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        expires: expiresAt,
      });

      return response;
    }

    if (result.status === 'locked') {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          lockedUntil: result.lockedUntil,
          remainingAttempts: 0,
        },
        { status: 423 } // 423 Locked
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: result.error || 'Wrong OTP. Please try again.',
        remainingAttempts: result.remainingAttempts,
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[API /auth/otp/verify] Internal error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred during verification.' },
      { status: 500 }
    );
  }
}
