import { test, expect } from '@playwright/test';
import { cp, mkdtemp, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { runCase } from '../support/run-case.js';
async function reports(directory: string): Promise<string[]> {
  const paths: string[] = [];
  for (const item of await readdir(directory, { withFileTypes:true })) {
    if (item.isDirectory()) paths.push(...await reports(join(directory,item.name)));
    else if (item.name==='report.md') paths.push(join(directory,item.name));
  }
  return paths;
}
test('bundle stays portable and explains failure without a trace', async () => {
  const run=await runCase('outcomes hard$',{env:{AJE_REPORTER:'1'}});
  const paths=await reports(run.directory);
  expect(paths).toHaveLength(1);
  const destination=join(await mkdtemp(join(tmpdir(),'aje-moved-')),'bundle');
  await cp(dirname(paths[0]!),destination,{recursive:true});
  const text=await readFile(join(destination,'report.md'),'utf8');
  expect(text).toContain('native hard failure');
  expect(text).toContain('fixture-teardown');
  expect(text).toContain('Keyboard/focus observations');
  expect(text).not.toContain(run.directory);
  const links=[...text.matchAll(/\]\((assets\/[^)]+)\)/g)].map(m=>m[1]!);
  expect(links.length).toBeGreaterThanOrEqual(2);
  for(const link of links) expect((await stat(join(destination,link))).isFile()).toBe(true);
});
test('bundle reports write failure through stderr without changing native test status',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'aje-blocked-'));const blocked=join(directory,'file');await writeFile(blocked,'blocked');
  const run=await runCase('outcomes parallel-one$',{env:{AJE_REPORTER:'1',AJE_REPORTER_DIR:blocked}});
  expect(run.exitCode).toBe(1);
  expect(run.tests[0].results[0].status).toBe('passed');
  expect(run.stderr).toMatch(/evidence report write failed/i);
});
test('bundle exposes missing and corrupt handoff as evidence failure',async()=>{
  for(const mode of ['missing','corrupt']){
    const run=await runCase(`outcomes ${mode}$`,{env:{AJE_REPORTER:'1'}});
    expect(run.exitCode).toBe(1);
    const text=await readFile((await reports(run.directory))[0]!,'utf8');
    expect(text).toContain('handoff-failed');
    expect(text).toContain('incomplete');
  }
});

test('bundle form failures remain understandable with moved scoped artifacts', async () => {
  const run = await runCase('form ', { config: resolve('examples/package/playwright.config.ts') });
  expect(run.exitCode).toBe(0);
  const paths = await reports(run.directory);
  expect(paths).toHaveLength(1);
  const destination = join(await mkdtemp(join(tmpdir(), 'aje-form-moved-')), 'bundle');
  await cp(dirname(paths[0]!), destination, { recursive: true });
  const text = await readFile(join(destination, 'report.md'), 'utf8');
  for (const detail of ['Association: Name describes its visible error', 'Error focus: Name is the first invalid field',
    'actual: failed', 'expected: failed', 'fixture-teardown', 'Capture start:', '"id":"name"', '"id":"submit"']) expect(text).toContain(detail);
  expect(text).not.toContain(run.directory);
  const links = [...text.matchAll(/\]\((assets\/[^)]+)\)/g)].map(m => m[1]!);
  expect(links.filter(link => link.endsWith('aria.yml'))).toHaveLength(2);
  for (const link of links) {
    expect((await stat(join(destination, link))).isFile()).toBe(true);
    if (link.endsWith('aria.yml')) {
      const snapshot = await readFile(join(destination, link), 'utf8');
      expect(snapshot).toContain('Team request');
      expect(snapshot).toContain('Enter a name.');
      expect(snapshot).not.toContain('Preferences');
    }
  }
});
