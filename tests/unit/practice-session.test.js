import { describe, expect, it } from "vitest";
import { practiceFingerprint, resumablePractice } from "../../src/utils/practiceSession.js";

const words = [{ id: "apple" }];
const questions = [{ id: "q1", options: ["apple", "banana"], answer: 0, prompt: "Pick apple" }];
const fingerprint = practiceFingerprint(words, questions);
const saved = { fingerprint, stage: "quiz", index: 0, responses: [false], choice: null, retrying: true };

describe("shared practice resume validation", () => {
  it("preserves the existing snapshot fingerprint and correction state", () => {
    expect(fingerprint).toBe(JSON.stringify([null, ["apple"], [["q1", ["apple", "banana"], 0, undefined, undefined, undefined, undefined, "Pick apple"]]]));
    expect(resumablePractice(saved, fingerprint, 1, 1)).toBe(saved);
  });
  it("invalidates changed options, answers, passages and days", () => {
    for (const patch of [{ options: ["banana", "apple"] }, { answer: 1 }, { passage: "Different text" }]) {
      expect(resumablePractice(saved, practiceFingerprint(words, [{ ...questions[0], ...patch }]), 1, 1)).toBeNull();
    }
    expect(resumablePractice(saved, practiceFingerprint(words, questions, "2026-10-13"), 1, 1)).toBeNull();
  });
  it.each([null, { ...saved, stage: "result" }, { ...saved, index: -1 }, { ...saved, index: 1 }, { ...saved, index: 0.5 }, { ...saved, responses: [true, false] }, { ...saved, responses: ["false"] }, { ...saved, responses: null }])("rejects completed or malformed snapshots (%#)", (snapshot) => {
    expect(resumablePractice(snapshot, fingerprint, 1, 1)).toBeNull();
  });
  it("uses word counts for learning and question counts for quiz/guide", () => {
    expect(resumablePractice({ ...saved, stage: "learn" }, fingerprint, 0, 1)).toBeNull();
    expect(resumablePractice(saved, fingerprint, 0, 1)).toBe(saved);
    expect(resumablePractice({ ...saved, stage: "guide" }, fingerprint, 0, 1)).not.toBeNull();
  });
});
