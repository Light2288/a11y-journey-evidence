# README Presentation and Project Illustration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` through `personal-workflows:spec-implement`. Execute tasks in order using the checkbox steps below. Preserve the session's Native execution preference.

**Goal:** Finish the existing README presentation with an independently loadable, commit-pinned illustration displayed at 400 px wide, preserving the completed onboarding refresh.

**Architecture:** Keep the unchanged PNG in VitePress's public directory and reference that existing asset through its absolute commit-pinned GitHub URL. Change only the README image source/display width. Reuse current tooling, verifying the real remote image and GitHub-generated markup without local image substitution.

**Tech Stack:** GitHub-flavored Markdown and supported HTML, PNG, existing VitePress 1.6.4 and Playwright 1.64.1, Node 24.21.0, npm 11.19.0.

**Spec:** [Approved README specification](../specs/2026-11-05-readme-presentation.md)
**Slug:** `readme-presentation`
**Created:** 2026-11-05
**Updated:** 2026-11-05
**Status:** APPROVED — image URL/display-size correction in progress
**Execution tier:** full
**Implementation model role:** full
**Execution method:** Native
**Provenance:** The originally approved specification and plan; the later confirmed image URL/display-size correction and its separately approved revised specification; inspection of the current README, GitHub-rendered branch markup, remote asset responses, package manifest, and existing verification tooling. Original implementation/review evidence is retained below.

## Global Constraints

- Keep the existing `site/public/images/a11y-journey-evidence.png` unchanged, matching `/Users/davide/Downloads/Keyboard Accessibility Flow Infographic.png`. Preserve the Downloads original.
- Source PNG: 1672 × 941; SHA-256 `02e0cf7ce99bc9ea5c5fda37afd275c46bec3917c7779d0d007cf7ed51948647`.
- README image URL: `https://raw.githubusercontent.com/Light2288/a11y-journey-evidence/3b3a0941c347f1b3d7c9fb6002ec5d086cccca86/site/public/images/a11y-journey-evidence.png`. Center it at 400 CSS px wide when space permits, preserving aspect ratio and narrow-container fit. Preserve its existing descriptive alternative text.
- Use a plain project title and headings without emoji. Keep the package experimental, externally unvalidated, and narrowly tested.
- Preserve useful commands, native authoring, expected-failure interpretation, capture timing, data safeguards, and historical references. Concise summaries may link to existing detailed documentation.
- No runtime, export, dependency, version, npm publication, release/tag, workflow, homepage-layout, personal-site, or image-generation changes. Keep the PNG outside the npm archive.
- Work in the existing checkout on the existing `docs/readme-presentation` branch after separate revision approvals. Preserve local edits and commits; no automatic stash, reset, force update, new branch, or main update is needed for this bounded correction. Do not push or merge.
- Complete one integrated `personal-workflows:code-review` gate for the revised state, specification first and quality second. The original passed gate remains historical evidence; do not reopen it or add a generic final reviewer.
- This is a documentation/static-asset change. Do not add tests that mirror prose, layout configuration, or the image filename; existing checks and direct visual/asset verification are sufficient. A discovered behavioral fix requires its own scope approval.

## Original Repository and Tooling Evidence

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

## Original Review Focus

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

The completed Tasks 1–3 below are retained as historical instructions for the original implementation. Their former Pages URL, 640 px sizing, and deployment dependency are superseded only by the revised global constraints and Tasks 4–5. Do not rerun the completed original work or overwrite its evidence.

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
- [x] Invoke `personal-workflows:code-review` once in integrated mode for the whole branch. Build its required scratch review package with this approved spec/plan, complete diff/file list, image checksum and visual context, and observed verification. Run the prescribed specification reviewer before the quality reviewer on the same package identity; use its enclosing remediation loop without an additional generic final review.
- [x] Resolve actionable findings within scope and rerun affected checks. Record gate outcomes and any residual limitations, then run `git diff --check` and inspect final status. Commit explicit final outcome/fix paths; do not include scratch files or unrelated work.
- [x] Report the resulting branch/commits, image location, README improvements, checks actually passed, limitations, and next integration action. Explain that the user must push/open/merge a PR and allow the existing Pages deployment before the new public image URL works. No push, merge, publication, or further site work occurs here.

## Image URL/Display-Size Correction

### Current evidence and execution boundary

- Revision base: `207edc0540b458d9c058d39c5bc505afa3a69437` on the clean, published `docs/readme-presentation` branch before artifact revisions. No branch update/fetch has been performed during correction planning.
- Specification and plan resolve as the sole matching new-path pair; retain the same filenames, slug, creation date, original approvals, and outcomes. The revised specification and this revised plan received separate explicit approvals.
- Investigation found the branch PNG present, the README's Pages source returning HTTP 404, and GitHub markup preserving the former 640 px width. The new immutable source returned HTTP 200 with `image/png`. Recheck actual state during execution.
- Architecture paths absent at the original base remain absent at the revision base: `docs/architecture/map.md`, `docs/architecture/`, `docs/adr/`, and `docs/adrs/`. Freshness remains not applicable; no applicable ADR is present and no map will be generated.
- Existing package scripts still provide `npm test`, `npm run test:unit`, `npm run docs:check`, and their build/browser prerequisites. The existing package regression uses `npm pack --dry-run --json`. Installed GitHub CLI can retrieve rendered README HTML and render local Markdown through its documented `/markdown` endpoint; this computes HTML without editing a repository object or posting a message.
- Keep temporary correction checks/logs/screenshots under `.artifacts/readme-presentation/correction/`; do not overwrite original verification artifacts. Restore original task-completion entries into the plan-scoped execution ledger if its removed workspace must be recreated, then resume at Task 4.
- Preserve Native/full execution. Editorial and visual judgment in Task 5 retains the full tier; no parent-model switch is implied.

### Correction review focus

1. **A substituted image hides a broken remote source:** load the actual immutable URL, verify response bytes, and render without image interception.
2. **GitHub sanitization/proxying changes the markup:** render the revised Markdown through GitHub and verify the 400 px width and source/canonical target, including the proxy response when present.
3. **The smaller image loses readability or overflows mobile:** inspect centered 400 px desktop and narrower responsive rendering with original aspect ratio and no document overflow.
4. **An asset link depends on a deleted branch or Pages:** require the exact existing commit-pinned URL and distinguish source availability from revised README/Pages publication.
5. **A two-value correction disturbs completed work:** review the delta against the revision base; retain all other README content, unchanged PNG, npm boundary, and prior records.

### Task 4: Correct the image source and display width [size: S | risk: none | mechanical: true | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-01, AC-02, AC-03, AC-07, AC-08

**Files:** Modify `README.md` and the approved artifact pair's lifecycle metadata only. Do not modify the PNG.

**Interfaces:** Consumes both separately approved revisions and the existing image commit. Produces the same README with only `src` and `width` changed on its illustration element.

- [x] Identify the correction's scope confirmation, revised specification approval, and later revised plan approval. Save/mark the pair approved before editing the README. Inspect local status and `git fetch origin`; confirm the existing branch and its remote still match the revision base or inspect any intervening changes. Preserve the specification/plan edits. Do not reset, update main, create another branch, or overwrite divergent work. Commit the approved pair with explicit paths using `docs: record approved README image correction`.
- [x] Record the current image URL response and GitHub's rendered branch README markup using the existing `gh api` readme endpoint. Expected from investigation: old Pages source HTTP 404, width 640. If public state has changed, report the actual observation rather than fabricating a red result. Recheck the local PNG checksum and the immutable remote source checksum/content type.
- [x] Change only the illustration `src` to the exact commit-pinned URL above and `width="640"` to `width="400"`. Keep centering, descriptive alternative text, all other README content, and the PNG bytes unchanged.
- [x] Use the installed GitHub CLI's Markdown-rendering endpoint with the local README as structured JSON input saved under ignored artifacts. Require the rendered illustration to retain width 400, the correct target or `data-canonical-src`, and responsive maximum-width behavior. Fetch the real source and any generated proxy URL: require HTTP 200, PNG content, and the original SHA-256. Do not use local image substitution; investigate/report proxy errors separately. No branch push or remote content edit is required to compute this HTML.
- [x] Render the GitHub-generated HTML with a local GitHub-like container at 1280 px and 375 px using installed Playwright. Allow real network image loading. Require natural dimensions 1672 × 941; centered desktop width 400 and height approximately 225; narrower-container fit, preserved aspect ratio, no document overflow, and intact title/badges/links. Save and inspect screenshots. Label this as GitHub-generated markup in a local preview; the actual updated branch page still awaits the user's push.
- [x] Run `git diff --check` and inspect `git diff 207edc0540b458d9c058d39c5bc505afa3a69437 -- README.md`. Expected: only the image source and width changed. Commit only `README.md` using `docs: fix README image loading and reduce display width`.

### Task 5: Verify the correction and preserve delivery evidence [size: S | risk: none | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-01–AC-09

**Files:** Append correction outcomes to this plan and update this pair's lifecycle metadata. Keep original execution/review notes intact; all new scratch evidence stays under the correction artifact directory.

**Interfaces:** Consumes Task 4's corrected image reference, real response/rendering proof, and revision-base delta. Produces locally committed verified corrections and a clear user-controlled integration handoff.

- [x] Run `npm run docs:check`, `npm run test:unit`, and `npm pack --dry-run --json` with the pinned Node/npm environment documented above. Expected: exit 0, unchanged production PNG checksum, and the same npm boundary excluding site/PNG files. Record exact exits and decisive output. Use the actual file list rather than relying on the old 23-file count alone.
- [x] Verify the corrected image URL through the real network again as part of the presentation check if the README changes after Task 4. Validate header destinations and compare the entire revision delta. Expected: only the two README attribute values plus approved specification/plan/outcome records change. Runtime, dependency pins, code snippets, examples, release/tag, and all other assets remain unchanged. Do not repeat fresh-consumer installation for unchanged snippets; retain its prior successful result as historical evidence.
- [x] Append actual correction checks, rendered screenshots, source/proxy HTTP/checksum results, host/tool versions, and public-publication status to a separate correction outcome section below. Commit intended verification records before the revised-state gate.
- [ ] Invoke `personal-workflows:code-review` once in integrated mode for the revised branch state. Supply the approved revised pair, complete branch diff and explicit correction delta from `207edc0`, prior gate result, and fresh correction evidence. Run specification review before quality review on one immutable package. The review applies to the revised state; preserve the original gate record and do not dispatch a generic reviewer.
- [ ] Resolve findings using the prescribed single remediation loop and rerun affected checks. Run the branch-finishing `npm test`; expected exit 0 for the full existing package suite. Record review outcome, limitations, and actual final verification; mark only the correction's new tasks complete. Run `git diff --check` and commit explicit outcome paths locally.
- [ ] Report the 400 px header, real image-loading proof, checks and review, current clean branch/commits, and remaining user action. The user must push the new commits to see the revised GitHub branch README; Pages is no longer required for its image to load. The separate Pages asset and main README still depend on user merge/deployment. Do not push or merge, then stop before any additional changes.

### Revised acceptance traceability

| Criteria | Correction tasks | Evidence |
| --- | --- | --- |
| AC-01, AC-02 | 4, 5 | Unchanged source bytes; real source/proxy responses; 400 px desktop and responsive mobile screenshots |
| AC-03–AC-06 | 4, 5 | Unchanged header links and README body/snippets, prior successful onboarding evidence, revised-state review |
| AC-07 | 4, 5 | Exact immutable URL, real HTTP/PNG/checksum results, GitHub-generated markup, honest publication status |
| AC-08, AC-09 | 4, 5 | Correction delta, existing suites/archive boundary, sequential review, appended local outcome record |

No material decision remains unresolved. This correction retains the original artifact pair and completed work, changes only the confirmed two presentation values, and adds no dependency, public script, permanent prose-mirroring test, or speculative work.

## Original Acceptance and Verification Traceability

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

## Original Self-Review and Approval Handoff (Historical)

The plan covers every criterion, retains the selected delivery boundary, and leaves exact wording and minor section grouping to implementation. All project verification commands exist in the manifest or cited existing tests; image/Git checks use installed platform tools. No test-only dependency, public script, configuration change, or behavior change is introduced. Editorial work makes the full tier appropriate despite the bounded scope. No material implementation decision requires additional clarification.

**Plan approval:** The user's `approved` message immediately following this plan's presentation, separately from the earlier specification approval.

**Current stage:** Stage 4 — local implementation complete; user integration pending.

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

### Integrated review and local completion

The sole integrated gate reviewed branch state `821b1bbccaad407928aa48bc2e909311ad79d119` against base `48883031e85f8eb68a795ad9cd9aea9b0a227d62`. Specification review passed, then quality review passed on the identical immutable package; there were no findings, no deferred minors, and no remediation pass.

- `GATE_RUN_ID`: `529654fc-0f63-4ead-87dd-964f56039bf5`.
- `REVIEWED_STATE_ID`: `821b1bbccaad407928aa48bc2e909311ad79d119:7de168d2-81ad-4038-9e8b-168ccbcfa33b`.
- `PACKAGE_SHA256`: `134548d195c58c5bd10da592e7c0b024e8c31a841d2f04f663ecba5759167f70`.

Quality independently checked the clean reviewed state, image hashes/dimensions, and desktop/mobile screenshots; it assessed existing recorded suite evidence without rerunning the suites. The reviewer reports, immutable package, and execution ledger are retained in ignored `.artifacts/readme-presentation/`. No additional final reviewer was dispatched.

The author then ran the required branch-finishing `npm test` again on the unchanged implementation: exit 0, **6 unit + 53 browser tests passed** (Chromium run 24.6s). The completion commit updates only lifecycle/checklist/outcome metadata on this approved pair. Final whitespace checks passed.

The review's three declined-to-judge areas were resolved as explicit limitations:

1. **Ruling:** Live GitHub rendering and public image delivery remain deferred to user integration, as approved. Local rendering and the production-base asset response are verified. Cost if wrong: a live layout or URL issue could require follow-up after deployment.
2. **Ruling:** npm webpage rendering remains unverified after HTTP 403. Official-registry integration passed, and the published npm README stays unchanged. Cost if wrong: npm-specific presentation could differ during a future publication.
3. **Ruling:** Broader compatibility remains unverified; retain the documented tested environment. Cost if wrong: unsupported environments may encounter issues.

**Endpoint reached:** Keep `docs/readme-presentation` in the existing checkout with local implementation, verification, and outcome commits. No branch push, PR creation, merge, npm publication, release edit, or Pages-setting change occurred. The next user-controlled action is to publish the branch and merge its PR, then let the existing Pages workflow deploy the image. The homepage layout is unchanged; this increment supplies a reusable public image asset and its README presentation. Stop before personal-site or further product/site work.

## Revised Plan Approval Handoff

**Revised plan approval:** The user's `approved` message immediately following presentation of correction Tasks 4–5, separately from revised specification approval.

**Current stage:** Stage 4 — correction implementation in progress.

**Artifact:** `docs/superpowers/plans/2026-11-05-readme-presentation.md`, correction Tasks 4–5. Original Tasks 1–3 and their results remain completed historical records.

**Approval authorizes:** Native implementation of the separately approved specification revision through Tasks 4–5 on the existing branch, including real image/rendering verification, required review, and local commits. It does not authorize pushing, merging, publishing, or changing the original image.

**Execution endpoint:** A locally committed, verified 400 px README image using the existing immutable GitHub source, with preserved history and a user-controlled push/merge handoff. Correction implementation started after both revised approvals.

## Image correction verification — 2026-11-05

The correction followed separate scope, revised-specification, and revised-plan approvals. It reuses the original branch and pair without changing the completed Tasks 1–3 or their historical results. Fetch confirmed the published branch and local branch matched correction base `207edc0540b458d9c058d39c5bc505afa3a69437`. No main update, reset, stash, push, merge, or new branch occurred. The approved pair was committed as `ccd9663`; the README correction was committed as `e00bc83`.

The old Pages image source returned HTTP 404, and GitHub's branch README markup retained width 640. The corrected immutable source returned HTTP 200 and `image/png`, with SHA-256 `02e0cf7ce99bc9ea5c5fda37afd275c46bec3917c7779d0d007cf7ed51948647`, matching the unchanged supplied/repository/build PNG.

GitHub's Markdown API rendered the revised README without changing remote content. Its generated HTML retains width 400, maximum width 100%, and the direct raw.githubusercontent.com source; no hero-image proxy was generated. Playwright loaded the real image over the network without interception or substitution. The inspected GitHub-generated HTML in a local GitHub-like container shows a centered **400 × 225.109375** image at viewport 1280 and **343 × 193.03125** at viewport 375. Natural dimensions remain 1672 × 941. Both requests returned 200 with matching bytes; no document overflow occurred, and the title, three badges, and three main header links remained intact. This verifies generated markup and real source delivery; the revised branch page still awaits the user's push.

All commands used the pinned Node/npm environment documented above. New logs/proofs/screenshots remain ignored under `.artifacts/readme-presentation/correction/`, separate from original evidence.

| Command/check | Exit | Actual result |
| --- | --- | --- |
| `node .artifacts/readme-presentation/correction/verify-render.mjs` | 0 | Real network loading, matching bytes, GitHub-generated markup, desktop/mobile dimensions and no overflow; screenshots inspected |
| `npm run docs:check` | 0 | 5 documentation unit checks, production build, and 13 Chromium browser checks passed |
| `npm run test:unit` | 0 | Build/typecheck and all 6 unit tests passed, including archive boundary |
| `npm pack --dry-run --json` | 0 | Inspected 23 entries: only dist runtime/declarations, README, LICENSE, and npm's automatically included package.json; no PNG/site files |
| Node boundary/link assertions | 0 | README equals revision-base content with only src and width replaced; all required archive entrypoints present; repository/build PNG hashes match; header targets checked |
| `git diff --check` | 0 | No whitespace errors before the implementation commit |

Header checks returned HTTP 200 for the immutable image, all badges, Playwright documentation, license, documentation homepage, and release. Both npm website links returned HTTP 403 to automation. The previous successful official-registry installation/snippet verification remains historical evidence; unchanged snippets did not trigger another fresh installation. No successful npm webpage-rendering check is claimed.

Verified environment remains macOS 27.0.1 arm64; Node 24.21.0, npm 11.19.0, TypeScript 7.0.2, Playwright 1.64.1, Chromium 156.0.8078.4, VitePress 1.6.4. The correction changes only two README attribute values plus approved artifact/outcome records. PNG bytes, other README content, runtime, dependencies, examples, release/tag, and published npm package are unchanged.

The immutable source already works independently of Pages. The new branch README needs the user's push; main README and the Pages asset still need merge/deployment. Current findings remain author assessments and external validation pending. The revised-state sequential gate and branch-finishing full test are pending below; no completed gate is claimed yet.
