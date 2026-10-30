import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testIgnore: "pwa.spec.ts",
  timeout: 60000,
  workers: 2,
  fullyParallel: true,
  use: { baseURL: "http://localhost:4321/aku-oregairu/", headless: true },
  webServer: {
    command: "npm run dev -- --port 4321 --ignore-lock",
    url: "http://localhost:4321/aku-oregairu/",
    reuseExistingServer: !process.env.CI,
  },
});
