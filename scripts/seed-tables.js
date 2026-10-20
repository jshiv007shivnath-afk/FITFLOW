const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function main() {
  console.log('Seeding initial state for all tables...');

  // Ensure default athlete exists
  await pool.query(`
    INSERT INTO "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
    VALUES 
      ('user_default_athlete', 'Athlete', 'athlete@fitflow.app', true, NOW() - INTERVAL '15 days', NOW()),
      ('usr_sarah_connor', 'Sarah Connor', 'sarah.c@fitflow.app', true, NOW() - INTERVAL '12 days', NOW()),
      ('usr_marcus_vance', 'Marcus Vance', 'marcus.v@fitflow.app', true, NOW() - INTERVAL '8 days', NOW()),
      ('usr_priya_sharma', 'Priya Sharma', 'priya.s@fitflow.app', true, NOW() - INTERVAL '5 days', NOW()),
      ('usr_david_kim', 'David Kim', 'david.k@fitflow.app', true, NOW() - INTERVAL '2 days', NOW())
    ON CONFLICT ("email") DO NOTHING;

    INSERT INTO profiles ("id", "userId", "membership", "level", "xp", "streakDays", "weightKg", "createdAt", "updatedAt")
    VALUES 
      ('prof_default_athlete', 'user_default_athlete', 'Free', 2, 240, 3, 71.0, NOW(), NOW()),
      ('prof_sarah_connor', 'usr_sarah_connor', 'Pro', 5, 410, 14, 64.5, NOW(), NOW()),
      ('prof_marcus_vance', 'usr_marcus_vance', 'Pro', 4, 180, 9, 82.0, NOW(), NOW()),
      ('prof_priya_sharma', 'usr_priya_sharma', 'Free', 3, 320, 5, 58.0, NOW(), NOW()),
      ('prof_david_kim', 'usr_david_kim', 'Pro', 1, 90, 2, 76.5, NOW(), NOW())
    ON CONFLICT ("userId") DO NOTHING;

    INSERT INTO user_goals ("id", "userId", "calorieTarget", "waterTargetMl", "exerciseTargetMin", "createdAt", "updatedAt")
    VALUES 
      ('goal_default_athlete', 'user_default_athlete', 700, 2500, 45, NOW(), NOW()),
      ('goal_sarah_connor', 'usr_sarah_connor', 850, 3000, 60, NOW(), NOW()),
      ('goal_marcus_vance', 'usr_marcus_vance', 950, 3500, 75, NOW(), NOW()),
      ('goal_priya_sharma', 'usr_priya_sharma', 600, 2200, 40, NOW(), NOW()),
      ('goal_david_kim', 'usr_david_kim', 750, 2800, 50, NOW(), NOW())
    ON CONFLICT ("userId") DO NOTHING;

    INSERT INTO workout_logs ("id", "userId", "title", "durationMin", "calories", "category", "time", "loggedAt")
    VALUES 
      ('wk_sample_1', 'usr_sarah_connor', 'Morning HIIT Blast', 45, 420, 'HIIT', '07:30 AM', NOW() - INTERVAL '2 hours'),
      ('wk_sample_2', 'usr_marcus_vance', 'Heavy Deadlifts & Core', 60, 580, 'Strength', '08:15 AM', NOW() - INTERVAL '1 hour'),
      ('wk_sample_3', 'usr_priya_sharma', 'Sunrise Power Vinyasa', 40, 260, 'Yoga', '06:45 AM', NOW() - INTERVAL '4 hours'),
      ('wk_sample_4', 'user_default_athlete', 'Outdoor 5K Tempo Run', 28, 340, 'Running', '09:00 AM', NOW() - INTERVAL '30 minutes'),
      ('wk_sample_5', 'usr_david_kim', 'Chest & Triceps Hypertrophy', 50, 460, 'Strength', '10:00 AM', NOW() - INTERVAL '15 minutes')
    ON CONFLICT ("id") DO NOTHING;
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
