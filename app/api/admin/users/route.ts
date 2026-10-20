import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').trim();
    const membership = (searchParams.get('membership') || '').trim();

    let sql = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u."createdAt" as "joinedAt",
        COALESCE(p.membership, 'Free') as membership, 
        COALESCE(p.level, 1)::int as level, 
        COALESCE(p.xp, 0)::int as xp, 
        COALESCE(p."streakDays", 0)::int as "streakDays", 
        COALESCE(p."weightKg", 68.5)::numeric as "weightKg",
        p."avatarUrl",
        COALESCE(g."calorieTarget", 650)::int as "calorieTarget",
        COALESCE(g."waterTargetMl", 2500)::int as "waterTargetMl",
        COALESCE(g."exerciseTargetMin", 60)::int as "exerciseTargetMin",
        COUNT(DISTINCT w.id)::int as "totalWorkouts",
        COALESCE(SUM(w.calories), 0)::int as "totalCaloriesBurned",
        MAX(w."loggedAt") as "lastActiveAt"
      FROM "user" u
      LEFT JOIN profiles p ON p."userId" = u.id
      LEFT JOIN user_goals g ON g."userId" = u.id
      LEFT JOIN workout_logs w ON w."userId" = u.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (u.name ILIKE $${params.length} OR u.email ILIKE $${params.length} OR u.id ILIKE $${params.length})`;
    }

    if (membership && membership !== 'All') {
      params.push(membership);
      sql += ` AND p.membership = $${params.length}`;
    }

    sql += `
      GROUP BY u.id, u.name, u.email, u."createdAt", p.membership, p.level, p.xp, p."streakDays", p."weightKg", p."avatarUrl", g."calorieTarget", g."waterTargetMl", g."exerciseTargetMin"
      ORDER BY u."createdAt" DESC
      LIMIT 100;
    `;

    const res = await query(sql, params);

    return NextResponse.json({
      success: true,
      athletes: res.rows,
      count: res.rows.length,
    });
  } catch (error: any) {
    console.error('[API /admin/users] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve athletes directory.' },
      { status: 500 }
    );
  }
}
