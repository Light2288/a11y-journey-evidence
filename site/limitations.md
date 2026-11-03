# Limits and application data

**Experimental v0.1.0. External validation pending.** This package supports evidence review for explicit native assertions and the observed supported journey.

## Supported scope

The package baseline is Chromium, one page/main document, ordinary light DOM and semantic dialog/form examples. Frames, additional pages, shadow traversal, navigation/document replacement, nested dialogs, other patterns and other browsers are outside this release's verified scope. Identifiable unsupported boundaries produce issues; exhaustive detection outside scope is not promised. Custom matcher internals are not interpreted.

Tested package toolchain: Node 24.21.0, npm 11.19.0, TypeScript 7.0.2, Playwright 1.64.1, Chromium 156.0.8078.4, macOS 27.0.1 arm64. Linux, other hosts, browsers and package CI compatibility remain unverified. A successful documentation build or site browser check on a CI host does not broaden package compatibility.

## Evidence can contain data

Printable-input filtering is limited to observer input history. Native titles, assertions, locator diagnostics, attributes, screenshots, ARIA snapshots and traces can still contain application data. Attributes such as labels, names and IDs can be sensitive. Captures may include visible field values. There is **no general sanitization**.

Start with synthetic data. Choose capture controls independently, inspect all bundle files and follow your own project's storage/sharing practices. Disabling one capture type does not remove data already present in another. This site includes only selected inspected synthetic screenshots and literal excerpts, with editorial omissions disclosed.

## What this does not establish

DOM focus, accessible descriptions, ARIA structure and screenshots do not prove screen-reader announcements, focus-indicator quality, inclusive usability, accessibility conformance or complete keyboard coverage. Tests encode an example's chosen policies. Evidence completeness describes the supported recording scope, not universal correctness.

Reports can be long and repeat native diagnostics. Stock Playwright HTML reports and traces may be preferable for some investigations. The [comparison](./comparison.md) is an author assessment; no user preference, measured time saving or external endorsement is claimed.
