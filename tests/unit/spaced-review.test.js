import { describe, expect, it } from "vitest";
import { emptyProgress, recordAnswer, recordEncounter, dueReviews, normalizeProgress, dayAfter } from "../../src/utils/learningProgress.js";
import { buildDailyPlan, dailyVocabularyLesson, saveDailyPlan, reviewQuestions } from "../../src/utils/dailyPlan.js";
import * as course from "../../src/data/curriculum.js";
import * as child from "../../src/data/child-course.js";
const curriculum = { ...course, ...child };
const date = (day) => new Date(2026, 9, day, 12);

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
  it("keeps listening separate, resets errors and does not count hints as independent success", () => {
    let p = recordAnswer(emptyProgress, "l2_apple", true, date(12), { skill: "listening" });
    expect(p.memory.l2_apple.reading).toBeUndefined();
    p = recordAnswer(p, "l2_apple", true, date(13), { skill: "reading", hinted: true });
    expect(p.memory.l2_apple.reading.successDays).toEqual([]);
    expect(p.memory.l2_apple.reading.step).toBe(0);
    p = recordAnswer(p, "l2_apple", false, date(15), { skill: "listening" });
    expect(p.memory.l2_apple.listening.successDays).toEqual([]);
    expect(p.memory.l2_apple.listening.due).toBe("2026-10-16");
    expect(p.review).toEqual(["l2_apple"]);
    expect(dayAfter(new Date(2026, 9, 31), 1)).toBe("2026-11-01");
  });
  it("does not import old one-answer mastery or broken schedules", () => {
    const p = normalizeProgress({ mastered: ["l2_apple"], memory: { broken: { reading: { due: "bad", step: 9 } } } });
    expect(p.mastered).toEqual([]);
    expect(p.memory).toEqual({});
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
    expect(buildDailyPlan(p, curriculum, date(13)).newWords).toEqual([]);
  });
  it("caps reviews, retains backlog, reduces new words and preserves the exact skill", () => {
    let p = emptyProgress;
    for (const word of course.courseWords.slice(0, 25)) p = recordAnswer(p, word.id, false, date(11), { skill: "listening" });
    const plan = buildDailyPlan(p, curriculum, date(12));
    expect(plan.review).toHaveLength(20);
    expect(plan.backlog).toBe(5);
    expect(plan.newWords).toHaveLength(4);
    expect(dueReviews(p, date(12))).toHaveLength(25);
    expect(reviewQuestions(plan.review, curriculum).every((q) => q.skill === "listening" && q.audio)).toBe(true);
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
  it("rebuilds a corrupt stored plan instead of crashing the homepage", () => {
    const p = { ...emptyProgress, dailyPlans: { "2026-10-12": { day: "2026-10-12", themeId: "breakfast", newWords: ["missing"] } } };
    expect(buildDailyPlan(p, curriculum, date(12)).newWords).toHaveLength(8);
  });
});
