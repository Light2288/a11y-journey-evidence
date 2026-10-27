import { test } from 'a11y-journey-evidence';
import { loadForm, type FormVariant } from '../shared/form.js';
import { exerciseForm } from '../shared/form-journey.js';

for (const variant of ['correct', 'missing-error-association', 'failed-error-focus'] as FormVariant[]) {
  test(`form ${variant}`, async ({ page, journey }) => {
    if (variant !== 'correct') test.fail();
    await test.step('Setup: load synthetic form', () => loadForm(page, variant));
    await journey.start({ root: page.locator('#form') });
    await exerciseForm(page);
  });
}
