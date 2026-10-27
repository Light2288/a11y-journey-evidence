# Batch 1 verification and release continuity

Created: 2026-10-27. Updated: 2026-10-27.

Specification: `docs/superpowers/specs/2026-10-27-batch-1-dialog-package-comparison.md`.
Plan: `docs/superpowers/plans/2026-10-27-batch-1-dialog-package-comparison.md`.
Release reference: `docs/superpowers/specs/2026-10-26-a11y-journey-evidence-v0-1.md` (preserved unchanged).

Implementation verification is recorded below. The final sequential specification/quality review is pending; completion will be recorded after that gate.

## Observed verification

| Command | Observed outcome |
| --- | --- |
| `npm test` | Exit 0; 4 Node unit tests and 29 Chromium browser regression tests passed |
| `npm run demo:package` | Exit 0; correct dialog actually passed, both broken dialogs actually failed their intended assertions as expected |
| `npm run demo:stock` | Exit 0; the same actual outcomes with native reports/traces and focus/screenshot/ARIA/timing attachments |
| `npm run verify:consumer` | Exit 0; packed artifact installed in a fresh external consumer; type-check and 2 browser tests passed; composition, reporter coexistence, opt-in isolation, and moved bundle links verified |

Final demo and packed-consumer reruns also exited 0; `git diff --check` exited 0. Detailed generated evidence is in `.artifacts/consumer-verification.json`, native demo JSON/HTML, and the package's generated Markdown bundles. These are reproducible local outputs, not assertions of CI execution.

The initial tests failed against missing implementation. An additional real-browser regression reproduced `page.setContent()` replacing the observed document while completeness remained true; the observer now discloses this unsupported boundary. Capture-write errors preserve the original assertion and the other capture type. Concurrent failed tests retain separate screenshot paths. Passing tests with incomplete recording remain distinguishable from complete evidence.

## Tested environment

Node 24.21.0; npm 11.19.0; TypeScript 7.0.2; Playwright Test 1.64.1; actual launched Chromium 156.0.8078.4; macOS 27.0.1 arm64. Node and Playwright declarations are narrowly pinned to this evidence. Linux, CI, other hosts/runtimes/versions, and other browsers are **untested**. Registry browser revision metadata is not substituted for the actual launched version.

## Criterion evidence

| Batch 1 IDs | Evidence |
| --- | --- |
| AC-01 | Packed external consumer, existing fixture, native and evidence reporters; `verify:consumer` |
| AC-02 | Native shared recipe, fixture composition, non-selected consumer/control cases |
| AC-03 | Observation tests: key filtering, typed-data exclusion, sequence order, buffer bound, focus loss, clipping, unsupported boundaries |
| AC-04–05 | Both comparison paths verify the correct dialog and the precise intended failures of both isolated variants |
| AC-06 | Native-result audit and generated Markdown context/steps/assertions/observations/outcomes |
| AC-07–08 | Independent controls; missing/ambiguous roots; closed pages; invalid configuration; capture-write, handoff, and report-write errors |
| AC-09–10 | Hard/soft assertions, retries, repeats, concurrent failure artifacts, expected/unexpected status, no assertions, early and late failure cases |
| AC-11–12 | Limited claims, synthetic data, inert Markdown fences, hostile-text and large-fence regressions, data documentation |
| AC-13 | Moved failing and consumer bundles with resolvable relative artifact links and useful text without traces |
| AC-14 | Actual local runtime/compiler/browser/host record; unsupported environments explicitly untested |
| AC-15–16 | Equivalent stock comparison and explicitly labelled author assessment; external validation pending |
| AC-17 | Onboarding/reproduction, safeguards, evidence, and this release-continuity record |

## Implementation ruling

Native reporter resolution uses a fallback export condition pointing to the same ESM file; the local self-referencing example resolves that path explicitly. Playwright resolves reporter names before loading ESM, and the package is not installed in its own checkout's `node_modules`. This does not add a CommonJS build or support claim. If the resolution choice were wrong, installed reporter onboarding would fail; the packed external consumer verifies the ordinary package-name configuration.

## Remaining release work and endpoint

Batch 1 establishes dialog-specific intended coverage for original release AC-01–05 and AC-08–15, bounded environment evidence for AC-16, and the dialog portion of AC-17. These are observed increment results, not complete v0.1 acceptance.

Deferred, provisional Batch 2 includes original release AC-06–07: the correct form and isolated error-association/error-focus variants, the corresponding stock comparison, and remaining verification/documentation across both patterns. No detailed Batch 2 specification, plan, or implementation has been started.

The author comparison identifies portable ordered evidence as the potential benefit and native reporting strength/report verbosity as tradeoffs. External validation remains pending. Future feedback can change later proposals, but does not automatically amend approved decisions. Continue only through the subsequent increment's scope, specification, and plan approvals.

Execution ends after Batch 1 verification, final review, result reporting, and local commits. No publication, push, merge, outreach, or Batch 2 work is authorized or performed.
