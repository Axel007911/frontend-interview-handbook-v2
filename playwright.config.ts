import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', {open: 'never'}]] : 'list',
  use: {
    baseURL: 'http://localhost:4173/',
    trace: 'on-first-retry',
  },
  projects: [
    {name: 'desktop', use: {...devices['Desktop Chrome']}},
    {name: 'mobile', use: {...devices['Pixel 7']}},
  ],
  webServer: {
    command: 'node scripts/serve.mjs 4173',
    url: 'http://localhost:4173/',
    reuseExistingServer: !process.env.CI,
  },
});
