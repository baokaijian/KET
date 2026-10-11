import process from "node:process";
console.error(
  "The legacy SVG-to-WebP generator has been retired. It did not verify meaning. Generate each photograph separately, visually review it, and record its hash in src/data/image-reviews.js. Use npm run review:images to rebuild the audit table.",
);
process.exitCode = 1;
