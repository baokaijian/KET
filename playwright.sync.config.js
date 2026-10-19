import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

export default defineConfig({
  testDir: "./tests/sync-e2e",
  timeout: 60000,
  workers: 1,
  expect: { timeout: 10000 },
  webServer: [
    { command: "node tests/support/sync-server.mjs", url: "http://127.0.0.1:54321/health", reuseExistingServer: false, timeout: 30000 },
    { command: "npm run dev -- --host 127.0.0.1 --port 5180 --strictPort", url: "http://127.0.0.1:5180/KET/", reuseExistingServer: false,
      env: { ...process.env, VITE_BASE_PATH: "/KET/", VITE_SUPABASE_URL: "http://127.0.0.1:54321", VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test_only" }, timeout: 60000 },
  ],
  use: { baseURL: "http://127.0.0.1:5180/KET/", trace: "retain-on-failure" },
  projects: [ { name: "desktop", use: { ...devices["Desktop Chrome"] } }, { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } } ],
});
