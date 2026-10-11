import { describe, expect, it } from "vitest";
import { emptyProgress, recordAnswer, recordEncounter, dueReviews, normalizeProgress, minimumReviewIntervalMs } from "../../src/utils/learningProgress.js";
import { buildDailyPlan, saveDailyPlan, reviewBatch, reviewBatches, reviewQuestions } from "../../src/utils/dailyPlan.js";
import * as course from "../../src/data/curriculum.js";
import * as child from "../../src/data/child-course.js";

const time = (text) => new Date(text);
const id = "l2_apple";
const curriculum = { ...course, ...child };

describe("elapsed time between independent retrieval sessions", () => {
  for (const skill of ["reading", "listening"]) it(`does not count ${skill} twice across midnight and permits a later same-day due answer`, () => {
    const first = time("2026-10-12T23:58:00");
    let p = recordAnswer(emptyProgress, id, true, first, { skill });
    p = normalizeProgress(JSON.parse(JSON.stringify(p)));
    expect(dueReviews(p, time("2026-10-13T00:02:00"))).toEqual([]);
    p = recordAnswer(p, id, true, time("2026-10-13T00:02:00"), { skill });
    expect(p.memory[id][skill]).toMatchObject({ step: 1, due: "2026-10-13", successDays: ["2026-10-12"], lastAssessedAt: first.getTime() });
    p = recordAnswer(p, id, true, time("2026-10-13T03:57:59.999"), { skill });
    expect(p.memory[id][skill].step).toBe(1);
    const ready = new Date(first.getTime() + minimumReviewIntervalMs);
    expect(dueReviews(p, ready)).toHaveLength(1);
    p = recordAnswer(p, id, true, ready, { skill });
    expect(p.memory[id][skill]).toMatchObject({ step: 2, due: "2026-10-15", successDays: ["2026-10-12", "2026-10-13"], lastAssessedAt: ready.getTime() });
  });
  for (const hinted of [false, true]) it(`does not restore independent evidence immediately after a ${hinted ? "hint" : "wrong answer"} across midnight`, () => {
    let p = recordAnswer(emptyProgress, id, true, time("2026-10-10T12:00:00"));
    const lapse = time("2026-10-12T23:58:00");
    p = recordAnswer(p, id, hinted, lapse, { hinted });
    expect(dueReviews(p, time("2026-10-13T00:02:00"))).toEqual([]);
    p = recordAnswer(p, id, true, time("2026-10-13T00:02:00"));
    expect(p.memory[id].reading).toMatchObject({ step: 0, lastCorrect: false, successDays: ["2026-10-10"], lastAssessedAt: lapse.getTime() });
    expect(p.review.includes(id)).toBe(!hinted);
    p = recordAnswer(p, id, true, time("2026-10-13T03:58:00"));
    expect(p.memory[id].reading).toMatchObject({ step: 1, lastCorrect: true, successDays: ["2026-10-10", "2026-10-13"] });
    expect(p.review).not.toContain(id);
  });
  it("does not count same-date practice after four hours or postpone the anchor with early correct practice", () => {
    const first = time("2026-10-12T12:00:00");
    let p = recordAnswer(emptyProgress, id, true, first);
    p = recordAnswer(p, id, true, time("2026-10-12T20:00:00"));
    expect(p.memory[id].reading).toMatchObject({ step: 1, successDays: ["2026-10-12"], lastAssessedAt: first.getTime() });
    p = recordAnswer(p, id, true, time("2026-10-13T00:00:00"));
    expect(p.memory[id].reading.step).toBe(2);
  });
  it("keeps first assessments of reading and listening independent even in the same minute", () => {
    const now = time("2026-10-12T23:58:00");
    let p = recordEncounter(emptyProgress, id, now);
    for (const skill of ["reading", "listening"]) p = recordAnswer(p, id, true, now, { skill });
    for (const skill of ["reading", "listening"]) expect(p.memory[id][skill].successDays).toEqual(["2026-10-12"]);
    expect(p.mastered).toEqual([]);
  });
  it("uses a conservative end-of-day anchor for old assessed records without inventing a timestamp", () => {
    const reading = { due: "2026-10-13", lastDay: "2026-10-12", step: 1, successDays: ["2026-10-12"], lastCorrect: true, assessed: true };
    const legacy = { memory: { [id]: { reading } } };
    expect(normalizeProgress(legacy).memory[id].reading).not.toHaveProperty("lastAssessedAt");
    expect(dueReviews(legacy, time("2026-10-13T00:02:00"))).toEqual([]);
    const early = recordAnswer(legacy, id, true, time("2026-10-13T00:02:00"));
    expect(early.memory[id].reading.step).toBe(1);
    expect(early.memory[id].reading.successDays).toEqual(["2026-10-12"]);
    const later = recordAnswer(legacy, id, true, time("2026-10-13T12:00:00"));
    expect(later.memory[id].reading.step).toBe(2);
  });
  it("ignores malformed timestamp fields without deleting the word's date evidence", () => {
    const reading = { due: "2026-10-13", lastDay: "2026-10-12", step: 1, successDays: ["2026-10-12"], lastCorrect: true };
    for (const lastAssessedAt of [-1, NaN, Infinity, "2026-10-12T23:58:00", 8_640_000_000_000_001]) {
      const p = normalizeProgress({ memory: { [id]: { reading: { ...reading, lastAssessedAt } } } });
      expect(p.memory[id].reading).toEqual(reading);
      expect(dueReviews(p, time("2026-10-13T00:02:00"))).toEqual([]);
    }
  });
  it("does not make a future timestamp eligible when the device clock moves backwards", () => {
    const reading = { due: "2026-10-13", lastDay: "2026-10-12", step: 1, successDays: ["2026-10-12"], lastCorrect: true, assessed: true, lastAssessedAt: time("2026-10-13T01:00:00").getTime() };
    const p = { memory: { [id]: { reading } } };
    expect(dueReviews(p, time("2026-10-13T00:02:00"))).toEqual([]);
    expect(recordAnswer(p, id, true, time("2026-10-13T00:02:00")).memory[id].reading.step).toBe(1);
  });
  for (const [firstDay, nextDay, due] of [["2026-10-31", "2026-11-01", "2026-11-03"], ["2026-12-31", "2027-01-01", "2027-01-03"]]) it(`handles the ${firstDay} calendar boundary without counting minutes as a second day`, () => {
    let p = recordAnswer(emptyProgress, id, true, time(`${firstDay}T23:58:00`));
    p = recordAnswer(p, id, true, time(`${nextDay}T00:02:00`));
    expect(p.memory[id].reading.successDays).toEqual([firstDay]);
    p = recordAnswer(p, id, true, time(`${nextDay}T03:58:00`));
    expect(p.memory[id].reading).toMatchObject({ step: 2, due, successDays: [firstDay, nextDay] });
  });
});

describe("deferred review admission into a saved daily plan", () => {
  it("adds eligible reviews to a previously empty plan without replacing its new words or reading tasks", () => {
    let p = recordAnswer(emptyProgress, id, true, time("2026-10-12T23:58:00"));
    const early = buildDailyPlan(p, curriculum, time("2026-10-13T00:02:00"));
    expect(early.review).toEqual([]);
    expect(early.deferredReviews).toEqual([{ id, skill: "reading" }]);
    p = saveDailyPlan(p, early);
    expect(buildDailyPlan(p, curriculum, time("2026-10-13T03:57:00"))).toEqual(early);
    const later = buildDailyPlan(p, curriculum, time("2026-10-13T04:05:00"));
    expect(later.review).toEqual([{ id, skill: "reading" }]);
    expect(later.deferredReviews).toEqual([]);
    expect(later.reviewBatchEnds).toEqual([1]);
    expect(later.newWords).toEqual(early.newWords);
    expect(later.sentencesLessonId).toBe(early.sentencesLessonId);
    expect(later.storyLessonId).toBe(early.storyLessonId);
  });
  it("appends a separate batch without changing a partly answered batch's members or question fingerprint", () => {
    let p = emptyProgress;
    for (const word of course.courseWords.slice(0, 5)) p = recordAnswer(p, word.id, false, time("2026-10-12T12:00:00"));
    p = recordAnswer(p, id, true, time("2026-10-12T23:58:00"));
    const early = buildDailyPlan(p, curriculum, time("2026-10-13T00:02:00"));
    expect(early.review).toHaveLength(5);
    p = saveDailyPlan(p, early);
    for (const item of early.review.slice(0, 2)) p = recordAnswer(p, item.id, true, time("2026-10-13T00:02:00"), { skill: item.skill });
    const before = reviewBatches(early)[0];
    const later = buildDailyPlan(p, curriculum, time("2026-10-13T04:05:00"));
    expect(later.reviewBatchEnds).toEqual([5, 6]);
    expect(reviewBatches(later)[0]).toEqual(before);
    expect(reviewQuestions(reviewBatches(later)[0], curriculum)).toEqual(reviewQuestions(before, curriculum));
    expect(reviewBatch(later, p)).toMatchObject({ batchIndex: 0, unanswered: 3, answered: 2 });
    for (const item of before.slice(2)) p = recordAnswer(p, item.id, true, time("2026-10-13T04:05:00"), { skill: item.skill });
    expect(reviewBatch(later, p)).toMatchObject({ batchIndex: 1, batch: [{ id, skill: "reading" }] });
    expect(reviewBatch(later, p, { unfinishedBatches: [0] }).batch).toEqual(before);
  });
  it("keeps the thirty-question and three-batch caps, carrying an unadmitted review to the next day", () => {
    let p = emptyProgress;
    for (const word of course.courseWords.slice(0, 27)) p = recordAnswer(p, word.id, false, time("2026-10-12T12:00:00"));
    p = recordAnswer(p, id, true, time("2026-10-12T23:58:00"));
    const early = buildDailyPlan(p, curriculum, time("2026-10-13T00:02:00"));
    p = saveDailyPlan(p, early);
    const later = buildDailyPlan(p, curriculum, time("2026-10-13T04:05:00"));
    expect(later.review).toEqual(early.review);
    expect(reviewBatches(later)).toHaveLength(3);
    expect(later.backlog).toBe(1);
    expect(dueReviews(p, time("2026-10-14T12:00:00")).some((item) => item.id === id)).toBe(true);
  });
  it("removes a deferred item already independently answered in another lesson instead of asking it again", () => {
    let p = recordAnswer(emptyProgress, id, true, time("2026-10-12T23:58:00"));
    p = saveDailyPlan(p, buildDailyPlan(p, curriculum, time("2026-10-13T00:02:00")));
    p = recordAnswer(p, id, true, time("2026-10-13T04:05:00"));
    const plan = buildDailyPlan(p, curriculum, time("2026-10-13T04:06:00"));
    expect(plan.deferredReviews).toEqual([]);
    expect(plan.backlog).toBe(0);
    expect(plan.review).toEqual([]);
  });
  it("temporarily holds a legacy frozen batch rather than changing its contents or counting a midnight answer", () => {
    const p = recordAnswer(emptyProgress, id, true, time("2026-10-12T23:58:00"));
    const plan = { day: "2026-10-13", review: [{ id, skill: "reading" }] };
    expect(reviewBatch(plan, p, { date: time("2026-10-13T00:02:00") })).toMatchObject({ ready: false, done: false });
    expect(reviewBatch(plan, p, { date: time("2026-10-13T04:05:00") })).toMatchObject({ ready: true, done: false });
    expect(reviewBatches(plan)).toEqual([[{ id, skill: "reading" }]]);
  });
});
