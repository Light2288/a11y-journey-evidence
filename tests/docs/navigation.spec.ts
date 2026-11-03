import { test, expect, type Page, type Locator } from '@playwright/test';

async function tabTo(page: Page, target: Locator) {
  await expect(target).toBeVisible();
  for (let count = 0; count < 50; count++) {
    if (await target.evaluate(element => element === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  await expect(target).toBeFocused();
}

test('live keyboard skip and main navigation reach recipe content', async ({ page }) => {
  await page.goto('getting-started.html');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#VPContent')).toBeFocused();
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.querySelector('#VPContent')!.contains(document.activeElement))).toBe(true);
  await page.goto('');
  await tabTo(page, page.getByRole('navigation', { name: 'Main Navigation' }).getByRole('link', { name: 'Recipes', exact: true }));
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/recipes\/dialog\.html$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Dialog recipe' })).toBeVisible();
});

test('live local search selects a result and restores focus on dismissal', async ({ page }) => {
  await page.goto('');
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
  await page.goto('');
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
