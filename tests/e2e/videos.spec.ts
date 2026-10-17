import { test, expect, type Page } from '@playwright/test';
import { interceptAnalytics, presetConsent } from '../support/helpers';

const YOUTUBE = /youtube\.com|youtube-nocookie\.com|ytimg\.com|googlevideo\.com/;

/** Counts YouTube requests and answers them locally (tests never reach YouTube). */
async function trackYouTube(page: Page) {
  const hits: string[] = [];
  await page.route(YOUTUBE, (route) => {
    hits.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>player</title>' });
  });
  return hits;
}

test.beforeEach(async ({ context, page }) => {
  await presetConsent(context);
  await interceptAnalytics(page);
});

for (const [locale, id] of [
  ['it', '2__O6mYxPbY'],
  ['en', 'xrAsNFO-cwI'],
] as const) {
  for (const path of [`/${locale}`, `/${locale}/about`]) {
    test(`${path} shows the ${locale} introduction, click-to-load`, async ({ page }) => {
      const hits = await trackYouTube(page);
      await page.goto(path, { waitUntil: 'networkidle' });
      const play = page.getByRole('button', { name: /^(Play|Riproduci):/ });
      await expect(play).toHaveCount(1);
      await play.scrollIntoViewIfNeeded();
      await page.waitForLoadState('networkidle');
      expect(hits, 'nothing loads from YouTube before play').toHaveLength(0);

      await play.click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      const src = await dialog.locator('iframe').getAttribute('src');
      expect(src).toContain(`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`);
      await expect.poll(() => hits.some((url) => url.includes(id))).toBe(true);

      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(play).toBeFocused();
    });
  }
}

test('work page shows one featured film and seven vertical Shorts', async ({ page }) => {
  const hits = await trackYouTube(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/work', { waitUntil: 'networkidle' });
  const section = page.locator('section[aria-labelledby="video-title"]');
  await expect(section.getByRole('button', { name: /^Play:/ })).toHaveCount(8);
  await expect(section.locator('ul > li')).toHaveCount(7);

  const short = section.locator('ul > li').first().getByRole('button');
  const box = await short.boundingBox();
  expect(box!.height / box!.width).toBeCloseTo(16 / 9, 1);
  expect(hits).toHaveLength(0);

  await short.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('iframe')).toHaveAttribute('src', /embed\/6nixCD4p-IE\?/);
  await expect(dialog.getByRole('link', { name: /on YouTube/ })).toHaveAttribute('href', 'https://www.youtube.com/shorts/6nixCD4p-IE');
  await dialog.getByRole('button', { name: 'Close video' }).click();
  await expect(dialog).toHaveCount(0);
});
