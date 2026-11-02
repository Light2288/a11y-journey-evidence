# Integrate with Playwright

Keep native `expect`, locators, `page.keyboard`, `test.step` and your existing fixture design. The package adds a test-scoped `journey` fixture and a separate reporter.

## Compose fixtures

This example preserves an existing synthetic `tenant` fixture with native `mergeTests`:

<<< ../../examples/documentation/fixtures.ts

Import that composed `test` in selected tests and import `expect` from `@playwright/test`. The runnable [dialog](../recipes/dialog.md) and [form](../recipes/form.md) examples use the custom fixture in their setup assertions.

## Start after setup

Request `journey` in the test callback. Navigate or call `page.setContent` first, then call `await journey.start({ root })` once before the actions under observation. There is no assertion wrapper or per-action recording call.

<<< ../../examples/documentation/dialog.spec.ts

`root` is a native locator on the fixture page's main light-DOM document. Use an unambiguous declared root; a root may mount later, but unresolved capture is reported honestly. Do not use `.first()` to hide ambiguity.

A requested fixture without `start` is selected but not started, with incomplete evidence. Starting without executed assertions does not verify behavior. Tests that never request the fixture are unselected and omitted from the evidence report.

## Unselected tests

Save this optional **control.spec.ts** alongside the quickstart files:

<<< ../../examples/documentation/control.spec.ts

It uses the existing fixture but not the package's journey fixture, so it remains visible in native reports and absent from evidence.

## Keep native reporters

The reporter subpath works beside Playwright's own reporters:

<<< ../../examples/documentation/playwright.config.ts

This example enables native traces for all attempts, including expected failures. The evidence reporter preserves available native traces in its portable bundle. Trace configuration remains Playwright's responsibility.

## Independent capture controls

Screenshots and scoped ARIA snapshots default to enabled on actual failures. Disable either independently when starting:

```ts
await journey.start({
  root: page.locator('#dialog'),
  screenshots: false,
  ariaSnapshots: true,
  maxObservations: 500,
});
```

These options control capture; they do not sanitize native titles, diagnostics, screenshots, snapshots or traces. The [reference](../reference/api.md) describes defaults, restrictions and capture timing. The [limitations guide](../limitations.md) explains the supported scope and data risks.
