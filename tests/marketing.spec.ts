import { test, expect } from '@playwright/test';

test('updates dialog contains focus, closes with Escape, and restores focus', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Get Updates' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Get Beta Updates' });
  await expect(dialog).toBeVisible();
  await expect(page.getByLabel('Email address', { exact: true })).toBeFocused();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(el => el.contains(document.activeElement) || document.activeElement === document.body)).toBeTruthy();
  }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('button', { name: 'Close updates dialog' }).click();
  await expect(trigger).toBeFocused();
});

test('mobile menu reports state and Escape restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Open main menu' });
  await expect(button).toHaveAttribute('aria-controls', 'mobile-menu');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.locator('#mobile-menu a').first().focus();
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#mobile-menu')).not.toBeVisible();
  await expect(button).toBeFocused();
});

test('all pages expose canonical and social metadata with distinct descriptions', async ({ page }) => {
  const descriptions = new Set<string>();
  for (const route of ['/', '/about', '/contact', '/sponsor', '/privacy', '/terms']) {
    await page.goto(route);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(`https://livemusiclocal.com${route}`);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    descriptions.add(description!);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description!);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical!);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://livemusiclocal.com/images/logo-hero.webp');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary');
  }
  expect(descriptions.size).toBe(6);
});

test('privacy discloses providers and has a stable revision', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByRole('main')).toContainText('Formspree');
  await expect(page.getByRole('main')).toContainText('Google Fonts');
  await expect(page.getByRole('main')).toContainText('Last updated: November 8, 2026');
});
