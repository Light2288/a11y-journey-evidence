# Batch 2 verification and release continuity

Created: 2026-10-27. Updated: 2026-10-27.

Specification: [approved Batch 2](superpowers/specs/2026-10-27-batch-2-form-package-comparison.md). Plan: [approved implementation plan](superpowers/plans/2026-10-27-batch-2-form-package-comparison.md). The original release reference and both Batch 1 approved artifacts remain unchanged.

Batch 2 implements the form increment on `feat/batch-2-form-package-comparison`, based on merged Batch 1 at `af6bd05`. Native execution used the existing checkout at the full tier without switching the parent model. Separate scope, specification, and saved-plan approvals preceded implementation. No public API, export, option, dependency pin, private handoff version, or development package-version change was needed.

## Observed verification

All commands below ran locally on 2026-10-27. Exit statuses and decisive output were read from the executed processes.

| Exact command | Exit | Decisive output and meaning |
| --- | --- | --- |
| `npm test` | 0 | `ℹ pass 4`; `41 passed (24.2s)` — unit and Chromium regression suites |
| `npm run demo:package` | 0 | `6 passed (1.9s)` — two actual passes and four intended actual assertion failures |
| `npm run demo:stock` | 0 | `6 passed (1.8s)` — the same actual/expected outcomes through stock Playwright |
| `npm run verify:consumer` | 0 | `3 passed (593ms)`; `Packed consumer verified: 3 passed; form, dialog, fixture composition, native reporter, opt-in isolation, declarations, and moved links.` |
| `git diff --check` | 0 | No output; no whitespace errors |

Native JSON was inspected for both demos: `dialog correct` and `form correct` actually passed; `dialog escaping-focus`, `dialog failed-restoration`, `form missing-error-association`, and `form failed-error-focus` actually failed with expected status `failed`. Playwright's six-passed summary counts expected failures as successful test outcomes. Regression checks require each intended shared assertion failure, preceding successful steps, and absent later steps. It is not six passed accessibility journeys.

The final package command produced [this six-attempt portable report](../a11y-evidence/1f72dae9-145a-4d78-9047-077720ac5800/report.md). Native JSON/HTML and the packed-consumer proof are linked in [the comparison](batch-2-comparison.md). These generated, Git-ignored artifacts are local examples; fresh checkouts regenerate them with the documented commands. Moving a failing form bundle outside the checkout preserved both native failure explanations, observed focus, scoped artifacts, timing, and every generated relative asset link without opening a trace.

Behavioral RED→GREEN evidence was also observed per task:

- Task 1: missing shared implementation failed the new browser cases; all five `form recipe` cases then passed, including mixed validity, whitespace rejection, and both defect-isolation checks.
- Task 2: both new descriptor checks failed while the attributes were absent; all eight observation cases then passed with bounded attributes, clipping disclosure, no retained field values/arbitrary attributes, and no printable Space.
- Task 3: five comparison/portability cases failed before form demos and child-output isolation existed; all five then passed. Combined/concurrent runs retained scoped roots, unique child HTML directories, traces, and native actual outcomes. Existing dialog source and regressions remained intact.
- Task 4: the extended consumer check failed with `2 !== 3` before its form test existed; three external consumer tests then passed. Four unit tests and the full 41-browser regression suite passed afterward.

## Tested environment

Node **24.21.0**, npm **11.19.0**, TypeScript **7.0.2**, Playwright Test **1.64.1**, actual launched Chromium **156.0.8078.4**, macOS **27.0.1 arm64**. The fresh external consumer proof records runtime, compiler, package, browser, and host values. Linux, CI, other hosts, versions, and browsers remain **untested**. Registry metadata and Batch 1 observations were not substituted for fresh execution evidence.

The private development package remains `0.1.0-batch.1`. Verification installs its new tarball into a fresh directory and uses installed files/declarations, ordinary native reporter configuration, and existing custom-fixture composition. Its selected dialog and form create two evidence attempts; the unselected control creates none.

## Criterion and release mapping

| Batch 2 criteria | Evidence |
| --- | --- |
| AC-01–03 | Correct native form recipe; visible/associated errors; first invalid Name or Team; whitespace rejection; keyboard correction, cleared state/references, retained root and success status |
| AC-04–05 | Isolated Name association/focus defects; exact native failed steps on both paths; correct focus for association defect and Submit focus for focus defect |
| AC-06 | Shared loader/native journey, equal trace policy, combined six-case demos and unchanged dialog files/regressions; stock has no package instrumentation |
| AC-07 | Two added raw allowlist attributes only; existing bounds/filtering and new form-data/clipping regressions; no observation/API expansion |
| AC-08 | Scoped package and stock captures, accurate teardown labels/outcomes, native diagnostics and focus, moved failing bundle |
| AC-09 | Fresh packed consumer, three passes/two selected attempts, custom fixture, installed declarations, native HTML, moved links, no repository source imports |
| AC-10 | All five exact final commands above exit 0; prior observation/fixture/reporting/bundle/dialog checks remain green |
| AC-11 | README onboarding/policy/data/toolchain guidance and concrete author comparison; external validation pending |
| AC-12 | This release mapping, carryover minor and remaining gaps; sequential review recorded below before delivery |

Release **AC-06–07** now have form-specific behavior and intended-failure evidence. Existing dialog AC-04–05 and infrastructure AC-01–03/08–15 were rerun across the combined scope. AC-16 has bounded local toolchain evidence; AC-17 has runnable comparisons for both patterns and an explicitly labelled author assessment. These results do not automatically promote the preserved release specification or declare v0.1 acceptance/publication complete.

## Sequential final review

The sole integrated `personal-workflows:code-review` gate reviewed the complete 21-path branch diff and supporting source/evidence in one immutable package. Both reviewers recomputed the exact-byte hash and verified the same identities:

- Gate run: `2194ea4c-1c58-4611-8fee-16ee6caac82b`.
- Reviewed state: `98c22345329e3bc004af3508503d38b95ef511d9`.
- Package SHA-256: `08deb5a9d30161060827d98c50f12366df14d85ae04ac967240809a4598ef031`.

**Specification review: PASS**, using the managed light role (`gpt-6-luna`, high). It found the acceptance criteria and all five Review Focus conditions supported, with no missing or extra work. Only then did **quality review: PASS** run on the managed full role (`gpt-6.1-sol`, high), against the unchanged package and complete fresh specification report. It reviewed validation/correction, defect isolation, bounds, stock captures, child isolation, portability, consumer integration, and documentation. It found no Critical, Important, or Minor issues and no items declined for judgment within the approved review scope.

No correction pass, new ruling, or new deferred minor was needed. The prior Space-key minor remains deferred below. The reviewers used supplied command evidence rather than independently rerunning the suites; quality did not visually inspect screenshot/trace binaries. No wider compatibility, screen-reader, conformance, or independent-usefulness conclusion follows. Post-gate edits record review/completion evidence only; they do not change reviewed product code.

## Evaluation, remaining work, and endpoint

The [comparison](batch-2-comparison.md) is an **author assessment**. Both paths explain the intended form failures. The package combines ordered observations and native diagnostics in a portable report; stock supplies useful native reports/traces with a small attachment hook. The 985-line combined package sample has a real verbosity cost. No measured time saving, independent preference, screen-reader announcement, or accessibility-conformance claim follows. **External validation remains pending**; no outreach occurred.

The carryover **deferred minor** remains: Space activation on a noneditable button nested inside an editable container can be omitted without disclosure. Native assertions/outcomes remain intact. This increment's ordinary text inputs do not trigger that case. It needs a separately approved correction and effective-editability regression; it was deliberately not folded into form work.

Remaining release decisions include disposition of that minor, independent usefulness evaluation if desired, report-verbosity tradeoffs, and explicit release-readiness/acceptance and distribution decisions. Any broader compatibility or CI work needs new evidence and authorized scope. Cross-pattern local verification is now observed; untested browser/host combinations remain gaps, not promises.

Execution stops after this increment's verification, sequential review, durable records, and local commits. No push, merge, registry publication, outreach, or subsequent increment is performed.
