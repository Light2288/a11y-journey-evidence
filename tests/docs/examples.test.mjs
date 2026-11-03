import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertExampleResults } from '../../scripts/verify-docs-examples.mjs';

function report() {
  const cases = [
    ['dialog correct', 'passed'],
    ['dialog escaping-focus', 'failed', 'Forward containment boundary', 'Forward containment: focus returns to Continue'],
    ['dialog failed-restoration', 'failed', 'Declared focus restoration', 'Restoration: focus returns to Open preferences'],
    ['form correct', 'passed'],
    ['form missing-error-association', 'failed', 'Declared error associations', 'Association: Name describes its visible error'],
    ['form failed-error-focus', 'failed', 'Declared invalid-submit focus', 'Error focus: Name is the first invalid field'],
    ['unselected control', 'passed'],
  ];
  return { suites: [{ specs: cases.map(([title, status, step, message]) => ({ title, tests: [{
    expectedStatus: status, results: [{ status, errors: message ? [{ message }] : [],
      steps: [{ title: 'Setup: load synthetic example' }, ...(step ? [{ title: step, error: { message } }] : [])] }],
  }] })) }] };
}

test('accepts actual correct passes and intended assertion failures', () => assert.doesNotThrow(() => assertExampleResults(report())));
test('rejects unrelated setup failure even when Playwright expected failure', () => {
  const input = report(); const result = input.suites[0].specs[1].tests[0].results[0];
  result.errors = [{ message: 'Navigation timed out' }]; result.steps = [{ title: 'Setup', error: result.errors[0] }];
  assert.throws(() => assertExampleResults(input));
});
test('rejects unexpected pass', () => {
  const input = report(); input.suites[0].specs[1].tests[0].results[0].status = 'passed';
  assert.throws(() => assertExampleResults(input));
});
test('rejects a missing journey', () => {
  const input = report(); input.suites[0].specs.pop(); assert.throws(() => assertExampleResults(input));
});
test('rejects earlier failed step even if final diagnostic looks intended', () => {
  const input = report(); input.suites[0].specs[1].tests[0].results[0].steps[0].error = { message: 'Setup failed' };
  assert.throws(() => assertExampleResults(input));
});
