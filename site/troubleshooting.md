# Troubleshooting

## Package or reporter cannot be resolved

Use an ESM project with the exact published package and Playwright peer. Follow all [quickstart files](./getting-started.md), run `npm install`, then `npx playwright install chromium`. Import the reporter through `a11y-journey-evidence/reporter`; do not import repository `src/` or private declarations. `expect` comes from Playwright.

A checkout can resolve its own package name and conceal an installation problem. The repository's `npm run docs:verify-examples` verifies a fresh external npm consumer instead.

## No evidence for a test

Unselected tests are intentionally omitted. Request `journey` and call `start` once after page setup and before actions. A requested fixture without start is incomplete; no executed assertions means no verified behavior. Confirm the package reporter is configured beside your native reporters and inspect stderr.

## Root missing, ambiguous or unsupported

Use a unique attached root in the fixture page's main light-DOM document. A root that mounts later is allowed, but it can still be unavailable at teardown. Do not replace missing/ambiguous roots with a broader locator or `.first()`. Wrong-page/frame/shadow roots and repeated/invalid starts reject contextually. A viewport screenshot can remain available when a scoped snapshot is not.

## Snapshot empty or captures absent

A hidden/dismissed dialog can produce an explicitly empty snapshot. Passing attempts normally need no failure captures. Check the independent `screenshots` and `ariaSnapshots` settings and the capture outcome/reason. Closed pages, timeouts or a later teardown failure can leave artifacts unavailable at the relevant point. Captures show fixture-teardown state rather than the exact assertion instant.

## Command passed but the example failed

The deliberately broken recipes declare expected failures. Playwright can exit 0 while retaining an actual failed assertion. Check actual/expected status and the named failure; an unrelated error does not demonstrate the intended defect. An unexpected pass fails the run.

## Report or links unavailable

Use the newly printed run path. Share the whole directory so relative artifact links resolve. Native HTML/JSON and stderr remain useful when evidence output fails. Handoff, copying and report-write failures make an otherwise successful run fail; do not describe missing evidence as verified behavior.

## Incomplete observations

Review truncation and boundary issues. Increase `maxObservations` only within 1–10000 when appropriate. Navigation, extra pages/frames and shadow traversal are outside the verified scope. Raw validation attributes are sampled on observations, not continuously updated. Read [limits](./limitations.md) before interpreting a sequence.
