# Form recipe

This synthetic **Team request** form declares submit-only validation. An empty keyboard submission reveals inline errors, marks both fields invalid, associates each visible error using `aria-describedby`, and focuses the first invalid field. Keyboard correction and resubmission clear stale states/references and reveal success.

The example uses `novalidate` so browser validation UI cannot mask the deliberately omitted focus movement. Its first-invalid-field policy is an example choice. Native accessible-description assertions inspect DOM semantics; they do not establish a screen reader announces an error.

Sources: released [v0.1.0 form loader](https://github.com/Light2288/a11y-journey-evidence/blob/v0.1.0/examples/shared/form.ts) and [native journey](https://github.com/Light2288/a11y-journey-evidence/blob/v0.1.0/examples/shared/form-journey.ts).

## Complete fixture and journey

Save as **form.ts** alongside the [quickstart files](../getting-started.md):

<<< ../../examples/documentation/form.ts

## Test cases

Save as **form.spec.ts**:

<<< ../../examples/documentation/form.spec.ts

| Variant | Deliberate change | Expected native outcome |
| --- | --- | --- |
| `correct` | Complete example policy | Actual pass through invalid submit, correction and resubmission |
| `missing-error-association` | Omit Name's error reference | Actual failure at `Declared error associations`; Name's description is empty despite a visible error |
| `failed-error-focus` | Omit only focus movement | Actual failure at `Declared invalid-submit focus`; focus remains on Submit |

```sh
npm test -- --grep "form correct"
npm test -- --grep "form missing-error-association"
npm test -- --grep "form failed-error-focus"
```

Both deliberate regressions use `test.fail()` and may exit 0. The missing-association attempt stops before the focus-policy and correction assertions; the focus defect stops before correction. Earlier passing assertions remain useful but do not supply results for later checks.

[Read the association failure evidence](../evidence/form.md). `aria-errormessage` has different semantics and requires its own native assertion; this recipe specifically tests accessible descriptions through `aria-describedby`.
