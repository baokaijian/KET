import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import process from "node:process";
import { wordImages } from "../src/data/word-images.js";
import { wordById } from "../src/data/learning.js";
import { imageReviews } from "../src/data/image-reviews.js";

const env = { ...process.env, VITE_BASE_PATH: "/KET/" };
const build = spawnSync(
  process.execPath,
  ["node_modules/vite/bin/vite.js", "build", "--outDir", "dist-pages"],
  { env, stdio: "inherit" },
);
if (build.status !== 0) process.exit(build.status || 1);
for (const folder of ["learning-images", "word-images"]) {
  const approved = Object.values(wordImages).filter((image) => ["pass", "fixed"].includes(image.reviewStatus) && image.src.startsWith(`${folder}/`));
  const actual = readdirSync(`dist-pages/${folder}`).sort();
  if (JSON.stringify(actual) !== JSON.stringify(approved.map((image) => image.src.slice(folder.length + 1)).sort())) throw new Error(`Unapproved or missing assets in ${folder}`);
}
for (const [id, image] of Object.entries(wordImages)) {
  const hash = createHash("sha256").update(readFileSync(`dist-pages/${image.src}`)).digest("hex");
  if (hash !== (image.sha256 || imageReviews[wordById[id]?.word]?.sha256)) throw new Error(`Published photo changed: ${id}`);
}
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
