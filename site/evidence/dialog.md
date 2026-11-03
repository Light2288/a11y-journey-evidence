# Dialog failure walkthrough

The `escaping-focus` synthetic dialog disables containment while preserving opening and initial focus. The native **Forward containment boundary** step fails when Tab moves from Cancel to the **After dialog** button instead of Continue.

Reproduce in the [quickstart project](../getting-started.md):

```sh
npm test -- --grep "dialog escaping-focus"
```

The attempt's actual status is failed; expected status is failed because the demonstration uses `test.fail()`. The command may exit 0. The repository verifier additionally rejects unrelated failures or an unexpected pass.

## Native diagnostic

This excerpt retains the native expected/received meaning. ANSI formatting, repeated call log, source excerpt and machine-local stack paths were omitted. It is an edited excerpt, not the complete report.

<<< ../samples/dialog-diagnostic.txt

The source is the `Forward containment boundary` assertion in [dialog.ts](../recipes/dialog.md#complete-fixture-and-journey). Activation, semantics, initial focus and the first movement to Cancel passed. Backward containment, Escape and restoration were not executed after the hard failure.

## Observed focus

All observations from this attempt are transcribed below using the report's sequence notation. The final record identifies `button#after`. Transient body focus records remain visible; browser order is separate from native step order and does not prove causation.

<<< ../samples/dialog-observations.txt

## Failure artifacts

![Synthetic Preferences dialog remains open at teardown, with Continue and Cancel over the page and the After dialog button outside it.](/samples/dialog.png)

The screenshot shows teardown state, not necessarily the exact assertion instant. The scoped ARIA snapshot contains the declared dialog; it excludes the outside button even though the observer saw focus there. Neither screenshot nor snapshot alone establishes containment.

<<< ../samples/dialog-aria.txt

<<< ../samples/dialog-capture.txt

These captures were taken during **fixture-teardown**, after the assertion failed. The screenshot and ARIA text are unmodified synthetic artifacts. Capture metadata omits internal file paths. “Complete” applies only to the supported observed scope; it does not mean the journey passed or all possible checks ran.

## Provenance and next step

Generated on 2026-11-02 UTC (2026-11-03 in the author's local timezone) against npm **0.1.0**, Node 24.21.0, Playwright 1.64.1 and Chromium 156.0.8078.4 on macOS arm64. The fixture/journey derive from released [v0.1.0 sources](https://github.com/Light2288/a11y-journey-evidence/tree/v0.1.0/examples/shared). Local author verification; external validation pending.

Fix the application's containment policy, then rerun the native journey. Review a newly generated **whole bundle** for current evidence. [Read evidence limitations](./reading.md) before interpreting or sharing it.
