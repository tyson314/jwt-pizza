import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
  await expect(page.getByText('Pizza is an absolute delight')).toBeVisible();
  await expect(page.getByText('Pizza has come a long way')).toBeVisible();
  await expect(page.getByText('Pizza is not just a food; it\'')).toBeVisible();
  await expect(page.getByText('Pizza is a universal language')).toBeVisible();
  await expect(page.getByRole('main').getByRole('img')).toBeVisible();
  await page.getByRole('link', { name: 'home' }).click();
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
  await expect(page.getByText('Pizza is an absolute delight')).toBeVisible();
  await expect(page.getByText('Pizza has come a long way')).toBeVisible();
  await expect(page.getByText('Pizza is not just a food; it\'')).toBeVisible();
  await expect(page.getByText('Pizza is a universal language')).toBeVisible();
});

