import { test, expect } from '@playwright/test';

test('live subpath home and direct getting-started route load their assets', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => errors.push(request.url()));
  for (const route of ['', 'getting-started.html']) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('main')).toContainText('0.1.0');
    await expect(page.getByRole('main')).toContainText(/experimental/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    for (const src of await page.locator('script[src], link[rel="stylesheet"]').evaluateAll(elements =>
      elements.map(element => element.getAttribute('src') ?? element.getAttribute('href')!))) {
      const asset = await page.request.get(new URL(src, page.url()).href);
      expect(asset.ok(), src).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

test('live subpath missing route returns 404 and recovers to home', async ({ page, baseURL }) => {
  expect((await page.goto('this-page-does-not-exist.html'))?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'PAGE NOT FOUND' })).toBeVisible();
  await page.getByRole('link', { name: 'go to home' }).click();
  await expect(page).toHaveURL(baseURL!);
  await expect(page.getByRole('main')).toContainText('0.1.0');
});

test('live subpath build metadata identifies the deployed source', async ({ request }) => {
  const response = await request.get('build-info.json');
  expect(response.status()).toBe(200);
  const info = await response.json();
  expect(info.packageVersion).toBe('0.1.0');
  expect(info.sourceCommit).toMatch(/^[a-f0-9]{40}$/);
  if (process.env.DOCS_EXPECTED_COMMIT) expect(info.sourceCommit).toBe(process.env.DOCS_EXPECTED_COMMIT);
});

test('built pages have resolving internal links, fragments and assets', async ({ page, baseURL }) => {
  test.skip(!!process.env.DOCS_BASE_URL, 'Full local build inventory');
  const { readdir } = await import('node:fs/promises');
  const routes = (await readdir('site/.vitepress/dist', { recursive: true })).filter(path => path.endsWith('.html') && path !== '404.html');
  const checked = new Set<string>();
  for (const route of routes) {
    expect((await page.goto(route))?.status(), route).toBe(200);
    const sourceURL = page.url();
    const links = await page.locator('a[href], img[src], script[src], link[rel="stylesheet"]').evaluateAll(elements =>
      elements.map(element => element.getAttribute('src') ?? element.getAttribute('href')!));
    for (const link of links) {
      const url = new URL(link, sourceURL);
      if (url.origin !== new URL(baseURL!).origin || checked.has(url.href)) continue;
      expect(url.pathname, link).toMatch(/^\/a11y-journey-evidence\//);
      const response = await page.request.get(url.href);
      expect(response.status(), url.href).toBe(200);
      if (url.hash) {
        await page.goto(url.href);
        expect(await page.evaluate(id => document.getElementById(id) !== null, decodeURIComponent(url.hash.slice(1))), url.href).toBe(true);
      }
      checked.add(url.href);
    }
  }
});
