import { Capacitor } from '@capacitor/core';
import { Health, HealthSample } from '@capgo/capacitor-health';
import { App } from '@capacitor/app';

export type StepStatus =
  | 'idle'
  | 'loading'
  | 'available'
  | 'unauthorized'
  | 'denied'
  | 'unavailable'
  | 'error';

export interface StepTrackingState {
  count: number | null;
  status: StepStatus;
  errorMessage?: string;
  lastUpdated?: string;
  isNative: boolean;
}

/**
 * Checks whether native step tracking SDK (Health Connect on Android / HealthKit on iOS) is available.
 */
export async function checkStepAvailability(): Promise<{
  available: boolean;
  reason?: string;
  isNative: boolean;
}> {
  const isNative = Capacitor.isNativePlatform();
  if (!isNative) {
    return {
      available: false,
      reason: 'Physical step counter requires running on a native Android device with Health Connect.',
      isNative: false,
    };
  }

  try {
    const res = await Health.isAvailable();
    return {
      available: res.available,
      reason: res.reason,
      isNative: true,
    };
  } catch (err: any) {
    return {
      available: false,
      reason: err?.message || 'Failed to check Health SDK availability',
      isNative: true,
    };
  }
}

/**
 * Checks existing authorization for reading steps without prompting the user.
 */
export async function checkStepAuthorization(): Promise<{
  authorized: boolean;
  denied: boolean;
}> {
  if (!Capacitor.isNativePlatform()) {
    return { authorized: false, denied: false };
  }

  try {
    const status = await Health.checkAuthorization({
      read: ['steps'],
    });
    return {
      authorized: status.readAuthorized.includes('steps'),
      denied: status.readDenied.includes('steps'),
    };
  } catch {
    return { authorized: false, denied: false };
  }
}

/**
 * Requests user authorization to read step count data from Health Connect / HealthKit.
 */
export async function requestStepAuthorization(): Promise<{
  granted: boolean;
  denied: boolean;
  status: StepStatus;
  errorMessage?: string;
}> {
  if (!Capacitor.isNativePlatform()) {
    return {
      granted: false,
      denied: false,
      status: 'unavailable',
      errorMessage: 'Device health sensors are unavailable on web browser. Run on native Android phone.',
    };
  }

  try {
    const avail = await Health.isAvailable();
    if (!avail.available) {
      return {
        granted: false,
        denied: false,
        status: 'unavailable',
        errorMessage: avail.reason || 'Health Connect is not available on this device.',
      };
    }

    const res = await Health.requestAuthorization({
      read: ['steps'],
    });

    const isGranted = res.readAuthorized.includes('steps');
    const isDenied = res.readDenied.includes('steps');

    if (isGranted) {
      return { granted: true, denied: false, status: 'available' };
    } else if (isDenied) {
      return {
        granted: false,
        denied: true,
        status: 'denied',
        errorMessage: 'Health Connect step reading permission was denied.',
      };
    } else {
      return {
        granted: false,
        denied: false,
        status: 'unauthorized',
        errorMessage: 'Step permission not granted.',
      };
    }
  } catch (err: any) {
    return {
      granted: false,
      denied: false,
      status: 'error',
      errorMessage: err?.message || 'Error requesting Health Connect permission.',
    };
  }
}

/**
 * Deduplicates raw step samples to prevent double-counting overlapping time intervals or multiple data sources.
 */
export function calculateDeduplicatedSteps(samples: HealthSample[]): number {
  if (!samples || samples.length === 0) return 0;

  const valid = samples.filter((s) => s && typeof s.value === 'number' && s.value > 0);
  if (valid.length === 0) return 0;

  // Group by data source
  const sourceGroups = new Map<string, HealthSample[]>();
  for (const s of valid) {
    const src = s.sourceId || s.sourceName || 'device';
    if (!sourceGroups.has(src)) {
      sourceGroups.set(src, []);
    }
    sourceGroups.get(src)!.push(s);
  }

  // If only a single data source produced step records, sum its non-overlapping samples
  if (sourceGroups.size === 1) {
    const list = Array.from(sourceGroups.values())[0];
    return Math.round(list.reduce((acc: number, curr: HealthSample) => acc + curr.value, 0));
  }

  // If multiple data sources produced records (e.g., phone sensor + smartwatch + third-party app),
  // select the highest-volume primary source and deduplicate overlapping intervals.
  let primarySource = '';
  let highestVolume = -1;
  sourceGroups.forEach((list: HealthSample[], src: string) => {
    const vol = list.reduce((acc: number, c: HealthSample) => acc + c.value, 0);
    if (vol > highestVolume) {
      highestVolume = vol;
      primarySource = src;
    }
  });

  // Sort samples chronologically by start timestamp
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
      // Disjoint non-overlapping window: count full sample
      totalSteps += sample.value;
      currentCoveredEnd = Math.max(currentCoveredEnd, end);
    } else {
      // Overlaps with an already counted time window
      // Only extend if it belongs to primary source and reaches beyond current window
      if (isPrimary && end > currentCoveredEnd) {
        const fullDuration = Math.max(1, end - start);
        const uncoveredDuration = end - currentCoveredEnd;
        const ratio = Math.min(1, Math.max(0, uncoveredDuration / fullDuration));
        totalSteps += Math.round(sample.value * ratio);
        currentCoveredEnd = end;
      }
      // Overlapping secondary source samples are discarded to prevent double-counting
    }
  }

  return Math.round(totalSteps);
}

/**
 * Reads real device step count for the current calendar day (midnight to now).
 * Uses system-level aggregation first (Health Connect deduplication engine),
 * with sample-level interval deduplication fallback.
 */
export async function getTodayStepCount(): Promise<{
  steps: number | null;
  status: StepStatus;
  errorMessage?: string;
}> {
  if (!Capacitor.isNativePlatform()) {
    return {
      steps: null,
      status: 'unavailable',
      errorMessage: 'Device sensors unavailable in browser. Run on native Android phone.',
    };
  }

  try {
    // 1. Verify SDK availability
    const avail = await Health.isAvailable();
    if (!avail.available) {
      return {
        steps: null,
        status: 'unavailable',
        errorMessage: avail.reason || 'Health Connect is not available on this device.',
      };
    }

    // 2. Check authorization
    const auth = await Health.checkAuthorization({ read: ['steps'] });
    if (!auth.readAuthorized.includes('steps')) {
      if (auth.readDenied.includes('steps')) {
        return {
          steps: null,
          status: 'denied',
          errorMessage: 'Step reading permission denied in Health Connect.',
        };
      }
      return {
        steps: null,
        status: 'unauthorized',
        errorMessage: 'Step reading permission required.',
      };
    }

    // 3. Define today's time range: start of today (midnight) to now
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    const startDateIso = startOfDay.toISOString();
    const endDateIso = now.toISOString();

    // 4. Primary: Try system-level aggregated query (Health Connect's built-in deduplication engine)
    try {
      const aggResult = await Health.queryAggregated({
        dataType: 'steps',
        startDate: startDateIso,
        endDate: endDateIso,
        bucket: 'day',
        aggregation: 'sum',
      });

      if (aggResult && aggResult.samples && aggResult.samples.length > 0) {
        const total = aggResult.samples.reduce((sum, item) => sum + (item.value || 0), 0);
        return {
          steps: Math.max(0, Math.round(total)),
          status: 'available',
        };
      }
    } catch (aggErr) {
      console.warn('queryAggregated failed, falling back to readSamples:', aggErr);
    }

    // 5. Fallback: Query raw step samples and calculate with custom interval deduplication
    const samplesResult = await Health.readSamples({
      dataType: 'steps',
      startDate: startDateIso,
      endDate: endDateIso,
      limit: 1000,
    });

    if (samplesResult && samplesResult.samples) {
      const computed = calculateDeduplicatedSteps(samplesResult.samples);
      return {
        steps: computed,
        status: 'available',
      };
    }

    return {
      steps: 0,
      status: 'available',
    };
  } catch (err: any) {
    return {
      steps: null,
      status: 'error',
      errorMessage: err?.message || 'Failed to read step data from Health Connect.',
    };
  }
}

/**
 * Opens Health Connect settings on Android.
 */
export async function openHealthSettings(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      await Health.openHealthConnectSettings();
    } catch (e) {
      console.error('Failed to open Health Connect settings:', e);
    }
  }
}

/**
 * Registers foreground & visibility change listeners to refresh steps when the app resumes.
 */
export function setupStepForegroundListener(onForeground: () => void): () => void {
  let isCleanedUp = false;
  let removeAppListener: (() => void) | undefined;

  if (Capacitor.isNativePlatform()) {
    App.addListener('appStateChange', (state) => {
      if (state.isActive) {
        onForeground();
      }
    }).then((handle) => {
      if (isCleanedUp) {
        handle.remove();
      } else {
        removeAppListener = () => handle.remove();
      }
    }).catch(() => {
      // ignore
    });
  }

  // Also support document visibility changes for hybrid/webview
  const handleVisibilityChange = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      onForeground();
    }
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  return () => {
    isCleanedUp = true;
    if (removeAppListener) {
      removeAppListener();
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  };
}
