import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import process from "node:process";

const env = { ...process.env, VITE_BASE_PATH: "/KET/" };
const build = spawnSync(
  process.execPath,
  ["node_modules/vite/bin/vite.js", "build", "--outDir", "dist-pages"],
  { env, stdio: "inherit" },
);
if (build.status !== 0) process.exit(build.status || 1);
if (existsSync("dist-pages/word-images"))
  throw new Error("Legacy image templates must not be published.");
const browser = spawnSync(
  process.execPath,
  ["node_modules/@playwright/test/cli.js", "test"],
  {
    stdio: "inherit",
    env: {
      ...env,
      PLAYWRIGHT_PRODUCTION: "1",
      PLAYWRIGHT_BASE_PATH: "/KET/",
      PLAYWRIGHT_OUT_DIR: "dist-pages",
    },
  },
);
process.exitCode = browser.status || (browser.error ? 1 : 0);
