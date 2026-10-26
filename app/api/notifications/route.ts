import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId, UnauthorizedError } from '@/lib/auth-session';
import { query } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    const res = await query(
      `SELECT "id", "iconType", "title", "description", "unread", "createdAt" as "timestamp"
       FROM "notifications"
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC
       LIMIT 30`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      notifications: res.rows,
    });
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    console.error('[API /notifications GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve notifications.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    const body = await req.json().catch(() => ({}));
    const { notificationId, markAllRead } = body;

    if (markAllRead) {
      await query(
        `UPDATE "notifications" SET "unread" = FALSE WHERE "userId" = $1`,
        [userId]
      );
    } else if (notificationId) {
      await query(
        `UPDATE "notifications" SET "unread" = FALSE WHERE "id" = $1 AND "userId" = $2`,
        [notificationId, userId]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notification status updated.',
    });
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    console.error('[API /notifications PATCH] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notification.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    const body = await req.json().catch(() => ({}));
    const { iconType, title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required.' },
        { status: 400 }
      );
    }

    const id = `notif_${randomUUID()}`;
    const now = new Date();

    const res = await query(
      `INSERT INTO "notifications" ("id", "userId", "iconType", "title", "description", "unread", "createdAt")
       VALUES ($1, $2, $3, $4, $5, TRUE, $6)
       RETURNING "id", "iconType", "title", "description", "unread", "createdAt" as "timestamp"`,
      [id, userId, iconType || 'goal', title, description, now]
    );

    return NextResponse.json({
      success: true,
      notification: res.rows[0],
    });
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    console.error('[API /notifications POST] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create notification.' },
      { status: 500 }
    );
  }
}

