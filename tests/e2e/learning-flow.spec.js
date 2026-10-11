import { test, expect } from "@playwright/test";
import { learningWords } from "../../src/data/learning.js";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__spoken = [];
    window.SpeechSynthesisUtterance = class {
      constructor(text) {
        this.text = text;
      }
    };
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speaking: false,
        pending: false,
        paused: false,
        cancel() {},
        resume() {},
        getVoices: () => [
          { lang: "en-GB", name: "British English" },
          { lang: "en-US", name: "US English" },
        ],
        speak(utterance) {
          window.__spoken.push({
            text: utterance.text,
            lang: utterance.lang,
            rate: utterance.rate,
          });
          setTimeout(() => utterance.onend?.(), 15);
        },
      },
    });
  });
});

async function navigate(page, label) {
  await page
    .getByRole("navigation")
    .getByRole("link", { name: label, exact: true })
    .click();
}
async function readyPhotos(page) {
  await expect
    .poll(() =>
      page
        .locator("main img")
        .evaluateAll(
          (images) =>
            images.length > 0 &&
            images.every((image) => image.complete && image.naturalWidth > 0),
        ),
    )
    .toBe(true);
  await page.locator("main img").evaluateAll(async (images) => {
    await Promise.all(images.map((image) => image.decode()));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}
async function learnBreakfast(page) {
  await navigate(page, "学习天地");
  await page.getByRole("button", { name: "学习我的早餐", exact: true }).click();
  for (const word of ["apple", "banana", "bread", "milk"]) {
    await expect(
      page.getByRole("heading", { name: word, exact: true }),
    ).toBeVisible();
    await readyPhotos(page);
    await page.getByRole("button", { name: "听发音", exact: true }).click();
    await expect
      .poll(() => page.evaluate(() => window.__spoken.at(-1)?.text))
      .toBe(word);
    await page
      .getByRole("button", {
        name: word === "milk" ? "开始小练习" : "下一个单词",
      })
      .click();
  }
}

test("the first screen renders eight distinct real photographs without legacy templates", async ({
  page,
}, info) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await readyPhotos(page);
  await expect(page.locator(".word-grid img")).toHaveCount(8);
  const srcs = await page
    .locator(".word-grid img")
    .evaluateAll((images) => images.map((image) => image.getAttribute("src")));
  expect(new Set(srcs).size).toBe(8);
  expect(srcs.every((src) => /\/word-images\//.test(src))).toBe(true);
  await page.screenshot({ path: info.outputPath("today.png"), fullPage: true });
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

for (const [title, words] of [
  ["我的早餐", ["apple", "banana", "bread", "milk"]],
  ["动物朋友", ["cat", "dog", "rabbit", "fish"]],
  ["上学的一天", ["book", "pencil", "bicycle", "bus"]],
]) {
  test(`visually renders each word in ${title}`, async ({ page }, info) => {
    await page.goto("./#learn");
    await page
      .getByRole("button", { name: `学习${title}`, exact: true })
      .click();
    for (const word of words) {
      await expect(
        page.getByRole("heading", { name: word, exact: true }),
      ).toBeVisible();
      await readyPhotos(page);
      await expect(page.locator(".learning-stage img")).toHaveAttribute(
        "src",
        new RegExp(`/word-images/${learningWords.find((entry) => entry.word === word).id}\\.webp$`),
      );
      await page.screenshot({
        path: info.outputPath(`${word}.png`),
        fullPage: true,
      });
      await page
        .getByRole("button", {
          name: word === words.at(-1) ? "开始小练习" : "下一个单词",
        })
        .click();
    }
    await page.getByRole("button", { name: "返回", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "学习天地", exact: true }),
    ).toBeVisible();
  });
}

test("learning, recognition error, hearing, result and successful review persist honestly", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2026-10-12T12:00:00Z"));
  await page.goto("./");
  await learnBreakfast(page);
  await page.getByRole("button", { name: /A apple/ }).click();
  await expect(page.getByText("答对啦！", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "下一题" }).click();
  await expect(page.getByRole("textbox", { name: "输入英文拼写" })).toHaveCount(0);
  await page.locator(".answer-option").nth(1).click();
  await expect(page.getByText("没关系，我们再认识一次。")).toBeVisible();
  await page.getByRole("button", { name: "下一题" }).click();
  await expect(page.getByRole("button", { name: /bread/ })).toBeDisabled();
  await page.getByRole("button", { name: "播放听力" }).click();
  await expect(page.getByRole("button", { name: /bread/ })).toBeEnabled();
  await page.getByRole("button", { name: /bread/ }).click();
  await page.getByRole("button", { name: "下一题" }).click();
  await page.getByRole("button", { name: /milk/ }).click();
  await page.getByRole("button", { name: "查看结果" }).click();
  await expect(page.locator(".result-stage")).toContainText("3 / 4");
  await page.getByRole("button", { name: "完成练习" }).click();
  await navigate(page, "成长记录");
  await expect(page.locator(".review-list")).toContainText("banana");
  await page.reload();
  await expect(page.locator(".review-list")).toContainText("banana");
  await page.clock.setFixedTime(new Date("2026-10-13T12:00:00Z"));
  await page.reload();
  await page.getByRole("button", { name: "复习", exact: true }).click();
  await page.getByRole("button", { name: /香蕉/ }).click();
  await page.getByRole("button", { name: "查看结果" }).click();
  await page.getByRole("button", { name: "完成练习" }).click();
  await expect(page.getByText("复习区空空的，很棒。")).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("sparks_learning_v2")).mastered.length,
    ),
  ).toBe(0);
});

test("all six listening and reading questions score correctly with explicit speech", async ({
  page,
}) => {
  await page.goto("./#assessment");
  await page.getByText("家长与进阶测试 · 完整 KET 训练", { exact: true }).click();
  await page.getByRole("button", { name: "综合小测" }).click();
  for (const [index, answer] of [
    "Bread and milk",
    "By bus",
    "A rabbit",
    "You can borrow three books.",
    "A bicycle",
    "After school",
  ].entries()) {
    if (index < 3) {
      await page.getByRole("button", { name: "播放听力" }).click();
      await expect(
        page.getByRole("button", {
          name: new RegExp(answer.replace(/[.]/g, "\\.")),
        }),
      ).toBeEnabled();
    }
    await page
      .getByRole("button", { name: new RegExp(answer.replace(/[.]/g, "\\.")) })
      .click();
    await page
      .getByRole("button", { name: index === 5 ? "查看结果" : "下一题" })
      .click();
  }
  await expect(page.locator(".result-stage")).toContainText("6 / 6");
  expect(
    await page.evaluate(() =>
      window.__spoken.every((item) => item.lang === "en-GB"),
    ),
  ).toBe(true);
});

test("writing drafts persist and word count does not claim language scoring", async ({
  page,
}) => {
  await page.goto("./#assessment");
  await page.getByText("家长与进阶测试 · 完整 KET 训练", { exact: true }).click();
  await page.getByRole("tab", { name: /写作/ }).click();
  await page
    .getByRole("textbox", { name: "我的英文邮件" })
    .fill("Hi Alex, I like the park.");
  await expect(page.getByRole("button", { name: "完成并自查" })).toBeDisabled();
  const draft =
    "Hi Alex, On Saturday I go to the park with my family. We ride our bicycles and play together. I really enjoy it. What do you do at the weekend?";
  await page.getByRole("textbox", { name: "我的英文邮件" }).fill(draft);
  await page.getByRole("button", { name: "完成并自查" }).click();
  await expect(
    page.getByText("字数达标不代表语法正确。可请家长或老师帮你看看。"),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("tab", { name: /写作/ }).click();
  await expect(page.getByRole("textbox", { name: "我的英文邮件" })).toHaveValue(
    draft,
  );
});

test("dictionary suppresses fake images and wrong old book phonetics", async ({
  page,
}) => {
  await page.goto("./#learn");
  await page.getByRole("textbox", { name: "搜索单词或中文" }).fill("book");
  await page
    .getByRole("button", { name: /^book n\. 名词/ })
    .click();
  await expect(page.getByRole("dialog")).toContainText("/bʊk/");
  await expect(page.getByRole("dialog").locator("img")).toHaveAttribute(
    "src",
    /word-images\/l10_book.webp$/,
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page
    .getByRole("textbox", { name: "搜索单词或中文" })
    .fill("zzzznotaword");
  await expect(page.getByText("还没找到这个词")).toBeVisible();
});

test("accent settings and slow reading use explicit language and rate", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "发音设置", exact: true }).click();
  await page.getByLabel("英语口音").selectOption("en-US");
  await page.getByRole("button", { name: "关闭设置" }).click();
  await page.getByRole("button", { name: "开始学习", exact: true }).click();
  await page.getByRole("button", { name: "慢速播放单词" }).click();
  await expect
    .poll(() => page.evaluate(() => window.__spoken.at(-1)))
    .toEqual({ text: "apple", lang: "en-US", rate: 0.65 });
});

test("voice failure leaves listening unscored with a visible error", async ({
  page,
}) => {
  await page.goto("./#assessment");
  await page.getByText("家长与进阶测试 · 完整 KET 训练", { exact: true }).click();
  await page.evaluate(() => {
    window.speechSynthesis.speak = (utterance) =>
      setTimeout(() => utterance.onerror?.({ error: "synthesis-failed" }), 10);
  });
  await page.getByRole("button", { name: "开始听力练习" }).click();
  await page.getByRole("button", { name: "播放听力" }).click();
  await expect(
    page.getByText("没有成功播放，请检查设备音量后重试。"),
  ).toBeVisible();
  await expect(page.locator(".answer-option").first()).toBeDisabled();
});

test("speaking offers local self review and handles microphone denial", async ({
  page,
}) => {
  await page.goto("./#assessment");
  await page.getByText("家长与进阶测试 · 完整 KET 训练", { exact: true }).click();
  await page.getByRole("tab", { name: /口语/ }).click();
  await page.evaluate(() => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: () => Promise.reject(new Error("Permission denied")),
      },
    });
  });
  await page.getByRole("button", { name: "录下我的回答" }).click();
  await expect(page.getByRole("alert")).toContainText("暂时无法使用麦克风");
  await page.getByRole("checkbox", { name: "我回答了问题" }).check();
  await page.getByRole("button", { name: "换一个话题" }).click();
  await expect(
    page.getByRole("heading", { name: "Tell me about an animal you like." }),
  ).toBeVisible();
  await expect(
    page.getByRole("checkbox", { name: "我回答了问题" }),
  ).not.toBeChecked();
});

test("native recorder creates a playable local clip and stops its microphone on navigation", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["microphone"]);
  await page.goto("./#assessment");
  await page.getByText("家长与进阶测试 · 完整 KET 训练", { exact: true }).click();
  await page.evaluate(() => {
    const original = navigator.mediaDevices.getUserMedia.bind(
      navigator.mediaDevices,
    );
    navigator.mediaDevices.getUserMedia = async (constraints) => {
      const stream = await original(constraints);
      window.__micTracks = stream.getTracks();
      return stream;
    };
  });
  await page.getByRole("tab", { name: /口语/ }).click();
  await page.getByRole("button", { name: "录下我的回答" }).click();
  await expect(page.getByRole("button", { name: "结束录音" })).toBeVisible();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "结束录音" }).click();
  await expect(page.locator("audio")).toHaveAttribute("src", /^blob:/);
  await expect
    .poll(() => page.locator("audio").evaluate((audio) => audio.readyState))
    .toBeGreaterThan(0);
  expect(
    await page.locator("audio").evaluate((audio) =>
      fetch(audio.src)
        .then((response) => response.blob())
        .then((blob) => blob.size),
    ),
  ).toBeGreaterThan(0);
  await page.getByRole("button", { name: "录下我的回答" }).click();
  await expect(page.getByRole("button", { name: "结束录音" })).toBeVisible();
  await navigate(page, "今天");
  expect(
    await page.evaluate(() =>
      window.__micTracks.every((track) => track.readyState === "ended"),
    ),
  ).toBe(true);
});

test("incorrect reading answers are reviewed in their original context", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2026-10-12T12:00:00Z"));
  await page.goto("./#assessment");
  await page.getByText("家长与进阶测试 · 完整 KET 训练", { exact: true }).click();
  await page.getByRole("tab", { name: /阅读/ }).click();
  await page.getByRole("button", { name: "开始阅读练习" }).click();
  await page.getByRole("button", { name: /You must buy a book/ }).click();
  await page.getByRole("button", { name: "下一题" }).click();
  await page.getByRole("button", { name: /A bicycle/ }).click();
  await page.getByRole("button", { name: "下一题" }).click();
  await page.getByRole("button", { name: /After school/ }).click();
  await page.getByRole("button", { name: "查看结果" }).click();
  await page.getByRole("button", { name: "完成练习" }).click();
  await navigate(page, "成长记录");
  await page.getByRole("button", { name: "复习", exact: true }).click();
  await expect(page.locator(".reading-passage")).toContainText("LIBRARY");
  await page
    .getByRole("button", { name: /You can borrow three books/ })
    .click();
  await page.getByRole("button", { name: "查看结果" }).click();
  await page.getByRole("button", { name: "完成练习" }).click();
  await expect(page.getByText("复习区空空的，很棒。")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "复习", exact: true })).toBeVisible();
  await page.clock.setFixedTime(new Date("2026-10-13T12:00:00Z"));
  await page.reload();
  await page.getByRole("button", { name: "复习", exact: true }).click();
  await expect(page.locator(".reading-passage")).toContainText("LIBRARY");
  await page.getByRole("button", { name: /You can borrow three books/ }).click();
  await page.getByRole("button", { name: "查看结果" }).click();
  await page.getByRole("button", { name: "完成练习" }).click();
  await expect(page.getByText("复习区空空的，很棒。")).toBeVisible();
});
