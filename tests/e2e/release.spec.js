import { test, expect } from "@playwright/test";
import * as course from "../../src/data/curriculum.js";
import * as child from "../../src/data/child-course.js";
import { emptyProgress, dayAfter, recordAnswer } from "../../src/utils/learningProgress.js";
import { buildDailyPlan } from "../../src/utils/dailyPlan.js";
import { getSpeakableWordText } from "../../src/utils/speechText.js";

const curriculum = { ...course, ...child };
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-10-12T12:00:00"));
  await page.addInitScript(() => {
    window.__utterances = [];
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: {
      cancel() {}, resume() {}, getVoices: () => [{ lang: "en-US", name: "English" }, { lang: "zh-CN", name: "Chinese" }],
      speak(utterance) { window.__utterances.push({ text: utterance.text, lang: utterance.lang, rate: utterance.rate }); setTimeout(() => utterance.onend?.(), 5); },
    } });
  });
});

async function seed(page, snapshot) {
  await page.addInitScript((value) => {
    if (!localStorage.getItem("sparks_learning_v2")) localStorage.setItem("sparks_learning_v2", JSON.stringify(value));
  }, snapshot);
}
async function answer(page, question, wrong = false) {
  if (question.audio) {
    await page.getByRole("button", { name: "播放听力", exact: true }).click();
    await expect(page.getByText("听完了，选一个答案吧。")).toBeVisible();
  }
  if (question.acceptedAnswers) {
    await page.getByRole("textbox", { name: "输入填空答案" }).fill(wrong ? "wrong" : question.acceptedAnswers[0]);
    await page.getByRole("button", { name: "检查答案", exact: true }).click();
  } else await page.locator(".answer-option").nth(wrong ? (question.answer + 1) % question.options.length : question.answer).click();
  await expect(page.getByText(wrong ? "没关系，我们再认识一次。" : "答对啦！", { exact: true })).toBeVisible();
}

test("checkpoint answers own their memory and leave original lesson evidence unchanged", async ({ page }) => {
  const units = [curriculum.curriculumUnits[0], curriculum.curriculumUnits[3]];
  const memory = Object.fromEntries(units.map((unit) => [unit.grammar[0].questions[0].id, { reading: { step: 0, due: "2026-10-12", lastDay: "2026-10-11", lastCorrect: false, successDays: ["2026-10-09"] } }]));
  await seed(page, { ...emptyProgress, memory, review: Object.keys(memory) });
  await page.goto("./#assessment");
  await page.getByText("家长与进阶测试 · 完整 KET 训练", { exact: true }).click();
  for (const unit of units) {
    await page.locator(".checkpoint-grid").getByRole("button", { name: `单元 ${unit.id} · ${unit.name}`, exact: true }).click();
    for (const [index, question] of unit.checkpoint.questions.entries()) {
      await answer(page, question);
      await page.getByRole("button", { name: index === 5 ? "查看结果" : "下一题", exact: true }).click();
    }
    await expect(page.locator(".result-stage")).toContainText("6 / 6");
    await page.getByRole("button", { name: "完成练习", exact: true }).click();
  }
  await page.reload();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")));
  for (const id of Object.keys(memory)) expect(stored.memory[id]).toEqual(memory[id]);
  expect(stored.review).toEqual(Object.keys(memory));
  expect(stored.completed).toEqual(units.map((unit) => unit.checkpoint.id));
  for (const question of units.flatMap((unit) => unit.checkpoint.questions)) {
    expect(stored.memory[question.id]).toBeTruthy();
    if (!memory[question.sourceQuestionId]) expect(stored.memory[question.sourceQuestionId]).toBeUndefined();
  }
});

test("a checkpoint mistake reopens its own question and clears only its own review", async ({ page }) => {
  const unit = curriculum.curriculumUnits[0];
  await page.goto("./#assessment");
  await page.getByText("家长与进阶测试 · 完整 KET 训练", { exact: true }).click();
  await page.locator(".checkpoint-grid").getByRole("button", { name: `单元 ${unit.id} · ${unit.name}`, exact: true }).click();
  for (const [index, question] of unit.checkpoint.questions.entries()) {
    await answer(page, question, index === 0);
    await page.getByRole("button", { name: index === 5 ? "查看结果" : "下一题", exact: true }).click();
  }
  await expect(page.locator(".result-stage")).toContainText("5 / 6");
  await page.getByRole("button", { name: "完成练习", exact: true }).click();
  await page.getByRole("navigation").getByRole("link", { name: "成长记录", exact: true }).click();
  await page.clock.setFixedTime(new Date("2026-10-13T12:00:00"));
  await page.reload();
  await page.getByRole("button", { name: "复习", exact: true }).click();
  await answer(page, unit.checkpoint.questions[0]);
  await page.getByRole("button", { name: "查看结果", exact: true }).click();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")));
  expect(stored.review).toEqual([]);
  expect(stored.memory[unit.checkpoint.questions[0].id].reading.successDays).toEqual(["2026-10-13"]);
  expect(stored.memory[unit.checkpoint.questions[0].sourceQuestionId]).toBeUndefined();
});

test("loading prunes old plans but preserves the current frozen plan and resume", async ({ page }) => {
  const p = recordAnswer(emptyProgress, "l2_apple", true, new Date("2026-10-11T12:00:00"));
  const current = buildDailyPlan(p, curriculum, new Date("2026-10-12T12:00:00"));
  const dailyPlans = Object.fromEntries(Array.from({ length: 400 }, (_, index) => { const day = dayAfter(new Date("2025-01-01T12:00:00"), index); return [day, { ...current, day }]; }));
  dailyPlans[current.day] = current;
  await seed(page, { ...p, dailyPlans, drafts: { kept: "My draft" }, completed: ["checkpoint-1"] });
  await page.goto("./#today");
  await expect.poll(() => page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("sparks_learning_v2")).dailyPlans).length)).toBe(90);
  let stored = await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")));
  expect(stored.dailyPlans[current.day]).toEqual(current);
  expect(stored.memory).toEqual(p.memory);
  expect(stored.completed).toEqual(["checkpoint-1"]);
  expect(stored.drafts).toEqual({ kept: "My draft" });
  await page.getByRole("button", { name: "开始学习", exact: true }).click();
  await page.getByRole("button", { name: "下一个单词", exact: true }).click();
  await page.getByRole("button", { name: "返回", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "开始学习", exact: true }).click();
  await expect(page.locator(".word-detail h1")).toHaveText(curriculum.courseWordById[current.newWords[1]].word);
  stored = await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")));
  expect(Object.keys(stored.dailyPlans)).toHaveLength(90);
  expect(stored.dailyPlans[current.day]).toEqual(current);
});

test("daily spoken guidance uses Chinese, keeps English settings and never awards evidence", async ({ page }, info) => {
  await page.addInitScript(() => localStorage.setItem("sparks_voice_v2", JSON.stringify({ lang: "en-US", rate: 1.2 })));
  await page.goto("./#today");
  await expect(page.getByRole("region", { name: "今日听读计划" })).toContainText("8 个新词");
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")));
  const guide = page.getByRole("button", { name: "听今天的安排", exact: true });
  await guide.click();
  await expect.poll(() => page.evaluate(() => window.__utterances.at(-1)?.lang)).toBe("zh-CN");
  const spoken = await page.evaluate(() => window.__utterances.at(-1));
  expect(spoken.text).toContain("开始学习");
  expect(spoken.text).toContain("听读句子");
  expect(spoken.text).toContain("打开故事");
  expect(spoken.rate).toBe(0.9);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")))).toEqual(before);
  const word = child.childThemes[0].vocabulary.words[0];
  await page.getByRole("button", { name: `听 ${word.word} 的发音`, exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__utterances.at(-1)?.text)).toBe(getSpeakableWordText(word));
  expect(await page.evaluate(() => window.__utterances.at(-1)?.lang)).toBe("en-US");
  expect(await page.evaluate(() => window.__utterances.at(-1)?.rate)).toBe(1.2);
  const box = await guide.boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: info.outputPath("today-guidance.png"), fullPage: true });
  await page.screenshot({ path: info.outputPath("today-guidance-viewport.png") });
});

test("light Sunday offers a familiar story, no new sentences and a matching spoken guide", async ({ page }, info) => {
  const theme = child.childThemes[0];
  let p = { ...emptyProgress, seen: theme.vocabulary.words.map((word) => word.id), completed: [theme.story.id, theme.sentences.id] };
  for (const question of [...theme.story.questions, ...theme.sentences.questions]) p = recordAnswer(p, question.id, true, new Date("2026-10-16T12:00:00"), { skill: question.audio ? "listening" : "reading" });
  await seed(page, p);
  await page.clock.setFixedTime(new Date("2026-10-18T12:00:00"));
  await page.goto("./#today");
  const daily = page.getByRole("region", { name: "今日听读计划" });
  await expect(daily).toContainText("轻量复习日");
  await expect(daily.locator(".daily-title h2")).toHaveText(theme.title);
  await expect(daily.getByRole("button", { name: "听读句子", exact: true })).toHaveCount(0);
  await expect(daily.getByRole("button", { name: "开始学习", exact: true })).toBeDisabled();
  const statuses = daily.locator(".daily-task-list article > span");
  for (let index = 0; index < await statuses.count(); index++) {
    const box = await statuses.nth(index).boundingBox();
    expect(box.width).toBeGreaterThan(50);
    expect(box.height).toBeLessThan(30);
  }
  await daily.getByRole("button", { name: "听今天的安排", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__utterances.at(-1)?.text)).toContain("读熟悉的故事");
  await page.screenshot({ path: info.outputPath("light-day.png"), fullPage: true });
  await page.screenshot({ path: info.outputPath("light-day-viewport.png") });
  await daily.getByRole("button", { name: "读熟悉的故事", exact: true }).click();
  await expect(page.locator(".lesson-guide")).toContainText(theme.story.guide.passage);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")));
  expect(stored.dailyPlans["2026-10-18"].newQuestions).toBe(0);
  expect(stored.memory).toEqual(p.memory);
});

test("unsupported guidance audio leaves the learning route usable", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, "speechSynthesis", { configurable: true, value: undefined }));
  await page.goto("./#today");
  await page.getByRole("button", { name: "听今天的安排", exact: true }).click();
  await expect(page.getByText("这个浏览器暂不支持朗读，请换用支持语音的浏览器。")).toBeVisible();
  await page.getByRole("button", { name: "开始学习", exact: true }).click();
  await expect(page.locator(".word-detail")).toBeVisible();
});
