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
    const hasDeviceMotion = typeof window !== 'undefined' && 'DeviceMotionEvent' in window;
    return {
      available: hasDeviceMotion,
      reason: hasDeviceMotion
        ? 'Real-time Web Motion Sensor step tracking available.'
        : 'Browser motion sensors unavailable.',
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
    const hasDeviceMotion = typeof window !== 'undefined' && 'DeviceMotionEvent' in window;
    return { authorized: hasDeviceMotion, denied: false };
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
 * Requests user authorization to read step count data from Health Connect / HealthKit or Motion Sensors.
 */
export async function requestStepAuthorization(): Promise<{
  granted: boolean;
  denied: boolean;
  status: StepStatus;
  errorMessage?: string;
}> {
  if (!Capacitor.isNativePlatform()) {
    if (typeof window !== 'undefined' && typeof (DeviceMotionEvent as any)?.requestPermission === 'function') {
      try {
        const response = await (DeviceMotionEvent as any).requestPermission();
        if (response === 'granted') {
          return { granted: true, denied: false, status: 'available' };
        } else {
          return {
            granted: false,
            denied: true,
            status: 'denied',
            errorMessage: 'Motion sensor permission denied in browser.',
          };
        }
      } catch (err: any) {
        return {
          granted: false,
          denied: false,
          status: 'error',
          errorMessage: err?.message || 'Error requesting Motion sensor permission.',
        };
      }
    }
    return { granted: true, denied: false, status: 'available' };
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

  const sourceGroups = new Map<string, HealthSample[]>();
  for (const s of valid) {
    const src = s.sourceId || s.sourceName || 'device';
    if (!sourceGroups.has(src)) {
      sourceGroups.set(src, []);
    }
    sourceGroups.get(src)!.push(s);
  }

  if (sourceGroups.size === 1) {
    const list = Array.from(sourceGroups.values())[0];
    return Math.round(list.reduce((acc: number, curr: HealthSample) => acc + curr.value, 0));
  }

  let primarySource = '';
  let highestVolume = -1;
  sourceGroups.forEach((list: HealthSample[], src: string) => {
    const vol = list.reduce((acc: number, c: HealthSample) => acc + c.value, 0);
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

/**
 * Reads real device step count for the current calendar day (midnight to now).
 */
export async function getTodayStepCount(): Promise<{
  steps: number | null;
  status: StepStatus;
  errorMessage?: string;
}> {
  if (!Capacitor.isNativePlatform()) {
    return {
      steps: null,
      status: 'available',
    };
  }

  try {
    const avail = await Health.isAvailable();
    if (!avail.available) {
      return {
        steps: null,
        status: 'unavailable',
        errorMessage: avail.reason || 'Health Connect is not available on this device.',
      };
    }

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

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    const startDateIso = startOfDay.toISOString();
    const endDateIso = now.toISOString();

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
    } catch {
      // ignore, fall back to readSamples
    }

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
 * Registers real-time Web Accelerometer / DeviceMotion step counter for PWA/Web view.
 */
export function setupWebMotionStepTracker(onStep: () => void): () => void {
  if (typeof window === 'undefined' || !('DeviceMotionEvent' in window)) {
    return () => {};
  }

  let lastAcceleration = 0;
  let lastStepTime = 0;
  const THRESHOLD = 11.5; // M/s^2 acceleration threshold for step detection
  const COOLDOWN_MS = 280; // Minimum time between consecutive physical steps

  const handleMotion = (event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

    const magnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
    const delta = Math.abs(magnitude - lastAcceleration);
    lastAcceleration = magnitude;

    const now = Date.now();
    if (delta > THRESHOLD && now - lastStepTime > COOLDOWN_MS) {
      lastStepTime = now;
      onStep();
    }
  };

  window.addEventListener('devicemotion', handleMotion, true);
  return () => {
    window.removeEventListener('devicemotion', handleMotion, true);
  };
}

/**
 * Opens Health Connect settings on Android.
 */
export async function openHealthSettings(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      await Health.openHealthConnectSettings();
    } catch {
      // ignore
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
