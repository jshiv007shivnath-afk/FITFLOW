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
           RETURNING "id"`,
          [finalUserId, defaultName, email, now]
        );
        if (userRes.rows.length > 0) {
          finalUserId = userRes.rows[0].id;
        }

        // 2. Create active session in "session" table
        await query(
          `INSERT INTO "session" ("id", "token", "userId", "expiresAt", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $5)`,
          [sessionId, token, finalUserId, expiresAt, now]
        );

        // 3. Ensure profile exists in "profiles" table
        await query(
          `INSERT INTO "profiles" ("id", "userId", "membership", "level", "xp", "streakDays", "weightKg", "createdAt", "updatedAt")
           VALUES ($1, $2, 'Free', 1, 0, 1, 68.5, $3, $3)
           ON CONFLICT ("userId") DO NOTHING`,
          [`prof_${finalUserId}`, finalUserId, now]
        );

        // 4. Ensure account exists in "account" table
        await query(
          `INSERT INTO "account" ("id", "accountId", "providerId", "userId", "createdAt", "updatedAt")
           VALUES ($1, $2, 'email', $3, $4, $4)
           ON CONFLICT DO NOTHING`,
          [`acc_${finalUserId}`, email, finalUserId, now]
        );
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
