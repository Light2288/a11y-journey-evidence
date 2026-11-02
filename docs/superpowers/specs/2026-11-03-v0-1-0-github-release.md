# v0.1.0 GitHub release

**Slug:** `v0-1-0-github-release`
**Type:** chore
**Status:** APPROVED
**Created:** 2026-11-03
**Updated:** 2026-11-03
**Provenance:** The user's instruction to proceed with source verification and tag/release creation, following PR #4's merge; selection of a regular GitHub release; the existing npm-release specification and publication record. The user accepted the presented specification through the subsequent `PLEASE IMPLEMENT THIS PLAN` message reproducing it in full. That acceptance approves this pending specification gate only; a separate implementation plan remains required.
**Approval state:** Stage 2 specification approved on 2026-11-03 through the user's `PLEASE IMPLEMENT THIS PLAN` message reproducing the presented specification. The user separately approved the subsequently presented implementation plan with `plan approved` on 2026-11-03. Stage 4 implementation is authorized.

## Purpose and scope

Complete the GitHub delivery of the already published `a11y-journey-evidence@0.1.0`: verify its source, publish an annotated `v0.1.0` tag, and publish a regular GitHub release marked as latest.

The tag targets the verified merge commit:

```text
114b5db12dde9bf3376d741cbead065284b5be0e
```

Current evidence establishes that local and remote `main` match this commit, all 23 packaged files match npm byte for byte, and a rebuilt archive has exactly the published SHA-512 integrity. Implementation must recheck the relevant state before remote writes.

The release remains described as **experimental**. This increment resolves the missing GitHub release identity; it adds no package functionality.

## Acceptance criteria

| ID | Requirement |
| --- | --- |
| AC-01 | Confirm the target commit remains in remote `main` history. Rebuild and compare its packaged files with the official npm `0.1.0` archive, verifying the registry archive's integrity. Record the exact source and comparison outcome. |
| AC-02 | Publish an **annotated** Git tag named `v0.1.0`, pointing to the exact target commit above. Verify the remote tag's annotation and peeled commit after pushing it. |
| AC-03 | Publish a GitHub release titled **`v0.1.0`**, using the verified existing tag. The release is public, not a draft, not a prerelease, and marked as latest. Prevent GitHub from silently creating a different tag. |
| AC-04 | Release notes explain installation, the opt-in fixture/reporter, dialog and form examples, portable evidence, and equivalent stock Playwright comparisons. Link npm, version-pinned examples, and relevant documentation. |
| AC-05 | Notes state the experimental status, tested toolchain and host, capture/data limitations, and pending external validation. They make no accessibility-conformance, screen-reader, broader-compatibility, or measured time-saving claims. |
| AC-06 | Use npm as the installation source. Upload no additional release assets. Explain that GitHub's automatic source archives are repository snapshots, rather than the compiled npm distribution. |
| AC-07 | Verify the published release URL, tag, body, regular-release classification, latest designation, and links. Record actual outcomes, including any partial failure. |
| AC-08 | Save a durable outcome record identifying the target commit, npm integrity, verification commands/results, tag and release URLs, and remaining limitations. Preserve existing historical specifications and publication records. |
| AC-09 | Save the separately approved specification and plan before execution. Follow the existing-checkout Git workflow, required review, and local documentation commits. Remote-write authorization is limited to the release tag and GitHub release. |

There are no public API, type, dependency, or package-version changes.

## Constraints and failure handling

- Use repository `Light2288/a11y-journey-evidence`.
- Keep the tag pinned to the verified merge commit, even when later documentation commits change the working branch's HEAD.
- Inspect any existing local/remote tag or release. Reuse only matching state; report conflicts rather than moving tags, overwriting releases, or deleting published objects.
- If tag publication succeeds but release creation fails, preserve the tag, inspect remote state, and report or resume the remaining operation without blindly recreating objects.
- Do not republish npm, change distribution tags, push `main` or documentation branches, merge another PR, or send external messages.
- GitHub Pages, the personal-site page, CI, product fixes, and further improvements remain deferred.

## Approval handoff

**Current stage:** Stage 4 — implementation authorized by separate specification and plan approvals.

**Approval authorizes:** Native implementation through the separately approved plan, including the scoped tag push and GitHub release after verification and review. Commit this pair only after creating the implementation branch.

**Execution endpoint:** Publish and verify the annotated tag and regular GitHub release, complete the required review and outcome record, commit documentation locally, then stop before GitHub Pages or other work.
