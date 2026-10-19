import { NextRequest, NextResponse } from 'next/server';
import { sanitizeEmail, verifyOtp } from '@/lib/security';

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

    // Run verification with 5-attempt brute-force protection & 15m lockout
    const result = await verifyOtp(email, rawCode);

    if (result.success) {
      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Email successfully verified.',
      });
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
        error: result.error || 'Invalid verification code.',
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
