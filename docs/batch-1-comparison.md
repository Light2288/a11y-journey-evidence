# Batch 1 dialog comparison

Created: 2026-10-27. Updated: 2026-10-27.

This is an **author assessment**, based on actual local runs. **External validation is pending.** No external reviewers, measured time savings, or endorsements are claimed. A favorable package verdict is not a completion requirement.

## Equivalent comparison

Run `npm run demo:package` and `npm run demo:stock`. Both execute the same synthetic HTML variants and the same 20-line native keyboard/assertion recipe in `examples/shared/dialog-journey.ts`. Both retain native list/HTML/JSON reports and traces. Expected failure does not hide each broken case's actual failed assertion.

The stock path imports Playwright and the shared recipes only. Its `afterEach` adds current focus, screenshot, scoped ARIA structure, and capture timing using ordinary attachments; it does not import package instrumentation. Package recording begins after the same setup. Neither path substitutes programmatic focus for tested keyboard behavior.

## Setup and authoring evidence

Source line counts recorded during implementation, before this documentation: package test 11 lines and config 4; stock test/attachment file 25 lines and config 3; shared recipe 20 lines. These counts reflect compact formatting, not elapsed effort or a general productivity benchmark.

| Area | Package path | Stock path |
| --- | --- | --- |
| Dependencies | Adds the packed package to existing Playwright; exact peer/toolchain support | Playwright alone |
| Shared authoring | Native keyboard actions, locators, `test.step`, `expect` | Identical native recipe |
| Integration | Fixture import/composition, reporter entry, one `journey.start({root})` per selected test | Native fixture/test import and failure-attachment hook |
| Focus evidence | Ordered key/focus observations, including transient focus changes | Current-focus JSON attachment plus native action/trace evidence |
| Failure artifacts | Default screenshot and scoped snapshot, timing/outcomes, existing trace copied | Native screenshot/scoped snapshot/focus/timing attachments and trace |
| Review entry point | One portable Markdown bundle, with native reports still available | Native HTML report and attachments; trace for deeper action history |
| Maintenance | Package observer, handoff, rendering, compatibility, packaging, and integration safeguards | Application-owned attachment helper and native Playwright configuration |

The five-line minimal consumer fixture file composes an existing synthetic `tenant` fixture with the installed package using `mergeTests`; this composition passed outside the checkout. The package reporter loads by its ordinary installed subpath. Local repository self-reference needs a resolved reporter path; that repository detail should not be counted as a consumer requirement.

## Review task and observed answers

The author used the same task for both paths: identify the failed expectation, observed focus, and reproduction path.

| Variant | Failed expectation | Observed focus | Reproduction |
| --- | --- | --- | --- |
| Escaping focus | `Forward containment: focus returns to Continue` | Package sequence ends at button `#after`; stock focus attachment identifies `button`, `after` | Either demo command with `-- --grep escaping-focus` |
| Failed restoration | `Restoration: focus returns to Open preferences` | Package sequence reaches `body` after dismissal; stock attachment identifies `body` with empty ID | Either demo command with `-- --grep failed-restoration` |

Package evidence is in the printed `a11y-evidence/<run-id>/report.md`. It includes the native failed expectation and observed focus in one text account. Stock evidence is in `.artifacts/stock-html/index.html`, with assertion diagnostics, named steps, focus attachment, screenshots, ARIA snapshots, and traces. `npx playwright show-report .artifacts/stock-html` opens it. Native JSON at `.artifacts/stock-native.json` also retains actual status and attachments.

The correct dialog passes keyboard activation, semantic/name checks, explicit initial focus, both sampled tab boundaries, Escape dismissal, and restoration. Both broken variants fail their intended assertions after preceding checks succeed; separate regression tests reject unrelated setup failures and unexpected passes. A restoration failure captures the already-hidden dialog; its empty ARIA snapshot is labelled empty rather than represented as comprehensive structure.

## Assessment and limitations

The package supplies an ordered focus account and a portable text entry point with less application-owned capture code. The stock baseline already answers the review questions when equipped with a small attachment hook and native reporting. Its trace remains a strong debugging tool. This exercise establishes a concrete difference in presentation and ownership; it does not establish user preference or justify broader support by itself.

The current Markdown can be long, includes repeated native diagnostics, and shows transient body focus that needs careful interpretation. Human review may favor a shorter report or native HTML for some investigations. Initial setup, exact version compatibility, data-handling obligations, and package maintenance remain real costs. No timing experiment or independent user study was conducted.

External reviewer participation is optional and no outreach was performed. Future feedback may inform observation detail, presentation, onboarding, or whether to invest in forms. Material changes still return through the existing approval gates. The next increment remains provisional.
