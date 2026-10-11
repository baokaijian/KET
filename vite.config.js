import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import process from "node:process";
import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { pagesBase } from "./scripts/pages-base.mjs";

// https://vite.dev/config/
export default defineConfig({
  base: pagesBase(process.env),
  // Only approved assets are copied or served, never the legacy templates.
  publicDir: "public/learning-assets",
  plugins: [
    react(),
    {
      name: "publish-reviewed-assets",
      async buildStart() {
        const destination = resolve("public/learning-assets");
        await rm(destination, { recursive: true, force: true });
        await mkdir(destination, { recursive: true });
        await cp("public/favicon.svg", resolve(destination, "favicon.svg"));
        await cp(
          "public/learning-images",
          resolve(destination, "learning-images"),
          { recursive: true },
        );
      },
    },
  ],
});
