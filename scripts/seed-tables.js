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

    INSERT INTO weekly_plans ("id", "userId", "weekId", "weekLabel", "weekNumber", "hasDecidedNewWeek", "createdAt", "updatedAt")
    VALUES 
      ('plan_seed_week43', 'user_default_athlete', '2026-W43', 'Oct 19 - Oct 25, 2026', 43, true, NOW(), NOW())
    ON CONFLICT ("userId", "weekId") DO NOTHING;

    INSERT INTO plan_days ("id", "weeklyPlanId", "dayKey", "dayName", "shortDate", "workoutTitle", "isRestDay", "estimatedDurationMin", "completed", "completedAt", "createdAt", "updatedAt")
    VALUES 
      ('pday_mon', 'plan_seed_week43', 'mon', 'Monday', 'Oct 19', 'Full Body Strength & Core', false, 50, true, NOW(), NOW(), NOW()),
      ('pday_tue', 'plan_seed_week43', 'tue', 'Tuesday', 'Oct 20', 'HIIT Cardio & Mobility', false, 35, false, null, NOW(), NOW()),
      ('pday_wed', 'plan_seed_week43', 'wed', 'Wednesday', 'Oct 21', 'Active Recovery & Stretching', true, 20, false, null, NOW(), NOW()),
      ('pday_thu', 'plan_seed_week43', 'thu', 'Thursday', 'Oct 22', 'Lower Body Hypertrophy', false, 45, false, null, NOW(), NOW()),
      ('pday_fri', 'plan_seed_week43', 'fri', 'Friday', 'Oct 23', 'Upper Body Push & Pull', false, 40, false, null, NOW(), NOW()),
      ('pday_sat', 'plan_seed_week43', 'sat', 'Saturday', 'Oct 24', 'Endurance Run & Core', false, 30, false, null, NOW(), NOW()),
      ('pday_sun', 'plan_seed_week43', 'sun', 'Sunday', 'Oct 25', 'Rest & Rejuvenation', true, 0, false, null, NOW(), NOW())
    ON CONFLICT ("id") DO NOTHING;

    INSERT INTO plan_exercises ("id", "planDayId", "name", "targetType", "sets", "reps", "durationSeconds", "distanceKm", "restIntervalSec", "orderIndex")
    VALUES 
      ('ex_mon_1', 'pday_mon', 'Barbell Back Squats', 'reps', 4, 10, null, null, 90, 0),
      ('ex_mon_2', 'pday_mon', 'Incline Dumbbell Press', 'reps', 3, 12, null, null, 60, 1),
      ('ex_mon_3', 'pday_mon', 'Romanian Deadlifts', 'reps', 3, 10, null, null, 75, 2),
      ('ex_mon_4', 'pday_mon', 'Plank Hold', 'duration', 3, null, 60, null, 45, 3),
      ('ex_tue_1', 'pday_tue', 'Kettlebell Swings', 'reps', 4, 20, null, null, 45, 0),
      ('ex_tue_2', 'pday_tue', 'Burpees Over Bar', 'reps', 3, 15, null, null, 60, 1),
      ('ex_tue_3', 'pday_tue', 'Box Jumps', 'reps', 3, 12, null, null, 45, 2),
      ('ex_thu_1', 'pday_thu', 'Goblet Squats', 'reps', 3, 12, null, null, 60, 0),
      ('ex_thu_2', 'pday_thu', 'Walking Dumbbell Lunges', 'reps', 3, 20, null, null, 60, 1),
      ('ex_fri_1', 'pday_fri', 'Push-ups to Failure', 'reps', 3, 15, null, null, 45, 0),
      ('ex_fri_2', 'pday_fri', 'Dumbbell Rows', 'reps', 3, 12, null, null, 60, 1),
      ('ex_sat_1', 'pday_sat', 'Tempo 5K Run', 'duration', 1, null, 1800, 5.0, 0, 0)
    ON CONFLICT ("id") DO NOTHING;
  `);

  // Ensure account has a row for user_default_athlete
  await pool.query(`
    INSERT INTO account ("id", "accountId", "providerId", "userId", "createdAt", "updatedAt")
    VALUES ('acc_user_default_athlete', 'athlete@fitflow.app', 'email', 'user_default_athlete', NOW(), NOW())
    ON CONFLICT DO NOTHING;
  `);

  // Sync all users to admin_panel
  await pool.query(`
    DO $$
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN SELECT id FROM "user" LOOP
            PERFORM refresh_admin_panel_for_user(r.id);
        END LOOP;
    END;
    $$;
  `);

  // Query counts for all 13 tables
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
    SELECT 'notifications', count(*) from public.notifications UNION ALL
    SELECT 'admin_panel', count(*) from public.admin_panel;
  `);

  console.table(res.rows);
  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
