import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';

async function importTypeScriptModule(path) {
  const source = await fs.readFile(path, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

const dateUtils = await importTypeScriptModule('utils/dateUtils.ts');

// Helper mirror matching FitFlowContext logic
function computeLevelProgress(currentTotalXp) {
  const safeXp = Math.max(0, currentTotalXp);
  const level = Math.floor(safeXp / 500) + 1;
  const xpInLevel = safeXp % 500;
  return {
    level,
    xp: xpInLevel,
    xpToNextLevel: 500,
  };
}

describe('FitFlow Core Engine - XP and Level Progression', () => {
  it('initializes Level 1 with 0 XP', () => {
    const res = computeLevelProgress(0);
    assert.equal(res.level, 1);
    assert.equal(res.xp, 0);
    assert.equal(res.xpToNextLevel, 500);
  });

  it('progresses within level without leveling up if XP < 500', () => {
    const res = computeLevelProgress(350);
    assert.equal(res.level, 1);
    assert.equal(res.xp, 350);
    assert.equal(res.xpToNextLevel, 500);
  });

  it('levels up to Level 2 exactly when hitting 500 XP and resets XP to 0', () => {
    const res = computeLevelProgress(500);
    assert.equal(res.level, 2);
    assert.equal(res.xp, 0);
  });

  it('overflows properly when adding XP past level boundary', () => {
    const res = computeLevelProgress(580);
    assert.equal(res.level, 2);
    assert.equal(res.xp, 80);
  });

  it('correctly calculates higher levels and rolls back gracefully', () => {
    const high = computeLevelProgress(1650);
    assert.equal(high.level, 4); // (1650 / 500) = 3 + 1 = 4
    assert.equal(high.xp, 150);

    // Rollback by 200 XP
    const rolledBack = computeLevelProgress(1650 - 200);
    assert.equal(rolledBack.level, 3);
    assert.equal(rolledBack.xp, 450);
  });

  it('clamps negative XP to 0 without crashing or producing negative levels', () => {
    const clamped = computeLevelProgress(-250);
    assert.equal(clamped.level, 1);
    assert.equal(clamped.xp, 0);
  });
});

describe('FitFlow Core Engine - Workout Planner & Symmetric Rollback', () => {
  function simulateToggleDay(state, dayKey) {
    let loggedTitle = '';
    let loggedDuration = 30;
    let isNowComplete = false;

    const nextDays = state.weeklyPlan.days.map((d) => {
      if (d.dayKey === dayKey) {
        isNowComplete = !d.completed;
        loggedTitle = d.workoutTitle;
        loggedDuration = d.estimatedDurationMin || 25;
        return {
          ...d,
          completed: isNowComplete,
          completedAt: isNowComplete ? '10:00 AM' : undefined,
        };
      }
      return d;
    });

    const estCals = Math.round(loggedDuration * 8.5);
    const planWorkoutTitle = `Weekly Plan: ${loggedTitle}`;
    let updatedWorkouts = state.today.workouts;
    let updatedCals = state.today.caloriesBurned;
    let updatedMins = state.today.exerciseMinutes;
    let currentTotalXp = (state.user.level - 1) * 500 + state.user.xp;

    if (isNowComplete) {
      updatedWorkouts = [
        {
          id: 'test-w-1',
          title: planWorkoutTitle,
          durationMin: loggedDuration,
          calories: estCals,
          category: 'Strength',
          time: '10:00 AM',
        },
        ...state.today.workouts,
      ];
      updatedCals += estCals;
      updatedMins += loggedDuration;
      currentTotalXp += 120;
    } else {
      const workoutIdx = state.today.workouts.findIndex((w) => w.title === planWorkoutTitle);
      if (workoutIdx !== -1) {
        const removed = state.today.workouts[workoutIdx];
        updatedWorkouts = state.today.workouts.filter((_, idx) => idx !== workoutIdx);
        updatedCals = Math.max(0, updatedCals - removed.calories);
        updatedMins = Math.max(0, updatedMins - removed.durationMin);
      } else {
        updatedCals = Math.max(0, updatedCals - estCals);
        updatedMins = Math.max(0, updatedMins - loggedDuration);
      }
      currentTotalXp = Math.max(0, currentTotalXp - 120);
    }

    const progress = computeLevelProgress(currentTotalXp);
    const completedCount = nextDays.filter((d) => d.completed).length;
    const newStreak = completedCount > 0 || updatedWorkouts.length > 0 ? Math.max(1, state.user.streakDays || 1) : 0;

    return {
      ...state,
      weeklyPlan: { ...state.weeklyPlan, days: nextDays },
      today: {
        ...state.today,
        workouts: updatedWorkouts,
        caloriesBurned: updatedCals,
        exerciseMinutes: updatedMins,
      },
      user: {
        ...state.user,
        streakDays: newStreak,
        level: progress.level,
        xp: progress.xp,
        xpToNextLevel: progress.xpToNextLevel,
      },
    };
  }

  it('completing a day adds workout, calories, minutes, XP, and streak', () => {
    const initialState = {
      weeklyPlan: {
        days: [
          { dayKey: 'mon', workoutTitle: 'Chest Day', estimatedDurationMin: 30, completed: false },
        ],
      },
      today: { workouts: [], caloriesBurned: 0, exerciseMinutes: 0 },
      user: { level: 1, xp: 0, streakDays: 0 },
    };

    const completed = simulateToggleDay(initialState, 'mon');
    assert.equal(completed.weeklyPlan.days[0].completed, true);
    assert.equal(completed.today.workouts.length, 1);
    assert.equal(completed.today.workouts[0].title, 'Weekly Plan: Chest Day');
    assert.equal(completed.today.exerciseMinutes, 30);
    assert.equal(completed.today.caloriesBurned, 255); // 30 * 8.5
    assert.equal(completed.user.xp, 120);
    assert.equal(completed.user.streakDays, 1);
  });

  it('unchecking a completed day symmetrically rolls back workout, calories, minutes, XP, and streak', () => {
    const initialState = {
      weeklyPlan: {
        days: [
          { dayKey: 'mon', workoutTitle: 'Chest Day', estimatedDurationMin: 30, completed: false },
        ],
      },
      today: { workouts: [], caloriesBurned: 0, exerciseMinutes: 0 },
      user: { level: 1, xp: 0, streakDays: 0 },
    };

    // Toggle ON
    const stateAfterCheck = simulateToggleDay(initialState, 'mon');
    // Toggle OFF
    const stateAfterUncheck = simulateToggleDay(stateAfterCheck, 'mon');

    assert.equal(stateAfterUncheck.weeklyPlan.days[0].completed, false);
    assert.equal(stateAfterUncheck.today.workouts.length, 0);
    assert.equal(stateAfterUncheck.today.caloriesBurned, 0);
    assert.equal(stateAfterUncheck.today.exerciseMinutes, 0);
    assert.equal(stateAfterUncheck.user.xp, 0);
    assert.equal(stateAfterUncheck.user.streakDays, 0);
  });
});

describe('FitFlow Core Engine - Division by Zero & Metric Safeguards', () => {
  it('prevents NaN in progress percent when target is 0 or undefined', () => {
    const goals = { waterTargetMl: 0, calorieTarget: 0 };
    const today = { waterIntakeMl: 500, caloriesBurned: 200, steps: null };

    const safeWaterTarget = (goals.waterTargetMl && goals.waterTargetMl > 0) ? goals.waterTargetMl : 2500;
    const safeCalorieTarget = (goals.calorieTarget && goals.calorieTarget > 0) ? goals.calorieTarget : 650;
    const safeStepGoal = 10000;

    const waterPercent = Math.max(0, Math.min(100, Math.round((today.waterIntakeMl / safeWaterTarget) * 100)));
    const caloriePercent = Math.max(0, Math.min(100, Math.round((today.caloriesBurned / safeCalorieTarget) * 100)));
    const stepsWalked = Math.max(0, today.steps ?? 0);
    const stepPercent = Math.max(0, Math.min(100, Math.round((stepsWalked / safeStepGoal) * 100)));

    assert.equal(Number.isNaN(waterPercent), false);
    assert.equal(Number.isNaN(caloriePercent), false);
    assert.equal(Number.isNaN(stepPercent), false);
    assert.equal(waterPercent, 20); // 500 / 2500
    assert.equal(caloriePercent, 31); // 200 / 650
    assert.equal(stepPercent, 0);
  });
});

describe('FitFlow Core Engine - Goal Input Bounds Clamping', () => {
  function clampGoals(input) {
    const calorieTarget = input.calorieTarget !== undefined
      ? Math.max(100, Math.min(10000, input.calorieTarget))
      : 650;
    const waterTargetMl = input.waterTargetMl !== undefined
      ? Math.max(500, Math.min(10000, input.waterTargetMl))
      : 2500;
    const weightKg = input.weightKg !== undefined
      ? Math.max(20, Math.min(300, input.weightKg))
      : 68.5;
    return { calorieTarget, waterTargetMl, weightKg };
  }

  it('clamps excessively low or negative numbers to safe minimums', () => {
    const clamped = clampGoals({ calorieTarget: -500, waterTargetMl: -100, weightKg: 5 });
    assert.equal(clamped.calorieTarget, 100);
    assert.equal(clamped.waterTargetMl, 500);
    assert.equal(clamped.weightKg, 20);
  });

  it('clamps excessively high numbers to safe maximums', () => {
    const clamped = clampGoals({ calorieTarget: 50000, waterTargetMl: 90000, weightKg: 999 });
    assert.equal(clamped.calorieTarget, 10000);
    assert.equal(clamped.waterTargetMl, 10000);
    assert.equal(clamped.weightKg, 300);
  });
});

describe('FitFlow Core Engine - Storage Hydration Resilience & Schema Defense', () => {
  const DEFAULT_TEST_STATE = {
    user: { name: 'Alex Rivers', email: 'alex@example.com', streakDays: 0, level: 1, xp: 0 },
    goals: { calorieTarget: 650, waterTargetMl: 2500, weightKg: 68.5 },
    notifications: [{ id: 'n-1', title: 'Welcome' }],
  };

  function hydrateSafely(parsed) {
    return {
      user: {
        ...DEFAULT_TEST_STATE.user,
        ...(parsed.user || {}),
      },
      goals: {
        ...DEFAULT_TEST_STATE.goals,
        ...(parsed.goals || {}),
      },
      notifications: Array.isArray(parsed.notifications)
        ? parsed.notifications
        : DEFAULT_TEST_STATE.notifications,
    };
  }

  it('safely recovers when parsed localStorage has missing or null notifications', () => {
    const corrupt = { user: { name: 'Test User' }, goals: null, notifications: null };
    const hydrated = hydrateSafely(corrupt);

    assert.equal(hydrated.user.name, 'Test User');
    assert.equal(hydrated.goals.calorieTarget, 650);
    assert.equal(Array.isArray(hydrated.notifications), true);
    assert.equal(hydrated.notifications.length, 1);
  });

  it('preserves valid custom notifications if present in storage', () => {
    const valid = { notifications: [{ id: 'custom-1', title: 'New Goal' }] };
    const hydrated = hydrateSafely(valid);

    assert.equal(hydrated.notifications.length, 1);
    assert.equal(hydrated.notifications[0].id, 'custom-1');
  });
});

describe('FitFlow Core Engine - Date Calculations & ISO Week Numbering', () => {
  function getIsoWeekNumber(date) {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }

  it('correctly calculates mid-year ISO week numbers', () => {
    // 2026-10-18 is in Week 42 of 2026
    const oct18 = new Date(2026, 9, 18);
    const weekNr = getIsoWeekNumber(oct18);
    assert.equal(weekNr, 42);
  });

  it('calculates first week of year accurately', () => {
    // 2026-01-08 is in Week 2 of 2026
    const jan8 = new Date(2026, 0, 8);
    const weekNr = getIsoWeekNumber(jan8);
    assert.equal(weekNr, 2);
  });

  it('uses the ISO week-year for New Year boundary week IDs', () => {
    const mondayBefore2026 = new Date(2025, 11, 29);
    const week = dateUtils.getCurrentWeekInfo(mondayBefore2026);

    assert.equal(week.weekId, '2026-W01');
    assert.equal(dateUtils.getIsoWeekYear(mondayBefore2026), 2026);
  });
});
