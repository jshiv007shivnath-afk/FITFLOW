import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { query, withTransaction } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in to sync.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 1. Fetch Profile
    const profileRes = await query(
      `SELECT "membership", "level", "xp", "streakDays", "weightKg", "avatarUrl"
       FROM "profiles"
       WHERE "userId" = $1
       LIMIT 1`,
      [userId]
    );

    // 2. Fetch Goals
    const goalsRes = await query(
      `SELECT "calorieTarget", "waterTargetMl", "exerciseTargetMin"
       FROM "user_goals"
       WHERE "userId" = $1
       LIMIT 1`,
      [userId]
    );

    // 3. Fetch Weekly Plans
    const plansRes = await query(
      `SELECT "id", "weekId", "weekLabel", "weekNumber", "hasDecidedNewWeek", "createdAt", "updatedAt"
       FROM "weekly_plans"
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC
       LIMIT 2`,
      [userId]
    );

    let currentWeeklyPlan: any = null;
    let previousWeeklyPlan: any = null;

    if (plansRes.rows.length > 0) {
      const planRow = plansRes.rows[0];
      const daysRes = await query(
        `SELECT "id", "dayKey", "dayName", "shortDate", "workoutTitle", "isRestDay", "estimatedDurationMin", "completed", "completedAt"
         FROM "plan_days"
         WHERE "weeklyPlanId" = $1
         ORDER BY "createdAt" ASC`,
        [planRow.id]
      );

      const days = await Promise.all(
        daysRes.rows.map(async (day: any) => {
          const exercisesRes = await query(
            `SELECT "id", "name", "targetType", "sets", "reps", "durationSeconds", "distanceKm", "restIntervalSec"
             FROM "plan_exercises"
             WHERE "planDayId" = $1
             ORDER BY "orderIndex" ASC`,
            [day.id]
          );
          return {
            ...day,
            exercises: exercisesRes.rows,
          };
        })
      );

      currentWeeklyPlan = {
        ...planRow,
        days,
      };

      if (plansRes.rows.length > 1) {
        previousWeeklyPlan = plansRes.rows[1];
      }
    }

    // 4. Fetch Workout Logs
    const workoutsRes = await query(
      `SELECT "id", "title", "durationMin", "calories", "category", "time", "loggedAt"
       FROM "workout_logs"
       WHERE "userId" = $1
       ORDER BY "loggedAt" DESC
       LIMIT 50`,
      [userId]
    );

    // 5. Fetch Notifications
    const notificationsRes = await query(
      `SELECT "id", "iconType", "title", "description", "unread", "createdAt" as timestamp
       FROM "notifications"
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC
       LIMIT 30`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      data: {
        profile: profileRes.rows[0] || null,
        goals: goalsRes.rows[0] || null,
        weeklyPlan: currentWeeklyPlan,
        previousWeeklyPlan,
        workoutLogs: workoutsRes.rows,
        notifications: notificationsRes.rows,
      },
    });
  } catch (error: any) {
    console.error('[API /sync GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to hydrate sync data.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in to sync.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json().catch(() => ({}));
    const { profile, goals, weeklyPlan, newWorkouts, updatedNotifications } = body;

    const now = new Date();

    await withTransaction(async (client) => {
      // 1. Sync Profile
      if (profile) {
        await client.query(
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
             "updatedAt" = EXCLUDED."updatedAt"`,
          [
            `prof_${userId}`,
            userId,
            profile.membership || 'Free',
            profile.level || 1,
            profile.xp || 0,
            profile.streakDays || 0,
            profile.weightKg || 68.5,
            profile.avatarUrl || null,
            now,
          ]
        );
      }

      // 2. Sync Goals
      if (goals) {
        await client.query(
          `INSERT INTO "user_goals" ("id", "userId", "calorieTarget", "waterTargetMl", "exerciseTargetMin", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $6)
           ON CONFLICT ("userId")
           DO UPDATE SET
             "calorieTarget" = EXCLUDED."calorieTarget",
             "waterTargetMl" = EXCLUDED."waterTargetMl",
             "exerciseTargetMin" = EXCLUDED."exerciseTargetMin",
             "updatedAt" = EXCLUDED."updatedAt"`,
          [
            `goal_${userId}`,
            userId,
            goals.calorieTarget || 650,
            goals.waterTargetMl || 2500,
            goals.exerciseTargetMin || 60,
            now,
          ]
        );
      }

      // 3. Sync Weekly Plan
      if (weeklyPlan && weeklyPlan.weekId) {
        const planId = `plan_${userId}_${weeklyPlan.weekId}`;
        await client.query(
          `INSERT INTO "weekly_plans" ("id", "userId", "weekId", "weekLabel", "weekNumber", "hasDecidedNewWeek", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
           ON CONFLICT ("userId", "weekId")
           DO UPDATE SET
             "weekLabel" = EXCLUDED."weekLabel",
             "weekNumber" = EXCLUDED."weekNumber",
             "hasDecidedNewWeek" = EXCLUDED."hasDecidedNewWeek",
             "updatedAt" = EXCLUDED."updatedAt"`,
          [
            planId,
            userId,
            weeklyPlan.weekId,
            weeklyPlan.weekLabel || 'Current Week',
            weeklyPlan.weekNumber || 1,
            weeklyPlan.hasDecidedNewWeek ?? true,
            now,
          ]
        );

        if (Array.isArray(weeklyPlan.days)) {
          for (const day of weeklyPlan.days) {
            const dayId = `day_${planId}_${day.dayKey}`;
            await client.query(
              `INSERT INTO "plan_days" ("id", "weeklyPlanId", "dayKey", "dayName", "shortDate", "workoutTitle", "isRestDay", "estimatedDurationMin", "completed", "completedAt", "createdAt", "updatedAt")
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11)
               ON CONFLICT ("id")
               DO UPDATE SET
                 "workoutTitle" = EXCLUDED."workoutTitle",
                 "isRestDay" = EXCLUDED."isRestDay",
                 "estimatedDurationMin" = EXCLUDED."estimatedDurationMin",
                 "completed" = EXCLUDED."completed",
                 "completedAt" = EXCLUDED."completedAt",
                 "updatedAt" = EXCLUDED."updatedAt"`,
              [
                dayId,
                planId,
                day.dayKey,
                day.dayName || day.dayKey,
                day.shortDate || '',
                day.workoutTitle || 'Rest Day',
                Boolean(day.isRestDay),
                day.estimatedDurationMin || 0,
                Boolean(day.completed),
                day.completedAt ? new Date(day.completedAt) : null,
                now,
              ]
            );
          }
        }
      }

      // 4. Sync New Workouts
      if (Array.isArray(newWorkouts)) {
        for (const w of newWorkouts) {
          const workoutId = w.id || `w_${crypto.randomUUID()}`;
          await client.query(
            `INSERT INTO "workout_logs" ("id", "userId", "title", "durationMin", "calories", "category", "time", "loggedAt")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT ("id") DO NOTHING`,
            [
              workoutId,
              userId,
              w.title,
              w.durationMin || 0,
              w.calories || 0,
              w.category || 'Exercise',
              w.time || '12:00 PM',
              now,
            ]
          );
        }
      }

      // 5. Sync Notifications read status
      if (Array.isArray(updatedNotifications)) {
        for (const n of updatedNotifications) {
          if (n.id) {
            await client.query(
              `UPDATE "notifications" SET "unread" = $1 WHERE "id" = $2 AND "userId" = $3`,
              [Boolean(n.unread), n.id, userId]
            );
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'State synced successfully.',
      timestamp: now.toISOString(),
    });
  } catch (error: any) {
    console.error('[API /sync POST] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync offline changes.' },
      { status: 500 }
    );
  }
}
