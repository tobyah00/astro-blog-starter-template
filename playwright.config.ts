import { defineConfig } from '@playwright/test';

const production = process.env.TEST_PRODUCTION === '1';
const baseURL = production ? 'http://127.0.0.1:8787' : 'http://127.0.0.1:4321';

export default defineConfig({
  testDir: './tests',
  use: { baseURL, browserName: 'chromium' },
  webServer: {
    command: production ? 'npm run serve:local' : 'npm run dev -- --host 127.0.0.1',
    url: baseURL,
    reuseExistingServer: !process.env.CI && !production,
  },
});
