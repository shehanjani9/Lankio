import type { BrowserContext, Page } from '@playwright/test';

export const MOCK_RESEND = 'http://localhost:3901';
export const GA_HOSTS = /googletagmanager\.com|google-analytics\.com|analytics\.google\.com/;

/** Pre-records a "rejected" consent so the banner doesn't cover content. */
export async function presetConsent(context: BrowserContext, analytics = false) {
  const value = encodeURIComponent(JSON.stringify({ v: 1, ts: Date.now(), analytics }));
  await context.addCookies([{ name: 'lankio_consent', value, url: 'http://localhost:3100' }]);
}

/**
 * Keeps tests hermetic: Google Analytics requests are answered locally
 * with an empty script and recorded, never sent to Google.
 */
export async function interceptAnalytics(page: Page) {
  const requests: string[] = [];
  await page.route(GA_HOSTS, (route) => {
    requests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });
  return requests;
}

export async function mockReset() {
  await fetch(`${MOCK_RESEND}/__reset`, { method: 'POST' });
}

export async function mockMode(mode: 'ok' | 'fail' | 'flaky') {
  await fetch(`${MOCK_RESEND}/__mode`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ mode }),
  });
}

export async function mockSent(): Promise<Record<string, unknown>[]> {
  return (await fetch(`${MOCK_RESEND}/__sent`)).json();
}

/** Scrolls through the page so scroll-triggered content is revealed. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
}
