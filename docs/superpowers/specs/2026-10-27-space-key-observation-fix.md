# Space-Key Observation Fix

**Created:** 2026-10-27

**Updated:** 2026-10-27

**Slug:** `space-key-observation-fix`

**Type:** bug

**Status:** APPROVED

**Provenance:** The deferred minor recorded in `docs/batch-1-results.md` and retained in `docs/batch-2-results.md`; current observer and regression-test inspection on merged `main` at `0a8d71992cd13357fc3047fe51ab09289797a7e6`; the proposed narrow correctness increment and the user's `i confirm the scope/design` message. That message authorized the draft only. The user subsequently approved the presented draft with `approved`, authorizing implementation planning only.

## Problem and Current Behavior

The observer decides whether to suppress a Space key by looking for an editable ancestor. In `src/browser-observer.ts`, the selector can reach a `contenteditable="true"` ancestor across a `contenteditable="false"` boundary. A noneditable button within that boundary can therefore activate through native Space while the observer omits its key event, without reporting incomplete evidence.

Batch 1's quality review reproduced this behavior in Chromium. That is historical execution evidence. Current source inspection confirms that the ancestor-based check remains present after Batch 2; no new browser reproduction or verification has been run while defining this specification.

Native actions, assertions, and outcomes are retained despite the missing observation. The README currently discloses the limitation.

## Desired Outcome and Delivery Boundary

The wider direction remains the bounded v0.1 dialog/form evidence package. This increment closes the known Space-observation gap without expanding the public API or supported journey boundaries.

A noneditable button inside an editable container must retain its native Space key observation and activation. Genuine text editing must continue to exclude printable Space and typed text from observation payloads.

The uncertainty is limited: regression verification must demonstrate that effective editability fixes the omission while preserving data filtering and the existing dialog/form behavior. No new product-policy decision is required.

The increment includes the focused observer correction, real-browser regressions, package/consumer regression verification, current limitation documentation, a durable result record, and the integrated sequential final review. These together produce an independently verifiable correctness fix.

## Approach and Constraints

Use the browser's effective content-editability semantics rather than searching through arbitrary editable ancestors. `HTMLElement.isContentEditable` is the existing platform capability appropriate to this decision; using it is a technical detail derived from source inspection within the confirmed approach.

Extending the ancestor selector or manually walking contenteditable attributes would reproduce inheritance and boundary rules already supplied by the browser. Those alternatives are unnecessary for this fix. Do not introduce a general editability abstraction or a new keyboard-policy framework.

Preserve the existing native input-type classification, textarea handling, and document-design-mode safeguard. This increment does not redefine which input types suppress Space. Keep modifier filtering, other supported keys, descriptor allowlist/clipping, observation sequence/bounds, capture lifecycle, and completeness semantics intact.

Use native Playwright keyboard events in Chromium to demonstrate activation and editing. A synthetic dispatched keydown or a direct click is insufficient to establish that Space activates the button. Test-side focus setup is permitted for these targeted observer regressions; this does not claim a complete accessibility journey through an editor.

## Acceptance Criteria

| ID | Verifiable criterion |
| --- | --- |
| AC-01 | A focused button with `contenteditable="false"` inside an editable container activates through native Space and produces exactly one `Space` key observation attributed to that button. With live supported resources and no separate issue, the capture is complete. The regression fails against the current implementation before the correction. |
| AC-02 | An inherited noneditable boundary is respected: a button inside a `contenteditable="false"` container nested within an editable host also activates through native Space and retains its button-targeted key observation. Ordinary button Space observations remain intact. |
| AC-03 | Effective editable content continues to suppress printable Space, including inherited editable descendants, a nested region that re-enables editing inside a noneditable boundary, and `contenteditable="plaintext-only"`. Tests use actual keyboard editing to establish the target's behavior. |
| AC-04 | Existing text-input and textarea suppression and the document-design-mode safeguard remain intact. Typed synthetic text and printable Space are absent from observation payloads; tests inspect observations rather than claiming that screenshots, snapshots, traces, or native diagnostics are sanitized. |
| AC-05 | Existing key/modifier filtering, focus observations, ordering, bounds/clipping, and completeness behavior continue to pass their regressions. No public API, option, export, dependency pin, private handoff version, descriptor field, or observation type is added or changed. |
| AC-06 | Existing unit/browser suites, both combined dialog/form demos, and fresh packed-consumer verification succeed. Each demo retains two actual passes and four intended assertion failures at their specified checks; consumer selection and portability remain verified. Exact commands, exits, decisive output, and actually exercised toolchain/host are recorded. |
| AC-07 | Current README guidance no longer lists this precise defect as an unresolved limitation once verified. A new durable result record links the fix to the historical minor and release AC-03, records tests/review and any remaining limitations, and retains narrow compatibility and data claims. Historical release, Batch 1, and Batch 2 specifications, plans, comparisons, and results remain unchanged. |
| AC-08 | The sole integrated sequential specification/quality review is completed under `personal-workflows:code-review` and the selected implementation workflow. Findings are handled under its policy, results are recorded, and implementation stops at this fix's endpoint without automatic release acceptance or publication. |

## Edge Cases and Safeguards

- Effective editability is inherited and can be disabled and re-enabled at nested boundaries. Tests must distinguish these states instead of treating every descendant of an editable host as editable.
- Button activation and text insertion are different behaviors. Assert native activation independently from the captured key; for editing targets, establish actual editing and absence of the corresponding printable observations.
- Preserve the current `document.designMode` safeguard even when an individual node's effective contenteditable value would not alone describe the document policy.
- Retaining a key observation records an action; it does not assert that every control has correct activation semantics or that every key causes activation.
- Use only synthetic values. Typed-value exclusion applies to observations, not general artifact sanitization.

## Verification and Evidence

The repository already defines these commands; no new npm script is required by this specification:

```sh
npm run test:browser -- --grep observation
npm test
npm run demo:package
npm run demo:stock
npm run verify:consumer
git diff --check
```

The later implementation plan must sequence meaningful RED→GREEN checks for the defect, preserve the existing command contract, and include the required final review. The focused regression must expose the missing Space observation while native activation succeeds, then pass after the correction. Suppression cases must retain their intended behavior.

Previous Batch 2 test counts and toolchain records are historical evidence, not fresh execution proof. Record actual results during implementation. Continue the existing ESM package, pinned tooling, Chromium, one page/main document, ordinary light DOM, and existing checkout. Other browsers, hosts, runtimes, and CI remain untested unless separately authorized and exercised.

## Out of Scope

- Full rich-text-editor support, editor accessibility recipes, or continuous text/content recording.
- Changing other key/input policies, adding new observations, or redesigning reports.
- Shadow-root traversal, cross-frame/multi-page observation, or broader compatibility claims.
- Report-verbosity changes, external evaluation or outreach, release promotion/versioning, registry publication, push, or merge.
- Additional patterns or a subsequent increment's specification, plan, or implementation.

## Notes and Approval Handoff

Artifact lookup found no existing specification or plan for slug `space-key-observation-fix`; this is the new canonical specification. No material clarification remains open: the confirmed scope and current source determine the bounded correction and preservation requirements. Test organization remains for implementation planning.

**Current stage:** Stage 4, implementation authorized. The saved implementation plan was subsequently presented and separately approved with `approved`.

Explicit approval of this specification authorizes a separate implementation plan only. Keep this artifact uncommitted until both specification and plan are separately approved and the implementation branch is created under the user's Git workflow. Do not update `main` or create the branch yet.

**Execution endpoint:** deliver the verified Space-observation correction, regression and packed-consumer evidence, passing required review, updated current guidance and durable result record, and local implementation-branch commits; then stop before release-readiness work or any later increment. Push and merge remain subject to explicit user authorization.
