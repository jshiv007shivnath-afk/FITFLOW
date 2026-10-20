/**
 * FitFlow Product Telemetry & Analytics Engine
 * Supports PostHog event tracking via official capture endpoint.
 * Zero heavy dependencies, works seamlessly in browser and Next.js.
 */

interface AnalyticsEventProperties {
  [key: string]: unknown;
}

class AnalyticsService {
  private apiKey: string | null = null;
  private apiHost: string = 'https://us.i.posthog.com';
  private distinctId: string = 'anon_athlete';
  private initialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || null;
      this.apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
      this.distinctId = this.getOrCreateDistinctId();
      this.initialized = true;
    }
  }

  private getOrCreateDistinctId(): string {
    if (typeof window === 'undefined') return 'server_actor';
    try {
      const stored = localStorage.getItem('fitflow_analytics_id');
      if (stored) return stored;
      const newId = `ath_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      localStorage.setItem('fitflow_analytics_id', newId);
      return newId;
    } catch {
      return `ath_${Date.now()}`;
    }
  }

  public identify(userId: string, traits?: AnalyticsEventProperties): void {
    if (!userId) return;
    this.distinctId = userId;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('fitflow_analytics_id', userId);
      } catch {
        // ignore
      }
    }

    this.track('$identify', {
      $set: traits || {},
      userId,
    });
  }

  public track(eventName: string, properties: AnalyticsEventProperties = {}): void {
    if (typeof window === 'undefined') return;

    const payload = {
      api_key: this.apiKey,
      event: eventName,
      properties: {
        distinct_id: this.distinctId,
        $current_url: window.location.href,
        $pathname: window.location.pathname,
        $browser: navigator.userAgent,
        $time: new Date().toISOString(),
        ...properties,
      },
      timestamp: new Date().toISOString(),
    };

    if (!this.apiKey) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`📊 [FitFlow Telemetry Mock] Event: "${eventName}"`, properties);
      }
      return;
    }

    try {
      fetch(`${this.apiHost}/capture/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors',
        keepalive: true,
      }).catch((err) => {
        console.warn('[FitFlow Analytics] Telemetry stream error:', err);
      });
    } catch {
      // offline fallback
    }
  }

  public page(pageName: string, properties: AnalyticsEventProperties = {}): void {
    this.track('$pageview', {
      page: pageName,
      ...properties,
    });
  }
}

export const analytics = new AnalyticsService();
