# GitHub Pages Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` through `personal-workflows:spec-implement`. Execute the checkbox steps in order using Native execution.

**Goal:** Deliver verified public documentation for `a11y-journey-evidence@0.1.0`, deployed through GitHub Pages.

**Architecture:** VitePress builds only the dedicated `site/` directory. Runnable documentation examples are verified against the published npm package outside the checkout. Documentation checks run on pull requests; a separate deployment job publishes the checked build from main.

**Tech Stack:** VitePress 1.6.4, TypeScript, existing Playwright 1.64.1, Node’s test runner, GitHub Actions and Pages.

**Spec:** [Approved GitHub Pages specification](../specs/2026-11-03-github-pages-documentation.md)

**Slug:** `github-pages-documentation`
**Created:** 2026-11-03
**Updated:** 2026-11-03
**Status:** APPROVED — implementation authorized; live verification pending user-controlled merge
**Execution tier:** full
**Implementation model role:** full
**Execution method:** Native
**Provenance:** Approved specification; the user’s separate specification approval; repository and upstream tooling inspection; native selections of root npm scripts and Native execution; the user's separate `PLEASE IMPLEMENT THIS PLAN` message reproducing this plan. Saved after leaving Plan mode, before implementation.

## Global Constraints

- Document experimental, published `a11y-journey-evidence@0.1.0`, using `@playwright/test@1.64.1`.
- Use English, VitePress’s standard theme, local search, and static walkthroughs.
- Public URL: `https://light2288.github.io/a11y-journey-evidence/`.
- Production base: `/a11y-journey-evidence/`. Retain `.html` page URLs; do not require a history fallback.
- Keep native keyboard actions, locators, assertions, named steps and fixture composition.
- Preserve product runtime, exports, peers, version, npm distribution boundary, published package and GitHub release/tag.
- Preserve historical specifications, plans, comparisons and results.
- Publish only inspected synthetic samples. Exclude raw run directories, private payloads, traces, native HTML reports and machine-local paths.
- Work in the existing checkout. Create `docs/github-pages-documentation` only after both approvals; preserve local work without automatic stash, reset or force updates.
- Do not push branches or merge. Pages configuration and deployment from user-merged main are within this increment.
- Complete one integrated `personal-workflows:code-review` gate: specification review, then quality review.
- Stop after live verification and the durable outcome record, before personal-site work or other improvements.

## Repository and Tooling Evidence

- HEAD, local main and observed remote main: `31d0f79f186f782adbf04b921870b6186884b0e9`.
- The approved specification is the sole matching artifact: `NEW_ONLY`. Its implementation plan was `MISSING`; this file retains the same basename.
- Architecture map `docs/architecture/map.md` and architecture/ADR directories are absent at this HEAD. Freshness is not applicable; no applicable ADR was found. Do not generate a map during planning.
- Existing root scripts provide build, typecheck, unit/browser tests, demos and consumer verification.
- Existing consumer verification demonstrates fresh-directory installation, installed-module resolution, native JSON inspection and portable-bundle checks.
- Current shared dialog/form sources match `v0.1.0`; their native assertions define the documentation recipes.
- VitePress’s inspected stable npm tag is `1.6.4`; version 2 remains alpha. Its documented commands support build/preview, project bases and imported code snippets. Its preview server serves built output at the configured base and returns the generated 404 page for missing routes.
- GitHub reports Pages disabled, Actions enabled and repository administration available. Recheck during execution.
- Root tooling and example verification use Node 24.21.0 and npm 11.19.0. Pin `/Users/davide/.nvm/versions/node/v24.21.0/bin` in local subprocess `PATH`; nested directories previously selected another Node version.
- New scripts below are an approved planning choice, not pre-existing commands. Add them with their referenced files and document them in README.

### Planned root command contract

| Script | Definition |
| --- | --- |
| `docs:dev` | `vitepress dev site` |
| `docs:build` | `vitepress build site` |
| `docs:preview` | `vitepress preview site --port 4173` |
| `docs:test:unit` | `node --test tests/docs/*.test.mjs` |
| `docs:test` | `playwright test --config tests/docs/playwright.config.ts` |
| `docs:check` | `npm run docs:test:unit && npm run docs:build && npm run docs:test` |
| `docs:verify-examples` | `node scripts/verify-docs-examples.mjs` |

Keep documentation dependencies development-only. Add exactly `vitepress@1.6.4` and lock its resolved dependencies; retain existing tool pins. No additional HTML parser, site framework or search service is needed.

### GitHub Action pins

Use the inspected immutable commits, with version comments:

| Action | Version | Commit |
| --- | --- | --- |
| `actions/checkout` | 7.0.1 | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| `actions/setup-node` | 7.1.0 | `949feb2413d6458794dcd2491c4babbbce0c15c1` |
| `actions/configure-pages` | 6.0.0 | `45bfe0192ca1faeb007ade9deae92b16b8254a0d` |
| `actions/upload-pages-artifact` | 5.0.0 | `fc324d3547104276b827a68afc52ff2a11cc49c9` |
| `actions/deploy-pages` | 5.0.1 | `368f82528645a54fb793d4d04e342629a3f51346` |

## Review Focus

1. **Root preview hides broken project paths:** test direct `.html` routes, assets, fragments, search and 404 recovery under the production base.
2. **Expected failure masks an unrelated error:** verify actual status, intended named assertion and preceding successful steps.
3. **Checkout resolution masks a broken published integration:** install and resolve the package in a fresh external directory.
4. **Evidence becomes active site content:** render excerpts through code-snippet imports and test hostile HTML, Markdown links and backticks.
5. **Successful deployment serves stale content:** compare public build metadata with the verified deployment commit, then exercise public pages.

Each condition has a check in its owning task below.

---

### Task 1: Establish the branch and production-path site foundation [size: M | risk: none | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-01, AC-11, AC-12, AC-18

**Files:** Approved specification/plan; root manifest and lockfile; `site/.vitepress/config.mts`; `site/index.md`; `site/getting-started.md`; `tests/docs/playwright.config.ts`; `tests/docs/routes.spec.ts`; README command instructions.

**Interfaces:**

- Build output: `site/.vitepress/dist/`.
- Preview address: `http://localhost:4173/a11y-journey-evidence/`.
- Browser configuration uses `DOCS_BASE_URL` when supplied; otherwise starts the local production preview with server reuse disabled.
- VitePress `buildEnd` writes `build-info.json` inside built output, containing `sourceCommit` and documented package version. Obtain the commit from `GITHUB_SHA` in Actions and Git locally.

- [x] Identify both approved artifacts and their separate approval messages. Save this plan before implementation and update only this pair’s lifecycle metadata.
- [x] Inspect status, fetch origin and safely fast-forward main when needed. Preserve the uncommitted artifacts. Create `docs/github-pages-documentation`; inspect any existing branch instead of resetting it. Commit the approved pair using explicit paths.
- [x] Add the pinned development dependency, command prerequisites and failing route checks. Require the production homepage and getting-started route to return 200, load their assets and identify experimental v0.1.0. Require a missing route to return 404 with a working home link.
- [x] Run the red checks: `npm run docs:build` and `npm run docs:test -- --grep subpath`. Expected: failure attributable to the missing site implementation.
- [x] Implement the standard-theme configuration, English metadata, fixed project base, local search, minimal landing page and initial getting-started page. Keep `ignoreDeadLinks` disabled and `cleanUrls` false. Configure navigation/sidebar around the approved reader tasks.
- [x] Add build metadata through the supported build hook. Do not expose environment variables or local paths.
- [x] Run `npm run docs:build` and `npm run docs:test -- --grep subpath`. Expected: exit 0; direct routes, assets and 404 recovery work under the production base.
- [x] Commit the site foundation and tooling with explicit paths.

### Task 2: Verify published-package examples and write onboarding/recipes [size: M | risk: none | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-02, AC-03, AC-04, AC-05, AC-15

**Files:**

- Create the self-contained `examples/documentation/` consumer: manifest, TypeScript/configuration files, composed fixtures, dialog/form fixture-and-journey modules, dialog/form tests and an unselected control.
- Create `scripts/verify-docs-examples.mjs` and `tests/docs/examples.test.mjs`.
- Complete getting-started; create integration and dialog/form recipe pages under `site/guide/` and `site/recipes/`.

**Interfaces:**

- Consumer dependencies use exact npm `a11y-journey-evidence@0.1.0`, Playwright 1.64.1 and existing TypeScript/Node type pins.
- Internal verifier exports `assertExampleResults(nativeReport): void` for regression checks; direct invocation performs fresh installation and execution.
- Verifier saves native reports, evidence bundles and provenance under `.artifacts/docs-examples/`.
- Markdown imports authoritative example files using VitePress code-snippet imports.

- [x] Write failing verifier tests rejecting an unrelated setup/assertion failure, an unexpected pass and a missing case. Pin expected failure locations:

  | Case | Required failing step/message |
  | --- | --- |
  | Dialog escaping focus | `Forward containment boundary` / `Forward containment: focus returns to Continue` |
  | Dialog failed restoration | `Declared focus restoration` / `Restoration: focus returns to Open preferences` |
  | Form missing association | `Declared error associations` / `Association: Name describes its visible error` |
  | Form failed error focus | `Declared invalid-submit focus` / `Error focus: Name is the first invalid field` |

- [x] Run `npm run docs:test:unit`. Expected: red because the verifier is absent or incomplete.
- [x] Implement the self-contained consumer using the released synthetic fixtures/native journeys, with source provenance. Keep their behavior and named assertions intact. Compose a synthetic custom fixture through `mergeTests`; use native and package reporters together.
- [x] Mark the four deliberate regressions as expected failures. Keep both correct journeys and the unselected control as ordinary passing tests. Start observation after setup, with the appropriate attached root.
- [x] Implement external-directory verification: copy only the documentation consumer, install from the official registry, typecheck and run its normal Playwright command. Verify module resolution and lockfile provenance refer to the installed npm package. Use subprocess argument arrays.
- [x] Require exactly seven cases: two actual correct passes, four actual intended failures and one passing unselected control. Inspect named steps and native diagnostics, reporter coexistence, composed fixture availability and control omission from evidence. Preserve generated output before removing temporary installation files.
- [x] Write complete fresh-project instructions and existing-project integration guidance. Import executable source files into code examples; include every required file or a clear link to its complete contents. Explain browser installation, report locations and expected-failure exit behavior.
- [x] Document each correct recipe and both variants, linking released source. Identify chosen focus and validation behavior as example policies.
- [x] Run `npm run docs:test:unit` and `npm run docs:verify-examples`. Expected: exit 0; the proof identifies npm 0.1.0, seven verified cases and generated native/evidence reports.
- [x] Commit the consumer, verification and onboarding/recipes using explicit paths.

### Task 3: Publish inspected walkthroughs and complete the reference [size: M | risk: data | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: data]

**Acceptance criteria:** AC-05, AC-06, AC-07, AC-08, AC-09, AC-18

**Risk:** Failure artifacts and diagnostic excerpts can retain data or become active content when incorporated into the site.

**Files:** Create evidence, API, comparison, limitations and troubleshooting pages; plain-text samples under `site/samples/`; selected PNGs under `site/public/samples/`; `tests/docs/content.spec.ts`.

**Interfaces:**

- Use Task 2’s verified dialog `escaping-focus` and form `missing-error-association` runs.
- Import diagnostic/observation/ARIA excerpts as literal code snippets.
- Publish only the two selected screenshots and curated text excerpts. Keep raw bundles private to local ignored output.

- [x] Write failing browser checks for walkthrough routes and usable screenshot/ARIA evidence. Add an adversarial check that builds a temporary site copy with hostile sample text containing raw HTML, a Markdown link and backtick fences.
- [x] Run `npm run docs:check`. Expected: walkthrough checks fail because the content/assets are missing.
- [x] Inspect the selected generated screenshots, snapshots and reports. Curate excerpts preserving actual failure meaning, focus observations, sequence and teardown phase. Record source version, generation context and editorial omissions; inspect assets visually before publication.
- [x] Write both walkthroughs, explaining the native failed expectation, relevant evidence, reproduction command and incomplete/unexecuted portions. Link each walkthrough to its recipe and evidence-reading guidance.
- [x] Complete the API/reference from the released exports and behavior. Cover fixture options/defaults, lifecycle, reporter options, allowlisted attributes, observation/diagnostic bounds and artifact outcomes. Do not advertise `JourneyReporterOptions` as a named root export.
- [x] Explain actual versus expected status, retries, no/early assertions, not-started fixtures, missing/empty captures, late teardown failures, separate event/step order and whole-directory bundle sharing.
- [x] Write a current stock comparison synthesis using existing author findings. Explain native capabilities and ownership costs fairly; label historical sources and external validation pending. Preserve the historical files.
- [x] Complete troubleshooting, tested-toolchain and data-limit guidance. Include no general sanitization, screen-reader, conformance, broader compatibility or measured productivity claims.
- [x] Run `npm run docs:check`. Expected: exit 0. Hostile text remains literal, creates no injected link/element and executes no script. Built output excludes private run data and unintended engineering routes.
- [x] Commit the selected samples and documentation with explicit paths.

### Task 4: Verify navigation, search, responsive reading and distribution boundaries [size: M | risk: none | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-01, AC-07, AC-10, AC-11, AC-12, AC-15

**Files:** Extend `tests/docs/routes.spec.ts` and `content.spec.ts`; create `tests/docs/navigation.spec.ts`; extend the existing packed-file regression; refine site configuration/content and README.

**Interfaces:**

- Full local checks use the built site.
- Shared browser smoke tests carry `live` in their titles so they can later run against `DOCS_BASE_URL`.
- Check desktop at 1280×900 and mobile at 375×812.

- [x] Add failing behavioral tests for keyboard skip/navigation access, search opening/input/result selection/Escape dismissal and mobile-menu operation. Check focus after dismissal and usable focus progression after navigation.
- [x] Add built-site checks that enumerate generated pages and validate same-site links, fragments, screenshots and referenced assets. Resolve all links against the production base; direct navigation/reload must succeed.
- [x] Check reading pages at both widths. Require no unintended document-level horizontal overflow; code blocks may scroll within their own containers. Require evidence images to load with useful text alternatives.
- [x] Extend the existing pack-boundary test to reject site, documentation tooling, workflow and generated evidence files in the npm archive.
- [x] Run `npm run docs:check` and `npm run test:unit`. Expected: any newly exposed usability, route or packaging problem fails its corresponding check.
- [x] Resolve findings within the standard theme and approved content design. Finish the README documentation link and contributor commands. Keep external resource links versioned where appropriate.
- [x] Run both commands again. Expected: exit 0, with browser interactions and distribution boundaries verified.
- [x] Commit the checks and refinements using explicit paths.

### Task 5: Prepare isolated PR checks and Pages deployment [size: M | risk: security | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: security]

**Acceptance criteria:** AC-12, AC-13, AC-14, AC-17

**Risk:** Pull-request content must not run with deployment authority or publish arbitrary checkout artifacts.

**Files:** Create `.github/workflows/docs.yml`; document maintenance/deployment instructions in README.

**Interfaces:**

- Workflow name: `Documentation`.
- Runner: `ubuntu-24.04`.
- Build artifact: only `site/.vitepress/dist/`.
- Deployment environment: `github-pages`.
- Production commit marker: Task 1’s `build-info.json`.

- [x] Configure `pull_request` and main-only `push` triggers scoped to site content, documentation examples/tests/scripts, root package/lockfile, README and this workflow. Do not introduce general package CI or `pull_request_target`.
- [x] Give build jobs only `contents: read`. Use pinned checkout/setup actions, `persist-credentials: false`, Node 24.21.0, npm 11.19.0 and `npm ci`.
- [x] Install Chromium for documentation-browser checks using `npx playwright install --with-deps chromium`; run `npm run docs:check`. Published-package example verification remains local, avoiding new package-host compatibility claims.
- [x] Upload a Pages artifact only on a push to main, after checks pass. Use the pinned upload action and the exact built-output directory.
- [x] Add a deployment job requiring successful build and a main push. Grant `pages: write` and `id-token: write` only there. Use pinned configure/deploy actions, `github-pages` and deployment concurrency without cancelling an in-progress deployment.
- [x] Inspect workflow event conditions, permissions and artifact paths as part of the required review. Document that actual PR/deployment behavior remains unobserved until the user publishes/merges.
- [x] Run `npm run docs:check` and `git diff --check`. Expected: exit 0 locally; no claim that GitHub Actions has run.
- [x] Commit workflow and maintenance instructions using explicit paths.

### Task 6: Complete local verification and the integrated review [size: M | risk: none | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-02–AC-13, AC-15, AC-17, AC-18

**Files:** Create `docs/github-pages-results.md`; update this plan’s execution notes. Generated logs remain under `.artifacts/docs-verification/`.

**Interfaces:** The durable record separates verified local results, review results, Pages settings and pending/deployed outcomes.

- [x] Run final local verification: `npm test`, `npm run docs:verify-examples`, `npm run docs:check`, `npm pack --dry-run --json` and `git diff --check`. Record exact commands, exits, decisive outputs and actual tool/browser/host versions.
- [x] Inspect rendered desktop/mobile pages and the selected public evidence images. Check installation/source/release and historical-reference links against their actual destinations.
- [x] Record sample provenance, the current author-assessment status and external validation pending. Mark PR execution, deployment and live verification pending.
- [ ] Commit intended implementation/documentation changes, then invoke `personal-workflows:code-review` once in integrated mode: specification review followed by quality review on the same review state.
- [ ] Resolve findings through the prescribed loop, rerunning affected checks. Do not add another generic final review.
- [ ] Record the gate outcome and local-ready state. The next task may configure Pages, but full completion remains dependent on the user-controlled merge.

### Task 7: Configure Pages, verify delivery after merge and record the endpoint [size: M | risk: other | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: auth]

**Acceptance criteria:** AC-13, AC-14, AC-16, AC-17, AC-18

**Risk:** Authenticated repository configuration and asynchronous deployment can leave partially completed or stale public state.

**Files:** Update only the current delivery record and plan with observed outcomes.

**Interfaces:** Produces the public site, verified deployment identity and locally committed delivery evidence.

- [ ] After the integrated gate, recheck repository identity and Pages state. For the expected absent site, configure workflow-based Pages with `gh api --method POST repos/Light2288/a11y-journey-evidence/pages -f build_type=workflow`. Verify it through a subsequent GET. Reuse matching state; investigate unexpected conflicting configuration before changing it.
- [ ] Record actual configuration results and commit the preparation outcome locally. Report the branch ready for the user to push, open a PR and merge. Leave live verification pending; do not push or merge.
- [ ] After the user reports publication/merge, inspect the actual PR workflow and main deployment. Verify the PR had no deployment job execution, and that the successful production run used the intended merged main commit.
- [ ] Verify Pages deployment status and compare the public `build-info.json` commit with that production run’s SHA. A successful run with stale served content does not pass.
- [ ] Run the shared live smoke tests:

  ```sh
  DOCS_BASE_URL=https://light2288.github.io/a11y-journey-evidence/ DOCS_EXPECTED_COMMIT=<verified-deployment-sha> npm run docs:test -- --grep live
  ```

  Substitute the observed deployment SHA. Expected: exit 0; public direct routes, assets, keyboard navigation/search, mobile navigation and 404 recovery work.
- [ ] Verify the README documentation link on merged main and inspect the live walkthroughs. Record workflow/run URL, deployment commit, public URL, checks and actual outcomes. Retain any failure as pending and repair it within this same increment.
- [ ] Save the outcome on a documentation branch, never directly on main. If the user has returned to main after merging, create `docs/github-pages-verification` from safely updated main for the outcome-only commit. Preserve any existing branch/local work.
- [ ] Run `git diff --check`, commit explicit outcome paths and report the site, evidence, limitations and remaining integration status. Do not automatically push this final record.
- [ ] Stop before personal-site work, live demos, package changes or further improvements.

## Acceptance and Verification Traceability

| Criteria | Tasks | Primary evidence |
| --- | --- | --- |
| AC-01 | 1, 4 | Built site, standard navigation/search, route inventory |
| AC-02–04 | 2, 6 | Fresh npm consumer, intended statuses/assertions, executable snippets |
| AC-05 | 2, 3 | Installed declarations, released implementation and public reference |
| AC-06–09 | 3, 6 | Inspected samples, safe rendering, interpretation and author comparison |
| AC-10–11 | 1, 4, 7 | Production-base local tests and public browser checks |
| AC-12 | 1, 4–6 | Locked tooling, command execution and packed-file boundary |
| AC-13–14 | 5, 7 | Reviewed permissions, actual PR/main runs and Pages settings |
| AC-15 | 2–4, 6 | Meaningful regressions, installed examples and sequential review |
| AC-16 | 7 | Deployment SHA, public marker, routes/assets/search and README |
| AC-17 | 6, 7 | Durable local/review/deployment outcome record |
| AC-18 | All | Preserved historical/product release state and explicit limitations |

## Approval Handoff

**Current stage:** Stage 4 — implementation authorized by separate specification approval and the user's `PLEASE IMPLEMENT THIS PLAN` message.

**Artifact:** `docs/superpowers/plans/2026-11-03-github-pages-documentation.md`, saved from the presented and approved plan after leaving Plan mode. Only lifecycle/path wording changed on materialization.

**Approval authorizes:** Native implementation of the approved increment, including local commits, required review and scoped Pages configuration. Branch pushes and merges remain user-controlled.

**Execution endpoint:** Reviewed documentation deployed from merged main, verified publicly, with durable results and local outcome commits. Live completion remains pending until the user-controlled merge; then resume this increment and stop before personal-site work.
