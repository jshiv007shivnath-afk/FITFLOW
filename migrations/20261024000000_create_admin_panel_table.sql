-- ==============================================================================
-- Migration: Create admin_panel Table for Supabase Table Editor
-- Version: 20261024000000
-- Description: Provides an admin overview of all users, their health stats, 
-- and detailed activity JSON directly in Supabase Studio Table Editor.
-- ==============================================================================

-- 1. Create admin_panel Table
CREATE TABLE IF NOT EXISTS "admin_panel" (
    "user_id" TEXT PRIMARY KEY REFERENCES "user"("id") ON DELETE CASCADE,
    "user_name" TEXT NOT NULL DEFAULT 'Athlete',
    "user_email" TEXT NOT NULL,
    "membership" TEXT NOT NULL DEFAULT 'Free',
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "streak_days" INTEGER NOT NULL DEFAULT 0,
    "weight_kg" NUMERIC(5, 2) DEFAULT 68.5,
    "total_workouts" INTEGER NOT NULL DEFAULT 0,
    "total_calories_burned" INTEGER NOT NULL DEFAULT 0,
    "water_intake_ml" INTEGER NOT NULL DEFAULT 0,
    "last_active_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "all_activity_details" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "admin_panel_user_email_idx" ON "admin_panel" ("user_email");

-- 2. Function to compute and upsert user health & activity details
CREATE OR REPLACE FUNCTION refresh_admin_panel_for_user(target_user_id TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO "admin_panel" (
        "user_id",
        "user_name",
        "user_email",
        "membership",
        "level",
        "xp",
        "streak_days",
        "weight_kg",
        "total_workouts",
        "total_calories_burned",
        "water_intake_ml",
        "last_active_at",
        "all_activity_details",
        "updated_at"
    )
    SELECT
        u.id,
        COALESCE(u.name, 'Athlete'),
        u.email,
        COALESCE(p.membership, 'Free'),
        COALESCE(p.level, 1),
        COALESCE(p.xp, 0),
        COALESCE(p."streakDays", 0),
        COALESCE(p."weightKg", 68.5),
        (SELECT COUNT(*)::int FROM workout_logs w WHERE w."userId" = u.id),
        (SELECT COALESCE(SUM(w.calories), 0)::int FROM workout_logs w WHERE w."userId" = u.id),
        (SELECT COALESCE(SUM(d."waterIntakeMl"), 0)::int FROM daily_metrics d WHERE d."userId" = u.id),
        COALESCE(u."updatedAt", CURRENT_TIMESTAMP),
        jsonb_build_object(
            'profile', jsonb_build_object(
                'name', u.name,
                'email', u.email,
                'membership', COALESCE(p.membership, 'Free'),
                'level', COALESCE(p.level, 1),
                'xp', COALESCE(p.xp, 0),
                'streak_days', COALESCE(p."streakDays", 0),
                'weight_kg', COALESCE(p."weightKg", 68.5)
            ),
            'goals', (
                SELECT jsonb_build_object(
                    'calorie_target', g."calorieTarget",
                    'water_target_ml', g."waterTargetMl",
                    'exercise_target_min', g."exerciseTargetMin"
                )
                FROM user_goals g WHERE g."userId" = u.id LIMIT 1
            ),
            'recent_workouts', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', w.id,
                    'title', w.title,
                    'duration_min', w."durationMin",
                    'calories', w.calories,
                    'category', w.category,
                    'time', w.time,
                    'logged_at', w."loggedAt"
                ) ORDER BY w."loggedAt" DESC), '[]'::jsonb)
                FROM (
                    SELECT * FROM workout_logs WHERE "userId" = u.id ORDER BY "loggedAt" DESC LIMIT 10
                ) w
            ),
            'weekly_schedule', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'day', pd."dayName",
                    'date', pd."shortDate",
                    'workout', pd."workoutTitle",
                    'completed', pd.completed
                ) ORDER BY pd."createdAt" ASC), '[]'::jsonb)
                FROM plan_days pd
                JOIN weekly_plans wp ON wp.id = pd."weeklyPlanId"
                WHERE wp."userId" = u.id
            ),
            'notifications', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'title', n.title,
                    'description', n.description,
                    'unread', n.unread,
                    'created_at', n."createdAt"
                ) ORDER BY n."createdAt" DESC), '[]'::jsonb)
                FROM (
                    SELECT * FROM notifications WHERE "userId" = u.id ORDER BY "createdAt" DESC LIMIT 5
                ) n
            )
        ),
        CURRENT_TIMESTAMP
    FROM "user" u
    LEFT JOIN profiles p ON p."userId" = u.id
    WHERE u.id = target_user_id
    ON CONFLICT ("user_id") DO UPDATE SET
        "user_name" = EXCLUDED."user_name",
        "user_email" = EXCLUDED."user_email",
        "membership" = EXCLUDED."membership",
        "level" = EXCLUDED."level",
        "xp" = EXCLUDED."xp",
        "streak_days" = EXCLUDED."streak_days",
        "weight_kg" = EXCLUDED."weight_kg",
        "total_workouts" = EXCLUDED."total_workouts",
        "total_calories_burned" = EXCLUDED."total_calories_burned",
        "water_intake_ml" = EXCLUDED."water_intake_ml",
        "last_active_at" = EXCLUDED."last_active_at",
        "all_activity_details" = EXCLUDED."all_activity_details",
        "updated_at" = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger Function to automatically keep admin_panel synchronized
CREATE OR REPLACE FUNCTION trigger_sync_admin_panel()
RETURNS TRIGGER AS $$
DECLARE
    uid TEXT;
BEGIN
    IF TG_TABLE_NAME = 'user' THEN
        uid := NEW.id;
    ELSIF TG_TABLE_NAME = 'profiles' OR TG_TABLE_NAME = 'user_goals' OR TG_TABLE_NAME = 'workout_logs' OR TG_TABLE_NAME = 'daily_metrics' THEN
        uid := NEW."userId";
    END IF;

    IF uid IS NOT NULL THEN
        PERFORM refresh_admin_panel_for_user(uid);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Attach Triggers to Core Tables
DROP TRIGGER IF EXISTS trg_user_admin_sync ON "user";
CREATE TRIGGER trg_user_admin_sync
AFTER INSERT OR UPDATE ON "user"
FOR EACH ROW EXECUTE FUNCTION trigger_sync_admin_panel();

DROP TRIGGER IF EXISTS trg_profiles_admin_sync ON profiles;
CREATE TRIGGER trg_profiles_admin_sync
AFTER INSERT OR UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION trigger_sync_admin_panel();

DROP TRIGGER IF EXISTS trg_workout_admin_sync ON workout_logs;
CREATE TRIGGER trg_workout_admin_sync
AFTER INSERT OR UPDATE ON workout_logs
FOR EACH ROW EXECUTE FUNCTION trigger_sync_admin_panel();

-- 5. Seed all existing users into admin_panel immediately
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT id FROM "user" LOOP
        PERFORM refresh_admin_panel_for_user(r.id);
    END LOOP;
END;
$$;

-- 6. Enable Supabase Realtime Replication on admin_panel
ALTER PUBLICATION supabase_realtime ADD TABLE "admin_panel";
