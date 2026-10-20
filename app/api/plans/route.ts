import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId } from '@/lib/auth-session';
import { query, withTransaction } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    const plansRes = await query(
      `SELECT "id", "weekId", "weekLabel", "weekNumber", "hasDecidedNewWeek", "createdAt", "updatedAt"
       FROM "weekly_plans"
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC
       LIMIT 1`,
      [userId]
    );

    if (plansRes.rows.length === 0) {
      return NextResponse.json({
        success: true,
        plan: null,
      });
    }

    const plan = plansRes.rows[0];
    const daysRes = await query(
      `SELECT "id", "dayKey", "dayName", "shortDate", "workoutTitle", "isRestDay", "estimatedDurationMin", "completed", "completedAt"
       FROM "plan_days"
       WHERE "weeklyPlanId" = $1
       ORDER BY "createdAt" ASC`,
      [plan.id]
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

    return NextResponse.json({
      success: true,
      plan: {
        ...plan,
        days,
      },
    });
  } catch (error: any) {
    console.error('[API /plans GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve weekly plan.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    const body = await req.json().catch(() => ({}));
    const { weekId, weekLabel, weekNumber, days } = body;

    if (!weekId || !Array.isArray(days)) {
      return NextResponse.json(
        { success: false, error: 'Invalid weekly plan data provided.' },
        { status: 400 }
      );
    }

    const now = new Date();

    await withTransaction(async (client) => {
      // 1. Upsert Weekly Plan
      const planRes = await client.query(
        `INSERT INTO "weekly_plans" ("id", "userId", "weekId", "weekLabel", "weekNumber", "hasDecidedNewWeek", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, TRUE, $6, $6)
         ON CONFLICT ("userId", "weekId")
         DO UPDATE SET
           "weekLabel" = EXCLUDED."weekLabel",
           "weekNumber" = EXCLUDED."weekNumber",
           "updatedAt" = EXCLUDED."updatedAt"
         RETURNING "id"`,
        [`plan_${userId}_${weekId}`, userId, weekId, weekLabel || 'Current Week', weekNumber || 1, now]
      );

      const planDbId = planRes.rows[0].id;

      // 2. Clear old days for this plan
      await client.query(`DELETE FROM "plan_days" WHERE "weeklyPlanId" = $1`, [planDbId]);

      // 3. Insert each day and its exercises
      for (const day of days) {
        const dayDbId = `day_${randomUUID()}`;
        await client.query(
          `INSERT INTO "plan_days" ("id", "weeklyPlanId", "dayKey", "dayName", "shortDate", "workoutTitle", "isRestDay", "estimatedDurationMin", "completed", "completedAt", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11)`,
          [
            dayDbId,
            planDbId,
            day.dayKey,
            day.dayName,
            day.shortDate,
            day.workoutTitle || 'Rest Day',
            Boolean(day.isRestDay),
            Number(day.estimatedDurationMin) || 0,
            Boolean(day.completed),
            day.completedAt ? new Date(day.completedAt) : null,
            now,
          ]
        );

        if (Array.isArray(day.exercises)) {
          for (let i = 0; i < day.exercises.length; i++) {
            const ex = day.exercises[i];
            await client.query(
              `INSERT INTO "plan_exercises" ("id", "planDayId", "name", "targetType", "sets", "reps", "durationSeconds", "distanceKm", "restIntervalSec", "orderIndex")
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
              [
                `ex_${randomUUID()}`,
                dayDbId,
                ex.name,
                ex.targetType || 'reps',
                Number(ex.sets) || 3,
                typeof ex.reps === 'number' ? ex.reps : null,
                typeof ex.durationSeconds === 'number' ? ex.durationSeconds : null,
                typeof ex.distanceKm === 'number' ? ex.distanceKm : null,
                Number(ex.restIntervalSec) || 60,
                i,
              ]
            );
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Weekly plan saved successfully.',
    });
  } catch (error: any) {
    console.error('[API /plans POST] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save weekly plan.' },
      { status: 500 }
    );
  }
}
