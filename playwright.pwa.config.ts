import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: 'pwa.spec.ts', timeout: 120000,
  use: { baseURL: 'http://localhost:4322/aku-oregairu/', headless: true },
  webServer: { reuseExistingServer: true, command: 'npm run preview -- --port 4322 --ignore-lock', url: 'http://localhost:4322/aku-oregairu/' },
});
