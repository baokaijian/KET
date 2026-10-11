import { test, expect } from "@playwright/test";
import { childThemes } from "../../src/data/child-course.js";
import { courseWords, courseWordById } from "../../src/data/curriculum.js";
import { wordImages } from "../../src/data/word-images.js";
import { familyImages } from "../../src/data/family-images.js";
import { homeImages } from "../../src/data/home-images.js";
import { parkImages } from "../../src/data/park-images.js";
import { healthImages } from "../../src/data/health-images.js";
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
async function answerAll(page, questions) {
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
  await expect(page.locator(".result-stage")).toContainText(`${questions.length} / ${questions.length}`);
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

for (const [themeId, images, dictionaryId] of [["family", familyImages, "l1_sister"], ["home", homeImages, "l10_lamp"], ["park", parkImages, "l7_park"]]) test(`${themeId} photos show their specific context and pronounce it on the daily page and dictionary`, async ({ page }, info) => {
  await page.clock.setFixedTime(new Date("2026-10-12T12:00:00Z"));
  const theme = childThemes.find((item) => item.id === themeId);
  const completed = childThemes.slice(0, childThemes.indexOf(theme));
  await page.addInitScript((snapshot) => localStorage.setItem("sparks_learning_v2", JSON.stringify(snapshot)), {
    seen: completed.flatMap((theme) => theme.vocabulary.words.map((word) => word.id)),
    completed: completed.flatMap((theme) => [theme.vocabulary.id, theme.sentences.id, theme.story.id]),
  });
  await page.goto("./#today");
  await expect(page.getByRole("region", { name: "今日听读计划" })).toContainText(theme.title);
  await expect(page.locator(".preview-word img")).toHaveCount(8);
  for (const word of theme.vocabulary.words) {
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
