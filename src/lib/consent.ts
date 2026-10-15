/**
 * Cookie-consent state, stored in a first-party technical cookie.
 *
 * Only the visitor's choice is stored. The record expires after six months
 * (the Italian Garante's guidance on re-proposing the banner), and bumping
 * CONSENT_VERSION invalidates older records when the cookie policy changes
 * in a way that needs fresh consent.
 *
 * Everything here is client-only; the server never reads consent, so
 * statically generated pages stay identical for every visitor.
 */

export const CONSENT_COOKIE = 'lankio_consent';
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 180;

export type ConsentCategories = {
  /** Google Analytics 4. Off unless the visitor opts in. */
  analytics: boolean;
};

export type ConsentRecord = ConsentCategories & {
  v: number;
  /** Epoch ms when the choice was made. */
  ts: number;
};

const OPEN_EVENT = 'lankio:open-consent';
const CHANGE_EVENT = 'lankio:consent-change';
const MAX_AGE_MS = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

/** Parses a raw cookie value. Invalid, outdated or expired records return null. */
export function parseConsent(raw: string | undefined | null, now = Date.now()): ConsentRecord | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentRecord>;
    if (data.v !== CONSENT_VERSION) return null;
    if (typeof data.ts !== 'number' || now - data.ts > MAX_AGE_MS || data.ts > now + 60_000) return null;
    if (typeof data.analytics !== 'boolean') return null;
    return { v: data.v, ts: data.ts, analytics: data.analytics };
  } catch {
    return null;
  }
}

export function serializeConsent(record: ConsentRecord): string {
  return encodeURIComponent(JSON.stringify({ v: record.v, ts: record.ts, analytics: record.analytics }));
}

function readCookie(name: string): string | undefined {
  const prefix = `${name}=`;
  return document.cookie
    .split('; ')
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);
}

// useSyncExternalStore needs a referentially stable snapshot, so the parsed
// record is cached against the raw cookie string.
let cachedRaw: string | undefined;
let cachedRecord: ConsentRecord | null = null;

export function getConsent(): ConsentRecord | null {
  const raw = readCookie(CONSENT_COOKIE);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedRecord = parseConsent(raw);
  }
  return cachedRecord;
}

export function saveConsent(categories: ConsentCategories): void {
  const record: ConsentRecord = { v: CONSENT_VERSION, ts: Date.now(), ...categories };
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${serializeConsent(record)}; Max-Age=${CONSENT_MAX_AGE_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeConsent(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

/**
 * Inline <head> script. The banner is server-rendered (so it paints with
 * the page instead of popping in after hydration and becoming the LCP
 * element); this marks <html data-consent="set"> before first paint when
 * a valid record exists, and CSS hides the banner for returning visitors.
 * Mirrors parseConsent -- the unit tests keep the two in sync.
 */
export const CONSENT_BOOT_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]*)/);if(!m)return;var c=JSON.parse(decodeURIComponent(m[1]));var n=Date.now();if(c.v===${CONSENT_VERSION}&&typeof c.ts==='number'&&n-c.ts<=${MAX_AGE_MS}&&c.ts<=n+60000&&typeof c.analytics==='boolean'){document.documentElement.setAttribute('data-consent','set')}}catch(e){}})();`;

/** Opens the preferences dialog from anywhere (footer, cookie policy). */
export function openConsentPreferences(): void {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenConsentPreferences(callback: () => void): () => void {
  window.addEventListener(OPEN_EVENT, callback);
  return () => window.removeEventListener(OPEN_EVENT, callback);
}
