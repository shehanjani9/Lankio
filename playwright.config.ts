import { defineConfig } from '@playwright/test';

/**
 * Run with `npm test` (builds first) or `npm run test:e2e` after a build.
 *
 * The app is served with a fake Resend key and RESEND_BASE_URL pointing at
 * a local mock, so no test can send a real email even if the mock is down:
 * the fake key would be rejected by Resend.
 *
 * Uses the locally installed Google Chrome (channel: 'chrome'); run
 * `npx playwright install chromium` and remove `channel` to use Playwright's
 * bundled browser instead.
 */
const PORT = 3100;
const MOCK_PORT = 3901;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 2,
  retries: 0,
  reporter: [['list']],
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'node tests/support/mock-resend.mjs',
      port: MOCK_PORT,
      reuseExistingServer: false,
      env: { MOCK_RESEND_PORT: String(MOCK_PORT) },
    },
    {
      command: `npx next start -p ${PORT}`,
      port: PORT,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        RESEND_BASE_URL: `http://localhost:${MOCK_PORT}`,
        RESEND_API_KEY: 're_test_not_a_real_key',
        LANKIO_ADMIN_EMAIL: 'studio@example.test',
        LANKIO_FROM_EMAIL: 'Lankio Test <noreply@example.test>',
        CONTACT_RATE_LIMIT_MAX: '30',
      },
    },
  ],
});
