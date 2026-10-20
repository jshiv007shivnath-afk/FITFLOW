import { randomInt, randomUUID } from 'crypto';
import { query } from './db';

// ------------------------------------------------------------------------------
// CONSTANTS FOR SECURITY POLICY
// ------------------------------------------------------------------------------
export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds
export const MAX_ATTEMPTS = 4; // 4 attempts max
export const LOCKOUT_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours (1 full day) lockout

// In-memory fallback tracking for rate-limits and active OTPs
interface RateLimitEntry {
  lastSentAt: number;
}

interface StoredOtpEntry {
  value: string;
  expiresAt: number;
  attempts: number;
  lockedUntil?: number;
}

const memoryRateLimits = new Map<string, RateLimitEntry>();
const memoryOtpStore = new Map<string, StoredOtpEntry>();

// ------------------------------------------------------------------------------
// 1. CRYPTOGRAPHIC OTP GENERATION
// ------------------------------------------------------------------------------
export function generateCryptographicOtp(): string {
  // Generates a cryptographically strong 6-digit random number between 100000 and 999999
  const num = randomInt(100000, 1000000);
  return num.toString();
}

// ------------------------------------------------------------------------------
// 2. INPUT SANITIZATION & VALIDATION
// ------------------------------------------------------------------------------
export function sanitizeEmail(email: unknown): string | null {
  if (typeof email !== 'string') return null;
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return null;
  return trimmed;
}

export function validatePassword(password: unknown): { isValid: boolean; error?: string } {
  if (typeof password !== 'string') {
    return { isValid: false, error: 'Password must be a valid string.' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long.' };
  }
  return { isValid: true };
}

export function validateGoalsInput(input: any): {
  isValid: boolean;
  calorieTarget?: number;
  waterTargetMl?: number;
  exerciseTargetMin?: number;
  error?: string;
} {
  const calorieTarget = Number(input?.calorieTarget);
  const waterTargetMl = Number(input?.waterTargetMl);
  const exerciseTargetMin = Number(input?.exerciseTargetMin);

  if (isNaN(calorieTarget) || calorieTarget <= 0 || calorieTarget > 10000) {
    return { isValid: false, error: 'Calorie target must be a positive number between 1 and 10000.' };
  }
  if (isNaN(waterTargetMl) || waterTargetMl <= 0 || waterTargetMl > 10000) {
    return { isValid: false, error: 'Water target must be a positive number between 1 and 10000 ml.' };
  }
  if (isNaN(exerciseTargetMin) || exerciseTargetMin <= 0 || exerciseTargetMin > 720) {
    return { isValid: false, error: 'Exercise target must be a positive number between 1 and 720 minutes.' };
  }

  return {
    isValid: true,
    calorieTarget: Math.round(calorieTarget),
    waterTargetMl: Math.round(waterTargetMl),
    exerciseTargetMin: Math.round(exerciseTargetMin),
  };
}

// ------------------------------------------------------------------------------
// 3. OTP RATE LIMITING (Max 1 send request per 60s per identifier)
// ------------------------------------------------------------------------------
export async function checkOtpRateLimit(identifier: string): Promise<{
  allowed: boolean;
  retryAfterSec?: number;
}> {
  const now = Date.now();
  const memEntry = memoryRateLimits.get(identifier);

  if (memEntry && now - memEntry.lastSentAt < RATE_LIMIT_WINDOW_MS) {
    const retryAfterSec = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - memEntry.lastSentAt)) / 1000);
    return { allowed: false, retryAfterSec };
  }

  // Also check database verification table for persistent enforcement
  try {
    const res = await query(
      `SELECT "createdAt" FROM "verification" WHERE "identifier" = $1 ORDER BY "createdAt" DESC LIMIT 1`,
      [identifier]
    );
    if (res.rows.length > 0) {
      const dbLastSent = new Date(res.rows[0].createdAt).getTime();
      if (now - dbLastSent < RATE_LIMIT_WINDOW_MS) {
        const retryAfterSec = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - dbLastSent)) / 1000);
        return { allowed: false, retryAfterSec };
      }
    }
  } catch {
    // If DB check fails, rely on in-memory rate limiting
  }

  return { allowed: true };
}

export function recordOtpSent(identifier: string): void {
  memoryRateLimits.set(identifier, { lastSentAt: Date.now() });
}

// ------------------------------------------------------------------------------
// 4. BRUTE-FORCE LOCKOUT & VERIFICATION (Max 4 attempts, 24h / 1 day lockout)
// ------------------------------------------------------------------------------
export async function checkAccountLockout(identifier: string): Promise<{
  isLocked: boolean;
  lockedUntil?: Date;
  error?: string;
}> {
  const now = new Date();
  const nowMs = now.getTime();

  // 1. Check in-memory store
  const memEntry = memoryOtpStore.get(identifier);
  if (memEntry?.lockedUntil && memEntry.lockedUntil > nowMs) {
    const lockedUntilDate = new Date(memEntry.lockedUntil);
    return {
      isLocked: true,
      lockedUntil: lockedUntilDate,
      error: 'Try again next day',
    };
  }

  // 2. Check Database record
  try {
    const res = await query(
      `SELECT "lockedUntil"
       FROM "verification"
       WHERE "identifier" = $1 AND "lockedUntil" > $2
       ORDER BY "lockedUntil" DESC
       LIMIT 1`,
      [identifier, now]
    );

    if (res.rows.length > 0 && res.rows[0].lockedUntil) {
      const lockedUntilDate = new Date(res.rows[0].lockedUntil);
      if (memEntry) {
        memEntry.lockedUntil = lockedUntilDate.getTime();
      } else {
        memoryOtpStore.set(identifier, {
          value: '',
          expiresAt: 0,
          attempts: MAX_ATTEMPTS,
          lockedUntil: lockedUntilDate.getTime(),
        });
      }
      return {
        isLocked: true,
        lockedUntil: lockedUntilDate,
        error: 'Try again next day',
      };
    }
  } catch (err) {
    console.warn('[Security] DB lockout check fallback to memory:', err);
  }

  return { isLocked: false };
}

export async function storeOtp(identifier: string, code: string): Promise<void> {
  // Enforce lockout: blocked accounts cannot request OTP
  const lockout = await checkAccountLockout(identifier);
  if (lockout.isLocked) {
    throw new Error('Try again next day');
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_TTL_MS);
  const id = `otp_${randomUUID()}`;

  recordOtpSent(identifier);
  memoryOtpStore.set(identifier, {
    value: code,
    expiresAt: expiresAt.getTime(),
    attempts: 0,
  });

  try {
    // Clean up previous un-locked verification entries for this identifier
    await query(
      `DELETE FROM "verification"
       WHERE "identifier" = $1 AND ("lockedUntil" IS NULL OR "lockedUntil" <= NOW())`,
      [identifier]
    );

    // Insert new verification record with 0 attempts
    await query(
      `INSERT INTO "verification" ("id", "identifier", "value", "expiresAt", "attempts", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, 0, $5, $5)`,
      [id, identifier, code, expiresAt, now]
    );
  } catch (err) {
    console.warn('[Security] Failed to store OTP in DB, falling back to memory verification:', err);
  }
}

export async function verifyOtp(
  identifier: string,
  enteredCode: string
): Promise<{
  success: boolean;
  status: 'valid' | 'invalid_code' | 'expired' | 'locked' | 'not_found';
  remainingAttempts?: number;
  lockedUntil?: Date;
  error?: string;
}> {
  const now = new Date();
  const nowMs = now.getTime();

  // 1. Check in-memory store & lockout first
  const memEntry = memoryOtpStore.get(identifier);
  if (memEntry?.lockedUntil && memEntry.lockedUntil > nowMs) {
    const lockedUntilDate = new Date(memEntry.lockedUntil);
    return {
      success: false,
      status: 'locked',
      lockedUntil: lockedUntilDate,
      remainingAttempts: 0,
      error: 'Try again next day',
    };
  }

  // 2. Fetch record from DB or memory fallback
  let dbRow: any = null;
  try {
    const res = await query(
      `SELECT "id", "value", "expiresAt", "attempts", "lockedUntil"
       FROM "verification"
       WHERE "identifier" = $1
       ORDER BY "createdAt" DESC
       LIMIT 1`,
      [identifier]
    );
    if (res.rows.length > 0) {
      dbRow = res.rows[0];
    }
  } catch {
    // DB offline/busy, fall back to memEntry below
  }

  // Check DB lockout if present
  if (dbRow?.lockedUntil && new Date(dbRow.lockedUntil).getTime() > nowMs) {
    const lockedUntilDate = new Date(dbRow.lockedUntil);
    if (memEntry) {
      memEntry.lockedUntil = lockedUntilDate.getTime();
    }
    return {
      success: false,
      status: 'locked',
      lockedUntil: lockedUntilDate,
      remainingAttempts: 0,
      error: 'Try again next day',
    };
  }

  const activeValue = dbRow ? dbRow.value : memEntry?.value;
  const activeExpiresAt = dbRow ? new Date(dbRow.expiresAt).getTime() : memEntry?.expiresAt;
  const activeAttempts = dbRow ? (dbRow.attempts || 0) : (memEntry?.attempts || 0);

  if (!activeValue || !activeExpiresAt) {
    return {
      success: false,
      status: 'not_found',
      error: 'No active OTP found. Please request a new code.',
    };
  }

  // 3. Check expiration (10 min TTL)
  if (activeExpiresAt < nowMs) {
    return {
      success: false,
      status: 'expired',
      error: 'OTP has expired. Please request a new code.',
    };
  }

  // 4. Check code match
  const isMatch = activeValue === enteredCode.trim();

  if (isMatch) {
    // Success: Delete verification record so OTP is single-use
    if (dbRow?.id) {
      try {
        await query(`DELETE FROM "verification" WHERE "id" = $1`, [dbRow.id]);
      } catch {
        // Ignore cleanup error
      }
    }
    memoryOtpStore.delete(identifier);
    return { success: true, status: 'valid' };
  }

  // 5. Handle Failed Attempt
  const newAttempts = activeAttempts + 1;
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - newAttempts);

  if (newAttempts >= MAX_ATTEMPTS) {
    const lockUntilDate = new Date(nowMs + LOCKOUT_DURATION_MS);
    if (memEntry) {
      memEntry.attempts = newAttempts;
      memEntry.lockedUntil = lockUntilDate.getTime();
    } else {
      memoryOtpStore.set(identifier, {
        value: activeValue,
        expiresAt: activeExpiresAt,
        attempts: newAttempts,
        lockedUntil: lockUntilDate.getTime(),
      });
    }

    if (dbRow?.id) {
      try {
        await query(
          `UPDATE "verification"
           SET "attempts" = $1, "lockedUntil" = $2, "updatedAt" = $3
           WHERE "id" = $4`,
          [newAttempts, lockUntilDate, now, dbRow.id]
        );
      } catch {
        // Memory state is already set
      }
    }

    return {
      success: false,
      status: 'locked',
      lockedUntil: lockUntilDate,
      remainingAttempts: 0,
      error: 'Try again next day',
    };
  }

  // Under limit: update attempt count
  if (memEntry) {
    memEntry.attempts = newAttempts;
  }
  if (dbRow?.id) {
    try {
      await query(
        `UPDATE "verification"
         SET "attempts" = $1, "updatedAt" = $2
         WHERE "id" = $3`,
        [newAttempts, now, dbRow.id]
      );
    } catch {
      // Memory state holds the count
    }
  }

  return {
    success: false,
    status: 'invalid_code',
    remainingAttempts,
    error: `Wrong OTP. ${remainingAttempts} attempt(s) remaining.`,
  };
}
