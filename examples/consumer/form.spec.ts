import { readFile } from 'node:fs/promises';
import { expect } from '@playwright/test';
import { test } from './fixtures.js';

test('packed consumer form uses existing fixture', async ({ page, journey, tenant }) => {
  expect(tenant).toBe('synthetic-team');
  await page.setContent(await readFile(new URL('./form.html', import.meta.url), 'utf8'));
  await journey.start({ root: page.locator('#form') });
  const name = page.getByRole('textbox', { name: 'Name', exact: true });
  const team = page.getByRole('textbox', { name: 'Team', exact: true });
  const submit = page.getByRole('button', { name: 'Submit', exact: true });
  await test.step('Keyboard submission', async () => {
    await expect(page.getByRole('form', { name: 'Team request' })).toHaveAttribute('novalidate', '');
    await page.keyboard.press('Tab');
    await expect(name).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(team).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(submit).toBeFocused();
    await page.keyboard.press('Enter');
  });
  await test.step('Visible errors and declared associations', async () => {
    await expect(page.locator('#name-error')).toBeVisible();
    await expect(page.locator('#team-error')).toBeVisible();
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(team).toHaveAttribute('aria-invalid', 'true');
    await expect(name).toHaveAccessibleDescription('Enter a name.');
    await expect(team).toHaveAccessibleDescription('Enter a team.');
    await expect(name).toHaveAttribute('aria-describedby', 'name-error');
    await expect(team).toHaveAttribute('aria-describedby', 'team-error');
    await expect(name).toBeFocused();
  });
  await test.step('Keyboard correction and successful resubmission', async () => {
    await page.keyboard.type('Example User');
    await page.keyboard.press('Tab');
    await expect(team).toBeFocused();
    await page.keyboard.type('Example Team');
    await page.keyboard.press('Tab');
    await expect(submit).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByRole('status')).toHaveText('Details saved.');
    for (const field of [name, team]) {
      await expect(field).toHaveAttribute('aria-invalid', 'false');
      await expect(field).not.toHaveAttribute('aria-describedby', /.+/);
      await expect(field).toHaveAccessibleDescription('');
    }
    await expect(page.locator('#name-error')).toBeHidden();
    await expect(page.locator('#team-error')).toBeHidden();
    await expect(page.locator('#form')).toBeAttached();
  });
});
