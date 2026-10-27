import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const require = createRequire(import.meta.url);
export async function runCase(title: string, options: { args?: string[]; env?: Record<string, string>; config?: string } = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'aje-case-'));
  const jsonPath = join(directory, 'native.json');
  const env: NodeJS.ProcessEnv = { ...process.env, PLAYWRIGHT_JSON_OUTPUT_FILE: jsonPath, PLAYWRIGHT_HTML_OUTPUT_DIR: join(directory, 'html'), AJE_CASE_OUTPUT: directory, ...options.env };
  delete env.FORCE_COLOR;
  const child = spawn(process.execPath, [require.resolve('@playwright/test/cli'), 'test', '--config', options.config ?? resolve('tests/cases/playwright.config.ts'), '--grep', title.replace(/^\^/, ''), '--output', join(directory, 'results'), ...options.args ?? []], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '', stderr = '';
  child.stdout.on('data', data => { stdout += data; }); child.stderr.on('data', data => { stderr += data; });
  const exitCode = await new Promise<number>((res, rej) => { child.on('error', rej); child.on('close', code => res(code ?? -1)); });
  const native = JSON.parse(await readFile(jsonPath, 'utf8'));
  const tests: any[] = [];
  const visit = (suite: any) => { for (const spec of suite.specs ?? []) for (const test of spec.tests) tests.push({ ...test, title: spec.title }); for (const sub of suite.suites ?? []) visit(sub); };
  for (const suite of native.suites) visit(suite);
  const payloads: any[] = [];
  for (const test of tests) for (const result of test.results) for (const attachment of result.attachments ?? []) {
    if (attachment.name === 'a11y-journey.v1.json') payloads.push(JSON.parse(attachment.path ? await readFile(attachment.path, 'utf8') : Buffer.from(attachment.body, 'base64').toString()));
  }
  return { exitCode, stdout, stderr, native, tests, payloads, directory };
}
