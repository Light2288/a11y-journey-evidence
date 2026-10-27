# Batch 2: Form Package Comparison Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` through `personal-workflows:spec-implement` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax. Native execution preserves the user's existing execution preference; there is no implementer subagent per task.

**Goal:** Deliver a keyboard form recipe and two isolated failures through the package and stock Playwright, with useful evidence and packed-consumer integration.

**Architecture:** A shared synthetic form loader and native journey serve both example paths. The existing observer gains two bounded descriptor attributes; the fixture, capture pipeline, reporter, and public API are reused. Form-specific stock attachments retain the same scoped native baseline as the dialog.

**Tech Stack:** TypeScript, Playwright Test, Chromium, npm, and Node's built-in test runner; existing ESM package/toolchain.

**Spec:** [Approved Batch 2 specification](../specs/2026-10-27-batch-2-form-package-comparison.md)

**Slug:** `batch-2-form-package-comparison`

**Created:** 2026-10-27

**Updated:** 2026-10-27

**Status:** APPROVED — the user separately approved this saved plan with `approved` after its presentation.

**Execution tier:** full

**Implementation model role:** full

**Execution method:** Native — preserved user preference from Batch 1. Inline execution does not switch the parent model.

**Provenance:** The approved Batch 2 specification, the user's scope confirmation and later specification approval, and current repository inspection. The user's reference to plan approval preceded this plan's creation and presentation and therefore does not approve it.

## Global Constraints

- “No public API, export, option, or matcher changes are required.”
- “Add only `aria-invalid` and `aria-describedby` to the existing descriptor allowlist.”
- “Validation updates on submission only.” Use `aria-describedby` and native accessible-description assertions; do not substitute `aria-errormessage` assertions.
- Preserve native keyboard actions, locators, `test.step`, and `expect`; no per-action recording wrappers or form DSL.
- Keep the example in one page/main document, Chromium, ordinary light DOM, semantic HTML, and synthetic data. No navigation, network submission, persistence, or contenteditable controls.
- Preserve observation bounds, 256-character attribute clipping/disclosure, typed-value exclusion, capture controls/timing, attempt identity, native outcomes, and portable reporting.
- Preserve the original release specification and both approved Batch 1 artifacts unchanged. Record historical observations as historical; do not infer fresh compatibility proof.
- Use the existing checkout, safely update `main` and create `feat/batch-2-form-package-comparison` only after both separate approvals. Keep artifacts uncommitted until that branch exists. Preserve unrelated edits; no automatic stash, reset, worktree, push, merge, publication, or outreach.
- Keep the deferred Space-key minor and report redesign outside this increment. Do not start another increment or automatically declare v0.1 complete.
- Native final review is one integrated `personal-workflows:code-review` gate: specification review, then quality review. No generic duplicate final review. Apply the enclosing one-pass Critical/Important RED→GREEN fix policy; defer Minor findings with disclosure.

### Repository, artifact, and decision evidence

Planning HEAD is `af6bd05ce6f02270b5d137e18f4d0a119bb3ca56`, on `main`. The worktree was clean before saving the Batch 2 artifacts. Exact-slug and canonical/legacy path lookup found no previous Batch 2 specification or plan; the newly saved specification is now the sole selected source. It preserves the original chat-draft creation date.

`docs/architecture/map.md`, `docs/architecture/decisions/`, `docs/adr/`, and `ADRs/` are absent. Architecture-map freshness and ADR constraints are **not applicable** at this HEAD; key paths checked are `src/browser-observer.ts`, `src/fixture.ts`, `src/capture.ts`, `src/reporter.ts`, `examples/shared/`, `examples/package/`, `examples/stock/`, and `scripts/verify-consumer.mjs`. Do not generate a map during planning.

The manifest pins Node 24.21.0, npm 11.19.0, TypeScript 7.0.2, Playwright Test 1.64.1, and `@types/node` 24.19.2. Retain the current private development version `0.1.0-batch.1`, exports, and dependency pins; this increment is not a release-version or publication task. Fresh external consumer installation already avoids same-version local-tarball cache assumptions. Record the browser/host/toolchain actually exercised during implementation; Batch 1's Chromium/macOS values are not fresh Batch 2 evidence.

Installed declarations expose `toHaveAccessibleDescription`, native JSON result/step records, and array-valued `testMatch`. Installed Playwright's `lib/runner/index.js` reads `PLAYWRIGHT_HTML_OUTPUT_DIR`. Use native JSON named-step errors, not parsed human diagnostic values, to verify where demos fail.

All material form-policy questions were resolved through native interactive selection and scope confirmation. Remaining concrete implementation choices are fixed below for plan review. Native execution is retained rather than introducing a new execution preference.

### Command contract

All commands below already have matching entries in `package.json`; this plan adds no npm scripts. Native `--grep` filters follow the repository's existing browser-test and demo convention.

| Command | Existing definition / planned use |
| --- | --- |
| `npm run build` | `tsc -p tsconfig.build.json` |
| `npm run typecheck` | Build followed by `tsc -p tsconfig.json --noEmit` |
| `npm run test:browser -- --grep "form recipe"` | Existing browser script, filtering Task 1 tests |
| `npm run test:browser -- --grep observation` | Existing browser script, filtering Task 2 tests |
| `npm run test:browser -- --grep "form-comparison|bundle form"` | Existing browser script, filtering Task 3 tests |
| `npm run test:unit` | Existing typecheck plus Node unit tests |
| `npm test` | Existing unit and browser suites |
| `npm run demo:package` | Existing build and package demo config; extend its test selection to both patterns |
| `npm run demo:stock` | Existing stock demo config; extend its test selection to both patterns |
| `npm run verify:consumer` | Existing build and `scripts/verify-consumer.mjs` |
| `git diff --check` | Existing specification/plan verification contract |

Red checks below are expected to exit nonzero because the named behavior is absent. Green checks must exit 0; unrelated environment, dependency, or configuration failures are not valid red evidence. Batch 2 execution checks are **unobserved** at plan creation; no implementation or browser run has occurred for this increment.

### File responsibilities and shared interfaces

- `examples/shared/form.ts`: synthetic form and isolated variant behavior. `examples/shared/form-journey.ts`: one ordinary native journey.
- `tests/browser/form.spec.ts`: form correctness, mixed validity, whitespace, and defect isolation. Existing observation tests cover the bounded attribute extension.
- New package/stock form test files: use the shared loader/journey; the stock file owns its form-scoped native attachments. Existing dialog files stay unchanged.
- Existing example configs select both patterns. `tests/support/run-case.ts` keeps each child run's HTML output isolated as well as its existing JSON, native artifacts, and evidence output.
- New form comparison tests and an extension of existing bundle tests verify native failure locations, supporting evidence, combined execution, and relocation.
- New independent consumer HTML/test plus its config and verification script extend packed integration. README and new Batch 2 comparison/results documents provide current onboarding and durable evidence.

## Review Focus

1. Browser constraint-validation UI must not repair the deliberately omitted focus movement; pin `novalidate` and actual Submit focus in Tasks 1 and 3.
2. A valid first field with an invalid second field, or whitespace-only input, must select the actual first invalid field without marking a valid field invalid; cover both in Task 1.
3. Correction must clear stale errors and description references on successful resubmission, without promising live validation or removing the capture root; cover this in Task 1.
4. Long error-reference attributes and typed spaces must obey the existing descriptor bounds/data exclusions; cover clipping and the actual correction journey in Task 2.
5. Combined/concurrent dialog and form runs must keep capture roots, selected evidence, and child HTML/artifact directories isolated; cover child-run isolation/scoped snapshots in Task 3 and selected/control separation in Task 4.

---

## Task 1: Semantic form and native keyboard journey [size: M | risk: none | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-01, AC-02, AC-03, AC-04, AC-05

**Files:** Create `examples/shared/form.ts`, `examples/shared/form-journey.ts`, and `tests/browser/form.spec.ts`.

**Interfaces:**

```ts
export type FormVariant = 'correct' | 'missing-error-association' | 'failed-error-focus';
export function loadForm(page: Page, variant: FormVariant): Promise<void>;
export function exerciseForm(page: Page): Promise<void>;
```

`Page` is the native Playwright type. Form/heading accessible name is `Team request`; IDs are `form`, `form-title`, `name`, `team`, `name-error`, `team-error`, `submit`, and `success`. Labels/messages are the specification's exact values. The success status is `Details saved.`; correction values are `Example User` and `Example Team`.

- [ ] **Establish the execution branch after both approvals.** Identify the saved approved specification and plan plus their separate approving messages. Inspect local changes, fetch `origin`, and fast-forward `main` only when safe. Create `feat/batch-2-form-package-comparison`. Do not stash, discard, overwrite, or force an update; obtain a ruling if overlapping changes/divergence prevent safe preflight. Commit the two approved Batch 2 artifacts on that branch using explicit paths; do not modify or recommit older artifacts as new decisions.
- [ ] **Write failing real-browser tests**, named with prefix `form recipe`: correct keyboard flow; valid Name/missing Team; whitespace-only input; missing-association isolation; failed-focus isolation. The correct flow invokes `exerciseForm`. Supporting cases use native keyboard actions directly. Pin these decisive assertions in their owning cases:

  ```ts
  await expect(page.locator('#form')).toHaveAttribute('novalidate', '');
  await expect(page.locator('#name')).toHaveAccessibleDescription('Enter a name.');
  await expect(page.locator('#team')).toHaveAccessibleDescription('Enter a team.');
  await expect(page.locator('#team')).toBeFocused(); // valid Name / missing Team
  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'false');
  await expect(page.locator('#name')).not.toHaveAttribute('aria-describedby', /.+/);
  await expect(page.getByRole('status')).toHaveText('Details saved.');
  ```

  The missing-association isolation case expects an empty Name description but a visible error, invalid state, and Name focus. The failed-focus isolation case expects both correct descriptions and Submit focus. Whitespace input is three spaces in each field, entered through the keyboard, and must still yield both required errors/Name focus. Successful correction verifies both cleared errors, false invalid states, empty descriptions/absent references, and the still-attached form.
- [ ] **Run red:** `npm run test:browser -- --grep "form recipe"`. Expected: nonzero due to missing shared form implementation, then retain that output.
- [ ] **Implement the shared fixture and recipe.** Use a named `<form novalidate>`, two required native text inputs, labelled inline error elements, Submit, and an initially hidden status. On submit prevent default, trim only for required validation, update all error/invalid/reference states, and focus the first invalid input except in `failed-error-focus`. `missing-error-association` omits only Name's error reference. Keep the root mounted, never echo field values, and update validation only on submit.
- [ ] **Implement `exerciseForm` using these named steps:** `Keyboard submission`, `Visible errors and invalid states`, `Declared error associations`, `Declared invalid-submit focus`, and `Keyboard correction and successful resubmission`. Tab through Name/Team/Submit, then Enter. In the association step, execute the Name native description assertion with message `Association: Name describes its visible error` **before** checking its raw reference; then verify Team's description and both exact error IDs. The focus assertion message is `Error focus: Name is the first invalid field`. Correction types the declared synthetic values, navigates with Tab, and resubmits with Enter. No test-side focus/fill shortcut.
- [ ] **Run green:** `npm run test:browser -- --grep "form recipe"`. Expected: exit 0; all five recipe cases pass. This does not yet claim package/stock integration.
- [ ] **Commit the three files:** `feat: add semantic form keyboard recipe and isolated variants`.

## Task 2: Bounded form descriptor context [size: S | risk: data | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: data]

**Acceptance criteria:** AC-07

**Risk:** Additional DOM attributes can retain application data; preserve the explicit allowlist, clipping, and distinction between observations and other artifacts.

**Files:** Modify `src/browser-observer.ts` and `tests/browser/observation.spec.ts`.

**Interfaces:** Consume Task 1's `loadForm`/`exerciseForm` and existing `beginObservation(page, { maxObservations })`. The `ObservationCapture` shape, public types, and private handoff version remain unchanged.

- [ ] **Write two failing observation cases:** `observation form descriptors retain validation context without typed values` starts recording after loading the correct form, runs the native recipe, and finalizes. `observation form references are clipped with disclosure` uses a 300-character `aria-describedby` value and a native key/focus observation. Pin:

  ```ts
  expect(capture.observations.some(o =>
    o.target?.attributes.id === 'name' &&
    o.target.attributes['aria-invalid'] === 'true' &&
    o.target.attributes['aria-describedby'] === 'name-error')).toBe(true);
  expect(JSON.stringify(capture.observations)).not.toContain('Example User');
  expect(JSON.stringify(capture.observations)).not.toContain('Example Team');
  expect(capture.observations.filter(o => o.kind === 'key').map(o => o.key)).not.toContain('Space');
  ```

  The clipping case requires exactly 256 retained characters, issue `descriptor-truncated`, and incomplete capture. Assert no retained `value` or arbitrary data attributes. Recording a raw reference does not assert that the referenced node exists.
- [ ] **Run red:** `npm run test:browser -- --grep observation`. Expected: new form-context/clipping assertions fail because the attributes are absent; existing observation cases retain their outcomes.
- [ ] **Extend only the descriptor allowlist** with `aria-invalid` and `aria-describedby`, using its existing raw-string/cap logic. Do not change key classification, add mutation-state records, or fix the deferred editable-boundary Space minor. The complete correction journey supplies printable spaces in genuine text inputs.
- [ ] **Run green:** `npm run test:browser -- --grep observation`. Expected: exit 0; existing observation behavior and new form-context/data-bound checks pass.
- [ ] **Commit the two files:** `feat: retain bounded form validation descriptors`.

## Task 3: Equivalent demos, scoped failure evidence, and portability [size: M | risk: data | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: data]

**Acceptance criteria:** AC-01, AC-04, AC-05, AC-06, AC-08, AC-10

**Risk:** Form captures must remain correctly scoped and isolated when both patterns or child runs execute concurrently; native expected failures must not mask unrelated failures.

**Files:** Create `examples/package/form.spec.ts`, `examples/stock/form.spec.ts`, and `tests/browser/form-comparison.spec.ts`. Modify both example `playwright.config.ts` files, `tests/support/run-case.ts`, and `tests/browser/bundle.spec.ts`. Preserve both existing `dialog.spec.ts` files unchanged.

**Interfaces:** Consume Task 1's `FormVariant`, `loadForm`, and `exerciseForm`. Existing `runCase(title, { config, args?, env? })` retains its signature/results; give each run a default `PLAYWRIGHT_HTML_OUTPUT_DIR` of `join(directory, 'html')` alongside its existing unique JSON/native/evidence outputs. No new package or reporter interface.

- [ ] **Write failing comparison cases for package and stock.** Run the corresponding example config with native filter `form `. Require exactly the titles `form correct`, `form missing-error-association`, and `form failed-error-focus`. Pin actual/expected outcomes and exact failure messages:

  ```ts
  expect(correct.results[0].status).toBe('passed');
  expect(missing.expectedStatus).toBe('failed');
  expect(missing.results[0].status).toBe('failed');
  expect(missing.results[0].errors[0].message).toContain('Association: Name describes its visible error');
  expect(focus.results[0].errors[0].message).toContain('Error focus: Name is the first invalid field');
  ```

  Inspect native JSON named steps: the intended step has an error, each preceding shared step completed without error, and later recipe steps are absent. Check existing trace attachments. Correlate private payloads to each native result through its attachment, rather than zipping independently ordered arrays. For package failures require captured screenshot/form snapshot outcomes, fixture-teardown timestamps, correct focus (`name` / `submit`), and relevant raw attributes. Stock must have no private payload and must provide focus/screenshot/ARIA/timing attachments with the same focus observations and the visible form/error structure.
- [ ] **Add `form-comparison` child-isolation coverage.** Launch two same-mode combined `dialog|form` child runs concurrently using `runCase`; require six cases per run, distinct directories, and an HTML `index.html` under each child's own `html` directory. Check that package evidence selects all six attempts without mixing payloads and that form snapshots contain `Team request` rather than dialog structure. Keep the original dialog regression checks, which separately pin their intended failure messages.
- [ ] **Add `bundle form` portability coverage** to the existing bundle test file, reusing its local report-discovery helper. Run the package form demos, move the whole run bundle outside the checkout, and require both native failure messages, observed focus IDs, actual failed/expected-failed states, fixture-teardown timing, and scoped snapshots. Require all generated relative asset links to resolve and basic explanations to remain useful without opening a trace. Do not assert that field-value exclusion sanitizes snapshots or native diagnostics.
- [ ] **Run red:** `npm run test:browser -- --grep "form-comparison|bundle form"`. Expected: nonzero because form demos are absent/excluded and child HTML directories are not isolated.
- [ ] **Add both form execution paths.** Iterate the three variants, mark only broken variants with native `test.fail()`, use `Setup: load synthetic form`, then the same shared journey. Package tests start recording once with `page.locator('#form')` after setup. Stock uses native fixtures and an independent form-scoped `afterEach`: attach current focus (tag/id plus present raw `aria-invalid`/`aria-describedby`, excluding values/text), screenshot, `#form` ARIA snapshot, and per-operation `afterEach` timing/outcomes. Retain two-second capture timeouts and error disclosure; never fall back to another root. Mirror the existing small attachment pattern rather than introducing a generic capture framework.
- [ ] **Extend example configs** to `testMatch: ['dialog.spec.ts', 'form.spec.ts']`, preserving reporters, trace-on policy, timeouts, and workers. Add the per-child HTML environment default in `runCase`; native JSON/evidence/native output isolation already exists. Do not change reporter rendering or capture production code to accommodate the example.
- [ ] **Run green:** `npm run test:browser -- --grep "form-comparison|bundle form"`, then `npm run demo:package` and `npm run demo:stock`. Expected: each command exits 0. Each unfiltered demo contains six cases: two actual passes and four intended actual failures accepted as expected by Playwright. A native summary may call all six expected cases passed; inspect actual per-test JSON outcomes instead of treating that summary as six verified journeys. Existing dialog failures retain their original checks.
- [ ] **Commit this task's explicit paths:** `feat: compare form journeys with stock Playwright evidence`.

## Task 4: Independent packed-consumer form integration [size: M | risk: none | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-09, AC-10

**Files:** Create `examples/consumer/form.html` and `examples/consumer/form.spec.ts`. Modify `examples/consumer/playwright.config.ts` and `scripts/verify-consumer.mjs`. Retain the existing dialog HTML/test, control, fixture composition, manifest, and typecheck configuration.

**Interfaces:** Consumer imports only its local fixture file, native Playwright, and the installed packed package. Existing verification invocation remains `npm run verify:consumer`; `.artifacts/consumer-verification.json` retains its existing proof fields and adds `formVerified: true`. No public runtime interface changes.

- [ ] **Write the failing integration requirement first in the verification script.** Require three actual passing tests with exact titles: existing `packed consumer dialog uses existing fixture`, new `packed consumer form uses existing fixture`, and existing `packed consumer unselected control`. Require exactly one started private handoff for each selected case, none for the control, and both selected titles/`Selected attempts: 2` in the evidence report. Set `formVerified` only after these assertions and the existing installed-path/reporter/portability checks pass.
- [ ] **Run red:** `npm run verify:consumer`. Expected: nonzero because the current consumer has only two cases and lacks the selected form evidence; retain the decisive assertion failure. It must not fail merely because of installation/environment errors.
- [ ] **Add independent correct-form HTML and test.** Use Task 1's declared semantics/copy and native invalid-submit/correction/resubmit checks, but no import of repository examples, source, or shared recipe. Reuse the consumer's existing merged `test`, assert `tenant === 'synthetic-team'`, start once with `#form`, and retain ordinary native named steps/assertions. Extend consumer `testMatch` to both spec filenames; its current include glob already covers the new TypeScript file.
- [ ] **Complete verification adaptation.** Keep fresh external tarball installation, separate typecheck/browser commands, installed reporter resolution, and native report coexistence. Read each selected test's own handoff and check both are present in the moved bundle while the control is absent. Preserve generated-link verification and runtime/host proof collection. Update the final proof line to `Packed consumer verified: 3 passed; form, dialog, fixture composition, native reporter, opt-in isolation, declarations, and moved links.` Do not assert historical two-test counts or infer support beyond this run.
- [ ] **Run green:** `npm run verify:consumer` and `npm run test:unit`. Expected: exit 0; three actual passing consumer tests, two selected evidence attempts, no control evidence, successful typecheck/install/report/link checks, and existing unit/package-file checks pass.
- [ ] **Commit the four task paths:** `test: verify packed form consumer integration`.

## Task 5: Findings, verification, and delivery record [size: M | risk: none | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-06, AC-10, AC-11, AC-12

**Files:** Modify README and this plan's execution notes. Create `docs/batch-2-comparison.md` and `docs/batch-2-results.md`. Preserve prior release/Batch 1 documents unchanged.

**Interfaces:** Consume the implemented native demo JSON/HTML, package Markdown, and consumer proof. Documentation records observed output, not planned expectations as fact.

- [ ] **Document current onboarding and safeguards.** Explain both patterns, `aria-describedby` versus `aria-errormessage`, first-invalid-field focus, submit-only validation, success clearing, one-time recording/root setup, current allowlist/data/capture limits, native reporter coexistence, and narrowly tested environment. Retain author-assessment/external-validation-pending labels unless genuine findings are supplied; no outreach.
- [ ] **Document exact reproduction with existing scripts:** `npm run demo:package -- --grep "form missing-error-association"`, `npm run demo:stock -- --grep "form missing-error-association"`, and the corresponding `form failed-error-focus` filters. Explain expected suite success versus actual failed assertions. Link concrete generated examples from actual runs and the relevant native HTML entry points.
- [ ] **Perform the author comparison.** For both failure variants and both paths, identify the intended native failed expectation, observed focus, and reproduction route. Record concrete dependencies/configuration/integration/capture code and shared authoring effort; compare diagnostic usefulness and ownership costs honestly. Do not invent time savings, user preference, screen-reader announcements, or conformance proof.
- [ ] **Run final verification:** `npm test`, `npm run demo:package`, `npm run demo:stock`, `npm run verify:consumer`, and `git diff --check`. Expected: all commands exit 0; existing regressions remain green; each demo has the two actual passes/four intended actual failures; consumer has three actual passes and two selected attempts. Preserve exact commands, exit statuses, decisive lines, and actually launched browser/compiler/runtime/host versions. Fix documentation-command mismatches within this increment.
- [ ] **Complete the sole integrated final review.** Use `personal-workflows:code-review` in integrated Native mode on one immutable whole-branch package: fresh specification PASS first, then quality review of the same package/hash/identity. Handle findings under the enclosing Native policy, reproduce any Critical/Important fixes RED→GREEN and rerun affected/full checks, and disclose deferred minors/rulings. Do not dispatch another generic final reviewer.
- [ ] **Record the endpoint and commit locally.** Map evidence to this specification and original release criteria, retain the deferred Space-key minor, and list remaining cross-pattern/release gaps without automatic acceptance/promotion. Record review results and changes in this plan's completion notes. Commit final docs/fixes with explicit paths, preserving unrelated changes; do not push/merge. Stop before another increment's scope/specification/plan.

## Acceptance and Verification Traceability

| Batch 2 criterion | Owning tasks | Primary evidence |
| --- | --- | --- |
| AC-01 | 1, 3 | Shared recipe and equivalent correct-form demos |
| AC-02 | 1 | Mixed-validity and whitespace real-browser cases |
| AC-03 | 1 | Keyboard correction, cleared references/errors, retained root/status |
| AC-04 | 1, 3 | Missing-association isolation and exact native description failure |
| AC-05 | 1, 3 | Submit focus and exact native focus failure after valid earlier steps |
| AC-06 | 3, 5 | Shared fixtures/journey, combined demos, preserved dialog regressions |
| AC-07 | 2 | Sampled descriptor context, clipping, typed-value/Space exclusion |
| AC-08 | 3 | Scoped native/package captures, timing, traces, moved failing bundle |
| AC-09 | 4 | Fresh installed consumer, selected/control split, declarations/reports/links |
| AC-10 | 3–5 | Full existing regression/combined demo/consumer/whitespace commands |
| AC-11 | 5 | Reproduction, policy/data/toolchain docs and author comparison |
| AC-12 | 5 | Release mapping, gaps/minor disclosure, final review and endpoint |

## Self-Review and Approval Handoff

Self-review covers each specification requirement, task/interface consistency, exact native assertion/copy values, source-backed commands, and all five Review Focus conditions. No material user-policy question remains open; the implementation organization above is presented for plan approval. No implementation tests were run during this planning stage.

**Current stage:** Stage 4, implementation authorized. Specification approval is the earlier `spec definition and plan approved / out of plan mode, write the files` message; separate plan approval is the subsequent `approved` message after presentation of the saved plan.

Explicit approval of this saved plan authorizes Native/full implementation of the saved approved scope, subject to Git preflight. Keep both artifacts uncommitted until that approved implementation branch is created. No product code, branch update, or implementation is performed by saving this plan.

**Execution endpoint:** finish Batch 2, its verification and sequential review, document author findings and remaining release gaps, commit locally, and stop before later work. Preserve publication/push/merge permissions for the user.
