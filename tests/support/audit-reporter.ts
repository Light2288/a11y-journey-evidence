import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { TestCase, TestResult } from '@playwright/test/reporter';
import { collectAttempt } from '../../dist/results.js';
export default class AuditReporter {
  attempts: unknown[] = [];
  onTestEnd(test: TestCase, result: TestResult) { if (test.annotations.some(a => a.type === 'a11y-journey')) this.attempts.push(collectAttempt(test, result)); }
  onEnd() { writeFileSync(join(process.env.AJE_CASE_OUTPUT!, 'audit.json'), JSON.stringify(this.attempts)); }
}
