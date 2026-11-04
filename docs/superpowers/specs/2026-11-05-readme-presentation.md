# README Presentation and Project Illustration

**Slug:** `readme-presentation`
**Type:** chore
**Status:** COMPLETE — image URL/display-size correction verified locally; user integration pending
**Created:** 2026-11-05
**Updated:** 2026-11-05
**Provenance:** The user's request to add `/Users/davide/Downloads/Keyboard Accessibility Flow Infographic.png`, display it centered at the top of the README, use `/Users/davide/Personal/Projects/lightstimulus-static-site-nextjs/README.md` as a structural reference without an emoji in the title, and evaluate the whole README; the user's subsequent `confirmed` message accepting the original scope/design; the later report and screenshot of the missing/oversized branch README image; and the user's `approved` message confirming the proposed commit-pinned URL and 400 px display-size correction.

## Problem and Current Behavior

The README introduces the experimental package accurately but has no project illustration, places repository-development commands before npm installation, and repeats detailed material now covered by the public documentation. The Light Stimulus reference demonstrates a centered image, descriptive introduction, badges, and clear sections. Its project-specific content and claims are not sources for this package's capabilities.

At the original inspection, the checkout was clean on `main` at `48883031e85f8eb68a795ad9cd9aea9b0a227d62`, aligned with its locally recorded `origin/main`. The image is a 1672 × 941 PNG of approximately 1.1 MiB. Its SHA-256 is `02e0cf7ce99bc9ea5c5fda37afd275c46bec3917c7779d0d007cf7ed51948647`.

The original implementation is now committed through `207edc0540b458d9c058d39c5bc505afa3a69437` on `docs/readme-presentation`, with a clean checkout tracking its published branch. Investigation of the user's GitHub screenshot confirmed that the branch contains the PNG, but the README's Pages URL returns HTTP 404 because Pages still serves main commit `48883031e85f8eb68a795ad9cd9aea9b0a227d62`. GitHub's rendered markup retains `width="640"`; the failed load does not demonstrate the PNG's actual aspect ratio. The user also wants a smaller introductory image.

The package's `files` allowlist includes only `dist`, `README.md`, and `LICENSE`. Existing package verification rejects `site/` in the npm archive. VitePress serves `site/public/` assets under the production base `/a11y-journey-evidence/`.

## Desired Outcome and Delivery Boundary

The wider direction is to consolidate the public presentation of experimental `a11y-journey-evidence@0.1.0`. This increment delivers one refreshed README with a centered project illustration and a clearer route from understanding the package to installing and using it.

The supplied PNG is copied unchanged to `site/public/images/a11y-journey-evidence.png`. This provides one reusable public asset for the README and GitHub Pages without introducing an illustration into the npm archive. The documentation homepage layout is unchanged.

The README uses the absolute, commit-pinned image URL `https://raw.githubusercontent.com/Light2288/a11y-journey-evidence/3b3a0941c347f1b3d7c9fb6002ec5d086cccca86/site/public/images/a11y-journey-evidence.png`. Investigation verified HTTP 200 and `image/png` at this URL. It references the existing image-introduction commit rather than a branch name, so README loading does not depend on Pages deployment or the feature branch remaining present. The same unchanged repository asset remains available for Pages to publish after merge. The current npm release's README and archive remain unchanged; there is no npm publication in this increment.

The remaining presentation uncertainty is how the smaller illustration reads in the header. Visual inspection at desktop and narrow widths will resolve this within the confirmed design; no new image generation or cropping is needed. Verify the real remote image response rather than substituting a local image for its URL.

**Execution endpoint:** Complete the scoped URL/display-size correction, verify real image loading and the smaller centered header, complete the required review, preserve prior outcome records, commit locally on the implementation branch, report results and remaining integration dependencies, then stop before pushing, merging, or further site work.

## Approaches and Confirmed Design

- **Header-only update:** Adds the image and introductory presentation while preserving the existing order. Smaller, but leaves contributor instructions ahead of installation.
- **Whole README refresh — selected:** Uses the reference's introductory structure while reorganizing this package's existing content around reader tasks. This remains a focused documentation change and avoids copying the reference's unrelated features or claims.

The opening contains the centered supplied illustration, the project title without emoji, a concise purpose statement, restrained badges with meaningful labels, and prominent documentation, npm, and release links. The illustration appears at 400 CSS pixels wide when space permits, respects narrower containers, preserves its aspect ratio (approximately 400 × 225 px on desktop), and has descriptive alternative text identifying it as an illustration rather than captured test evidence.

The remaining content follows this order, allowing minor editorial adjustments during implementation:

1. Purpose and supported features.
2. Published-package installation and a usable quick start.
3. Native fixture composition and reporter integration.
4. Dialog/form examples, comparison runs, and report locations/interpretation.
5. Experimental status, application-data risks, and supported boundaries.
6. Contributor setup, commands, and documentation maintenance.
7. Author findings, historical delivery links, and license information.

Detailed explanations may become concise summaries linking to the existing authoritative documentation. Essential setup, failure interpretation, and data/compatibility limitations remain visible in the README. Existing useful commands and historical references remain discoverable.

## Acceptance Criteria

| ID | Requirement |
| --- | --- |
| AC-01 | The supplied PNG exists at `site/public/images/a11y-journey-evidence.png` with the recorded source SHA-256, original dimensions, and no crop, recompression, or replacement. |
| AC-02 | The README opens with the centered illustration at 400 CSS px wide when space permits, preserves its aspect ratio, fits narrower containers, and includes descriptive alternative text. The project title contains no emoji; the refreshed headings use plain text. |
| AC-03 | The introductory block includes a concise, accurate description and working documentation, npm, and `v0.1.0` release links. Any badges describe existing facts and have meaningful text alternatives. |
| AC-04 | Installation and quick-start guidance precede repository-development instructions. Examples retain native Playwright actions, locators, assertions, named steps, and fixture composition, and match released exports and reporter configuration. |
| AC-05 | Existing useful commands, dialog/form examples, report locations, expected-failure interpretation, and historical findings remain available in the README or clearly linked authoritative pages. No new commands or capabilities are invented. |
| AC-06 | The README retains experimental status, narrowly tested package compatibility, capture timing, actual-versus-expected failures, application-data/sharing risks, and external validation pending. Documentation CI is distinguished from package compatibility evidence. No conformance, screen-reader, general sanitization, or measured productivity claims are introduced. |
| AC-07 | The README uses the specified commit-pinned absolute URL, which returns HTTP 200, PNG content, and bytes matching AC-01 independently of Pages deployment. Verify header loading against that actual remote response without a local image substitution. GitHub-rendered markup retains the 400 px width and the correct image target (including GitHub's proxy/canonical-source handling when present). The unchanged asset remains part of the production documentation build; distinguish verified remote image availability from pending publication of the revised README and Pages asset. |
| AC-08 | The npm file boundary remains unchanged: the PNG and all other site files are absent from the archive. Product runtime, declarations, exports, dependency pins, package version, published npm artifact, and GitHub release/tag are unchanged. |
| AC-09 | Verify desktop/narrow presentation, image integrity, links, documentation build/checks, package boundary, and whitespace using appropriate existing tooling. Complete one integrated specification-then-quality review and record actual results and pending integration actions. Do not add tests solely mirroring prose or image configuration. |

## Edge Cases and Safeguards

- If the source image is missing or its bytes differ from the recorded source, report the discrepancy before substituting another file. Preserve the Downloads original.
- Use a descriptive repository filename without spaces. Do not place machine-local paths in the README or public site content; provenance paths stay in this engineering specification.
- A static illustration is not evidence of a particular test run or proof of accessibility. Keep that distinction clear in its text alternative and surrounding prose.
- Verify the commit-pinned source's response and checksum. If GitHub's image proxy is unavailable, record it separately rather than claiming successful browser display from a local substitute. Revised branch/main README rendering can only be observed after the user publishes the correction; the Pages copy still awaits merge/deployment.
- Existing published artifacts are immutable within this scope. A changed repository README does not retroactively change npm's published README.

## Constraints and Out of Scope

Follow the user's existing-checkout Git workflow. Save the separately approved specification and plan before implementation; only then refresh `main` safely, create a conventional documentation branch, and commit the pair. Preserve local work and historical specifications, plans, comparisons, and outcome records. Do not push or merge.

No dependencies, package behavior, public APIs, versions, workflow changes, npm publication, release edits, documentation-homepage redesign, personal-site changes, cover derivatives, or new image generation are included. The correction changes only the README image reference/display width and its governing artifacts/outcome record; other README content and the original PNG remain unchanged. Later improvements remain provisional.

## Revision History and Remaining Approval Boundary

The original specification and plan received separate approval, and their implementation/verification/review were completed locally. Their original 640 px, Pages-hosted design and recorded results remain available in Git history and the existing plan's execution notes. This revision does not revoke authorization or rewrite evidence for that completed work.

The user subsequently confirmed a bounded correction: use the existing commit-pinned image directly and reduce its display width to 400 px. This explicitly replaces the previous URL and width requirements in AC-02 and AC-07. It does not authorize another README rewrite or unrelated work. Reuse this artifact pair and preserve its original filenames, creation dates, prior approvals, and historical results. The existing plan must be revised for the affected requirements only after this revised specification receives separate approval.

## Notes and Approval Handoff

Artifact resolution selects this specification and `docs/superpowers/plans/2026-11-05-readme-presentation.md` as the sole matching new-path pair (`NEW_ONLY` for each). The plan preserves the original approved implementation and now includes the separately approved affected-scope correction. No material clarification remains unresolved: the correction's URL, width, unchanged image, existing-checkout boundary, and no-push endpoint were presented and confirmed.

**Original specification approval:** The user's `approved` message immediately following presentation of the original specification.

**Original plan approval:** The user's later `approved` message following presentation of the original separate implementation plan.

**Correction scope/design confirmation:** The user's `approved` message following the proposed commit-pinned URL and 400 px correction authorized drafting the revision.

**Revised specification approval:** The user's subsequent `approved` message immediately following presentation of the revised DRAFT specification. This authorizes affected-scope planning only.

**Revised plan approval:** The user's later `approved` message immediately following presentation of correction Tasks 4–5 in the revised plan, separately from revised specification approval.

**Current stage:** Stage 4 — image URL/display-size correction complete locally; user-controlled integration pending.

**Artifact:** `docs/superpowers/specs/2026-11-05-readme-presentation.md`.

**Authorized correction:** Implement the separately approved revised plan's Tasks 4–5, including real remote-image/rendering verification, required review, and local commits on the existing branch. Pushing, merging, publishing, and image modification remain outside authorization.
