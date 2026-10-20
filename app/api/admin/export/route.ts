import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        COALESCE(p.membership, 'Free') as membership,
        COALESCE(p.level, 1) as level,
        COALESCE(p.xp, 0) as xp,
        COALESCE(p."streakDays", 0) as streak_days,
        COALESCE(p."weightKg", 68.5) as weight_kg,
        COALESCE(g."calorieTarget", 650) as target_calories,
        COUNT(DISTINCT w.id) as total_workouts,
        COALESCE(SUM(w.calories), 0) as total_calories_burned,
        u."createdAt" as joined_at
      FROM "user" u
      LEFT JOIN profiles p ON p."userId" = u.id
      LEFT JOIN user_goals g ON g."userId" = u.id
      LEFT JOIN workout_logs w ON w."userId" = u.id
      GROUP BY u.id, u.name, u.email, p.membership, p.level, p.xp, p."streakDays", p."weightKg", g."calorieTarget", u."createdAt"
      ORDER BY u."createdAt" DESC;
    `);

    const headers = [
      'User ID',
      'Name',
      'Email',
      'Tier',
      'Level',
      'XP',
      'Streak Days',
      'Weight (kg)',
      'Daily Calorie Target',
      'Total Workouts',
      'Total Calories Burned',
      'Joined Date',
    ];

    const rows = res.rows.map(r => [
      `"${r.id}"`,
      `"${r.name || ''}"`,
      `"${r.email || ''}"`,
      `"${r.membership}"`,
      r.level,
      r.xp,
      r.streak_days,
      r.weight_kg,
      r.target_calories,
      r.total_workouts,
      r.total_calories_burned,
      `"${new Date(r.joined_at).toISOString()}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="fitflow_athletes_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('[API /admin/export] Error:', error);
    return NextResponse.json({ success: false, error: 'Export failed' }, { status: 500 });
  }
}
