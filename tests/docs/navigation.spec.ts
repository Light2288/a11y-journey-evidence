import { test, expect, type Page, type Locator } from '@playwright/test';

async function openInteractivePage(page: Page, route: string) {
  await page.goto(route);
  // Public HTML can finish loading before VitePress hydrates its event handlers.
  // Vue sets this marker after mount; keep it test-only and tied to the pinned theme.
  await page.waitForFunction(() => Boolean(
    (document.getElementById('app') as (HTMLElement & { __vue_app__?: unknown }) | null)?.__vue_app__,
  ));
}

async function tabTo(page: Page, target: Locator) {
  await expect(target).toBeVisible();
  for (let count = 0; count < 50; count++) {
    if (await target.evaluate(element => element === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  await expect(target).toBeFocused();
}

test('live keyboard skip and main navigation reach recipe content', async ({ page }) => {
  await openInteractivePage(page, 'getting-started.html');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#VPContent')).toBeFocused();
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.querySelector('#VPContent')!.contains(document.activeElement))).toBe(true);
  await openInteractivePage(page, '');
  await tabTo(page, page.getByRole('navigation', { name: 'Main Navigation' }).getByRole('link', { name: 'Recipes', exact: true }));
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/recipes\/dialog\.html$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Dialog recipe' })).toBeVisible();
});

test('live local search selects a result and restores focus on dismissal', async ({ page }) => {
  await openInteractivePage(page, '');
  const button = page.getByRole('button', { name: 'Search', exact: true });
  await tabTo(page, button); await page.keyboard.press('Enter');
  const input = page.getByRole('searchbox', { name: 'Search documentation', exact: true });
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute('placeholder', 'Search');
  await input.fill('JourneyOptions');
  await expect(page.getByRole('listbox').getByRole('option').first()).toBeVisible();
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowUp'); await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/reference\/api\.html(?:#.*)?$/);
  await expect(input).toHaveCount(0);
  await tabTo(page, button); await page.keyboard.press('Enter');
  await input.fill('zzzzdocsmissing');
  await expect(page.getByText('No results for', { exact: false })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(input).toHaveCount(0); await expect(button).toBeFocused();
});

test('live mobile menu opens, closes and follows a recipe using keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await openInteractivePage(page, '');
  const button = page.getByRole('button', { name: 'mobile navigation', exact: true });
  await tabTo(page, button); await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Enter'); await expect(button).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  await tabTo(page, page.locator('#VPNavScreen').getByRole('link', { name: 'Recipes', exact: true }));
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/recipes\/dialog\.html$/);
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});

for (const width of [375, 1280]) {
  test(`live reading at ${width}px keeps code and images within the page`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
    for (const route of ['getting-started.html', 'recipes/form.html', 'evidence/dialog.html', 'evidence/form.html', 'reference/api.html']) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route).toBe(true);
      for (const image of await page.getByRole('main').getByRole('img').all()) {
        await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
        expect(await image.getAttribute('alt')).toBeTruthy();
      }
    }
    await page.screenshot({ path: info.outputPath(`reference-${width}.png`) });
  });
}

test('interactive checks wait for hydration with a delayed initial page module', async ({ page }) => {
  await page.route(/getting-started\.md\.[^/]+\.lean\.js$/, async route => {
    // Model the public host's asynchronous page-module load, independently of test speed.
    await new Promise(resolve => setTimeout(resolve, 400));
    await route.continue();
  });
  await openInteractivePage(page, 'getting-started.html');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#VPContent')).toBeFocused();
  const button = page.getByRole('button', { name: 'Search', exact: true });
  await tabTo(page, button);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('searchbox', { name: 'Search documentation', exact: true })).toBeFocused();
});
