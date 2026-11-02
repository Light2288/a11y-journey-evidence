# Form failure walkthrough

The `missing-error-association` synthetic form reveals errors and correctly focuses Name, but deliberately omits Name's `aria-describedby`. The native **Declared error associations** step fails because Name's accessible description is empty.

Reproduce in the [quickstart project](../getting-started.md) with the [form files](../recipes/form.md):

```sh
npm test -- --grep "form missing-error-association"
```

This is an actual failed assertion declared as an expected failure. The command may exit 0; the accessible-description check did not pass.

## Native diagnostic

Edited excerpt: ANSI formatting, repeated call log, source excerpt and machine-local stack paths were omitted. The native expected/received description is retained.

<<< ../samples/form-diagnostic.txt

Keyboard submission and visible-error/invalid-state checks passed. The failure occurs on Name's description assertion in [form.ts](../recipes/form.md#complete-fixture-and-journey). The subsequent association assertions, focus-policy step, correction and resubmission were not executed for this attempt.

## Observed focus and semantics

All observation records are transcribed using the report's notation. The last observation identifies `input#name` with raw `aria-invalid=true` and no `aria-describedby`. These attributes are sampled when key/focus events occur; they are not continuously synchronized validation state.

<<< ../samples/form-observations.txt

The focus observation is consistent with focus moving to Name. The named focus-policy assertion was not executed, so it must not be reported as a passed check. Native accessible-description diagnostics, rather than a screenshot of visible text, establish what this particular assertion received.

## Failure artifacts

![Synthetic Team request form at teardown, showing focused Name, visible Enter a name and Enter a team errors, and the Submit button.](/samples/form.png)

<<< ../samples/form-aria.txt

The declared `#form` ARIA snapshot includes fields and visible errors. Their presence does not by itself prove Name's error association or screen-reader announcements.

<<< ../samples/form-capture.txt

The screenshot and ARIA text are unmodified synthetic artifacts from **fixture-teardown**. Metadata omits internal file paths. The app could have changed after the assertion; these captures describe the later capture point.

## Provenance and next step

Generated on 2026-11-02 UTC (2026-11-03 locally), using npm **0.1.0**, Node 24.21.0, Playwright 1.64.1 and Chromium 156.0.8078.4 on macOS arm64. The example derives from released [v0.1.0 sources](https://github.com/Light2288/a11y-journey-evidence/tree/v0.1.0/examples/shared). This is author verification; external validation remains pending.

Restore the missing association in the application and rerun the native assertions. Share the generated **whole bundle** only after inspecting it for data. [Read evidence](./reading.md) explains completeness, timing and absent checks.
