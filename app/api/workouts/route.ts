import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId, UnauthorizedError } from '@/lib/auth-session';
import { query, withTransaction } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    const res = await query(
      `SELECT "id", "title", "durationMin", "calories", "category", "time", "loggedAt"
       FROM "workout_logs"
       WHERE "userId" = $1
       ORDER BY "loggedAt" DESC
       LIMIT 50`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      workouts: res.rows,
    });
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    console.error('[API /workouts GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve workout logs.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    const body = await req.json().catch(() => ({}));
    const { title, durationMin, calories, category, time } = body;

    if (!title || typeof durationMin !== 'number' || typeof calories !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Missing workout details (title, durationMin, calories are required).' },
        { status: 400 }
      );
    }

    const workoutId = `wk_${randomUUID()}`;
    const now = new Date();

    const result = await withTransaction(async (client) => {
      // 1. Insert workout log
      const logRes = await client.query(
        `INSERT INTO "workout_logs" ("id", "userId", "title", "durationMin", "calories", "category", "time", "loggedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING "id", "title", "durationMin", "calories", "category", "time", "loggedAt"`,
        [workoutId, userId, title, durationMin, calories, category || 'Exercise', time || 'Today', now]
      );

      // 2. Award +50 XP and compute level progression
      const profileRes = await client.query(
        `SELECT "level", "xp", "streakDays" FROM "profiles" WHERE "userId" = $1 LIMIT 1`,
        [userId]
      );

      let currentLevel = 1;
      let currentXp = 0;
      let currentStreak = 0;

      if (profileRes.rows.length > 0) {
        currentLevel = profileRes.rows[0].level || 1;
        currentXp = (profileRes.rows[0].xp || 0) + 50;
        currentStreak = profileRes.rows[0].streakDays || 0;
      } else {
        currentXp = 50;
      }

      // Check level-up threshold (500 XP per level)
      if (currentXp >= 500) {
        currentLevel += 1;
        currentXp -= 500;
      }

      await client.query(
        `INSERT INTO "profiles" ("id", "userId", "level", "xp", "streakDays", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT ("userId")
         DO UPDATE SET
           "level" = EXCLUDED."level",
           "xp" = EXCLUDED."xp",
           "updatedAt" = EXCLUDED."updatedAt"`,
        [`prof_${userId}`, userId, currentLevel, currentXp, currentStreak, now]
      );

      return {
        workout: logRes.rows[0],
        xpEarned: 50,
        level: currentLevel,
        xp: currentXp,
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Workout recorded successfully. +50 XP awarded!',
      ...result,
    });
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    console.error('[API /workouts POST] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record workout.' },
      { status: 500 }
    );
  }
}

