'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  StepTrackingState,
  checkStepAvailability,
  checkStepAuthorization,
  requestStepAuthorization,
  getTodayStepCount,
  openHealthSettings as openNativeHealthSettings,
  setupStepForegroundListener,
} from '@/services/stepTrackingService';
import {
  WeekInfo,
  getCurrentWeekInfo,
  getTodayKey,
  formatIsoDateOnly,
  syncPlanDatesToCurrentWeek,
} from '@/utils/dateUtils';
import { getEmailAvatar } from '@/utils/avatarUtils';
import { signOut, clearAuthToken } from '@/lib/auth-client';

export type TabType = 'home' | 'planner' | 'progress' | 'profile';

export type ExerciseTargetType = 'reps' | 'duration' | 'distance';

export interface ExercisePlanItem {
  id: string;
  name: string;
  targetType: ExerciseTargetType;
  sets: number;
  reps?: number;
  durationSeconds?: number;
  distanceKm?: number;
  restIntervalSec?: number;
}

export interface DayWorkoutPlan {
  dayKey: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  dayName: string;
  shortDate: string;
  workoutTitle: string;
  isRestDay: boolean;
  exercises: ExercisePlanItem[];
  estimatedDurationMin: number;
  completed: boolean;
  completedAt?: string;
  completionWorkoutId?: string;
}

export interface WeeklyPlan {
  weekId: string;
  weekLabel: string;
  weekNumber: number;
  hasDecidedNewWeek: boolean;
  days: DayWorkoutPlan[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutLogItem {
  id: string;
  title: string;
  durationMin: number;
  calories: number;
  category: string;
  time: string;
}

export interface MealLogItem {
  id: string;
  name: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  time: string;
}

export interface AppNotification {
  id: string;
  iconType: 'order' | 'payment' | 'promo' | 'survey' | 'goal' | 'water' | 'workout';
  title: string;
  timestamp: string;
  description: string;
  unread: boolean;
}

export interface FitFlowState {
  activeTab: TabType;
  showOnboarding: boolean;
  showLogin: boolean;
  showOtp: boolean;
  pendingOtpEmail?: string;
  pendingOtpName?: string;
  pendingDevOtp?: string;
  showSetName: boolean;
  showWelcome: boolean;
  showNotifications: boolean;
  showPrivacyPolicy: boolean;
  showTerms: boolean;
  showHelpCenter: boolean;
  showDisclaimer: boolean;
  showAccessibilityStatement: boolean;
  showNewWeekDialog: boolean;
  weeklyPlan: WeeklyPlan;
  previousWeekPlan: WeeklyPlan | null;
  notifications: AppNotification[];
  user: {
    name: string;
    email: string;
    avatar: string;
    membership: 'Free' | 'Pro';
    streakDays: number;
    level: number;
    xp: number;
    xpToNextLevel: number;
  };
  goals: {
    calorieTarget: number;
    waterTargetMl: number;
    exerciseTargetMin: number;
    weightKg: number;
  };
  today: {
    caloriesBurned: number;
    waterIntakeMl: number;
    exerciseMinutes: number;
    sleepHours: number;
    steps: number | null;
    workouts: WorkoutLogItem[];
    meals: MealLogItem[];
    date?: string;
  };
  stepTracking: StepTrackingState;
}

interface FitFlowContextType extends FitFlowState {
  isHydrated: boolean;
  todayKey: DayWorkoutPlan['dayKey'];
  todayIsoDate: string;
  weekInfo: WeekInfo;
  setActiveTab: (tab: TabType) => void;
  setShowOnboarding: (show: boolean) => void;
  setShowLogin: (show: boolean) => void;
  setShowOtp: (show: boolean) => void;
  setShowSetName: (show: boolean) => void;
  setShowWelcome: (show: boolean) => void;
  setUserName: (name: string) => void;
  pendingOtpEmail?: string;
  pendingOtpName?: string;
  pendingDevOtp?: string;
  requestOtpLogin: (email: string, name?: string, devOtp?: string) => void;
  completeOtpLogin: () => void;
  setShowNotifications: (show: boolean) => void;
  setShowPrivacyPolicy: (show: boolean) => void;
  setShowTerms: (show: boolean) => void;
  setShowHelpCenter: (show: boolean) => void;
  setShowDisclaimer: (show: boolean) => void;
  setShowAccessibilityStatement: (show: boolean) => void;
  setShowNewWeekDialog: (show: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  addNotification: (title: string, description: string, iconType?: AppNotification['iconType']) => void;
  markNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  unreadNotificationCount: number;
  addWater: (amountMl: number) => void;
  logWorkout: (title: string, durationMin: number, calories: number, category?: string) => void;
  logMeal: (name: string, mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack', calories: number) => void;
  updateGoals: (goals: Partial<FitFlowState['goals']>) => void;
  updateUserAvatar: (avatarUrl: string) => void;
  toggleMembership: () => void;
  resetToDefaults: () => void;
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
  saveWeeklyPlan: (plan: WeeklyPlan) => void;
  updateDayWorkout: (dayKey: DayWorkoutPlan['dayKey'], updatedDay: Partial<DayWorkoutPlan>) => void;
  toggleDayCompletion: (dayKey: DayWorkoutPlan['dayKey']) => void;
  repeatPreviousWeekPlan: () => void;
  createNewWeeklyPlan: () => void;
  refreshStepCount: () => Promise<void>;
  requestStepPermission: () => Promise<void>;
  openHealthSettings: () => Promise<void>;
  dismissToast: () => void;
}

const DEFAULT_WEEKLY_PLAN: WeeklyPlan = {
  weekId: '2026-W42',
  weekLabel: 'Oct 12 - Oct 18, 2026',
  weekNumber: 42,
  hasDecidedNewWeek: true,
  days: [
    {
      dayKey: 'mon',
      dayName: 'Monday',
      shortDate: 'Oct 12',
      workoutTitle: 'Rest Day',
      isRestDay: true,
      estimatedDurationMin: 0,
      completed: false,
      exercises: [],
    },
    {
      dayKey: 'tue',
      dayName: 'Tuesday',
      shortDate: 'Oct 13',
      workoutTitle: 'Rest Day',
      isRestDay: true,
      estimatedDurationMin: 0,
      completed: false,
      exercises: [],
    },
    {
      dayKey: 'wed',
      dayName: 'Wednesday',
      shortDate: 'Oct 14',
      workoutTitle: 'Rest Day',
      isRestDay: true,
      estimatedDurationMin: 0,
      completed: false,
      exercises: [],
    },
    {
      dayKey: 'thu',
      dayName: 'Thursday',
      shortDate: 'Oct 15',
      workoutTitle: 'Rest Day',
      isRestDay: true,
      estimatedDurationMin: 0,
      completed: false,
      exercises: [],
    },
    {
      dayKey: 'fri',
      dayName: 'Friday',
      shortDate: 'Oct 16',
      workoutTitle: 'Rest Day',
      isRestDay: true,
      estimatedDurationMin: 0,
      completed: false,
      exercises: [],
    },
    {
      dayKey: 'sat',
      dayName: 'Saturday',
      shortDate: 'Oct 17',
      workoutTitle: 'Rest Day',
      isRestDay: true,
      estimatedDurationMin: 0,
      completed: false,
      exercises: [],
    },
    {
      dayKey: 'sun',
      dayName: 'Sunday',
      shortDate: 'Oct 18',
      workoutTitle: 'Rest Day',
      isRestDay: true,
      estimatedDurationMin: 0,
      completed: false,
      exercises: [],
    },
  ],
  createdAt: '2026-10-12T00:00:00Z',
  updatedAt: '2026-10-12T00:00:00Z',
};

const DEFAULT_PREVIOUS_WEEK_PLAN: WeeklyPlan = {
  weekId: '2026-W41',
  weekLabel: 'Oct 5 - Oct 11, 2026',
  weekNumber: 41,
  hasDecidedNewWeek: true,
  days: [
    {
      dayKey: 'mon',
      dayName: 'Monday',
      shortDate: 'Oct 5',
      workoutTitle: 'Push-ups & Chest Core',
      isRestDay: false,
      estimatedDurationMin: 30,
      completed: true,
      exercises: [
        { id: 'p-1', name: 'Push-ups', targetType: 'reps', sets: 3, reps: 15, restIntervalSec: 60 },
        { id: 'p-2', name: 'Dumbbell Floor Press', targetType: 'reps', sets: 3, reps: 12, restIntervalSec: 60 },
      ],
    },
    {
      dayKey: 'tue',
      dayName: 'Tuesday',
      shortDate: 'Oct 6',
      workoutTitle: 'Legs & Lower Body',
      isRestDay: false,
      estimatedDurationMin: 35,
      completed: true,
      exercises: [
        { id: 'p-3', name: 'Goblet Squats', targetType: 'reps', sets: 3, reps: 15, restIntervalSec: 60 },
      ],
    },
    {
      dayKey: 'wed',
      dayName: 'Wednesday',
      shortDate: 'Oct 7',
      workoutTitle: 'Cardio & Aerobic Pacing',
      isRestDay: false,
      estimatedDurationMin: 25,
      completed: true,
      exercises: [
        { id: 'p-4', name: 'Zone 2 Brisk Walking', targetType: 'duration', sets: 1, durationSeconds: 1200, restIntervalSec: 0 },
      ],
    },
    {
      dayKey: 'thu',
      dayName: 'Thursday',
      shortDate: 'Oct 8',
      workoutTitle: 'Rest Day',
      isRestDay: true,
      estimatedDurationMin: 0,
      completed: false,
      exercises: [],
    },
    {
      dayKey: 'fri',
      dayName: 'Friday',
      shortDate: 'Oct 9',
      workoutTitle: 'Pull & Upper Back',
      isRestDay: false,
      estimatedDurationMin: 35,
      completed: true,
      exercises: [
        { id: 'p-5', name: 'Dumbbell Rows', targetType: 'reps', sets: 3, reps: 12, restIntervalSec: 60 },
      ],
    },
    {
      dayKey: 'sat',
      dayName: 'Saturday',
      shortDate: 'Oct 10',
      workoutTitle: 'Full Body Endurance',
      isRestDay: false,
      estimatedDurationMin: 30,
      completed: true,
      exercises: [
        { id: 'p-6', name: 'Kettlebell Swings', targetType: 'reps', sets: 3, reps: 20, restIntervalSec: 60 },
      ],
    },
    {
      dayKey: 'sun',
      dayName: 'Sunday',
      shortDate: 'Oct 11',
      workoutTitle: 'Rest Day',
      isRestDay: true,
      estimatedDurationMin: 0,
      completed: false,
      exercises: [],
    },
  ],
  createdAt: '2026-10-05T00:00:00Z',
  updatedAt: '2026-10-11T23:59:59Z',
};

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    iconType: 'workout',
    title: 'Weekly Target Smashed',
    description: 'You hit 70,000 steps and 4,500 active kcal this week. Highest volume on record!',
    timestamp: '3d ago',
    unread: false,
  },
  {
    id: 'n-2',
    iconType: 'water',
    title: 'Hydration Milestone',
    description: 'Maintained 2,500ml daily water intake for 10 consecutive days without missing.',
    timestamp: '4d ago',
    unread: false,
  },
  {
    id: 'n-3',
    iconType: 'goal',
    title: 'Personal Best Recorded',
    description: 'New 5K Outdoor Run personal record: 24m 18s (Avg Pace 4:51 /km).',
    timestamp: '5d ago',
    unread: false,
  },
];

function computeLevelProgress(currentTotalXp: number): { level: number; xp: number; xpToNextLevel: number } {
  const safeXp = Math.max(0, toFiniteNumber(currentTotalXp));
  const level = Math.floor(safeXp / 500) + 1;
  const xpInLevel = safeXp % 500;
  return {
    level,
    xp: xpInLevel,
    xpToNextLevel: 500,
  };
}

function toFiniteNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function clampFiniteNumber(value: unknown, min: number, max: number, fallback = min): number {
  return Math.min(max, Math.max(min, toFiniteNumber(value, fallback)));
}

function createEntryId(prefix: string): string {
  const suffix = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${suffix}`;
}

function createEmptyToday(date: string): FitFlowState['today'] {
  return {
    caloriesBurned: 0,
    waterIntakeMl: 0,
    exerciseMinutes: 0,
    sleepHours: 0,
    steps: 0,
    workouts: [],
    meals: [],
    date,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeTodayForDate(value: unknown, date: string): FitFlowState['today'] {
  if (!isRecord(value) || value.date !== date) {
    return createEmptyToday(date);
  }

  return {
    caloriesBurned: clampFiniteNumber(value.caloriesBurned, 0, 100000),
    waterIntakeMl: clampFiniteNumber(value.waterIntakeMl, 0, 100000),
    exerciseMinutes: clampFiniteNumber(value.exerciseMinutes, 0, 1440),
    sleepHours: clampFiniteNumber(value.sleepHours, 0, 24),
    steps: typeof value.steps === 'number' && Number.isFinite(value.steps)
      ? Math.max(0, Math.round(value.steps))
      : 0,
    workouts: Array.isArray(value.workouts) ? value.workouts as WorkoutLogItem[] : [],
    meals: Array.isArray(value.meals) ? value.meals as MealLogItem[] : [],
    date,
  };
}

const DEFAULT_STATE: FitFlowState = {
  activeTab: 'home',
  showOnboarding: false,
  showLogin: false,
  showOtp: false,
  pendingOtpEmail: '',
  pendingOtpName: '',
  showSetName: false,
  showWelcome: false,
  showNotifications: false,
  showPrivacyPolicy: false,
  showTerms: false,
  showHelpCenter: false,
  showDisclaimer: false,
  showAccessibilityStatement: false,
  showNewWeekDialog: false,
  weeklyPlan: syncPlanDatesToCurrentWeek(DEFAULT_WEEKLY_PLAN),
  previousWeekPlan: DEFAULT_PREVIOUS_WEEK_PLAN,
  notifications: DEFAULT_NOTIFICATIONS,
  user: {
    name: 'Alex Rivers',
    email: 'alex.rivers@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    membership: 'Pro',
    streakDays: 0,
    level: 1,
    xp: 0,
    xpToNextLevel: 500,
  },
  goals: {
    calorieTarget: 650,
    waterTargetMl: 2500,
    exerciseTargetMin: 60,
    weightKg: 68.5,
  },
  today: {
    caloriesBurned: 0,
    waterIntakeMl: 0,
    exerciseMinutes: 0,
    sleepHours: 0,
    steps: 0,
    workouts: [],
    meals: [],
    date: formatIsoDateOnly(new Date()),
  },
  stepTracking: {
    count: 0,
    status: 'idle',
    isNative: false,
  },
};

const FitFlowContext = createContext<FitFlowContextType | undefined>(undefined);

const STORAGE_KEY = 'fitflow_app_state_v5';

export function FitFlowProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FitFlowState>(DEFAULT_STATE);
  const [todayIsoDate, setTodayIsoDate] = useState(() => formatIsoDateOnly(new Date()));
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const weekInfo = getCurrentWeekInfo(new Date());
  const todayKey = getTodayKey(new Date());

  // Load from localStorage on mount and dynamically sync dates to current calendar week
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const currentIso = formatIsoDateOnly(new Date());
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!isRecord(parsed)) throw new Error('Stored state is not an object');
        const storedPlan = isRecord(parsed.weeklyPlan) && Array.isArray(parsed.weeklyPlan.days)
          ? parsed.weeklyPlan as unknown as WeeklyPlan
          : DEFAULT_WEEKLY_PLAN;
        const storedPreviousPlan = isRecord(parsed.previousWeekPlan) && Array.isArray(parsed.previousWeekPlan.days)
          ? parsed.previousWeekPlan as unknown as WeeklyPlan
          : DEFAULT_PREVIOUS_WEEK_PLAN;
        const syncedPlan = syncPlanDatesToCurrentWeek(storedPlan, new Date());
        const todayData = normalizeTodayForDate(parsed.today, currentIso);
        const storedUser = isRecord(parsed.user) ? parsed.user : {};
        const storedGoals = isRecord(parsed.goals) ? parsed.goals : {};

        setState(prev => ({
          ...prev,
          ...parsed,
          user: {
            ...prev.user,
            ...storedUser,
          },
          goals: {
            ...prev.goals,
            ...storedGoals,
          },
          notifications: Array.isArray(parsed.notifications) ? parsed.notifications : prev.notifications,
          today: todayData,
          weeklyPlan: syncedPlan,
          previousWeekPlan: storedPreviousPlan,
          activeTab: prev.activeTab,
        }));
      } else {
        setState(prev => ({
          ...prev,
          weeklyPlan: syncPlanDatesToCurrentWeek(DEFAULT_WEEKLY_PLAN, new Date()),
          today: {
            ...prev.today,
            date: currentIso,
          },
        }));
      }
    } catch {
      // ignore JSON errors
    }
    setIsHydrated(true);
  }, []);

  // Background cloud hydration from PostgreSQL via /api/sync
  useEffect(() => {
    if (!isHydrated) return;

    let isMounted = true;
    const fetchCloudSync = async () => {
      try {
        const res = await fetch('/api/sync');
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          const { profile, goals, weeklyPlan, notifications } = json.data;
          setState((prev) => {
            const updatedUser = profile
              ? {
                  ...prev.user,
                  membership: (profile.membership as 'Free' | 'Pro') || prev.user.membership,
                  streakDays: typeof profile.streakDays === 'number' ? profile.streakDays : prev.user.streakDays,
                  level: typeof profile.level === 'number' ? profile.level : prev.user.level,
                  xp: typeof profile.xp === 'number' ? profile.xp : prev.user.xp,
                  avatar: profile.avatarUrl || prev.user.avatar,
                }
              : prev.user;

            const updatedGoals = goals
              ? {
                  ...prev.goals,
                  calorieTarget: Number(goals.calorieTarget) || prev.goals.calorieTarget,
                  waterTargetMl: Number(goals.waterTargetMl) || prev.goals.waterTargetMl,
                  exerciseTargetMin: Number(goals.exerciseTargetMin) || prev.goals.exerciseTargetMin,
                  weightKg: Number(profile?.weightKg) || prev.goals.weightKg,
                }
              : prev.goals;

            return {
              ...prev,
              user: updatedUser,
              goals: updatedGoals,
              weeklyPlan: weeklyPlan && Array.isArray(weeklyPlan.days) ? weeklyPlan : prev.weeklyPlan,
              notifications: notifications && notifications.length > 0 ? notifications : prev.notifications,
            };
          });
        }
      } catch {
        // Offline or server unavailable: seamless fallback to localStorage
      }
    };

    fetchCloudSync();
    return () => {
      isMounted = false;
    };
  }, [isHydrated]);

  // Cross-tab synchronization to avoid stale-state overwrite
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (!e.newValue) {
          setState(DEFAULT_STATE);
          return;
        }
        try {
          const remote = JSON.parse(e.newValue);
          if (!isRecord(remote)) return;
          const currentIso = formatIsoDateOnly(new Date());
          const remoteUser = isRecord(remote.user) ? remote.user : {};
          const remoteGoals = isRecord(remote.goals) ? remote.goals : {};
          const remotePlan = isRecord(remote.weeklyPlan) && Array.isArray(remote.weeklyPlan.days)
            ? remote.weeklyPlan as unknown as WeeklyPlan
            : null;
          setState(prev => {
            const remotePreviousPlan = isRecord(remote.previousWeekPlan) && Array.isArray(remote.previousWeekPlan.days)
              ? remote.previousWeekPlan as unknown as WeeklyPlan
              : prev.previousWeekPlan;
            return {
            ...prev,
            ...remote,
            user: { ...prev.user, ...remoteUser },
            goals: { ...prev.goals, ...remoteGoals },
            notifications: Array.isArray(remote.notifications) ? remote.notifications : prev.notifications,
            today: normalizeTodayForDate(remote.today, currentIso),
            weeklyPlan: remotePlan ? syncPlanDatesToCurrentWeek(remotePlan, new Date()) : prev.weeklyPlan,
            previousWeekPlan: remotePreviousPlan,
            activeTab: prev.activeTab,
            };
          });
        } catch {
          // ignore remote corrupted payload
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Periodic check (every 30s) to detect midnight calendar date change
  useEffect(() => {
    const interval = setInterval(() => {
      const freshIso = formatIsoDateOnly(new Date());
      if (freshIso !== todayIsoDate) {
        setTodayIsoDate(freshIso);
        setState(prev => ({
          ...prev,
          weeklyPlan: syncPlanDatesToCurrentWeek(prev.weeklyPlan, new Date()),
          today: {
            caloriesBurned: 0,
            waterIntakeMl: 0,
            exerciseMinutes: 0,
            sleepHours: 0,
            steps: 0,
            workouts: [],
            meals: [],
            date: freshIso,
          },
        }));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [todayIsoDate]);

  // Save to localStorage with QuotaExceeded resilience
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err: any) {
        // If quota exceeded (e.g. large base64 avatar), protect workout data by stripping avatar
        if (err?.name === 'QuotaExceededError' || err?.code === 22) {
          try {
            const stripped = {
              ...state,
              user: { ...state.user, avatar: '' },
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
          } catch {
            // storage truly exhausted
          }
        }
      }
    }
  }, [state, isHydrated]);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 3800);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToastMessage(null);
  }, []);

  const addNotification = (title: string, description: string, iconType: AppNotification['iconType'] = 'goal') => {
    setState(prev => ({
      ...prev,
      notifications: [
        {
          id: createEntryId('notification'),
          iconType,
          title,
          description,
          timestamp: 'Just now',
          unread: true,
        },
        ...prev.notifications,
      ],
    }));
  };

  const markNotificationsAsRead = () => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, unread: false })),
    }));
  };

  const clearAllNotifications = () => {
    setState(prev => ({
      ...prev,
      notifications: [],
    }));
    showToast('All notifications cleared');
  };

  const unreadNotificationCount = state.notifications.filter(n => n.unread).length;

  const setActiveTab = (tab: TabType) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const setShowOnboarding = (show: boolean) => {
    setState(prev => ({ ...prev, showOnboarding: show }));
  };

  const setShowLogin = (show: boolean) => {
    setState(prev => ({ ...prev, showLogin: show }));
  };

  const setShowOtp = (show: boolean) => {
    setState(prev => ({ ...prev, showOtp: show }));
  };

  const setShowSetName = (show: boolean) => {
    setState(prev => ({ ...prev, showSetName: show }));
  };

  const setShowWelcome = (show: boolean) => {
    setState(prev => ({ ...prev, showWelcome: show }));
  };

  const setUserName = (name: string) => {
    setState(prev => {
      const trimmedName = name.trim() || 'Athlete';
      const avatar = prev.user.avatar || getEmailAvatar(prev.user.email, trimmedName);
      return {
        ...prev,
        user: {
          ...prev.user,
          name: trimmedName,
          avatar,
        },
      };
    });
  };

  const setShowNotifications = (show: boolean) => {
    setState(prev => ({ ...prev, showNotifications: show }));
  };

  const setShowPrivacyPolicy = (show: boolean) => {
    setState(prev => ({ ...prev, showPrivacyPolicy: show }));
  };

  const setShowTerms = (show: boolean) => {
    setState(prev => ({ ...prev, showTerms: show }));
  };

  const setShowHelpCenter = (show: boolean) => {
    setState(prev => ({ ...prev, showHelpCenter: show }));
  };

  const setShowDisclaimer = (show: boolean) => {
    setState(prev => ({ ...prev, showDisclaimer: show }));
  };

  const setShowAccessibilityStatement = (show: boolean) => {
    setState(prev => ({ ...prev, showAccessibilityStatement: show }));
  };

  const setShowNewWeekDialog = (show: boolean) => {
    setState(prev => ({ ...prev, showNewWeekDialog: show }));
  };

  const addWater = (amountMl: number) => {
    setState(prev => {
      const safeAmount = clampFiniteNumber(amountMl, 0, 10000);
      if (safeAmount === 0) return prev;
      const safeWaterTarget = clampFiniteNumber(prev.goals.waterTargetMl, 500, 10000, 2500);
      const newWater = Math.min(safeWaterTarget + 1000, toFiniteNumber(prev.today.waterIntakeMl) + safeAmount);
      const currentTotalXp = (prev.user.level - 1) * 500 + prev.user.xp;
      const progress = computeLevelProgress(currentTotalXp + 25);
      return {
        ...prev,
        today: {
          ...prev.today,
          waterIntakeMl: newWater,
        },
        user: {
          ...prev.user,
          level: progress.level,
          xp: progress.xp,
          xpToNextLevel: progress.xpToNextLevel,
        },
        notifications: [
          {
            id: createEntryId('notification'),
            iconType: 'water',
            title: 'Water Logged',
            description: `You logged +${safeAmount}ml of hydration. Keep reaching your daily goal!`,
            timestamp: 'Just now',
            unread: true,
          },
          ...prev.notifications,
        ],
      };
    });
  };

  const logWorkout = (title: string, durationMin: number, calories: number, category: string = 'Exercise') => {
    setState(prev => {
      const safeDuration = clampFiniteNumber(durationMin, 1, 1440, 1);
      const safeCalories = clampFiniteNumber(calories, 0, 100000);
      const safeTitle = title.trim() || 'Custom Workout';
      const newWorkout: WorkoutLogItem = {
        id: createEntryId('workout'),
        title: safeTitle,
        durationMin: safeDuration,
        calories: safeCalories,
        category,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const newCals = prev.today.caloriesBurned + safeCalories;
      const newMins = prev.today.exerciseMinutes + safeDuration;
      const currentTotalXp = (prev.user.level - 1) * 500 + prev.user.xp;
      const progress = computeLevelProgress(currentTotalXp + 100);
      const newStreak = Math.max(1, prev.user.streakDays || 1);
      return {
        ...prev,
        today: {
          ...prev.today,
          caloriesBurned: newCals,
          exerciseMinutes: newMins,
          workouts: [newWorkout, ...prev.today.workouts],
        },
        user: {
          ...prev.user,
          streakDays: newStreak,
          level: progress.level,
          xp: progress.xp,
          xpToNextLevel: progress.xpToNextLevel,
        },
        notifications: [
          {
            id: createEntryId('notification'),
            iconType: 'workout',
            title: `Workout Logged: ${safeTitle}`,
            description: `Recorded ${safeDuration} min of ${category} burning ${safeCalories} kcal (+100 XP).`,
            timestamp: 'Just now',
            unread: true,
          },
          ...prev.notifications,
        ],
      };
    });
  };

  const logMeal = (name: string, mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack', calories: number) => {
    setState(prev => {
      const safeCalories = clampFiniteNumber(calories, 0, 100000);
      const safeName = name.trim() || `${mealType} Entry`;
      const newMeal: MealLogItem = {
        id: createEntryId('meal'),
        name: safeName,
        mealType,
        calories: safeCalories,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const currentTotalXp = (prev.user.level - 1) * 500 + prev.user.xp;
      const progress = computeLevelProgress(currentTotalXp + 40);
      return {
        ...prev,
        today: {
          ...prev.today,
          meals: [newMeal, ...prev.today.meals],
        },
        user: {
          ...prev.user,
          level: progress.level,
          xp: progress.xp,
          xpToNextLevel: progress.xpToNextLevel,
        },
        notifications: [
          {
            id: createEntryId('notification'),
            iconType: 'goal',
            title: `${mealType} Logged`,
            description: `Added "${safeName}" with ${safeCalories} calories to your daily nutrition log.`,
            timestamp: 'Just now',
            unread: true,
          },
          ...prev.notifications,
        ],
      };
    });
  };

  const updateGoals = (newGoals: Partial<FitFlowState['goals']>) => {
    setState(prev => {
      const calorieTarget = newGoals.calorieTarget !== undefined
        ? clampFiniteNumber(newGoals.calorieTarget, 100, 10000, 650)
        : prev.goals.calorieTarget;
      const waterTargetMl = newGoals.waterTargetMl !== undefined
        ? clampFiniteNumber(newGoals.waterTargetMl, 500, 10000, 2500)
        : prev.goals.waterTargetMl;
      const exerciseTargetMin = newGoals.exerciseTargetMin !== undefined
        ? clampFiniteNumber(newGoals.exerciseTargetMin, 10, 360, 60)
        : prev.goals.exerciseTargetMin;
      const weightKg = newGoals.weightKg !== undefined
        ? clampFiniteNumber(newGoals.weightKg, 20, 300, 68.5)
        : prev.goals.weightKg;

      return {
        ...prev,
        goals: {
          calorieTarget,
          waterTargetMl,
          exerciseTargetMin,
          weightKg,
        },
      };
    });
    showToast('Fitness goals updated!');

    // Background sync to /api/goals
    try {
      fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calorieTarget: newGoals.calorieTarget,
          waterTargetMl: newGoals.waterTargetMl,
          exerciseTargetMin: newGoals.exerciseTargetMin,
        }),
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  const updateUserAvatar = (avatarUrl: string) => {
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        avatar: avatarUrl,
      },
    }));
    showToast('Profile photo updated!');
  };

  const toggleMembership = () => {
    setState(prev => {
      const nextTier = prev.user.membership === 'Pro' ? 'Free' : 'Pro';
      return {
        ...prev,
        user: {
          ...prev.user,
          membership: nextTier,
        },
      };
    });
    showToast(`Membership updated to FitFlow ${state.user.membership === 'Pro' ? 'Free' : 'Pro'}`);
  };

  const resetToDefaults = () => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Reset app data to defaults');
  };

  const requestOtpLogin = (email: string, name?: string, devOtp?: string) => {
    const trimmedEmail = email.trim() || 'athlete@example.com';
    const trimmedName = name?.trim() || '';
    setState(prev => ({
      ...prev,
      showLogin: false,
      showOtp: true,
      pendingOtpEmail: trimmedEmail,
      pendingOtpName: trimmedName,
      pendingDevOtp: devOtp,
    }));
    showToast(`Verification code sent to ${trimmedEmail}`);
  };

  const completeOtpLogin = () => {
    const targetEmail = state.pendingOtpEmail || state.user.email || 'athlete@example.com';
    const targetName = state.pendingOtpName || '';
    loginUser(targetEmail, targetName);

    // Initial background sync to PostgreSQL
    try {
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            membership: 'Free',
            streakDays: 0,
            level: 1,
            xp: 0,
            avatarUrl: getEmailAvatar(targetEmail, targetName),
          },
          goals: state.goals,
          weeklyPlan: state.weeklyPlan,
        }),
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  const loginUser = (email: string, name?: string) => {
    const rawName = name?.trim() || (email ? email.split('@')[0] : 'Athlete');
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    setState(prev => {
      const freshDays = prev.weeklyPlan.days.map(d => ({
        ...d,
        workoutTitle: 'Rest Day',
        isRestDay: true,
        estimatedDurationMin: 0,
        exercises: [],
        completed: false,
        completedAt: undefined,
      }));

      return {
        ...prev,
        showLogin: false,
        showOtp: false,
        showSetName: true,
        user: {
          name: formattedName,
          email: email || '',
          avatar: getEmailAvatar(email, formattedName),
          membership: 'Free',
          streakDays: 0, // Zero streak
          level: 1,
          xp: 0,
          xpToNextLevel: 500,
        },
        today: {
          caloriesBurned: 0,
          waterIntakeMl: 0,
          exerciseMinutes: 0,
          sleepHours: 0,
          steps: 0,
          workouts: [],
          meals: [],
        },
        stepTracking: {
          count: 0,
          status: 'idle',
          isNative: false,
        },
        weeklyPlan: {
          ...prev.weeklyPlan,
          days: freshDays,
        },
        notifications: [
          {
            id: createEntryId('notification'),
            iconType: 'goal',
            title: `Welcome, ${formattedName}!`,
            description: 'Your account is active and started fresh from 0. Plan your week or log your first workout!',
            timestamp: 'Just now',
            unread: true,
          },
        ],
      };
    });

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }

    showToast(`Welcome, ${formattedName}! Ready to train.`);
  };

  const logoutUser = async () => {
    try {
      await signOut();
    } catch {
      // ignore
    }
    clearAuthToken();
    setState({
      ...DEFAULT_STATE,
      showLogin: true,
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast('Logged out. Session reset to 0.');
  };

  // Weekly Planner Handlers
  const saveWeeklyPlan = (updatedPlan: WeeklyPlan) => {
    const planWithTimestamp = {
      ...updatedPlan,
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      weeklyPlan: planWithTimestamp,
    }));
    showToast('Weekly workout plan saved!');

    // Background sync to PostgreSQL
    try {
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklyPlan: planWithTimestamp }),
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  const updateDayWorkout = (dayKey: DayWorkoutPlan['dayKey'], updatedDay: Partial<DayWorkoutPlan>) => {
    setState(prev => {
      const nextDays = prev.weeklyPlan.days.map(d => {
        if (d.dayKey === dayKey) {
          return { ...d, ...updatedDay };
        }
        return d;
      });
      return {
        ...prev,
        weeklyPlan: {
          ...prev.weeklyPlan,
          days: nextDays,
          updatedAt: new Date().toISOString(),
        },
      };
    });
    showToast(`Saved schedule for ${dayKey.toUpperCase()}`);
  };

  const toggleDayCompletion = (dayKey: DayWorkoutPlan['dayKey']) => {
    setState(prev => {
      const targetDay = prev.weeklyPlan.days.find(d => d.dayKey === dayKey);
      if (!targetDay || targetDay.isRestDay) return prev;
      let loggedTitle = '';
      let loggedDuration = 30;
      let isNowComplete = false;
      let completionWorkoutId: string | undefined;

      const nextDays = prev.weeklyPlan.days.map(d => {
        if (d.dayKey === dayKey) {
          isNowComplete = !d.completed;
          loggedTitle = d.workoutTitle;
          loggedDuration = d.estimatedDurationMin || 25;
          return {
            ...d,
            completed: isNowComplete,
            completionWorkoutId: isNowComplete ? createEntryId('plan-workout') : undefined,
            completedAt: isNowComplete
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined,
          };
        }
        return d;
      });

      const estCals = Math.round(loggedDuration * 8.5);
      const planWorkoutTitle = `Weekly Plan: ${loggedTitle}`;
      let updatedWorkouts = prev.today.workouts;
      let updatedCals = prev.today.caloriesBurned;
      let updatedMins = prev.today.exerciseMinutes;
      let currentTotalXp = (prev.user.level - 1) * 500 + prev.user.xp;

      if (isNowComplete) {
        completionWorkoutId = nextDays.find(d => d.dayKey === dayKey)?.completionWorkoutId;
        updatedWorkouts = [
          {
            id: completionWorkoutId || createEntryId('plan-workout'),
            title: planWorkoutTitle,
            durationMin: loggedDuration,
            calories: estCals,
            category: 'Strength',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev.today.workouts,
        ];
        updatedCals += estCals;
        updatedMins += loggedDuration;
        currentTotalXp += 120;
      } else {
        const workoutIdx = prev.today.workouts.findIndex(w =>
          targetDay.completionWorkoutId ? w.id === targetDay.completionWorkoutId : w.title === planWorkoutTitle
        );
        if (workoutIdx !== -1) {
          const removed = prev.today.workouts[workoutIdx];
          updatedWorkouts = prev.today.workouts.filter((_, idx) => idx !== workoutIdx);
          updatedCals = Math.max(0, updatedCals - removed.calories);
          updatedMins = Math.max(0, updatedMins - removed.durationMin);
        } else {
          updatedCals = Math.max(0, updatedCals - estCals);
          updatedMins = Math.max(0, updatedMins - loggedDuration);
        }
        currentTotalXp = Math.max(0, currentTotalXp - 120);
      }

      const progress = computeLevelProgress(currentTotalXp);
      const completedCount = nextDays.filter(d => d.completed).length;
      const newStreak = completedCount > 0 || updatedWorkouts.length > 0 ? Math.max(1, prev.user.streakDays || 1) : 0;

      return {
        ...prev,
        weeklyPlan: {
          ...prev.weeklyPlan,
          days: nextDays,
          updatedAt: new Date().toISOString(),
        },
        today: {
          ...prev.today,
          workouts: updatedWorkouts,
          caloriesBurned: updatedCals,
          exerciseMinutes: updatedMins,
        },
        user: {
          ...prev.user,
          streakDays: newStreak,
          level: progress.level,
          xp: progress.xp,
          xpToNextLevel: progress.xpToNextLevel,
        },
      };
    });
    showToast('Workout status updated!');
  };

  const repeatPreviousWeekPlan = () => {
    setState(prev => {
      const sourcePlan = prev.previousWeekPlan || DEFAULT_PREVIOUS_WEEK_PLAN;
      // Map previous exercises and titles to current week's days, resetting completion
      const currentDays = prev.weeklyPlan.days.map(currentDay => {
        const matchingPrev = sourcePlan.days.find(p => p.dayKey === currentDay.dayKey);
        if (matchingPrev) {
          return {
            ...currentDay,
            workoutTitle: matchingPrev.workoutTitle,
            isRestDay: matchingPrev.isRestDay,
            exercises: [...matchingPrev.exercises.map(ex => ({ ...ex, id: Date.now() + Math.random().toString() }))],
            estimatedDurationMin: matchingPrev.estimatedDurationMin,
            completed: false,
            completedAt: undefined,
          };
        }
        return currentDay;
      });

      return {
        ...prev,
        showNewWeekDialog: false,
        weeklyPlan: {
          ...prev.weeklyPlan,
          days: currentDays,
          hasDecidedNewWeek: true,
          updatedAt: new Date().toISOString(),
        },
      };
    });
    showToast("Repeated last week's workout schedule!");
  };

  const createNewWeeklyPlan = () => {
    setState(prev => {
      // Archive current as previous week
      return {
        ...prev,
        previousWeekPlan: prev.weeklyPlan,
        showNewWeekDialog: false,
        weeklyPlan: {
          ...prev.weeklyPlan,
          hasDecidedNewWeek: true,
          days: prev.weeklyPlan.days.map(d => ({
            ...d,
            workoutTitle: d.dayKey === 'thu' || d.dayKey === 'sun' ? 'Rest Day' : 'New Workout',
            isRestDay: d.dayKey === 'thu' || d.dayKey === 'sun',
            exercises: [],
            estimatedDurationMin: 0,
            completed: false,
            completedAt: undefined,
          })),
          updatedAt: new Date().toISOString(),
        },
      };
    });
    showToast('Created new weekly workout schedule');
  };

  const refreshStepCount = useCallback(async () => {
    try {
      const avail = await checkStepAvailability();
      if (!avail.available) {
        setState(prev => ({
          ...prev,
          stepTracking: {
            count: prev.stepTracking.count ?? 0,
            status: 'unavailable',
            isNative: avail.isNative,
            errorMessage: avail.reason,
          },
        }));
        return;
      }
      const auth = await checkStepAuthorization();
      if (!auth.authorized) {
        setState(prev => ({
          ...prev,
          stepTracking: {
            count: prev.stepTracking.count ?? 0,
          status: auth.denied ? 'denied' : 'unauthorized',
            isNative: true,
          },
        }));
        return;
      }
      const result = await getTodayStepCount();
      setState(prev => ({
        ...prev,
        today: { ...prev.today, steps: result.steps ?? 0 },
        stepTracking: {
          count: result.steps ?? 0,
          status: result.status,
          isNative: true,
          errorMessage: result.errorMessage,
        },
      }));
    } catch {
      // ignore
    }
  }, []);

  const requestStepPermission = useCallback(async () => {
    const res = await requestStepAuthorization();
    if (res.granted) {
      await refreshStepCount();
    } else {
      showToast(res.errorMessage || 'Health permission needed');
    }
  }, [refreshStepCount, showToast]);

  const openHealthSettings = useCallback(async () => {
    await openNativeHealthSettings();
  }, []);

  useEffect(() => {
    const cleanup = setupStepForegroundListener(() => {
      refreshStepCount();
    });
    return () => {
      cleanup();
    };
  }, [refreshStepCount]);

  return (
    <FitFlowContext.Provider
      value={{
        ...state,
        isHydrated,
        todayKey,
        todayIsoDate,
        weekInfo,
        setActiveTab,
        setShowOnboarding,
        setShowLogin,
        setShowOtp,
        setShowSetName,
        setShowWelcome,
        setUserName,
        requestOtpLogin,
        completeOtpLogin,
        setShowNotifications,
        setShowPrivacyPolicy,
        setShowTerms,
        setShowHelpCenter,
        setShowDisclaimer,
        setShowAccessibilityStatement,
        setShowNewWeekDialog,
        toastMessage,
        showToast,
        dismissToast,
        addNotification,
        markNotificationsAsRead,
        clearAllNotifications,
        unreadNotificationCount,
        addWater,
        logWorkout,
        logMeal,
        updateGoals,
        updateUserAvatar,
        toggleMembership,
        resetToDefaults,
        loginUser,
        logoutUser,
        saveWeeklyPlan,
        updateDayWorkout,
        toggleDayCompletion,
        repeatPreviousWeekPlan,
        createNewWeeklyPlan,
        refreshStepCount,
        requestStepPermission,
        openHealthSettings,
      }}
    >
      {children}
    </FitFlowContext.Provider>
  );
}

export function useFitFlow() {
  const context = useContext(FitFlowContext);
  if (!context) {
    throw new Error('useFitFlow must be used within a FitFlowProvider');
  }
  return context;
}
