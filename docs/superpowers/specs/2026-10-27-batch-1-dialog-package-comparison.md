# Batch 1: Dialog Package Comparison

**Created:** 2026-10-27  
**Updated:** 2026-10-27  
**Slug:** `batch-1-dialog-package-comparison`  
**Type:** feature  
**Status:** APPROVED  
**Provenance:** User-authorized handoff from chat `01a17a88-2c05-7433-870e-ac68ef1e0ace` to start Batch 1 specification work in this repository; confirmed Batch 1 scope/design and clarification answers reproduced below; approved release reference `docs/superpowers/specs/2026-10-26-a11y-journey-evidence-v0-1.md`. This is a separate delivery-increment specification, not a revision or replacement of the release specification.  
**Approval state:** Stage 1 scope/design confirmed. The user explicitly approved this specification on 2026-10-27 with the message `approved`, in response to its Stage 2 presentation. Stage 3 implementation planning is authorized. No Batch 1 implementation plan exists or is approved. Implementation is not authorized.

## Problem

A frontend or design-system reviewer needs to identify a keyboard journey's failed expectation, observed focus, and reproduction path. Stock Playwright already supplies actions, assertions, reports, attachments, and traces. The proposed package must demonstrate whether a compact keyboard/focus evidence report adds useful review context for a reasonable setup and authoring cost.

Batch 1 delivers an installable dialog workflow and a fair runnable comparison. A useful or unfavorable comparison is a valid finding; technical completion does not depend on proving that the package is better.

## Repository Evidence and Artifact Resolution

Inspection on 2026-10-27 found `main` tracking `origin/main`, at initial commit `5647a44`. Existing changes are a `.gitignore` addition for `.DS_Store` and untracked documentation containing the approved release specification. `README.md`, `.gitignore`, and the MIT license exist; no manifest, source, tests, or implementation plan exists. No product setup or browser execution was performed for this draft.

The explicitly selected release specification resolves as `NEW_ONLY` at `docs/superpowers/specs/2026-10-26-a11y-journey-evidence-v0-1.md`; its plan is `MISSING`. The distinct Batch 1 specification and plan were both `MISSING` before this draft. No legacy or duplicate Batch 1 artifact was found. This new document uses the confirmed topic's distinct slug and its actual creation date. Preserve all pre-existing changes.

## Release Relationship and Confirmed Scope

**Wider direction:** Complete the approved [A11y Journey Evidence v0.1 release specification](2026-10-26-a11y-journey-evidence-v0-1.md), whose exact repository path is `docs/superpowers/specs/2026-10-26-a11y-journey-evidence-v0-1.md`. Its filename, APPROVED status, decisions, acceptance IDs, and approval history remain unchanged.

The release specification records approval with `approved, but wait for my input in a new prompt before starting with the plan`. That approved release remains the overall reference; it does not make this new increment specification approved or authorize implementation.

The handoff records native clarification selections of `Dialog package comparison` and `External feedback optional`. After the Stage 1 proposal and explanation of the two batches, the user confirmed:

> the division is ok for me  
> i want to start spec driven development of batch 1 in a different chat

The user subsequently authorized creation of this chat with the handoff. This is the evidence for confirmed Batch 1 scope/design and authorization to draft only. The completed Stage 1 gate is preserved.

**Selected increment and outcome:** One correct dialog and two isolated broken dialog variants, observed through a small opt-in TypeScript fixture/reporter package, installed from a packed artifact into a separate consumer, and compared with the same dialog journeys using stock Playwright. Include the setup, integration, regression checks, documentation, evidence-integrity safeguards, and review needed to make this independently usable.

**Uncertainty:** Does the package make failures easier to review, and at what setup/authoring cost? Evaluation may inform report content, observation detail, capture defaults, onboarding, the later form approach, or whether further investment is justified. Findings do not automatically amend approved decisions; material changes return through the existing approval gates.

**Deferred, provisional Batch 2:** The correct form journey and two isolated broken form variants (release AC-06–07), their stock comparison, and remaining verification/documentation needed to establish v0.1 completion across both patterns. Do not specify or plan Batch 2 now. Its details can change after Batch 1 evaluation, subject to approval.

**Boundary rationale:** A dialog comparison is a complete outcome that tests the package's value before investing in a second pattern. Shared packaging, observation, reporting, integration, and safeguards belong in Batch 1; the batches are not assumed equally sized. A technical-layer-only increment would not support a meaningful comparison.

**Execution endpoint:** Once separately authorized, complete Batch 1's installable workflow and fair comparison, verification, review, and authorized commits; record observed results, limitations, remaining release work, and implications; then stop before Batch 2 scope definition, specification, planning, or implementation.

## Desired Outcome and Approaches

The audience is frontend developers and design-system maintainers already using Playwright Test. They can opt selected tests into evidence, keep ordinary Playwright authoring, review a portable Markdown account, and use native reports/traces for deeper debugging.

| Approach | Benefit | Tradeoff and disposition |
| --- | --- | --- |
| Stock Playwright recipes, reports, traces, and attachments | Smallest dependency and maintenance burden; strong native debugging | Requires assembling a review account; retained as a credible runnable comparison |
| Opt-in fixture plus reporter | Adds browser observations and consistent review evidence while preserving native tests | Adds integration and lifecycle complexity; selected for this increment |
| Explicit recording helpers around each action/check | Author controls recording boundaries precisely | Intrusive authoring and risk of a DSL; not selected in the approved release design |

The user selected the dialog package comparison and optional external feedback. This draft carries forward the release's fixture/reporter design rather than reopening it. Exact public names, module format, file layout, and tested dependency versions remain implementation-plan decisions within the constraints below.

## Design

### Integration and Authoring

- Deliver one small TypeScript package with Playwright Test as a peer dependency. Preserve the MIT license. Axe, React, a hosted service, and a separate CLI are not required.
- Provide an opt-in fixture and reporter that compose with an existing custom fixture setup. Onboarding uses the package dependency, shared fixture integration, a reporter configuration entry alongside an existing native reporter, and the ordinary Playwright command.
- Tests or selected groups explicitly opt in. Tests outside that scope produce no journey observations and are not represented as evaluated journeys.
- Keep native `page.keyboard`, locators, `test.step`, and `expect`. Do not monkey-patch actions/assertions, add per-action evidence wrappers or replacement matchers, or parse private traces.
- Authors declare a native locator for the ARIA snapshot root and explicit expected focus targets. Named steps and native assertion messages explain intent. The package observes and reports; it does not decide correct focus behavior.
- Use one page/main document, Chromium, ordinary light DOM, and semantic HTML examples. Label any programmatic focus/setup actions; they cannot stand in for the keyboard behavior being verified.
- A separate minimal TypeScript consumer must install the packed package, without importing repository source, demonstrate fixture composition and reporter coexistence, and run using documented normal Playwright commands. Packing and local installation do not authorize registry publication.

### Dialog Journeys

The correct example includes an accessible modal dialog with a declared name, opener, initial focus target, containment boundaries, and restoration target. Native assertions verify relevant semantics/name and:

1. Keyboard activation opens the dialog.
2. Focus reaches the explicitly declared appropriate initial target.
3. Forward Tab at the last boundary remains within the dialog at the expected target.
4. Shift+Tab at the first boundary remains within the dialog at the expected target.
5. Escape dismisses the dialog.
6. Focus returns to the declared restoration target.

Choose one explicit suitable focus policy for the example; do not imply every dialog must focus its first control or always restore to an opener that no longer exists. Sampled boundaries do not prove all focus paths.

Two isolated variants introduce only the relevant behavioral defect: focus escapes containment, or focus fails to return on dismissal. Each uses the corresponding correct journey's expectation and must reach and fail its intended assertion. Setup failures or earlier unrelated failures cannot count as demonstrating that defect. Even when a demonstration suite expects failure, preserve and verify the actual failed assertion.

### Observation and Evidence Integrity

- Record navigation/activation keys relevant to these journeys: Tab, Shift+Tab, Enter, Space, and Escape. Do not retain arbitrary printable input characters or field values in observation payloads. Space is retained only as the declared navigation/activation key, not as a typed-text history.
- Observe focus transitions in the opted-in main document, including changes caused by application code. Use small descriptors: observation-local element reference, tag, selected identifying DOM attributes, and relevant focus/state attributes. Document the chosen attribute allowlist and data implications. Do not compute accessible names or label raw DOM attributes as computed accessibility semantics.
- Handle document/body focus and disappearance of a previously focused element honestly. Preserve native locator strictness and assertion retries rather than guessing a target or overriding Playwright behavior.
- Preserve browser observation order with sequence numbers. Keep native step/assertion order distinct wherever exact correlation is unavailable. Timestamps or neighboring actions do not establish causation or a total order across unrelated clocks.
- Bound buffers and disclose truncation with incomplete capture. Malformed or unsupported scope has a visible configuration/capture outcome. Detectable unsupported navigation, frames, new pages, or shadow-root boundaries must be disclosed; do not promise comprehensive detection outside the supported scope.
- Use documented reporter categories/results for executed native assertions, their diagnostics, and available source/context. Do not parse human-readable titles/errors to invent structured expected/actual values. Preserve custom assertion messages and diagnostic text. Document unsupported assertion forms rather than implying custom matcher internals are understood.
- Distinguish actual test status, expected status, retry/attempt/repeat identity, assertion outcomes, and evidence completeness. Passing on retry cannot erase an earlier failure. Expected failures cannot become passing accessibility evidence. No executed assertions means no verified behavioral claim. Early failures show only executed checks and disclose that later checks may be absent, without inventing unexecuted checks.

### Capture, Handoff, and Markdown Reports

On actual failed opted-in journeys, capture a page screenshot and the declared-root ARIA snapshot by default when resources are available. Capture before fixture disposal when practical; label the actual capture phase/timing. A teardown-time artifact must not be described as the instant an assertion failed. Screenshot and snapshot controls are independent.

Missing roots, closed pages, and capture failures must preserve remaining evidence and show the reason for each unavailable artifact. Never silently widen a missing declared root to the full document. Capture/reporting errors must remain visible without replacing or obscuring original failures. Report-write failure needs a visible diagnostic through an available channel even when no report can be written. A passing test with failed evidence collection remains distinguishable from successful evidence production. Hard process termination may prevent finalization; no crash-proof guarantee is made.

Use the smallest private typed record for fixture-to-reporter handoff and rendering: format version, test/project/source identity, attempt/repeat/retry identity, actual/expected status, ordered observations, executed native steps/assertions and diagnostics, runtime context, artifact references/timing, and completeness/error/unsupported-boundary information. Private JSON serialization/attachments are allowed; they are not a public API or schema contract.

Produce one per-run Markdown report grouping selected tests and individual attempts. Include a concise summary, named steps, native assertion outcomes/diagnostics, keyboard/focus observations, test/source identity, reproduction guidance, actual runtime versions, artifact links, and capture limitations. Keep stable ordering where practical and volatile timing separate from the main narrative. Reference existing Playwright traces when available without starting another trace session or making basic review depend on one.

Keep artifact references relative to a portable report bundle where possible. Moving the bundle outside the checkout must retain useful review content and attachment links. Escape application-provided content, including diagnostics and identifying text, so Markdown/HTML-like inputs cannot inject report structure, links, or raw HTML. Generated trusted artifact links remain usable.

Screenshots, snapshots, attributes, locator diagnostics, and assertion errors may contain application data. Use synthetic fixture data and document the risk. Omitting typed values and disabling one capture type do not provide generic sanitization.

### Fair Stock Comparison and Feedback

Provide a runnable stock Playwright path for the same correct dialog and both broken variants, without requiring the package to execute it. Keep the same relevant keyboard actions, expected focus/semantics, synthetic fixtures, defect isolation, browser/toolchain, and reproduction conditions. Shared semantic fixtures are acceptable; the baseline cannot rely on package instrumentation to supply its evidence.

Configure useful native reporting and traces, named steps, diagnostic assertions, and ordinary failure attachments such as screenshots and declared-root ARIA snapshots when available. Disclose capture timing and unavailable attachments. The comparison must not obtain an advantage by deliberately weakening the baseline or withholding ordinary Playwright capabilities.

Record actual setup and authoring effort for both paths, including configuration, dependencies, evidence/attachment code, commands, and maintenance implications. Use a consistent review task: identify the failed expectation, observed focus, and reproduction path from each path's artifacts. Document the findings, limitations, and concrete examples; favorable results and a quantitative performance threshold are not completion requirements.

An author assessment must be labelled as an author assessment. Invite two or three intended users as an evaluation target when practical; this does not authorize sending messages and external participation is not a completion gate. Record real external findings only when available; otherwise state explicitly that external validation is pending. Do not invent reviewers, measured time savings, endorsements, or user validation.

## Acceptance Criteria

All IDs below belong to this Batch 1 specification. The release mapping describes intended coverage, not completed release acceptance.

| ID | Verifiable criterion |
| --- | --- |
| AC-01 | A separate minimal TypeScript consumer installs the packed artifact, composes its fixture with an existing custom fixture, configures its reporter alongside a native reporter, and runs opted-in dialog journeys with normal Playwright commands, without repository-source imports. |
| AC-02 | Native keyboard calls, locators, named steps, and assertions work without per-action wrappers, replacement matchers, or monkey-patching; a non-opted-in test produces no journey observations and is not described as evaluated. |
| AC-03 | Supported navigation/activation keys and focus transitions are captured in observation sequence order, with bounded buffers, no retained arbitrary printable characters/field values, honest separate native-step ordering, and visible unsupported-scope/truncation outcomes. |
| AC-04 | The correct dialog passes native checks for keyboard activation, declared initial focus, forward/backward containment boundaries, Escape dismissal, declared restoration, and relevant dialog semantics/name. |
| AC-05 | The two isolated broken dialogs reach and fail their intended containment/restoration assertions; reports preserve the actual failures and useful observed-focus evidence even when failure is expected by the suite. |
| AC-06 | Per-run Markdown reports group selected tests/attempts and contain test/project/source identity, actual/expected status, named steps, executed native assertions/diagnostics, keyboard/focus observations, runtime context, reproduction guidance, artifact links, and capture completeness. |
| AC-07 | Failed journeys with live resources capture default screenshots and declared-root ARIA snapshots with accurate timing labels. Tests verify both independent capture controls and retention of the other capture type. |
| AC-08 | Missing roots, closed pages, malformed scope, truncation, capture errors, and report-write failures produce visible outcomes. Original failures remain available, missing roots do not widen scope, and passed tests with failed evidence collection cannot appear to have complete evidence. |
| AC-09 | Retries preserve all attempts; concurrent tests have isolated observations and noncolliding artifacts; actual/expected statuses and repeat/retry identity remain separate; expected failure is never labelled as passing accessibility evidence. |
| AC-10 | No-assertion tests are labelled as having no verified behavioral checks. Early failures retain executed checks and disclose potentially absent later checks without inventing results. Supported native hard/soft assertion outcomes are exercised; unsupported assertion forms are documented honestly. |
| AC-11 | Reports and documentation limit claims to observed supported behavior and explicit assertions, including sampled dialog boundaries; they distinguish this evidence from screen-reader testing, inclusive user testing, and accessibility conformance. |
| AC-12 | Markdown/HTML-like application content cannot inject unintended report structure, links, or raw HTML. Synthetic data and documentation cover data in observations, screenshots, snapshots, and diagnostics without claiming general sanitization. |
| AC-13 | Moving a report/artifact bundle outside the checkout leaves its basic failure explanation and artifact references reviewable without a hosted viewer or available trace. |
| AC-14 | Documentation records the actually tested Node, TypeScript, Playwright, Chromium, and host/CI combinations for Batch 1, explicitly distinguishing untested environments. Compatibility declarations and claims stay within established evidence. |
| AC-15 | A runnable, useful stock Playwright baseline exercises the same correct and two broken dialog journeys with native reports/traces and ordinary attachments. Documented comparison covers actual setup/authoring effort and the reviewer's ability to identify the failed expectation, observed focus, and reproduction path on both paths. |
| AC-16 | Evaluation notes distinguish author assessment from real external findings. If external findings are unavailable, they explicitly record external validation as pending; reviewer participation and a positive package verdict are not completion gates. |
| AC-17 | Documentation provides onboarding, normal run/reproduction commands, synthetic passing/failing examples, capture/configuration limits, and tested-toolchain evidence. Completion notes map observed Batch 1 results to this specification and the release, identify remaining release work and provisional implications, and stop before starting Batch 2. |

### Release Traceability

| Original release IDs | Batch 1 criteria | Coverage boundary |
| --- | --- | --- |
| AC-01 | AC-01 | Packed consumer integration and reporter coexistence |
| AC-02 | AC-02 | Native authoring and opt-in isolation |
| AC-03 | AC-03 | Ordered, bounded keyboard/focus evidence |
| AC-04 | AC-04 | Correct dialog journey |
| AC-05 | AC-05 | Both isolated broken dialog variants |
| AC-08 | AC-06 | Dialog reports and executed outcomes |
| AC-09 | AC-07 | Failure captures and independent controls |
| AC-10 | AC-03, AC-08 | Visible incompleteness/errors and failure preservation |
| AC-11 | AC-09 | Retry/concurrency/status integrity |
| AC-12 | AC-10 | No-assertion and early-failure honesty |
| AC-13 | AC-11 | Limited accessibility claims |
| AC-14 | AC-12 | Escaping and application-data safeguards |
| AC-15 | AC-13 | Portable evidence |
| AC-16 | AC-14, AC-17 | Only toolchain/environment evidence actually established in Batch 1 |
| AC-17 | AC-15, AC-16 | Dialog comparison initially; external validation pending unless real results exist |
| AC-06–07 | None | Deferred form journeys and isolated broken variants |

Shared infrastructure coverage in this batch does not assert that the form pattern or the complete v0.1 release has been verified. Batch 1 completion notes must make that distinction explicit.

## Validation Approach

- Use focused unit/integration checks for observation filtering/order/bounds, private handoff, rendering/escaping, status handling, and contextualized failure outcomes. Verify outcomes rather than implementation-shaped checks.
- Run the correct and both broken dialog journeys in real Chromium on both package and stock paths. Verify the broken tests' intended native assertion failures explicitly, including in expected-failure demonstrations.
- Exercise native assertion diagnostics and supported soft assertions; no-assertion and early-failure cases; passing tests with incomplete evidence; retries, repeat identity, and parallel isolation; lost focus/elements, removed roots, closed pages, malformed/unsupported scopes, truncation, capture failures, and failed report output. Cover independent screenshot/snapshot controls.
- Pack and install into the separate consumer to verify exports, peer integration, fixture composition, reporter coexistence, normal execution, and absence of source-import shortcuts. Move an artifact bundle and verify its links/basic failure account remain useful.
- Document the actual bounded toolchain and environment used. The eventual plan must recheck published versions and required documented APIs before selecting versions and compatibility bounds. Registry observations in the release are historical metadata, not tested versions or dependency commitments.
- Produce a synthetic passing report and meaningful failing reports with reproducible commands. Compare setup/authoring effort and evidence review using the same stated task and fair baseline. Record author findings and external evaluation status separately.
- Complete required specification and quality review during the separately authorized implementation workflow. No browser/package validation is claimed by creating or approving this document.

## Constraints, Edge Cases, and Out of Scope

Retain all exclusions and evidence-integrity constraints in the approved release. In particular:

- Keep dependency and maintenance costs small. No speculative abstraction, public JSON schema/API, separate runner/CLI, framework, custom journey DSL, automatic pattern discovery, or automatic correctness verdict.
- No forms in this increment; no menus, comboboxes, nested dialogs, route changes, frames/multiple pages, shadow-root traversal, or additional-browser support claims.
- No full DOM dumps, second trace recorder, visual recording, dashboard, hosted backend, AI, billing, n8n, editor/browser extension, setup generator, or dedicated Storybook adapter.
- No automated screen-reader output, ARIA-AT execution, certification, or conformance claims. Screenshots, DOM focus, and ARIA snapshots establish different limited evidence; they do not establish focus-indicator quality or a complete keyboard experience.
- Ambiguous locators retain native strictness errors. Removed targets and body/document focus must remain explicit; asynchronous focus changes must not be presented as precise causal proof. Process termination can prevent finalization.
- No registry publication, unsolicited external messaging, push, or merge. No Git update, branch/worktree creation, dependency installation, scaffold, or product change during specification work.

## Notes and Approval Handoff

Author-selected elaborations within the confirmed scope: document the focus-descriptor allowlist, use the same review task for both comparison paths, record comparison cost with concrete configuration/code evidence, and require completion notes to retain release continuity. These define verifiable evidence without prescribing export names, module format, numeric buffer defaults, repository layout, or a universal dialog focus policy. Those bounded implementation choices belong in the later plan.

No new material scope/design ambiguity was identified from the confirmed handoff and release reference. Future material questions must use the user's required native interactive clarification control; if needed but unavailable, request Plan mode and wait. No clarification answer itself approves this document.

**Current stage:** Stage 3, implementation planning. The user's `approved` message on 2026-10-27 approved this specification after its Stage 2 presentation. This authorizes writing a separate Batch 1 implementation plan only. It does not approve that future plan or authorize implementation.

After explicit specification approval, resolve this artifact by slug or exact path. A newly created plan must use `docs/superpowers/plans/2026-10-27-batch-1-dialog-package-comparison.md`, record its own Created/Updated dates and the same Slug, and explicitly reference this specification. Carry the release relationship, criterion mapping, deferred work, and execution endpoint into that plan and its completion notes. Do not create a separate roadmap or Batch 2 artifacts.

Keep this specification uncommitted. Only after separate specification and plan approvals may the implementation workflow safely update `main`, create the conventional implementation branch in this checkout, and commit the artifacts. Preserve existing local work; do not create a worktree without an explicit request.
