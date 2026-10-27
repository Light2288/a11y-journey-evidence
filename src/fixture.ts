import { test as base } from '@playwright/test';
import { createRequire } from 'node:module';
import { beginObservation } from './observation.js';
import { captureFailureArtifacts, rootIssue } from './capture.js';
import type { FixtureEvidence, Issue, Journey, JourneyOptions, ObservationSession } from './model.js';
const require = createRequire(import.meta.url);
export const test = base.extend<{ journey: Journey }>({
  journey: [async ({ page, browser }, use, info) => {
    info.annotations.push({ type: 'a11y-journey', description: 'private-v1' });
    let options: JourneyOptions | undefined, session: ObservationSession | undefined, started = false;
    const issues: Issue[] = [];
    const journey: Journey = { async start(input) {
      try {
        if (started) throw new Error('journey.start may only be called once per test.');
        started = true;
        if (!input || !input.root || typeof input.root.page !== 'function') throw new Error('A native root Locator is required.');
        if (input.root.page() !== page) throw new Error('Root must belong to the fixture page.');
        for (const flag of ['screenshots', 'ariaSnapshots'] as const) if (input[flag] !== undefined && typeof input[flag] !== 'boolean') throw new Error(`${flag} must be boolean.`);
        const max = input.maxObservations ?? 1000;
        if (!Number.isInteger(max) || max < 1 || max > 10000) throw new Error('maxObservations must be an integer from 1 to 10000.');
        options = input;
        const rootProblem = await rootIssue(page, input.root);
        if (rootProblem && rootProblem.code !== 'root-missing') throw new Error(rootProblem.message);
        session = await beginObservation(page, { maxObservations: max });
      } catch (error) { issues.push({ code: 'invalid-configuration', message: String(error) }); throw error; }
    } };
    try { await use(journey); }
    finally {
      if (!started) issues.push({ code: 'not-started', message: 'Journey fixture requested but journey.start was never called.' });
      const observation = session ? await session.finish() : { observations: [], complete: false, truncated: false, issues: [{ code: 'observation-not-started', message: 'Observation did not start.' }] };
      const captured = await captureFailureArtifacts(page, options?.root, info, options ?? {});
      issues.push(...captured.issues);
      const evidence: FixtureEvidence = { version: 1, started, captureStatus: info.status, capturePhase: 'fixture-teardown', observation, artifacts: captured.artifacts, issues, runtime: { node: process.version, playwright: require('@playwright/test/package.json').version as string, chromium: browser.version(), platform: process.platform, arch: process.arch } };
      try { await info.attach('a11y-journey.v1.json', { body: Buffer.from(JSON.stringify(evidence)), contentType: 'application/json' }); }
      catch (error) { process.stderr.write(`Journey evidence handoff failed: ${String(error)}\n`); }
      for (const issue of issues) process.stderr.write(`Journey evidence ${issue.code}: ${issue.message}\n`);
    }
  }, { timeout: 15000 }],
});
