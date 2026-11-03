# Get started

This guide uses **experimental a11y-journey-evidence 0.1.0** with Playwright 1.64.1. It adds evidence to native Playwright tests. You still choose the assertions and what the expected behavior should be.

## Prerequisites

The package baseline was verified with Node **24.21.0**, npm **11.19.0**, TypeScript **7.0.2**, Playwright **1.64.1**, Chromium **156.0.8078.4**, and macOS **27.0.1 arm64**. Other package hosts/browsers remain untested. Documentation site checks have their own verification context.

Use an empty directory outside this repository so installation exercises npm's published package:

```sh
mkdir journey-evidence-demo
cd journey-evidence-demo
```

## Create the project files

Save each file below in that directory. The project is ESM; `.js` import suffixes refer to TypeScript files that Playwright loads.

::: code-group
<<< ../examples/documentation/package.json
<<< ../examples/documentation/tsconfig.json
<<< ../examples/documentation/playwright.config.ts
<<< ../examples/documentation/fixtures.ts
<<< ../examples/documentation/dialog.spec.ts
:::

Also save **dialog.ts** from the [complete dialog fixture and journey](./recipes/dialog.md#complete-fixture-and-journey) alongside them. These six files are enough for the first dialog run. The [form recipe](./recipes/form.md) adds two more files; the [integration guide](./guide/integration.md#unselected-tests) supplies an optional control test.

## Install and run

```sh
npm install
npx playwright install chromium
npm run typecheck
npm test -- --grep "dialog correct"
npm test -- --grep "dialog escaping-focus"
```

The manifest pins npm package `a11y-journey-evidence@0.1.0` and its Playwright peer `@playwright/test@1.64.1`. Install from [npm](https://www.npmjs.com/package/a11y-journey-evidence/v/0.1.0); GitHub source archives are repository snapshots, not the compiled npm distribution.

The correct dialog has an actual **passed** result. The escaping-focus case has an actual **failed** assertion in **Forward containment boundary**. It uses `test.fail()` to declare that failure expected, so its command can exit **0**. That means the demonstration behaved as expected; it does not mean containment passed. An unexpected pass makes Playwright fail the run. An unrelated failure also requires investigation; the repository's example verifier checks the exact failed step and message.

Run all copied cases with `npm test`. With the form and control files added, the verified example set contains three actual passes and four intended actual failures.

## Find the evidence

The reporter prints a bundle path beneath `.artifacts/evidence/<run-id>/report.md`. Each invocation creates a new run directory. The report retains native actual/expected status and executed assertions, plus observations and available failure artifacts.

- Native HTML: `.artifacts/html/index.html`; open with `npx playwright show-report .artifacts/html`.
- Native JSON: `.artifacts/native.json`.
- Native test output and traces: `.artifacts/results/`.

Start with the [dialog failure walkthrough](./evidence/dialog.md). Copy the **whole run directory** when sharing a portable bundle; its relative artifact links need their files. Inspect it for application data before sharing. This site publishes curated synthetic excerpts, not complete raw bundles.

## Bring it into an existing suite

[Compose your fixtures and reporters](./guide/integration.md), then read the [API and lifecycle reference](./reference/api.md). Use synthetic data first. Passing sampled assertions and complete evidence do not establish accessibility conformance, screen-reader announcements or inclusive usability.
