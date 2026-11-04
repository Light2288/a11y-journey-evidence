# README Presentation and Project Illustration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` through `personal-workflows:spec-implement`. Execute tasks in order using the checkbox steps below. Preserve the session's Native execution preference.

**Goal:** Add the supplied illustration and refresh the README so readers can understand, install, and use experimental `a11y-journey-evidence@0.1.0` before encountering contributor details.

**Architecture:** Store one unchanged PNG in VitePress's existing public directory and reference its absolute production URL from the README. Reorganize existing documentation without changing the package or site layout. Reuse current verification commands and temporary visual checks.

**Tech Stack:** GitHub-flavored Markdown and supported HTML, PNG, existing VitePress 1.6.4 and Playwright 1.64.1, Node 24.21.0, npm 11.19.0.

**Spec:** [Approved README specification](../specs/2026-11-05-readme-presentation.md)
**Slug:** `readme-presentation`
**Created:** 2026-11-05
**Updated:** 2026-11-05
**Status:** APPROVED — implementation in progress
**Execution tier:** full
**Implementation model role:** full
**Execution method:** Native
**Provenance:** The approved specification; the user's separate `approved` message following its presentation; inspection of the current README, Light Stimulus reference README, package manifest, existing documentation, verifier and package/browser checks.

## Global Constraints

- Copy `/Users/davide/Downloads/Keyboard Accessibility Flow Infographic.png` unchanged to `site/public/images/a11y-journey-evidence.png`. Preserve the Downloads original.
- Source PNG: 1672 × 941; SHA-256 `02e0cf7ce99bc9ea5c5fda37afd275c46bec3917c7779d0d007cf7ed51948647`.
- README image URL: `https://light2288.github.io/a11y-journey-evidence/images/a11y-journey-evidence.png`. Center it at approximately 640 px wide, preserving aspect ratio and narrow-container fit. Identify it as an illustration in its alternative text.
- Use a plain project title and headings without emoji. Keep the package experimental, externally unvalidated, and narrowly tested.
- Preserve useful commands, native authoring, expected-failure interpretation, capture timing, data safeguards, and historical references. Concise summaries may link to existing detailed documentation.
- No runtime, export, dependency, version, npm publication, release/tag, workflow, homepage-layout, personal-site, or image-generation changes. Keep the PNG outside the npm archive.
- Work in the existing checkout. Do not refresh main or create a branch until this plan is explicitly approved. Preserve local edits; no automatic stash, reset, or force update. Do not push or merge.
- Complete one integrated `personal-workflows:code-review` gate, specification first and quality second. Do not add a generic final reviewer.
- This is a documentation/static-asset change. Do not add tests that mirror prose, layout configuration, or the image filename; existing checks and direct visual/asset verification are sufficient. A discovered behavioral fix requires its own scope approval.

## Repository and Tooling Evidence

- Inspected HEAD: `48883031e85f8eb68a795ad9cd9aea9b0a227d62`. Main matches the locally recorded origin/main. Only this increment's specification was untracked before planning; no fetch has run during definition/planning.
- Artifact resolution: specification `NEW_ONLY`; plan `MISSING` before creating this file. No matching legacy artifact exists. Both filenames use the specification's original date.
- Architecture-map path `docs/architecture/map.md`, `docs/architecture/`, `docs/adr/`, and `docs/adrs/` are absent at this HEAD; freshness is not applicable, and no applicable ADR was found. No architecture map will be generated.
- `package.json` declares the npm file boundary as `dist`, `README.md`, and `LICENSE`. `tests/unit/package.test.ts` verifies runtime/declaration entries and rejects `site/` and other engineering files.
- `site/.vitepress/config.mts` sets `/a11y-journey-evidence/`; VitePress copies public assets to built output. The existing workflow already triggers on README and site changes.
- `site/getting-started.md`, `site/guide/integration.md`, and `examples/documentation/` provide authoritative runnable onboarding and fixture/reporter composition. `src/index.ts` confirms the root exports; use the released API documentation for behavior.
- `npm run docs:check` is backed by `docs:test:unit`, `docs:build`, and `docs:test`. It checks the built production site using the configuration in `tests/docs/playwright.config.ts`.
- `npm run test:unit` builds/typechecks before running Node tests, including the archive boundary. `npm run docs:verify-examples` verifies a fresh published-package consumer. `npm pack --dry-run --json` is also used by the existing package test.
- VitePress exports `createMarkdownRenderer`, confirmed in its installed declarations; Playwright is installed. Use these existing tools for an ignored local README preview; no additional renderer dependency is needed.
- Local Node 24.21.0 and npm 11.19.0 were rechecked on Darwin arm64. Prefix local Node/npm commands with `env -u NO_COLOR -u FORCE_COLOR PATH="/Users/davide/.nvm/versions/node/v24.21.0/bin:$PATH"` to preserve the repository's toolchain.

## Review Focus

1. **A repository-relative image works on GitHub but fails on npm:** check the exact absolute production URL and prove the corresponding built asset loads locally; disclose deployment pending.
2. **A landscape image becomes a tiny icon or overflows mobile:** inspect desktop and 375 px rendering for legibility, full-image visibility, aspect ratio, and document overflow.
3. **Markdown inside centering HTML becomes literal text:** inspect rendered badges, links, and introductory prose; avoid nesting Markdown within unsupported HTML arrangements.
4. **A shorter README drops an important warning or usable step:** compare the old/new content against the specification, validate snippets and commands against released documentation, and retain direct links for condensed detail.
5. **A presentation change alters package boundaries or implies a new release:** run the existing archive check, review the complete file list, and explicitly retain publication/deployment limitations.

Each focus item has a verification step in Task 2 or Task 3 below.

## Files and Responsibilities

| File | Responsibility |
| --- | --- |
| `README.md` | Reader-oriented introduction, installation, integration, examples, safeguards, contributor guidance, and reference links |
| `site/public/images/a11y-journey-evidence.png` | Exact supplied illustration, reused through one public URL |
| `docs/superpowers/specs/2026-11-05-readme-presentation.md` | Approved scope and lifecycle metadata only |
| This plan | Execution checklist, observed verification/review outcomes, and pending integration actions |
| `.artifacts/readme-presentation/` (ignored) | Temporary preview scripts/HTML, screenshots, command logs, and review scratch package |

No other tracked files are planned. The implementation may refine README wording and header markup within the approved criteria.

### Task 1: Establish the approved branch and artifact baseline [size: S | risk: none | mechanical: true | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-08, AC-09

**Files:** Approved specification and this plan.

**Interfaces:** Consumes both saved artifacts and their separate approval messages. Produces branch `docs/readme-presentation` and a recorded base commit.

- [x] Identify the user's specification approval and the later plan approval. Mark only this pair's lifecycle metadata approved/in progress, preserving creation dates and scope.
- [x] Inspect `git status --short --branch`, local differences, remotes, and current branch. Run `git fetch origin`, then compare main and origin/main. Fast-forward main only if safe, preserving the uncommitted pair. If divergence or overlapping changes prevents this, request a ruling without stashing or resetting.
- [x] Create `docs/readme-presentation` from safely updated main. If it already exists, inspect and reuse only appropriate state rather than resetting it. Record the actual base commit and any relevant intervening changes.
- [x] Commit the approved specification and plan with explicit paths, using `docs: record approved README presentation scope and plan`. Expected: only the approved pair enters this initial commit; unrelated work is preserved.

### Task 2: Deliver the illustration and reader-oriented README [size: M | risk: none | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-01–AC-07

**Files:** Create `site/public/images/a11y-journey-evidence.png`; modify `README.md`.

**Interfaces:** Consumes the exact source PNG, current README, and released onboarding/integration examples. Produces the public image path and refreshed README. There are no new runtime interfaces or scripts.

- [x] Recheck source SHA-256 and dimensions with `shasum -a 256` and `sips -g pixelWidth -g pixelHeight` on the supplied path. Expected: the exact hash and 1672 × 941 dimensions above. Stop for a discrepancy rather than choosing another Downloads image.
- [x] Copy the source bytes to the declared repository path. Compare source and destination with `cmp` and recheck the destination dimensions/hash. Expected: identical bytes, exit 0, and unchanged dimensions.
- [x] Add the opening illustration using centered, GitHub-supported HTML and the exact absolute URL, approximately `width="640"`, no fixed height, and descriptive alternative text. Use minimal centering markup with Markdown content outside HTML blocks when needed. Add the plain title, concise native-Playwright purpose statement, static factual npm/Playwright/MIT badges, and documentation/npm/release links.
- [x] Reorder and edit the whole README using the specification's seven reader-task groups. Put published installation and a usable quick start before contributor commands. Base fixture/reporter snippets on `site/guide/integration.md` and `examples/documentation/`; give partial snippets explicit context and link complete executable files. Keep native actions, locators, steps, assertions, and `mergeTests` composition.
- [x] Preserve demo/filter commands, output locations, actual-versus-expected failures, incomplete/early evidence, capture timing, whole-bundle sharing, independent capture controls, data risks, experimental compatibility, and external validation pending. Link detailed bounds/options and historical findings where abbreviated. Distinguish documentation CI from package host verification. Retain developer/build/verification/documentation commands and MIT license information.
- [x] Compare before/after content against AC-03–AC-06 and inspect each code block against current manifest, declarations, and linked executable examples. Expected: no invented command, missing required file, unsupported claim, or orphaned essential guidance. The Light Stimulus repository remains read-only.
- [x] Build an ignored README preview using VitePress's installed Markdown renderer and a restrained GitHub-like container. At 1280 px and 375 px, inspect it using Playwright and saved screenshots. Intercept only the production illustration request with the local PNG for this preview, recording that substitution. Require a loaded complete image, preserved aspect ratio, roughly 640 px desktop width, narrow-container fit, no document overflow, and rendered header links/badges rather than literal markup. Record that local rendering approximates GitHub; public GitHub rendering awaits publication.
- [x] Inspect the complete intended diff, run `git diff --check`, and commit only `README.md` and the new PNG with `docs: refresh README and add project illustration`. Expected: no image alteration or unrelated tracked changes.

### Task 3: Verify delivery, complete the integrated review, and record the endpoint [size: M | risk: none | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-01–AC-09

**Files:** Update this plan's execution notes; approved-spec lifecycle metadata only if needed. Logs, screenshots, and review inputs remain under the ignored artifact directory.

**Interfaces:** Consumes Task 2's README/PNG and the actual branch diff. Produces verified local commits and one durable outcome record in this plan; public deployment remains user-controlled.

- [x] Run `npm run docs:check`. Expected: exit 0 for the existing verifier unit tests, production build, and browser checks. Capture exact commands, exits, and decisive output; record actual host/tool versions.
- [x] Verify `site/.vitepress/dist/images/a11y-journey-evidence.png` matches the source checksum. Start `npm run docs:preview` and request `http://localhost:4173/a11y-journey-evidence/images/a11y-journey-evidence.png` using installed Playwright's request/browser APIs. Require HTTP 200, PNG content, matching response bytes, and 1672 × 941 natural dimensions. Stop the preview process after inspection.
- [x] Run `npm run test:unit` and `npm pack --dry-run --json`. Expected: exit 0; required runtime/declaration files remain present, and no PNG, site, documentation-tooling, or generated evidence files enter the archive. Review `git diff <recorded-base> --name-only` to confirm runtime, manifests, lockfile, workflow, version, and release records are unchanged.
- [x] Run `npm run docs:verify-examples`. Expected: exit 0 for the fresh npm 0.1.0 consumer, fixture composition, native/evidence reporters, two correct journeys, four intended actual failures, and the unselected control. If the README adds a standalone executable snippet beyond those examples, execute that snippet in the same fresh-consumer context with the normal installed Playwright command and record its result.
- [x] Check the rendered README's local links/fragments against the checkout and external documentation/repository/release links against actual destinations. Verify versioned example links where appropriate. Treat the new production image URL as pending deployment; verify it through the local route above. If npm's website blocks automation, record that limitation and use the official registry metadata/consumer install to verify package identity rather than claiming a broken link or a successful webpage check.
- [x] Record local checks, PNG provenance, screenshots, pending public URL/GitHub rendering, unchanged npm/release state, and current author-assessment/external-validation status in this plan's execution notes. Commit intended implementation/outcome changes with explicit paths before review.
- [ ] Invoke `personal-workflows:code-review` once in integrated mode for the whole branch. Build its required scratch review package with this approved spec/plan, complete diff/file list, image checksum and visual context, and observed verification. Run the prescribed specification reviewer before the quality reviewer on the same package identity; use its enclosing remediation loop without an additional generic final review.
- [ ] Resolve actionable findings within scope and rerun affected checks. Record gate outcomes and any residual limitations, then run `git diff --check` and inspect final status. Commit explicit final outcome/fix paths; do not include scratch files or unrelated work.
- [ ] Report the resulting branch/commits, image location, README improvements, checks actually passed, limitations, and next integration action. Explain that the user must push/open/merge a PR and allow the existing Pages deployment before the new public image URL works. No push, merge, publication, or further site work occurs here.

## Acceptance and Verification Traceability

| Criteria | Tasks | Evidence |
| --- | --- | --- |
| AC-01 | 2, 3 | Source/destination/built/served PNG checksums and natural dimensions |
| AC-02 | 2, 3 | Desktop/narrow rendered README, image fit, alt text, plain headings |
| AC-03 | 2, 3 | Rendered header, badge labels, destination checks |
| AC-04–AC-05 | 2, 3 | Content comparison, canonical runnable sources, fresh published consumer |
| AC-06 | 2, 3 | Visible safeguards, compatibility/evaluation wording, integrated review |
| AC-07 | 2, 3 | Exact absolute URL and production-base local HTTP response; deployment clearly pending |
| AC-08 | 1, 3 | Branch baseline, existing pack regression, dry-run file list, scope diff |
| AC-09 | All | Recorded verification, sequential integrated review, final local outcome commits |

## Self-Review and Approval Handoff

The plan covers every criterion, retains the selected delivery boundary, and leaves exact wording and minor section grouping to implementation. All project verification commands exist in the manifest or cited existing tests; image/Git checks use installed platform tools. No test-only dependency, public script, configuration change, or behavior change is introduced. Editorial work makes the full tier appropriate despite the bounded scope. No material implementation decision requires additional clarification.

**Plan approval:** The user's `approved` message immediately following this plan's presentation, separately from the earlier specification approval.

**Current stage:** Stage 4 — implementation.

**Artifact:** `docs/superpowers/plans/2026-11-05-readme-presentation.md`.

**Approval authorizes:** Native implementation of this plan in the existing checkout, including safe Git preflight, the documentation branch, image/README edits, verification, the integrated review, and local commits. It does not authorize pushing, merging, or publishing.

**Execution endpoint:** Locally committed and reviewed illustration/README update with verification evidence and public-deployment dependency recorded; stop before user-controlled integration and other improvements.

## Execution Notes

Implementation started after the separately recorded specification and plan approvals. Selected tier: full; method: Native; no parent-model switch occurred. Remote fetch confirmed main and origin/main remain aligned at `48883031e85f8eb68a795ad9cd9aea9b0a227d62`; no fast-forward was needed. The existing checkout is used as requested.


### Local verification — 2026-11-05

The only implementation files changed are `README.md` and `site/public/images/a11y-journey-evidence.png`; the other two tracked files are this approved specification/plan pair. The source PNG, repository PNG, production-build PNG, and preview HTTP response share SHA-256 `02e0cf7ce99bc9ea5c5fda37afd275c46bec3917c7779d0d007cf7ed51948647` and natural dimensions 1672 × 941. Downloads remains unchanged.

All Node/npm commands below used `env -u NO_COLOR -u FORCE_COLOR PATH="/Users/davide/.nvm/versions/node/v24.21.0/bin:$PATH"`. Logs, temporary scripts, proofs, and inspected screenshots are retained under `.artifacts/readme-presentation/` and remain ignored.

| Command/check | Exit | Observed result |
| --- | --- | --- |
| `npm test` before README/PNG edits | 0 | 6 unit and 53 browser tests passed; clean baseline |
| `node .artifacts/readme-presentation/preview.mjs` | 0 | Desktop 1280: centered 640 × 360.1875 image; mobile 375: 343 × 193.03125; no document overflow; three labeled badges loaded and links rendered |
| `node .artifacts/readme-presentation/verify-quickstart.mjs` | 0 | Exact README configuration/test/composition snippets typechecked; fresh official npm 0.1.0 install; `npx playwright test`: 1 passed; native/evidence reports; downloaded fixture matches release tag bytes |
| `npm run docs:check` | 0 | 5 documentation unit checks and 13 Chromium browser checks passed; production build succeeded |
| `npm run test:unit` | 0 | 6 tests passed, including existing archive boundary; build/typecheck succeeded |
| `npm pack --dry-run --json` | 0 | 23 files: runtime/declarations, README, license, and automatically included package manifest; no PNG or site files |
| `npm run docs:verify-examples` | 0 | Fresh registry 0.1.0 consumer; 3 actual passes (two journeys and control), 4 intended actual assertion failures; composition/report coexistence and control omission verified |
| `node .artifacts/readme-presentation/verify-asset.mjs` | 0 | Production-base preview route returned HTTP 200, `image/png`, matching checksum, and original dimensions; archive exclusions also checked |
| `node .artifacts/readme-presentation/verify-links.mjs` | 0 | 44 unique references: 27 HTTP 200 responses, 14 resolving local fragments, 2 npm website HTTP 403 automation blocks, 1 new image URL pending deployment; public API fragment resolved |
| `git diff --check` | 0 | No whitespace errors |

Local preview used `npm run docs:preview`; its process was stopped after inspection (intentional interrupt exit 130). The README visual preview used VitePress's Markdown renderer and GitHub-like CSS, substituting only the pending production illustration request with the local PNG. Desktop/mobile header and mobile code-section screenshots were inspected. This approximates GitHub rendering; actual GitHub rendering and the public image route await user-controlled integration/deployment.

Initial temporary verification scripts exposed three harness assumptions: VitePress headings include accessible permalink names, macOS temporary directories resolve through `/private`, and npm automatically includes `package.json`. Those scratch checks were corrected using observed renderer/path/archive behavior and rerun successfully; initial diagnostic logs are retained. No package/site behavior was changed to satisfy a check.

Verified host/toolchain: macOS 27.0.1 (26A434), arm64; Node 24.21.0, npm 11.19.0, TypeScript 7.0.2, Playwright 1.64.1, Chromium 156.0.8078.4, VitePress 1.6.4. This does not expand compatibility claims. The official registry installation/integrity check succeeded despite npm's website rejecting automated requests.

The image is an illustrative diagram, not a run screenshot. Current comparisons remain author assessments and external validation remains pending. Product runtime, exports, manifest/lockfile, package version, workflow, historical records, npm publication, and GitHub release/tag were not changed. The new public image URL will work only after the user pushes/merges and Pages deploys; no push, merge, publication, or Pages setting change has occurred.

Integrated specification/quality review and final handoff are pending at this record's preparation commit.
