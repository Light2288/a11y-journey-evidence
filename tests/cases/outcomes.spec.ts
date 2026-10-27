import { test } from '../../dist/index.js';
import { test as plain, expect } from '@playwright/test';
test.describe.configure({ mode: 'parallel' });
for (const mode of ['hard','soft','no-assertion','early','expected','unexpected-pass','retry','parallel-one','parallel-two','repeat','corrupt']) {
  test(`outcomes ${mode}`, async ({ page, journey }, info) => {
    await page.setContent(`<main id="root"><button id="${mode}">Button</button></main>`);
    await journey.start({ root: page.locator('#root') });
    await page.keyboard.press('Tab');
    if (mode === 'no-assertion') return;
    if (mode === 'expected' || mode === 'unexpected-pass') test.fail();
    if (mode === 'corrupt') await info.attach('a11y-journey.v1.json', { body: Buffer.from('{}'), contentType: 'application/json' });
    if (mode === 'soft') { expect.soft(false, 'native soft failure').toBe(true); expect(true).toBe(true); return; }
    if (mode === 'retry') { expect(info.retry, 'first attempt fails').toBe(1); return; }
    await test.step('executed check', async () => expect(!['hard','early','expected'].includes(mode), 'native hard failure').toBe(true));
    if (mode === 'early') await test.step('unreached check', async () => expect(true).toBe(true));
  });
}
plain('outcomes missing', async ({}, info) => { info.annotations.push({ type: 'a11y-journey' }); expect(true).toBe(true); });
const lateTest = test.extend<{ late: void }>({ late: [async ({}, use) => { await use(); throw new Error('late teardown failure'); }, { auto: true }] });
lateTest('outcomes late', async ({ page, journey }) => { await page.setContent('<main>Root</main>'); await journey.start({ root: page.locator('main') }); expect(true).toBe(true); });
