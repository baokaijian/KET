import { expect, test } from "@playwright/test";

async function account(page) {
  await page.getByRole("button", { name: "账户与同步", exact: true }).click();
  return page.getByRole("dialog", { name: "账户与同步" });
}
async function login(page, email) {
  const panel = await account(page);
  await panel.getByLabel("家长邮箱").fill(email);
  await panel.getByLabel("密码", { exact: true }).fill("TestPass123!");
  await panel.getByRole("button", { name: "登录并同步", exact: true }).click();
  await expect(panel).not.toBeVisible();
  await expect(page.locator("footer")).toContainText("学习记录已同步");
}
async function sync(page) {
  const panel = await account(page);
  await panel.getByRole("button", { name: "立即同步", exact: true }).click();
  await expect(panel.getByRole("status")).toHaveText("学习记录已同步");
  await panel.getByRole("button", { name: "关闭账户窗口" }).click();
}
async function writing(page) {
  await page.getByRole("navigation").getByRole("link", { name: "KET 小测", exact: true }).click();
  const advanced = page.getByText("家长与进阶测试 · 完整 KET 训练", { exact: true });
  if (!(await page.getByLabel("选择专项").isVisible())) await advanced.click();
  await page.getByLabel("选择专项").selectOption("R6");
  await page.getByRole("button", { name: "开始专项", exact: true }).click();
  return page.getByRole("textbox", { name: "我的英文邮件", exact: true });
}

test("independent browsers import, resume, sync offline drafts and isolate accounts", async ({ browser, page, context }, info) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#learn");
  await page.getByRole("button", { name: "学习我的早餐", exact: true }).click();
  await page.getByRole("button", { name: "下一个单词", exact: true }).click();
  await expect(page.getByRole("heading", { name: "banana", exact: true })).toBeVisible();
  await login(page, "parent-a@example.test");
  let panel = await account(page);
  await panel.getByRole("button", { name: "导入本浏览器原有记录" }).click();
  await expect(panel.getByText("学习记录已同步", { exact: true })).toBeVisible();
  await panel.getByRole("button", { name: "关闭账户窗口" }).click();

  const other = await browser.newContext({ ...info.project.use });
  const b = await other.newPage();
  b.on("pageerror", (error) => errors.push(error.message));
  await b.goto("http://127.0.0.1:5180/KET/#learn");
  await login(b, "parent-a@example.test");
  await b.getByRole("button", { name: "学习我的早餐", exact: true }).click();
  await expect(b.getByRole("heading", { name: "banana", exact: true })).toBeVisible();
  const guestBefore = await page.evaluate(() => localStorage.getItem("sparks_learning_v2"));
  const draftA = await writing(page);
  const offlineDraft = `Hello Alex, this was written while offline on ${info.project.name}.`;
  await context.setOffline(true);
  await draftA.fill(offlineDraft);
  await page.waitForTimeout(1000);
  await expect(page.locator("footer")).toContainText("记录保留在本浏览器");
  await context.setOffline(false);
  await sync(page);
  await page.reload();
  await expect(await writing(page)).toHaveValue(offlineDraft);
  await sync(b);
  await expect(await writing(b)).toHaveValue(offlineDraft);
  await page.getByRole("button", { name: "发音设置", exact: true }).click();
  await page.getByLabel("英语口音").selectOption("en-US");
  await page.getByRole("button", { name: "关闭设置", exact: true }).click();
  await sync(page); await sync(b);
  await b.getByRole("button", { name: "发音设置", exact: true }).click();
  await expect(b.getByLabel("英语口音")).toHaveValue("en-US");
  await b.getByRole("button", { name: "关闭设置", exact: true }).click();

  panel = await account(b);
  await panel.getByRole("button", { name: "退出账户", exact: true }).click();
  await expect(b.locator("footer")).toContainText("无需账号即可学习");
  await login(b, "parent-b@example.test");
  await expect(await writing(b)).toHaveValue("");
  expect(await page.evaluate(() => localStorage.getItem("sparks_learning_v2"))).toBe(guestBefore);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  await other.close();
});
