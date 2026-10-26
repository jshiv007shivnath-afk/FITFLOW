import { NextRequest } from 'next/server';
import { auth } from './auth';
import { query } from './db';

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized: Invalid or missing session') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export async function getAuthenticatedUserId(req: NextRequest): Promise<string> {
  // 1. Check Better Auth standard cookie session
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (session?.user?.id) {
      return session.user.id;
    }
  } catch {
    // ignore
  }

  // 2. Check Bearer token from header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    try {
      const sessionRes = await query(
        `SELECT "userId" FROM "session" WHERE "token" = $1 AND "expiresAt" > NOW() LIMIT 1`,
        [token]
      );
      if (sessionRes.rows.length > 0 && sessionRes.rows[0].userId) {
        return sessionRes.rows[0].userId;
      }
    } catch {
      // ignore
    }
  }

  // 3. Check better-auth.session_token cookie directly from database
  const cookieToken = req.cookies.get('better-auth.session_token')?.value;
  if (cookieToken) {
    try {
      const cookieRes = await query(
        `SELECT "userId" FROM "session" WHERE "token" = $1 AND "expiresAt" > NOW() LIMIT 1`,
        [cookieToken]
      );
      if (cookieRes.rows.length > 0 && cookieRes.rows[0].userId) {
        return cookieRes.rows[0].userId;
      }
    } catch {
      // ignore
    }
  }

  // 4. In development mode ONLY: provide default athlete user for seamless local testing
  if (process.env.NODE_ENV !== 'production') {
    const defaultUserId = 'user_default_athlete';
    try {
      await query(
        `INSERT INTO "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
         VALUES ($1, 'Athlete', 'athlete@fitflow.app', true, NOW(), NOW())
         ON CONFLICT ("id") DO NOTHING`,
        [defaultUserId]
      );
    } catch (err) {
      console.warn('[AuthSession] Failed to ensure default user:', err);
    }
    return defaultUserId;
  }

  // 5. In production: unauthenticated access is strictly forbidden (Cross-User / IDOR defense)
  throw new UnauthorizedError('Authentication required to access this resource.');
}

