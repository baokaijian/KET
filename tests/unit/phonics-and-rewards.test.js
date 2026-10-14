import { describe, expect, it } from "vitest";
import {
  getPhonicsBreakdown,
  buildPhonicsPuzzle,
  WORD_FAMILIES,
} from "../../src/data/phonics.js";
import { phonicsStories } from "../../src/data/phonics-stories.js";
import {
  AVAILABLE_STICKERS,
  STICKER_COUNT,
  computeUnlockedStickers,
} from "../../src/data/stickers.js";
import { childThemes } from "../../src/data/child-course.js";
import { allKetWords } from "../../src/data/ket-words/index.js";
import { emptyProgress } from "../../src/utils/learningProgress.js";

describe("phonics engine and word family system", () => {
  it("breaks all 95 child theme words into grapheme chunks that reassemble to the exact word", () => {
    const words = [
      ...new Map(
        childThemes
          .flatMap((theme) => theme.vocabulary.words)
          .map((w) => [w.id, w]),
      ).values(),
    ];
    expect(words).toHaveLength(95);
    for (const word of words) {
      const breakdown = getPhonicsBreakdown(word);
      expect(breakdown.word).toBe(word.word);
      expect(breakdown.chunks.length).toBeGreaterThanOrEqual(1);
      expect(breakdown.chunks.map((c) => c.text).join("")).toBe(word.word);
      expect(breakdown.rule.length).toBeGreaterThan(8);
      expect(breakdown.family.words.length).toBeGreaterThanOrEqual(2);
      expect(
        breakdown.family.words.map((w) => w.toLowerCase()),
      ).not.toContain(word.word.toLowerCase());
    }
  });

  it("supports phonics segmentation across all 1687 KET vocabulary entries", () => {
    for (const entry of allKetWords) {
      const breakdown = getPhonicsBreakdown(entry);
      expect(breakdown.chunks.length, entry.word).toBeGreaterThan(0);
      expect(breakdown.rule, entry.word).toBeTruthy();
      if (/^[a-z]+$/i.test(entry.word)) {
        expect(breakdown.chunks.map((c) => c.text).join("")).toBe(entry.word);
      }
    }
  });

  it("creates shuffled tap-to-blend puzzles for multi-chunk words", () => {
    const puzzle = buildPhonicsPuzzle("shirt");
    expect(puzzle.target.map((c) => c.text)).toEqual(["sh", "ir", "t"]);
    expect(puzzle.pool).toHaveLength(3);
    expect(puzzle.pool.map((c) => c.text).sort()).toEqual(["ir", "sh", "t"]);
    expect(puzzle.pool.map((c) => c.text)).not.toEqual(["sh", "ir", "t"]);
  });
});

describe("decodable phonics rhyming stories", () => {
  it("provides six rhyming phonics stories linked to word families and target words", () => {
    expect(phonicsStories).toHaveLength(6);
    for (const story of phonicsStories) {
      expect(story.title).toBeTruthy();
      expect(story.englishTitle).toBeTruthy();
      expect(story.passage.length).toBeGreaterThan(80);
      expect(story.translation).toMatch(/[\u4e00-\u9fff]/);
      expect(Object.values(WORD_FAMILIES)).toContain(story.family);
      const lowerPassage = story.passage.toLowerCase();
      const matchedHighlights = story.highlightWords.filter((w) =>
        lowerPassage.includes(w.toLowerCase()),
      );
      expect(matchedHighlights.length, story.id).toBeGreaterThanOrEqual(4);
    }
  });
});

describe("child-friendly sticker rewards", () => {
  it("unlocks stickers progressively based on listening, reading and phonics milestones without requiring spelling", () => {
    expect(AVAILABLE_STICKERS).toHaveLength(STICKER_COUNT);
    expect(computeUnlockedStickers(emptyProgress)).toEqual([]);

    const step1 = computeUnlockedStickers({
      ...emptyProgress,
      seen: ["l2_apple"],
    });
    expect(step1).toContain("first_step");
    expect(step1).not.toContain("phonics_explorer");

    const step2 = computeUnlockedStickers({
      ...emptyProgress,
      seen: Array.from({ length: 8 }, (_, i) => `w_${i}`),
      completed: ["child-breakfast-sentences", "child-breakfast-story"],
      days: { "2026-10-11": 5, "2026-10-12": 6, "2026-10-13": 8 },
      mastered: ["l2_apple"],
    });
    expect(step2).toEqual(
      expect.arrayContaining([
        "first_step",
        "phonics_explorer",
        "sentence_listener",
        "story_reader",
        "breakfast_buddy",
        "day_streak_3",
        "master_first",
      ]),
    );
  });
});
