import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFixtureEvidence } from '../../dist/results.js';
test('rejects malformed private handoff instead of claiming complete capture', () => {
  for (const text of ['{', '{}', '{"version":99}', '{"version":1,"started":true,"observation":{}}']) {
    assert.throws(() => parseFixtureEvidence(text), /handoff/i);
  }
});
