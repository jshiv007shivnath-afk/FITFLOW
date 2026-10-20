import { DayWorkoutPlan, WeeklyPlan } from '@/context/FitFlowContext';

export const DAY_KEYS: readonly DayWorkoutPlan['dayKey'][] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
];

export const DAY_NAMES: readonly string[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const DAY_INITIALS: readonly string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/**
 * Calculates ISO 8601 week number
 */
export function getIsoWeekNumber(date: Date): number {
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

/** Returns the ISO week-numbering year, which can differ near New Year's Day. */
export function getIsoWeekYear(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  return target.getFullYear();
}

/**
 * Returns today's DayWorkoutPlan dayKey ('mon' | 'tue' | ... | 'sun')
 */
export function getTodayKey(baseDate: Date = new Date()): DayWorkoutPlan['dayKey'] {
  const dayOfWeek = baseDate.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  const index = (dayOfWeek + 6) % 7; // Monday becomes 0, Sunday becomes 6
  return DAY_KEYS[index];
}

/**
 * Formats a Date object as 'YYYY-MM-DD' in local time
 */
export function formatIsoDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface DayInfo {
  dayKey: DayWorkoutPlan['dayKey'];
  dayName: string;
  dayInitial: string;
  shortDate: string; // e.g. "Oct 13"
  dayNumber: string; // e.g. "13"
  fullDate: Date;
  isToday: boolean;
  isoDate: string; // e.g. "2026-10-13"
}

export interface WeekInfo {
  weekId: string;
  weekNumber: number;
  weekLabel: string; // e.g. "Oct 12 - Oct 18, 2026"
  monthYear: string; // e.g. "October 2026"
  days: DayInfo[];
  todayKey: DayWorkoutPlan['dayKey'];
}

/**
 * Generates the full Monday-to-Sunday week structure for the week containing `baseDate`
 */
export function getCurrentWeekInfo(baseDate: Date = new Date()): WeekInfo {
  const now = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const todayIso = formatIsoDateOnly(now);

  const dayOfWeek = now.getDay();
  const daysFromMonday = (dayOfWeek + 6) % 7;

  // Monday start of the week
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysFromMonday);

  // Sunday end of the week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const weekNumber = getIsoWeekNumber(monday);
  const weekId = `${getIsoWeekYear(monday)}-W${String(weekNumber).padStart(2, '0')}`;

  // Format week label using standard hyphen '-'
  const mondayMonth = monday.toLocaleDateString('en-US', { month: 'short' });
  const sundayMonth = sunday.toLocaleDateString('en-US', { month: 'short' });
  const mondayDay = monday.getDate();
  const sundayDay = sunday.getDate();
  const year = sunday.getFullYear();

  let weekLabel = '';
  if (mondayMonth === sundayMonth) {
    weekLabel = `${mondayMonth} ${mondayDay} - ${sundayMonth} ${sundayDay}, ${year}`;
  } else {
    weekLabel = `${mondayMonth} ${mondayDay} - ${sundayMonth} ${sundayDay}, ${year}`;
  }

  // Month + Year for headers
  const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // 7 Days of the week
  const days: DayInfo[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const dIso = formatIsoDateOnly(d);
    const dayKey = DAY_KEYS[i];
    const dayName = DAY_NAMES[i];
    const dayInitial = DAY_INITIALS[i];
    const shortDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayNumber = String(d.getDate()).padStart(2, '0');

    days.push({
      dayKey,
      dayName,
      dayInitial,
      shortDate,
      dayNumber,
      fullDate: d,
      isToday: dIso === todayIso,
      isoDate: dIso,
    });
  }

  return {
    weekId,
    weekNumber,
    weekLabel,
    monthYear,
    days,
    todayKey: getTodayKey(now),
  };
}

/**
 * Synchronizes an existing WeeklyPlan with current calendar dates.
 * Preserves the user's workout routines while updating dates dynamically.
 */
export function syncPlanDatesToCurrentWeek(
  plan: WeeklyPlan,
  baseDate: Date = new Date()
): WeeklyPlan {
  const weekInfo = getCurrentWeekInfo(baseDate);

  const updatedDays: DayWorkoutPlan[] = weekInfo.days.map((dayInfo) => {
    const existingDay = plan.days.find((d) => d.dayKey === dayInfo.dayKey);

    if (existingDay) {
      return {
        ...existingDay,
        dayName: dayInfo.dayName,
        shortDate: dayInfo.shortDate,
        exercises: Array.isArray(existingDay.exercises) ? existingDay.exercises : [],
      };
    }

    return {
      dayKey: dayInfo.dayKey,
      dayName: dayInfo.dayName,
      shortDate: dayInfo.shortDate,
      workoutTitle: dayInfo.dayKey === 'mon' || dayInfo.dayKey === 'thu' || dayInfo.dayKey === 'sun' ? 'Rest Day' : 'Workout Session',
      isRestDay: dayInfo.dayKey === 'mon' || dayInfo.dayKey === 'thu' || dayInfo.dayKey === 'sun',
      estimatedDurationMin: dayInfo.dayKey === 'mon' ? 0 : 35,
      completed: false,
      exercises: [],
    };
  });

  return {
    ...plan,
    weekId: weekInfo.weekId,
    weekLabel: weekInfo.weekLabel,
    weekNumber: weekInfo.weekNumber,
    days: updatedDays,
    updatedAt: new Date().toISOString(),
  };
}
