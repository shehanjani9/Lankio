'use client';

import { useEffect } from 'react';

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  [key: `ga-disable-${string}`]: boolean | undefined;
};

const SCRIPT_ID = 'ga4-gtag';

/**
 * Loads Google Analytics 4 only while analytics consent is granted.
 * Before consent no Google script is requested and no GA cookie is set.
 * When consent is withdrawn, GA is disabled for the rest of the session
 * and its first-party cookies are deleted.
 */
export function Analytics({ gaId, enabled }: { gaId: string; enabled: boolean }) {
  useEffect(() => {
    const w = window as unknown as GtagWindow;
    const disableKey = `ga-disable-${gaId}` as const;

    if (!enabled) {
      if (document.getElementById(SCRIPT_ID)) {
        w[disableKey] = true;
        clearAnalyticsCookies(gaId);
      }
      return;
    }

    w[disableKey] = false;
    w.dataLayer = w.dataLayer || [];
    if (!w.gtag) {
      w.gtag = function gtag() {
        // gtag.js expects the Arguments object, not an array.
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer!.push(arguments);
      };
      w.gtag('js', new Date());
    }
    // Privacy-conscious defaults: no Google Signals, no ad personalisation.
    w.gtag('config', gaId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      document.head.appendChild(script);
    }
  }, [enabled, gaId]);

  return null;
}

/** Removes _ga and _ga_<container> cookies on this host and its parent domains. */
function clearAnalyticsCookies(gaId: string) {
  const names = ['_ga', `_ga_${gaId.replace(/^G-/, '')}`];
  const host = window.location.hostname;
  const parts = host.split('.');
  const domains = new Set<string>(['']);
  for (let i = 0; i < parts.length - 1; i++) {
    const domain = parts.slice(i).join('.');
    domains.add(domain);
    domains.add(`.${domain}`);
  }
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ''}`;
    }
  }
}
