# Dialog recipe

This synthetic example declares a particular focus policy: Enter opens **Preferences**, initial focus goes to **Continue**, Tab wraps at both boundaries, Escape dismisses, and focus returns to **Open preferences**. These are the assertions being sampled, not a general dialog or accessibility certification.

The public package contributes observation/capture/reporting. The fixture and assertions are adapted from the [v0.1.0 dialog loader](https://github.com/Light2288/a11y-journey-evidence/blob/v0.1.0/examples/shared/dialog.ts) and [native journey](https://github.com/Light2288/a11y-journey-evidence/blob/v0.1.0/examples/shared/dialog-journey.ts).

## Complete fixture and journey

Save as **dialog.ts** in the [quickstart project](../getting-started.md). The HTML is synthetic, ordinary light DOM. The declared `#dialog` snapshot root is attached even before it becomes visible.

<<< ../../examples/documentation/dialog.ts

## Test cases

Save as **dialog.spec.ts** alongside the other project files:

<<< ../../examples/documentation/dialog.spec.ts

| Variant | Deliberate change | Expected native outcome |
| --- | --- | --- |
| `correct` | Complete example policy | Actual pass through activation, semantics, both boundaries, dismissal and restoration |
| `escaping-focus` | Omit only containment | Actual failure at `Forward containment boundary`; focus reaches `button#after` |
| `failed-restoration` | Omit only restoration | Actual failure at `Declared focus restoration`; body focus can follow dismissal |

```sh
npm test -- --grep "dialog correct"
npm test -- --grep "dialog escaping-focus"
npm test -- --grep "dialog failed-restoration"
```

Broken cases are expected failures, so their commands can exit 0. A native hard assertion stops subsequent checks. A restoration failure captures an already hidden dialog; its ARIA snapshot can be empty, which is a limitation of that capture point.

[Read the containment failure evidence](../evidence/dialog.md) and [interpret status, attempts and capture timing](../evidence/reading.md).
