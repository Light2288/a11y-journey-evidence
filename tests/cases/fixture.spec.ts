import { mkdir } from 'node:fs/promises';
import { test } from '../../dist/index.js';
import { test as plain, expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
for (const mode of ['default','no-screenshot','no-snapshot','neither','missing','ambiguous','closed','wrong-page','frame','bad-limit','twice','not-started','capture-error']) {
  test(`fixture ${mode}`, async ({ page, journey, context }, info) => {
    await page.setContent('<main id="root"><button>Open</button></main>');
    if (mode === 'not-started') return;
    let root: Locator = page.locator('#root');
    if (mode === 'wrong-page') { const other = await context.newPage(); await other.setContent('<main>Other</main>'); root = other.locator('main'); }
    if (mode === 'frame') { await page.setContent('<iframe srcdoc="<main>Frame</main>"></iframe>'); root = page.frameLocator('iframe').locator('main'); }
    await journey.start({ root, screenshots: !['no-screenshot','neither'].includes(mode), ariaSnapshots: !['no-snapshot','neither'].includes(mode), maxObservations: mode === 'bad-limit' ? 0 : 1000 });
    if (mode === 'capture-error') await mkdir(info.outputPath('journey-screenshot.png'), { recursive: true });
    if (mode === 'missing') await root.evaluate(el => el.remove());
    if (mode === 'ambiguous') await root.evaluate(el => el.after(el.cloneNode(true)));
    if (mode === 'closed') await page.close();
    if (mode === 'twice') await journey.start({ root });
    expect(false, 'original assertion failure').toBe(true);
  });
}
plain('fixture unselected', async ({ page }) => { await page.setContent('<button>Plain</button>'); expect(true).toBe(true); });
