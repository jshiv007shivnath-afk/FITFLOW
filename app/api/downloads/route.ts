import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawPlatform = typeof body.platform === 'string' ? body.platform.slice(0, 50) : 'web';
    const rawSource = typeof body.source === 'string' ? body.source.slice(0, 100) : 'landing_download';
    const userEmail = typeof body.user_email === 'string' ? body.user_email.slice(0, 255) : null;
    const userId = typeof body.user_id === 'string' ? body.user_id.slice(0, 100) : null;

    const userAgent = (req.headers.get('user-agent') || 'unknown').slice(0, 500);
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim().slice(0, 45) : '127.0.0.1';

    const insertSql = `
      INSERT INTO public.downloads (user_id, user_email, platform, source, user_agent, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, created_at;
    `;

    const res = await query(insertSql, [userId, userEmail, rawPlatform, rawSource, userAgent, ipAddress]);
    const inserted = res.rows[0];

    return NextResponse.json({
      success: true,
      id: inserted.id,
      created_at: inserted.created_at,
      message: 'Download event recorded successfully',
    });
  } catch (err: any) {
    console.error('Error tracking download:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const countRes = await query(`SELECT COUNT(*)::int as total FROM public.downloads;`);
    const total = countRes.rows[0]?.total || 0;

    const bySourceRes = await query(`
      SELECT source, COUNT(*)::int as count 
      FROM public.downloads 
      GROUP BY source 
      ORDER BY count DESC;
    `);

    const byPlatformRes = await query(`
      SELECT platform, COUNT(*)::int as count 
      FROM public.downloads 
      GROUP BY platform 
      ORDER BY count DESC;
    `);

    // Public analytics summary hides raw IP addresses and user emails for privacy defense
    const recentRes = await query(`
      SELECT id, platform, source, created_at
      FROM public.downloads 
      ORDER BY created_at DESC 
      LIMIT 20;
    `);

    return NextResponse.json({
      success: true,
      totalDownloads: total,
      bySource: bySourceRes.rows,
      byPlatform: byPlatformRes.rows,
      recent: recentRes.rows,
    });
  } catch (err: any) {
    console.error('Error fetching downloads:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
