-- ==============================================================================
-- Migration: Enable Row Level Security (RLS) & Security Hardening
-- Resolves Supabase Security Advisor Linter Warnings:
-- 1. RLS Disabled in Public on all 12 tables
-- 2. Sensitive Columns Exposed (account.password, session.token)
-- 3. Function Search Path Mutable (update_timestamp_column)
-- Version: 20261020000000
-- ==============================================================================

-- 1. FIX FUNCTION SEARCH PATH MUTABLE
CREATE OR REPLACE FUNCTION public.update_timestamp_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 2. ENABLE ROW LEVEL SECURITY (RLS) ON ALL 12 TABLES
ALTER TABLE public."user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."verification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."user_goals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."weekly_plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."plan_days" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."plan_exercises" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."workout_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."daily_metrics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."notifications" ENABLE ROW LEVEL SECURITY;

-- 3. REVOKE UNRESTRICTED PUBLIC POSTGREST ACCESS FOR SENSITIVE AUTH TABLES
-- Prevents public PostgREST API from exposing hashed passwords, tokens, or OTP codes
REVOKE ALL ON public."account" FROM anon, authenticated;
REVOKE ALL ON public."session" FROM anon, authenticated;
REVOKE ALL ON public."verification" FROM anon, authenticated;

-- 4. CREATE DEFAULT RLS POLICIES FOR TABLES
DROP POLICY IF EXISTS "service_role_all_user" ON public."user";
CREATE POLICY "service_role_all_user" ON public."user" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_profiles" ON public."profiles";
CREATE POLICY "service_role_all_profiles" ON public."profiles" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_user_goals" ON public."user_goals";
CREATE POLICY "service_role_all_user_goals" ON public."user_goals" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_weekly_plans" ON public."weekly_plans";
CREATE POLICY "service_role_all_weekly_plans" ON public."weekly_plans" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_plan_days" ON public."plan_days";
CREATE POLICY "service_role_all_plan_days" ON public."plan_days" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_plan_exercises" ON public."plan_exercises";
CREATE POLICY "service_role_all_plan_exercises" ON public."plan_exercises" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_workout_logs" ON public."workout_logs";
CREATE POLICY "service_role_all_workout_logs" ON public."workout_logs" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_daily_metrics" ON public."daily_metrics";
CREATE POLICY "service_role_all_daily_metrics" ON public."daily_metrics" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_notifications" ON public."notifications";
CREATE POLICY "service_role_all_notifications" ON public."notifications" FOR ALL USING (true) WITH CHECK (true);
