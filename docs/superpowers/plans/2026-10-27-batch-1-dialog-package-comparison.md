# Batch 1: Dialog Package Comparison Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` through `personal-workflows:spec-implement`. Execute tasks in order using the checkbox steps below. The user selected Native execution.

**Goal:** Deliver an installable dialog evidence package and a fair runnable comparison with stock Playwright.

**Architecture:** A test-scoped fixture observes one main document and captures failure artifacts. A reporter combines private fixture evidence with documented native results, then writes a portable Markdown bundle. Shared dialog fixtures and native journey assertions keep the package and stock comparison equivalent.

**Tech Stack:** TypeScript, Playwright Test, Chromium, npm, Node’s built-in test runner.

**Spec:** [Approved Batch 1 specification](/Users/davide/Personal/Projects/a11y-journey-evidence/docs/superpowers/specs/2026-10-27-batch-1-dialog-package-comparison.md)

**Slug:** `batch-1-dialog-package-comparison`  
**Created:** 2026-10-27  
**Updated:** 2026-10-27  
**Status:** APPROVED — user requested implementation of this presented plan on 2026-10-27  
**Execution tier:** full  
**Implementation model role:** full  
**Execution method:** Native  
**Provenance:** Approved Batch 1 specification, the user’s `approved` message, current repository inspection, and interactive selections of ESM-only packaging, local macOS verification, Native execution, and Node/TypeScript test tooling.

**Path:**  
`docs/superpowers/plans/2026-10-27-batch-1-dialog-package-comparison.md`

## Global Constraints

- “Keep native `page.keyboard`, locators, `test.step`, and `expect`.”
- “Use one page/main document, Chromium, ordinary light DOM, and semantic HTML examples.”
- “Playwright Test as a peer dependency.”
- “No registry publication, unsolicited external messaging, push, or merge.”
- Preserve the approved release specification at `docs/superpowers/specs/2026-10-26-a11y-journey-evidence-v0-1.md`, including its status and approval history.
- Implement Batch 1 only. Forms, their broken variants, and subsequent release work remain provisional.
- Use ESM-only packaging. Verify locally on macOS arm64; describe Linux, other hosts, and CI as untested.
- Use Native execution at the full tier. Inline execution does not switch the current model.
- Run meaningful red/green checks for behavioral changes. Do not add tests solely to mirror configuration or documentation.
- Complete the integrated sequential specification/quality review through `personal-workflows:code-review`; do not add another generic final review.

### Repository and dependency evidence

Current HEAD is `5647a440ab0b36320d7d3678ff7878e95b8b252e`. The repository contains README, license, `.gitignore`, and the two specifications. No source, package manifest, test configuration, architecture map, or ADRs exist. Architecture-map freshness is therefore **not applicable**; checked key paths are absent. No map will be generated during planning.

Observed environment: Node **24.21.0**, npm **11.19.0**, Darwin arm64.

Registry metadata and published type declarations inspected during planning establish these initial pins:

| Component | Planned version |
|---|---|
| Node | 24.21.0 |
| npm | 11.19.0 |
| TypeScript | 7.0.2 |
| `@playwright/test` | 1.64.1 |
| `@types/node` | 24.19.2 |

Playwright’s published browser manifest identifies Chromium revision **1248**, version **156.0.8078.4**. Record the browser actually launched during verification rather than treating this metadata as execution evidence.

The inspected declarations expose `mergeTests`, native step categories/results, `Locator.ariaSnapshot`, fixture attachments, and reporter final-status handling. No package installation or browser compatibility has yet been verified.

### Package and command contract

Use package name `a11y-journey-evidence`, version `0.1.0-batch.1`, `"type": "module"`, and `"private": true`. Export compiled JavaScript and declarations through `.` and `./reporter`. Include only `dist`, README, and license in the tarball. Pin the Playwright peer to `1.64.1`; initially declare only the tested Node version.

The repository has no existing build/test commands. The user selected creation of this npm command contract. These are **planned scripts**, not claims about current configuration:

| Script | Definition |
|---|---|
| `build` | `tsc -p tsconfig.build.json` |
| `typecheck` | `npm run build && tsc -p tsconfig.json --noEmit` |
| `test:unit` | `npm run typecheck && node --test tests/unit/*.test.ts` |
| `test:browser` | `npm run typecheck && playwright test --config tests/playwright.config.ts` |
| `test` | `npm run test:unit && npm run test:browser` |
| `demo:package` | `npm run build && playwright test --config examples/package/playwright.config.ts` |
| `demo:stock` | `playwright test --config examples/stock/playwright.config.ts` |
| `verify:consumer` | `npm run build && node scripts/verify-consumer.mjs` |

Add each script when its referenced files exist. Use strict TypeScript with `NodeNext` modules, ES2022 output, declarations, and erasable syntax. Node runs test `.ts` files using its built-in type stripping; tests import compiled package modules.

These commands become repository-backed through matching manifest entries and README instructions. CLI syntax was checked against the installed Node/npm help and published Playwright package. Execution must report any disagreement with the approved contract rather than silently substituting commands.

## Review Focus

Each condition below receives a regression check in the owning task:

1. **Failure after evidence-fixture teardown:** preserve the final native failure and disclose that artifacts were unavailable at the earlier capture point.
2. **Requested fixture without recording or assertions:** distinguish “not started” and “no executed assertions” from verified behavior.
3. **Root missing, ambiguous, or outside the main document:** disclose the condition without selecting an arbitrary element or expanding capture scope.
4. **Focus disappears or Space enters text:** retain honest focus-loss observations without recording printable input.
5. **Hostile titles, diagnostics, or attachment names:** prevent Markdown injection and unsafe artifact paths while keeping original failure information useful.

---

## Task 1: Bounded keyboard/focus observation and its tooling [size: M | risk: data | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: data]

**Acceptance criteria:** AC-03, AC-08

**Risk:** Browser observations can retain application data; filtering, descriptor limits, and explicit incompleteness are part of this deliverable.

**Files:**

- Create `package.json`, lockfile, `tsconfig.json`, `tsconfig.build.json`.
- Create `src/model.ts`, `src/observation.ts`, `src/browser-observer.ts`.
- Create `tests/playwright.config.ts`, `tests/browser/observation.spec.ts`.
- Modify README with the corresponding command contract.
- Add generated-output ignores without dropping the existing `.DS_Store` change.

**Interfaces:**

```ts
beginObservation(
  page: Page,
  options: { maxObservations: number }
): Promise<ObservationSession>;

interface ObservationSession {
  finish(): Promise<ObservationCapture>;
}
```

`ObservationCapture` contains ordered observations, completeness, truncation, and contextual issues. Its format is private.

- [x] **Establish the execution branch after both approvals and saving the artifacts.** Inspect local changes, fetch `origin`, and fast-forward `main` only when safe. Create `feat/batch-1-dialog-package-comparison`. Preserve local edits; do not automatically stash, reset, or force updates. If divergence or overlapping changes prevents the update, request a ruling. Commit the unchanged release reference, approved Batch 1 specification, and approved plan on this branch.
- [x] **Add test prerequisites and failing browser tests.** Configure the pinned dependencies and Chromium project. Test these assertions against real browser events:

  ```ts
  assert.deepEqual(capture.keys, ['Tab', 'Shift+Tab', 'Enter', 'Space', 'Escape']);
  assert.equal(capture.serialized.includes('typed-secret'), false);
  assert.equal(capture.observations.length <= 3, true);
  assert.equal(capture.truncated, true);
  ```

  Also cover application-driven focus, body/document focus, removal of the focused element, and suppression of Space inside text-editing targets.
- [x] **Run the red check:** `npm run test:browser -- --grep observation`. Expected: failure caused by the missing observation implementation.
- [x] **Implement bounded observation.** Install listeners only in the current main document, after page setup. Assign browser sequence numbers before transport. Keep a bounded receiving buffer and report overflow on either side. Default to 1,000 observations; accept integer limits from 1 to 10,000. Descriptors use local element references, tag, and an allowlist of `id`, `name`, `type`, `role`, `tabindex`, `disabled`, and relevant `aria-*` state/label attributes. Exclude values and text content; cap attribute strings at 256 characters and disclose clipping. Detect observable navigation, frames, new pages, and shadow boundaries without claiming exhaustive detection.
- [x] **Run the green check:** `npm run test:browser -- --grep observation`. Expected: exit 0 with all observation cases passing and no retained secret. Cleanup must remove listeners/bindings and preserve already received evidence when the page closes.
- [x] **Commit:** `feat: add bounded keyboard and focus observation`.

## Task 2: Opt-in fixture and failure captures [size: M | risk: data | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: data]

**Acceptance criteria:** AC-02, AC-03, AC-07, AC-08

**Risk:** Captures contain application data and can fail during teardown; they must remain scoped, independently controlled, and subordinate to the original failure.

**Files:**

- Create `src/fixture.ts`, `src/capture.ts`, `src/index.ts`.
- Create `tests/browser/fixture.spec.ts`, `tests/cases/fixture.spec.ts`, `tests/cases/playwright.config.ts`, and `tests/support/run-case.ts`.
- Extend `src/model.ts` with the private fixture payload.

**Public interface:**

```ts
interface JourneyOptions {
  root: Locator;
  screenshots?: boolean;
  ariaSnapshots?: boolean;
  maxObservations?: number;
}

interface Journey {
  start(options: JourneyOptions): Promise<void>;
}
```

Export `test`, extending native Playwright with a test-scoped `journey: Journey` fixture, plus these public types. Consumers retain native `expect` and can compose fixtures using `mergeTests`.

**Internal boundary:** `captureFailureArtifacts(page, root, testInfo, options)` returns explicit per-artifact outcomes. The private attachment is named `a11y-journey.v1.json`.

- [x] **Write failing cases** for default captures, each independent disable switch, removed/ambiguous roots, closed pages, wrong-page/frame roots, invalid limits, repeated `start`, and fixture access without `start`. Verify:

  ```ts
  assert.equal(payload.artifacts.screenshot.status, 'captured');
  assert.equal(payload.artifacts.ariaSnapshot.status, 'disabled');
  assert.equal(payload.issues.some(i => i.code === 'root-missing'), true);
  ```

  The test helper launches the installed Playwright CLI using argument arrays, collects native JSON and private attachments, and gives every child run a separate temporary output directory.
- [x] **Run the red check:** `npm run test:browser -- --grep fixture`. Expected: missing fixture/capture behavior fails.
- [x] **Implement opt-in lifecycle.** Fixture use marks the test as selected; `start` installs observation once. Call it after navigation/content setup and before journey actions. Reject malformed options contextually. Permit a root that mounts later; validate page/frame/document membership when resolvable. Never use `.first()` to resolve ambiguity.
- [x] **Implement teardown capture.** Finalize observations and capture on actual `failed`, `timedOut`, or `interrupted` status when practical. Screenshots and snapshots default to enabled, with a two-second timeout per operation. Use native test output paths, declared-root snapshots, and accurate start/end phase labels. Missing roots stay missing; empty snapshots stay explicitly empty. Capture and attachment errors become evidence issues and diagnostics, preserving the original native error.
- [x] **Run the green check:** `npm run test:browser -- --grep fixture`. Expected: exit 0; child failures remain the intended native failures, and capture controls affect only their declared capture type. Non-opted-in tests have no observation payload.
- [x] **Commit:** `feat: add opt-in journey fixture and failure captures`.

## Task 3: Native outcomes and attempt isolation [size: M | risk: concurrency | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: concurrency]

**Acceptance criteria:** AC-06, AC-08, AC-09, AC-10

**Risk:** Result aggregation can mix workers, erase retries, or misrepresent expected failures.

**Files:**

- Create `src/reporter.ts`, `src/results.ts`.
- Create `tests/unit/results.test.ts`, `tests/browser/reporting.spec.ts`, `tests/cases/outcomes.spec.ts`.
- Add the `./reporter` export and `test:unit` script.

**Interfaces:**

- Default-export `JourneyReporter`, implementing documented reporter hooks.
- `collectAttempt(test: TestCase, result: TestResult): AttemptEvidence`.
- `AttemptEvidence` combines final native status, expected status, identity, executed steps/assertions, fixture payload, artifacts, and issues.

- [x] **Write failing unit/browser tests** for hard/soft assertions, no assertions, early failure, expected failure, unexpected pass, retry-then-pass, two-worker execution, repeat identity, missing/corrupt payload, and late teardown failure:

  ```ts
  assert.deepEqual(attempts.map(a => a.actualStatus), ['failed', 'passed']);
  assert.equal(attempts[0].expectedStatus, 'failed');
  assert.equal(noAssertions.verifiedBehavior, false);
  assert.equal(new Set(artifactPaths).size, artifactPaths.length);
  ```

- [x] **Run the red checks:** `npm run test:unit` and `npm run test:browser -- --grep outcomes`. Expected: result aggregation/isolation tests fail.
- [x] **Implement result collection.** Retain native nesting and execution order from documented step hooks. Identify assertions by native category; preserve errors/messages without reconstructing expected/actual values. Do not copy `TestStep.params` wholesale. Use per-result storage and identities including project, test ID, repeat, and retry. Retain both actual and expected statuses.
- [x] **Reconcile fixture-time and final status.** If a later teardown fails, disclose that failure artifacts were not captured at that later point. A selected test without a payload is incomplete; an unselected test is omitted. Keep early-failure checks limited to those actually executed. Bound retained step records at 10,000 per attempt and diagnostic strings at 16 KiB, disclosing any clipping.
- [x] **Run the green checks:** `npm run test:unit` and `npm run test:browser -- --grep outcomes`. Expected: exit 0, with all attempts preserved and no cross-test evidence leakage.
- [x] **Commit:** `feat: retain native outcomes with isolated test attempts`.

## Task 4: Portable Markdown and visible reporting failures [size: M | risk: security | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: security]

**Acceptance criteria:** AC-06, AC-08, AC-11, AC-12, AC-13

**Risk:** Application-controlled content must not inject report structure, HTML, links, or artifact paths.

**Files:**

- Create `src/markdown.ts`, `src/bundle.ts`.
- Create `tests/unit/markdown.test.ts`, `tests/browser/bundle.spec.ts`.
- Complete reporter finalization in `src/reporter.ts`.

**Interfaces:**

```ts
interface JourneyReporterOptions {
  outputDir?: string;
  reproductionCommand?: string;
}

renderReport(
  attempts: readonly AttemptEvidence[],
  context: RunContext
): string;

writeBundle(
  attempts: readonly AttemptEvidence[],
  options: JourneyReporterOptions
): Promise<{ reportPath: string }>;
```

- [x] **Write failing tests** using HTML, Markdown links, multiline titles, backtick fences, path separators, and shell-like text. Test moving the bundle outside the checkout, unavailable attachments, malformed handoff, and a deterministic report-write failure caused by a file occupying the output-directory path:

  ```ts
  assert.equal(renderedIncludesInjectedLink, false);
  assert.equal(allGeneratedArtifactLinksResolveAfterMove, true);
  assert.match(failedWrite.stderr, /evidence report write failed/i);
  assert.equal(failedWrite.exitCode, 1);
  ```

- [x] **Run the red checks:** `npm run test:unit` and `npm run test:browser -- --grep bundle`. Expected: escaping, portability, or write-failure checks fail.
- [x] **Implement rendering.** Use fixed report structure and safely delimited text blocks for application-provided titles, diagnostics, attributes, and reproduction text. Generated artifact links use fixed labels and generated filenames. Include identities, runtime context, native steps/assertions, observations, capture timing, limitations, and completeness. Keep event and native-step sequences distinct.
- [x] **Implement bundle output.** Default to `a11y-evidence/<unique-run-id>/report.md`; copy available artifacts under generated attempt identifiers with relative links. Preserve native traces when available. Never derive filesystem paths directly from test titles. Report unavailable files explicitly.
- [x] **Implement failure visibility and verify.** Missing/corrupt handoff or bundle/report-write failure emits a clear stderr diagnostic and makes an otherwise successful run fail; native test statuses remain unchanged. Capture limitations and truncation remain visible without rewriting native outcomes. Run the red-check commands again: expected exit 0 for the enclosing regression suite. A moved bundle must explain the basic failure without its trace.
- [x] **Commit:** `feat: produce portable and safely rendered Markdown evidence`.

## Task 5: Dialog journeys and credible stock baseline [size: M | risk: none | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-04, AC-05, AC-15

**Files:**

- Create `examples/shared/dialog.ts`, `examples/shared/dialog-journey.ts`.
- Create separate `examples/package/` and `examples/stock/` tests/configurations.
- Create `tests/browser/dialog-comparison.spec.ts`.
- Add both demo scripts.

**Interfaces:**

```ts
type DialogVariant = 'correct' | 'escaping-focus' | 'failed-restoration';

loadDialog(page: Page, variant: DialogVariant): Promise<void>;
exerciseDialog(page: Page): Promise<void>;
```

The shared journey contains ordinary native actions, named steps, and assertions. It does not call package recording APIs.

- [x] **Write failing conformance tests** requiring the correct case to pass and each broken case to fail inside its intended named assertion step. An earlier unrelated error or an unexpected pass must fail this verification.
- [x] **Run the red check:** `npm run test:browser -- --grep dialog-comparison`. Expected: missing examples or incorrect failure locations fail.
- [x] **Implement the semantic dialog fixture.** Use a named `role="dialog"` with semantic heading/buttons and a backdrop. The opener activates with Enter; initial focus is `Continue`; the last control is `Cancel`. Correct behavior wraps both Tab boundaries, dismisses on Escape, and restores the opener. The escaping variant disables only containment; the restoration variant omits only restoration. Use an attached `#dialog` locator as the declared snapshot root.
- [x] **Implement both execution paths.** Package tests add `journey.start({ root })`; stock tests use native fixtures/reporters. Both use identical journey assertions and synthetic fixtures. Stock failure attachments include a focus descriptor, screenshot, and scoped ARIA snapshot with capture timing. Enable native traces on both paths so expected failures retain traces. Stock configuration must not import the package reporter or instrumentation.
- [x] **Run the green checks:** the comparison regression command, `npm run demo:package`, and `npm run demo:stock`. Expected: correct cases pass; deliberately broken cases have actual failed assertions at the intended checks. Demonstration suites may exit 0 because those failures are expected, while unexpected passes fail the suite.
- [x] **Commit:** `feat: add dialog recipes and equivalent stock Playwright comparison`.

## Task 6: Packed consumer and compatibility evidence [size: M | risk: none | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-01, AC-02, AC-13, AC-14

**Files:**

- Create `examples/consumer/package.json`, TypeScript/configuration files, `fixtures.ts`, `dialog.spec.ts`, and its own HTML fixture.
- Create `scripts/verify-consumer.mjs`.
- Create `tests/unit/package.test.ts`.
- Finalize package exports, included files, declarations, and `verify:consumer`.

**Interfaces:**

- Consumer imports only the packed package and installed dependencies.
- Compose an existing synthetic custom fixture with the package’s `test` using native `mergeTests`.
- Configure the package reporter alongside native HTML/list reporting.

- [x] **Write failing package/consumer checks** for missing exports/declarations, accidental source imports, missing runtime files, and unsuccessful fixture composition:

  ```ts
  assert.equal(consumer.exitCode, 0);
  assert.equal(consumer.usedExistingCustomFixture, true);
  assert.equal(consumer.importedRepositorySource, false);
  assert.equal(consumer.nativeAndEvidenceReportsExist, true);
  ```

- [x] **Run the red check:** `npm run verify:consumer`. Expected: packed installation or consumer integration fails before implementation.
- [x] **Implement packed installation.** The internal verification script creates `.artifacts/package`, invokes `npm pack --json --pack-destination .artifacts/package`, and installs that tarball into the separate consumer. Use subprocess argument arrays; no registry publication or public CLI is introduced.
- [x] **Run consumer verification.** The consumer type-checks and uses normal `playwright test` commands to exercise a correct dialog and a non-opted-in control test. Verify exports, peer integration, custom fixture availability, native reporter coexistence, and absence of evidence for the control. Move its evidence bundle to a temporary directory and check artifact links.
- [x] **Run the green checks:** `npm run verify:consumer` and `npm run test:unit`. Expected: exit 0. Record actual Node, npm, TypeScript, Playwright, Chromium, macOS version, and architecture; do not expand compatibility claims.
- [x] **Commit:** `test: verify packed consumer integration and portability`.

## Task 7: Comparison findings, documentation, and completion gate [size: M | risk: none | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-11, AC-14, AC-15, AC-16, AC-17

**Files:**

- Update README.
- Create `docs/batch-1-comparison.md` and `docs/batch-1-results.md`.
- Update this plan’s execution/completion notes without changing approved scope.

**Produces:** Reproducible onboarding, honest comparison findings, verification records, and durable release continuity.

- [x] **Document onboarding and safeguards.** Include ESM setup, fixture composition, one-time recording setup, independent capture controls, observation limits/allowlist, native command usage, reproduction, artifact timing, data risks, unsupported boundaries, and tested-toolchain limits.
- [x] **Perform the author comparison.** Record concrete dependencies, configuration, integration code, attachment code, and shared authoring effort for both paths. For each broken dialog, identify the failed expectation, observed focus, and reproduction path from each path’s artifacts. Link concrete examples; do not invent time savings or require a positive result.
- [x] **Record evaluation status.** Label findings as an author assessment. Record real external findings only if supplied; otherwise state **external validation pending**. External participation is not a completion gate, and no outreach is authorized.
- [x] **Run final verification:** `npm test`, `npm run demo:package`, `npm run demo:stock`, `npm run verify:consumer`, and `git diff --check`. Expected: regression suites and packed consumer exit 0; both demo paths preserve the intended actual failures; no whitespace errors. Retain exact commands, exit statuses, and decisive output. Fix documentation-command mismatches before completion.
- [x] **Complete final review and commits.** Run `personal-workflows:code-review` once in integrated mode: specification review, then quality review. Resolve findings through its prescribed loop and rerun affected checks. Commit final documentation and fixes using explicit paths, preserving unrelated user changes. Do not push or merge.
- [x] **Record the endpoint and stop.** Summarize working output, verification, limitations, author/external evaluation status, and release mapping. Identify deferred release AC-06–07, the form comparison, and remaining cross-pattern release verification. Keep later choices provisional; do not start Batch 2.

## Acceptance and Verification Traceability

| Batch 1 criteria | Tasks | Primary evidence |
|---|---|---|
| AC-01 | 6 | Packed consumer install, fixture composition, native reporter coexistence |
| AC-02 | 2, 6 | Native authoring and non-opted-in control |
| AC-03 | 1, 2 | Real browser ordering, filtering, focus loss, bounded capture |
| AC-04–05 | 5 | Correct dialog and verified intended failures |
| AC-06 | 3, 4 | Native results and rendered report contents |
| AC-07 | 2 | Default captures and independent controls |
| AC-08 | 1–4 | Scope, capture, handoff, and output failures |
| AC-09–10 | 3 | Retries, concurrency, repeats, expected status, early/no assertions |
| AC-11 | 4, 7 | Limited claims in reports and documentation |
| AC-12 | 4 | Injection regressions and data documentation |
| AC-13 | 4, 6 | Moved report bundles and attachment links |
| AC-14 | 6, 7 | Actually exercised local toolchain |
| AC-15 | 5, 7 | Equivalent runnable comparison and findings |
| AC-16–17 | 7 | Honest evaluation status, onboarding, completion/release continuity |

The specification’s original release-criterion mapping remains authoritative. Batch 1 infrastructure evidence does not establish form acceptance or complete v0.1 acceptance.

## Approval Handoff

**Current stage:** Stage 4, implementation authorized by the user’s `PLEASE IMPLEMENT THIS PLAN:` message after separate specification approval.

This plan was presented in Plan mode and saved on 2026-10-27 after the user explicitly requested its implementation. Specification approval was the earlier `approved` message; plan approval is the subsequent `PLEASE IMPLEMENT THIS PLAN:` message.

Explicit approval authorizes Native implementation of this plan once both approved artifacts are saved and the Git preflight is satisfied. No implementation is authorized by the earlier specification approval alone.

**Execution endpoint:** Finish Batch 1, its verification and sequential final review, record results and remaining release work, commit locally, then stop before Batch 2.

## Execution notes

All seven tasks completed with observed checks and local commits. Final verification records 4 unit and 29 browser tests, both equivalent dialog demos, packed external consumer integration, and whitespace validation. The author comparison and release continuity are in `docs/batch-1-comparison.md` and `docs/batch-1-results.md`. The integrated sequential review returned specification PASS and no Critical or Important quality findings; one Minor Space-observation edge case is explicitly deferred in the results. Review identities and rulings are preserved there. External validation remains pending. Execution stops at Batch 1; Batch 2 remains deferred, with no push, merge, publication, or outreach.
