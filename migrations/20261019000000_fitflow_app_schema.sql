-- ==============================================================================
-- Migration: FitFlow Core Domain Schema (PostgreSQL / Supabase)
-- Version: 20261019000000
-- ==============================================================================

-- 1. PROFILES TABLE (Gamification & Athletic Stats)
CREATE TABLE IF NOT EXISTS "profiles" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE REFERENCES "user"("id") ON DELETE CASCADE,
    "membership" TEXT NOT NULL DEFAULT 'Free',
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "weightKg" NUMERIC(5, 2) NOT NULL DEFAULT 68.5,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "profiles_userId_idx" ON "profiles" ("userId");

-- 2. USER GOALS TABLE (Daily Targets)
CREATE TABLE IF NOT EXISTS "user_goals" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE REFERENCES "user"("id") ON DELETE CASCADE,
    "calorieTarget" INTEGER NOT NULL DEFAULT 650,
    "waterTargetMl" INTEGER NOT NULL DEFAULT 2500,
    "exerciseTargetMin" INTEGER NOT NULL DEFAULT 60,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "user_goals_userId_idx" ON "user_goals" ("userId");

-- 3. WEEKLY PLANS TABLE
CREATE TABLE IF NOT EXISTS "weekly_plans" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "weekId" TEXT NOT NULL,
    "weekLabel" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "hasDecidedNewWeek" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId", "weekId")
);

CREATE INDEX IF NOT EXISTS "weekly_plans_userId_weekId_idx" ON "weekly_plans" ("userId", "weekId");

-- 4. PLAN DAYS TABLE
CREATE TABLE IF NOT EXISTS "plan_days" (
    "id" TEXT PRIMARY KEY,
    "weeklyPlanId" TEXT NOT NULL REFERENCES "weekly_plans"("id") ON DELETE CASCADE,
    "dayKey" TEXT NOT NULL,
    "dayName" TEXT NOT NULL,
    "shortDate" TEXT NOT NULL,
    "workoutTitle" TEXT NOT NULL DEFAULT 'Rest Day',
    "isRestDay" BOOLEAN NOT NULL DEFAULT TRUE,
    "estimatedDurationMin" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT FALSE,
    "completedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "plan_days_weeklyPlanId_idx" ON "plan_days" ("weeklyPlanId");

-- 5. PLAN EXERCISES TABLE
CREATE TABLE IF NOT EXISTS "plan_exercises" (
    "id" TEXT PRIMARY KEY,
    "planDayId" TEXT NOT NULL REFERENCES "plan_days"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "targetType" TEXT NOT NULL DEFAULT 'reps',
    "sets" INTEGER NOT NULL DEFAULT 3,
    "reps" INTEGER,
    "durationSeconds" INTEGER,
    "distanceKm" NUMERIC(6, 2),
    "restIntervalSec" INTEGER DEFAULT 60,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "plan_exercises_planDayId_idx" ON "plan_exercises" ("planDayId");

-- 6. WORKOUT LOGS TABLE
CREATE TABLE IF NOT EXISTS "workout_logs" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "calories" INTEGER NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Exercise',
    "time" TEXT NOT NULL,
    "loggedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "workout_logs_userId_idx" ON "workout_logs" ("userId");

-- 7. DAILY METRICS TABLE (Daily Aggregates: Steps, Water, Calories, Sleep)
CREATE TABLE IF NOT EXISTS "daily_metrics" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "date" DATE NOT NULL,
    "caloriesBurned" INTEGER NOT NULL DEFAULT 0,
    "waterIntakeMl" INTEGER NOT NULL DEFAULT 0,
    "exerciseMinutes" INTEGER NOT NULL DEFAULT 0,
    "sleepHours" NUMERIC(4, 2) NOT NULL DEFAULT 0,
    "steps" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId", "date")
);

CREATE INDEX IF NOT EXISTS "daily_metrics_userId_date_idx" ON "daily_metrics" ("userId", "date");

-- 8. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS "notifications" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "iconType" TEXT NOT NULL DEFAULT 'goal',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unread" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "notifications_userId_idx" ON "notifications" ("userId");
