import { test, expect, type Page } from '@playwright/test';

export async function exerciseForm(page: Page): Promise<void> {
  const name = page.getByRole('textbox', { name: 'Name', exact: true });
  const team = page.getByRole('textbox', { name: 'Team', exact: true });
  const submit = page.getByRole('button', { name: 'Submit', exact: true });

  await test.step('Keyboard submission', async () => {
    await expect(page.getByRole('form', { name: 'Team request' })).toHaveAttribute('novalidate', '');
    for (const field of [name, team]) {
      await expect(field).toHaveAttribute('aria-invalid', 'false');
      await expect(field).not.toHaveAttribute('aria-describedby', /.+/);
    }
    await expect(page.locator('#name-error')).toBeHidden();
    await expect(page.locator('#team-error')).toBeHidden();
    await expect(page.locator('#success')).toBeHidden();
    await page.keyboard.press('Tab');
    await expect(name).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(team).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(submit).toBeFocused();
    await page.keyboard.press('Enter');
  });
  await test.step('Visible errors and invalid states', async () => {
    await expect(page.locator('#name-error')).toBeVisible();
    await expect(page.locator('#name-error')).toHaveText('Enter a name.');
    await expect(page.locator('#team-error')).toBeVisible();
    await expect(page.locator('#team-error')).toHaveText('Enter a team.');
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(team).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#success')).toBeHidden();
  });
  await test.step('Declared error associations', async () => {
    await expect(name, 'Association: Name describes its visible error').toHaveAccessibleDescription('Enter a name.');
    await expect(team, 'Association: Team describes its visible error').toHaveAccessibleDescription('Enter a team.');
    await expect(name).toHaveAttribute('aria-describedby', 'name-error');
    await expect(team).toHaveAttribute('aria-describedby', 'team-error');
  });
  await test.step('Declared invalid-submit focus', async () => {
    await expect(name, 'Error focus: Name is the first invalid field').toBeFocused();
  });
  await test.step('Keyboard correction and successful resubmission', async () => {
    await page.keyboard.type('Example User');
    await page.keyboard.press('Tab');
    await expect(team).toBeFocused();
    await page.keyboard.type('Example Team');
    await expect(name).toHaveValue('Example User');
    await expect(team).toHaveValue('Example Team');
    // This example updates validation on submit, rather than on each edit.
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(team).toHaveAttribute('aria-invalid', 'true');
    await page.keyboard.press('Tab');
    await expect(submit).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toHaveText('Details saved.');
    await expect(page.getByRole('status')).toBeVisible();
    for (const field of [name, team]) {
      await expect(field).toHaveAttribute('aria-invalid', 'false');
      await expect(field).not.toHaveAttribute('aria-describedby', /.+/);
      await expect(field).toHaveAccessibleDescription('');
    }
    await expect(page.locator('#name-error')).toBeHidden();
    await expect(page.locator('#team-error')).toBeHidden();
    await expect(page.locator('#form')).toBeAttached();
  });
}
