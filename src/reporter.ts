import { writeBundle } from './bundle.js';
import type { Reporter, TestCase, TestResult, TestStep, FullResult } from '@playwright/test/reporter';
import { collectAttempt, recordStepBegin, recordStepEnd } from './results.js';
import type { AttemptEvidence, JourneyReporterOptions } from './model.js';
export default class JourneyReporter implements Reporter {
  private attempts: AttemptEvidence[] = [];
  private readonly options: JourneyReporterOptions;
  constructor(options: JourneyReporterOptions = {}) { this.options = options; }
  onStepBegin(_test: TestCase, result: TestResult, step: TestStep): void { recordStepBegin(result, step); }
  onStepEnd(_test: TestCase, result: TestResult, step: TestStep): void { recordStepEnd(result, step); }
  onTestEnd(test: TestCase, result: TestResult): void {
    if (test.annotations.some(annotation => annotation.type === 'a11y-journey')) this.attempts.push(collectAttempt(test, result));
  }
  async onEnd(result: FullResult): Promise<{ status?: FullResult['status'] } | void> {
    try {
      const bundle = await writeBundle(this.attempts, this.options);
      process.stdout.write(`Journey evidence: ${bundle.reportPath}\n`);
      if (bundle.failed) {
        process.stderr.write('Journey evidence incomplete: handoff or artifact copy failed.\n');
        if (result.status === 'passed') return { status: 'failed' };
      }
    } catch (error) {
      process.stderr.write(`Journey evidence report write failed: ${String(error)}\n`);
      if (result.status === 'passed') return { status: 'failed' };
    }
  }
}
