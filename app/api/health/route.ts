import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  let dbStatus = 'disconnected';
  let dbError = null;

  try {
    const res = await query('SELECT NOW() as current_time, version()');
    if (res.rows.length > 0) {
      dbStatus = 'connected';
    }
  } catch (err: any) {
    dbError = err?.message || 'Database connection unreachable';
  }

  return NextResponse.json({
    status: dbStatus === 'connected' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      port: 54322,
      error: dbError,
    },
    services: {
      auth: 'Better Auth (Standalone)',
      otpEngine: 'Nodemailer/SMTP',
      syncEngine: 'PostgreSQL Realtime Sync',
    },
  });
}
