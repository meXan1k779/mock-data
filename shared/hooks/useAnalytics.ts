import { useCallback } from 'react';

interface AnalyticsEvent {
  event: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer: AnalyticsEvent[];
  }
}

export const useAnalytics = () => {
  const push = useCallback((payload: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(payload);
    }
  }, []);

  const trackPageview = useCallback(
    (path: string, user?: unknown, event?: string) => {
      push({
        event: event || 'Pageview',
        user: user ?? null,
        page: { path },
      });
    },
    [push],
  );

  return { push, trackPageview };
};
