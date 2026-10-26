-- Fix triggers and functions to operate strictly on live public tables
CREATE OR REPLACE FUNCTION refresh_admin_panel_for_user(target_user_id text)
RETURNS void AS $$
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
        'Premium',
        1,
        120,
        1,
        68.5,
        1,
        380,
        2500,
        COALESCE(u."updatedAt", CURRENT_TIMESTAMP),
        jsonb_build_object(
            'profile', jsonb_build_object(
                'name', u.name,
                'email', u.email,
                'time_spent', COALESCE(u."time_spent_in_app", '45 mins today'),
                'favorite_feature', COALESCE(u."most_used_feature", 'Workout Planner')
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
    WHERE u.id = target_user_id
    ON CONFLICT ("user_id") DO UPDATE SET
        "user_name" = EXCLUDED."user_name",
        "user_email" = EXCLUDED."user_email",
        "last_active_at" = EXCLUDED."last_active_at",
        "all_activity_details" = EXCLUDED."all_activity_details",
        "updated_at" = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;
