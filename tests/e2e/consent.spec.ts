import { test, expect, type Page } from '@playwright/test';
import { interceptAnalytics, presetConsent } from '../support/helpers';

const GA_COOKIE = /^_ga/;

async function gaCookies(page: Page) {
  return (await page.context().cookies()).filter((cookie) => GA_COOKIE.test(cookie.name));
}

async function storedConsent(page: Page) {
  const cookie = (await page.context().cookies()).find((c) => c.name === 'lankio_consent');
  return cookie ? JSON.parse(decodeURIComponent(cookie.value)) : null;
}

test.describe('cookie consent', () => {
  test('no analytics before consent, and the banner offers equal choices', async ({ page }) => {
    const ga = await interceptAnalytics(page);
    await page.goto('/en', { waitUntil: 'networkidle' });

    const banner = page.getByRole('region', { name: 'Your privacy choices' });
    await expect(banner).toBeVisible();
    expect(ga).toHaveLength(0);
    expect(await gaCookies(page)).toHaveLength(0);
    expect(await storedConsent(page)).toBeNull();
    expect(await page.evaluate(() => typeof (window as unknown as { gtag?: unknown }).gtag)).toBe('undefined');

    const accept = banner.getByRole('button', { name: 'Accept', exact: true });
    const reject = banner.getByRole('button', { name: 'Reject', exact: true });
    await expect(banner.getByRole('button', { name: 'Preferences' })).toBeVisible();
    // Equal prominence: identical classes and size for Accept and Reject.
    expect(await accept.getAttribute('class')).toBe(await reject.getAttribute('class'));
    const [a, r] = [await accept.boundingBox(), await reject.boundingBox()];
    expect(Math.abs(a!.height - r!.height)).toBeLessThan(1);

    // The page stays usable with the banner open (no cookie wall).
    await page.getByRole('link', { name: 'Work', exact: true }).first().click();
    await expect(page).toHaveURL(/\/en\/work$/);
    expect(ga).toHaveLength(0);
  });

  test('before consent, every request stays on the site’s own origin', async ({ page }) => {
    const thirdParty: string[] = [];
    page.on('request', (request) => {
      if (new URL(request.url()).host !== 'localhost:3100') thirdParty.push(request.url());
    });
    for (const path of ['/en', '/en/work/lankio-learn', '/it/contact']) {
      await page.goto(path, { waitUntil: 'networkidle' });
      await page.mouse.wheel(0, 4000);
      await page.waitForTimeout(500);
    }
    expect(thirdParty).toEqual([]);
  });

  test('the banner is in the server HTML, and never flashes for returning visitors', async ({ page, context }) => {
    // Block every JS bundle so the page never hydrates: what remains is the
    // server HTML plus the inline boot script.
    await page.route(/\/_next\/static\/.*\.js/, (route) => route.abort());
    await page.goto('/en', { waitUntil: 'load' });
    await expect(page.getByRole('region', { name: 'Your privacy choices' })).toBeVisible();

    await presetConsent(context, false);
    await page.goto('/en', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-consent', 'set');
    await expect(page.locator('[data-consent-banner]')).toBeHidden();
  });

  test('Italian banner', async ({ page }) => {
    await interceptAnalytics(page);
    await page.goto('/it', { waitUntil: 'networkidle' });
    const banner = page.getByRole('region', { name: 'Le tue scelte sulla privacy' });
    await expect(banner.getByRole('button', { name: 'Rifiuta', exact: true })).toBeVisible();
    await expect(banner.getByRole('button', { name: 'Accetta', exact: true })).toBeVisible();
  });

  test('reject keeps analytics off across navigation and reloads', async ({ page }) => {
    const ga = await interceptAnalytics(page);
    await page.goto('/en', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Reject', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Your privacy choices' })).toBeHidden();
    expect(await storedConsent(page)).toMatchObject({ v: 1, analytics: false });

    await page.goto('/en/about', { waitUntil: 'networkidle' });
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByRole('region', { name: 'Your privacy choices' })).toHaveCount(0);
    expect(ga).toHaveLength(0);
    expect(await gaCookies(page)).toHaveLength(0);
  });

  test('closing the banner with X is treated as no consent', async ({ page }) => {
    const ga = await interceptAnalytics(page);
    await page.goto('/en', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Close and continue without accepting' }).click();
    expect(await storedConsent(page)).toMatchObject({ analytics: false });
    expect(ga).toHaveLength(0);
  });

  test('accept loads analytics only afterwards, with privacy settings', async ({ page }) => {
    const ga = await interceptAnalytics(page);
    await page.goto('/en', { waitUntil: 'networkidle' });
    expect(ga).toHaveLength(0);

    await page.getByRole('button', { name: 'Accept', exact: true }).click();
    await expect.poll(() => ga.length).toBeGreaterThan(0);
    expect(ga[0]).toContain('googletagmanager.com/gtag/js?id=G-');
    expect(await storedConsent(page)).toMatchObject({ analytics: true });

    const config = await page.evaluate(() =>
      ((window as unknown as { dataLayer: IArguments[] }).dataLayer || [])
        .map((args) => Array.from(args))
        .find((args) => args[0] === 'config')
    );
    expect(config?.[2]).toEqual({ allow_google_signals: false, allow_ad_personalization_signals: false });

    // Persisted: a new page view loads analytics without showing the banner.
    const before = ga.length;
    await page.goto('/it/work', { waitUntil: 'networkidle' });
    await expect(page.getByRole('region', { name: 'Le tue scelte sulla privacy' })).toHaveCount(0);
    await expect.poll(() => ga.length).toBeGreaterThan(before);
  });

  test('preferences start with analytics off; saving without changes means no consent', async ({ page }) => {
    const ga = await interceptAnalytics(page);
    await page.goto('/en', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Preferences' }).click();

    const dialog = page.getByRole('dialog', { name: 'Cookie preferences' });
    await expect(dialog).toBeVisible();
    const toggle = dialog.getByRole('switch', { name: 'Analytics (Google Analytics 4)' });
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await dialog.getByRole('button', { name: 'Save preferences' }).click();
    await expect(dialog).toBeHidden();
    expect(await storedConsent(page)).toMatchObject({ analytics: false });
    expect(ga).toHaveLength(0);
  });

  test('preferences can opt in, then consent can be withdrawn from the footer', async ({ page }) => {
    const ga = await interceptAnalytics(page);
    await page.goto('/en', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Preferences' }).click();
    const dialog = page.getByRole('dialog', { name: 'Cookie preferences' });
    await dialog.getByRole('switch').click();
    await dialog.getByRole('button', { name: 'Save preferences' }).click();
    await expect.poll(() => ga.length).toBeGreaterThan(0);

    // Simulate cookies GA would have set, then withdraw consent.
    await page.context().addCookies([
      { name: '_ga', value: 'GA1.1.1.1', url: 'http://localhost:3100' },
      { name: '_ga_3VNPQ6S0LN', value: 'GS1.1.1', url: 'http://localhost:3100' },
    ]);
    await page.getByRole('button', { name: 'Cookie settings' }).click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    await dialog.getByRole('button', { name: 'Reject all' }).click();

    expect(await storedConsent(page)).toMatchObject({ analytics: false });
    await expect.poll(() => gaCookies(page)).toHaveLength(0);
    expect(await page.evaluate(() => (window as unknown as Record<string, unknown>)['ga-disable-G-3VNPQ6S0LN'])).toBe(true);
  });

  test('the dialog is keyboard accessible', async ({ page }) => {
    await interceptAnalytics(page);
    await page.goto('/en', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Preferences' }).focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'Cookie preferences' });
    await expect(dialog).toBeVisible();
    expect(await page.evaluate(() => document.activeElement?.closest('dialog') !== null)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    // Escape changes nothing: no choice recorded, banner returns.
    await expect(page.getByRole('region', { name: 'Your privacy choices' })).toBeVisible();
  });

  test('cookie policy page can reopen preferences', async ({ page, context }) => {
    await presetConsent(context, false);
    await interceptAnalytics(page);
    await page.goto('/it/cookie-policy', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Modifica le impostazioni dei cookie' }).click();
    await expect(page.getByRole('dialog', { name: 'Preferenze cookie' })).toBeVisible();
  });

  test('an expired record asks again and does not load analytics', async ({ page, context }) => {
    const ga = await interceptAnalytics(page);
    const old = encodeURIComponent(JSON.stringify({ v: 1, ts: Date.now() - 200 * 86_400_000, analytics: true }));
    await context.addCookies([{ name: 'lankio_consent', value: old, url: 'http://localhost:3100' }]);
    await page.goto('/en', { waitUntil: 'networkidle' });
    await expect(page.getByRole('region', { name: 'Your privacy choices' })).toBeVisible();
    expect(ga).toHaveLength(0);
  });
});
