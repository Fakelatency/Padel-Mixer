'use client';

/**
 * Safely tracks a Google Analytics 4 event if analytics consent has been granted
 * and window.gtag is available.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, params || {});
    } catch (e) {
      console.error('Failed to send GA event:', e);
    }
  }
}
