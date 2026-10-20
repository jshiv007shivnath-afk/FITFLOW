import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
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
    console.error('[API /profile GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve profile.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json().catch(() => ({}));
    const { membership, level, xp, streakDays, weightKg, avatarUrl } = body;

    const now = new Date();

    const upsertRes = await query(
      `INSERT INTO "profiles" ("id", "userId", "membership", "level", "xp", "streakDays", "weightKg", "avatarUrl", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
       ON CONFLICT ("userId")
       DO UPDATE SET
         "membership" = COALESCE(EXCLUDED."membership", "profiles"."membership"),
         "level" = COALESCE(EXCLUDED."level", "profiles"."level"),
         "xp" = COALESCE(EXCLUDED."xp", "profiles"."xp"),
         "streakDays" = COALESCE(EXCLUDED."streakDays", "profiles"."streakDays"),
         "weightKg" = COALESCE(EXCLUDED."weightKg", "profiles"."weightKg"),
         "avatarUrl" = COALESCE(EXCLUDED."avatarUrl", "profiles"."avatarUrl"),
         "updatedAt" = EXCLUDED."updatedAt"
       RETURNING "membership", "level", "xp", "streakDays", "weightKg", "avatarUrl"`,
      [
        `prof_${userId}`,
        userId,
        membership || 'Free',
        typeof level === 'number' ? level : 1,
        typeof xp === 'number' ? xp : 0,
        typeof streakDays === 'number' ? streakDays : 0,
        typeof weightKg === 'number' ? weightKg : 68.5,
        avatarUrl || null,
        now,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: upsertRes.rows[0],
    });
  } catch (error: any) {
    console.error('[API /profile PATCH] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
