import { describe, expect, it, vi, afterEach } from "vitest";
import {
  emptyProgress,
  recordAnswer,
  normalizeProgress,
  countEnglishWords,
} from "../../src/utils/learningProgress.js";
import { safeReadStorage } from "../../src/hooks/useLocalStorageState.js";

afterEach(() => vi.unstubAllGlobals());
describe("learning records", () => {
  it("records mastery only after a correct answer, deduplicates mistakes and clears them on review", () => {
    let progress = recordAnswer(emptyProgress, "apple", false);
    progress = recordAnswer(progress, "apple", false);
    expect(progress.mastered).toEqual([]);
    expect(progress.review).toEqual(["apple"]);
    progress = recordAnswer(progress, "apple", true);
    expect(progress.mastered).toEqual(["apple"]);
    expect(progress.review).toEqual([]);
    progress = recordAnswer(progress, "apple", true);
    expect(progress.mastered).toEqual(["apple"]);
    progress = recordAnswer(progress, "apple", false);
    expect(progress.mastered).toEqual([]);
  });
  it("counts genuine English words and preserves a corrupt-storage fallback", () => {
    expect(countEnglishWords("I'm happy. Let's go by bicycle! 123 中文")).toBe(
      6,
    );
    expect(normalizeProgress({ seen: false, draft: 12, days: [] })).toEqual(
      emptyProgress,
    );
    vi.stubGlobal("localStorage", {
      getItem() {
        throw new Error("SecurityError");
      },
    });
    expect(safeReadStorage("test", emptyProgress)).toEqual(emptyProgress);
  });
});
