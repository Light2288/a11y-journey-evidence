import { expect } from '@playwright/test';
import { plainTest as test } from './fixtures.js';
test('unselected control', async ({ page, tenant }) => {
  expect(tenant).toBe('synthetic-team');
  await page.setContent('<h1>Unselected control</h1>');
  await expect(page.getByRole('heading')).toHaveText('Unselected control');
});
