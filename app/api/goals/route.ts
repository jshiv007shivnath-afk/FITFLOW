import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId } from '@/lib/auth-session';
import { query } from '@/lib/db';
import { validateGoalsInput } from '@/lib/security';

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    const res = await query(
      `SELECT "calorieTarget", "waterTargetMl", "exerciseTargetMin"
       FROM "user"
       WHERE "id" = $1
       LIMIT 1`,
      [userId]
    );

    if (res.rows.length === 0 || res.rows[0].calorieTarget == null) {
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
    const userId = await getAuthenticatedUserId(req);
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
      `UPDATE "user"
       SET
         "calorieTarget" = $1,
         "waterTargetMl" = $2,
         "exerciseTargetMin" = $3,
         "updatedAt" = $4
       WHERE "id" = $5
       RETURNING "calorieTarget", "waterTargetMl", "exerciseTargetMin"`,
      [calorieTarget, waterTargetMl, exerciseTargetMin, now, userId]
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
