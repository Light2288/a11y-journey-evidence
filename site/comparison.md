# Compare with stock Playwright

This is a current synthesis of the dialog/form **author assessment** for released v0.1.0. **External validation is pending.** No independent preference, endorsement or measured time savings have been established.

## Equivalent native journeys

The released package and stock examples run the same synthetic variants and shared native keyboard actions, locators, named steps and assertions. The package adds `journey.start({ root })` after setup. Stock uses native reporters/traces plus an application-owned failure hook attaching current focus, screenshot, scoped ARIA and timing. The stock configuration does not import package instrumentation or its reporter.

| Area | Package | Stock Playwright baseline |
| --- | --- | --- |
| Dependencies | Adds this package and its exact Playwright peer | Playwright alone |
| Journey authoring | Native actions/assertions and explicit policies | The same native recipe |
| Integration | Fixture import/composition, reporter, one start per selected test | Native test/reporters and capture hook |
| Focus review | Ordered bounded key/focus descriptors | Current-focus attachment plus native action/trace evidence |
| Failure artifacts | Configurable captures, timing/outcomes, native traces when available | Native captures/trace and custom timing attachments |
| Entry point | Portable Markdown bundle beside native reporting | Native HTML/JSON, attachments and trace |
| Maintenance | Package integration and its compatibility/data limitations | Application-owned attachment helper and configuration |

The package combines an observed focus sequence and native diagnostics in portable text. Stock already answers the review questions with its attachment hook and reporting. The difference is presentation and ownership, not a claim that native Playwright lacks debugging or accessibility-related assertions.

## Reproduce both paths

Use the released repository examples, separately from the fresh npm quickstart:

```sh
git clone --branch v0.1.0 https://github.com/Light2288/a11y-journey-evidence.git journey-comparison
cd journey-comparison
npm ci
npx playwright install chromium
npm run demo:package
npm run demo:stock
```

Each runs correct and deliberately broken dialog/form cases. Expected failures can yield exit 0. Inspect the actual failed named assertion. Filter either command with `-- --grep escaping-focus` or the relevant form variant.

| Regression | Native failed expectation | Useful evidence in either path |
| --- | --- | --- |
| Dialog escaping focus | Continue should regain focus at the forward boundary | Package ends at `button#after`; stock current-focus identifies `after` |
| Dialog restoration | Opener should regain focus after Escape | Package records body focus; stock current-focus identifies body |
| Form association | Name should describe its visible error | Native description is empty; Name has invalid state and no error reference |
| Form error focus | First invalid field should receive focus | Focus remains on Submit |

Package bundles are printed under `a11y-evidence/<run-id>/report.md`. Native stock output is under `.artifacts/stock-html/` and `.artifacts/stock-native.json`; open with `npx playwright show-report .artifacts/stock-html`. Both retain traces. The [site walkthroughs](./evidence/dialog.md) use the separately verified installed npm consumer and disclose their provenance.

## Findings and limits

The package supplies a text entry point with ordered observations and less application-owned capture code. It also adds exact-version integration, maintenance and data-handling obligations. Stock's small capture hook and native trace remain useful. Long reports and repeated diagnostics impose review costs; no timing experiment was conducted.

The historical [Batch 1 assessment](https://github.com/Light2288/a11y-journey-evidence/blob/v0.1.0/docs/batch-1-comparison.md) and [Batch 2 assessment](https://github.com/Light2288/a11y-journey-evidence/blob/v0.1.0/docs/batch-2-comparison.md) retain their original development-stage metadata, line counts and local artifact references. They are historical engineering records, not current installation instructions; earlier private/batch version wording does not describe the published npm 0.1.0 package.
