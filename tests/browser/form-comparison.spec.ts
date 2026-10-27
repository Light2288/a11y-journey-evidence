import { test, expect } from '@playwright/test';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { FixtureEvidence } from '../../dist/model.js';
import { runCase } from '../support/run-case.js';

async function attachmentText(result: { attachments: { name: string; path?: string; body?: string }[] }, name: string): Promise<string> {
  const attachment = result.attachments.find(a => a.name === name);
  expect(attachment, name).toBeDefined();
  return attachment!.path ? readFile(attachment!.path, 'utf8') : Buffer.from(attachment!.body!, 'base64').toString('utf8');
}

const sharedSteps = ['Keyboard submission', 'Visible errors and invalid states', 'Declared error associations',
  'Declared invalid-submit focus', 'Keyboard correction and successful resubmission'];

for (const mode of ['package', 'stock']) {
  test(`form-comparison ${mode} reaches precisely the intended failures`, async () => {
    const run = await runCase('form ', { config: resolve(`examples/${mode}/playwright.config.ts`) });
    expect(run.exitCode, run.stderr).toBe(0);
    expect(run.tests.map(t => t.title).sort()).toEqual(['form correct', 'form failed-error-focus', 'form missing-error-association']);
    expect(run.tests.find(t => t.title === 'form correct').results[0].status).toBe('passed');
    for (const [variant, failedIndex, message, focusId] of [
      ['missing-error-association', 2, 'Association: Name describes its visible error', 'name'],
      ['failed-error-focus', 3, 'Error focus: Name is the first invalid field', 'submit'],
    ] as const) {
      const broken = run.tests.find(t => t.title === `form ${variant}`);
      const result = broken.results[0];
      expect(broken.expectedStatus).toBe('failed');
      expect(result.status).toBe('failed');
      expect(result.errors[0].message).toContain(message);
      const steps = result.steps as { title: string; error?: unknown }[];
      expect(steps.map(s => s.title)).toEqual(['Setup: load synthetic form', ...sharedSteps.slice(0, failedIndex + 1)]);
      expect(steps.slice(0, -1).every(s => !s.error)).toBe(true);
      expect(steps.at(-1)!.error).toBeDefined();
      expect(result.attachments.some((a: { name: string }) => a.name === 'trace')).toBe(true);
      if (mode === 'package') {
        const payload = JSON.parse(await attachmentText(result, 'a11y-journey.v1.json')) as FixtureEvidence;
        expect(payload.capturePhase).toBe('fixture-teardown');
        expect(payload.captureStatus).toBe('failed');
        expect(payload.issues).toEqual([]);
        expect(payload.observation.complete).toBe(true);
        const focus = payload.observation.observations.filter(o => o.kind === 'focus').at(-1)!.target!;
        expect(focus.attributes.id).toBe(focusId);
        if (variant === 'missing-error-association') {
          expect(focus.attributes['aria-invalid']).toBe('true');
          expect(focus.attributes).not.toHaveProperty('aria-describedby');
        }
        for (const artifact of Object.values(payload.artifacts)) {
          expect(artifact.status).toBe('captured');
          expect(Number.isFinite(Date.parse(artifact.startedAt!))).toBe(true);
          expect(Number.isFinite(Date.parse(artifact.finishedAt!))).toBe(true);
          expect((await stat(artifact.path!)).size).toBeGreaterThan(0);
        }
        const snapshot = await readFile(payload.artifacts.ariaSnapshot.path!, 'utf8');
        expect(snapshot).toContain('Team request');
        expect(snapshot).toContain('Enter a name.');
        expect(snapshot).not.toContain('Preferences');
      } else {
        const focus = JSON.parse(await attachmentText(result, 'stock-focus'));
        expect(focus.id).toBe(focusId);
        if (variant === 'missing-error-association') {
          expect(focus.attributes['aria-invalid']).toBe('true');
          expect(focus.attributes).not.toHaveProperty('aria-describedby');
        }
        expect(result.attachments.some((a: { name: string }) => a.name === 'stock-screenshot')).toBe(true);
        const snapshot = await attachmentText(result, 'stock-aria');
        expect(snapshot).toContain('Team request');
        expect(snapshot).toContain('Enter a name.');
        expect(snapshot).not.toContain('Preferences');
        const timing = JSON.parse(await attachmentText(result, 'stock-capture-timing'));
        expect(timing.map((capture: { status: string }) => capture.status)).toEqual(['captured', 'captured', 'captured']);
        expect(timing.every((capture: { phase: string; startedAt: string; finishedAt: string }) =>
          capture.phase === 'afterEach' && Number.isFinite(Date.parse(capture.startedAt)) && Number.isFinite(Date.parse(capture.finishedAt)))).toBe(true);
      }
    }
    expect(run.payloads).toHaveLength(mode === 'package' ? 3 : 0);
  });

  test(`form-comparison ${mode} isolates concurrent combined runs`, async () => {
    const config = resolve(`examples/${mode}/playwright.config.ts`);
    const runs = await Promise.all([runCase('dialog|form', { config }), runCase('dialog|form', { config })]);
    expect(new Set(runs.map(r => r.directory)).size).toBe(2);
    for (const run of runs) {
      expect(run.exitCode, run.stderr).toBe(0);
      expect(run.tests).toHaveLength(6);
      expect((await stat(join(run.directory, 'html/index.html'))).isFile()).toBe(true);
      expect(run.payloads).toHaveLength(mode === 'package' ? 6 : 0);
      for (const testcase of run.tests) {
        const actual = testcase.title.endsWith('correct') ? 'passed' : 'failed';
        expect(testcase.expectedStatus).toBe(actual);
        expect(testcase.results[0].status).toBe(actual);
        if (!testcase.title.startsWith('form ') || actual === 'passed') continue;
        const result = testcase.results[0];
        const snapshot = mode === 'package'
          ? await readFile((JSON.parse(await attachmentText(result, 'a11y-journey.v1.json')) as FixtureEvidence).artifacts.ariaSnapshot.path!, 'utf8')
          : await attachmentText(result, 'stock-aria');
        expect(snapshot).toContain('Team request');
        expect(snapshot).not.toContain('Preferences');
      }
    }
  });
}
