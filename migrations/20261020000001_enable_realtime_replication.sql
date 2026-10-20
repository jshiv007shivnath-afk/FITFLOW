-- Enable Realtime Replication for FitFlow Tables in Supabase
-- This allows Supabase Studio and Realtime clients to receive live row changes instantly.

ALTER PUBLICATION supabase_realtime ADD TABLE 
  public."user",
  public.session,
  public.account,
  public.profiles,
  public.user_goals,
  public.weekly_plans,
  public.plan_days,
  public.plan_exercises,
  public.workout_logs,
  public.daily_metrics,
  public.notifications;

-- Set REPLICA IDENTITY to FULL so updates/deletes contain full payload
ALTER TABLE public."user" REPLICA IDENTITY FULL;
ALTER TABLE public.session REPLICA IDENTITY FULL;
ALTER TABLE public.account REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.user_goals REPLICA IDENTITY FULL;
ALTER TABLE public.weekly_plans REPLICA IDENTITY FULL;
ALTER TABLE public.plan_days REPLICA IDENTITY FULL;
ALTER TABLE public.plan_exercises REPLICA IDENTITY FULL;
ALTER TABLE public.workout_logs REPLICA IDENTITY FULL;
ALTER TABLE public.daily_metrics REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
