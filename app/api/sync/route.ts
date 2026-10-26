import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId } from '@/lib/auth-session';
import { query, withTransaction } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);

    // 0. Enforce Banned Account Check
    const userEmailHeader = req.headers.get('x-user-email');
    if (userEmailHeader) {
      const delEmailCheck = await query(
        `SELECT "email" FROM "deleted_accounts" WHERE LOWER("email") = $1 LIMIT 1`,
        [userEmailHeader.toLowerCase().trim()]
      );
      if (delEmailCheck.rows.length > 0) {
        return NextResponse.json(
          { success: false, accountBanned: true, error: 'Your ID is ban' },
          { status: 403 }
        );
      }
    }

    if (userId && userId !== 'user_default_athlete') {
      const delUserCheck = await query(
        `SELECT "email" FROM "deleted_accounts" WHERE "userId" = $1 LIMIT 1`,
        [userId]
      );
      if (delUserCheck.rows.length > 0) {
        return NextResponse.json(
          { success: false, accountBanned: true, error: 'Your ID is ban' },
          { status: 403 }
        );
      }
    }

    // 1. Fetch Profile (from user table)
    const userProfileRes = await query(
      `SELECT "id", "name", "email"
       FROM "user"
       WHERE "id" = $1
       LIMIT 1`,
      [userId]
    );

    if (userId !== 'user_default_athlete' && userProfileRes.rows.length === 0) {
      // Row was deleted from Studio!
      return NextResponse.json(
        { success: false, accountBanned: true, error: 'Your ID is ban' },
        { status: 403 }
      );
    }

    // 2. Fetch Goals
    const goalsRes = await query(
      `SELECT "calorieTarget", "waterTargetMl", "exerciseTargetMin"
       FROM "user"
       WHERE "id" = $1
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

    // 4. Fetch Workout Logs (if table exists)
    let workoutLogs: any[] = [];
    try {
      const workoutsRes = await query(
        `SELECT "id", "title", "durationMin", "calories", "category", "time", "loggedAt"
         FROM "workout_logs"
         WHERE "userId" = $1
         ORDER BY "loggedAt" DESC
         LIMIT 50`,
        [userId]
      );
      workoutLogs = workoutsRes.rows;
    } catch {
      workoutLogs = [];
    }

    // 5. Fetch Notifications
    const notificationsRes = await query(
      `SELECT "id", "iconType", "title", "description", "unread", "createdAt" as timestamp
       FROM "notifications"
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC
       LIMIT 30`,
      [userId]
    );

    const userRow = userProfileRes.rows[0];
    const profileData = userRow
      ? {
          name: userRow.name,
          email: userRow.email,
          membership: 'Free',
          level: 1,
          xp: 0,
          streakDays: 0,
          weightKg: 68.5,
          avatarUrl: null,
        }
      : null;

    return NextResponse.json({
      success: true,
      data: {
        profile: profileData,
        goals: goalsRes.rows[0] || null,
        weeklyPlan: currentWeeklyPlan,
        previousWeeklyPlan,
        workoutLogs,
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
    const userId = await getAuthenticatedUserId(req);

    // 0. Enforce Banned Account Check
    const userEmailHeader = req.headers.get('x-user-email');
    if (userEmailHeader) {
      const delEmailCheck = await query(
        `SELECT "email" FROM "deleted_accounts" WHERE LOWER("email") = $1 LIMIT 1`,
        [userEmailHeader.toLowerCase().trim()]
      );
      if (delEmailCheck.rows.length > 0) {
        return NextResponse.json(
          { success: false, accountBanned: true, error: 'Your ID is ban' },
          { status: 403 }
        );
      }
    }

    if (userId && userId !== 'user_default_athlete') {
      const delUserCheck = await query(
        `SELECT "email" FROM "deleted_accounts" WHERE "userId" = $1 LIMIT 1`,
        [userId]
      );
      if (delUserCheck.rows.length > 0) {
        return NextResponse.json(
          { success: false, accountBanned: true, error: 'Your ID is ban' },
          { status: 403 }
        );
      }
    }

    const body = await req.json().catch(() => ({}));
    const { profile, goals, weeklyPlan, newWorkouts, updatedNotifications } = body;

    const now = new Date();

    await withTransaction(async (client) => {
      // 1. Sync Profile (Safe update to user table)
      if (profile && profile.name) {
        try {
          await client.query(
            `UPDATE "user"
             SET "name" = $1, "updatedAt" = $2
             WHERE "id" = $3`,
            [profile.name, now, userId]
          );
        } catch {}
      }

      // 2. Sync Goals
      if (goals) {
        await client.query(
          `UPDATE "user"
           SET
             "calorieTarget" = $1,
             "waterTargetMl" = $2,
             "exerciseTargetMin" = $3,
             "updatedAt" = $4
           WHERE "id" = $5`,
          [
            goals.calorieTarget || 650,
            goals.waterTargetMl || 2500,
            goals.exerciseTargetMin || 60,
            now,
            userId,
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

            // Sync exercises for this day
            await client.query(`DELETE FROM "plan_exercises" WHERE "planDayId" = $1`, [dayId]);

            if (Array.isArray(day.exercises) && day.exercises.length > 0) {
              for (let i = 0; i < day.exercises.length; i++) {
                const ex = day.exercises[i];
                const exId = ex.id || `ex_${dayId}_${i}`;
                await client.query(
                  `INSERT INTO "plan_exercises" ("id", "planDayId", "name", "targetType", "sets", "reps", "durationSeconds", "distanceKm", "restIntervalSec", "orderIndex")
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                  [
                    exId,
                    dayId,
                    ex.name || 'Exercise',
                    ex.targetType || 'reps',
                    Number(ex.sets) || 3,
                    typeof ex.reps === 'number' ? ex.reps : 10,
                    typeof ex.durationSeconds === 'number' ? ex.durationSeconds : null,
                    typeof ex.distanceKm === 'number' ? ex.distanceKm : null,
                    Number(ex.restIntervalSec) || 60,
                    i,
                  ]
                );
              }
            }
          }
        }
      }

      // 4. Sync New Workouts
      if (Array.isArray(newWorkouts)) {
        try {
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
        } catch {}
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
