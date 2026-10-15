import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { interceptAnalytics, presetConsent, scrollThrough } from '../support/helpers';

const axeSource = readFileSync(join(process.cwd(), 'node_modules/axe-core/axe.min.js'), 'utf8');

async function axeViolations(page: Page) {
  await page.addScriptTag({ content: axeSource });
  return page.evaluate(async () => {
    const axe = (window as unknown as { axe: { run: (ctx: Document, opts: object) => Promise<{ violations: { id: string; nodes: { target: string[] }[] }[] }> } }).axe;
    const result = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] });
    return result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  });
}

test.use({ viewport: { width: 1440, height: 900 }, contextOptions: { reducedMotion: 'reduce' } });

for (const path of ['/en', '/it/work', '/en/work/wildscape-sri-lanka', '/en/expertise', '/it/about', '/en/contact', '/en/cookie-policy']) {
  test(`no axe violations on ${path}`, async ({ page, context }) => {
    await presetConsent(context);
    await interceptAnalytics(page);
    await page.goto(path, { waitUntil: 'networkidle' });
    await scrollThrough(page);
    await page.waitForTimeout(800);
    expect(await axeViolations(page)).toEqual([]);
  });
}

test('no axe violations with the consent banner and dialog open', async ({ page }) => {
  await interceptAnalytics(page);
  await page.goto('/it', { waitUntil: 'networkidle' });
  await expect(page.getByRole('region', { name: 'Le tue scelte sulla privacy' })).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);
  await page.getByRole('button', { name: 'Preferenze' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await axeViolations(page)).toEqual([]);
});
