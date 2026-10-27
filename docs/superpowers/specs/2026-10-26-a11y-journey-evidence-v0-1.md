# A11y Journey Evidence v0.1

**Created:** 2026-10-26  
**Updated:** 2026-10-26  
**Slug:** `a11y-journey-evidence-v0-1`  
**Type:** feature  
**Status:** APPROVED  
**Provenance:** User request to start A11y Journey Evidence in the existing repository; interactive clarification and Stage 1 scope/design proposal in this chat; the user's first `approved` message authorized drafting. After presentation of this specification, the user explicitly approved it with `approved, but wait for my input in a new prompt before starting with the plan`. Supporting local sources are listed under Evidence and References.  
**Approval state:** Scope/design and specification approved. Do not start implementation planning until the user's new prompt. No implementation plan is approved, and implementation is not authorized.

## Problem

A frontend or design-system reviewer investigating a keyboard regression needs to understand which action occurred, where focus moved, what the test expected, and what evidence supports the failure. Playwright can already execute and debug these tests, but assembling a compact account for review requires additional work.

A11y Journey Evidence will assemble that account from existing Playwright tests. Its contribution is the review experience, focused observation, and trustworthy examples. It does not introduce a new accessibility scanner or replace Playwright's runner, assertions, or tracing.

The project also provides a concrete frontend/platform engineering portfolio artifact: a small reusable package, clear boundaries, meaningful failure cases, consumer integration, and evidence of usefulness beyond the author's own demo.

## Repository Evidence

Read-only inspection on 2026-10-26 found an existing Git repository on `main`, tracking `origin/main`, with initial commit `5647a44`. The worktree was clean before this specification. The repository contained `README.md`, a Node-oriented `.gitignore`, and an MIT license; no package manifest, application source, tests, specifications, or plans existed.

The folder and repository were created by the user. No scaffold, dependency installation, Git initialization, branch change, fetch/update, worktree, push, or merge was performed during discovery.

## Desired Outcome and Audience

The primary audience is frontend developers and design-system maintainers who already use Playwright Test. They can enable evidence for selected tests, keep ordinary Playwright actions and assertions, and receive a useful local Markdown report with failure artifacts.

Success means a reviewer can identify a tested expectation, the observed focus behavior, the failure, and a reproduction path without first exploring a full trace. Playwright's native reports and traces remain available for deeper investigation.

The package must earn its place through usefulness compared with stock Playwright recipes. If intended-user evaluation finds little benefit, extending or promoting the package is not automatically justified.

## Confirmed Decisions and Constraints

- One small TypeScript package integrating with existing Playwright Test projects.
- Opt-in fixture plus a small reporter; normal Playwright keyboard actions, locators, `test.step`, and `expect` remain the authoring model.
- Chromium initially; one page and its main document with ordinary light-DOM content.
- Two documented patterns: a modal dialog and a form with validation errors.
- Markdown is the public report output. A public JSON contract and a separate CLI are unnecessary for v0.1.
- Screenshots and scoped ARIA snapshots are enabled by default for failed opted-in journeys, with capture controls and documented data implications.
- Solo development with no fixed weekly budget or calendar commitment. The earlier 8–12 hours/week assumption is superseded.
- Keep dependencies and maintenance small. Playwright is a peer dependency; axe is not a required dependency. Use semantic HTML examples without requiring React.
- Preserve the existing MIT license and user-created repository contents unless an approved implementation task requires an explained change.
- No hosted service, visual recorder, Next.js application, cloud backend, AI, billing, or n8n dependency.

## Approaches Considered

| Approach | Benefits | Tradeoffs | Disposition |
| --- | --- | --- | --- |
| Stock Playwright recipes | Lowest maintenance; immediately useful examples and a comparison baseline | Each user assembles review evidence | Retain as the baseline for evaluating added value |
| Opt-in fixture and reporter | Keeps native tests and consistently combines observations with results | Requires observer lifecycle and reporter integration | Selected by the user |
| Explicit recording helpers around actions/checks | Precise author-controlled capture boundaries | Adds calls throughout tests and risks growing into a DSL | Not selected |

A reporter alone can read native test results but does not supply browser focus observations. The fixture supplies those observations; the reporter uses documented Playwright result/step APIs to assemble the report. Do not monkey-patch Playwright actions or assertions or parse private trace formats.

## Proposed Design

### Integration and Authoring

Target onboarding consists of one development dependency, fixture integration in the consumer's shared test setup, one reporter configuration entry, and the existing Playwright command. The fixture must compose with an existing custom fixture setup; users must not recreate their test framework.

Evidence is explicitly enabled for selected tests or a selected test group. The reporter may coexist with the consumer's existing reporters. Tests outside the selected scope are not instrumented or represented as evaluated journeys.

The test author declares the journey's ARIA snapshot root using a native locator, such as the dialog or form. Named native steps and assertion messages express intent. The package observes and presents results; it does not infer a universally correct focus target or create a pattern-specific assertion language.

Use `page.keyboard` for the keyboard behavior being exercised. Programmatic focus or locator actions that move focus may be used for explicitly labelled setup, but must not stand in for the keyboard behavior a test claims to verify.

Exact export names, option names, packaging/module format, and file organization are decisions for the implementation plan. They must preserve these integration requirements and must not add a DSL or configuration framework.

### Observation

Capture relevant navigation/activation keys for the two supported patterns: Tab, Shift+Tab, Enter, Space, and Escape. Do not record arbitrary printable characters or form field values. Record observed focus transitions, including movement caused by application code, within the opted-in main document.

An observation is evidence of what was observed, not proof of a causal relationship to the nearest action. Preserve browser event order with sequence numbers. Keep native step/assertion order and observation order distinct where their precise correlation is unavailable; do not manufacture a total order from unrelated clocks.

Use small focus descriptors: an observation-local element reference, tag, relevant identifying DOM attributes, and relevant focus/state attributes. Handle focus on the document/body and loss of a previously focused element explicitly. Do not implement accessible-name computation or describe raw `aria-label`/`role` attributes as computed accessibility semantics. When additional accessible context is needed, use Playwright's ARIA snapshot.

Observation buffers must be bounded. If the bound is reached, disclose truncation and mark capture incomplete instead of silently losing observations. A malformed or unsupported scope must produce a visible configuration/capture outcome.

The v0.1 journey remains in one main document. Navigation, frames, new pages, and shadow-root traversal are unsupported boundaries. If capture encounters an identifiable unsupported boundary, disclose the limitation rather than reporting comprehensive coverage.

### Native Assertions and Outcomes

Use documented Playwright reporter step categories and results to retain native assertions and failure diagnostics. Do not reconstruct structured expected/actual values by parsing human-readable step titles or errors. Preserve assertion messages and relevant diagnostic text; these can supply the expected focus target or semantic condition.

A passed assertion means that its declared condition passed. A passed test does not establish overall accessibility. A journey that executed no assertions must not be presented as verified keyboard/focus behavior.

Keep actual Playwright status, expected status, attempt/retry identity, and evidence completeness separate. An expected-failure demonstration still contains an actual failed assertion; it must not be displayed as passing accessibility evidence. A retry that passes must not erase the earlier failed attempt.

After an early failure, report only assertions actually executed and explain that later checks may not have run. Do not invent a list of unexecuted assertions from code the tool has not inspected.

### Failure Artifacts

On an actual failure, capture a page screenshot and an ARIA snapshot of the declared root when possible. Allow screenshots and ARIA snapshots to be disabled independently. These controls do not promise generic sanitization of application data.

Capture must occur before fixture resources are disposed when practical. Label artifact timing accurately: a teardown screenshot depicts teardown-time state, not necessarily the instant the assertion failed. If a root has disappeared, the page has closed, or capture fails, record the reason and retain other available evidence. Do not silently expand a missing scoped root into a full-page snapshot.

Artifact capture/reporting failures must remain visible and must not replace or obscure the original test failure. A missing report or failed write cannot be silently treated as successful evidence production. A test may pass while evidence collection fails; report that distinction explicitly.

Reference existing Playwright traces when available. Do not start a second trace session or depend on traces to produce the basic Markdown report. Keep artifact references relative to the report/artifact bundle where possible so the bundle is usable outside the original checkout.

Reports, screenshots, ARIA snapshots, locator diagnostics, and assertion errors may contain application data. Document that risk, use synthetic fixture data, and avoid claiming that omitting typed values makes all outputs safe to share. Escape application-provided text in Markdown so it is displayed as evidence rather than rendered as arbitrary HTML or unintended report structure.

### Internal Evidence Format

Use the smallest private typed record that supports capture, reporter handoff, and Markdown rendering:

- Internal format version and tool/environment metadata.
- Test identity, project, source location, repeat/attempt/retry identity, actual and expected status.
- Ordered browser observations and native step/assertion results with available source/context references.
- Artifact references, artifact timing, capture errors, unsupported boundaries, and truncation/completeness state.

Record the actual Playwright and Chromium versions used, together with the tool/runtime information available to the integration. Avoid nondeterministic machine-specific details in the review narrative unless needed to explain the run.

Internal JSON serialization or an internal attachment is allowed for fixture-to-reporter communication. It is explicitly private, may change between package versions, and is not a supported integration contract. Do not add JSON Schema tooling solely to formalize this private handoff.

The report is a per-run Markdown document grouping selected tests and their individual attempts. Include a concise summary, test/source and environment context, named steps, relevant keyboard/focus observations, assertion outcomes and diagnostics, artifact links, and capture limitations. Preserve stable ordering where practical and keep volatile timing information separate from the main narrative.

### Dialog Recipe and Examples

The correct dialog example supports keyboard activation, explicit appropriate initial focus, forward and backward tab containment at tested boundaries, Escape dismissal, and restoration to the declared target. Assert dialog semantics/name using native Playwright capabilities where relevant.

The recipe follows WAI guidance while keeping initial and restored focus targets explicit. It does not claim every dialog must focus its first control or restore to an opener that no longer exists.

Supply isolated broken variants for focus escaping the modal and focus failing to return on dismissal. Each must reach and fail its intended assertion without another defect masking the targeted behavior. Sampled boundaries do not prove all possible focus paths are correct.

### Form Recipe and Examples

The correct form example supports keyboard submission, visible error feedback associated with the relevant field, an explicit error-focus policy, keyboard access to correction, and successful resubmission. Check the example's chosen native/ARIA error semantics using the appropriate Playwright assertions. Do not treat `aria-describedby` and `aria-errormessage` as interchangeable APIs.

Focus on a summary or on an invalid field can both be intentional application choices. The test declares the expected target; the package does not prescribe one universal policy. DOM error semantics do not prove that a screen reader announces the error.

Supply isolated broken variants for a missing declared error association and a failure to move focus to the declared error target. The correct and broken variants must use the same relevant expectation so the failure demonstrates a real behavioral difference.

## Acceptance Criteria

| ID | Verifiable criterion |
| --- | --- |
| AC-01 | A separate minimal TypeScript consumer can install the packaged artifact, integrate its fixture with an existing fixture, add its reporter alongside a native reporter, and run opted-in journeys using the normal Playwright command. |
| AC-02 | Native Playwright keyboard calls, locators, named steps, and assertions work without per-action evidence wrappers or replacement matchers; tests not opted in produce no journey observations. |
| AC-03 | Opted-in supported journeys record the specified navigation/activation keys and focus transitions in observation order, without retaining printable input characters or field values in the observation payload. |
| AC-04 | The correct dialog example passes assertions for keyboard activation, declared initial focus, forward/backward containment boundaries, Escape dismissal, and declared focus restoration. |
| AC-05 | Two isolated dialog variants fail the corresponding containment/restoration assertions, and their reports retain actual failed outcomes with useful focus evidence. |
| AC-06 | The correct form example passes keyboard submission, visible/associated errors, declared error-focus behavior, keyboard correction, and successful resubmission checks. |
| AC-07 | Two isolated form variants fail the corresponding error-association/error-focus assertions, with reports that identify the intended failed checks. |
| AC-08 | Markdown reports include selected test/attempt identities, actual and expected statuses, executed native assertions and diagnostics, keyboard/focus observations, runtime versions, artifact references, and capture completeness. |
| AC-09 | On failed journeys with live resources, screenshots and declared-root ARIA snapshots are captured by default and linked with accurate timing labels; each capture type can be independently disabled. |
| AC-10 | Missing roots, closed pages, observation truncation, capture errors, and report-write failures have visible outcomes. Available original assertion failures remain intact; partial capture cannot appear complete. |
| AC-11 | A retry preserves the earlier failed attempt; concurrent tests have isolated observations and noncolliding artifacts; an expected-failure demo is not labelled as passing accessibility evidence. |
| AC-12 | A test with no executed assertions is not represented as verified behavior. Early failures show executed checks and disclose that later checks may be absent without inventing their results. |
| AC-13 | Reports and documentation clearly limit results to observed behavior and explicit assertions; they distinguish this evidence from screen-reader testing, inclusive user testing, and accessibility conformance. |
| AC-14 | Application-provided Markdown/HTML-like text is rendered as evidence without unintended structure, links, or executable/raw HTML; the documentation explains that artifacts and diagnostics can contain application data. |
| AC-15 | A report/artifact bundle remains reviewable after moving it out of the original checkout. The report does not depend on a hosted viewer or available Playwright trace to explain the basic failure. |
| AC-16 | Release documentation records the actually tested Node, TypeScript, Playwright, Chromium, and host/CI combinations. Compatibility ranges do not exceed established evidence, and no additional browser support is claimed. |
| AC-17 | A runnable stock-Playwright baseline and the same journeys using this package allow comparison of authoring/setup effort and review usefulness. Record real intended-user evaluation results or explicitly state that external validation remains pending. |

## Validation Approach

- Test observation handling, bounded capture, internal handoff, report rendering, escaping, and failure outcomes at the appropriate unit/integration level.
- Exercise the correct examples and all four isolated broken variants in real Chromium. Evaluation must verify that broken variants actually fail the intended checks, including when a demonstration suite expects those failures.
- Exercise retries, parallel execution, soft/native assertion outcomes as supported by the selected Playwright version, removed roots, page closure, and capture/output failures. Report unsupported assertion forms honestly rather than implying all custom matcher internals are understood.
- Pack and install into a separate consumer to verify exports, peer integration, fixture composition, reporter coexistence, and artifact portability. Reusing only repository-relative source imports is insufficient.
- Provide a synthetic passing report and meaningful failing reports with reproduction instructions and clear capture limits.
- Invite two or three intended users to identify the failed expectation, actual focus target, and reproduction path, and compare the report with stock Playwright output. This is a proposed evaluation target, not an asserted commitment from external reviewers. Keep evaluation status separate from technical acceptance; do not claim user validation before recording it.

## Edge Cases and Limits

- Role/name locators can be ambiguous; preserve native strictness errors instead of guessing a target.
- Focus can land on the document, disappear with a removed element, or change multiple times before an assertion settles. Record observations without replacing Playwright's retrying assertion semantics.
- Reporter-only failures and capture-only failures are distinct from application assertion failures. Errors must be contextualized and visible rather than swallowed.
- Hard process termination can prevent finalization. Do not promise crash-proof artifacts or present absent evidence as successful capture.
- Screenshots show visual state, ARIA snapshots represent accessible structure, and DOM focus represents browser focus. None establishes actual screen-reader output, reading order experience, focus-indicator quality, or complete keyboard usability.
- Versions and operating systems can change behavior. Support claims are limited to combinations actually verified for the release.

## Out of Scope

- A custom journey DSL, runner, generic framework, pattern auto-discovery, or automatic determination of correct focus behavior.
- Menus, comboboxes, route changes, nested dialogs, cross-frame or multi-page journeys, shadow-root traversal, or cross-browser support claims.
- Full DOM dumps, a second trace recorder, visual recording, report dashboards, hosted services, application backends, AI, billing, and n8n integration.
- A public JSON API/schema, separate CLI, report baseline/diff engine, custom GitHub Checks, automatic PR posting, or dedicated GitHub Action.
- Screen-reader automation, ARIA-AT execution, accessibility certification, or automated conformance verdicts.
- Chrome/editor extensions, setup generators, and dedicated Storybook adapters. Later usage ideas are not an approved roadmap and must not expand v0.1's contract.

## Evidence and References

### Local Sources

The current request and confirmed scope take precedence over broader historical suggestions such as a DSL, additional patterns, multiple public formats, and cross-browser testing.

- `/Users/davide/Personal/Projects/opencode_notes/career-tech-analysis/10-catalogo-progetti.md`, section 25, A11y Journey Evidence: audience, portfolio rationale, historical broader proposal, and manual-AT limitation.
- `/Users/davide/Personal/Projects/opencode_notes/career-tech-analysis/11-shortlist-progetti.md`, open-source shortlist and A11y section: frontend/platform positioning, small useful release, and sustainable maintenance.
- `/Users/davide/Personal/Projects/opencode_notes/career-tech-analysis/12-top-20-progetti.md`, section 3: Chromium, dialog/form scope, and the requirement to establish contribution beyond existing tools.
- `/Users/davide/Personal/Projects/opencode_notes/docs/analysis/personal-project-tracker.md`: prior candidate status and future n8n report-consumer proposal; neither was an implementation approval.

### Official Capability Comparison

Consulted during discovery on 2026-10-26:

- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing): existing test integration, scans after UI interaction, and manual-testing limits. Axe is not restricted to the initial state of a static page.
- [Playwright locator assertions](https://playwright.dev/docs/api/class-locatorassertions): existing focus, accessible-name/description/error-message, role, and state assertions; these must be reused rather than reimplemented.
- [Playwright ARIA snapshots](https://playwright.dev/docs/aria-snapshots) and [Trace Viewer](https://playwright.dev/docs/trace-viewer): accessible-structure snapshots and rich action/debug evidence already exist.
- [Playwright fixtures](https://playwright.dev/docs/test-fixtures), [reporters](https://playwright.dev/docs/test-reporters), [Reporter API](https://playwright.dev/docs/api/class-reporter), [TestStep](https://playwright.dev/docs/api/class-teststep), and [TestInfo](https://playwright.dev/docs/api/class-testinfo): supported integration and evidence/result access points.
- [axe-core](https://github.com/dequelabs/axe-core): automated rules and findings, including incomplete findings requiring review. This project adds journey-specific evidence presentation, not competing rules.
- [ARIA-AT](https://github.com/w3c-cg/aria-at), [interoperability reports](https://aria-at.w3.org/), and [automation harness](https://github.com/w3c/aria-at-automation-harness): actual AT/browser interoperability testing, with manual and automated workflows. Do not characterize ARIA-AT as merely a static scanner or exclusively manual.
- [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) and [form notifications](https://www.w3.org/WAI/tutorials/forms/notifications/): grounds for the examples and their explicit policies, not proof of full conformance.

### Version Observations, Not Compatibility Claims

Publisher registry metadata returned these versions during discovery on 2026-10-26: [Playwright Test 1.64.1](https://registry.npmjs.org/@playwright%2Ftest/latest), [TypeScript 7.0.2](https://registry.npmjs.org/typescript/latest), [axe-core 4.14.0](https://registry.npmjs.org/axe-core/latest), and [axe Playwright integration 4.14.0](https://registry.npmjs.org/@axe-core%2Fplaywright/latest). The observed Node engine declarations differed by package; do not infer a shared minimum from one dependency's metadata.

No package installation, browser execution, or compatibility matrix was verified during discovery. The implementation plan must recheck published versions and the selected APIs and specify a bounded tested toolchain before implementation. Axe versions are comparative research, not v0.1 dependency commitments.

## Notes and Approval Handoff

Author-selected bounded details, made explicit for review: semantic HTML fixtures, one Markdown report per run grouped by attempts, author-declared snapshot roots, bounded observation buffers, separate event/native-step ordering when exact correlation is unavailable, independently disableable failure captures, and portable artifact references. These elaborate the approved direction without adding release features.

The user approved this specification on 2026-10-26 with the message `approved, but wait for my input in a new prompt before starting with the plan`. This approval satisfies the specification gate only. Planning must wait for that new prompt. No implementation plan has been created, and implementation remains unauthorized.

When the user supplies the new prompt to start planning, the plan must use the same basename at `docs/superpowers/plans/2026-10-26-a11y-journey-evidence-v0-1.md`, record its own Created/Updated dates and shared Slug, and explicitly reference this specification. Its approval is a separate gate.

Keep specification and plan changes uncommitted until both are approved and the implementation branch is created under the user's Git workflow. Do not update `main`, create a branch/worktree, push, or merge at this stage.
