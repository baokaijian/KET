import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { courseLessons, courseQuestionById, checkpoints } from "../../src/data/curriculum.js";
import { grammarLessons } from "../../src/data/grammar.js";
import { skillLessons } from "../../src/data/skill-lessons.js";

describe("course record ownership", () => {
  it("gives every course question its own registry entry", () => {
    const questions = courseLessons.flatMap((lesson) => lesson.questions);
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length);
    expect(Object.keys(courseQuestionById)).toHaveLength(questions.length);
    for (const question of questions) expect(courseQuestionById[question.id]).toEqual(question);
  });
  it("retains checkpoint source content without sharing its assessment identity", () => {
    const originals = Object.fromEntries([...grammarLessons, ...skillLessons].flatMap((lesson) => lesson.questions).map((question) => [question.id, question]));
    for (const checkpoint of checkpoints) for (const question of checkpoint.questions) {
      const original = originals[question.sourceQuestionId];
      expect(original, question.id).toBeTruthy();
      expect(question.id).toBe(`${checkpoint.id}-${original.id}`);
      expect(question).not.toBe(original);
      const { id, sourceQuestionId, ...content } = question;
      expect(id).not.toBe(sourceQuestionId);
      const { id: originalId, ...originalContent } = original;
      expect(originalId).toBe(sourceQuestionId);
      expect(content).toEqual(originalContent);
    }
  });
  it("does not restore the obsolete spelling and two-answer mastery implementation", () => {
    for (const path of ["components/WordLearn.jsx", "components/QuizArena.jsx", "components/ParentDashboard.jsx", "data/progress.js"]) {
      expect(existsSync(new URL(`../../src/${path}`, import.meta.url)), path).toBe(false);
    }
  });
});
