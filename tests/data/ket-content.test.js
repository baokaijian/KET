import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";
import {
  allKetWords,
  levels,
  topicCategories,
} from "../../src/data/ket-words/index.js";
import {
  learningWords,
  lessons,
  abilityQuestions,
  dictionaryEntry,
} from "../../src/data/learning.js";
import { imageReviews } from "../../src/data/image-reviews.js";
import { getWordImage, wordImages } from "../../src/data/word-images.js";
import { getSpeakableWordText } from "../../src/utils/speechText.js";
import { pagesBase } from "../../scripts/pages-base.mjs";
import { additionalImages } from "../../src/data/additional-images.js";
import { wordImagePlans } from "../../src/data/word-image-plans.js";

describe("complete vocabulary meanings", () => {
  it("preserves all 1687 entries without duplicate ids", () => {
    expect(allKetWords).toHaveLength(1687);
    expect(new Set(allKetWords.map((word) => word.id)).size).toBe(1687);
    expect(levels).toHaveLength(12);
    for (const word of allKetWords) {
      expect(word.word).toBeTruthy();
      expect(word.translation).toBeTruthy();
      expect(word.translation).not.toMatch(/词[：:]|待复核/);
      expect(word.translation).toMatch(/[\u4e00-\u9fff]/);
      expect(dictionaryEntry(word).translation).toBe(word.translation);
      expect(levels.some((level) => level.id === word.level)).toBe(true);
      expect(topicCategories.some((topic) => topic.id === word.topic)).toBe(
        true,
      );
    }
  });
  it("does not publish unreviewed pictures, phonetics or boilerplate examples", () => {
    const word = allKetWords.find((item) => item.word === "all");
    expect(getWordImage(word.id)).toBeNull();
    expect(dictionaryEntry(word).image).toBeNull();
    expect(dictionaryEntry(word).phonetic).toBe("");
    expect(dictionaryEntry(word).sentence).toBe("");
    expect(allKetWords.some((item) => /词[：:]|待复核/.test(item.translation))).toBe(false);
  });
});

describe("published curriculum acceptance", () => {
  it("keeps a word-specific authoring plan for all 1687 words without approving unfinished assets", () => {
    expect(Object.keys(wordImagePlans).sort()).toEqual(allKetWords.map((word) => word.id).sort());
    expect(new Set(Object.values(wordImagePlans).map((plan) => plan.src)).size).toBe(1687);
    for (const word of allKetWords) {
      const plan = wordImagePlans[word.id];
      expect(plan.prompt).toContain(`Target word: ${word.word}.`);
      expect(plan.prompt).toContain(plan.meaning);
      expect(plan.reviewStatus).toBe(wordImages[word.id]?.reviewStatus || "pending");
      if (!wordImages[word.id]) expect(plan.alt).toBe("");
    }
  });
  it("uses one canonical image path and unique file contents for each published word ID", () => {
    const hashes = new Set();
    for (const [id, image] of Object.entries(wordImages)) {
      expect(image.src).toBe(`word-images/${id}.webp`);
      const hash = createHash("sha256").update(readFileSync(`public/${image.src}`)).digest("hex");
      expect(hashes.has(hash), id).toBe(false);
      hashes.add(hash);
    }
  });
  it("checks every added photograph's unique bytes and locked visual-review evidence", async () => {
    const hashes = new Set();
    for (const [id, image] of Object.entries(additionalImages)) {
      expect(allKetWords.some((word) => word.id === id)).toBe(true);
      expect(image.src).toBe(`word-images/${id}.webp`);
      expect(["pass", "fixed"]).toContain(image.reviewStatus);
      expect(image.alt.length).toBeGreaterThan(20);
      expect(image.note.length).toBeGreaterThan(20);
      const file = `public/${image.src}`;
      const hash = createHash("sha256").update(readFileSync(file)).digest("hex");
      expect(hash).toBe(image.sha256);
      expect(hashes.has(hash)).toBe(false);
      hashes.add(hash);
      expect((await sharp(file).metadata()).width).toBe(640);
      expect((await sharp(file).metadata()).format).toBe("webp");
    }
  });
  it("has distinct reviewed files tied to review evidence, not just distinct filenames", async () => {
    expect(learningWords).toHaveLength(12);
    const hashes = new Set();
    for (const word of learningWords) {
      const image = word.image;
      expect(["pass", "fixed"]).toContain(image.reviewStatus);
      expect(image.src).toBe(`word-images/${word.id}.webp`);
      expect(image.alt.length).toBeGreaterThan(15);
      expect(image.meaning).toBe(word.translation);
      const file = `public/${image.src}`;
      expect(statSync(file).size).toBeGreaterThan(3000);
      const hash = createHash("sha256")
        .update(readFileSync(file))
        .digest("hex");
      expect(hash).toBe(imageReviews[word.word].sha256);
      expect(imageReviews[word.word].note.length).toBeGreaterThan(20);
      expect(hashes.has(hash)).toBe(false);
      hashes.add(hash);
      const metadata = await sharp(file).metadata();
      expect(metadata.format).toBe("webp");
      expect(metadata.width).toBe(640);
    }
    expect(readdirSync("public/learning-images").sort()).toEqual(
      learningWords.map((word) => `${word.word}.webp`).sort(),
    );
  });
  it("teaches specific senses with real example sentences and correct speech text", () => {
    for (const word of learningWords) {
      expect(word.contentReviewed).toBe(true);
      expect(word.sentence.toLowerCase()).toContain(word.word);
      expect(word.sentence).not.toContain("I can use");
      expect(getSpeakableWordText(word)).toBe(word.word);
      expect(word.phonetic).toMatch(/^\/.+\/$/);
    }
    const book = learningWords.find((word) => word.word === "book");
    expect(book.phonetic).toBe("/bʊk/");
    expect(book.translation).toBe("书（名词）");
    expect(learningWords.find((word) => word.word === "fish").translation).toBe(
      "鱼",
    );
  });
  it("includes each reviewed word exactly once in a short lesson", () => {
    expect(
      lessons.flatMap((lesson) => lesson.words.map((word) => word.id)),
    ).toEqual(learningWords.map((word) => word.id));
    expect(lessons.every((lesson) => lesson.words.length === 4)).toBe(true);
  });
  it("has explicit answer keys and independent distractors for ability tests", () => {
    expect(abilityQuestions).toHaveLength(6);
    for (const question of abilityQuestions) {
      expect(question.options).toHaveLength(3);
      expect(new Set(question.options).size).toBe(3);
      expect(question.options[question.answer]).toBeTruthy();
      expect(question.explanation.length).toBeGreaterThan(10);
      expect(
        question.skill === "listening" ? question.audio : question.passage,
      ).toBeTruthy();
    }
  });
  it("normalizes speech variants without reading punctuation", () => {
    expect(getSpeakableWordText("a / an")).toBe("a or an");
    expect(getSpeakableWordText("yog(h)urt")).toBe("yoghurt");
    expect(getSpeakableWordText("Dr")).toBe("doctor");
    expect(getSpeakableWordText({ word: "Dr" })).toBe("doctor");
    expect(getSpeakableWordText(" Dr. ")).toBe("doctor");
    expect(
      getSpeakableWordText({ word: "hello", speechText: "hello there" }),
    ).toBe("hello there");
  });
});

describe("GitHub Pages paths", () => {
  it("supports localhost, repository pages, user pages and custom domains", () => {
    expect(pagesBase({})).toBe("/");
    expect(
      pagesBase({ GITHUB_ACTIONS: "true", GITHUB_REPOSITORY: "sam/KET" }),
    ).toBe("/KET/");
    expect(
      pagesBase({
        GITHUB_ACTIONS: "true",
        GITHUB_REPOSITORY: "sam/sam.github.io",
      }),
    ).toBe("/");
    expect(pagesBase({ VITE_BASE_PATH: "/" })).toBe("/");
    expect(pagesBase({ VITE_BASE_PATH: "another-path" })).toBe(
      "/another-path/",
    );
  });
});
