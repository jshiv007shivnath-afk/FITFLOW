import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    // 1. User & Profile & Goals
    const userRes = await query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u."emailVerified",
        u."createdAt" as "joinedAt",
        p.membership, 
        COALESCE(p.level, 1)::int as level, 
        COALESCE(p.xp, 0)::int as xp, 
        COALESCE(p."streakDays", 0)::int as "streakDays", 
        COALESCE(p."weightKg", 68.5)::numeric as "weightKg",
        p."avatarUrl",
        COALESCE(g."calorieTarget", 650)::int as "calorieTarget",
        COALESCE(g."waterTargetMl", 2500)::int as "waterTargetMl",
        COALESCE(g."exerciseTargetMin", 60)::int as "exerciseTargetMin"
      FROM "user" u
      LEFT JOIN profiles p ON p."userId" = u.id
      LEFT JOIN user_goals g ON g."userId" = u.id
      WHERE u.id = $1;
    `, [userId]);

    if (userRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Athlete not found' }, { status: 404 });
    }

    // 2. All Workouts
    const workoutsRes = await query(`
      SELECT id, title, "durationMin", calories, category, "loggedAt" as "createdAt"
      FROM workout_logs
      WHERE "userId" = $1
      ORDER BY "loggedAt" DESC
      LIMIT 30;
    `, [userId]);

    // 3. Today's Metrics
    const metricsRes = await query(`
      SELECT *
      FROM daily_metrics
      WHERE "userId" = $1
      ORDER BY date DESC
      LIMIT 7;
    `, [userId]);

    return NextResponse.json({
      success: true,
      athlete: userRes.rows[0],
      workouts: workoutsRes.rows,
      metrics: metricsRes.rows,
    });
  } catch (error: any) {
    console.error('[API /admin/user-detail] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve athlete dossier.' },
      { status: 500 }
    );
  }
}
