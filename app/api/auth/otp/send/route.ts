import { NextRequest, NextResponse } from 'next/server';
import {
  sanitizeEmail,
  checkAccountLockout,
  checkOtpRateLimit,
  generateCryptographicOtp,
  storeOtp,
} from '@/lib/security';
import { sendOtpEmail } from '@/lib/email';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawEmail = body.email;
    const email = sanitizeEmail(rawEmail);

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
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

    // 1. Enforce 24-Hour Account Lockout (Defense against brute-force & restarts)
    const lockout = await checkAccountLockout(email);
    if (lockout.isLocked) {
      return NextResponse.json(
        {
          success: false,
          error: 'Try again next day',
          isLocked: true,
          lockedUntil: lockout.lockedUntil,
        },
        { status: 423 }
      );
    }

    // 2. Enforce Rate Limiting (1 request per 60 seconds)
    const rateLimit = await checkOtpRateLimit(email);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Please wait ${rateLimit.retryAfterSec}s before requesting a new verification code.`,
          retryAfterSec: rateLimit.retryAfterSec,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSec || 60),
          },
        }
      );
    }

    // 2. Generate Cryptographic 6-digit numeric OTP with 10-minute TTL
    const otp = generateCryptographicOtp();

    // 3. Store OTP in DB & in-memory rate-limiter
    await storeOtp(email, otp);

    // Update verification table with readable email, sent_otp, and status
    try {
      await query(
        `UPDATE "verification" 
         SET "email" = $1, "sent_otp" = $2, "status" = 'Sent', "updatedAt" = NOW() 
         WHERE "identifier" = $1`,
        [email, otp]
      );
    } catch {}

    // 4. Send via Nodemailer (Local SMTP on 54325 or configured SMTP)
    const sendResult = await sendOtpEmail(email, otp);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email.',
      email,
      warning: sendResult.error ? 'Email logged in dev mode' : undefined,
    });
  } catch (error: any) {
    console.error('[API /auth/otp/send] Internal error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while sending the code.' },
      { status: 500 }
    );
  }
}
