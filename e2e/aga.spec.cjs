const { test, expect } = require('@playwright/test');

test('homepage navigation and calls to action open working destinations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Meet Me on the Avenue' })).toBeVisible();
  await page.getByRole('link', { name: 'Explore Cities' }).click();
  await expect(page).toHaveURL(/cities\.html/);
  await page.getByRole('link', { name: /AfterGlowAve Home/ }).click();
  await page.getByRole('link', { name: 'Play Games' }).click();
  await expect(page).toHaveURL(/arcade\.html/);
  await page.getByRole('link', { name: 'Back to Home' }).click();
  await page.getByRole('link', { name: 'My Account' }).click();
  await expect(page.getByRole('heading', { name: 'My AfterGlowAve' })).toBeVisible();
});

test('city filtering and search update live results', async ({ page }) => {
  await page.goto('/cities.html');
  await page.getByLabel('Country').selectOption('United States');
  await page.getByPlaceholder('Search by city or state').fill('Charlotte');
  await expect(page.getByText('1 locations shown.')).toBeVisible();
  await expect(page.locator('#results li')).toHaveCount(1);
  await expect(page.locator('#results li')).toContainText('Charlotte');
  await page.getByPlaceholder('Search by city or state').fill('nowhere-fake');
  await expect(page.getByText('No matching locations.')).toBeVisible();
});

test('arcade buttons support two player wins, reset and dice', async ({ page }) => {
  await page.goto('/arcade.html');
  const cells = page.locator('#board button');
  await expect(cells).toHaveCount(9);
  for (const index of [0, 3, 1, 4, 2]) await cells.nth(index).click();
  await expect(page.locator('#game-status')).toHaveText('X wins!');
  await expect(cells.nth(5)).toBeDisabled();
  await page.getByRole('button', { name: 'New Game' }).click();
  await expect(page.locator('#game-status')).toHaveText('X goes first.');
  await expect(cells.nth(0)).toBeEnabled();
  await page.getByRole('button', { name: 'Roll Dice' }).click();
  await expect(page.locator('#dice-status')).toContainText('You rolled');
});

test('member registration, saved cities, reports and sign-out work through UI', async ({ page }) => {
  const email = 'browser-' + Math.random().toString(36).slice(2) + '@example.test';
  await page.goto('/account.html');
  await page.getByLabel('Display name').fill('Browser Test');
  await page.locator('#reg-email').fill(email);
  await page.locator('#reg-password').fill('BrowserTestPassword123!');
  await page.getByLabel(/I confirm I am 18/).check();
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome, Browser Test' })).toBeVisible();
  await page.getByLabel('Choose a city').selectOption('Charlotte');
  await page.getByRole('button', { name: 'Save city' }).click();
  await expect(page.locator('#saved-list')).toContainText('Charlotte');
  await page.getByLabel('Category').selectOption('spam');
  await page.getByLabel('Details').fill('Automated test report for UI verification');
  await page.getByRole('button', { name: 'Submit report' }).click();
  await expect(page.locator('#status')).toContainText('Report recorded for review');
  await page.getByRole('button', { name: 'Remove Charlotte' }).click();
  await expect(page.locator('#saved-list')).toContainText('No saved cities yet.');
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();
  await page.locator('#login-email').fill(email);
  await page.locator('#login-password').fill('BrowserTestPassword123!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Welcome, Browser Test' })).toBeVisible();
});
