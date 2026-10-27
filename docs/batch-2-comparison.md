# Batch 2 form comparison

Created: 2026-10-27. Updated: 2026-10-27.

This is an **author assessment** based on actual local runs and artifact inspection. **External validation is pending.** No independent reviewers, time savings, user preference, or endorsement are claimed.

## Equivalent exercise

Both `npm run demo:package` and `npm run demo:stock` execute the same form loader and native journey, alongside the existing dialog cases. Name and Team are required text fields. Submission shows inline errors, associates them through `aria-describedby`, and focuses the first invalid field. The native journey verifies descriptions, focus, keyboard correction, and successful resubmission. The package supplies no form-specific assertions or focus policy.

Both paths retain native HTML/JSON reports and traces. Stock supplies ordinary focus/screenshot/form-scoped ARIA/timing attachments. The package adds one `journey.start({root})` after setup and uses the existing reporter. Both deliberate defects must actually fail the same assertion that passes for the correct form. Separate regression checks reject an unrelated earlier failure, an unexpected pass, or a browser-validation focus behavior that masks the defect.

## Concrete authoring and maintenance

| Area | Package | Stock Playwright |
| --- | --- | --- |
| Dependencies | Existing package and pinned Playwright peer; no new dependency for forms | Native Playwright alone |
| Shared work | Identical semantic HTML and 67-line native journey | Same loader and journey |
| Form integration | 12-line test file; fixture import, recording start, existing reporter | 44-line test file; native test import and ordinary failure attachment hook |
| Failure context | Ordered key/focus descriptors plus native assertions and portable Markdown | Native assertions/trace plus current-focus JSON and scoped captures |
| Form-specific evidence change | Add two bounded raw attributes to the existing allowlist | Add the relevant raw attributes to the current-focus attachment |
| Ownership | Package maintains observer/capture/handoff/report compatibility | Application maintains its small attachment hook |

Line counts were measured from the implementation files; formatting affects them and they are not a productivity benchmark. The independent packed consumer's form test is 52 lines and deliberately does not import the repository's shared recipe. It demonstrates installation and fixture composition rather than minimizing demo code.

Adding form cases also required extending existing config selections and isolating native HTML output for concurrent child runs. Neither is a new consumer API. The development package remains private at `0.1.0-batch.1`; Batch 2 is an increment label, not a published version.

## Failure-review findings

The assessment task was the same for both paths: identify the failed expectation, observed focus, and reproduction path.

| Variant | Failed expectation | Package evidence | Stock evidence |
| --- | --- | --- | --- |
| `missing-error-association` | Name should have accessible description `Enter a name.`; actual description is empty | Native description diagnostic plus focus on `input#name`, raw `aria-invalid=true`, and absent error reference | The same native diagnostic plus current-focus JSON identifying `input`, `name`, invalid state, and absent reference |
| `failed-error-focus` | Name should be focused as the first invalid field | Native focus diagnostic; last focus observation remains `button#submit` | The same native focus diagnostic and current-focus JSON identifying `button`, `submit` |

For the association defect, errors are visible and focus is correct; only Name's error reference is omitted. For the focus defect, both associations and preceding checks pass; only focus movement is omitted. A hard failure stops later recipe checks, so neither path supplies invented correction results for those attempts.

The correct form passes the invalid-submit/correction/resubmit journey. Supporting browser checks establish the second-field-only invalid case, whitespace rejection, and each defect's isolation. Native accessible descriptions verify the chosen DOM semantics; snapshots and raw reference attributes do not prove screen-reader announcements.

Reproduce with the existing scripts:

```sh
npm run demo:package -- --grep "form missing-error-association"
npm run demo:stock -- --grep "form missing-error-association"
npm run demo:package -- --grep "form failed-error-focus"
npm run demo:stock -- --grep "form failed-error-focus"
```

Each filtered broken-case command can exit 0 because Playwright expects its actual failure. Inspect the native actual status/failed assertion, rather than interpreting the suite summary as a passed accessibility check.

## Concrete local artifacts

- [Package verification bundle](../a11y-evidence/1f72dae9-145a-4d78-9047-077720ac5800/report.md): all six dialog/form attempts, both form failure diagnostics, ordered observations, and relative capture/trace links.
- [Stock HTML report](../.artifacts/stock-html/index.html): native steps/diagnostics and focus/screenshot/form-snapshot/timing/trace attachments. `npx playwright show-report .artifacts/stock-html` opens it.
- [Stock JSON](../.artifacts/stock-native.json): actual/expected statuses and attachment paths.
- [Packed-consumer proof](../.artifacts/consumer-verification.json): three passed tests, two selected attempts, installed package, and moved links.

These are generated, Git-ignored local artifacts. They are not shipped with a fresh checkout; run the commands to generate them and use the newly printed package-report path. The regression suite separately moves a failing form bundle outside the checkout and verifies its text and every generated artifact link without opening its trace.

## Assessment and limits

The existing evidence model supports this form without a new package API. Its raw validation attributes help interpret sampled focus, and the portable report combines the native failure, observed focus, and artifacts. Stock Playwright with the attachment hook also answers both review questions. Its native descriptions/assertions and trace remain useful, so form support alone does not establish an independent preference for this package.

The combined local package sample above is 985 lines, including repeated native diagnostics and passed checks. This is a real review cost; a shorter report or native HTML may be preferable. The change does not redesign reporting or establish measured efficiency gains.

Validation updates only on submit. Raw descriptors are sampled during existing key/focus observations, not continuously synchronized with field state. Observation values exclude typed input, but native titles/assertions, screenshots, snapshots, and traces can contain application data. Independent capture controls are not sanitization.

External validation remains pending and no outreach was performed. The nested-contenteditable Space minor remains deferred; the examples use ordinary text inputs. Later reporting, compatibility, evaluation, and release decisions require their own authorized scope.
