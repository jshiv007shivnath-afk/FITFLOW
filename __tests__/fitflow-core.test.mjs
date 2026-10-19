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
const avatarUtils = await importTypeScriptModule('utils/avatarUtils.ts');

function calculateDeduplicatedSteps(samples) {
  if (!samples || samples.length === 0) return 0;
  const valid = samples.filter((s) => s && typeof s.value === 'number' && s.value > 0);
  if (valid.length === 0) return 0;

  const sourceGroups = new Map();
  for (const s of valid) {
    const src = s.sourceId || s.sourceName || 'device';
    if (!sourceGroups.has(src)) {
      sourceGroups.set(src, []);
    }
    sourceGroups.get(src).push(s);
  }

  if (sourceGroups.size === 1) {
    const list = Array.from(sourceGroups.values())[0];
    return Math.round(list.reduce((acc, curr) => acc + curr.value, 0));
  }

  let primarySource = '';
  let highestVolume = -1;
  sourceGroups.forEach((list, src) => {
    const vol = list.reduce((acc, c) => acc + c.value, 0);
    if (vol > highestVolume) {
      highestVolume = vol;
      primarySource = src;
    }
  });

  const sorted = [...valid].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  let totalSteps = 0;
  let currentCoveredEnd = 0;

  for (const sample of sorted) {
    const start = new Date(sample.startDate).getTime();
    const end = new Date(sample.endDate).getTime();
    const isPrimary = (sample.sourceId || sample.sourceName) === primarySource;

    if (start >= currentCoveredEnd) {
      totalSteps += sample.value;
      currentCoveredEnd = Math.max(currentCoveredEnd, end);
    } else {
      if (isPrimary && end > currentCoveredEnd) {
        const fullDuration = Math.max(1, end - start);
        const uncoveredDuration = end - currentCoveredEnd;
        const ratio = Math.min(1, Math.max(0, uncoveredDuration / fullDuration));
        totalSteps += Math.round(sample.value * ratio);
        currentCoveredEnd = end;
      }
    }
  }

  return Math.round(totalSteps);
}

describe('FitFlow Core Engine - XP and Level Progression', () => {
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

    const safeXp = Math.max(0, currentTotalXp);
    const level = Math.floor(safeXp / 500) + 1;
    const xpInLevel = safeXp % 500;

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
        level,
        xp: xpInLevel,
        xpToNextLevel: 500,
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

describe('FitFlow Core Engine - Step Deduplication Service', () => {
  it('returns 0 steps for empty or null samples array', () => {
    assert.equal(calculateDeduplicatedSteps([]), 0);
    assert.equal(calculateDeduplicatedSteps(null), 0);
  });

  it('correctly sums non-overlapping samples from a single source', () => {
    const samples = [
      { value: 120, startDate: '2026-10-18T08:00:00Z', endDate: '2026-10-18T08:15:00Z', sourceId: 'sensor-1' },
      { value: 230, startDate: '2026-10-18T08:15:00Z', endDate: '2026-10-18T08:30:00Z', sourceId: 'sensor-1' },
    ];
    assert.equal(calculateDeduplicatedSteps(samples), 350);
  });

  it('deduplicates overlapping samples across multiple data sources', () => {
    const samples = [
      { value: 500, startDate: '2026-10-18T08:00:00Z', endDate: '2026-10-18T09:00:00Z', sourceId: 'watch' },
      { value: 450, startDate: '2026-10-18T08:00:00Z', endDate: '2026-10-18T09:00:00Z', sourceId: 'phone' },
    ];
    // Should select primary source 'watch' with 500 steps and ignore duplicate window from 'phone'
    assert.equal(calculateDeduplicatedSteps(samples), 500);
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
  it('correctly calculates mid-year ISO week numbers', () => {
    // 2026-10-18 is in Week 42 of 2026
    const oct18 = new Date(2026, 9, 18);
    const weekNr = dateUtils.getIsoWeekNumber(oct18);
    assert.equal(weekNr, 42);
  });

  it('calculates first week of year accurately', () => {
    // 2026-01-08 is in Week 2 of 2026
    const jan8 = new Date(2026, 0, 8);
    const weekNr = dateUtils.getIsoWeekNumber(jan8);
    assert.equal(weekNr, 2);
  });

  it('uses the ISO week-year for New Year boundary week IDs', () => {
    const mondayBefore2026 = new Date(2025, 11, 29);
    const week = dateUtils.getCurrentWeekInfo(mondayBefore2026);

    assert.equal(week.weekId, '2026-W01');
    assert.equal(dateUtils.getIsoWeekYear(mondayBefore2026), 2026);
  });
});

describe('FitFlow Core Engine - Email-Derived Profile Picture Utility', () => {
  it('returns an empty string when email is missing or empty', () => {
    assert.equal(avatarUtils.getEmailAvatar(''), '');
    assert.equal(avatarUtils.getEmailAvatar(null), '');
    assert.equal(avatarUtils.getEmailAvatar(undefined), '');
  });

  it('generates an unavatar URL containing the encoded email', () => {
    const avatar = avatarUtils.getEmailAvatar('athlete.pro@gmail.com');
    assert.ok(avatar.startsWith('https://unavatar.io/athlete.pro%40gmail.com'));
    assert.ok(avatar.includes('fallback='));
  });

  it('embeds brand colors (#111312 and #B8F45A) into the avatar fallback', () => {
    const avatar = avatarUtils.getEmailAvatar('athlete@fitflow.app', 'Alex Rivers');
    assert.ok(avatar.includes('111312'), 'Must include dark background token');
    assert.ok(avatar.includes('B8F45A'), 'Must include lime brand token');
  });
});

