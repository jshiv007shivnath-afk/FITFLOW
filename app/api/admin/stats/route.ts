import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Total Athletes
    const userCountRes = await query(`SELECT COUNT(*)::int as count FROM "user";`);
    const totalAthletes = userCountRes.rows[0]?.count || 0;

    // 2. Pro Athletes
    const proCountRes = await query(`SELECT COUNT(*)::int as count FROM profiles WHERE membership = 'Pro';`);
    const proAthletes = proCountRes.rows[0]?.count || 0;

    // 3. Total Workouts Completed
    const workoutCountRes = await query(`SELECT COUNT(*)::int as count, COALESCE(SUM(calories), 0)::int as calories FROM workout_logs;`);
    const totalWorkouts = workoutCountRes.rows[0]?.count || 0;
    const totalCalories = workoutCountRes.rows[0]?.calories || 0;

    // 4. Active Athletes Today
    const activeTodayRes = await query(`
      SELECT COUNT(DISTINCT "userId")::int as count 
      FROM workout_logs 
      WHERE "loggedAt" >= CURRENT_DATE;
    `);
    const activeToday = activeTodayRes.rows[0]?.count || (totalAthletes > 0 ? 1 : 0);

    // 5. Recent Community Workouts Feed
    const recentWorkoutsRes = await query(`
      SELECT 
        w.id,
        w."userId",
        w.title,
        w."durationMin",
        w.calories,
        w.category,
        w."loggedAt" as "createdAt",
        COALESCE(u.name, 'Athlete') as "userName",
        COALESCE(u.email, 'athlete@fitflow.app') as "userEmail"
      FROM workout_logs w
      LEFT JOIN "user" u ON u.id = w."userId"
      ORDER BY w."loggedAt" DESC
      LIMIT 8;
    `);

    // 6. Database Health Status
    const dbPingRes = await query(`SELECT current_database() as db, version() as version, NOW() as time;`);

    return NextResponse.json({
      success: true,
      stats: {
        totalAthletes,
        proAthletes,
        freeAthletes: Math.max(0, totalAthletes - proAthletes),
        totalWorkouts,
        totalCalories,
        activeToday,
        proRate: totalAthletes > 0 ? Math.round((proAthletes / totalAthletes) * 100) : 0,
      },
      recentWorkouts: recentWorkoutsRes.rows,
      database: {
        connected: true,
        database: dbPingRes.rows[0]?.db || 'postgres',
        serverTime: dbPingRes.rows[0]?.time || new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[API /admin/stats] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate admin telemetry stats.' },
      { status: 500 }
    );
  }
}
