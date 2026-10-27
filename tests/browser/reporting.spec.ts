import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runCase } from '../support/run-case.js';
async function outcomes(title: string, args: string[] = []) {
  const run = await runCase(title, { args, env: { AJE_REPORTER: '1' } });
  return { ...run, attempts: JSON.parse(await readFile(join(run.directory, 'audit.json'), 'utf8')) as any[] };
}
test('outcomes preserves native hard soft and early failures', async () => {
  for (const mode of ['hard','soft','early']) {
    const run = await outcomes(`outcomes ${mode}$`);
    expect(run.exitCode).toBe(1);
    expect(run.attempts[0].actualStatus).toBe('failed');
    expect(run.attempts[0].assertions.some((a: any) => a.error)).toBe(true);
    expect(run.attempts[0].steps.some((s: any) => s.title === 'unreached check')).toBe(false);
  }
});
test('outcomes keeps expected failures unexpected passes and assertion-free tests honest', async () => {
  const expected = await outcomes('outcomes expected$');
  expect(expected.exitCode).toBe(0);
  expect(expected.attempts[0].actualStatus).toBe('failed');
  expect(expected.attempts[0].expectedStatus).toBe('failed');
  expect(expected.attempts[0].verifiedBehavior).toBe(false);
  const unexpected = await outcomes('outcomes unexpected-pass$');
  expect(unexpected.exitCode).toBe(1);
  expect(unexpected.attempts[0].actualStatus).toBe('passed');
  expect(unexpected.attempts[0].expectedStatus).toBe('failed');
  const empty = await outcomes('outcomes no-assertion$');
  expect(empty.attempts[0].assertions).toHaveLength(0);
  expect(empty.attempts[0].verifiedBehavior).toBe(false);
});
test('outcomes retains retry attempts concurrency and repeat identity', async () => {
  const retry = await outcomes('outcomes retry$', ['--retries','1']);
  expect(retry.exitCode).toBe(0);
  expect(retry.attempts.map(a => a.actualStatus)).toEqual(['failed','passed']);
  expect(retry.attempts.map(a => a.retry)).toEqual([0,1]);
  const parallel = await outcomes('outcomes parallel-', ['--workers','2']);
  expect(parallel.attempts).toHaveLength(2);
  for (const attempt of parallel.attempts) {
    const ids = attempt.fixture.observation.observations.map((o: any) => o.target?.attributes.id).filter(Boolean);
    expect(ids.every((id: string) => id === attempt.title.replace('outcomes ', ''))).toBe(true);
  }
  const repeated = await outcomes('outcomes repeat$', ['--repeat-each','2']);
  expect(repeated.attempts.map(a => a.repeat).sort()).toEqual([0,1]);
});
test('outcomes exposes missing corrupt handoffs and late failure timing', async () => {
  for (const mode of ['missing','corrupt']) {
    const run = await outcomes(`outcomes ${mode}$`);
    expect(run.attempts[0].complete).toBe(false);
    expect(run.attempts[0].issues.some((i: any) => i.code === 'handoff-failed')).toBe(true);
  }
  const late = await outcomes('outcomes late$');
  expect(late.attempts[0].actualStatus).toBe('failed');
  expect(late.attempts[0].issues.some((i: any) => i.code === 'late-failure')).toBe(true);
  expect(late.attempts[0].errors.join(' ')).toContain('late teardown failure');
});
