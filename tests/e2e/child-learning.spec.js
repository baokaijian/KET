import { test, expect } from "@playwright/test";
import { childThemes } from "../../src/data/child-course.js";
import { courseWords, courseWordById } from "../../src/data/curriculum.js";
import { wordImages } from "../../src/data/word-images.js";
import { familyImages } from "../../src/data/family-images.js";
import { homeImages } from "../../src/data/home-images.js";
import { parkImages } from "../../src/data/park-images.js";
import { healthImages } from "../../src/data/health-images.js";
import { clothesImages } from "../../src/data/clothes-images.js";
import { weatherImages } from "../../src/data/weather-images.js";
import { bodyImages } from "../../src/data/body-images.js";
import { shoppingImages } from "../../src/data/shopping-images.js";
import { dayImages } from "../../src/data/day-images.js";
import { starterImages } from "../../src/data/starter-images.js";
import { getSpeakableWordText } from "../../src/utils/speechText.js";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__spoken = [];
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: {
      cancel() {}, resume() {}, getVoices: () => [{ lang: "en-GB", name: "English" }],
      speak(utterance) { window.__spoken.push(utterance.text); setTimeout(() => utterance.onend?.(), 5); },
    } });
  });
});
async function answerAll(page, questions, total = questions.length, score = total) {
  for (const [index, question] of questions.entries()) {
    await expect(page.getByRole("textbox", { name: /拼写|填空/ })).toHaveCount(0);
    if (question.audio) {
      await expect(page.locator(".answer-option").first()).toBeDisabled();
      await page.getByRole("button", { name: "播放听力", exact: true }).click();
      await expect(page.getByText("听完了，选一个答案吧。")).toBeVisible();
    }
    await page.locator(".answer-option").nth(question.answer).click();
    await expect(page.getByText("答对啦！", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: index === questions.length - 1 ? "查看结果" : "下一题", exact: true }).click();
  }
  await expect(page.locator(".result-stage")).toContainText(`${score} / ${total}`);
  await page.getByRole("button", { name: "完成练习", exact: true }).click();
}

test("daily eight-word lesson resumes after leaving and reloading without demanding spelling", async ({ page }) => {
  await page.goto("./#today");
  await expect(page.getByRole("region", { name: "今日听读计划" })).toContainText("8 个新词");
  await page.getByRole("button", { name: "开始学习", exact: true }).click();
  await expect(page.locator(".word-detail h1")).toHaveText("apple");
  await page.getByRole("button", { name: "下一个单词", exact: true }).click();
  await expect(page.locator(".word-detail h1")).toHaveText("banana");
  await page.getByRole("button", { name: "返回", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "开始学习", exact: true }).click();
  await expect(page.locator(".word-detail h1")).toHaveText("banana");
  for (const [index, word] of childThemes[0].vocabulary.words.slice(1).entries()) {
    await expect(page.locator(".word-detail")).toContainText(word.partOfSpeechLabel);
    await expect(page.locator(".learning-stage img")).toHaveCount(1);
    await page.getByRole("button", { name: "听发音", exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.__spoken.at(-1))).toBe(getSpeakableWordText(word));
    await page.getByRole("button", { name: index === 6 ? "开始小练习" : "下一个单词", exact: true }).click();
  }
  await answerAll(page, childThemes[0].vocabulary.questions);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")));
  expect(stored.seen).toHaveLength(8);
  expect(stored.mastered).toEqual([]);
  expect(Object.keys(stored.dailyPlans)).toHaveLength(1);
  expect(Object.keys(stored.memory)).toHaveLength(8);
});

for (const correctionCorrect of [true, false]) test(`one correction (${correctionCorrect ? "right" : "wrong"}) survives reload without erasing evidence or changing first-attempt scores`, async ({ page }, info) => {
  await page.clock.setFixedTime(new Date("2026-10-19T12:00:00Z"));
  const theme = childThemes[0];
  const first = theme.vocabulary.questions[0];
  const id = first.wordId;
  const evidence = ["2026-10-12", "2026-10-13", "2026-10-15"];
  await page.addInitScript(({ id, evidence }) => {
    if (localStorage.getItem("sparks_learning_v2")) return;
    const memory = { step: 3, due: "2026-10-19", lastDay: "2026-10-15", successDays: evidence, lastCorrect: true, assessed: true };
    localStorage.setItem("sparks_learning_v2", JSON.stringify({ seen: [id], mastered: [id], memory: { [id]: { reading: memory, listening: memory } } }));
  }, { id, evidence });
  await page.goto("./#learn");
  const row = page.locator(".child-theme-row").filter({ has: page.getByText(theme.title, { exact: true }) });
  await row.getByRole("button", { name: "认识新词", exact: true }).click();
  for (let index = 0; index < 8; index++) await page.getByRole("button", { name: index === 7 ? "开始小练习" : "下一个单词", exact: true }).click();
  const wrong = (first.answer + 1) % first.options.length;
  await page.locator(".answer-option").nth(wrong).click();
  const retry = page.getByRole("button", { name: "再试一次", exact: true });
  const bounds = await retry.boundingBox();
  expect(bounds.width).toBeGreaterThanOrEqual(44);
  expect(bounds.height).toBeGreaterThanOrEqual(44);
  await page.screenshot({ path: info.outputPath("correction-before.png"), fullPage: true });
  await retry.click();
  await page.getByRole("button", { name: "返回", exact: true }).click();
  await page.reload();
  await row.getByRole("button", { name: "认识新词", exact: true }).click();
  await expect(page.locator(".practice-header")).toContainText("1 / 8");
  await expect(page.locator(".answer-feedback")).toHaveCount(0);
  await page.locator(".answer-option").nth(correctionCorrect ? first.answer : wrong).click();
  await expect(page.getByText("订正不改变首次得分，也不计独立掌握。明天再试一试。")).toBeVisible();
  if (correctionCorrect) await expect(page.getByText("订正好了！", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "再试一次", exact: true })).toHaveCount(0);
  let stored = await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")));
  expect(stored.memory[id].reading).toMatchObject({ successDays: evidence, due: "2026-10-20", step: 0, lastCorrect: false });
  expect(stored.memory[id].listening).toMatchObject({ successDays: evidence, due: "2026-10-19", step: 3, lastCorrect: true });
  expect(stored.mastered).not.toContain(id);
  expect(stored.review).toContain(id);
  const session = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), `sparks_activity_${theme.vocabulary.id}`);
  expect(session.responses).toEqual([false]);
  expect(session.retrying).toBe(true);
  await page.screenshot({ path: info.outputPath("correction-after.png"), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "下一题", exact: true }).click();
  await answerAll(page, theme.vocabulary.questions.slice(1), 8, 7);
  stored = await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")));
  expect(stored.sessions.at(-1)).toMatchObject({ score: 7, total: 8 });
  expect(stored.review).toContain(id);
});

test("restarting a lesson after correcting its final question resets correction state", async ({ page }) => {
  const theme = childThemes[0];
  const questions = theme.story.questions;
  await page.goto("./#learn");
  await page.locator(".child-theme-row").filter({ has: page.getByText(theme.title, { exact: true }) }).getByRole("button", { name: "阅读故事", exact: true }).click();
  await page.getByRole("button", { name: "开始练习", exact: true }).click();
  for (const question of questions.slice(0, -1)) {
    await page.locator(".answer-option").nth(question.answer).click();
    await page.getByRole("button", { name: "下一题", exact: true }).click();
  }
  const last = questions.at(-1);
  await page.locator(".answer-option").nth((last.answer + 1) % last.options.length).click();
  await page.getByRole("button", { name: "再试一次", exact: true }).click();
  await page.locator(".answer-option").nth(last.answer).click();
  await page.getByRole("button", { name: "查看结果", exact: true }).click();
  await expect(page.locator(".result-stage")).toContainText("2 / 3");
  await page.getByRole("button", { name: "再练这课", exact: true }).click();
  await page.getByRole("button", { name: "开始练习", exact: true }).click();
  await page.locator(".answer-option").nth(questions[0].answer).click();
  await expect(page.getByText("答对啦！", { exact: true })).toBeVisible();
  const session = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), `sparks_activity_${theme.story.id}`);
  expect(session.responses).toEqual([true]);
  expect(session.retrying).toBe(false);
  expect(session.choice.retried).toBe(false);
});

test("child navigation and learning controls provide at least 44-pixel touch targets", async ({ page }) => {
  for (const route of ["today", "learn", "assessment", "progress"]) {
    await page.goto(`./#${route}`);
    await expect(page.getByRole("navigation")).toBeVisible();
    if (route === "today") await expect(page.getByRole("region", { name: "今日听读计划" })).toBeVisible();
    if (route === "learn") await expect(page.locator(".dictionary-row").first()).toBeVisible();
    const small = await page.locator("button, nav a").evaluateAll((elements) => elements.filter((element) => {
      const { width, height } = element.getBoundingClientRect();
      return width > 0 && height > 0 && (width < 44 || height < 44);
    }).map((element) => ({ label: element.getAttribute("aria-label") || element.textContent.trim(), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height })));
    expect(small, route).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test("child review rejects a saved parent typing task and keeps word listening available", async ({ page }) => {
  await page.addInitScript(() => {
    const now = new Date();
    const day = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const memory = { due: day, step: 0, lastDay: day, lastCorrect: false, successDays: [] };
    localStorage.setItem("sparks_learning_v2", JSON.stringify({ memory: {
      "skill-4-1": { listening: memory }, l2_apple: { listening: memory },
    }, dailyPlans: { [day]: { day, themeId: "breakfast", newWords: [], review: [{ id: "skill-4-1", skill: "listening" }], backlog: 0, mode: "learn" } } }));
  });
  await page.goto("./#today");
  await expect(page.getByRole("region", { name: "今日听读计划" })).toContainText("1 项到期复习");
  await page.getByRole("button", { name: "开始复习", exact: true }).click();
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await expect(page.locator(".answer-option")).toHaveCount(3);
  await page.getByRole("button", { name: "播放听力", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__spoken.at(-1))).toBe("apple");
});

test("reading hints survive a reload without becoming independent reading evidence", async ({ page }) => {
  await page.goto("./#assessment");
  await page.getByRole("button", { name: "阅读小挑战", exact: true }).click();
  await page.getByRole("button", { name: "听这段文字", exact: true }).click();
  await expect(page.getByText("本题记录为听后理解，不计入独立阅读掌握。")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "阅读小挑战", exact: true }).click();
  await expect(page.getByText("本题记录为听后理解，不计入独立阅读掌握。")).toBeVisible();
  await page.locator(".answer-option").nth(childThemes[0].story.questions[0].answer).click();
  const memory = await page.evaluate((id) => JSON.parse(localStorage.getItem("sparks_learning_v2")).memory[id].reading, childThemes[0].story.questions[0].id);
  expect(memory.successDays).toEqual([]);
  expect(memory.lastCorrect).toBe(false);
});

test("changed question content rejects stale answer positions in saved sessions", async ({ page }) => {
  await page.goto("./#assessment");
  await page.getByRole("button", { name: "阅读小挑战", exact: true }).click();
  const correct = childThemes[0].story.questions[0].answer;
  await page.locator(".answer-option").nth(correct).click();
  await expect(page.getByText("答对啦！", { exact: true })).toBeVisible();
  await page.evaluate(() => {
    const key = "sparks_activity_阅读小挑战";
    const saved = JSON.parse(localStorage.getItem(key));
    const fingerprint = JSON.parse(saved.fingerprint);
    fingerprint[2][0][1].reverse();
    saved.fingerprint = JSON.stringify(fingerprint);
    localStorage.setItem(key, JSON.stringify(saved));
  });
  await page.reload();
  await page.getByRole("button", { name: "阅读小挑战", exact: true }).click();
  await expect(page.getByText("答对啦！", { exact: true })).toHaveCount(0);
  await expect(page.locator(".answer-option").nth(correct)).toBeEnabled();
  await page.locator(".answer-option").nth(correct).click();
  await expect(page.getByText("答对啦！", { exact: true })).toBeVisible();
});

test("three fixed review batches resume midway without losing a reading hint", async ({ page }) => {
  test.setTimeout(60_000);
  await page.clock.setFixedTime(new Date("2026-10-12T12:00:00Z"));
  const questions = childThemes.flatMap((theme) => theme.story.questions).slice(0, 30).sort((a, b) => a.id.localeCompare(b.id));
  await page.addInitScript((ids) => {
    if (localStorage.getItem("sparks_learning_v2")) return;
    localStorage.setItem("sparks_learning_v2", JSON.stringify({ memory: Object.fromEntries(ids.map((id) => [id, { reading: {
      due: "2026-10-12", lastDay: "2026-10-11", step: 0, successDays: [], lastCorrect: false, assessed: true,
    } }])) }));
  }, questions.map((question) => question.id));
  await page.goto("./#today");
  await expect(page.getByRole("region", { name: "今日听读计划" })).toContainText("30 项到期复习");
  await page.getByRole("button", { name: "开始复习", exact: true }).click();
  for (const question of questions.slice(0, 3)) {
    await page.locator(".answer-option").nth(question.answer).click();
    await page.getByRole("button", { name: "下一题", exact: true }).click();
  }
  await expect(page.locator(".practice-header")).toContainText("4 / 10");
  await page.getByRole("button", { name: "听这段文字", exact: true }).click();
  await expect(page.getByText("本题记录为听后理解，不计入独立阅读掌握。")).toBeVisible();
  const key = "sparks_activity_daily-review-2026-10-12-b0";
  const original = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), key);
  await page.getByRole("button", { name: "返回", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "继续复习", exact: true }).click();
  await expect(page.locator(".practice-header")).toContainText("4 / 10");
  await expect(page.getByText("本题记录为听后理解，不计入独立阅读掌握。")).toBeVisible();
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).fingerprint, key)).toBe(original.fingerprint);
  await page.locator(".answer-option").nth(questions[3].answer).click();
  const hinted = await page.evaluate((id) => JSON.parse(localStorage.getItem("sparks_learning_v2")).memory[id].reading, questions[3].id);
  expect(hinted.successDays).toEqual([]);
  expect(hinted.lastCorrect).toBe(false);
  await page.getByRole("button", { name: "下一题", exact: true }).click();
  await answerAll(page, questions.slice(4, 10), 10);
  for (const offset of [10, 20]) {
    await expect(page.getByRole("region", { name: "今日听读计划" })).toContainText(`已完成 ${offset} / 30 项`);
    await page.getByRole("button", { name: "继续复习", exact: true }).click();
    await expect(page.locator(".practice-header")).toContainText(`第 ${offset / 10 + 1} 批`);
    await answerAll(page, questions.slice(offset, offset + 10));
  }
  await expect(page.getByRole("region", { name: "今日听读计划" })).toContainText("今天已完成 30 项复习");
  await expect(page.getByRole("button", { name: "继续复习", exact: true })).toBeDisabled();
});

for (const count of [1, 30]) test(`daily review of ${count} questions resumes a final correction even after every first answer is recorded`, async ({ page }) => {
  test.setTimeout(60_000);
  await page.clock.setFixedTime(new Date("2026-10-12T12:00:00Z"));
  const questions = childThemes.flatMap((theme) => theme.story.questions).slice(0, count).sort((a, b) => a.id.localeCompare(b.id));
  await page.addInitScript((ids) => {
    if (localStorage.getItem("sparks_learning_v2")) return;
    localStorage.setItem("sparks_learning_v2", JSON.stringify({ memory: Object.fromEntries(ids.map((id) => [id, { reading: {
      due: "2026-10-12", lastDay: "2026-10-11", step: 0, successDays: [], lastCorrect: false, assessed: true,
    } }])) }));
  }, questions.map((question) => question.id));
  await page.goto("./#today");
  await page.getByRole("button", { name: "开始复习", exact: true }).click();
  for (const [index, question] of questions.slice(0, -1).entries()) {
    await page.locator(".answer-option").nth(question.answer).click();
    if (index % 10 === 9) {
      await page.getByRole("button", { name: "查看结果", exact: true }).click();
      await page.getByRole("button", { name: "完成练习", exact: true }).click();
      await page.getByRole("button", { name: "继续复习", exact: true }).click();
    } else await page.getByRole("button", { name: "下一题", exact: true }).click();
  }
  const last = questions.at(-1);
  await page.locator(".answer-option").nth((last.answer + 1) % last.options.length).click();
  await page.getByRole("button", { name: "再试一次", exact: true }).click();
  await page.getByRole("button", { name: "返回", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("region", { name: "今日听读计划" })).toContainText("本批还有订正或结果待完成");
  await page.getByRole("button", { name: "继续复习", exact: true }).click();
  const batchCount = Math.min(10, count);
  await expect(page.locator(".practice-header")).toContainText(`${batchCount} / ${batchCount}`);
  await expect(page.locator(".answer-feedback")).toHaveCount(0);
  await page.locator(".answer-option").nth(last.answer).click();
  await expect(page.getByText("订正好了！", { exact: true })).toBeVisible();
  // The last feedback is resumable too, without asking for another answer.
  await page.getByRole("button", { name: "返回", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "继续复习", exact: true }).click();
  await expect(page.getByText("订正好了！", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "查看结果", exact: true }).click();
  await expect(page.locator(".result-stage")).toContainText(`${batchCount - 1} / ${batchCount}`);
  await page.getByRole("button", { name: "完成练习", exact: true }).click();
  await expect(page.getByRole("region", { name: "今日听读计划" })).toContainText(`今天已完成 ${count} 项复习`);
  await expect(page.getByRole("button", { name: "继续复习", exact: true })).toBeDisabled();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")));
  expect(stored.memory[last.id].reading).toMatchObject({ lastCorrect: false, successDays: [], due: "2026-10-13" });
  expect(stored.sessions.at(-1)).toMatchObject({ score: batchCount - 1, total: batchCount });
});

test("wrong-word reviews do not show the correct meaning before the child answers", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("sparks_learning_v2", JSON.stringify({ review: ["l2_apple"] })));
  await page.goto("./#progress");
  const row = page.locator(".review-list > div").filter({ has: page.getByText("apple", { exact: true }) });
  await expect(row).not.toContainText("苹果");
  await row.getByRole("button", { name: "复习", exact: true }).click();
  await page.getByRole("button", { name: /苹果/ }).click();
  await expect(page.getByText("答对啦！", { exact: true })).toBeVisible();
});

for (const failure of ["missing", "silent"]) test(`listening can be skipped safely when speech is ${failure}`, async ({ page }) => {
  await page.goto("./#assessment");
  await page.evaluate((mode) => {
    if (mode === "missing") delete window.speechSynthesis;
    else window.speechSynthesis.speak = () => {};
  }, failure);
  await page.getByRole("button", { name: "听力小挑战", exact: true }).click();
  await page.getByRole("button", { name: "播放听力", exact: true }).click();
  await expect(page.getByText("没有成功播放，请检查设备音量后重试。")).toBeVisible();
  await expect(page.locator(".answer-option").first()).toBeDisabled();
  await page.getByRole("button", { name: "暂时跳过", exact: true }).click();
  await expect(page.getByRole("button", { name: "再试一次", exact: true })).toHaveCount(0);
  await expect(page.getByText("这题先放一放，不记录对错或掌握。")).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2"))?.memory || {})).toEqual({});
  await page.getByRole("button", { name: "下一题", exact: true }).click();
  await expect(page.locator(".practice-header")).toContainText("2 /");
});

test("skipping failed audio during a correction does not count the same question twice", async ({ page }) => {
  await page.goto("./#assessment");
  await page.getByRole("button", { name: "听力小挑战", exact: true }).click();
  await page.getByRole("button", { name: "播放听力", exact: true }).click();
  await expect(page.getByText("听完了，选一个答案吧。")).toBeVisible();
  const question = childThemes[0].sentences.questions.find((item) => item.skill === "listening");
  await page.locator(".answer-option").nth((question.answer + 1) % question.options.length).click();
  await page.getByRole("button", { name: "再试一次", exact: true }).click();
  await page.evaluate(() => { delete window.speechSynthesis; });
  await page.getByRole("button", { name: "再听一次", exact: true }).click();
  await expect(page.getByText("没有成功播放，请检查设备音量后重试。")).toBeVisible();
  await page.getByRole("button", { name: "暂时跳过", exact: true }).click();
  await expect(page.getByRole("button", { name: "再试一次", exact: true })).toHaveCount(0);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_activity_听力小挑战")));
  expect(saved.responses).toEqual([false]);
  expect(saved.choice.skipped).toBe(true);
  expect(saved.retrying).toBe(true);
  const memory = await page.evaluate((id) => JSON.parse(localStorage.getItem("sparks_learning_v2")).memory[id].listening, question.id);
  expect(memory.successDays).toEqual([]);
  expect(memory.lastCorrect).toBe(false);
  await page.getByRole("button", { name: "下一题", exact: true }).click();
  await expect(page.locator(".practice-header")).toContainText("2 /");
});

for (const [themeId, images, dictionaryId] of [["family", familyImages, "l1_sister"], ["home", homeImages, "l10_lamp"], ["park", parkImages, "l7_park"], ["clothes", clothesImages, "l8_dress"], ["weather", weatherImages, "l2_cold"], ["body", bodyImages, "l12_mouth"], ["shopping", shoppingImages, "l5_shop"], ["travel", wordImages, "l12_stop"], ["day", dayImages, "l2_dinner"]]) test(`${themeId} photos show their specific context and pronounce it on the daily page and dictionary`, async ({ page }, info) => {
  await page.clock.setFixedTime(new Date("2026-10-12T12:00:00Z"));
  const theme = childThemes.find((item) => item.id === themeId);
  const completed = childThemes.slice(0, childThemes.indexOf(theme));
  const seen = completed.flatMap((theme) => theme.vocabulary.words.map((word) => word.id));
  const newWords = theme.vocabulary.words.filter((word) => !seen.includes(word.id));
  await page.addInitScript((snapshot) => localStorage.setItem("sparks_learning_v2", JSON.stringify(snapshot)), {
    seen,
    completed: completed.flatMap((theme) => [theme.vocabulary.id, theme.sentences.id, theme.story.id]),
  });
  await page.goto("./#today");
  await expect(page.getByRole("region", { name: "今日听读计划" })).toContainText(theme.title);
  expect(newWords).toHaveLength(themeId === "shopping" ? 7 : 8);
  await expect(page.locator(".preview-word img")).toHaveCount(newWords.length);
  for (const word of newWords) {
    const image = images[word.id];
    const card = page.locator(".preview-word").filter({ has: page.getByRole("heading", { name: word.word, exact: true }) });
    if (image.meaning !== word.translation) await expect(card).toContainText(`照片对应：${image.meaning}`);
    await expect(card).toContainText(image.context.sentence);
    await expect(card).toContainText(image.context.translation);
    await expect(card.locator("img")).toHaveAttribute("alt", image.alt);
    const play = card.getByRole("button", { name: `听 ${word.word} 的图片例句`, exact: true });
    const buttonBounds = await play.boundingBox();
    const cardBounds = await card.boundingBox();
    expect(buttonBounds.width).toBeGreaterThanOrEqual(44);
    expect(buttonBounds.height).toBeGreaterThanOrEqual(44);
    expect(buttonBounds.x + buttonBounds.width).toBeLessThanOrEqual(cardBounds.x + cardBounds.width);
    await play.click();
    await expect.poll(() => page.evaluate(() => window.__spoken.at(-1))).toBe(image.context.sentence);
  }
  await page.locator(".preview-word img").evaluateAll(async (images) => { await Promise.all(images.map((img) => img.decode())); });
  await page.evaluate(() => { window.scrollTo(0, 0); });
  await page.screenshot({ path: info.outputPath(`${themeId}-daily.png`), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "开始学习", exact: true }).click();
  const firstImage = images[theme.vocabulary.words[0].id];
  await expect(page.locator(".word-detail")).toContainText(firstImage.context.translation);
  await page.getByRole("button", { name: "朗读例句", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__spoken.at(-1))).toBe(firstImage.context.sentence);
  await page.getByRole("button", { name: "返回", exact: true }).click();
  await page.getByRole("navigation").getByRole("link", { name: "学习天地", exact: true }).click();
  const dictionaryWord = courseWordById[dictionaryId];
  const dictionaryImage = images[dictionaryId];
  await page.getByRole("textbox", { name: "搜索单词或中文" }).fill(dictionaryWord.word);
  await page.locator(".dictionary-row").filter({ has: page.getByText(dictionaryWord.word, { exact: true }) }).locator(".dictionary-word").click();
  await expect(page.getByRole("dialog")).toContainText(`照片对应：${dictionaryImage.meaning}`);
  await expect(page.getByRole("dialog")).toContainText(dictionaryImage.context.translation);
  if (themeId === "park") {
    await expect(page.getByRole("dialog")).toContainText("停车（动词）");
    await expect(page.getByRole("dialog")).toContainText("照片对应：公园（名词）");
  }
  if (themeId === "clothes") await expect(page.getByRole("dialog")).toContainText("穿衣");
  if (themeId === "weather") await expect(page.getByRole("dialog")).toContainText("感冒");
  if (themeId === "day") {
    await expect(page.getByRole("dialog")).toContainText("也可在中午吃");
    await expect(page.getByRole("dialog")).toContainText("照片对应：正餐（此处为晚餐）");
  }
  if (themeId === "travel") {
    await expect(page.getByRole("dialog")).toContainText("停靠站");
    await expect(page.getByRole("dialog")).toContainText("照片对应：停下（动词）");
  }
  await page.getByRole("button", { name: "朗读例句", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__spoken.at(-1))).toBe(dictionaryImage.context.sentence);
});

test("all twelve child themes support every word, sentence and story activity", async ({ page }, info) => {
  test.setTimeout(180_000);
  await page.goto("./#learn");
  for (const theme of childThemes) {
    const row = page.locator(".child-theme-row").filter({ has: page.getByText(theme.title, { exact: true }) });
    await row.getByRole("button", { name: "认识新词", exact: true }).click();
    for (const [index, word] of theme.vocabulary.words.entries()) {
      await expect(page.locator(".word-detail h1")).toHaveText(word.word);
      await expect(page.locator(".word-detail")).toContainText(word.translation);
      await expect(page.locator(".word-detail")).toContainText(word.partOfSpeechLabel);
      await page.getByRole("button", { name: index === 7 ? "开始小练习" : "下一个单词", exact: true }).click();
    }
    await answerAll(page, theme.vocabulary.questions);
    await row.getByRole("button", { name: "听读句子", exact: true }).click();
    await expect(page.locator(".sentence-list > div")).toHaveCount(6);
    await page.getByRole("button", { name: "听第 1 句", exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.__spoken.at(-1))).toBe(theme.sentences.guide.sentences[0][0]);
    await page.getByRole("button", { name: "开始练习", exact: true }).click();
    await answerAll(page, theme.sentences.questions);
    await row.getByRole("button", { name: "阅读故事", exact: true }).click();
    await expect(page.locator(".reading-passage")).toHaveText(theme.story.guide.passage);
    await page.getByRole("button", { name: "听完整故事", exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.__spoken.at(-1))).toBe(theme.story.guide.passage);
    await page.getByRole("button", { name: "听故事第 1 句", exact: true }).click();
    await page.getByRole("button", { name: "开始练习", exact: true }).click();
    await answerAll(page, theme.story.questions);
    await row.getByRole("button", { name: "进阶故事", exact: true }).click();
    await expect(page.locator(".reading-passage")).toHaveText(theme.longStory.guide.passage);
    await page.getByRole("button", { name: "听故事第 1 句", exact: true }).click();
    await page.getByRole("button", { name: "开始练习", exact: true }).click();
    await answerAll(page, theme.longStory.questions);
  }
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")));
  expect(stored.completed.filter((id) => id.startsWith("child-"))).toHaveLength(48);
  expect(stored.memory[childThemes[0].story.questions[0].id].reading.successDays).toEqual([]);
  await page.screenshot({ path: info.outputPath("child-library.png"), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("due reviews preserve listening versus reading and survive a reload", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-10-12T12:00:00Z"));
  await page.addInitScript(() => {
    localStorage.setItem("sparks_learning_v2", JSON.stringify({ memory: {
      l2_apple: { listening: { due: "2026-10-12", step: 1, lastDay: "2026-10-11", successDays: ["2026-10-11"], lastCorrect: true } },
      l2_banana: { reading: { due: "2026-10-12", step: 1, lastDay: "2026-10-11", successDays: ["2026-10-11"], lastCorrect: true } },
    } }));
  });
  await page.goto("./#today");
  await expect(page.getByRole("region", { name: "今日听读计划" })).toContainText("2 项到期复习");
  await page.getByRole("button", { name: "开始复习", exact: true }).click();
  await expect(page.locator(".answer-option").first()).toBeDisabled();
  await page.getByRole("button", { name: "播放听力", exact: true }).click();
  await expect(page.getByText("听完了，选一个答案吧。")).toBeVisible();
  await page.getByRole("button", { name: /苹果/ }).click();
  await page.getByRole("button", { name: "下一题", exact: true }).click();
  await expect(page.getByRole("button", { name: "播放听力", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: /香蕉/ }).click();
  await page.getByRole("button", { name: "查看结果", exact: true }).click();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")));
  expect(stored.memory.l2_apple.reading).toBeUndefined();
  expect(stored.memory.l2_apple.listening.due).toBe("2026-10-14");
  expect(stored.memory.l2_banana.reading.due).toBe("2026-10-14");
});

test("restaurant search excludes health vocabulary and every dictionary entry exposes POS", async ({ page }) => {
  await page.goto("./#learn");
  await page.getByLabel("选择词汇主题").selectOption("food_cafe");
  await page.getByRole("textbox", { name: "搜索单词或中文" }).fill("ambulance");
  await expect(page.getByText("还没找到这个词")).toBeVisible();
  await page.getByLabel("选择词汇主题").selectOption("body_health");
  await expect(page.locator(".dictionary-row")).toHaveCount(1);
  await expect(page.locator(".dictionary-row")).toContainText("救护车");
  await expect(page.locator(".dictionary-row")).toContainText("n. 名词");
  await page.locator(".dictionary-word").click();
  await expect(page.getByRole("dialog")).toContainText("n. 名词");
});

test("health photographs keep their clinical context, spoken examples and restaurant exclusions", async ({ page }, info) => {
  await page.goto("./#learn");
  for (const [id, image] of Object.entries(healthImages)) {
    const word = courseWordById[id];
    await page.getByRole("textbox", { name: "搜索单词或中文" }).fill(word.word);
    await page.getByLabel("选择词汇主题").selectOption("food_cafe");
    await expect(page.getByText("还没找到这个词")).toBeVisible();
    await page.getByLabel("选择词汇主题").selectOption("body_health");
    const row = page.locator(".dictionary-row").filter({ has: page.getByText(word.word, { exact: true }) });
    await row.locator(".dictionary-word").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText(word.partOfSpeechLabel);
    await expect(dialog).toContainText(`照片对应：${image.meaning}`);
    await expect(dialog).toContainText(image.context.translation);
    await expect(dialog.locator("img")).toHaveAttribute("alt", image.alt);
    await dialog.locator("img").evaluate((img) => img.decode());
    await page.getByRole("button", { name: "朗读例句", exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.__spoken.at(-1))).toBe(image.context.sentence);
    if (["l2_ambulance", "l2_tooth"].includes(id)) await page.screenshot({ path: info.outputPath(`${word.word}-entry.png`) });
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.getByRole("button", { name: "关闭词条", exact: true }).click();
  }
  await page.getByRole("textbox", { name: "搜索单词或中文" }).fill("Dr");
  await page.locator(".dictionary-row").filter({ has: page.getByText("Dr", { exact: true }) }).getByRole("button", { name: "听 Dr 的发音", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__spoken.at(-1))).toBe("doctor");
});

test("the six originally mismatched starter words show separate scenes, contexts, POS and precise spoken text", async ({ page }, info) => {
  await page.goto("./#learn");
  for (const [id, image] of Object.entries(starterImages)) {
    const word = courseWordById[id];
    await page.getByRole("textbox", { name: "搜索单词或中文" }).fill(word.word);
    await page.locator(".dictionary-row").filter({ has: page.getByText(word.word, { exact: true }) }).locator(".dictionary-word").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText(word.translation);
    await expect(dialog).toContainText(word.partOfSpeechLabel);
    await expect(dialog).toContainText(`照片对应：${image.meaning}`);
    await expect(dialog).toContainText(image.context.sentence);
    await expect(dialog).toContainText(image.context.translation);
    await expect(dialog.locator("img")).toHaveAttribute("alt", image.alt);
    await expect.poll(() => dialog.locator("img").evaluate((img) => img.complete && img.naturalWidth === 640 && img.naturalHeight === 640)).toBe(true);
    await dialog.evaluate((element) => { element.scrollTop = 0; });
    await page.screenshot({ path: info.outputPath(`${id}-dictionary.png`) });
    await dialog.getByRole("button", { name: "播放单词发音", exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.__spoken.at(-1))).toBe(id === "l1_a_m" ? "A M" : word.word);
    await dialog.getByRole("button", { name: "朗读例句", exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.__spoken.at(-1))).toBe(image.context.sentence);
    await expect(dialog.getByText(image.context.sentence, { exact: true })).toBeInViewport();
    await expect(dialog.getByText(image.context.translation, { exact: true })).toBeInViewport();
    await page.screenshot({ path: info.outputPath(`${id}-context.png`) });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await dialog.getByRole("button", { name: "关闭词条", exact: true }).click();
  }
});

test("every published photograph loads in its own vocabulary entry with its specific sense", async ({ page }) => {
  test.setTimeout(Object.keys(wordImages).length * 2000 + 30_000);
  await page.goto("./#learn");
  for (const [id, image] of Object.entries(wordImages)) {
    const word = courseWordById[id];
    await page.getByRole("textbox", { name: "搜索单词或中文" }).fill(word.word);
    const row = page.locator(".dictionary-row").filter({ has: page.getByText(word.word, { exact: true }) });
    await expect(page.locator(".dictionary-row").first()).toBeVisible();
    for (let pageNumber = 0; pageNumber < 47 && !await row.count(); pageNumber++) {
      await page.getByRole("button", { name: "下一页", exact: true }).click();
    }
    await row.locator(".dictionary-word").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: word.word, exact: true })).toBeVisible();
    await expect(dialog).toContainText(`照片对应：${image.meaning}`);
    await expect(dialog.locator("img")).toHaveAttribute("alt", image.alt);
    await expect(dialog.locator("img")).toHaveAttribute("src", new RegExp(`/word-images/${id}\\.webp$`));
    await expect.poll(() => dialog.locator("img").evaluate((img) => img.complete && img.naturalWidth === 640 && img.naturalHeight === 640)).toBe(true);
    if (image.context) {
      await expect(dialog).toContainText(image.context.sentence);
      await expect(dialog).toContainText(image.context.translation);
      await page.getByRole("button", { name: "朗读例句", exact: true }).click();
      await expect.poll(() => page.evaluate(() => window.__spoken.at(-1))).toBe(image.context.sentence);
    }
    await page.getByRole("button", { name: "关闭词条", exact: true }).click();
  }
});

test("children see listening and reading challenges while writing stays in the parent area", async ({ page }) => {
  await page.goto("./#assessment");
  await expect(page.getByRole("tab", { name: /写作/ })).not.toBeVisible();
  await page.getByRole("button", { name: "阅读小挑战", exact: true }).click();
  await expect(page.locator(".reading-passage")).toHaveText(childThemes[0].story.guide.passage);
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await answerAll(page, childThemes[0].story.questions);
  await page.getByRole("button", { name: "阅读小挑战", exact: true }).click();
  await expect(page.locator(".question-stage")).toBeVisible();
  await expect(page.locator(".result-stage")).toHaveCount(0);
});

test("a reduced four-word day keeps the remaining vocabulary for the next day", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-10-12T12:00:00Z"));
  await page.addInitScript((ids) => {
    if (localStorage.getItem("sparks_learning_v2")) return;
    localStorage.setItem("sparks_learning_v2", JSON.stringify({ memory: Object.fromEntries(ids.map((id) => [id, { reading: { due: "2026-10-12", step: 0, lastDay: "2026-10-11", successDays: [], lastCorrect: false } }])) }));
  }, courseWords.slice(0, 25).map((word) => word.id));
  await page.goto("./#today");
  await expect(page.getByRole("region", { name: "今日听读计划" })).toContainText("4 个新词");
  await page.getByRole("button", { name: "开始学习", exact: true }).click();
  for (let index = 0; index < 4; index++) await page.getByRole("button", { name: index === 3 ? "开始小练习" : "下一个单词", exact: true }).click();
  await answerAll(page, childThemes[0].vocabulary.questions.slice(0, 4));
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")).completed)).not.toContain(childThemes[0].vocabulary.id);
  await page.clock.setFixedTime(new Date("2026-10-13T12:00:00Z"));
  await page.reload();
  await expect(page.locator(".preview-word h3")).toHaveText(["egg", "cheese", "juice", "water"]);
});

test("hearing a reading hint is recorded immediately even before playback finishes", async ({ page }) => {
  await page.goto("./#assessment");
  await page.evaluate(() => { window.speechSynthesis.speak = () => {}; });
  await page.getByRole("button", { name: "阅读小挑战", exact: true }).click();
  await page.getByRole("button", { name: "听这段文字", exact: true }).click();
  await expect(page.getByText("本题记录为听后理解，不计入独立阅读掌握。")).toBeVisible();
  await page.locator(".answer-option").nth(childThemes[0].story.questions[0].answer).click();
  const memory = await page.evaluate((id) => JSON.parse(localStorage.getItem("sparks_learning_v2")).memory[id].reading, childThemes[0].story.questions[0].id);
  expect(memory.successDays).toEqual([]);
  expect(memory.lastCorrect).toBe(false);
});
