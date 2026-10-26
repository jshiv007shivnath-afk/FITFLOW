import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId, UnauthorizedError } from '@/lib/auth-session';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    const res = await query(
      `SELECT "id", "userId", "membership", "level", "xp", "streakDays", "weightKg", "avatarUrl", "createdAt", "updatedAt"
       FROM "profiles"
       WHERE "userId" = $1
       LIMIT 1`,
      [userId]
    );

    if (res.rows.length === 0) {
      // Default profile
      return NextResponse.json({
        success: true,
        profile: {
          userId,
          membership: 'Free',
          level: 1,
          xp: 0,
          streakDays: 0,
          weightKg: 68.5,
          avatarUrl: null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      profile: res.rows[0],
    });
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    console.error('[API /profile GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve profile.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    const body = await req.json().catch(() => ({}));
    const { weightKg, avatarUrl } = body;

    // Defense against mass-assignment: membership and progression levels cannot be self-elevated
    let sanitizedWeight: number | null = null;
    if (typeof weightKg === 'number' && !isNaN(weightKg) && weightKg >= 20 && weightKg <= 400) {
      sanitizedWeight = Math.round(weightKg * 10) / 10;
    }

    let sanitizedAvatar: string | null = null;
    if (typeof avatarUrl === 'string' && avatarUrl.trim().length > 0 && avatarUrl.trim().length <= 1000) {
      sanitizedAvatar = avatarUrl.trim();
    }

    const now = new Date();

    const upsertRes = await query(
      `INSERT INTO "profiles" ("id", "userId", "membership", "level", "xp", "streakDays", "weightKg", "avatarUrl", "createdAt", "updatedAt")
       VALUES ($1, $2, 'Free', 1, 0, 0, COALESCE($3, 68.5), $4, $5, $5)
       ON CONFLICT ("userId")
       DO UPDATE SET
         "weightKg" = COALESCE($3, "profiles"."weightKg"),
         "avatarUrl" = COALESCE($4, "profiles"."avatarUrl"),
         "updatedAt" = EXCLUDED."updatedAt"
       RETURNING "membership", "level", "xp", "streakDays", "weightKg", "avatarUrl"`,
      [
        `prof_${userId}`,
        userId,
        sanitizedWeight,
        sanitizedAvatar,
        now,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: upsertRes.rows[0],
    });
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    console.error('[API /profile PATCH] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}

