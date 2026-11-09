import { expect, test } from "@playwright/test";

test.describe("v2.0 Dual-Mode (Solo + Co-learn) & Parent Center E2E", () => {
  test("A1: first visit shows ModeSelectorCard, persists selection across reload without re-prompting", async ({
    page,
  }) => {
    await page.goto("./");
    const modeCard = page.getByRole("region", { name: "学习模式选择" });
    await expect(modeCard).toBeVisible();
    await expect(page.getByRole("button", { name: "我自己学" })).toBeVisible();
    await expect(page.getByRole("button", { name: "一起学" })).toBeVisible();
    await expect(page.getByRole("button", { name: "听一听模式说明" })).toBeVisible();

    await page.getByRole("button", { name: "我自己学" }).click();

    await expect(page.getByRole("region", { name: "自学儿童互动区" })).toBeVisible();
    await expect(modeCard).toHaveCount(0);

    // Reload and verify mode preference is remembered without re-asking (A1)
    await page.reload();
    await expect(page.getByRole("region", { name: "自学儿童互动区" })).toBeVisible();
    await expect(page.getByRole("region", { name: "学习模式选择" })).toHaveCount(0);
  });

  test("A2, B1, B3, B4, B5, B7, E1: Solo mode enforces >=64px touch targets, <=12 Chinese chars, Zero-Chinese mask, and 3->2 error degradation", async ({
    page,
  }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "我自己学" }).click();

    const childArea = page.getByRole("region", { name: "自学儿童互动区" });
    await expect(childArea).toBeVisible();

    // B3: Every visible button on the child home screen is >= 64x64px
    const homeButtons = childArea.locator("button:visible");
    const homeBtnCount = await homeButtons.count();
    expect(homeBtnCount).toBeGreaterThan(0);
    for (let i = 0; i < homeBtnCount; i += 1) {
      const box = await homeButtons.nth(i).boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(64);
      expect(box.height).toBeGreaterThanOrEqual(64);
    }

    // B7: Visible Chinese characters in child stage <= 12
    const visibleText = await childArea.innerText();
    const chineseChars = (visibleText.match(/[\u4e00-\u9fff]/g) || []).join("");
    expect(chineseChars.length).toBeLessThanOrEqual(12);

    // Enable B1 Zero-Chinese mask ("遮字测试") from Parent Center
    await page.getByRole("banner").getByRole("button", { name: "家长中心" }).click();
    await expect(page.getByRole("region", { name: "家长中心" })).toBeVisible();
    await page.getByLabel("隐藏儿童端中文文字（开启“遮字测试”纯图标语音模式）").check();
    await page.getByRole("button", { name: "返回儿童端" }).click();

    await expect(page.locator(".dual-mode-layout")).toHaveClass(/zero-chinese-mask/);

    // Start learning task
    await childArea.getByRole("button", { name: "开始" }).click();
    await expect(childArea.getByRole("article", { name: "图词卡" })).toBeVisible();

    // Step through the word cards in the daily vocabulary task until we enter the quiz stage
    for (let i = 0; i < 8; i += 1) {
      const nextBtn = childArea.getByRole("button", { name: "下一个" });
      if ((await nextBtn.count()) === 0) break;
      await nextBtn.click();
    }

    // Now in 3-choice "找一找" quiz stage
    const quizGroup = childArea.getByRole("group", { name: "选择正确的图片" });
    await expect(quizGroup).toBeVisible();
    const initialOptions = quizGroup.locator("button.child-quiz-option");
    await expect(initialOptions).toHaveCount(3);

    // B4: Test error degradation (2 consecutive wrong clicks -> reduces to 2 options)
    const optionTexts = await initialOptions.allInnerTexts();
    const wrongIndex = optionTexts.findIndex((t) => !t.toLowerCase().includes("apple"));
    expect(wrongIndex).toBeGreaterThanOrEqual(0);

    await initialOptions.nth(wrongIndex).click();
    await initialOptions.nth(wrongIndex).click();

    // Options should now be reduced from 3 to 2 (B4)
    await expect(initialOptions).toHaveCount(2);

    // Open My Album (我的图鉴 E1/E2)
    await childArea.getByRole("button", { name: "我的图鉴" }).click();
    await expect(childArea.getByRole("region", { name: "我的图鉴" })).toBeVisible();
    await expect(childArea.getByRole("list", { name: "12主题收集格" })).toBeVisible();
  });

  test("A3, A4, M5, M6, M7, F5, F6: Co-learn mode parent prompt bar, 4 permissions, mobile collapse, and Parent Center", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("./");
    await page.getByRole("button", { name: "一起学" }).click();

    // 30-second Parent Intro Card (6.1)
    const introRegion = page.getByRole("region", { name: "家长陪学开场卡" });
    await expect(introRegion).toBeVisible();
    await expect(introRegion).toContainText("你不需要会英语");

    await introRegion.getByRole("button", { name: "开始" }).click();

    // Verify 70%/30% split view and Parent Prompt Bar (A3, M5, M7)
    const promptBar = page.getByRole("complementary", { name: "家长陪学提示条" });
    await expect(promptBar).toBeVisible();
    await expect(promptBar).toContainText("你可以说");
    await expect(promptBar).toContainText("你可以做");
    await expect(promptBar).toContainText("注意");

    // Start task and verify Parent Prompt Bar updates with stage
    const childArea = page.getByRole("region", { name: "陪学儿童互动区" });
    await childArea.getByRole("button", { name: "开始" }).click();
    await expect(promptBar).toContainText("看图听词");

    // Test 4 parent permissions: pause/resume, reduce difficulty, skip, peek answer (3x warning)
    await childArea.getByRole("button", { name: "暂停学习" }).click();
    await expect(childArea.getByRole("button", { name: "继续学习" })).toBeVisible();
    await childArea.getByRole("button", { name: "继续学习" }).click();

    await promptBar.getByRole("button", { name: "降低难度" }).click();
    await promptBar.getByRole("button", { name: "跳过本环节" }).click();

    // Click "看答案" 3 times -> triggers gentle anti-over-intervention prompt (PRD 6.4)
    const peekBtn = promptBar.getByRole("button", { name: "看答案" });
    await peekBtn.click();
    await peekBtn.click();
    await peekBtn.click();
    await expect(promptBar).toContainText("让他自己试一次");

    // Test mobile portrait viewport (390x844) collapsible prompt bar & no horizontal overflow (M7)
    await page.setViewportSize({ width: 390, height: 844 });
    await promptBar.getByRole("button", { name: "折叠家长提示" }).click();
    await expect(promptBar).toHaveClass(/collapsed/);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    );
    expect(overflow).toBe(true);

    // End session and verify Wrap-up Card (6.1)
    await page.setViewportSize({ width: 1280, height: 800 });
    await promptBar.getByRole("button", { name: "展开家长提示" }).click();
    await promptBar.getByRole("button", { name: "结束陪学会话" }).click();
    await expect(page.getByRole("region", { name: "家长陪学收尾卡" })).toBeVisible();

    // Enter Parent Center (M6)
    await page.getByRole("button", { name: "查看家长中心完整报告" }).click();
    const parentCenter = page.getByRole("region", { name: "家长中心" });
    await expect(parentCenter).toBeVisible();
    await expect(page.getByRole("article", { name: "本周伴学三段式结论" })).toBeVisible();
    await expect(page.getByRole("article", { name: "今日简报" })).toBeVisible();
    await expect(page.getByRole("article", { name: "本周学习曲线" })).toBeVisible();
    await expect(page.getByRole("article", { name: "12主题掌握地图" })).toBeVisible();

    // F5: Export JSON
    await page.getByRole("button", { name: "导出学习记录 (JSON)" }).click();
    const jsonBox = page.getByRole("textbox", { name: "导出的 JSON 数据" });
    await expect(jsonBox).toBeVisible();
    const exportedText = await jsonBox.inputValue();
    expect(exportedText).toContain('"schemaVersion": "sparks-v2.0"');

    // F6: Clear all local data with "删除" confirmation
    await page.getByRole("button", { name: "清空全部数据" }).click();
    await page.getByRole("textbox", { name: "输入删除确认清空数据" }).fill("删除");
    await page.getByRole("button", { name: "确认彻底删除" }).click();
    await expect(page.getByRole("textbox", { name: "输入删除确认清空数据" })).toHaveCount(0);
  });
});
