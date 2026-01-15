import { defineConfig, devices } from '@playwright/test';  // Import devices

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  fullyParallel: false,  // Sequential
  use: {
    baseURL: 'https://demo.playwright.dev/todomvc/',  // ← Full TodoMVC
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },  // Fixed project
    },
  ],
  reporter: [['html'], ['list']],  // Green/red console + report
});
