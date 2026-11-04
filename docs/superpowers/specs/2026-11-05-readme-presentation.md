# README Presentation and Project Illustration

**Slug:** `readme-presentation`
**Type:** chore
**Status:** APPROVED
**Created:** 2026-11-05
**Updated:** 2026-11-05
**Provenance:** The user's request to add `/Users/davide/Downloads/Keyboard Accessibility Flow Infographic.png`, display it centered at the top of the README, use `/Users/davide/Personal/Projects/lightstimulus-static-site-nextjs/README.md` as a structural reference without an emoji in the title, and evaluate the whole README; the user's subsequent `confirmed` message accepting the scope/design proposal.

## Problem and Current Behavior

The README introduces the experimental package accurately but has no project illustration, places repository-development commands before npm installation, and repeats detailed material now covered by the public documentation. The Light Stimulus reference demonstrates a centered image, descriptive introduction, badges, and clear sections. Its project-specific content and claims are not sources for this package's capabilities.

At inspection, the checkout is clean on `main` at `48883031e85f8eb68a795ad9cd9aea9b0a227d62`, aligned with its locally recorded `origin/main`. Remote state has not been refreshed for this increment. The image is a 1672 × 941 PNG of approximately 1.1 MiB. Its SHA-256 is `02e0cf7ce99bc9ea5c5fda37afd275c46bec3917c7779d0d007cf7ed51948647`.

The package's `files` allowlist includes only `dist`, `README.md`, and `LICENSE`. Existing package verification rejects `site/` in the npm archive. VitePress serves `site/public/` assets under the production base `/a11y-journey-evidence/`.

## Desired Outcome and Delivery Boundary

The wider direction is to consolidate the public presentation of experimental `a11y-journey-evidence@0.1.0`. This increment delivers one refreshed README with a centered project illustration and a clearer route from understanding the package to installing and using it.

The supplied PNG is copied unchanged to `site/public/images/a11y-journey-evidence.png`. This provides one reusable public asset for the README and GitHub Pages without introducing an illustration into the npm archive. The documentation homepage layout is unchanged.

The README uses the absolute image URL `https://light2288.github.io/a11y-journey-evidence/images/a11y-journey-evidence.png`. That URL becomes available after the user merges and the existing Pages workflow deploys. The current npm release's README and archive remain unchanged; there is no npm publication in this increment.

The only presentation uncertainty is how the landscape illustration reads at README widths. Visual inspection at desktop and narrow widths will resolve this within the approved design; no new image generation or cropping is needed.

**Execution endpoint:** Add and verify the image, refresh and visually inspect the README, verify links and the distribution boundary, complete the required integrated review, commit intended changes locally on the implementation branch, report results and deployment dependencies, then stop before pushing, merging, or further site work.

## Approaches and Confirmed Design

- **Header-only update:** Adds the image and introductory presentation while preserving the existing order. Smaller, but leaves contributor instructions ahead of installation.
- **Whole README refresh — selected:** Uses the reference's introductory structure while reorganizing this package's existing content around reader tasks. This remains a focused documentation change and avoids copying the reference's unrelated features or claims.

The opening contains the centered supplied illustration, the project title without emoji, a concise purpose statement, restrained badges with meaningful labels, and prominent documentation, npm, and release links. The illustration appears at approximately 640 CSS pixels wide, respects narrow containers, preserves its aspect ratio, and has descriptive alternative text identifying it as an illustration rather than captured test evidence.

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
| AC-02 | The README opens with the centered illustration at approximately 640 px wide, preserves its aspect ratio, fits narrow containers, and includes descriptive alternative text. The project title contains no emoji; the refreshed headings use plain text. |
| AC-03 | The introductory block includes a concise, accurate description and working documentation, npm, and `v0.1.0` release links. Any badges describe existing facts and have meaningful text alternatives. |
| AC-04 | Installation and quick-start guidance precede repository-development instructions. Examples retain native Playwright actions, locators, assertions, named steps, and fixture composition, and match released exports and reporter configuration. |
| AC-05 | Existing useful commands, dialog/form examples, report locations, expected-failure interpretation, and historical findings remain available in the README or clearly linked authoritative pages. No new commands or capabilities are invented. |
| AC-06 | The README retains experimental status, narrowly tested package compatibility, capture timing, actual-versus-expected failures, application-data/sharing risks, and external validation pending. Documentation CI is distinguished from package compatibility evidence. No conformance, screen-reader, general sanitization, or measured productivity claims are introduced. |
| AC-07 | The README image uses the specified absolute public URL. A production documentation build includes the unchanged PNG at its expected production-base route. The local record distinguishes verified build/preview results from public availability pending deployment. |
| AC-08 | The npm file boundary remains unchanged: the PNG and all other site files are absent from the archive. Product runtime, declarations, exports, dependency pins, package version, published npm artifact, and GitHub release/tag are unchanged. |
| AC-09 | Verify desktop/narrow presentation, image integrity, links, documentation build/checks, package boundary, and whitespace using appropriate existing tooling. Complete one integrated specification-then-quality review and record actual results and pending integration actions. Do not add tests solely mirroring prose or image configuration. |

## Edge Cases and Safeguards

- If the source image is missing or its bytes differ from the recorded source, report the discrepancy before substituting another file. Preserve the Downloads original.
- Use a descriptive repository filename without spaces. Do not place machine-local paths in the README or public site content; provenance paths stay in this engineering specification.
- A static illustration is not evidence of a particular test run or proof of accessibility. Keep that distinction clear in its text alternative and surrounding prose.
- The public image URL cannot be considered delivered before the user's merge and successful Pages deployment. Verify local built output without claiming a live result prematurely.
- Existing published artifacts are immutable within this scope. A changed repository README does not retroactively change npm's published README.

## Constraints and Out of Scope

Follow the user's existing-checkout Git workflow. Save the separately approved specification and plan before implementation; only then refresh `main` safely, create a conventional documentation branch, and commit the pair. Preserve local work and historical specifications, plans, comparisons, and outcome records. Do not push or merge.

No dependencies, package behavior, public APIs, versions, workflow changes, npm publication, release edits, documentation-homepage redesign, personal-site changes, cover derivatives, or new image generation are included. Later improvements remain provisional.

## Notes and Approval Handoff

Artifact resolution found no specification or plan for slug `readme-presentation` before this file was created. This specification is the sole new-path artifact. Its matching plan is `docs/superpowers/plans/2026-11-05-readme-presentation.md`. No material clarification remains unresolved after scope/design confirmation; exact wording, badge selection, and minor section grouping are implementation choices within the criteria above.

**Specification approval:** The user's `approved` message immediately following presentation of this specification. Approval authorizes implementation planning only.

**Plan approval:** The user's later `approved` message following presentation of the separate implementation plan.

**Current stage:** Stage 4 — implementation.

**Artifact:** `docs/superpowers/specs/2026-11-05-readme-presentation.md`.

**Authorized scope:** Implement the separately approved plan within this specification's scope, including the safe Git preflight, documentation branch, verification, review, and local commits. Pushing, merging, and publishing remain outside authorization.
