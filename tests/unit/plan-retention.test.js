import { describe, expect, it } from "vitest";
import { emptyProgress, dayAfter, normalizeProgress, recordAnswer, recordEncounter } from "../../src/utils/learningProgress.js";
import { saveDailyPlan } from "../../src/utils/dailyPlan.js";

const start = new Date("2025-01-01T12:00:00");
const plan = (day) => ({ day, themeId: "breakfast", newWords: ["l2_apple"], review: [], backlog: 0, mode: "learn" });
const plans = (count) => Object.fromEntries(Array.from({ length: count }, (_, index) => { const day = dayAfter(start, index); return [day, plan(day)]; }));

describe("bounded daily plan storage", () => {
  it("keeps the newest ninety plans, independently of input ordering", () => {
    const saved = plans(400);
    const shuffled = Object.fromEntries(Object.entries(saved).reverse());
    const result = normalizeProgress({ dailyPlans: shuffled }, new Date("2026-02-04T12:00:00"));
    expect(Object.keys(result.dailyPlans).sort()).toEqual(Object.keys(saved).slice(-90));
    expect(result.dailyPlans[dayAfter(start, 399)]).toBe(saved[dayAfter(start, 399)]);
  });
  it("does not alter a frozen plan, partial batch, or delayed review", () => {
    const saved = plans(90);
    const day = dayAfter(start, 89);
    saved[day] = { ...saved[day], review: [{ id: "l2_apple", skill: "reading" }], reviewBatchEnds: [1], deferredReviews: [{ id: "l2_banana", skill: "listening" }] };
    expect(normalizeProgress({ dailyPlans: saved }, new Date(`${day}T12:00:00`)).dailyPlans).toEqual(saved);
  });
  it("protects the active date even after a backwards clock change", () => {
    const saved = plans(120);
    const day = dayAfter(start, 3);
    const result = normalizeProgress({ dailyPlans: saved }, new Date(`${day}T12:00:00`));
    expect(Object.keys(result.dailyPlans)).toHaveLength(90);
    expect(result.dailyPlans[day]).toBe(saved[day]);
    expect(Object.keys(result.dailyPlans).filter((key) => key !== day).sort()).toEqual(Object.keys(saved).slice(-89));
  });
  it("persists a newly saved old-date plan without going over the limit", () => {
    const saved = plans(120);
    const active = { ...plan("2024-12-31"), review: [{ id: "l2_apple", skill: "listening" }] };
    const result = saveDailyPlan({ ...emptyProgress, dailyPlans: saved }, active);
    expect(Object.keys(result.dailyPlans)).toHaveLength(90);
    expect(result.dailyPlans[active.day]).toBe(active);
    expect(Object.keys(result.dailyPlans).filter((day) => day !== active.day).sort()).toEqual(Object.keys(saved).slice(-89));
  });
  it("rejects malformed day keys and non-plan entries without erasing valid plans", () => {
    const good = plan("2026-10-12");
    const result = normalizeProgress({ dailyPlans: { "2026-10-12": good, "2026-02-30": plan("2026-02-30"), bad: good, "2026-10-13": good, "2026-10-14": null, "2026-10-15": [] } });
    expect(result.dailyPlans).toEqual({ "2026-10-12": good });
    expect(normalizeProgress({ dailyPlans: [] }).dailyPlans).toEqual({});
  });
  it("keeps all real memory evidence, completed courses, mistakes, drafts and day totals", () => {
    const day = "2026-10-12";
    const skill = { lastDay: day, due: "2027-10-12", step: 10, lastCorrect: true, successDays: ["2025-01-01", "2025-01-03", day] };
    const source = { ...emptyProgress, dailyPlans: plans(400), memory: { l2_apple: { reading: skill, listening: skill } }, seen: ["l2_apple"], mastered: ["l2_apple"], completed: ["checkpoint-1"], review: ["grammar-be-1"], drafts: { one: "My story" }, days: { "2025-01-01": 8 } };
    const result = normalizeProgress(source);
    for (const field of ["memory", "seen", "mastered", "completed", "review", "drafts", "days"]) expect(result[field], field).toEqual(source[field]);
    expect(Object.keys(result.dailyPlans)).toHaveLength(90);
  });
  it("protects the supplied assessment day during encounters and answers", () => {
    const saved = plans(120);
    const date = new Date("2025-01-02T12:00:00");
    for (const result of [recordEncounter({ dailyPlans: saved }, "l2_apple", date), recordAnswer({ dailyPlans: saved }, "l2_apple", true, date)]) {
      expect(Object.keys(result.dailyPlans)).toHaveLength(90);
      expect(result.dailyPlans["2025-01-02"]).toBe(saved["2025-01-02"]);
    }
  });
});
