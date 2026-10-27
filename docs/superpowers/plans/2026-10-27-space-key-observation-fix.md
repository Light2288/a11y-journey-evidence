# Space-Key Observation Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` through `personal-workflows:spec-implement` to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax. Native execution preserves the user's existing execution preference; no implementer subagent is used per task.

**Goal:** Retain Space activation observations across noneditable boundaries while preserving printable-input filtering, existing journeys, and packed-package integration.

**Architecture:** Replace only the observer's ancestor-based contenteditable decision with browser-computed effective editability. Preserve native input/textarea and document-design-mode rules, and use real-browser regressions through the existing private observation session. Existing package/reporting interfaces and consumer verification remain unchanged.

**Tech Stack:** Existing ESM TypeScript, Playwright Test, Chromium, npm, and Node unit tooling.

**Spec:** [Approved Space-key specification](../specs/2026-10-27-space-key-observation-fix.md)

**Slug:** `space-key-observation-fix`

**Created:** 2026-10-27

**Updated:** 2026-10-27

**Status:** APPROVED — separately approved by the user with `approved` after its saved-plan presentation.

**Execution tier:** full

**Implementation model role:** full

**Execution method:** Native — retained from the user's previous selection. Inline execution does not switch the parent model.

**Provenance:** The approved specification, the user's `i confirm the scope/design` message, and the subsequent `approved` immediately after the draft specification presentation; current repository inspection at merged `main` `0a8d71992cd13357fc3047fe51ab09289797a7e6`.

## Global Constraints

- “Use the browser's effective content-editability semantics rather than searching through arbitrary editable ancestors.”
- “Preserve the existing native input-type classification, textarea handling, and document-design-mode safeguard.”
- Preserve key/modifier filtering, focus capture, bounds/order, attribute allowlist/clipping, evidence completeness, and capture timing.
- No public API, option, export, dependency pin, private handoff version, descriptor, observation-type, or development-version changes. Keep the private `0.1.0-batch.1` package.
- Native keyboard events must establish activation/editing; a synthetic keydown or direct test click is insufficient. Focus/caret setup is permitted in these targeted observer tests.
- Use synthetic values, one page/main document, ordinary light DOM, Chromium, and existing ESM tooling. No rich-text-editor support or broader compatibility claim.
- Preserve all historical release, Batch 1, and Batch 2 specifications, plans, comparisons, and results unchanged. Update current README guidance and create a new fix-results record only after verification.
- Keep artifacts uncommitted until both approvals; then safely update `main` and create `fix/space-key-observation` in the existing checkout. No worktree, automatic stash/reset, force update, push, merge, publication, outreach, or subsequent increment.
- Full tier is required because Task 1 changes filtering of retained keyboard evidence (`risk: data`). Retain Native execution; no parent model switch.
- Final review is one integrated `personal-workflows:code-review` gate: fresh specification PASS, then quality review on the same immutable package. Apply the enclosing Native one-pass Critical/Important RED→GREEN policy and disclose deferred minors/rulings. No generic duplicate review.

### Repository and artifact evidence

The selected specification is the sole exact-slug new-path source (`NEW_ONLY`); no legacy specification or plan exists for this slug, and the plan lookup was `MISSING`. This plan reuses the specification's exact basename. Specification approval authorizes planning; it does not approve this plan.

Planning HEAD is `0a8d71992cd13357fc3047fe51ab09289797a7e6`, on `main`. Only the new specification was untracked before plan creation. `docs/architecture/map.md`, `docs/architecture/decisions/`, `docs/adr/`, and `ADRs/` are absent: architecture-map freshness and ADR constraints are not applicable. Key paths checked are `src/browser-observer.ts`, `src/observation.ts`, `src/model.ts`, `tests/browser/observation.spec.ts`, both example configs, and `scripts/verify-consumer.mjs`. Do not generate an architecture map during planning.

The package pins Node 24.21.0, npm 11.19.0, TypeScript 7.0.2, Playwright Test 1.64.1, and `@types/node` 24.19.2. Installed TypeScript and Playwright manifests match their pins; no browser execution or compatibility verification occurred during this planning stage. Record the actual launched browser and host during implementation instead of reusing historical Batch 2 versions as fresh proof.

All material policy decisions are resolved by the approved specification. The synthetic fixture IDs, strings, case names, and test grouping below are author-selected implementation details within that scope.

### File responsibilities and interfaces

- Modify `src/browser-observer.ts`: only the effective-editability part of `installObserver(options: { binding: string; state: string; maxObservations: number }): void`.
- Extend `tests/browser/observation.spec.ts`: inline synthetic fixtures and real key/input assertions. Reuse `beginObservation(page, { maxObservations: 100 })`, returning an `ObservationSession` whose `finish()` yields ordered observations, issues, `complete`, and `truncated`.
- Modify README: replace the unresolved-minor caveat with narrow corrected-behavior guidance and link the result record.
- Create `docs/space-key-observation-fix-results.md`: exact verification/review evidence, historical-minor disposition, release AC-03 contribution, remaining limits, and endpoint.
- Update this plan's execution notes during implementation. No consumer/example/reporting changes or additional test helpers are planned.

### Command contract

The approved specification and current `package.json` supply `npm run test:browser -- --grep observation`, `npm test`, `npm run demo:package`, `npm run demo:stock`, and `npm run verify:consumer`; each has a matching existing script. Browser tests build/type-check first and import compiled observation modules. The existing consumer verifier packs and installs into a fresh external directory, checks three actual passes/two selected attempts, native reporting, declarations, and moved links. Existing demo regressions inspect precise intended failures.

README supplies `npm install` and `npx playwright install chromium` if prerequisites are missing; use them only if needed during implementation and retain pins/lockfile. `git diff --check` comes from the specification. No command or npm script is introduced. This fix's RED/GREEN and final-check outcomes are **unobserved** at planning time.

## Review Focus

1. An explicitly noneditable button inside an editable host must activate with Space and retain exactly one button-targeted key; Task 1 pins activation and observation separately.
2. A false boundary on an intermediate ancestor must also stop inherited editing; Task 1 covers inherited noneditable buttons alongside ordinary buttons.
3. Descendants that inherit editing, re-enable it inside a false boundary, or use `plaintext-only` must continue to edit without printable Space observations; Task 1 checks actual text insertion and payload exclusion.
4. Native inputs, textareas, and document design mode must retain their existing policy independently of the contenteditable fix; Task 1 covers text suppression, button/checkbox activation, and the design-mode guard.
5. A focused noneditable target must not bypass Ctrl/Alt/Meta filtering after this correction; Task 1 asserts that only the unmodified Space is retained.

---

## Task 1: Correct effective-editability filtering and prove it in Chromium [size: M | risk: data | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: data]

**Acceptance criteria:** AC-01, AC-02, AC-03, AC-04, AC-05.

**Risk:** A filtering correction could retain printable input; regressions must establish real editing and inspect only the observation payload for typed-value exclusion.

**Files:** Modify `src/browser-observer.ts` and `tests/browser/observation.spec.ts`; save/commit the approved artifact pair before product changes.

**Interfaces:** Consume unchanged `beginObservation(page, { maxObservations: 100 })` and `ObservationSession.finish()`. Produce the same `installObserver` signature and private capture shape; Task 2 relies on complete regression evidence without any new package interface.

- [x] **Establish the execution branch after both approvals.** Identify the saved approved spec and this separately approved plan plus their approving messages. Inspect local edits, fetch `origin`, and fast-forward `main` only when safe, then create `fix/space-key-observation`. Preserve local edits; do not stash, reset, overwrite, or force. Request a ruling for divergence or overlapping changes. Commit the two approved artifacts on this branch using explicit paths; historical artifacts stay unchanged.
- [x] **Check prerequisites and baseline.** Confirm installed pins; use the README installation commands only if needed. Run `npm run test:browser -- --grep observation`. Expected: existing observation tests pass; environment failures must be resolved before treating a later failure as the defect's RED evidence. Preserve the command, exit, and decisive output.
- [x] **Add native activation regressions**, with case titles `observation Space activation <case>` and a shared inline-fixture table for `ordinary-button`, `explicit-noneditable-button`, `inherited-noneditable-button`, `input-button`, and `checkbox`. The target ID is `activate`. Explicit case: a button with `contenteditable="false"` inside a true host. Inherited case: a button inside a false container inside a true host. All others are outside editable containers. Establish focus with its native locator, start observation after content setup, and use `page.keyboard.press('Space')`. Real click handlers increment an output `#activation-count` from `0` to `1`; checkbox activation is also asserted through native `toBeChecked`. For each case pin:

  ```ts
  await expect(page.locator('#activation-count')).toHaveText('1');
  const capture = await session.finish();
  const keys = capture.observations.filter(o => o.kind === 'key');
  expect(keys.map(o => o.key)).toEqual(['Space']);
  expect(keys[0]!.target?.attributes.id).toBe('activate');
  expect(capture.complete).toBe(true);
  expect(capture.issues).toEqual([]);
  ```

- [x] **Add editing-preservation regressions**, titled `observation Space editing <case>`, for `inherited-editable`, `reenabled-editable`, `plaintext-only`, `text-input`, and `textarea`. Use target ID `editor`, seed text `seed` for editable elements, and typed text `editing-secret`. The inherited case uses a focusable HTML descendant of a true editing host; the re-enabled case has a true editing region inside a false boundary inside a true host. Establish locator focus and, for contenteditable fixtures, a DOM caret collapsed at the end of the target's text. Then use native `page.keyboard.type('editing-secret')` and `page.keyboard.press('Space')`. Assert actual insertion: input/textarea values are `editing-secret `; editable target text, normalizing NBSP to a normal space, is `seedediting-secret `. Finish and pin:

  ```ts
  expect(capture.observations.filter(o => o.kind === 'key').map(o => o.key)).not.toContain('Space');
  expect(JSON.stringify(capture.observations)).not.toContain('editing-secret');
  expect(capture.observations.every(o => !o.target || !('value' in o.target.attributes))).toBe(true);
  expect(capture.complete).toBe(true);
  ```

- [x] **Add independent safeguard regressions.** `observation Space preserves design-mode suppression` enables `document.designMode = 'on'`, focuses a noneditable native button, presses native Space, and requires no Space observation and complete capture; this pins the existing document-level guard rather than promising editor semantics. `observation Space preserves modifier filtering` focuses an ordinary noneditable button outside editable containers and presses `Control+Space`, `Alt+Space`, `Meta+Space`, then unmodified `Space`; require the key list to equal `['Space']` and complete capture. Do not infer modified-key activation semantics from this filtering test.
- [x] **Run RED:** `npm run test:browser -- --grep observation`. Expected: nonzero because the explicit/inherited noneditable activation cases have a real native activation but lack their Space observations. Existing suppression/policy cases should remain green. An unrelated setup or editing failure is not valid RED evidence; resolve its cause before implementation.
- [x] **Correct `installObserver` minimally.** Replace the ancestor contenteditable decision with a safe `target instanceof HTMLElement && target.isContentEditable` check; retain textarea detection, the exact existing input-type classification, and `document.designMode === 'on'`. Preserve the modifier guard and all observation transport/descriptor/buffer code. Do not add a helper, new record, input policy, or recording wrapper.
- [x] **Run GREEN:** `npm run test:browser -- --grep observation`. Expected: exit 0 for all existing and new observation cases, including actual button activation, editing, and filtering. Run `npm test`. Expected: exit 0 for unit and full Chromium regressions; no wider environment claim follows.
- [x] **Commit the two code/test files:** `fix: respect effective editability when observing Space`. Use explicit paths. Retain the RED→GREEN proof for the task ledger, later results, and final review.

## Task 2: Verify integration, retire the current caveat, and record delivery [size: M | risk: none | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-05, AC-06, AC-07, AC-08.

**Files:** Modify README and this plan's execution notes; create `docs/space-key-observation-fix-results.md`. Historical artifacts remain read-only.

**Interfaces:** Consume Task 1's unchanged observer/capture contract and observed test evidence. Reuse existing demo native JSON/HTML, package Markdown, and `.artifacts/consumer-verification.json`; no example or consumer source change is required.

- [x] **Update current guidance and draft results.** Replace only README's unresolved nested-contenteditable caveat with the verified narrow behavior, preserving the general editor/support/data limits. Add a link to the new results record. Record the historical minor's disposition, exact reproduction regression names/command, RED→GREEN evidence, release AC-03 contribution, actual toolchain, and remaining release decisions. Do not rewrite historical documents, claim general editor support, or promote v0.1 acceptance.
- [x] **Run final integration verification:** `npm test`, `npm run demo:package`, `npm run demo:stock`, `npm run verify:consumer`, and `git diff --check`. Expected: each exits 0; regression suites stay green; each demo has two actual passes/four intended actual failures at the established checks; the fresh packed consumer has three actual passes and two selected attempts with declarations/reporters/portable links intact. Inspect native actual outcomes and consumer proof, not merely the expected-failure suite summary. Preserve exact commands, exits, decisive output, and actual Node/npm/TypeScript/Playwright/launched Chromium/host/architecture. Document any command disagreement instead of silently substituting another command.
- [x] **Commit the evidence documentation checkpoint** using explicit README/result/plan paths and `docs: record Space observation fix verification`. Keep review status pending until it actually completes.
- [x] **Complete the sole integrated final-review gate.** Invoke `personal-workflows:code-review` once under Native execution using one immutable whole-branch package containing spec, plan, complete diff/file list, required unchanged context, Review Focus verbatim, ledger/rulings, and observed evidence. Retain run/state/hash identities. Dispatch specification review on the managed light role; only after a fresh PASS dispatch quality review on the managed full role against the same package and full spec report. No generic duplicate final reviewer. Re-grade findings by user effect and apply the enclosing one-pass Critical/Important RED→GREEN correction policy plus full-suite verification; defer/disclose Minors and ledger any rulings with costs.
- [x] **Record completion and commit locally.** Persist review identities/results, exhaustive rulings/minors, final verification, and the endpoint in results/plan; run the task-completion `npm test` check and `git diff --check`, expected exit 0. Commit final records and any prescribed fixes with explicit paths. Preserve the branch and existing checkout under the user's no-push/no-merge instruction, collect the ledger decisions, then remove only this plan's generated scratch after durable records are committed. Stop before release-readiness work or any other increment.

## Acceptance and Verification Traceability

| Spec criterion | Tasks | Primary evidence |
| --- | --- | --- |
| AC-01–02 | 1 | Explicit/inherited boundary and ordinary/input/checkbox native activation cases |
| AC-03 | 1 | Inherited, re-enabled, and plaintext-only real-editing cases |
| AC-04 | 1 | Text input, textarea, design-mode guard, typed-payload exclusion |
| AC-05 | 1–2 | Modifier regression, preserved observation suite, full regression and unchanged interfaces |
| AC-06 | 2 | Both demos' native actual outcomes and fresh packed consumer |
| AC-07 | 2 | Current README plus new result record; historical files unchanged |
| AC-08 | 2 | Sequential immutable-package gate, disposition, durable completion and stop |

## Self-Review and Approval Handoff

Self-review checked specification coverage, exact interfaces/fixture IDs, native activation versus editing assertions, command provenance, all five Review Focus conditions, and the bounded two-task scope. No material policy question remains open. Test setup details do not extend supported journey claims. No project build/test/browser commands ran during planning.

**Current stage:** Stage 4, implementation authorized. The specification and this saved plan each received a separate `approved` after their respective presentations.

Approval of this saved plan authorizes Native/full implementation of the approved specification after Git preflight. Keep the approved specification and this plan uncommitted until that implementation branch is created. Do not update `main` or create the branch before this gate.

**Execution endpoint:** deliver the verified observer correction, full regression and packed-consumer evidence, completed sequential review, current guidance and durable result record, and local implementation-branch commits; then stop before release-readiness work, publication, or any later increment. No push or merge without explicit user authorization.

## Execution Notes

Native/full execution uses the existing checkout on `fix/space-key-observation`, based on `0a8d719`. Both artifact approvals were identified before Git preflight; origin was fetched, main was aligned, and approved artifacts were committed as `923a4fa` before product changes.

Task 1 is complete in `2620400`: exactly the explicit/inherited nested-button cases failed after native activation (empty key list instead of `Space`); 18 other cases passed. The single observer-expression correction passed all 20 observation cases, followed by 4 unit and 53 browser tests. The task-completion observation run also passed (20 tests). No implementation deviation or ruling was required.

Task 2 current guidance/results and final integration verification are complete: all five exact commands exited 0; 4 unit/53 browser tests, both demos with two actual passes/four intended actual failures each, and three packed-consumer passes/two selected attempts. Fresh toolchain and native outcomes are recorded in `docs/space-key-observation-fix-results.md`. All nine historical documents match their pre-implementation hashes. The sole integrated sequential gate passed specification and quality review on an unchanged package, with matching identities and no findings, declined-to-judge items, rulings, or deferred minors. The post-review `npm test` completion run exited 0 with 4 unit and 53 browser passes (`53 passed (24.1s)`). Delivery records and local completion commits close this increment.

**Execution status:** COMPLETE. Both tasks are complete. The sole final gate ran specification review (`gpt-6-luna`, high), then quality review (`gpt-6.1-sol`, high) after fresh PASS, against run `5c413eb6-3145-4824-9739-d53adc0dfad7`, reviewed state `53fa2070ef0bb18949fd20d0bf470fe907172a04`, SHA-256 `78c8bc38b74c8bc1fd0f78e6736a74c3da78e8ff29f4ddcc889f8bce92691826`. Both passed with no findings or declined-to-judge items. No corrective pass, ruling, or deferred minor was needed.

Task 2's completion ledger records `Task 2: complete (commits 2620400..6a2ac66, tests: npm test → 53 passed (24.1s))`. Exact verification, historical-minor disposition, fresh toolchain, review limits, and remaining release decisions are durable in the new result record. All nine historical documents retain their original bytes. Existing checkout/local branch are retained; only this plan's generated scratch is removed after records are committed. No worktree, push, merge, publication, outreach, release promotion, or subsequent increment.
