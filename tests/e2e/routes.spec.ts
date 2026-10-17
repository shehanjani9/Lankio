import { test, expect } from '@playwright/test';
import { interceptAnalytics, presetConsent } from '../support/helpers';

const SITE = 'https://www.lankio.it';
const PATHS = [
  '',
  '/work',
  '/expertise',
  '/about',
  '/contact',
  '/privacy-policy',
  '/cookie-policy',
  '/terms',
  '/work/wildscape-sri-lanka',
  '/work/lankio-learn',
  '/work/lankio-ai-document-analyzer',
  '/work/lankio-digital-solutions',
];

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

for (const locale of ['en', 'it'] as const) {
  for (const path of PATHS) {
    test(`${locale}${path || '/'} renders correctly`, async ({ page, context }) => {
      await presetConsent(context);
      await interceptAnalytics(page);
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(String(error)));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });

      const response = await page.goto(`/${locale}${path}`, { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);

      const info = await page.evaluate(() => ({
        h1: document.querySelectorAll('h1').length,
        lang: document.documentElement.lang,
        canonical: document.querySelector<HTMLLinkElement>('link[rel=canonical]')?.href,
        hreflang: [...document.querySelectorAll<HTMLLinkElement>('link[rel=alternate][hreflang]')]
          .map((link) => link.hreflang)
          .sort()
          .join(','),
        title: document.title,
        description: document.querySelector<HTMLMetaElement>('meta[name=description]')?.content,
        ogImage: document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        jsonLdValid: [...document.querySelectorAll('script[type="application/ld+json"]')].every((script) => {
          try {
            JSON.parse(script.textContent ?? '');
            return true;
          } catch {
            return false;
          }
        }),
        imagesWithoutAlt: [...document.querySelectorAll('img')].filter((img) => !img.hasAttribute('alt')).length,
        hasPrice: /€\s?\d|\d\s?€|\/mo\b|\/mese/i.test(document.body.innerText),
      }));

      expect(info.h1).toBe(1);
      expect(info.lang).toBe(locale);
      expect(info.canonical).toBe(`${SITE}/${locale}${path}`);
      expect(info.hreflang).toBe('en,it,x-default');
      expect(info.title).toBeTruthy();
      expect(info.description).toBeTruthy();
      expect(info.ogImage).toMatch(/^https:\/\/www\.lankio\.it\/.+opengraph-image/);
      expect(info.overflow).toBeLessThanOrEqual(0);
      expect(info.jsonLdValid).toBe(true);
      expect(info.imagesWithoutAlt).toBe(0);
      expect(info.hasPrice).toBe(false);
      expect(errors).toEqual([]);
    });
  }
}

test('retired routes redirect permanently', async ({ request }) => {
  const cases = [
    ['/en/templates', '/en/work'],
    ['/it/audit', '/it/contact'],
    ['/en/faq', '/en/contact'],
    ['/en/pricing', '/en/contact'],
  ];
  for (const [from, to] of cases) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(308);
    expect(response.headers().location).toBe(to);
  }
});

test('unknown pages and drafts are 404s', async ({ request }) => {
  for (const path of ['/en/nope', '/it/work/multi-color-flowers-recruitment-ad', '/en/work/does-not-exist']) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
  expect(await (await request.get('/it/nope')).text()).toContain('Questa pagina non esiste');
});

test('sitemap, robots, icon, OG images and security headers', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap.match(/<url>/g)).toHaveLength(24);
  expect(sitemap).toContain('hreflang="x-default"');
  expect(sitemap).not.toContain('multi-color');
  expect(sitemap).not.toContain('localhost');

  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  expect((await request.get('/icon.svg')).status()).toBe(200);
  expect((await request.get('/favicon.ico')).status()).toBe(200);
  const home = await (await request.get('/en')).text();
  const appleIcon = home.match(/rel="apple-touch-icon" href="([^"]+)"/)?.[1]?.replace(/&amp;/g, '&');
  expect((await request.get(appleIcon!)).headers()['content-type']).toBe('image/png');
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  for (const icon of manifest.icons) expect((await request.get(icon.src)).status(), icon.src).toBe(200);

  for (const page of ['/it', '/en/work/lankio-learn', '/en/about']) {
    const html = await (await request.get(page)).text();
    const og = html.match(/property="og:image" content="([^"]+)"/)?.[1]?.replace(SITE, '').replace(/&amp;/g, '&');
    const image = await request.get(og!);
    expect(image.status(), page).toBe(200);
    expect(image.headers()['content-type']).toBe('image/png');
  }

  const headers = (await request.get('/en')).headers();
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['strict-transport-security']).toContain('max-age=');
  expect(headers['x-powered-by']).toBeUndefined();
});

test('the root redirects to a locale', async ({ request }) => {
  const english = await request.get('/', { maxRedirects: 0, headers: { 'accept-language': 'en-GB,en;q=0.9' } });
  expect(english.headers().location).toMatch(/\/en$/);
  const italian = await request.get('/', { maxRedirects: 0, headers: { 'accept-language': 'it-IT,it;q=0.9' } });
  expect(italian.headers().location).toMatch(/\/it$/);
});
