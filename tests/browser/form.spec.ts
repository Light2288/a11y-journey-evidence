import { test, expect } from '@playwright/test';
import { loadForm } from '../../examples/shared/form.js';
import { exerciseForm } from '../../examples/shared/form-journey.js';

test('form recipe correct keyboard flow clears errors and descriptions', async ({ page }) => {
  await loadForm(page, 'correct');
  await expect(page.getByRole('form', { name: 'Team request' })).toHaveAttribute('novalidate', '');
  await exerciseForm(page);
  await expect(page.locator('#form')).toBeAttached();
});

test('form recipe focuses Team when only Team is missing', async ({ page }) => {
  await loadForm(page, 'correct');
  await page.keyboard.press('Tab');
  await page.keyboard.type('Example User');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('#team')).toBeFocused();
  await expect(page.locator('#team-error')).toBeVisible();
  await expect(page.locator('#team')).toHaveAccessibleDescription('Enter a team.');
  await expect(page.locator('#team')).toHaveAttribute('aria-describedby', 'team-error');
  await expect(page.locator('#team')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'false');
  await expect(page.locator('#name')).not.toHaveAttribute('aria-describedby', /.+/);
  await expect(page.locator('#name')).toHaveAccessibleDescription('');
  await expect(page.locator('#name-error')).toBeHidden();
  await expect(page.locator('#success')).toBeHidden();
});

test('form recipe rejects whitespace-only values', async ({ page }) => {
  await loadForm(page, 'correct');
  await page.keyboard.press('Tab');
  await page.keyboard.type('   ');
  await page.keyboard.press('Tab');
  await page.keyboard.type('   ');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('#name')).toBeFocused();
  for (const [id, error] of [['name', 'Enter a name.'], ['team', 'Enter a team.']]) {
    await expect(page.locator(`#${id}`)).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator(`#${id}`)).toHaveAccessibleDescription(error!);
    await expect(page.locator(`#${id}-error`)).toBeVisible();
  }
  await expect(page.locator('#success')).toBeHidden();
});

test('form recipe missing association preserves focus and visible errors', async ({ page }) => {
  await loadForm(page, 'missing-error-association');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('#name')).toBeFocused();
  await expect(page.locator('#name-error')).toBeVisible();
  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#name')).toHaveAccessibleDescription('');
  await expect(page.locator('#name')).not.toHaveAttribute('aria-describedby', /.+/);
  await expect(page.locator('#team')).toHaveAccessibleDescription('Enter a team.');
});

test('form recipe failed focus preserves both associations and Submit focus', async ({ page }) => {
  await loadForm(page, 'failed-error-focus');
  await expect(page.locator('#form')).toHaveAttribute('novalidate', '');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('#submit')).toBeFocused();
  for (const [id, error] of [['name', 'Enter a name.'], ['team', 'Enter a team.']]) {
    await expect(page.locator(`#${id}`)).toHaveAccessibleDescription(error!);
    await expect(page.locator(`#${id}`)).toHaveAttribute('aria-describedby', `${id}-error`);
    await expect(page.locator(`#${id}`)).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator(`#${id}-error`)).toBeVisible();
  }
});
