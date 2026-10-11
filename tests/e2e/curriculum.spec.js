import { test, expect } from "@playwright/test";
import { curriculumUnits, vocabularyLessons, courseWords } from "../../src/data/curriculum.js";

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
async function next(page, last = false) {
  await page.getByRole("button", { name: last ? "查看结果" : "下一题", exact: true }).click();
}
async function answer(page, question, wrong = false) {
  if (question.audio || question.type === "listening") {
    await page.getByRole("button", { name: "播放听力", exact: true }).click();
    await expect(page.getByText("听完了，选一个答案吧。")).toBeVisible();
  }
  if (question.acceptedAnswers || question.type === "spelling") {
    await page.getByRole("textbox", { name: question.type === "input" ? "输入填空答案" : "输入英文拼写" }).fill(wrong ? "wrong" : question.acceptedAnswers?.[0].toUpperCase() || question.correctWord);
    await page.getByRole("button", { name: question.type === "input" ? "检查答案" : "检查拼写", exact: true }).click();
  } else await page.locator(".answer-option").nth(wrong ? (question.answer + 1) % question.options.length : question.answer).click();
  await expect(page.getByText(wrong ? "没关系，我们再认识一次。" : "答对啦！", { exact: true })).toBeVisible();
}

test("dictionary supplies Chinese meanings for every page and supports Chinese search", async ({ page }) => {
  await page.goto("./#learn");
  await expect(page.locator(".dictionary-row")).toHaveCount(36);
  const displayed = [];
  while (true) {
    const rows = page.locator(".dictionary-word");
    displayed.push(...await rows.allTextContents());
    const nextPage = page.getByRole("button", { name: "下一页", exact: true });
    if (await nextPage.isDisabled()) break;
    const previousFirst = await rows.first().textContent();
    await nextPage.click();
    await expect(rows.first()).not.toHaveText(previousFirst);
  }
  expect(displayed).toHaveLength(1687);
  expect(displayed.every((text) => /[\u4e00-\u9fff]/.test(text) && !/待复核|词[：:]/.test(text))).toBe(true);
  await page.getByRole("textbox", { name: "搜索单词或中文" }).fill("借出");
  await expect(page.locator(".dictionary-grid")).toContainText("lend");
  await page.getByRole("textbox", { name: "搜索单词或中文" }).fill("surprising");
  await expect(page.locator(".dictionary-grid")).toContainText("令人惊讶");
});

test("all twelve units offer functioning grammar and comprehension lessons", async ({ page }, info) => {
  test.setTimeout(120_000);
  await page.goto("./#learn");
  const hub = page.getByRole("region", { name: "KET 系统课程" });
  await page.getByText("家长与进阶课程 · 完整 KET 体系", { exact: true }).click();
  await expect(hub.getByRole("button", { name: "继续课程" })).toBeVisible();
  for (const unit of curriculumUnits) {
    await hub.getByRole("button", { name: new RegExp(`${String(unit.id).padStart(2, "0")} ${unit.name}$`) }).click();
    await expect(hub.getByText(`单元 ${unit.id} · ${unit.name}`, { exact: true })).toBeVisible();
    await hub.getByRole("button", { name: `开始${unit.grammar[0].title}`, exact: true }).click();
    await expect(page.locator(".lesson-guide")).toContainText(unit.grammar[0].guide.rule);
    await page.getByRole("button", { name: "开始练习", exact: true }).click();
    for (const [index, question] of unit.grammar[0].questions.entries()) { await answer(page, question); await next(page, index === 2); }
    await expect(page.locator(".result-stage")).toContainText("本课已通过。");
    await page.getByRole("button", { name: "完成练习", exact: true }).click();
    await hub.getByRole("button", { name: `开始${unit.skillLesson.title}`, exact: true }).click();
    await page.getByRole("button", { name: "开始练习", exact: true }).click();
    for (const [index, question] of unit.skillLesson.questions.entries()) { await answer(page, question); await next(page, index === 2); }
    await page.getByRole("button", { name: "完成练习", exact: true }).click();
  }
  await page.screenshot({ path: info.outputPath("full-curriculum.png"), fullPage: true });
  await page.screenshot({ path: info.outputPath("curriculum-viewport.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.reload();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")));
  expect(stored.completed.filter((id) => id.startsWith("grammar-") || id.startsWith("skill-")).length).toBe(24);
});

test("extended vocabulary learns real meanings, safe pronunciation and records mastery", async ({ page }) => {
  const lesson = vocabularyLessons[0];
  await page.goto("./#learn");
  await page.getByText("家长与进阶课程 · 完整 KET 体系", { exact: true }).click();
  await page.getByRole("button", { name: `开始${lesson.title}`, exact: true }).click();
  for (const [index, word] of lesson.words.entries()) {
    await expect(page.locator(".word-detail")).toContainText(word.translation);
    await page.getByRole("button", { name: "听发音", exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.__spoken.at(-1))).toBe(word.word === "a / an" ? "a or an" : word.word);
    await page.getByRole("button", { name: index === 7 ? "开始小练习" : "下一个单词", exact: true }).click();
  }
  for (const [index, question] of lesson.questions.entries()) { await answer(page, question); await next(page, index === 7); }
  await expect(page.locator(".result-stage")).toContainText("8 / 8");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")).mastered.length)).toBe(0);
  expect(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("sparks_learning_v2")).memory).length)).toBe(8);
  expect(courseWords).toHaveLength(1687);
});

test("failed grammar does not pass the lesson, and wrong question review clears it", async ({ page }) => {
  const lesson = curriculumUnits[0].grammar[0];
  await page.goto("./#learn");
  await page.getByText("家长与进阶课程 · 完整 KET 体系", { exact: true }).click();
  await page.getByRole("button", { name: `开始${lesson.title}`, exact: true }).click();
  await page.getByRole("button", { name: "开始练习", exact: true }).click();
  for (const [index, question] of lesson.questions.entries()) { await answer(page, question, index === 0); await next(page, index === 2); }
  await expect(page.locator(".result-stage")).toContainText("还需巩固");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")).completed)).not.toContain(lesson.id);
  await page.getByRole("button", { name: "完成练习", exact: true }).click();
  await page.getByRole("navigation").getByRole("link", { name: "成长记录", exact: true }).click();
  await expect(page.locator(".review-list")).toContainText(lesson.questions[0].prompt);
  await page.getByRole("button", { name: "复习", exact: true }).click();
  await answer(page, lesson.questions[0]); await next(page, true);
  await page.getByRole("button", { name: "完成练习", exact: true }).click();
  await expect(page.getByText("复习区空空的，很棒。")).toBeVisible();
});

test("A2 listening gap-fill cannot score before hearing and preserves wrong original context", async ({ page }) => {
  const lesson = curriculumUnits[3].skillLesson;
  await page.goto("./#assessment");
  await page.getByText("家长与进阶测试 · 完整 KET 训练", { exact: true }).click();
  await page.getByLabel("选择专项").selectOption("L2");
  await page.getByRole("button", { name: "开始专项", exact: true }).click();
  await page.getByRole("button", { name: "开始练习", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "输入填空答案" })).toBeDisabled();
  for (const [index, question] of lesson.questions.entries()) { await answer(page, question, index === 0); await next(page, index === 2); }
  await page.getByRole("button", { name: "完成练习", exact: true }).click();
  await page.getByRole("navigation").getByRole("link", { name: "成长记录", exact: true }).click();
  await page.getByRole("button", { name: "复习", exact: true }).click();
  await expect(page.getByRole("heading", { name: lesson.questions[0].prompt, exact: true })).toBeVisible();
  await answer(page, lesson.questions[0]); await next(page, true);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("sparks_learning_v2")).review)).toEqual([]);
});

test("course writing drafts stay separate, require word count and explicit self-checks", async ({ page }) => {
  await page.goto("./#assessment");
  await page.getByText("家长与进阶测试 · 完整 KET 训练", { exact: true }).click();
  await page.getByLabel("选择专项").selectOption("R7");
  await page.getByRole("button", { name: "开始专项", exact: true }).click();
  await page.getByRole("textbox", { name: "我的英文故事", exact: true }).fill("Last Saturday I went home.");
  await expect(page.getByRole("button", { name: "完成并自查" })).toBeDisabled();
  const task = curriculumUnits[4].production;
  await page.getByRole("textbox", { name: "我的英文故事", exact: true }).fill(task.example);
  await page.getByRole("button", { name: "完成并自查" }).click();
  await expect(page.getByRole("button", { name: "记录这次自查" })).toBeDisabled();
  for (const point of task.points) await page.getByRole("checkbox", { name: point }).check();
  await page.getByRole("button", { name: "记录这次自查" }).click();
  await expect(page.getByRole("button", { name: "已记录自查" })).toBeDisabled();
  await page.getByRole("button", { name: "返回课程" }).click();
  await page.getByLabel("选择专项").selectOption("R6");
  await page.getByRole("button", { name: "开始专项", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "我的英文邮件", exact: true })).toHaveValue("");
  await page.getByRole("button", { name: "返回课程" }).click();
  await page.reload();
  await page.getByLabel("选择专项").selectOption("R7");
  await page.getByRole("button", { name: "开始专项", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "我的英文故事", exact: true })).toHaveValue(task.example);
  await expect(page.getByText("这篇草稿已完成自查。")).toBeVisible();
});

test("advanced speaking uses the selected unit's questions", async ({ page }) => {
  await page.goto("./#assessment");
  await page.getByText("家长与进阶测试 · 完整 KET 训练", { exact: true }).click();
  await page.getByLabel("选择专项").selectOption("S2");
  await page.getByRole("button", { name: "开始专项", exact: true }).click();
  await expect(page.getByRole("heading", { name: curriculumUnits[6].production.speaking[0], exact: true })).toBeVisible();
  await page.getByRole("button", { name: "换一个话题" }).click();
  await expect(page.getByRole("heading", { name: curriculumUnits[6].production.speaking[1], exact: true })).toBeVisible();
});
