import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

const production = process.env.PLAYWRIGHT_PRODUCTION === "1";
const path = process.env.PLAYWRIGHT_BASE_PATH || "/";
const origin = `http://127.0.0.1:${production ? 5174 : 5173}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  timeout: 45_000,
  expect: {
    timeout: 8_000,
  },
  webServer: {
    command: production
      ? `npm run preview -- --host 127.0.0.1 --port 5174 --strictPort --outDir ${process.env.PLAYWRIGHT_OUT_DIR || "dist"}`
      : "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort",
    env: { VITE_BASE_PATH: path },
    url: `${origin}${path}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  use: {
    baseURL: `${origin}${path}`,
    trace: "retain-on-failure",
    launchOptions: {
      args: [
        "--use-fake-device-for-media-stream",
        "--use-fake-ui-for-media-stream",
      ],
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
});
