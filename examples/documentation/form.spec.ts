import { expect } from '@playwright/test';
import { test } from './fixtures.js';
import { loadForm, exerciseForm, type FormVariant } from './form.js';

for (const variant of ['correct', 'missing-error-association', 'failed-error-focus'] as FormVariant[]) {
  test(`form ${variant}`, async ({ page, journey, tenant }) => {
    if (variant !== 'correct') test.fail();
    await test.step('Setup: load synthetic form', async () => {
      expect(tenant).toBe('synthetic-team');
      await loadForm(page, variant);
    });
    await journey.start({ root: page.locator('#form') });
    await exerciseForm(page);
  });
}
