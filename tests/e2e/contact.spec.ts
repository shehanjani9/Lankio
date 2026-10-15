import { test, expect, type Page } from '@playwright/test';
import { interceptAnalytics, mockMode, mockReset, mockSent, presetConsent } from '../support/helpers';

// These tests share the mock mailbox and the API's rate-limit counter.
test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ context, page }) => {
  await presetConsent(context);
  await interceptAnalytics(page);
  await mockReset();
});

async function fillValidForm(page: Page, overrides: { name?: string; email?: string } = {}) {
  await page.fill('#contact-name', overrides.name ?? 'QA Tester');
  await page.fill('#contact-email', overrides.email ?? 'visitor@example.test');
  await page.fill('#contact-company', 'Example Studio');
  await page.selectOption('#contact-projectType', 'motion');
  await page.selectOption('#contact-timeline', 'quarter');
  await page.fill('#contact-message', 'We need a 30-second vertical recruitment video for social media.');
}

/** The API treats submissions under 3 s from render as bots. */
async function waitPastBotCheck(page: Page) {
  await page.waitForTimeout(3200);
}

test('client-side validation blocks invalid submissions (EN)', async ({ page }) => {
  await page.goto('/en/contact', { waitUntil: 'networkidle' });
  let posted = 0;
  page.on('request', (request) => {
    if (request.url().endsWith('/api/contact')) posted++;
  });
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.getByText('Please check the highlighted fields.')).toBeVisible();
  await expect(page.locator('#contact-name')).toBeFocused();
  await expect(page.locator('#contact-email')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#contact-email')).toHaveAttribute('aria-describedby', 'contact-email-error');
  expect(posted).toBe(0);
});

test('successful inquiry sends notification and confirmation (EN)', async ({ page }) => {
  await page.goto('/en/contact', { waitUntil: 'networkidle' });
  await fillValidForm(page);
  await waitPastBotCheck(page);
  await page.getByRole('button', { name: 'Send inquiry' }).click();

  await expect(page.getByRole('heading', { name: 'Thank you, your message is on its way.' })).toBeFocused();
  const sent = await mockSent();
  expect(sent).toHaveLength(2);
  const [admin, confirmation] = sent;
  expect(admin).toMatchObject({
    from: 'Lankio Test <noreply@example.test>',
    to: 'studio@example.test',
    reply_to: 'visitor@example.test',
    subject: 'New project inquiry from QA Tester',
    authorization: 'present',
  });
  expect(String(admin.html)).toContain('Motion design or animation');
  expect(String(admin.html)).toContain('Within three months');
  expect(confirmation).toMatchObject({ to: 'visitor@example.test', reply_to: 'studio@example.test' });
  expect(String(confirmation.subject)).toContain('received your message');
});

test('Italian inquiry gets an Italian confirmation', async ({ page }) => {
  await page.goto('/it/contact', { waitUntil: 'networkidle' });
  await fillValidForm(page, { name: 'Giulia' });
  await waitPastBotCheck(page);
  await page.getByRole('button', { name: 'Invia la richiesta' }).click();
  await expect(page.getByRole('heading', { name: 'Grazie, il tuo messaggio è stato inviato.' })).toBeVisible();
  const [, confirmation] = await mockSent();
  expect(confirmation.subject).toBe('Ho ricevuto il tuo messaggio — Lankio');
  expect(String(confirmation.html)).toContain('Grazie, Giulia.');
});

test('user input is HTML-escaped in emails', async ({ page }) => {
  await page.goto('/en/contact', { waitUntil: 'networkidle' });
  await fillValidForm(page, { name: '<script>alert(1)</script>' });
  await waitPastBotCheck(page);
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.getByRole('heading', { name: /Thank you/ })).toBeVisible();
  const [admin] = await mockSent();
  expect(String(admin.html)).not.toContain('<script>');
  expect(String(admin.html)).toContain('&lt;script&gt;');
});

test('provider failure shows an error, keeps the input, and a retry succeeds', async ({ page }) => {
  await mockMode('fail');
  await page.goto('/en/contact', { waitUntil: 'networkidle' });
  await fillValidForm(page);
  await waitPastBotCheck(page);
  await page.getByRole('button', { name: 'Send inquiry' }).click();

  await expect(page.getByText(/Something went wrong and your message wasn’t sent/)).toBeVisible();
  await expect(page.locator('#contact-message')).toHaveValue(/recruitment video/);
  // The server retried once before giving up.
  expect((await mockSent()).length).toBe(2);

  // An immediate retry must not be mistaken for a bot.
  await mockReset();
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.getByRole('heading', { name: /Thank you/ })).toBeVisible();
  expect(await mockSent()).toHaveLength(2);
});

test('a transient provider error is retried on the server', async ({ page }) => {
  await mockMode('flaky');
  await page.goto('/en/contact', { waitUntil: 'networkidle' });
  await fillValidForm(page);
  await waitPastBotCheck(page);
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.getByRole('heading', { name: /Thank you/ })).toBeVisible();
  const sent = await mockSent();
  expect(sent.filter((email) => email.to === 'studio@example.test')).toHaveLength(2);
  expect(sent).toHaveLength(3);
});

test('API rejects malformed requests and silently drops bots', async ({ request }) => {
  const valid = { name: 'QA', email: 'qa@example.test', projectType: 'website', message: 'x'.repeat(30), language: 'en' };
  expect((await request.post('/api/contact', { headers: { 'content-type': 'text/plain' }, data: 'a=b' })).status()).toBe(415);
  expect((await request.post('/api/contact', { headers: { 'content-type': 'application/json' }, data: Buffer.from('{bad') })).status()).toBe(400);
  expect((await request.post('/api/contact', { headers: { 'content-type': 'application/json' }, data: Buffer.from('x'.repeat(20_000)) })).status()).toBe(413);
  expect((await request.post('/api/contact', { data: { ...valid, website: 'http://spam', elapsed: 9000 } })).status()).toBe(200);
  expect((await request.post('/api/contact', { data: { ...valid, elapsed: 500 } })).status()).toBe(200);
  expect((await request.post('/api/contact', { data: { ...valid, email: 'nope', elapsed: 9000 } })).status()).toBe(422);
  // Bots and invalid requests never reach the email provider.
  expect(await mockSent()).toHaveLength(0);
});

test('rate limit returns 429 with Retry-After', async ({ request }) => {
  // Runs last: it exhausts this server's per-IP allowance.
  let limited;
  for (let i = 0; i < 40 && !limited; i++) {
    const response = await request.post('/api/contact', {
      data: { name: 'QA', email: 'qa@example.test', projectType: 'bogus', message: 'x'.repeat(30), elapsed: 9000 },
    });
    if (response.status() === 429) limited = response;
  }
  expect(limited).toBeDefined();
  expect(limited!.headers()['retry-after']).toBe('600');
  expect(await mockSent()).toHaveLength(0);
});
