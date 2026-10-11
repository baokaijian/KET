import { describe, expect, it } from "vitest";
import { emptyProgress, recordAnswer, recordEncounter, dueReviews, normalizeProgress, dayAfter, reviewGaps } from "../../src/utils/learningProgress.js";
import { buildDailyPlan, dailyVocabularyLesson, planReadingLessons, saveDailyPlan, reviewQuestions, reviewBatch, reviewLoadForecast } from "../../src/utils/dailyPlan.js";
import * as course from "../../src/data/curriculum.js";
import * as child from "../../src/data/child-course.js";
const curriculum = { ...course, ...child };
const date = (day) => new Date(2026, 9, day, 12);
const childLessonById = Object.fromEntries(child.childLessons.map((lesson) => [lesson.id, lesson]));

function completedTheme(theme) {
  let p = emptyProgress;
  for (const question of theme.sentences.questions) p = recordAnswer(p, question.id, true, date(11), { skill: question.audio ? "listening" : "reading" });
  for (const question of theme.story.questions) p = recordAnswer(p, question.id, true, date(11), { skill: "reading" });
  return { ...p, completed: [theme.sentences.id, theme.story.id] };
}

describe("adaptive spaced retrieval", () => {
  it("schedules both skills on first encounter without inventing correct answers or mistakes", () => {
    let p = recordEncounter(emptyProgress, "l2_apple", date(12));
    expect(p.seen).toEqual(["l2_apple"]);
    expect(p.review).toEqual([]);
    expect(p.memory.l2_apple.listening.successDays).toEqual([]);
    p = recordAnswer(p, "l2_apple", true, date(12));
    expect(p.memory.l2_apple.reading.successDays).toEqual(["2026-10-12"]);
    expect(dueReviews(p, date(13)).map((item) => item.skill).sort()).toEqual(["listening", "reading"]);
    p = recordEncounter(p, "l2_apple", date(13));
    expect(p.memory.l2_apple.reading.due).toBe("2026-10-13");
  });
  it("starts at tomorrow then day 3 and day 7; repeated same-day answers cannot advance", () => {
    let p = recordAnswer(emptyProgress, "l2_apple", true, date(12));
    expect(p.memory.l2_apple.reading.due).toBe("2026-10-13");
    p = recordAnswer(p, "l2_apple", true, date(12));
    expect(p.memory.l2_apple.reading.step).toBe(1);
    expect(p.mastered).toEqual([]);
    expect(dueReviews(p, date(12))).toHaveLength(0);
    expect(dueReviews(p, date(13))).toHaveLength(1);
    p = recordAnswer(p, "l2_apple", true, date(13));
    expect(p.memory.l2_apple.reading.due).toBe("2026-10-15");
    p = recordAnswer(p, "l2_apple", true, date(15));
    expect(p.memory.l2_apple.reading.due).toBe("2026-10-19");
    expect(p.mastered).not.toContain("l2_apple");
    for (const day of [12, 13, 15]) p = recordAnswer(p, "l2_apple", true, date(day), { skill: "listening" });
    expect(p.mastered).toContain("l2_apple");
  });
  it("keeps listening separate, preserves error history and does not count hints as independent success", () => {
    let p = recordAnswer(emptyProgress, "l2_apple", true, date(12), { skill: "listening" });
    expect(p.memory.l2_apple.reading).toBeUndefined();
    p = recordAnswer(p, "l2_apple", true, date(13), { skill: "reading", hinted: true });
    expect(p.memory.l2_apple.reading.successDays).toEqual([]);
    expect(p.memory.l2_apple.reading.step).toBe(0);
    p = recordAnswer(p, "l2_apple", false, date(15), { skill: "listening" });
    expect(p.memory.l2_apple.listening.successDays).toEqual(["2026-10-12"]);
    expect(p.memory.l2_apple.listening.due).toBe("2026-10-16");
    expect(p.review).toEqual(["l2_apple"]);
    expect(dayAfter(new Date(2026, 9, 31), 1)).toBe("2026-11-01");
  });
  it("does not import old one-answer mastery or broken schedules", () => {
    const p = normalizeProgress({ mastered: ["l2_apple"], memory: { broken: { reading: { due: "bad", step: 9 } } } });
    expect(p.mastered).toEqual([]);
    expect(p.memory).toEqual({});
  });
  for (const skill of ["reading", "listening"]) it(`preserves ${skill} evidence after a lapse, requires a due-day independent review and leaves the other skill intact`, () => {
    let p = emptyProgress;
    for (const name of ["reading", "listening"]) for (const day of [12, 13, 15]) p = recordAnswer(p, "l2_apple", true, date(day), { skill: name });
    const before = structuredClone(p.memory.l2_apple);
    expect(p.mastered).toContain("l2_apple");
    p = recordAnswer(p, "l2_apple", false, date(19), { skill });
    expect(p.memory.l2_apple[skill]).toMatchObject({ successDays: before[skill].successDays, step: 0, lastCorrect: false, due: "2026-10-20" });
    expect(p.memory.l2_apple[skill === "reading" ? "listening" : "reading"]).toEqual(before[skill === "reading" ? "listening" : "reading"]);
    expect(p.mastered).not.toContain("l2_apple");
    expect(p.review).toContain("l2_apple");
    p = normalizeProgress(JSON.parse(JSON.stringify(p)));
    p = recordAnswer(p, "l2_apple", true, date(19), { skill });
    expect(p.memory.l2_apple[skill].lastCorrect).toBe(false);
    expect(p.memory.l2_apple[skill].successDays).toEqual(before[skill].successDays);
    expect(p.mastered).not.toContain("l2_apple");
    expect(p.review).toContain("l2_apple");
    p = recordAnswer(p, "l2_apple", true, date(20), { skill });
    expect(p.memory.l2_apple[skill].successDays).toEqual([...before[skill].successDays, "2026-10-20"]);
    expect(p.mastered).toContain("l2_apple");
    expect(p.review).not.toContain("l2_apple");
  });
  it("keeps historical evidence through hints without allowing a hinted correction to restore mastery", () => {
    let p = emptyProgress;
    for (const skill of ["reading", "listening"]) for (const day of [12, 13, 15]) p = recordAnswer(p, "l2_apple", true, date(day), { skill });
    const evidence = p.memory.l2_apple.reading.successDays;
    p = recordAnswer(p, "l2_apple", false, date(19));
    p = recordAnswer(p, "l2_apple", true, date(20), { hinted: true });
    expect(p.memory.l2_apple.reading).toMatchObject({ successDays: evidence, step: 0, lastCorrect: false, due: "2026-10-21" });
    p = recordAnswer(p, "l2_apple", true, date(20));
    expect(p.mastered).not.toContain("l2_apple");
    expect(p.review).toContain("l2_apple");
    p = recordAnswer(p, "l2_apple", true, date(21));
    expect(p.mastered).toContain("l2_apple");
  });
  it("does not accelerate early practice and reaches the 60-day maintenance interval", () => {
    let p = recordAnswer(emptyProgress, "l2_apple", true, date(12));
    p = recordAnswer(p, "l2_apple", true, date(13));
    const schedule = p.memory.l2_apple.reading;
    p = recordAnswer(p, "l2_apple", true, date(14));
    expect(p.memory.l2_apple.reading.step).toBe(schedule.step);
    expect(p.memory.l2_apple.reading.due).toBe(schedule.due);
    expect(p.memory.l2_apple.reading.successDays).toHaveLength(2);
    for (let i = 0; i < 5; i++) p = recordAnswer(p, "l2_apple", true, new Date(`${p.memory.l2_apple.reading.due}T12:00:00`));
    const retained = p.memory.l2_apple.reading;
    expect(retained.step).toBe(7);
    expect(retained.due).toBe(dayAfter(new Date(`${retained.lastDay}T12:00:00`), 60));
    expect(normalizeProgress(p).memory.l2_apple.reading.step).toBe(7);
  });
  it("rejects impossible dates and duplicate success days cannot inflate mastery", () => {
    const item = { due: "2026-10-15", lastDay: "2026-10-12", step: 1, lastCorrect: true, successDays: ["2026-10-12", "2026-10-12", "2026-10-12"] };
    const p = normalizeProgress({ mastered: ["l2_apple"], memory: { l2_apple: { reading: item, listening: item }, bad: { reading: { ...item, due: "2026-02-30" } } } });
    expect(p.mastered).toEqual([]);
    expect(p.memory.bad).toBeUndefined();
    expect(p.memory.l2_apple.reading.successDays).toHaveLength(1);
  });
  it("keeps the original seven intervals and adds 120/180/365-day maintenance for old records", () => {
    expect(reviewGaps.slice(0, 7)).toEqual([1, 2, 4, 7, 16, 30, 60]);
    expect(reviewGaps).toHaveLength(10);
    const legacyItem = { due: "2026-10-12", lastDay: "2026-10-11", step: 7, successDays: ["2026-09-01", "2026-09-15", "2026-10-11"], lastCorrect: true, assessed: true };
    const legacy = normalizeProgress({ memory: { l2_apple: { reading: legacyItem } } });
    expect(legacy.memory.l2_apple.reading.step).toBe(7);
    let p = recordAnswer(legacy, "l2_apple", true, date(12), { skill: "reading" });
    expect(p.memory.l2_apple.reading.step).toBe(8);
    expect(p.memory.l2_apple.reading.due).toBe(dayAfter(date(12), 120));
    p = recordAnswer(p, "l2_apple", true, new Date(`${p.memory.l2_apple.reading.due}T12:00:00`), { skill: "reading" });
    expect(p.memory.l2_apple.reading.step).toBe(9);
    expect(p.memory.l2_apple.reading.due).toBe(dayAfter(new Date("2027-02-09T12:00:00"), 180));
    p = recordAnswer(p, "l2_apple", true, new Date(`${p.memory.l2_apple.reading.due}T12:00:00`), { skill: "reading" });
    expect(p.memory.l2_apple.reading.step).toBe(10);
    expect(p.memory.l2_apple.reading.due).toBe(dayAfter(new Date("2027-08-08T12:00:00"), 365));
    const capped = recordAnswer(p, "l2_apple", true, new Date(`${p.memory.l2_apple.reading.due}T12:00:00`), { skill: "reading" });
    expect(capped.memory.l2_apple.reading.step).toBe(10);
    const keep = { due: "2026-10-15", lastDay: "2026-10-12", step: 10, successDays: ["2026-10-12"], lastCorrect: true, assessed: true };
    const normalized = normalizeProgress({ memory: { keep: { reading: keep }, drop: { reading: { ...keep, step: 11 } } } });
    expect(Object.keys(normalized.memory)).toEqual(["keep"]);
  });
});
describe("daily plan", () => {
  it("keeps parent-area typing tasks out of new and previously saved child review plans", () => {
    const typing = Object.values(course.courseQuestionById).filter((q) => ["input", "spelling"].includes(q.type));
    expect(typing.length).toBeGreaterThan(0);
    let p = recordAnswer(emptyProgress, "l2_apple", false, date(11), { skill: "listening" });
    for (const q of typing) p = recordAnswer(p, q.id, false, date(11), { skill: "listening" });
    const plan = buildDailyPlan(p, curriculum, date(12));
    expect(plan.review).toEqual([{ id: "l2_apple", skill: "listening" }]);
    expect(reviewQuestions(typing.map((q) => ({ id: q.id, skill: "listening" })), curriculum)).toEqual([]);
    const saved = saveDailyPlan(p, { ...plan, review: [...plan.review, { id: typing[0].id, skill: "listening" }] });
    expect(buildDailyPlan(saved, curriculum, date(12))).toEqual(plan);
    expect(p.memory[typing[0].id]).toBeTruthy();
  });
  it("starts with eight meaningful new words and freezes a plan for the whole local day", () => {
    const plan = buildDailyPlan(emptyProgress, curriculum, date(12));
    expect(plan.newWords).toHaveLength(8);
    expect(plan.themeId).toBe("breakfast");
    const p = { ...saveDailyPlan(emptyProgress, plan), seen: plan.newWords };
    expect(buildDailyPlan(p, curriculum, date(12))).toEqual(plan);
    const next = buildDailyPlan(p, curriculum, date(13));
    expect(next.newWords.length).toBeGreaterThan(0);
    expect(next.newWords.every((id) => !p.seen.includes(id))).toBe(true);
  });
  it("keeps a no-backlog day at eight words, six sentences and the short story", () => {
    const plan = buildDailyPlan(emptyProgress, curriculum, date(12));
    const theme = child.childThemes.find((item) => item.id === plan.themeId);
    expect(plan.mode).toBe("learn");
    expect(plan.review).toHaveLength(0);
    expect(plan.backlog).toBe(0);
    expect(plan.pressure).toBe(0);
    expect(plan.forecast).toHaveLength(7);
    expect(plan.reviewLimit).toBe(30);
    expect(plan.batchSize).toBe(10);
    expect(plan.sentencesLessonId).toBe(theme.sentences.id);
    expect(plan.storyLessonId).toBe(theme.story.id);
    expect(plan.newQuestions).toBe(9);
  });
  it("caps reviews at thirty a day, serves ten at a time and reduces new words under pressure", () => {
    let p = emptyProgress;
    for (const word of course.courseWords.slice(0, 35)) p = recordAnswer(p, word.id, false, date(11), { skill: "listening" });
    const plan = buildDailyPlan(p, curriculum, date(12));
    expect(plan.review).toHaveLength(30);
    expect(plan.backlog).toBe(5);
    expect(plan.reviewLimit).toBe(30);
    expect(plan.batchSize).toBe(10);
    expect(plan.pressure).toBeGreaterThanOrEqual(35);
    expect(plan.newWords).toHaveLength(4);
    expect(dueReviews(p, date(12))).toHaveLength(35);
    expect(reviewQuestions(plan.review, curriculum).every((q) => q.skill === "listening" && q.audio)).toBe(true);
  });
  it("does not count a same-day encounter or imported overdue record as a completed review", () => {
    const plan = { day: "2026-10-12", review: [{ id: "l2_apple", skill: "listening" }] };
    const legacy = { due: plan.day, lastDay: plan.day, step: 0, lastCorrect: false, successDays: [] };
    const p = normalizeProgress({ memory: { l2_apple: { listening: legacy } } });
    expect(reviewBatch(plan, p)).toMatchObject({ answered: 0, unanswered: 1, done: false });
    expect(reviewBatch(plan, recordEncounter(emptyProgress, "l2_apple", date(12)))).toMatchObject({ answered: 0, done: false });
    const answered = recordAnswer(p, "l2_apple", false, date(12), { skill: "listening" });
    expect(reviewBatch(plan, answered)).toMatchObject({ answered: 1, done: true });
  });
  it("moves reviews in fixed batches and never asks again for what was already answered", () => {
    let p = emptyProgress;
    for (const word of course.courseWords.slice(0, 45)) p = recordAnswer(p, word.id, false, date(11), { skill: "listening" });
    const plan = buildDailyPlan(p, curriculum, date(12));
    expect(plan.review).toHaveLength(30);
    let batch = reviewBatch(plan, p);
    expect(batch).toMatchObject({ answered: 0, remaining: 30, total: 30, batchIndex: 0, batches: 3, unanswered: 10, done: false });
    expect(batch.batch).toEqual(plan.review.slice(0, 10));
    for (const item of plan.review) p = recordAnswer(p, item.id, true, date(12), { skill: item.skill });
    expect(reviewBatch(plan, p)).toMatchObject({ answered: 30, remaining: 0, batchIndex: 3, batch: [], unanswered: 0, done: true });
    const saved = saveDailyPlan(p, plan);
    expect(buildDailyPlan(saved, curriculum, date(12))).toEqual(plan);
    expect(reviewBatch(buildDailyPlan(saved, curriculum, date(12)), p).done).toBe(true);
  });
  it("keeps the final answered batch available for pending correction even at the daily limit", () => {
    let p = emptyProgress;
    for (const word of course.courseWords.slice(0, 45)) p = recordAnswer(p, word.id, false, date(11), { skill: "reading" });
    const plan = buildDailyPlan(p, curriculum, date(12));
    for (const item of plan.review) p = recordAnswer(p, item.id, true, date(12), { skill: item.skill });
    const resumed = reviewBatch(plan, p, { unfinishedBatches: [2] });
    expect(resumed).toMatchObject({ answered: 30, remaining: 0, batchIndex: 2, unanswered: 0, pending: true, done: false });
    expect(resumed.batch).toEqual(plan.review.slice(20, 30));
    expect(reviewBatch(plan, p)).toMatchObject({ pending: false, done: true });
  });
  it("finishes a single review only after its pending feedback is closed", () => {
    const plan = { day: "2026-10-12", review: [{ id: "l2_apple", skill: "reading" }] };
    const p = recordAnswer(emptyProgress, "l2_apple", false, date(12), { skill: "reading" });
    expect(reviewBatch(plan, p, { unfinishedBatches: [0] })).toMatchObject({ answered: 1, unanswered: 0, pending: true, done: false });
    expect(reviewBatch(plan, p, { unfinishedBatches: [99] })).toMatchObject({ pending: false, done: true });
  });
  it("keeps a batch's members, order and id stable while it is only partly answered", () => {
    let p = emptyProgress;
    for (const word of course.courseWords.slice(0, 45)) p = recordAnswer(p, word.id, false, date(11), { skill: "listening" });
    const plan = buildDailyPlan(p, curriculum, date(12));
    const first = reviewBatch(plan, p);
    const members = first.batch.map((item) => `${item.id}:${item.skill}`);
    // what the app fingerprints for resume: local day + question ids, options and answers
    const fingerprintOf = (batch) => JSON.stringify([plan.day, reviewQuestions(batch, curriculum).map((question) => [question.id, question.options, question.answer])]);
    const before = fingerprintOf(first.batch);
    const activityOf = (batch) => ({ id: `daily-review-${plan.day}-b${batch.batchIndex}`, title: batch.batchIndex === 0 ? "复习老朋友" : `复习老朋友 · 第 ${batch.batchIndex + 1} 批` });
    expect(activityOf(first)).toEqual({ id: "daily-review-2026-10-12-b0", title: "复习老朋友" });
    for (const item of first.batch.slice(0, 3)) p = recordAnswer(p, item.id, true, date(12), { skill: item.skill });
    const resumed = reviewBatch(plan, p);
    expect(resumed.batchIndex).toBe(0);
    expect(resumed.batch.map((item) => `${item.id}:${item.skill}`)).toEqual(members);
    expect(activityOf(resumed)).toEqual(activityOf(first));
    // identical question ids, option order and answer positions -> the saved session (with its hint state) stays valid
    expect(fingerprintOf(resumed.batch)).toBe(before);
    expect(resumed).toMatchObject({ answered: 3, unanswered: 7, remaining: 27, done: false });
    for (const item of first.batch.slice(3)) p = recordAnswer(p, item.id, true, date(12), { skill: item.skill });
    const next = reviewBatch(plan, p);
    expect(next.batchIndex).toBe(1);
    expect(next.batch.map((item) => `${item.id}:${item.skill}`)).not.toEqual(members);
    expect(fingerprintOf(next.batch)).not.toBe(before);
    expect(next).toMatchObject({ answered: 10, unanswered: 10, remaining: 20, done: false });
  });
  it("switches a heavy queue to familiar stories, two new words and zero new questions", () => {
    const theme = child.childThemes[0];
    let p = completedTheme(theme);
    for (const word of course.courseWords.slice(0, 70)) p = recordAnswer(p, word.id, false, date(11), { skill: "reading" });
    const plan = buildDailyPlan(p, curriculum, date(12));
    expect(plan.pressure).toBeGreaterThan(60);
    expect(plan.mode).toBe("catchup");
    expect(plan.newWords).toHaveLength(2);
    expect(plan.newQuestions).toBe(0);
    expect(plan.sentencesLessonId).toBe(theme.sentences.id);
    expect(plan.storyLessonId).toBe(theme.story.id);
    expect(plan.backlog).toBeGreaterThan(0);
    expect(plan.newWords.every((id) => !p.seen.includes(id))).toBe(true);
  });
  it("leaves out a reading task that is not familiar instead of quietly adding its questions", () => {
    const theme = child.childThemes[1];
    const heavy = (base) => {
      let p = base;
      for (const word of course.courseWords.slice(0, 70)) p = recordAnswer(p, word.id, false, date(11), { skill: "reading" });
      return p;
    };
    let storyOnly = heavy({ ...emptyProgress, completed: [theme.story.id] });
    for (const question of theme.story.questions) storyOnly = recordAnswer(storyOnly, question.id, true, date(11), { skill: "reading" });
    const storyPlan = buildDailyPlan(storyOnly, curriculum, date(12));
    expect(storyPlan.mode).toBe("catchup");
    expect(storyPlan.storyLessonId).toBe(theme.story.id);
    expect(storyPlan.sentencesLessonId).toBe("");
    expect(storyPlan.newQuestions).toBe(0);
    let sentencesOnly = heavy({ ...emptyProgress, completed: [theme.sentences.id] });
    for (const question of theme.sentences.questions) sentencesOnly = recordAnswer(sentencesOnly, question.id, true, date(11), { skill: question.audio ? "listening" : "reading" });
    const sentencesPlan = buildDailyPlan(sentencesOnly, curriculum, date(12));
    expect(sentencesPlan.mode).toBe("catchup");
    expect(sentencesPlan.sentencesLessonId).toBe(theme.sentences.id);
    expect(sentencesPlan.storyLessonId).toBe("");
    expect(sentencesPlan.newQuestions).toBe(0);
  });
  it("counts Saturday's single story and keeps Sunday free of new comprehension questions", () => {
    const saturday = buildDailyPlan({ ...emptyProgress, seen: ["l2_apple"] }, curriculum, date(17));
    expect(saturday.mode).toBe("story");
    expect(saturday.newWords).toEqual([]);
    expect(saturday.newQuestions).toBe(3);
    const sunday = buildDailyPlan({ ...emptyProgress, seen: ["l2_apple"] }, curriculum, date(18));
    expect(sunday.mode).toBe("light");
    expect(sunday.newWords).toEqual([]);
    expect(sunday.newQuestions).toBe(0);
  });
  it("keeps parent typing practice out of the child load forecast and the intake decision", () => {
    const typing = Object.values(course.courseQuestionById).filter((q) => ["input", "spelling"].includes(q.type));
    let p = emptyProgress;
    for (const word of course.courseWords.slice(0, 20)) p = recordAnswer(p, word.id, false, date(11), { skill: "reading" });
    const clean = buildDailyPlan(p, curriculum, date(12));
    expect(clean.pressure).toBe(20);
    expect(clean.newWords).toHaveLength(8);
    const cleanForecast = reviewLoadForecast(p, curriculum, date(12));
    for (const question of typing) p = recordAnswer(p, question.id, false, date(11), { skill: "reading" });
    const withTyping = buildDailyPlan(p, curriculum, date(12));
    // six typing questions exist; counting them would push the day to 26 and cut the new words to four
    expect(typing.length).toBeGreaterThanOrEqual(6);
    expect(reviewLoadForecast(p, curriculum, date(12))).toEqual(cleanForecast);
    expect(cleanForecast[0]).toBe(20);
    expect(withTyping.pressure).toBe(20);
    expect(withTyping.newWords).toHaveLength(8);
    expect(withTyping.review).toEqual(clean.review);
  });
  it("tops new words up to the daily minimum when a theme is nearly finished", () => {
    const theme = child.childThemes[0];
    const seen = theme.vocabulary.words.slice(0, 7).map((word) => word.id);
    let p = { ...emptyProgress, seen };
    for (const word of course.courseWords.slice(0, 70)) p = recordAnswer(p, word.id, false, date(11), { skill: "reading" });
    const plan = buildDailyPlan(p, curriculum, date(12));
    expect(plan.themeId).toBe(theme.id);
    expect(plan.newWords).toHaveLength(2);
    expect(plan.newWords[0]).toBe(theme.vocabulary.words[7].id);
    expect(plan.newWords.every((id) => !seen.includes(id))).toBe(true);
  });
  it("never stops new words while a theme's own stories are still waiting", () => {
    const theme = child.childThemes[0];
    const seen = theme.vocabulary.words.map((word) => word.id);
    let p = { ...emptyProgress, seen };
    for (const word of course.courseWords.slice(0, 70)) p = recordAnswer(p, word.id, false, date(11), { skill: "reading" });
    const plan = buildDailyPlan(p, curriculum, date(12));
    expect(plan.themeId).toBe(theme.id);
    expect(plan.vocabularyLessonId).not.toBe(theme.vocabulary.id);
    expect(plan.newWords).toHaveLength(2);
    expect(plan.newWords.every((id) => !seen.includes(id))).toBe(true);
    expect(plan.mode).toBe("learn");
    expect(plan.newQuestions).toBe(0);
  });
  it("forecasts the next seven days of already-scheduled load", () => {
    let p = emptyProgress;
    for (const word of course.courseWords.slice(0, 12)) p = recordAnswer(p, word.id, true, date(12), { skill: "reading" });
    expect(reviewLoadForecast(p, curriculum, date(12))).toEqual([12, 0, 0, 0, 0, 0, 0]);
    for (const word of course.courseWords.slice(0, 12)) p = recordAnswer(p, word.id, true, date(13), { skill: "reading" });
    expect(reviewLoadForecast(p, curriculum, date(13))).toEqual([0, 12, 0, 0, 0, 0, 0]);
  });
  it("uses Saturday for integration and Sunday for light review without wiping missed days", () => {
    const p = { ...emptyProgress, seen: ["l2_apple"] };
    expect(buildDailyPlan(p, curriculum, date(17)).mode).toBe("story");
    expect(buildDailyPlan(p, curriculum, date(18)).mode).toBe("light");
    expect(buildDailyPlan(p, curriculum, date(18)).newWords).toEqual([]);
  });
  it("does not mark a half-size new-word lesson as complete and resumes the remaining words", () => {
    const theme = child.childThemes[0];
    const plan = { day: "2026-10-12", newWords: theme.vocabulary.words.slice(0, 4).map((w) => w.id) };
    expect(dailyVocabularyLesson(plan, theme, curriculum, emptyProgress).completionId).toBe("");
    const p = { ...emptyProgress, seen: plan.newWords, completed: [theme.sentences.id, theme.story.id] };
    const next = buildDailyPlan(p, curriculum, date(13));
    expect(next.themeId).toBe(theme.id);
    expect(next.newWords).toHaveLength(4);
    expect(dailyVocabularyLesson(next, theme, curriculum, p).completionId).toBe(theme.vocabulary.id);
  });
  it("continues beyond the foundation with longer stories and new topic-specific vocabulary", () => {
    const p = { ...emptyProgress, seen: child.childThemes.flatMap((t) => t.vocabulary.words.map((w) => w.id)), completed: child.childThemes.flatMap((t) => [t.vocabulary.id, t.sentences.id, t.story.id]) };
    const next = buildDailyPlan(p, curriculum, date(12));
    expect(next.readingStage).toBe(2);
    expect(next.newWords.length).toBeGreaterThan(0);
    expect(next.newWords.every((id) => !p.seen.includes(id))).toBe(true);
    expect(new Set(next.newWords.map((id) => course.courseWordById[id].topic)).size).toBe(1);
    expect(dailyVocabularyLesson(next, child.childThemes[0], curriculum, p).id).toBe("daily-words-2026-10-12");
  });
  it("keeps reading entries for a stored plan written before the lesson fields existed", () => {
    const theme = child.childThemes[0];
    const legacyPlan = { day: "2026-10-12", themeId: theme.id, readingStage: 1, vocabularyLessonId: theme.vocabulary.id, newWords: theme.vocabulary.words.map((word) => word.id), review: [], backlog: 0, mode: "learn" };
    const stored = { ...emptyProgress, dailyPlans: { "2026-10-12": legacyPlan } };
    // the day's stored plan is still honoured exactly as written
    expect(buildDailyPlan(stored, curriculum, date(12))).toEqual(legacyPlan);
    const lessons = planReadingLessons(legacyPlan, theme, childLessonById);
    expect(lessons.legacy).toBe(true);
    expect(lessons.sentences.id).toBe(theme.sentences.id);
    expect(lessons.story.id).toBe(theme.story.id);
    // an explicit empty string means "not offered today"
    expect(planReadingLessons({ ...legacyPlan, sentencesLessonId: "", storyLessonId: "" }, theme, childLessonById))
      .toEqual({ sentences: null, story: null, legacy: false });
    // a legacy stage-2 plan falls back to the long story
    expect(planReadingLessons({ ...legacyPlan, readingStage: 2 }, theme, childLessonById).story.id).toBe(theme.longStory.id);
    // a plan that names familiar lessons keeps naming them
    expect(planReadingLessons({ ...legacyPlan, sentencesLessonId: theme.sentences.id, storyLessonId: theme.story.id }, theme, childLessonById).sentences.id).toBe(theme.sentences.id);
    expect(planReadingLessons({ ...legacyPlan, sentencesLessonId: "child-stale-lesson", storyLessonId: "" }, theme, childLessonById).sentences.id).toBe(theme.sentences.id);
  });
  it("rebuilds a corrupt stored plan instead of crashing the homepage", () => {
    const p = { ...emptyProgress, dailyPlans: { "2026-10-12": { day: "2026-10-12", themeId: "breakfast", newWords: ["missing"] } } };
    expect(buildDailyPlan(p, curriculum, date(12)).newWords).toHaveLength(8);
  });
});
