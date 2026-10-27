import { test } from '@playwright/test';
import { loadForm, type FormVariant } from '../shared/form.js';
import { exerciseForm } from '../shared/form-journey.js';

test.afterEach(async ({ page }, info) => {
  if (!['failed', 'timedOut', 'interrupted'].includes(info.status ?? '')) return;
  const outcomes: unknown[] = [];
  for (const kind of ['focus', 'screenshot', 'aria']) {
    const startedAt = new Date().toISOString();
    try {
      if (kind === 'focus') {
        const focus = await page.evaluate(() => {
          const element = document.activeElement;
          if (!element) return null;
          const attributes: Record<string, string> = {};
          for (const key of ['aria-invalid', 'aria-describedby']) {
            const value = element.getAttribute(key);
            if (value !== null) attributes[key] = value;
          }
          return { tag: element.tagName.toLowerCase(), id: element.id, attributes };
        });
        await info.attach('stock-focus', { body: Buffer.from(JSON.stringify(focus)), contentType: 'application/json' });
      }
      if (kind === 'screenshot') await info.attach('stock-screenshot', { body: await page.screenshot({ timeout: 2000 }), contentType: 'image/png' });
      if (kind === 'aria') await info.attach('stock-aria', { body: Buffer.from(await page.locator('#form').ariaSnapshot({ timeout: 2000 })), contentType: 'text/yaml' });
      outcomes.push({ kind, status: 'captured', phase: 'afterEach', startedAt, finishedAt: new Date().toISOString() });
    } catch (error) {
      outcomes.push({ kind, status: 'unavailable', phase: 'afterEach', reason: String(error), startedAt, finishedAt: new Date().toISOString() });
    }
  }
  try {
    await info.attach('stock-capture-timing', { body: Buffer.from(JSON.stringify(outcomes, null, 2)), contentType: 'application/json' });
  } catch (error) {
    process.stderr.write(`Stock attachment reporting failed: ${String(error)}\n`);
  }
});

for (const variant of ['correct', 'missing-error-association', 'failed-error-focus'] as FormVariant[]) {
  test(`form ${variant}`, async ({ page }) => {
    if (variant !== 'correct') test.fail();
    await test.step('Setup: load synthetic form', () => loadForm(page, variant));
    await exerciseForm(page);
  });
}
