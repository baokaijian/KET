import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import process from "node:process";
import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { pagesBase } from "./scripts/pages-base.mjs";
import { wordImages } from "./src/data/word-images.js";

// https://vite.dev/config/
export default defineConfig({
  base: pagesBase(process.env),
  // Only approved assets are copied or served, never the legacy templates.
  publicDir: "public/learning-assets",
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "vendor-supabase",
              test: /node_modules[\\/]@supabase/,
              priority: 30,
            },
            {
              name: "vendor-icons",
              test: /node_modules[\\/]lucide-react/,
              priority: 30,
            },
            {
              name: "vendor-react",
              test: /node_modules/,
              priority: 20,
            },
            {
              name: "ket-words-ext",
              test: /src[\\/]data[\\/]ket-words[\\/]level-12\.js$/,
              priority: 25,
            },
            {
              name: "ket-words-core",
              test: /src[\\/]data[\\/]ket-words[\\/]level-(0[1-9]|1[01])\.js$/,
              priority: 25,
            },
            {
              name: "vocab-metadata",
              test: /src[\\/]data[\\/](vocabulary-metadata|ket-meanings|vocabulary-corrections|curated-topics|ket-words[\\/]levels\.js)/,
              priority: 20,
            },
            {
              name: "word-images-meta",
              test: /(-images|image-reviews)\.js$/,
              priority: 20,
            },
            {
              name: "progressive-learning",
              test: /src[\\/]data[\\/](phonics|long-passages|communication-dialogues|writing-scaffolds|learning-roadmap)/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
  plugins: [
    react(),
    {
      name: "publish-reviewed-assets",
      async buildStart() {
        const destination = resolve("public/learning-assets");
        await rm(destination, { recursive: true, force: true });
        await mkdir(destination, { recursive: true });
        await cp("public/favicon.svg", resolve(destination, "favicon.svg"));
        await mkdir(resolve(destination, "word-images"), { recursive: true });
        for (const image of Object.values(wordImages)) {
          if (["pass", "fixed"].includes(image.reviewStatus)) await cp(resolve("public", image.src), resolve(destination, image.src));
        }
      },
    },
  ],
});
