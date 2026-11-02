# v0.1.0 GitHub Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` through `personal-workflows:spec-implement`. Execute the checkbox steps in order using the user's established Native execution method.

**Goal:** Publish and verify the annotated `v0.1.0` tag and regular/latest GitHub release for the existing npm package.

**Architecture:** Freeze the release identity to the verified merge commit, independently compare its distribution with npm, prepare explicit release notes, and complete the integrated review before remote publication. Push only the annotated tag, create the release against that existing tag, and record observed delivery results locally.

**Tech Stack:** Git, GitHub CLI, Node 24.21.0, npm 11.19.0, the existing TypeScript build, and the official npm registry.

**Spec:** [Approved GitHub release specification](../specs/2026-11-03-v0-1-0-github-release.md)

**Slug:** `v0-1-0-github-release`
**Created:** 2026-11-03
**Updated:** 2026-11-03
**Status:** APPROVED — implementation authorized by the user's separate `plan approved` message on 2026-11-03
**Execution tier:** full
**Implementation model role:** full
**Execution method:** Native
**Provenance:** The separately presented and accepted GitHub-release specification, the user's `PLEASE IMPLEMENT THIS PLAN` message reproducing that specification, the established Native preference, the selected regular/latest release classification, and repository/CLI inspection. Acceptance of the specification is not approval of this separate plan.

## Global Constraints

- Repository: `Light2288/a11y-journey-evidence`. Package: `a11y-journey-evidence@0.1.0`. Tag and title: `v0.1.0`.
- Exact tag target: `114b5db12dde9bf3376d741cbead065284b5be0e`. Do not tag the documentation branch's HEAD or silently retarget to a newer `main`.
- Create a regular public release: draft false, prerelease false, latest true. Describe the package as experimental. Upload no release assets.
- Work in the existing checkout. Only after separate specification/plan approvals, safely update `main`, create `chore/v0.1.0-github-release`, and commit the approved artifacts. Preserve unrelated work without automatic stash, reset, or force updates.
- Only the tag push and GitHub release are authorized remote writes. Do not push `main` or the documentation branch, merge a PR, republish npm, change npm tags, delete/replace published objects, or send external messages.
- Preserve prior approved artifacts and publication records. Public API, types, dependencies, source, README, and package version remain unchanged.
- Use `personal-workflows:code-review` once in integrated mode, specification then quality, as the sole final review gate. Perform it on prepared notes, verification, and publication instructions before the remote writes; post-publication checks are executed and recorded by the host.
- Complete this increment, its verification/review and local commits, then stop before GitHub Pages, the personal site, CI, product fixes, or further work.

## Review Focus

1. An existing lightweight/misdirected tag or a conflicting release must cause a contextual stop; never force-update or overwrite it. Task 3 inspects before every write.
2. New documentation commits or an advancing `main` must not change the pinned tag target. Tasks 1 and 3 check target ancestry and the peeled tag commit.
3. Ambiguous push/create errors must be reconciled against actual remote state before retrying. Task 3 checks each operation separately and retains successful partial state.
4. Release publication must not silently create a tag, publish a draft/prerelease, or omit latest status. Task 3 uses `--verify-tag` and checks the release plus `/releases/latest`.
5. Public links and claims must describe the versioned distribution honestly, including source-archive differences and supported scope. Tasks 2 and 3 check the frozen notes and referenced content.

## Repository and Command Evidence

- Specification resolution: `NEW_ONLY` at the linked path. Plan resolution before creation: `MISSING`; no exact-Slug or legacy counterpart was found. The specification's basename and creation date are retained.
- Inspected HEAD and remote `main`: `114b5db12dde9bf3376d741cbead065284b5be0e`, PR #4's merge. Local/remote tags and GitHub releases were absent. Repository API reports push permission. Recheck during execution.
- Architecture map `docs/architecture/map.md`, `docs/architecture/`, `docs/adr/`, and `docs/adrs/` are absent at this HEAD. Freshness is not applicable; no applicable ADR was found and no map will be generated.
- `package.json` supplies `npm run build`; it compiles the package's JavaScript/declarations. Its included files are `dist`, README, and license. `npm pack`, `npm view`, existing consumer verification, and integrity checks are documented in the prior npm-release plan and `docs/v0.1.0-release.md`.
- Installed `gh release create --help` confirms annotated-tag publication, `--verify-tag`, `--target`, `--title`, `--latest`, and `--notes-file`. Installed `git archive -h`, `git tag -h`, and `git push -h` confirm archive output, annotated tags, explicit refspecs, and `--no-follow-tags`. Use these documented operations and the read-only GitHub API checks below; introduce no new package script or release framework.
- Earlier source verification rebuilt all 23 files and reproduced the published integrity exactly. It is historical input, not a substitute for Task 1's fresh comparison.
- The shell selected Homebrew Node 26 in a nested consumer despite Node 24 at the repository root. Before snapshot/subprocess work, pin `/Users/davide/.nvm/versions/node/v24.21.0/bin` at the front of that process's `PATH`; confirm Node 24.21.0 and npm 11.19.0 inside the actual working directory. Do not modify shell startup files.
- No material decisions remain unresolved: regular/latest status and no additional assets are settled. Native execution is preserved; full tier is selected because the publication task has external-state and authentication concerns. Inline execution does not switch the current model.

---

### Task 1: Establish the branch and verify the frozen distribution [size: S | risk: none | mechanical: true | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-01, AC-08, AC-09

**Files:** Commit the approved specification and this plan; create generated evidence only under `.artifacts/github-release/`.

**Interfaces:** Produces `source-verification.json` and logs recording the pinned commit, npm version/tarball/integrity, file count, comparison result, and observed runtime.

- [x] Record the separate specification and plan approval messages; update only this pair's lifecycle metadata. Run `git status --short --branch` and `git fetch origin`. Safely fast-forward `main` with `git merge --ff-only origin/main` when needed, preserving the saved artifacts. Require `git merge-base --is-ancestor 114b5db12dde9bf3376d741cbead065284b5be0e origin/main` to exit 0. Divergence or overlapping work requires a ruling; do not discard it.
- [x] Create `chore/v0.1.0-github-release` with `git switch -c chore/v0.1.0-github-release`. If it exists, inspect rather than reset it. Commit only the approved specification and plan with `docs: approve v0.1.0 GitHub release artifacts`.
- [x] Prepare an ignored source snapshot of the exact target using `git archive --format=tar --output=.artifacts/github-release/source.tar 114b5db12dde9bf3376d741cbead065284b5be0e` and extract it into `.artifacts/github-release/source/`. This is a source archive, not a Git worktree. Pin the runtime inside that directory; install its locked dependencies with `npm ci --ignore-scripts`, run `npm run build`, then `npm pack --json --pack-destination ..`. Expected: exit 0 and the `0.1.0` package/declarations built from the pinned source, independently of later working-branch edits.
- [x] Run `npm view a11y-journey-evidence@0.1.0 version dist.integrity dist.tarball dist-tags --json --registry=https://registry.npmjs.org`. Require version `0.1.0`, npm latest `0.1.0`, and integrity `sha512-83TBUtc4z6Htmjrl+kse6d2uRgVlI7GVOskUvsgYwoGJMAzZNCjkClVJhGcnmaifY7TRi1B1HavTsj+GHKnydg==`. Download the HTTPS archive from the returned official registry URL and independently hash its bytes. Do not upload anything to npm.
- [x] Compare `tar -tzf` file lists from both archives and every corresponding `tar -xOzf` file byte for byte; require all 23 files to match. Save the observed archive integrities, file list, comparison outcome, exact commands/exits, and runtime in generated evidence. A mismatch stops publication for investigation. Do not create configuration-mirroring tests or rerun unrelated browser suites for this distribution-only chore.

### Task 2: Prepare versioned notes and complete the sole integrated review [size: S | risk: none | mechanical: false | clear_pattern: true | objectively_verifiable: true | concerns: none]

**Acceptance criteria:** AC-04, AC-05, AC-06, AC-08, AC-09

**Files:** Create `docs/v0.1.0-github-release.md`; update this plan's execution notes. Generated public notes and review evidence stay under `.artifacts/github-release/`.

**Interfaces:** The durable record contains `## Release notes` followed by `## Verification`. Extract only the text between those headings to `.artifacts/github-release/release-notes.md`; its frozen bytes become the public release body. Verification sections retain commands, actual state, review identity, and later observed URLs/results.

- [x] Write the durable record with target commit, npm identity/integrity, Task 1's actual results, and publication state `not yet published`. Include the public body specified below. Do not imply a tag/release or external validation exists before observing it.
- [x] Prepare the public body with: (1) experimental keyboard/focus evidence for native Playwright journeys; (2) installation command `npm install --save-dev a11y-journey-evidence@0.1.0 @playwright/test@1.64.1`, followed by `npx playwright install chromium`, on Node 24.21.0; (3) opt-in fixture/reporter, unchanged native actions/assertions, dialog/form recipes, portable Markdown and available failure artifacts, plus equivalent stock comparisons; (4) the tested toolchain from the existing publication record: Node 24.21.0, npm 11.19.0, TypeScript 7.0.2, Playwright 1.64.1, Chromium 156.0.8078.4, macOS 27.0.1 arm64; (5) Chromium/main-document/light-DOM boundaries, capture timing/completeness limits, application-data exposure, and external validation pending; (6) no conformance, screen-reader, broader compatibility, or time-saving claims; (7) npm installation as the supported distribution and GitHub source archives as repository snapshots rather than the compiled package.
- [x] Include the npm version URL `https://www.npmjs.com/package/a11y-journey-evidence/v/0.1.0` and version-pinned GitHub links under `https://github.com/Light2288/a11y-journey-evidence/`: `blob/v0.1.0/README.md`, `blob/v0.1.0/examples/shared/dialog-journey.ts`, `blob/v0.1.0/examples/shared/form-journey.ts`, `tree/v0.1.0/examples/stock`, and `blob/v0.1.0/docs/batch-2-comparison.md`. Before the tag exists, verify the same GitHub paths at the pinned commit via the repository contents API; final tag-based checks belong to Task 3.
- [x] Extract and freeze the public body, record its SHA-256, and run `git diff --check`. Expected: exit 0. Check the body against every content/limitations requirement above and keep outcome bookkeeping outside the public section. Commit only the new record and plan progress with `docs: prepare verified v0.1.0 GitHub release notes`.
- [ ] Run `personal-workflows:code-review` exactly once in integrated mode: specification first, quality only after specification PASS, using one unchanged hashed review package and its gate/state identities. Include the complete branch diff, approved pair, exact frozen notes, source evidence, remote-write instructions, and explicit `unobserved` labels for publication/post-publication checks. Use the prescribed finding loop; make no additional generic final-review dispatch. Publication waits for this gate to pass or findings to be handled under that policy.
- [ ] Record the review outcome locally. Any substantive changes to the frozen notes or publication procedure require affected verification and the permitted targeted follow-up within the same review seat before remote writes.

### Task 3: Publish the exact tag/release, verify delivery, and stop [size: S | risk: other | mechanical: true | clear_pattern: true | objectively_verifiable: true | concerns: auth]

**Acceptance criteria:** AC-01, AC-02, AC-03, AC-04, AC-05, AC-06, AC-07, AC-08, AC-09

**Risk:** Authenticated public operations can leave partial state or bind the release to the wrong commit. Explicit target checks, tag-only push, create-only release behavior, and read-only reconciliation bound that risk.

**Files:** Update only `docs/v0.1.0-github-release.md` and this plan with observed completion evidence. Preserve the reviewed public body.

**Interfaces:** Produces remote annotated tag `refs/tags/v0.1.0`, regular/latest GitHub release, and a local durable outcome record. The only uploaded content is tag metadata and the reviewed release body; release assets remain empty.

- [ ] Recheck a clean tracked working tree, target ancestry in freshly fetched remote `main`, public repository visibility (`private: false`) and write permission, npm identity/integrity, and the frozen notes hash. Inspect local `git tag --list v0.1.0`, remote `git ls-remote origin refs/tags/v0.1.0 'refs/tags/v0.1.0^{}'`, and `gh api repos/Light2288/a11y-journey-evidence/releases/tags/v0.1.0`. A genuine not-found release is expected initially; distinguish that from authentication/network errors. Do not use another version, target, or account to bypass a failure.
- [ ] If no tag exists, create `git tag -a v0.1.0 114b5db12dde9bf3376d741cbead065284b5be0e -m 'a11y-journey-evidence v0.1.0 (experimental)'`. Require `git cat-file -t refs/tags/v0.1.0` to return `tag` and `git rev-parse 'v0.1.0^{}'` to equal the pinned target. Reuse an existing tag only if it is annotated and has that exact target; any conflict stops without deletion or replacement.
- [ ] Push only the tag with `git push --no-follow-tags origin refs/tags/v0.1.0:refs/tags/v0.1.0`, overriding any implicit following of other tags. Verify `git ls-remote` reports its annotation-object SHA plus the exact peeled commit. Inspect the annotation through `gh api repos/Light2288/a11y-journey-evidence/git/tags/<observed-tag-object-sha>`; require tag `v0.1.0`, object type `commit`, and the pinned SHA. On an ambiguous push error, inspect this state before deciding whether the push is still needed.
- [ ] If no release exists, run `gh release create v0.1.0 --repo Light2288/a11y-journey-evidence --verify-tag --target 114b5db12dde9bf3376d741cbead065284b5be0e --title v0.1.0 --latest --notes-file .artifacts/github-release/release-notes.md`. Supply no asset paths, draft/prerelease flags, generated notes, or discussion category. An existing release is reusable only if its title/tag, reviewed body, public regular/latest classification, and empty assets match this plan; otherwise report the conflict without editing it.
- [ ] Verify the tag-specific release API reports `name: v0.1.0`, `tag_name: v0.1.0`, `draft: false`, `prerelease: false`, empty assets, the expected public URL `https://github.com/Light2288/a11y-journey-evidence/releases/tag/v0.1.0`, and the reviewed body after newline normalization. Require `/repos/Light2288/a11y-journey-evidence/releases/latest` to return the same release ID. Recheck the peeled target and every version-pinned GitHub content link; validate npm identity through the official registry. Do not conflate a client error with proof that creation failed: inspect actual release state before any retry.
- [ ] If publication is partial, retain successful state and record exactly what remains; never automatically delete the tag or release. Authentication/permission failures are reported with the stated reason and required user action, without requesting credentials in chat. Mark completion only when all delivery checks pass.
- [ ] Record tag object/target, release ID/URL/classification/latest result, public-body hash, link checks, exact command exits and decisive output, prior source integrity, review identity, and remaining experimental limits. Replace only outcome placeholders; do not change the reviewed public body or historical records. Run `git diff --check` and `git status --short --branch`; expected: no whitespace errors and only the intended local documentation changes. Commit explicit paths with `docs: record verified v0.1.0 GitHub release` and finish the branch locally under the approved workflow. Do not push the documentation branch or merge it.
- [ ] Report the working release and tag, verification evidence, limitations, and locally retained documentation branch. Stop before GitHub Pages or any subsequent increment. Publication/post-publication outcomes are host-verified after the pre-publication gate; no second generic reviewer is introduced for observed-result bookkeeping.

## Acceptance and Verification Traceability

| Criteria | Tasks | Decisive evidence |
| --- | --- | --- |
| AC-01 | 1, 3 | Target ancestry, exact source snapshot, registry SHA-512 and 23-file comparison |
| AC-02–03 | 3 | Annotated tag object/peeled SHA; verified-tag create; regular/latest release API |
| AC-04–06 | 2, 3 | Reviewed frozen public body, version-pinned links, no uploaded assets |
| AC-07 | 3 | Published URL/body/classification/latest and link verification |
| AC-08 | 1–3 | Durable record separating preparation, partial state, and confirmed delivery |
| AC-09 | 1–3 | Separate approvals, local branch/commits, one integrated gate, scoped remote writes |

## Approval Handoff

**Current stage:** Stage 4 — implementation authorized by separate specification and plan approvals.
**Approval authorizes:** Native implementation of this plan, including the tag-only push and public regular/latest GitHub release after verification and the required review. No further routine permission gate is added between tasks.
**Execution endpoint:** Verified `v0.1.0` tag and GitHub release, durable result/review evidence and local documentation commits; stop before GitHub Pages or other work. Documentation-branch integration remains outside this authorization.
