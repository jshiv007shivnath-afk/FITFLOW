import { NextRequest, NextResponse } from 'next/server';
import {
  sanitizeEmail,
  checkOtpRateLimit,
  generateCryptographicOtp,
  storeOtp,
} from '@/lib/security';
import { sendOtpEmail } from '@/lib/email';

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

    // 1. Enforce Rate Limiting (1 request per 60 seconds)
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
