import { describe, expect, it } from "vitest";
import { emptyProgress, recordAnswer } from "../../src/utils/learningProgress.js";
import { buildDailyPlan, planReadingLessons } from "../../src/utils/dailyPlan.js";
import * as course from "../../src/data/curriculum.js";
import * as child from "../../src/data/child-course.js";
const curriculum = { ...course, ...child };
const lessons = Object.fromEntries(child.childLessons.map((lesson) => [lesson.id, lesson]));

describe("child-sized weekend and recovery reading", () => {
  it("does not add unseen comprehension tasks on a light Sunday", () => {
    const plan = buildDailyPlan({ ...emptyProgress, seen: ["l2_apple"] }, curriculum, new Date("2026-10-18T12:00:00"));
    expect(plan.mode).toBe("light");
    expect(plan.newWords).toEqual([]);
    expect(plan.sentencesLessonId).toBe("");
    expect(plan.storyLessonId).toBe("");
    expect(plan.newQuestions).toBe(0);
  });
  it("offers at most one already answered story for a light day", () => {
    const theme = child.childThemes[0];
    let p = { ...emptyProgress, seen: ["l2_apple"], completed: [theme.sentences.id, theme.story.id] };
    for (const question of [...theme.sentences.questions, ...theme.story.questions]) p = recordAnswer(p, question.id, true, new Date("2026-10-17T12:00:00"));
    const plan = buildDailyPlan(p, curriculum, new Date("2026-10-18T12:00:00"));
    expect(plan.sentencesLessonId).toBe("");
    expect(plan.storyLessonId).toBe(theme.story.id);
    expect(plan.themeId).toBe(theme.id);
    expect(plan.familiar).toBe(true);
    expect(plan.newQuestions).toBe(0);
    expect(planReadingLessons(plan, theme, lessons).sentences).toBeNull();
  });
  it("keeps the Saturday story day to one story instead of two new reading lessons", () => {
    const plan = buildDailyPlan({ ...emptyProgress, seen: ["l2_apple"] }, curriculum, new Date("2026-10-17T12:00:00"));
    expect(plan.mode).toBe("story");
    expect(plan.newWords).toEqual([]);
    expect(plan.sentencesLessonId).toBe("");
    expect(lessons[plan.storyLessonId].questions).toHaveLength(3);
    expect(plan.newQuestions).toBe(3);
  });
  it("does not invent familiar reading when a heavy queue has no previously answered story", () => {
    let p = emptyProgress;
    for (const word of course.courseWords.slice(0, 100)) p = recordAnswer(p, word.id, false, new Date("2026-10-11T12:00:00"));
    const plan = buildDailyPlan(p, curriculum, new Date("2026-10-12T12:00:00"));
    expect(plan.newWords).toHaveLength(2);
    expect(plan.newQuestions).toBe(0);
    expect(plan.sentencesLessonId).toBe("");
    expect(plan.storyLessonId).toBe("");
  });
});
