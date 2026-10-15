import { test, expect } from '@playwright/test';
import { validateContact, singleLine, LIMITS } from '../../src/lib/contact';
import { parseConsent, serializeConsent, CONSENT_VERSION, CONSENT_MAX_AGE_DAYS, CONSENT_BOOT_SCRIPT } from '../../src/lib/consent';
import { getEmailConfig } from '../../src/lib/resend';
import { resolveSiteUrl } from '../../src/config/site';
import { InlineScript } from '../../src/components/inline-script';

test.describe('resolveSiteUrl', () => {
  test('normalises the configured origin', () => {
    expect(resolveSiteUrl('https://www.lankio.it/', 'production')).toBe('https://www.lankio.it');
    expect(resolveSiteUrl(' https://www.lankio.it// ', 'production')).toBe('https://www.lankio.it');
    expect(resolveSiteUrl('https://www.lankio.it/en', 'production')).toBe('https://www.lankio.it');
  });

  test('falls back to the production URL for unusable values', () => {
    expect(resolveSiteUrl(undefined, 'production')).toBe('https://www.lankio.it');
    expect(resolveSiteUrl('www.lankio.it', 'production')).toBe('https://www.lankio.it');
    expect(resolveSiteUrl('ftp://lankio.it', 'production')).toBe('https://www.lankio.it');
    expect(resolveSiteUrl('http://localhost:3000', 'production')).toBe('https://www.lankio.it');
  });

  test('allows localhost during development', () => {
    expect(resolveSiteUrl('http://localhost:3000/', 'development')).toBe('http://localhost:3000');
  });
});

const valid = {
  name: 'Ada Lovelace',
  email: 'Ada@Example.com',
  projectType: 'website',
  message: 'I would like a new website for my studio.',
  language: 'it',
};

test.describe('validateContact', () => {
  test('accepts and normalises a valid inquiry', () => {
    const result = validateContact({ ...valid, company: '  Analytical Engines  ', timeline: 'soon' });
    expect(result.errors).toBeNull();
    expect(result.data).toMatchObject({ email: 'ada@example.com', company: 'Analytical Engines', timeline: 'soon', language: 'it' });
  });

  test('reports each invalid field', () => {
    const result = validateContact({ name: '', email: 'nope', projectType: 'bogus', message: 'short' });
    expect(result.errors).toEqual({ name: 'name', email: 'email', projectType: 'projectType', message: 'message' });
  });

  test('rejects oversized input', () => {
    const result = validateContact({ ...valid, name: 'x'.repeat(LIMITS.name + 1), message: 'y'.repeat(LIMITS.message + 1) });
    expect(result.errors).toMatchObject({ name: 'tooLong', message: 'tooLong' });
  });

  test('strips header-injection characters from single-line fields', () => {
    expect(singleLine('Ada\r\nBcc: victim@example.com')).toBe('Ada Bcc: victim@example.com');
    const result = validateContact({ ...valid, name: 'Ada\r\nBcc: x@y.z' });
    expect(result.data?.name).not.toMatch(/[\r\n]/);
  });

  test('ignores unknown optional values and non-object input', () => {
    expect(validateContact({ ...valid, timeline: 'yesterday', language: 'fr' }).data).toMatchObject({ timeline: undefined, language: 'en' });
    expect(validateContact(null).errors).not.toBeNull();
    expect(validateContact('string').errors).not.toBeNull();
  });
});

test.describe('parseConsent', () => {
  const now = Date.UTC(2026, 9, 15);
  const record = (overrides = {}) => serializeConsent({ v: CONSENT_VERSION, ts: now, analytics: true, ...overrides });

  test('round-trips a valid record', () => {
    expect(parseConsent(record(), now)).toEqual({ v: CONSENT_VERSION, ts: now, analytics: true });
  });

  test('treats missing, malformed, outdated or expired records as no consent', () => {
    expect(parseConsent(undefined, now)).toBeNull();
    expect(parseConsent('%7Bbroken', now)).toBeNull();
    expect(parseConsent(record({ v: CONSENT_VERSION + 1 }), now)).toBeNull();
    const expired = now - (CONSENT_MAX_AGE_DAYS + 1) * 86_400_000;
    expect(parseConsent(record({ ts: expired }), now)).toBeNull();
    expect(parseConsent(record({ ts: now + 86_400_000 }), now)).toBeNull();
    expect(parseConsent(encodeURIComponent(JSON.stringify({ v: CONSENT_VERSION, ts: now, analytics: 'yes' })), now)).toBeNull();
  });
});

test.describe('CONSENT_BOOT_SCRIPT', () => {
  // Runs the inline script against a fake document and reports whether it
  // marked consent as set. It must agree with parseConsent in every case.
  function bootMarks(cookie: string): boolean {
    let marked = false;
    const fakeDocument = { cookie, documentElement: { setAttribute: () => (marked = true) } };
    new Function('document', CONSENT_BOOT_SCRIPT)(fakeDocument);
    return marked;
  }

  test('agrees with parseConsent', () => {
    const now = Date.now();
    const value = (record: object) => encodeURIComponent(JSON.stringify(record));
    const cases = [
      '',
      `other=1; lankio_consent=${value({ v: CONSENT_VERSION, ts: now, analytics: false })}`,
      `lankio_consent=${value({ v: CONSENT_VERSION, ts: now, analytics: true })}; other=2`,
      `lankio_consent=${value({ v: CONSENT_VERSION + 1, ts: now, analytics: true })}`,
      `lankio_consent=${value({ v: CONSENT_VERSION, ts: now - 200 * 86_400_000, analytics: true })}`,
      `lankio_consent=${value({ v: CONSENT_VERSION, ts: now, analytics: 'yes' })}`,
      'lankio_consent=%7Bbroken',
      `xlankio_consent=${value({ v: CONSENT_VERSION, ts: now, analytics: true })}`,
    ];
    for (const cookie of cases) {
      const raw = cookie.split('; ').find((part) => part.startsWith('lankio_consent='))?.slice('lankio_consent='.length);
      expect(bootMarks(cookie), cookie).toBe(parseConsent(raw) !== null);
    }
  });
});

test.describe('InlineScript', () => {
  // React only warns about (and never runs) scripts it creates on the client,
  // unless their type marks them as a non-JavaScript data block.
  type ScriptElement = { type: string; props: { id: string; type: string; suppressHydrationWarning: boolean; dangerouslySetInnerHTML: { __html: string } } };
  const g = globalThis as { window?: unknown };

  test('is executable in server HTML', () => {
    expect(g.window).toBeUndefined();
    const element = InlineScript({ id: 'consent-boot', code: 'void 0' }) as unknown as ScriptElement;
    expect(element.type).toBe('script');
    expect(element.props).toMatchObject({ id: 'consent-boot', type: 'text/javascript', suppressHydrationWarning: true });
    expect(element.props.dangerouslySetInnerHTML.__html).toBe('void 0');
  });

  test('is an inert data block when rendered on the client', () => {
    g.window = {};
    try {
      const element = InlineScript({ id: 'consent-boot', code: 'void 0' }) as unknown as ScriptElement;
      expect(element.props.type).toBe('text/plain');
    } finally {
      delete g.window;
    }
  });

  test('the consent boot script never touches analytics', () => {
    expect(CONSENT_BOOT_SCRIPT).not.toMatch(/gtag|googletagmanager|dataLayer|createElement/);
  });
});

test.describe('getEmailConfig', () => {
  test('requires an API key and never echoes secret values', () => {
    const result = getEmailConfig({ LANKIO_ADMIN_EMAIL: 'a@b.co', LANKIO_FROM_EMAIL: 'Lankio <x@y.co>' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.problems).toEqual(['RESEND_API_KEY is not set']);
  });

  test('accepts a complete configuration', () => {
    const result = getEmailConfig({ RESEND_API_KEY: 're_secret', LANKIO_ADMIN_EMAIL: 'a@b.co', LANKIO_FROM_EMAIL: 'Lankio <x@y.co>' });
    expect(result).toMatchObject({ ok: true, warnings: [] });
  });

  test('falls back to defaults with warnings, and rejects malformed addresses', () => {
    const fallback = getEmailConfig({ RESEND_API_KEY: 're_secret' });
    expect(fallback.ok).toBe(true);
    if (fallback.ok) expect(fallback.warnings).toHaveLength(2);

    const bad = getEmailConfig({ RESEND_API_KEY: 're_secret', LANKIO_ADMIN_EMAIL: 'not-an-email', LANKIO_FROM_EMAIL: 'Lankio' });
    expect(bad.ok).toBe(false);
    if (!bad.ok) {
      expect(bad.problems).toHaveLength(2);
      expect(bad.problems.join(' ')).not.toContain('re_secret');
    }
  });
});
