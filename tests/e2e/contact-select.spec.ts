import { test, expect, type Page } from '@playwright/test';
import { interceptAnalytics, presetConsent } from '../support/helpers';

// Regression: native dropdown option text was unreadable (light text on the
// browser's default white list) because the select had a transparent
// background and options had no explicit colours. Native popups can't be
// screenshotted headlessly, so this asserts the computed colours that
// browsers use to paint the option list, plus behaviour.

type Rgba = [number, number, number, number];
const parse = (value: string): Rgba => {
  const [r, g, b, a = 1] = value.match(/[\d.]+/g)!.map(Number);
  return [r, g, b, a];
};
const luminance = ([r, g, b]: Rgba) => {
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};
const contrast = (a: Rgba, b: Rgba) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

async function selectStyles(page: Page, id: string) {
  return page.locator(`#${id}`).evaluate((el: HTMLSelectElement) => {
    const s = getComputedStyle(el);
    return {
      color: s.color,
      background: s.backgroundColor,
      colorScheme: s.colorScheme,
      chevron: s.backgroundImage.startsWith('url('),
      options: [...el.options].map((o) => {
        const os = getComputedStyle(o);
        return { text: o.text, disabled: o.disabled, color: os.color, background: os.backgroundColor };
      }),
    };
  });
}

test.beforeEach(async ({ context, page }) => {
  await presetConsent(context);
  await interceptAnalytics(page);
});

for (const locale of ['en', 'it'] as const) {
  test(`dropdowns have opaque dark backgrounds and readable options (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/contact`, { waitUntil: 'networkidle' });
    for (const id of ['contact-projectType', 'contact-timeline']) {
      const styles = await selectStyles(page, id);
      const background = parse(styles.background);
      expect(background[3], `${id} background must be opaque`).toBe(1);
      expect(styles.colorScheme).toContain('dark');
      expect(styles.chevron).toBe(true);
      expect(contrast(parse(styles.color), background)).toBeGreaterThanOrEqual(4.5);

      expect(styles.options.length).toBeGreaterThan(1);
      for (const option of styles.options) {
        const optionBackground = parse(option.background);
        expect(optionBackground[3], `"${option.text}" needs its own opaque background`).toBe(1);
        expect(contrast(parse(option.color), optionBackground), `"${option.text}"`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
}

test('dropdowns work with the keyboard and with validation (en)', async ({ page }) => {
  await page.goto('/en/contact', { waitUntil: 'networkidle' });
  const projectType = page.locator('#contact-projectType');

  // Validation: an empty required select is flagged...
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(projectType).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Please choose what you need.')).toBeVisible();

  // ...and keyboard selection works and clears the error.
  await projectType.focus();
  await page.keyboard.press('ArrowDown');
  await expect(projectType).toHaveValue('website');
  await expect(projectType).not.toHaveAttribute('aria-invalid', 'true');
  await page.keyboard.press('ArrowDown');
  await expect(projectType).toHaveValue('brand');

  const timeline = page.locator('#contact-timeline');
  await timeline.selectOption('quarter');
  await expect(timeline).toHaveValue('quarter');
  await expect(timeline.locator('option:checked')).toHaveText('Within three months');
});

test('Italian dropdown labels and selection (it)', async ({ page }) => {
  await page.goto('/it/contact', { waitUntil: 'networkidle' });
  const projectType = page.locator('#contact-projectType');
  await expect(projectType.locator('option')).toHaveText([
    'Scegli un’opzione',
    'Sito web o web application',
    'Branding e design',
    'Motion design o animazione',
    'Fotografia o video',
    'Marketing digitale o SEO',
    'Collaborazione o partnership',
    'Altro',
  ]);
  await projectType.selectOption('media');
  await expect(projectType.locator('option:checked')).toHaveText('Fotografia o video');
  await expect(page.locator('#contact-timeline option')).toHaveText([
    'Nessuna scadenza precisa',
    'Flessibili',
    'Entro un mese',
    'Entro tre mesi',
    'Entro fine anno',
  ]);
});
