'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // Listen for custom consent update events triggered by CookieConsent component
    const handleConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ analytics: boolean }>;
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        const consentState = customEvent.detail.analytics ? 'granted' : 'denied';
        window.gtag('consent', 'update', {
          analytics_storage: consentState,
          ad_storage: consentState,
          ad_user_data: consentState,
          ad_personalization: consentState,
        });
      }
    };

    window.addEventListener('cookie-consent-update', handleConsentUpdate);
    return () => {
      window.removeEventListener('cookie-consent-update', handleConsentUpdate);
    };
  }, []);

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        id="google-analytics-consent-default"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Default consent state based on saved user preference
            var savedConsent = null;
            try {
              savedConsent = localStorage.getItem('padel_cookie_consent');
            } catch (e) {}

            var isGranted = savedConsent === 'granted';

            gtag('consent', 'default', {
              'analytics_storage': isGranted ? 'granted' : 'denied',
              'ad_storage': isGranted ? 'granted' : 'denied',
              'ad_user_data': isGranted ? 'granted' : 'denied',
              'ad_personalization': isGranted ? 'granted' : 'denied',
              'wait_for_update': 500
            });
          `,
        }}
      />
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

// Add global TypeScript interface for window.gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

