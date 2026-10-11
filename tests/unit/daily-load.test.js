import { describe, expect, it } from "vitest";
import { emptyProgress, recordAnswer, recordEncounter, normalizeProgress, dayAfter, reviewGaps } from "../../src/utils/learningProgress.js";
import { buildDailyPlan, dailyVocabularyLesson, saveDailyPlan, reviewBatch, reviewLoadForecast, REVIEW_BATCH_SIZE, REVIEW_DAILY_LIMIT } from "../../src/utils/dailyPlan.js";
import * as course from "../../src/data/curriculum.js";
import * as child from "../../src/data/child-course.js";
const curriculum = { ...course, ...child };
const lessonById = Object.fromEntries(curriculum.childLessons.map((lesson) => [lesson.id, lesson]));
const DAY = (offset, hour = 18) => new Date(2026, 9, 12 + offset, hour);

// One honest day of the child flow: the plan's batches, the new-word quiz, and
// the sentences/story the Today page offers. Everything goes through the real
// recordAnswer/recordEncounter functions so the load numbers are not invented.
function playDay(progress, date, { answerReviews = true } = {}) {
  const plan = buildDailyPlan(progress, curriculum, date);
  const before = new Set(Object.keys(normalizeProgress(progress).memory));
  let p = saveDailyPlan(progress, plan);
  const theme = curriculum.childThemes.find((item) => item.id === plan.themeId);
  if (answerReviews) for (const item of plan.review) p = recordAnswer(p, item.id, true, date, { skill: item.skill });
  const vocabulary = dailyVocabularyLesson(plan, theme, curriculum, p);
  plan.newWords.forEach((id, index) => {
    p = recordEncounter(p, id, date);
    p = recordAnswer(p, id, true, date, { skill: index % 2 === 1 ? "listening" : "reading" });
  });
  if (plan.newWords.length && vocabulary.completionId) p = { ...p, completed: [...new Set([...p.completed, vocabulary.completionId])] };
  for (const lessonId of [plan.sentencesLessonId, plan.storyLessonId]) {
    const lesson = lessonById[lessonId];
    if (!lesson) continue;
    for (const question of lesson.questions) p = recordAnswer(p, question.id, true, date, { skill: question.audio ? "listening" : "reading" });
    p = { ...p, completed: [...new Set([...p.completed, lesson.id])] };
  }
  const memory = p.memory;
  const createdQuestions = Object.keys(memory).filter((id) => !before.has(id) && (curriculum.childQuestionById[id] || curriculum.courseQuestionById[id])).length;
  if (createdQuestions !== plan.newQuestions) {
    throw new Error(`day ${plan.day}: the flow created ${createdQuestions} new question records but the plan announced ${plan.newQuestions}`);
  }
  return { progress: p, plan, newQuestions: createdQuestions };
}

function runDays(progress, days, { startOffset = 0, skip = 0 } = {}) {
  const log = [];
  let p = progress;
  for (let index = 0; index < days; index++) {
    const dayNumber = startOffset + index;
    if (skip && index >= skip.from && index < skip.to) {
      log.push({ day: dayNumber, skipped: true, backlog: buildDailyPlan(p, curriculum, DAY(dayNumber)).backlog });
      continue;
    }
    const { progress: next, plan, newQuestions } = playDay(p, DAY(dayNumber));
    p = next;
    log.push({ day: dayNumber, mode: plan.mode, newWords: plan.newWords.length, reviewCount: plan.review.length, backlog: plan.backlog, pressure: plan.pressure, newQuestions, plannedNewQuestions: plan.newQuestions, mastered: p.mastered.length, seen: p.seen.length });
  }
  return { progress: p, log };
}

function seededLearner(wordCount, { spread = 60, shift = -30 } = {}) {
  const memory = {};
  const seen = [];
  curriculum.courseWords.slice(0, wordCount).forEach((word, index) => {
    seen.push(word.id);
    memory[word.id] = {};
    ["reading", "listening"].forEach((skill, skillIndex) => {
      const step = 2 + ((index + skillIndex) % 6);
      const dueOffset = ((index * 7 + skillIndex * 23) % spread) + shift;
      const due = dayAfter(DAY(0), dueOffset);
      const lastDay = dayAfter(DAY(0), dueOffset - reviewGaps[step - 1]);
      const third = dayAfter(new Date(`${lastDay}T12:00:00`), -3);
      memory[word.id][skill] = {
        step, due, lastDay,
        successDays: [dayAfter(new Date(`${third}T12:00:00`), -5), third, lastDay],
        lastCorrect: true, assessed: true,
      };
    });
  });
  return { ...emptyProgress, seen, memory };
}

describe("daily load control", () => {
  it("keeps a normal day at eight words, six sentences and the short story", () => {
    const plan = buildDailyPlan(emptyProgress, curriculum, DAY(0));
    expect(plan.mode).toBe("learn");
    expect(plan.newWords).toHaveLength(8);
    expect(plan.newQuestions).toBe(9);
    expect(plan.review.length).toBeLessThanOrEqual(REVIEW_DAILY_LIMIT);
    expect(plan.batchSize).toBe(REVIEW_BATCH_SIZE);
  });

  it("digests a 240-day run of a 300-word learner without losing momentum", { timeout: 120_000 }, () => {
    const { progress, log } = runDays(seededLearner(300), 240);
    const learnDays = log.filter((entry) => entry.mode === "learn" || entry.mode === "catchup");
    const backlogs = log.map((entry) => entry.backlog);
    const peakBacklog = Math.max(...backlogs);
    const lastThirty = log.slice(-30);
    console.log("[240d/300-word]", JSON.stringify({
      first: log[0], last: log.at(-1),
      seriesEvery30Days: log.filter((entry, index) => index % 30 === 0 || index === log.length - 1).map((entry) => entry.backlog),
      peakBacklog, finalBacklog: backlogs.at(-1),
      meanLast30Backlog: Math.round(lastThirty.reduce((sum, entry) => sum + entry.backlog, 0) / lastThirty.length),
      catchupDays: log.filter((entry) => entry.mode === "catchup").length,
      daysWithFewerThanTwoNewWords: learnDays.filter((entry) => entry.newWords < 2).length,
      seen: progress.seen.length, mastered: progress.mastered.length,
      memoryKeys: Object.keys(progress.memory).length,
    }));
    expect(Math.max(...log.map((entry) => entry.reviewCount))).toBeLessThanOrEqual(REVIEW_DAILY_LIMIT);
    // starts from an artificial 280-item carry, so the peak is inherited, not grown
    expect(peakBacklog).toBeLessThanOrEqual(320);
    // the carry is digested and then stays in a controlled band instead of climbing
    expect(backlogs.at(-1)).toBeLessThan(peakBacklog / 3);
    expect(backlogs.at(-1)).toBeLessThanOrEqual(90);
    expect(backlogs.at(-1)).toBeLessThanOrEqual(backlogs.at(-30) + 40);
    // new vocabulary never stalls: every learning day offers at least two words
    expect(learnDays.every((entry) => entry.newWords >= 2)).toBe(true);
    expect(progress.seen.length).toBeGreaterThan(400);
    expect(progress.mastered.length).toBeGreaterThan(50);
  });

  it("digests a fresh 1687-word bank for 240 days and keeps the queue bounded", { timeout: 180_000 }, () => {
    const { progress, log } = runDays(emptyProgress, 240);
    const backlogs = log.map((entry) => entry.backlog);
    const peak = Math.max(...backlogs);
    console.log("[240d/full bank]", JSON.stringify({
      first: log[0], mid: log[119], last: log.at(-1),
      peakBacklog: peak, finalBacklog: backlogs.at(-1),
      catchupDays: log.filter((entry) => entry.mode === "catchup").length,
      learnDays: log.filter((entry) => entry.mode === "learn").length,
      weekendDays: log.filter((entry) => entry.mode === "light" || entry.mode === "story").length,
      minNewWordsOnLearningDays: Math.min(...log.filter((entry) => entry.mode === "learn" || entry.mode === "catchup").map((entry) => entry.newWords)),
      seen: progress.seen.length, mastered: progress.mastered.length,
    }));
    expect(peak).toBeLessThanOrEqual(250);
    // the queue must be smaller at the end than at its peak, i.e. it digests
    expect(backlogs.at(-1)).toBeLessThan(peak);
    expect(log.every((entry) => entry.reviewCount <= REVIEW_DAILY_LIMIT)).toBe(true);
    expect(progress.mastered.length).toBeGreaterThan(100);
  });

  it("clears 20, 30 and 100 overdue reviews instead of feeding them", { timeout: 120_000 }, () => {
    const results = {};
    for (const size of [20, 30, 100]) {
      let p = seededLearner(60, { spread: 40, shift: 40 });
      const words = curriculum.courseWords.slice(300, 300 + size);
      for (const word of words) p = recordAnswer(p, word.id, false, DAY(-1), { skill: "reading" });
      const before = buildDailyPlan(p, curriculum, DAY(0));
      const { progress: after, log } = runDays(p, size > 30 ? 45 : 20);
      const series = log.map((entry) => entry.backlog);
      const peak = Math.max(...series);
      const earlyPeak = Math.max(...series.slice(0, 15));
      const latePeak = Math.max(...series.slice(-15));
      const digestDay = series.findIndex((value) => value === 0);
      results[size] = { review: before.review.length, backlog: before.backlog, digestDay, peak, earlyPeak, latePeak, final: series.at(-1), seen: after.seen.length, series: series.join(",") };
      expect(before.review.length).toBeLessThanOrEqual(REVIEW_DAILY_LIMIT);
      expect(log.every((entry) => entry.reviewCount <= REVIEW_DAILY_LIMIT)).toBe(true);
      expect(log.every((entry) => entry.reviewCount >= 1)).toBe(true);
      if (size > 30) {
        // a 100-item carry is more than three days of budget, so day one really is backlogged
        expect(before.backlog).toBe(70);
        expect(digestDay).toBeGreaterThanOrEqual(0);
        expect(digestDay).toBeLessThanOrEqual(35);
        // the queue really empties (more than once) rather than just dipping by luck
        expect(series.filter((value) => value === 0).length).toBeGreaterThanOrEqual(2);
        // and it stays bounded while the carry is worked off
        expect(peak).toBeLessThanOrEqual(110);
        expect(series.slice(-15).reduce((sum, value) => sum + value, 0)).toBeLessThan(series.slice(0, 15).reduce((sum, value) => sum + value, 0));
        // new vocabulary keeps advancing while the carry is digested
        expect(after.seen.length).toBeGreaterThan(60);
      } else {
        // a 20/30-item carry fits inside one day's budget, so it never becomes a backlog
        expect(before.backlog).toBe(0);
        expect(peak).toBeLessThanOrEqual(90);
      }
    }
    console.log("[backlog 20/30/100]", JSON.stringify(results));
  });

  it("keeps a familiar-story day from creating nine new comprehension questions", { timeout: 120_000 }, () => {
    let p = seededLearner(80);
    const theme = child.childThemes[0];
    for (const question of theme.sentences.questions) p = recordAnswer(p, question.id, true, DAY(-1), { skill: question.audio ? "listening" : "reading" });
    for (const question of theme.story.questions) p = recordAnswer(p, question.id, true, DAY(-1), { skill: "reading" });
    p = { ...p, completed: [theme.sentences.id, theme.story.id] };
    for (const word of curriculum.courseWords.slice(400, 500)) p = recordAnswer(p, word.id, false, DAY(-1), { skill: "reading" });
    const { plan, newQuestions } = playDay(p, DAY(0));
    console.log("[catchup day]", JSON.stringify({ mode: plan.mode, newWords: plan.newWords.length, planNewQuestions: plan.newQuestions, createdQuestions: newQuestions, sentencesLessonId: plan.sentencesLessonId, storyLessonId: plan.storyLessonId }));
    expect(plan.mode).toBe("catchup");
    expect(plan.newWords.length).toBeGreaterThanOrEqual(2);
    expect(plan.newQuestions).toBe(0);
    expect(newQuestions).toBe(0);
  });

  it("recovers from a week of missed study without losing mastery or stalling", { timeout: 120_000 }, () => {
    const first = runDays(seededLearner(120), 20);
    const skipped = runDays(first.progress, 30, { startOffset: 20, skip: { from: 0, to: 7 } });
    const during = skipped.log.slice(0, 7);
    const after = skipped.log.slice(7);
    const masteredBefore = first.progress.mastered.length;
    console.log("[missed week]", JSON.stringify({
      backlogsDuring: during.map((entry) => entry.backlog),
      firstDaysAfter: after.slice(0, 5).map((entry) => ({ mode: entry.mode, newWords: entry.newWords, backlog: entry.backlog })),
      masteredBefore, masteredAfter: skipped.progress.mastered.length,
      finalBacklog: after.at(-1).backlog,
    }));
    expect(during.every((entry) => entry.skipped)).toBe(true);
    expect(skipped.progress.mastered.length).toBeGreaterThanOrEqual(masteredBefore);
    expect(after.some((entry) => entry.mode === "catchup" || entry.newWords <= 4)).toBe(true);
    expect(after.at(-1).backlog).toBeLessThanOrEqual(after[0].backlog);
  });

  it("maintains a fully learned 1687-word bank for 240 days", { timeout: 300_000 }, () => {
    const learned = seededLearner(1687, { spread: 60, shift: -30 });
    const full = { ...learned, completed: child.childThemes.flatMap((theme) => [theme.vocabulary.id, theme.sentences.id, theme.story.id, theme.longStory.id]) };
    const { progress, log } = runDays(full, 240);
    const series = log.map((entry) => entry.backlog);
    const reviewCounts = log.map((entry) => entry.reviewCount);
    const peak = Math.max(...series);
    const tail = log.slice(-30);
    const summary = {
      peakBacklog: peak,
      firstBacklog: series[0],
      tailMaxBacklog: Math.max(...tail.map((entry) => entry.backlog)),
      tailMeanBacklog: Math.round(tail.reduce((sum, entry) => sum + entry.backlog, 0) / tail.length),
      finalBacklog: series.at(-1),
      maxDailyReviews: Math.max(...reviewCounts),
      minDailyReviews: Math.min(...reviewCounts),
      meanDailyReviews: Math.round(reviewCounts.reduce((sum, value) => sum + value, 0) / reviewCounts.length),
      catchupDays: log.filter((entry) => entry.mode === "catchup").length,
      newQuestionRecords: log.reduce((sum, entry) => sum + entry.newQuestions, 0),
      seriesEvery30Days: log.filter((entry, index) => index % 30 === 0 || index === log.length - 1).map((entry) => entry.backlog),
      // the child is saturated every day, so the demand equals 30 answers plus the queue change
      dailyDemand: Number((reviewCounts.reduce((sum, value) => sum + value, 0) / log.length + (series.at(-1) - series[0]) / log.length).toFixed(2)),
      tailDailyDemand: Number((reviewCounts.slice(-30).reduce((sum, value) => sum + value, 0) / 30 + (series.at(-1) - series.at(-30)) / 30).toFixed(2)),
      tailSlope: series.at(-1) - series.at(-30),
      memoryKeys: Object.keys(progress.memory).length,
      seenWords: progress.seen.length,
      masteredWords: progress.mastered.length,
    };
    console.log("[240d/fully learned 1687]", JSON.stringify(summary));
    // every day stays inside the batch budget, and nothing new is introduced once the bank is learned
    expect(log.every((entry) => entry.reviewCount <= REVIEW_DAILY_LIMIT)).toBe(true);
    expect(log.every((entry) => entry.reviewCount >= 1)).toBe(true);
    expect(log.every((entry) => entry.newWords === 0)).toBe(true);
    // Completed flags alone cannot create "familiar" question evidence.
    expect(summary.newQuestionRecords).toBe(0);
    expect(summary.memoryKeys).toBe(1687);
    expect(progress.seen.length).toBe(1687);
    expect(progress.mastered.length).toBeGreaterThan(1000);
    // Documented trade-off: at a fixed 30-review day the fully learned 1687-word bank
    // stays saturated (exactly 30 every day) and the tail is only slowly worked down.
    // The numbers below encode today's behaviour so a future budget change must be deliberate.
    expect(summary.minDailyReviews).toBe(REVIEW_DAILY_LIMIT);
    expect(summary.maxDailyReviews).toBe(REVIEW_DAILY_LIMIT);
    expect(peak).toBeLessThanOrEqual(3400);
    expect(series.at(-1)).toBeLessThan(peak);
    expect(summary.tailMaxBacklog).toBeLessThan(peak);
    // the maintenance demand has fallen below the daily budget, so the inherited carry drains
    expect(summary.tailDailyDemand).toBeLessThan(REVIEW_DAILY_LIMIT);
    expect(summary.tailSlope).toBeLessThan(0);
  });

  it("builds a day in milliseconds even with the full maintenance queue", { timeout: 120_000 }, () => {
    const full = seededLearner(1687, { spread: 60, shift: -30 });
    expect(Object.keys(full.memory).length).toBe(1687);
    const started = performance.now();
    let plan;
    const runs = 20;
    for (let index = 0; index < runs; index++) plan = buildDailyPlan(full, curriculum, DAY(0));
    const perBuild = (performance.now() - started) / runs;
    const forecastStarted = performance.now();
    const forecast = reviewLoadForecast(full, curriculum, DAY(0));
    const perForecast = performance.now() - forecastStarted;
    console.log("[performance]", JSON.stringify({ perBuildMs: Number(perBuild.toFixed(2)), perForecastMs: Number(perForecast.toFixed(2)), forecast, review: plan.review.length, pressure: plan.pressure }));
    expect(plan.review.length).toBeLessThanOrEqual(REVIEW_DAILY_LIMIT);
    expect(plan.pressure).toBeGreaterThan(REVIEW_DAILY_LIMIT);
    expect(forecast).toHaveLength(7);
    expect(perBuild).toBeLessThan(50);
    expect(perForecast).toBeLessThan(50);
  });

  it("keeps each daily batch fixed, never over ten, and never asks the same item twice", { timeout: 60_000 }, () => {
    let p = seededLearner(40, { spread: 40, shift: 40 });
    for (const word of curriculum.courseWords.slice(500, 600)) p = recordAnswer(p, word.id, false, DAY(-1), { skill: "reading" });
    const plan = buildDailyPlan(p, curriculum, DAY(0));
    expect(plan.review.length).toBe(REVIEW_DAILY_LIMIT);
    const key = (item) => `${item.id}:${item.skill}`;
    const answeredToday = (progress, item) => progress.memory[item.id]?.[item.skill]?.lastDay === plan.day;
    const first = reviewBatch(plan, p);
    expect(first.batch.map(key)).toEqual(plan.review.slice(0, 10).map(key));
    // the child answers four questions, leaves, and comes back to the same batch
    for (const item of first.batch.slice(0, 4)) p = recordAnswer(p, item.id, true, DAY(0), { skill: item.skill });
    const comingBack = reviewBatch(plan, p);
    expect(comingBack.batchIndex).toBe(0);
    expect(comingBack.batch.map(key)).toEqual(first.batch.map(key));
    expect(comingBack.unanswered).toBe(6);
    expect(comingBack.answered).toBe(4);
    // every remaining question is served exactly once, in batches of at most ten
    const served = new Set(first.batch.slice(0, 4).map(key));
    for (let guard = 0; guard < 10; guard++) {
      const batch = reviewBatch(plan, p);
      if (batch.done) break;
      expect(batch.batch.length).toBeLessThanOrEqual(REVIEW_BATCH_SIZE);
      // a fixed batch may still contain items the child already answered inside it
      if (batch.batchIndex === 0) expect(batch.batch.filter((item) => answeredToday(p, item))).toHaveLength(4);
      for (const item of batch.batch) {
        if (answeredToday(p, item)) continue;
        expect(served.has(key(item))).toBe(false);
        served.add(key(item));
        p = recordAnswer(p, item.id, true, DAY(0), { skill: item.skill });
      }
      if (guard === 9) throw new Error("batches never finished");
    }
    const finished = reviewBatch(plan, p);
    expect(finished.done).toBe(true);
    expect(finished.answered).toBe(REVIEW_DAILY_LIMIT);
    expect(served.size).toBe(REVIEW_DAILY_LIMIT);
  });
});
