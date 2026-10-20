import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { validateGoalsInput } from '@/lib/security';

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
      `SELECT "calorieTarget", "waterTargetMl", "exerciseTargetMin"
       FROM "user_goals"
       WHERE "userId" = $1
       LIMIT 1`,
      [userId]
    );

    if (res.rows.length === 0) {
      // Return sensible defaults if not yet created
      return NextResponse.json({
        success: true,
        goals: {
          calorieTarget: 650,
          waterTargetMl: 2500,
          exerciseTargetMin: 60,
        },
      });
    }

    return NextResponse.json({
      success: true,
      goals: res.rows[0],
    });
  } catch (error: any) {
    console.error('[API /goals GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve goals.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
    const validation = validateGoalsInput(body);

    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { calorieTarget, waterTargetMl, exerciseTargetMin } = validation;
    const now = new Date();

    const upsertRes = await query(
      `INSERT INTO "user_goals" ("id", "userId", "calorieTarget", "waterTargetMl", "exerciseTargetMin", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $6)
       ON CONFLICT ("userId")
       DO UPDATE SET
         "calorieTarget" = EXCLUDED."calorieTarget",
         "waterTargetMl" = EXCLUDED."waterTargetMl",
         "exerciseTargetMin" = EXCLUDED."exerciseTargetMin",
         "updatedAt" = EXCLUDED."updatedAt"
       RETURNING "calorieTarget", "waterTargetMl", "exerciseTargetMin"`,
      [`goal_${userId}`, userId, calorieTarget, waterTargetMl, exerciseTargetMin, now]
    );

    return NextResponse.json({
      success: true,
      message: 'Goals updated successfully.',
      goals: upsertRes.rows[0],
    });
  } catch (error: any) {
    console.error('[API /goals POST] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update goals.' },
      { status: 500 }
    );
  }
}
