# Space-key observation fix results

Created: 2026-10-27. Updated: 2026-10-27.

Specification: [approved correction](superpowers/specs/2026-10-27-space-key-observation-fix.md). Plan: [approved implementation plan](superpowers/plans/2026-10-27-space-key-observation-fix.md).

The correction replaces the observer's editable-ancestor check with effective browser content editability, retaining the existing textarea/input classification and document-design-mode safeguard. It changes one expression; public/private package interfaces, dependency pins, captures/reporting, and the private `0.1.0-batch.1` version remain unchanged.

## Regression evidence

Exact command: `npm run test:browser -- --grep observation`.

- Baseline: exit 0, `8 passed (1.2s)`.
- RED: exit 1, `2 failed`, `18 passed (2.7s)`. Both `observation Space activation explicit-noneditable-button` and `observation Space activation inherited-noneditable-button` activated natively (the output incremented to `1`), then failed because the observed key list was `[]` instead of `['Space']`.
- GREEN: exit 0, `20 passed (1.9s)`. A separate task-completion run also passed all 20 cases (`20 passed (1.8s)`).
- Task 1 full suite: exact `npm test`, exit 0, `ℹ pass 4` and `53 passed (23.9s)`.

The twelve new cases cover ordinary, explicitly/inherited noneditable, input-button, and checkbox activation; inherited/re-enabled/plaintext-only editing; text input and textarea editing; design mode; and Ctrl/Alt/Meta filtering. Native keyboard events establish real activation or actual text insertion. DOM focus/caret setup does not substitute for those actions. Editing cases exclude printable Space and `editing-secret` from observation payloads, and complete captures remain complete.

The defect originally recorded as a deferred Minor in [Batch 1](batch-1-results.md) and carried through [Batch 2](batch-2-results.md) is resolved by these regressions. Those documents describe their historical checkpoints and remain unchanged. Current README guidance links this correction instead of presenting that precise defect as unresolved.

## Final integration verification

All commands below ran locally on 2026-10-27; their exits and output were read from the executed processes.

| Exact command | Exit | Decisive output |
| --- | --- | --- |
| `npm test` | 0 | `ℹ pass 4`; `53 passed (23.9s)` |
| `npm run demo:package` | 0 | `6 passed (1.9s)` |
| `npm run demo:stock` | 0 | `6 passed (1.8s)` |
| `npm run verify:consumer` | 0 | `3 passed (584ms)`; `Packed consumer verified: 3 passed; form, dialog, fixture composition, native reporter, opt-in isolation, declarations, and moved links.` |
| `git diff --check` | 0 | No output |

Both demos' native JSON was inspected: correct dialog/form cases actually passed; the two broken dialogs and two broken forms actually failed, with expected status `failed` and their precise intended assertion messages. Playwright's six-passed suite summary counts expected failures as successful test outcomes; it is not six passing accessibility journeys. The full regression suite also pins intended failure locations and absent later checks.

The fresh external consumer installed the tarball and passed dialog, form, and unselected-control tests. Its evidence contains two selected attempts, with no control evidence, and verifies existing-fixture composition, native reporting, installed declarations, and moved links.

Actual toolchain: Node **24.21.0**, npm **11.19.0**, TypeScript **7.0.2**, Playwright Test **1.64.1**, launched Chromium **156.0.8078.4**, macOS **27.0.1 arm64**. These are fresh consumer/runtime observations. No compatibility range was expanded. Existing runner output included the environment's `NO_COLOR`/`FORCE_COLOR` warning, also present at baseline; no command failed.

Generated local evidence:

- [Package demo bundle](../a11y-evidence/e8926f09-1788-499b-98f3-3ebbeec9cf51/report.md).
- [Package native JSON](../.artifacts/package-native.json) and [stock native JSON](../.artifacts/stock-native.json).
- [Packed-consumer proof](../.artifacts/consumer-verification.json).

These are Git-ignored execution artifacts; fresh checkouts regenerate them using the documented commands and the new printed report path. They are not shipped with the package. All nine pre-existing historical documents under `docs/` match their recorded pre-implementation SHA-256 hashes.

## Specification and release mapping

| Criteria | Evidence |
| --- | --- |
| Fix AC-01–02 | Exact native activation plus retained button-targeted Space across explicit/inherited false boundaries |
| Fix AC-03–04 | Real editing with printable exclusion; inherited/re-enabled/plaintext-only, input/textarea, and design-mode preservation |
| Fix AC-05 | Unchanged observer contract, modifier regression, existing key/focus/order/bounds/capture regressions |
| Fix AC-06 | Full integration commands and existing precise demo/consumer checks, recorded above before review |
| Fix AC-07 | Current README correction and this record, with historical documents unchanged |
| Fix AC-08 | Sole sequential final-review gate and local delivery record, pending below |
| Release AC-03 | Repairs the known omission in supported-key observation; adds bounded targeted evidence rather than asserting universal key/editor coverage |

## Sequential review and delivery

Pending. The implementation will undergo the sole integrated `personal-workflows:code-review` gate, specification first and then quality against the same immutable package after a fresh specification PASS. Review identities, outcomes, rulings/minors, and final completion evidence will be preserved here.

## Limits and subsequent decisions

The correction establishes the tested effective-editability behavior in Chromium. It does not add a rich-text-editor journey, screen-reader testing, or accessibility-conformance claim. Observation data filtering does not sanitize screenshots, snapshots, traces, or native diagnostics. Compatibility remains bounded to the actually exercised environment; other hosts/browsers and CI remain untested.

External usefulness validation is still pending; the existing comparisons are author assessments. Report verbosity and explicit release-readiness/version/distribution decisions remain provisional. This fix does not automatically declare v0.1 acceptance or authorize publication or outreach.

Execution ends with the verified fix, required review, durable records, and local commits on `fix/space-key-observation`; no push, merge, release-readiness work, or subsequent increment is performed.
