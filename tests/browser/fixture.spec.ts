import { test, expect } from '@playwright/test';
import { runCase } from '../support/run-case.js';
for (const [mode, screenshot, snapshot] of [['default','captured','captured'],['no-screenshot','disabled','captured'],['no-snapshot','captured','disabled'],['neither','disabled','disabled']]) {
  test(`fixture captures ${mode}`, async () => {
    const run = await runCase(`^fixture ${mode}$`);
    expect(run.exitCode).toBe(1);
    expect(run.payloads).toHaveLength(1);
    expect(run.payloads[0].artifacts.screenshot.status).toBe(screenshot);
    expect(run.payloads[0].artifacts.ariaSnapshot.status).toBe(snapshot);
    expect(run.tests[0].results[0].errors[0].message).toContain('original assertion failure');
  });
}
for (const [mode, code] of [['missing','root-missing'],['ambiguous','root-ambiguous'],['closed','page-closed'],['wrong-page','invalid-configuration'],['frame','invalid-configuration'],['bad-limit','invalid-configuration'],['twice','invalid-configuration']]) {
  test(`fixture discloses ${mode}`, async () => {
    const run = await runCase(`^fixture ${mode}$`);
    expect(run.exitCode).toBe(1);
    expect(run.payloads).toHaveLength(1);
    const issues = [...run.payloads[0].issues, ...run.payloads[0].observation.issues];
    expect(issues.some((i: any) => i.code === code)).toBe(true);
    if (['missing','ambiguous','closed'].includes(mode)) {
      expect(run.payloads[0].artifacts.ariaSnapshot.status).toBe('unavailable');
      expect(run.tests[0].results[0].errors[0].message).toContain('original assertion failure');
    }
  });
}
test('fixture records not-started and leaves unselected tests alone', async () => {
  const selected = await runCase('^fixture not-started$');
  expect(selected.payloads[0].started).toBe(false);
  expect(selected.payloads[0].issues.some((i: any) => i.code === 'not-started')).toBe(true);
  const unselected = await runCase('^fixture unselected$');
  expect(unselected.exitCode).toBe(0);
  expect(unselected.payloads).toHaveLength(0);
});

test('fixture capture write error preserves the assertion and other capture',async()=>{
  const run=await runCase('fixture capture-error$');
  expect(run.exitCode).toBe(1);
  expect(run.tests[0].results[0].errors[0].message).toContain('original assertion failure');
  expect(run.payloads[0].artifacts.screenshot.status).toBe('unavailable');
  expect(run.payloads[0].artifacts.ariaSnapshot.status).toBe('captured');
  expect(run.payloads[0].issues.some((i:any)=>i.code==='capture-failed')).toBe(true);
});
