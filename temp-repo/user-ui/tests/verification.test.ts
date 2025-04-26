import { test, expect } from '@playwright/test';

test('邮箱输入验证', async ({ page }) => {
  // 访问注册页面
  await page.goto('http://localhost:3000/register');
  await page.waitForLoadState('networkidle');

  // 输入无效邮箱
  const emailInput = page.locator('input[type="email"]');
  await emailInput.fill('test');
  
  // 点击发送按钮
  const sendButton = page.locator('button:has-text("发送验证码")');
  await sendButton.click();
  
  // 等待错误提示出现
  const errorText = page.locator('.MuiFormHelperText-root');
  await expect(errorText).toContainText('请输入有效的邮箱地址');
  
  // 验证按钮状态
  await expect(sendButton).toBeDisabled();
});

test('有效邮箱发送验证码', async ({ page }) => {
  // 访问注册页面
  await page.goto('http://localhost:3000/register');
  await page.waitForLoadState('networkidle');

  // 输入有效邮箱
  const emailInput = page.locator('input[type="email"]');
  await emailInput.fill('test@example.com');
  
  // 点击发送按钮
  const sendButton = page.locator('button:has-text("发送验证码")');
  await sendButton.click();
  
  // 等待倒计时出现
  await page.waitForTimeout(1000);
  const countdown = page.locator('button:has-text("60s")');
  await expect(countdown).toBeVisible();
  
  // 验证发送次数显示
  const sendCount = page.locator('text=已发送 1/3 次');
  await expect(sendCount).toBeVisible();
});

test('验证码限制测试', async ({ page }) => {
  // 访问注册页面
  await page.goto('http://localhost:3000/register');
  await page.waitForLoadState('networkidle');

  // 输入有效邮箱
  const emailInput = page.locator('input[type="email"]');
  await emailInput.fill('test@example.com');
  
  // 发送三次验证码
  for (let i = 1; i <= 3; i++) {
    const sendButton = page.locator('button:has-text("发送验证码")');
    await sendButton.click();
    // 等待60秒
    await page.waitForTimeout(1000); // 测试时缩短等待时间
  }
  
  // 验证达到上限
  const maxLimit = page.locator('text=已达上限');
  await expect(maxLimit).toBeVisible();
  
  // 验证解锁时间显示
  const unlockTime = page.locator('text=将在23小时59分钟后解锁');
  await expect(unlockTime).toBeVisible();
  
  // 验证按钮禁用
  const sendButton = page.locator('button:has-text("已达上限")');
  await expect(sendButton).toBeDisabled();
});

test('验证码输入测试', async ({ page }) => {
  // 访问注册页面
  await page.goto('http://localhost:3000/register');
  await page.waitForLoadState('networkidle');

  // 输入有效邮箱并发送验证码
  const emailInput = page.locator('input[type="email"]');
  await emailInput.fill('test@example.com');
  
  const sendButton = page.locator('button:has-text("发送验证码")');
  await sendButton.click();
  
  // 等待验证码输入框出现
  await page.waitForTimeout(1000);
  const codeInput = page.locator('input[name="verificationCode"]');
  await codeInput.fill('123456');
  
  // 点击注册按钮
  const registerButton = page.locator('button:has-text("注册")');
  await registerButton.click();
  
  // 验证错误提示
  const errorText = page.locator('.MuiFormHelperText-root');
  await expect(errorText).toContainText('验证码无效或已过期');
}); 