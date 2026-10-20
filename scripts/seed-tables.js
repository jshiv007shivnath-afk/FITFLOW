const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function main() {
  console.log('Seeding initial state for all tables...');

  // Ensure daily_metrics has a row for user_default_athlete
  await pool.query(`
    INSERT INTO daily_metrics ("id", "userId", "date", "caloriesBurned", "waterIntakeMl", "exerciseMinutes", "sleepHours", "steps", "updatedAt")
    VALUES ('dm_today_user_default_athlete', 'user_default_athlete', CURRENT_DATE, 420, 2000, 45, 7.5, 6800, NOW())
    ON CONFLICT ("userId", "date") DO NOTHING;
  `);

  // Ensure account has a row for user_default_athlete
  await pool.query(`
    INSERT INTO account ("id", "accountId", "providerId", "userId", "createdAt", "updatedAt")
    VALUES ('acc_user_default_athlete', 'athlete@fitflow.app', 'email', 'user_default_athlete', NOW(), NOW())
    ON CONFLICT DO NOTHING;
  `);

  // Query counts for all 12 tables
  const res = await pool.query(`
    SELECT 'user' as tbl, count(*) from public.user UNION ALL
    SELECT 'session', count(*) from public.session UNION ALL
    SELECT 'account', count(*) from public.account UNION ALL
    SELECT 'verification', count(*) from public.verification UNION ALL
    SELECT 'profiles', count(*) from public.profiles UNION ALL
    SELECT 'user_goals', count(*) from public.user_goals UNION ALL
    SELECT 'weekly_plans', count(*) from public.weekly_plans UNION ALL
    SELECT 'plan_days', count(*) from public.plan_days UNION ALL
    SELECT 'plan_exercises', count(*) from public.plan_exercises UNION ALL
    SELECT 'workout_logs', count(*) from public.workout_logs UNION ALL
    SELECT 'daily_metrics', count(*) from public.daily_metrics UNION ALL
    SELECT 'notifications', count(*) from public.notifications;
  `);

  console.table(res.rows);
  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
