import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { cp, mkdir, mkdtemp, readFile, readdir, realpath, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const expected = new Map([
  ['dialog correct', null],
  ['dialog escaping-focus', ['Forward containment boundary', 'Forward containment: focus returns to Continue']],
  ['dialog failed-restoration', ['Declared focus restoration', 'Restoration: focus returns to Open preferences']],
  ['form correct', null],
  ['form missing-error-association', ['Declared error associations', 'Association: Name describes its visible error']],
  ['form failed-error-focus', ['Declared invalid-submit focus', 'Error focus: Name is the first invalid field']],
  ['unselected control', null],
]);
function collect(native) {
  const cases = [];
  function visit(suite) {
    for (const spec of suite.specs ?? []) for (const test of spec.tests) cases.push({ ...test, title: spec.title });
    for (const child of suite.suites ?? []) visit(child);
  }
  for (const suite of native.suites ?? []) visit(suite);
  return cases;
}
export function assertExampleResults(nativeReport) {
  const cases = collect(nativeReport);
  assert.deepEqual(cases.map(test => test.title).sort(), [...expected.keys()].sort(), 'exact documentation journeys');
  for (const test of cases) {
    const failure = expected.get(test.title);
    const status = failure ? 'failed' : 'passed';
    assert.equal(test.expectedStatus, status, `${test.title}: expected status`);
    assert.equal(test.results.length, 1, `${test.title}: one attempt`);
    const result = test.results[0];
    assert.equal(result.status, status, `${test.title}: actual status`);
    if (failure) {
      assert.ok(result.errors?.[0]?.message.includes(failure[1]), `${test.title}: intended native diagnostic`);
      const steps = result.steps ?? [];
      const index = steps.findIndex(step => step.title === failure[0]);
      assert.ok(index >= 0 && steps[index].error, `${test.title}: intended named failing step`);
      assert.ok(steps.slice(0, index).every(step => !step.error), `${test.title}: preceding steps pass`);
    } else assert.equal(result.errors?.length ?? 0, 0, `${test.title}: no errors`);
  }
}

async function verify() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const consumer = await mkdtemp(join(tmpdir(), 'aje-docs-'));
  const destination = join(root, '.artifacts/docs-examples');
  const env = { ...process.env, PATH: `${dirname(process.execPath)}${process.platform === 'win32' ? ';' : ':'}${process.env.PATH}` };
  delete env.FORCE_COLOR; delete env.NO_COLOR;
  try {
    await cp(join(root, 'examples/documentation'), consumer, { recursive: true,
      filter: path => !['node_modules', '.artifacts', 'package-lock.json'].includes(path.split(sep).at(-1)) });
    for (const args of [
      ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--registry=https://registry.npmjs.org'],
      ['run', 'typecheck'], ['test'],
    ]) execFileSync('npm', args, { cwd: consumer, env, stdio: 'inherit' });
    const require = createRequire(join(consumer, 'package.json'));
    const installed = require.resolve('a11y-journey-evidence/reporter');
    assert.ok(installed.startsWith((await realpath(join(consumer, 'node_modules'))) + sep));
    const lock = JSON.parse(await readFile(join(consumer, 'package-lock.json'), 'utf8'));
    const entry = lock.packages['node_modules/a11y-journey-evidence'];
    assert.equal(entry.version, '0.1.0');
    assert.equal(entry.resolved, 'https://registry.npmjs.org/a11y-journey-evidence/-/a11y-journey-evidence-0.1.0.tgz');
    const metadata = JSON.parse(execFileSync('npm', ['view', 'a11y-journey-evidence@0.1.0', 'dist', '--json', '--registry=https://registry.npmjs.org'], { env, encoding: 'utf8' }));
    assert.equal(entry.integrity, metadata.integrity);
    const native = JSON.parse(await readFile(join(consumer, '.artifacts/native.json'), 'utf8'));
    assertExampleResults(native);
    const cases = collect(native);
    const payloads = [];
    for (const testcase of cases) {
      const attachments = testcase.results[0].attachments ?? [];
      const handoff = attachments.filter(item => item.name === 'a11y-journey.v1.json');
      assert.equal(handoff.length, testcase.title === 'unselected control' ? 0 : 1);
      if (handoff.length) {
        const item = handoff[0];
        const payload = JSON.parse(item.path ? await readFile(item.path, 'utf8') : Buffer.from(item.body, 'base64').toString());
        assert.equal(payload.started, true); assert.equal(payload.observation.complete, true);
        payloads.push(payload);
      }
    }
    assert.ok((await stat(join(consumer, '.artifacts/html/index.html'))).isFile());
    const runs = await readdir(join(consumer, '.artifacts/evidence'));
    assert.equal(runs.length, 1);
    const report = await readFile(join(consumer, '.artifacts/evidence', runs[0], 'report.md'), 'utf8');
    assert.match(report, /Selected attempts: 6/); assert.doesNotMatch(report, /unselected control/);
    const proof = {
      packageVersion: entry.version, integrity: entry.integrity, resolved: entry.resolved,
      installedModule: installed, freshExternalDirectory: true,
      cases: cases.map(test => ({ title: test.title, expected: test.expectedStatus, actual: test.results[0].status })),
      fixtureComposition: true, nativeAndEvidenceReports: true, controlOmitted: true,
      runtime: payloads[0].runtime, npm: execFileSync('npm', ['--version'], { env, encoding: 'utf8' }).trim(),
      typescript: require('typescript/package.json').version,
      report: `evidence/${runs[0]}/report.md`, generatedAt: new Date().toISOString(),
    };
    await writeFile(join(consumer, '.artifacts/proof.json'), JSON.stringify(proof, null, 2) + '\n');
    console.log('Documentation examples verified: 3 actual passes, 4 intended actual failures; npm 0.1.0; fixture composition and native/evidence reports.');
  } finally {
    // Retain diagnostic artifacts even when a verification assertion fails.
    let artifactsExist = true;
    try { await stat(join(consumer, '.artifacts')); }
    catch (error) { if (error.code === 'ENOENT') artifactsExist = false; else throw error; }
    try {
      if (artifactsExist) {
        await mkdir(dirname(destination), { recursive: true });
        await rm(destination, { recursive: true, force: true });
        await cp(join(consumer, '.artifacts'), destination, { recursive: true });
      }
    } finally { await rm(consumer, { recursive: true, force: true }); }
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  verify().catch(error => { console.error('Documentation examples verification failed:', error); process.exitCode = 1; });
}
