import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryEmail = searchParams.get('email');
    const headerEmail = req.headers.get('x-user-email');
    const email = (queryEmail || headerEmail || '').trim().toLowerCase();

    const authHeader = req.headers.get('authorization');
    const cookieToken =
      req.cookies.get('better-auth.session_token')?.value ||
      req.cookies.get('session_token')?.value;
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.replace('Bearer ', '').trim()
        : cookieToken;

    let sessionUserId: string | null = null;
    if (token) {
      try {
        const sessRes = await query(
          `SELECT "userId" FROM "session" WHERE "token" = $1 AND "expiresAt" > NOW() LIMIT 1`,
          [token]
        );
        if (sessRes.rows.length > 0) {
          sessionUserId = sessRes.rows[0].userId;
        }
      } catch {}
    }

    // 1. Check if email or userId is registered in "deleted_accounts"
    if (email) {
      const delCheck = await query(
        `SELECT "userId", "email", "status" FROM "deleted_accounts" WHERE LOWER("email") = $1 LIMIT 1`,
        [email]
      );
      if (delCheck.rows.length > 0) {
        return NextResponse.json(
          {
            success: false,
            banned: true,
            accountBanned: true,
            error: 'Your ID is ban',
          },
          { status: 403 }
        );
      }
    }

    if (sessionUserId) {
      const delCheckUser = await query(
        `SELECT "userId", "email", "status" FROM "deleted_accounts" WHERE "userId" = $1 LIMIT 1`,
        [sessionUserId]
      );
      if (delCheckUser.rows.length > 0) {
        return NextResponse.json(
          {
            success: false,
            banned: true,
            accountBanned: true,
            error: 'Your ID is ban',
          },
          { status: 403 }
        );
      }
    }

    // 2. Check if a previously logged-in custom user was completely removed from "user" table
    if (email && email !== 'athlete@fitflow.app') {
      const userRes = await query(
        `SELECT "id" FROM "user" WHERE LOWER("email") = $1 LIMIT 1`,
        [email]
      );
      if (userRes.rows.length === 0) {
        // Row was deleted from Studio!
        return NextResponse.json(
          {
            success: false,
            banned: true,
            accountBanned: true,
            error: 'Your ID is ban',
          },
          { status: 403 }
        );
      }
    }

    if (sessionUserId && sessionUserId !== 'user_default_athlete') {
      const userRes = await query(
        `SELECT "id" FROM "user" WHERE "id" = $1 LIMIT 1`,
        [sessionUserId]
      );
      if (userRes.rows.length === 0) {
        // Row was deleted from Studio!
        return NextResponse.json(
          {
            success: false,
            banned: true,
            accountBanned: true,
            error: 'Your ID is ban',
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ success: true, banned: false });
  } catch (error: any) {
    console.error('[API /auth/status] Error checking ban status:', error);
    return NextResponse.json({ success: true, banned: false });
  }
}
