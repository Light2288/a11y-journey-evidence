import { expect } from '@playwright/test';
import { test } from './fixtures.js';
import { loadDialog, exerciseDialog, type DialogVariant } from './dialog.js';

for (const variant of ['correct', 'escaping-focus', 'failed-restoration'] as DialogVariant[]) {
  test(`dialog ${variant}`, async ({ page, journey, tenant }) => {
    if (variant !== 'correct') test.fail();
    await test.step('Setup: load synthetic dialog', async () => {
      expect(tenant).toBe('synthetic-team');
      await loadDialog(page, variant);
    });
    await journey.start({ root: page.locator('#dialog') });
    await exerciseDialog(page);
  });
}
