import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../../scripts/verify-consumer.mjs', import.meta.url));

function rejectSource(args: string[], diagnostic: RegExp): void {
  const sandbox = mkdtempSync(join(tmpdir(), 'aje-source-test-'));
  const invoked = join(sandbox, 'npm-invoked');
  // npm is the external boundary: invalid input must not reach packing or installation.
  writeFileSync(join(sandbox, 'npm'), '#!/bin/sh\nprintf invoked > "$AJE_TEST_NPM_INVOCATION"\nprintf "unexpected npm invocation\\n" >&2\nexit 74\n', { mode: 0o755 });
  try {
    const result = spawnSync(process.execPath, [script, ...args], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${sandbox}${delimiter}${process.env.PATH}`, AJE_TEST_NPM_INVOCATION: invoked },
      timeout: 10000,
    });
    assert.ifError(result.error);
    assert.notEqual(result.status, 0, JSON.stringify(args));
    assert.match(result.stderr, diagnostic, JSON.stringify(args));
    assert.equal(existsSync(invoked), false, 'invalid source reached npm');
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
}

test('consumer rejects conflicting or malformed source arguments before npm runs', () => {
  for (const [args, diagnostic] of [
    [['--unknown'], /unknown|usage|source/i],
    [['--tarball'], /missing.*tarball|tarball.*requires/i],
    [['--published-version'], /missing.*version|version.*requires/i],
    [['--published-version', '^0.1.0'], /exact.*version/i],
    [['--published-version', 'latest'], /exact.*version/i],
    [['--published-version', '0.2.0'], /match.*release|release.*match/i],
    [['--tarball', 'unused.tgz', '--published-version', '0.1.0'], /one.*source|conflict|either/i],
    [['--published-version', '0.1.0', 'extra'], /unknown|usage|source/i],
  ] as [string[], RegExp][]) rejectSource(args, diagnostic);
});

test('consumer rejects a missing explicit tarball without repacking', () => {
  const sandbox = mkdtempSync(join(tmpdir(), 'aje-missing-archive-'));
  try {
    rejectSource(['--tarball', join(sandbox, 'missing.tgz')], /tarball.*(unavailable|not found|missing)/i);
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
});
