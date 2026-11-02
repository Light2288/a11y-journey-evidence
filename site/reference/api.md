# API and lifecycle

This reference describes **experimental v0.1.0**. The package is ESM-only and has an exact peer dependency on `@playwright/test@1.64.1`.

## Public exports

```ts
import { test } from 'a11y-journey-evidence';
import type { Journey, JourneyOptions } from 'a11y-journey-evidence';
import JourneyReporter from 'a11y-journey-evidence/reporter';
```

The root exports the extended Playwright `test` and the two public types. The reporter subpath has a default export. Import native `expect`, `mergeTests`, locators and other Playwright APIs from `@playwright/test`. Internal evidence models and fixture handoff schemas are private; `JourneyReporterOptions` is not a named root export.

## JourneyOptions

```ts
interface JourneyOptions {
  root: Locator;
  screenshots?: boolean;
  ariaSnapshots?: boolean;
  maxObservations?: number;
}
interface Journey {
  start(options: JourneyOptions): Promise<void>;
}
```

`Locator` above is Playwright's native type.

| Option | Default | Behavior |
| --- | --- | --- |
| `root` | Required | One unambiguous locator in the fixture page's main light-DOM document, used for scoped ARIA capture |
| `screenshots` | `true` | Attempt a viewport screenshot on an actual failure visible at teardown |
| `ariaSnapshots` | `true` | Independently attempt the declared-root ARIA snapshot on actual failure |
| `maxObservations` | `1000` | Integer from `1` through `10000`; bounds browser and receiving buffers |

## Fixture lifecycle

The fixture is test-scoped and opt-in through the callback's `journey` parameter. Set up the page first, call `start` once, then execute the native journey. Observation covers the current main document, not just the snapshot root. A repeated `start`, malformed options, wrong-page/frame/shadow root or ambiguous root rejects with configuration context. A root may mount later; if still absent at capture it remains missing.

At teardown the fixture finalizes available observations, attempts independently enabled captures for actual `failed`, `timedOut` or `interrupted` status when practical, and hands evidence to the reporter. Screenshot/snapshot operations have two-second timeouts. Capture/attachment issues remain subordinate to the native failure. See [capture interpretation](../evidence/reading.md).

## Reporter configuration

Configure alongside native reporters, using an options object:

```ts
reporter: [
  ['list'],
  ['a11y-journey-evidence/reporter', {
    outputDir: 'a11y-evidence',
    reproductionCommand: 'npx playwright test',
  }],
]
```

`outputDir` defaults to `a11y-evidence`; each run gets a unique subdirectory containing `report.md` and generated artifact filenames. `reproductionCommand` defaults to `npx playwright test` and is displayed as text; the reporter does not execute it. Choose a command that matches your own project. Available native trace attachments are copied; configure trace recording through Playwright.

Missing/corrupt handoff and bundle/report-write failures produce diagnostics and fail an otherwise successful run while preserving native per-test status. No public CLI is added.

## Observation bounds

Retained keydown events are Tab, Shift+Tab, Enter, Escape and relevant Space. Printable input history and values are excluded; Space within text-editing targets is suppressed. Focus changes include application-driven focus, body/document focus and observable focus loss/removal. Element descriptors contain local references, tag and these raw attributes:

```text
id name type role tabindex disabled
aria-label aria-labelledby aria-expanded aria-hidden aria-modal
aria-selected aria-checked aria-disabled aria-pressed
aria-invalid aria-describedby
```

Attribute strings are clipped at 256 JavaScript string units, with disclosure. Overflow in either observation buffer is reported as truncation. Native step retention is bounded at 10,000 records per attempt; native titles/diagnostics are clipped at 16,384 JavaScript string units with disclosure. Arbitrary native step parameters are not copied wholesale.

Raw attributes may retain application data and do not provide computed semantics or continuous state tracking. Detection of unsupported boundaries is best-effort. Read the [supported scope and data limitations](../limitations.md).
