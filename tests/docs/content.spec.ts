import { test, expect } from '@playwright/test';
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import { join, resolve } from 'node:path';
const root = resolve('.');

test('live walkthroughs expose synthetic diagnostics, screenshot and scoped ARIA evidence', async ({ page }) => {
  for (const [route, diagnostic, semantics] of [
    ['evidence/dialog.html', 'Forward containment: focus returns to Continue', 'Preferences'],
    ['evidence/form.html', 'Association: Name describes its visible error', 'Team request'],
  ]) {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.getByRole('main')).toContainText(diagnostic);
    await expect(page.getByRole('main')).toContainText('fixture-teardown');
    await expect(page.locator('pre').filter({ hasText: semantics })).toBeVisible();
    const image = page.getByRole('main').getByRole('img');
    await expect(image).toHaveCount(1);
    expect(await image.getAttribute('alt')).toBeTruthy();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
});

test('public build excludes run artifacts, private payloads and local paths', async () => {
  test.skip(!!process.env.DOCS_BASE_URL, 'Local publication-boundary check');
  const output = join(root, 'site/.vitepress/dist');
  const paths = await readdir(output, { recursive: true });
  for (const path of paths) {
    expect(path).not.toMatch(/(^|\/)(?:\.artifacts|superpowers|node_modules|src)(\/|$)|\.zip$|native\.json$|a11y-journey\.v1\.json$/);
    if (/\.(?:html|js|json|txt|css)$/.test(path)) {
      const content = await readFile(join(output, path), 'utf8');
      expect(content, path).not.toMatch(/\/Users\/|\/private\/var\/folders\//);
    }
  }
});

test('sample imports keep hostile evidence literal after a production build', async ({ page }) => {
  test.skip(!!process.env.DOCS_BASE_URL, 'Adversarial fixture is local only');
  test.setTimeout(60_000);
  const temporary = await mkdtemp(join(root, '.artifacts/docs-adversarial-'));
  let server: ReturnType<typeof spawn> | undefined;
  try {
    await cp(join(root, 'site'), join(temporary, 'site'), { recursive: true,
      filter: path => !['dist', 'cache'].includes(path.split('/').at(-1)!) });
    await cp(join(root, 'examples/documentation'), join(temporary, 'examples/documentation'), { recursive: true,
      filter: path => !['node_modules', '.artifacts'].includes(path.split('/').at(-1)!) });
    const hostile = '</code></pre><img src=x onerror="window.__evidenceInjected=true">\n[attack](https://example.invalid/injected)\n```\n<script>window.__evidenceInjected=true</script>\n{{ 7 * 7 }}';
    await writeFile(join(temporary, 'site/samples/dialog-diagnostic.txt'), hostile);
    const cli = join(root, 'node_modules/vitepress/bin/vitepress.js');
    await promisify(execFile)(process.execPath, [cli, 'build', join(temporary, 'site')], { cwd: root });
    server = spawn(process.execPath, [cli, 'preview', join(temporary, 'site'), '--port', '4174'], { cwd: root, stdio: 'ignore' });
    const url = 'http://localhost:4174/a11y-journey-evidence/evidence/dialog.html';
    await expect.poll(async () => {
      try { return (await fetch(url)).status; } catch { return 0; }
    }, { timeout: 15_000 }).toBe(200);
    await page.goto(url);
    await expect(page.locator('pre').filter({ hasText: '[attack]' })).toHaveText(hostile);
    await expect(page.locator('img[src="x"], a[href="https://example.invalid/injected"]')).toHaveCount(0);
    expect(await page.evaluate(() => '__evidenceInjected' in window)).toBe(false);
  } finally {
    if (server && server.exitCode === null) {
      server.kill(); await new Promise<void>(resolve => server!.once('close', () => resolve()));
    }
    await rm(temporary, { recursive: true, force: true });
  }
});
