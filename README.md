# A11y Journey Evidence

Reviewable keyboard and focus evidence for native Playwright Test journeys. Batch 1 provides a dialog example, two isolated regressions, an opt-in fixture/reporter package, and an equivalent stock Playwright comparison.

The package observes and presents explicit tests. It does not decide correct focus policies, run screen readers, or establish accessibility conformance.

## Run the repository

Verified locally with Node **24.21.0**, npm **11.19.0**, TypeScript **7.0.2**, Playwright **1.64.1**, Chromium **156.0.8078.4**, and macOS **27.0.1 arm64**. Other hosts and CI are untested. Playwright and Node compatibility declarations intentionally match this narrow evidence.

```sh
npm install
npx playwright install chromium
npm test
npm run demo:package
npm run demo:stock
npm run verify:consumer
```

Both demos have one correct dialog and two deliberately broken variants. Their commands succeed when the correct case passes and both broken cases fail their intended assertions. The evidence still records the broken cases as **actual failed assertions**, including when Playwright expects failure. Regression tests reject earlier unrelated failures and unexpected passes.

- Package Markdown: the command prints `a11y-evidence/<run-id>/report.md`.
- Native package report: `.artifacts/package-html/index.html`.
- Stock report: `.artifacts/stock-html/index.html`; native JSON: `.artifacts/stock-native.json`.
- Packed consumer: `.artifacts/consumer/`; verification details: `.artifacts/consumer-verification.json`.

Use `npx playwright show-report .artifacts/stock-html` or the corresponding package folder for native report review. Native traces are enabled in both demos. Stock attaches observed focus, screenshot, scoped ARIA snapshot, and capture timing to actual failures.

`npm run build` compiles ESM JavaScript and declarations. `npm run typecheck`, `npm run test:unit`, and `npm run test:browser` check types, Node unit tests, and Chromium integration tests respectively. Generated outputs are ignored by Git.

## Install the local package

This experimental version is private and is delivered as a tarball; registry publication is not part of Batch 1.

```sh
npm run build
mkdir -p .artifacts/package
npm pack --pack-destination .artifacts/package
```

In an existing ESM Playwright project using the tested toolchain, install the generated tarball as a development dependency with `npm install --save-dev /absolute/path/to/a11y-journey-evidence-0.1.0-batch.1.tgz`. Playwright Test 1.64.1 is a peer dependency. There is no additional runtime framework, CLI, or scanner dependency.

`npm run verify:consumer` packs the actual artifact and installs it into a fresh external copy of [the minimal consumer](examples/consumer), then type-checks, runs Playwright, verifies existing-fixture composition and reporter coexistence, and moves a bundle to check its links. It does not satisfy integration through repository-source imports.

## Compose existing fixtures

```ts
import { mergeTests } from '@playwright/test';
import { test as existingTest } from './existing-fixtures.js';
import { test as evidenceTest } from 'a11y-journey-evidence';

export const test = mergeTests(existingTest, evidenceTest);
export { expect } from '@playwright/test';
```

Add the reporter alongside your native reporters:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['a11y-journey-evidence/reporter', {
      outputDir: 'a11y-evidence',
      reproductionCommand: 'npx playwright test',
    }],
  ],
});
```

The reporter subpath resolves to ESM JavaScript. The repository's own package example uses `import.meta.resolve` because the root package is not installed in its own `node_modules`; the packed consumer verifies the ordinary package-name entry shown above.

## Opt a test into evidence

Request `journey`, complete your normal page/content setup, and call `journey.start({ root })` once before the keyboard behavior under test. Continue using native actions, locators, named steps, and assertions. [The complete dialog recipe](examples/shared/dialog-journey.ts) declares initial focus, both containment boundaries, dismissal, and restoration explicitly.

```ts
// After navigation/setup, before the actions being tested:
await journey.start({ root: page.locator('#dialog') });
await test.step('Keyboard opens preferences', async () => {
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeFocused();
});
```

For a group, use ordinary `beforeEach` setup and start recording once per test after its page setup. Tests that never request the fixture produce no journey observations. Requesting it without starting is reported as incomplete. A native Locator declares the snapshot root; it may mount later. An ambiguous root is never silently reduced to its first match, and a missing root never becomes a whole-document snapshot.

Options on `start`:

| Option | Default | Meaning |
| --- | --- | --- |
| `root` | Required | Native Locator in the fixture page's main light-DOM document |
| `screenshots` | `true` | Capture a page screenshot on an actual failure |
| `ariaSnapshots` | `true` | Capture the declared-root ARIA snapshot on an actual failure |
| `maxObservations` | `1000` | Integer from 1 to 10000; overflow is visible and incomplete |

Screenshot and snapshot controls are independent. Recording starts after setup; navigation and document replacement during a recorded journey are unsupported boundaries. Root/frame/page misconfiguration is contextualized rather than silently repaired.

## Interpret the evidence

Reports keep native actual/expected status, attempts/retries/repeats, executed assertions, and evidence completeness separate. Earlier failed attempts remain visible. A test can pass with incomplete evidence. No assertions means no verified behavioral checks; the package does not infer that any particular assertion adequately tests accessibility. After an early failure, only executed checks are shown.

Browser sequence numbers describe observed order. Native sequence numbers describe step starts. They do not establish a shared clock, causation, or a total order between browser events and native steps. Transient body focus can occur between other focus observations; sampled assertions determine the example's expected boundaries.

Screenshots and snapshots describe fixture-teardown state when available, not necessarily assertion-time state. Closed pages, lost roots, capture errors, truncation, and unavailable artifacts are explicit. An empty snapshot of a hidden dialog is retained as empty. A later fixture teardown failure is disclosed separately from the earlier capture point.

Capture limitations do not rewrite native results. Missing/corrupt fixture handoff, failed bundle copying, or report-write failure makes an otherwise successful run fail while retaining each native test's original status. If a report cannot be written, stderr records the outcome. Hard process termination can prevent finalization.

Move the **whole run directory**, including `assets`, to share a bundle. The Markdown explanation works without a trace or hosted viewer. Existing native traces are copied when available; the package never starts a second trace session.

## Application data and limits

Observations retain Tab, Shift+Tab, Enter, Escape, and relevant Space keydown events. Printable input history and field values are excluded; Space in text-editing targets is suppressed. Focus descriptors contain a local reference, tag, and allowlisted attributes: `id`, `name`, `type`, `role`, `tabindex`, `disabled`, `aria-label`, `aria-labelledby`, `aria-expanded`, `aria-hidden`, `aria-modal`, `aria-selected`, `aria-checked`, `aria-disabled`, and `aria-pressed`. Attribute strings are clipped at 256 characters with disclosure. Raw attributes are not computed accessible names.

Native records are bounded at 10000 steps per attempt; titles/diagnostics at 16 KiB per string, with visible clipping. Arbitrary native step parameters are not copied wholesale. Titles, diagnostics, attributes, screenshots, snapshots, and traces can still contain application data. Use synthetic data and inspect bundles before sharing. Capture controls and typed-value exclusion do not provide general sanitization.

Support is limited to Chromium, one page/main document, ordinary light DOM, and the explicit observed journey. Frames, new pages, shadow traversal, navigation/document replacement, nested dialogs, other patterns, and additional browsers are outside this increment. Identifiable unsupported boundaries are disclosed; complete detection outside scope is not promised. Custom matcher internals are not interpreted. DOM focus, ARIA structure, and screenshots do not establish screen-reader announcements, focus-indicator quality, inclusive usability, or conformance.

## Findings and release continuity

See [the author comparison](docs/batch-1-comparison.md), [verification and remaining release work](docs/batch-1-results.md), and [the Batch 1 specification](docs/superpowers/specs/2026-10-27-batch-1-dialog-package-comparison.md). **External validation is pending.**

Batch 1 does not complete v0.1. The correct form and its two broken variants, corresponding stock comparison, and remaining cross-pattern release verification are deferred. Further work needs its own approved scope and artifacts.
