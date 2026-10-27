import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import { createHash } from 'node:crypto';
import type { TestCase, TestResult, TestStep } from '@playwright/test/reporter';
import type { AttemptEvidence, FixtureEvidence, Issue, StepEvidence } from './model.js';
interface NativeRecord { step: TestStep; seq: number; ended: boolean }
const native = new WeakMap<TestResult, { entries: NativeRecord[]; index: WeakMap<TestStep, NativeRecord>; truncated: boolean }>();
export function recordStepBegin(result: TestResult, step: TestStep): void {
  let state = native.get(result);
  if (!state) { state = { entries: [], index: new WeakMap(), truncated: false }; native.set(result, state); }
  if (state.entries.length >= 10000) { state.truncated = true; return; }
  const entry = { step, seq: state.entries.length + 1, ended: false };
  state.entries.push(entry); state.index.set(step, entry);
}
export function recordStepEnd(result: TestResult, step: TestStep): void {
  const entry = native.get(result)?.index.get(step); if (entry) entry.ended = true;
}
export function parseFixtureEvidence(text: string): FixtureEvidence {
  const fail = () => { throw new Error('Invalid private journey handoff.'); };
  let value: any;
  try { value = JSON.parse(text); } catch { return fail(); }
  if (!value || value.version !== 1 || typeof value.started !== 'boolean' || value.capturePhase !== 'fixture-teardown' ||
    !value.observation || !Array.isArray(value.observation.observations) || value.observation.observations.length > 10000 ||
    typeof value.observation.complete !== 'boolean' || typeof value.observation.truncated !== 'boolean' ||
    !Array.isArray(value.observation.issues) || !Array.isArray(value.issues) || !value.runtime ||
    !['node','playwright','chromium','platform','arch'].every(k => typeof value.runtime[k] === 'string')) return fail();
  for (const issue of [...value.issues, ...value.observation.issues]) if (!issue || typeof issue.code !== 'string' || typeof issue.message !== 'string') return fail();
  let previous = 0;
  for (const observation of value.observation.observations) {
    if (!Number.isSafeInteger(observation.seq) || observation.seq <= previous || !['key','focus','removed'].includes(observation.kind)) return fail();
    previous = observation.seq;
    if (observation.kind === 'key' && !['Tab','Shift+Tab','Enter','Space','Escape'].includes(observation.key)) return fail();
    if (observation.target !== null && (!observation.target || typeof observation.target.ref !== 'string' || typeof observation.target.tag !== 'string' || !observation.target.attributes || Object.values(observation.target.attributes).some(v => typeof v !== 'string'))) return fail();
  }
  for (const kind of ['screenshot','ariaSnapshot']) {
    const artifact = value.artifacts?.[kind];
    if (!artifact || !['captured','empty','disabled','not-needed','unavailable'].includes(artifact.status) || (['captured','empty'].includes(artifact.status) && typeof artifact.path !== 'string')) return fail();
  }
  return value as FixtureEvidence;
}
export function collectAttempt(test: TestCase, result: TestResult): AttemptEvidence {
  const issues: Issue[] = [];
  const clip = (text: string) => { if (text.length > 16384) issues.push({ code: 'diagnostic-truncated', message: 'Native diagnostic/title clipped at 16 KiB.' }); return text.slice(0,16384); };
  const state = native.get(result);
  if (state?.truncated) issues.push({ code: 'native-steps-truncated', message: 'Native step buffer reached 10000 records.' });
  const steps: StepEvidence[] = (state?.entries ?? []).map(entry => ({ seq: entry.seq, parent: entry.step.parent ? state?.index.get(entry.step.parent)?.seq : undefined, category: entry.step.category, title: clip(entry.step.title), status: !entry.ended ? 'incomplete' : entry.step.error ? 'failed' : 'passed', error: entry.step.error ? clip(entry.step.error.message ?? entry.step.error.value ?? 'Native step error') : undefined, source: entry.step.location ? `${relative(process.cwd(), entry.step.location.file)}:${entry.step.location.line}` : undefined }));
  const attachments = result.attachments.filter(a => a.name === 'a11y-journey.v1.json');
  let fixture: FixtureEvidence | undefined;
  try {
    if (attachments.length !== 1) throw new Error(`Expected one private handoff; received ${attachments.length}.`);
    const attachment = attachments[0]!;
    fixture = parseFixtureEvidence(attachment.body ? attachment.body.toString('utf8') : readFileSync(attachment.path!, 'utf8'));
    issues.push(...fixture.issues, ...fixture.observation.issues);
  } catch (error) { issues.push({ code: 'handoff-failed', message: String(error) }); }
  if (fixture && fixture.captureStatus === 'passed' && result.status !== 'passed') issues.push({ code: 'late-failure', message: 'Final failure became visible after fixture teardown capture; failure artifacts were not captured at that later point.' });
  const assertions = steps.filter(step => step.category === 'expect');
  const actualStatus = result.status, expectedStatus = test.expectedStatus;
  return { id: createHash('sha256').update(JSON.stringify([test.parent.project()?.name ?? '', test.id, test.repeatEachIndex, result.retry])).digest('hex').slice(0,24), title: clip(test.title), project: test.parent.project()?.name ?? '', source: `${relative(process.cwd(),test.location.file)}:${test.location.line}`, retry: result.retry, repeat: test.repeatEachIndex, worker: result.workerIndex, actualStatus, expectedStatus, errors: result.errors.map(error => clip(error.message ?? error.value ?? error.stack ?? 'Native test error')), steps, assertions, fixture, issues, complete: !!fixture && fixture.observation.complete && issues.length === 0 && steps.every(step => step.status !== 'incomplete'), verifiedBehavior: actualStatus === 'passed' && expectedStatus === 'passed' && assertions.length > 0 && assertions.every(a => a.status === 'passed'), traces: result.attachments.filter(a => a.name === 'trace' && a.path).map(a => a.path!) };
}
