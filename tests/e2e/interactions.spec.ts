import { test, expect } from '@playwright/test';
import { interceptAnalytics, presetConsent } from '../support/helpers';

test.beforeEach(async ({ context, page }) => {
  await presetConsent(context);
  await interceptAnalytics(page);
});

test.describe('desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('work filters, shareable category and hidden empty categories', async ({ page }) => {
    await page.goto('/en/work', { waitUntil: 'networkidle' });
    const cards = page.locator('main li article');
    await expect(cards).toHaveCount(4);

    const apps = page.getByRole('button', { name: 'AI & Applications' });
    await apps.click();
    await expect(cards).toHaveCount(2);
    await expect(apps).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(/\?category=apps$/);
    await expect(page.getByRole('button', { name: 'Motion & Animation' })).toHaveCount(0);

    await page.goto('/en/work?category=branding', { waitUntil: 'networkidle' });
    await expect(cards).toHaveCount(1);
  });

  test('language switch keeps the current page', async ({ page }) => {
    await page.goto('/en/work/lankio-learn', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: /Switch language/ }).first().click();
    await expect(page).toHaveURL(/\/it\/work\/lankio-learn$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'it');
  });

  test('skip link is the first tab stop', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  });

  test('case study shows verified facts and a safe live link', async ({ page }) => {
    await page.goto('/en/work/wildscape-sri-lanka', { waitUntil: 'networkidle' });
    await expect(page.getByText('Professional project', { exact: true }).first()).toBeAttached();
    const live = page.getByRole('link', { name: /Visit Wildscape Sri Lanka live site/ });
    await expect(live).toHaveAttribute('href', 'https://www.wildscapesrilanka.com/');
    await expect(live).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(live).toHaveAttribute('target', '_blank');
  });
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test('menu opens, locks scroll, closes on Escape and after navigation', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');

    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();

    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.locator('header nav').last().getByRole('link', { name: /^Work/ }).click();
    await expect(page).toHaveURL(/\/en\/work$/);
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  });
});
