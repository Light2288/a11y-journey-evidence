# Batch 2: Form Package Comparison

**Created:** 2026-10-27

**Updated:** 2026-10-27

**Slug:** `batch-2-form-package-comparison`

**Type:** feature

**Status:** APPROVED

**Provenance:** Approved release specification; merged Batch 1 and its results; native interactive selections of `aria-describedby` and first-invalid-field focus; the user's `i confirm this proposal` message approving Stage 1 scope/design; the subsequent `spec definition and plan approved / out of plan mode, write the files` message approving the presented specification and authorizing its materialization. No Batch 2 implementation plan had been presented when that message was sent.

**Approval state:** Scope/design and specification approved. The saved implementation plan was subsequently presented and separately approved with `approved`; Stage 4 implementation is authorized.

## Problem and Current Behavior

Batch 1 provides the dialog examples, bounded observer, opt-in fixture, failure captures, reporter, portable Markdown bundles, stock comparison, and packed-consumer verification.

Inspection before saving this artifact found the repository clean on `main` at merge commit `af6bd05`. Its demo configurations select dialog tests, stock snapshots target the dialog, and the independent packed consumer exercises a correct dialog and an unselected control.

Form coverage required by release AC-06–07 remains unestablished. Descriptors do not yet include `aria-invalid` or `aria-describedby`.

Batch 1's author assessment identified potential review benefits alongside maintenance and report-verbosity costs. External validation remains pending.

## Desired Outcome and Delivery Boundary

The wider direction remains a small v0.1 package supporting explicit dialog and form journeys through native Playwright.

This increment delivers:

- A correct keyboard form journey.
- Two isolated form regressions.
- Equivalent package and stock Playwright execution.
- Useful portable failure evidence.
- Form integration in the packed consumer.
- Regression verification, documentation, and author comparison findings.

The uncertainty is whether the existing evidence model usefully explains validation, error association, focus, and correction without introducing another package API.

The boundary includes setup, semantics, keyboard behavior, failure isolation, captures, consumer integration, and documentation because these together produce an independently demonstrable outcome.

## Approaches and Confirmed Decisions

| Decision | Selected approach | Alternative considered |
| --- | --- | --- |
| Error association | Visible inline errors referenced through `aria-describedby`; native accessible-description assertions | `aria-errormessage`, which has distinct semantics and requires its corresponding assertions |
| Invalid-submit focus | First invalid field | A focused error summary with navigation links |
| Integration | Existing fixture/reporter and shared native journey | A form-specific assertion framework, which would duplicate native capabilities |

No public API, export, option, or matcher changes are required.

## Form Design

The following concrete example details are author-selected within the confirmed scope:

- A named semantic form, `#form`.
- Two labelled, required text inputs: **Name** (`#name`) and **Team** (`#team`).
- A **Submit** button, `#submit`.
- Error messages: **“Enter a name.”** and **“Enter a team.”**
- Empty and whitespace-only values fail required-field validation.

Use in-page validation on submission. Disable browser constraint-validation UI with `novalidate` so it cannot supply the focus movement omitted by the broken variant. Submission stays local, without navigation, network calls, or persistence.

Initially, both fields are empty, errors are hidden, `aria-invalid="false"`, and error-description references are absent. There is no autofocus. The only focusable controls appear in the order Name, Team, Submit.

The journey reaches Submit using Tab and activates it with Enter. Invalid submission:

1. Shows an error for each missing field.
2. Sets its `aria-invalid="true"`.
3. Associates it with its own error through `aria-describedby`.
4. Moves focus to the first invalid field in DOM order.

Valid fields remain unmarked and have no error reference. Visible feedback and its association are checked separately.

The shared native journey checks submission, visible errors and invalid states, declared associations, then declared focus. Use native `toHaveAccessibleDescription` and `toBeFocused` assertions. Raw attributes and ARIA snapshots support these assertions; they do not establish screen-reader announcements.

For correction, use ordinary `page.keyboard` actions to enter synthetic values, navigate, and resubmit. Locator filling or programmatic test focus must not substitute for claimed keyboard interaction.

Validation updates on submission only. Successful resubmission:

- Hides stale errors.
- Sets `aria-invalid="false"`.
- Removes error-only `aria-describedby` references.
- Displays a success message through a native `role="status"` element inside the form.
- Keeps `#form` attached and does not echo submitted values.

No broader success-focus or announcement policy is asserted.

Supporting regressions verify that a valid Name and missing Team focus Team, and that whitespace-only input remains invalid. These are supporting cases rather than additional demo variants.

## Isolated Broken Variants

**`missing-error-association`**

Omit only Name's `aria-describedby` after invalid submission. Its error remains visible, its invalid state remains correct, and focus still moves to Name.

The shared journey must fail at the same Name accessible-description assertion that passes for the correct variant. A separate isolation check verifies that focus behavior remains correct.

**`failed-error-focus`**

Omit only the invalid-submit focus movement. Both errors, invalid states, and description references remain correct. Keyboard submission leaves focus on Submit.

The shared journey must pass the preceding semantic and association checks, then fail at the same Name focus assertion that passes for the correct variant.

Earlier unrelated failures and unexpected passes do not satisfy acceptance. Expected-failure demonstrations retain their actual failed assertion outcomes. Reports show only assertions that executed.

## Observation and Evidence

Add only `aria-invalid` and `aria-describedby` to the existing descriptor allowlist.

These raw attributes are sampled during existing observations. This does not introduce continuous attribute tracking, computed descriptions, a new observation type, or a new private handoff version.

Preserve existing bounds, sequence ordering, local element references, 256-character attribute clipping with disclosure, and supported-key filtering. Form observation checks must demonstrate that typed field values and printable Space are absent from observation payloads.

Screenshots, snapshots, native diagnostics, and traces can still contain application data. Typed-value exclusion is not general sanitization.

Package tests call `journey.start` once after content setup and before actions, declaring `#form` as the snapshot root. Preserve existing capture defaults, independent controls, attempt isolation, teardown timing, and explicit unavailable outcomes.

For each intended failure, Markdown must explain the native expectation and diagnostic, with observed focus where relevant, without requiring a trace. A failing form bundle must remain useful after moving outside the checkout, with generated artifact links resolving.

Stock tests use native Playwright and shared example code only. They retain ordinary focus, screenshot, scoped form snapshot, capture-timing attachments, native reports, and traces. Preserve dialog-specific capture roots; never broaden a missing root silently.

Both paths use identical form fixtures, setup timing, native actions/assertions, and trace policy. Demo entry points cover both patterns and allow filtering to a form variant.

## Consumer Integration and Verification

Extend the fresh packed consumer with a correct form test while retaining its dialog and unselected control.

Verify installation from the packed artifact, existing custom-fixture composition, native reporter coexistence, evidence for selected tests only, and moved-bundle links. Consumer HTML remains independent of repository example imports.

Use real Chromium verification for the correct form and both broken variants through both paths, plus the first-invalid, isolation, whitespace, and observation-data cases.

Rerun existing unit, observation, fixture, reporting, bundle, dialog, and consumer checks. The current command contract is:

```sh
npm test
npm run demo:package
npm run demo:stock
npm run verify:consumer
git diff --check
```

Any command changes must be explicit in the later implementation plan and documentation. Behavioral changes require meaningful RED→GREEN checks. Implementation includes the existing integrated sequential final review.

## Acceptance Criteria

| ID | Verifiable criterion |
| --- | --- |
| AC-01 | Both paths' correct form passes keyboard invalid submission, visible errors, invalid states, and exact native accessible-description checks associated with the corresponding visible errors. |
| AC-02 | Both-invalid input focuses Name; valid Name and missing Team focus Team without marking Name invalid; whitespace-only required input is rejected. Test setup does not mask the focus policy. |
| AC-03 | Keyboard correction and resubmission succeed; stale errors and references clear, invalid state resets, and a success status appears while the form remains attached. |
| AC-04 | Both paths' missing-association variant fails the intended shared description assertion after preceding checks pass; isolation verification confirms correct focus behavior. |
| AC-05 | Both paths' failed-focus variant passes preceding error/association checks and fails the intended focus assertion with actual focus on Submit. Unexpected passes or unrelated failures fail regression verification. |
| AC-06 | Both paths share form fixtures and native journeys, preserve actual/expected statuses and trace policy, and retain existing dialog behaviors. Stock uses no package instrumentation. |
| AC-07 | Descriptors include the two added attributes when present, preserving bounds and filtering. Form observations exclude typed values and printable Space. No public API or observation-type expansion occurs. |
| AC-08 | Intended package failures have useful text explanations, scoped artifacts, accurate capture outcomes/timing, and portable bundles. Stock supplies native diagnostics, focus/screenshot/form-snapshot/timing attachments and traces. |
| AC-09 | The fresh packed consumer runs selected form and dialog tests with fixture composition and native reporters, excludes the control from evidence, and preserves installed declarations, source isolation, and moved links. |
| AC-10 | Existing regression checks, combined demos, packed consumer, and whitespace validation succeed. Record exact commands, exits, and decisive output without inferring broader compatibility. |
| AC-11 | Documentation explains the chosen semantics, focus policy, onboarding, filtering/reproduction, data/capture limits, and actual tested environment. Author comparison records setup and failure-review findings for both paths. External validation remains pending unless genuine findings are supplied. |
| AC-12 | Completion notes map evidence to release criteria, identify remaining gaps and the deferred minor, and stop at this increment's endpoint without automatically declaring v0.1 acceptance or publication complete. |

## Release Mapping and Constraints

| Release criteria | Batch 2 contribution |
| --- | --- |
| AC-06 | Correct form behavior: Batch 2 AC-01–03 |
| AC-07 | Isolated form failures: Batch 2 AC-04–05 |
| AC-04–05 | Existing dialog regression verification |
| AC-01–03, AC-08–15 | Consumer, observation, reporting, capture, portability, and existing regression evidence |
| AC-16 | Actual Batch 2 toolchain record |
| AC-17 | Form comparison and honest evaluation status |

Preserve the approved release specification and Batch 1 artifacts and their history unchanged.

Continue ESM-only packaging, existing TypeScript/native Playwright/Node tooling, current pinned dependencies, Chromium, one page/main document, ordinary light DOM, and synthetic data.

Batch 1's recorded toolchain is historical evidence, not Batch 2 execution proof. Record the versions and host actually exercised during this increment. Other environments and CI remain untested.

The existing-checkout Git workflow applies after separate specification and plan approvals. Preserve unrelated edits and commit locally. No branch creation, update of `main`, or commit is authorized at this specification-materialization stage.

## Out of Scope

- The deferred nested-contenteditable Space-key minor.
- Report redesign, a form DSL, or automatic focus-policy inference.
- New frameworks, runtime dependencies, patterns, browsers, hosts, or CI support.
- Screen-reader automation or accessibility-conformance verdicts.
- Registry publication, push, merge, external messaging, or subsequent-increment artifacts.

## Notes and Approval Handoff

Name/Team labels, exact messages and synthetic values, nonempty validation, submit-only error updates, and keeping the form mounted are author-selected concrete details. File organization, exact named-step wording, regression organization, and command adjustments belong in the implementation plan.

The complete DRAFT was presented in chat during Plan mode. Its fresh builder check returned **“nothing important left.”** The user subsequently approved the presented specification with `spec definition and plan approved / out of plan mode, write the files`. This file materializes that approved content, preserves its original creation date, and updates only approval/storage lifecycle details.

**Current stage:** Stage 4, implementation authorized after presentation and separate approval of `docs/superpowers/plans/2026-10-27-batch-2-form-package-comparison.md`. The earlier combined reference to plan approval did not approve an unseen artifact; the later `approved` message supplied the required separate plan approval.

**Execution endpoint:** deliver the approved form increment, complete verification and sequential review, record author findings and remaining release gaps, commit locally, then stop before later work.
