# GitHub Pages documentation

**Slug:** `github-pages-documentation`
**Type:** feature
**Status:** APPROVED
**Created:** 2026-11-03
**Updated:** 2026-11-03
**Provenance:** The user's request to check the repository and proceed with GitHub Pages through the usual specification workflow; native clarification selections of VitePress, static walkthroughs, and deployment from main; the presented scope/design proposal; the user's separate `scope/design confirmed` message. Current product evidence comes from README, public entrypoints, the dialog/form examples, historical comparison records, and the completed npm/GitHub release records.
**Approval state:** Stage 2 specification approved by the user's separate `approved` message following presentation of this saved specification. Stage 3 implementation planning is authorized; implementation requires subsequent separate plan approval.

## Problem and current behavior

The public npm package and GitHub release `v0.1.0` are available and verified, but user guidance is concentrated in a long README and historical delivery documents. New users lack a dedicated route from installing the released package to reproducing a meaningful failure and interpreting its evidence. Historical comparison documents retain facts from earlier development stages and should not be presented as current onboarding.

Repository inspection found a clean `main` at `31d0f79f186f782adbf04b921870b6186884b0e9`, matching remote main after PR #5. Tag `v0.1.0` remains pinned to `114b5db12dde9bf3376d741cbead065284b5be0e`. GitHub reports no Pages site and no repository homepage. There is no site framework or `.github/` workflow directory. Existing README, package declarations, examples, and release records supply the content baseline; no new product behavior is needed.

## Desired outcome and delivery boundary

**Wider direction:** Consolidate the experimental first release with usable public documentation before the personal-site page or further product improvements.

**Selected increment:** An English VitePress site for the published `a11y-journey-evidence@0.1.0` package, covering installation, existing-project integration, dialog/form recipes, actual public API/configuration, static failure walkthroughs, report interpretation, fair stock comparisons, troubleshooting, compatibility, and data limits. Include the necessary local tooling, verification, GitHub Pages configuration, PR build checks, and deployment from main.

**Demonstrable outcome:** A reader can create a fresh ESM Playwright project, install the published package, run a correct example and an intended failing journey, locate the report, identify the failed expectation and relevant observation, and understand how to share the whole evidence bundle. Existing Playwright users can compose fixtures and configure the reporter without replacing native assertions/actions.

**Uncertainty:** Runnable examples and task-based author checks establish reproducibility and internal consistency. They do not establish independent usefulness or usability; external validation remains pending.

**Boundary rationale:** Content, executable examples, site navigation, hosting, and deployment verification form one usable documentation outcome. A scaffold-only site or unverified installation instructions would leave that outcome incomplete.

**Deferred work:** Live hosted dialog/form demos, translations, custom domains, analytics, custom theme design, a personal-site page, package features/fixes, broader package CI or compatibility work, automated npm publication, and future documentation versions. Later increments remain provisional.

## Approaches and selected design

- **VitePress — selected by the user.** Use Markdown, the standard theme with minimal project identity, and local search. This fits the existing Node/TypeScript tooling and needs no hosted search account. A stable VitePress version is required; exact dependency/action pins belong in the approved implementation plan after current compatibility inspection.
- **Astro Starlight — considered.** Provides a documentation framework and room for custom pages, with an additional Astro stack. The user selected VitePress for this increment.
- **Static walkthroughs — selected over live demos.** Publish explanations and inspected synthetic artifacts; visitors run the recipes locally. No hosted application behavior or embedded trace viewer is introduced.
- **Deploy from main — selected over manual publication.** Pull requests receive documentation checks. Merged documentation updates deploy through GitHub Actions to Pages. Branch pushes/merges remain under the existing user-controlled Git workflow.

### Site organization and presentation

Use a dedicated `site/` content root so historical Markdown under `docs/` does not become an accidental set of public site routes. The public address is `https://light2288.github.io/a11y-journey-evidence/`, with project base path `/a11y-journey-evidence/`.

Organize navigation around these reader tasks, with individual page boundaries left to the implementation plan:

1. **Start here:** concise project overview, experimental/version label, fresh-project quickstart, installation prerequisites, first report, and links to npm/source/release.
2. **Integrate:** existing Playwright projects, native fixture composition, one-time journey setup after page setup, reporter coexistence, capture controls, and native reproduction commands.
3. **Recipes:** dialog initial focus/containment/dismissal/restoration and form submission/error associations/focus/correction/resubmission. Explain the correct case and both existing deliberate regressions for each pattern.
4. **Read evidence:** static dialog/form failures, native diagnostics, observed focus, screenshots/ARIA snapshots, capture timing, assertions actually executed, retries, expected failures, and incomplete evidence.
5. **Reference:** actual public exports, fixture lifecycle/options, reporter configuration/defaults, observation limits and attribute allowlist, capture outcomes, and supported boundaries. Private handoff schemas are not a public API.
6. **Evaluate and troubleshoot:** current stock comparison synthesis, limitations/data handling, setup failures, root errors, missing/empty artifacts, and release/verification context.

Use the standard theme's navigation, sidebar, local search, and responsive behavior. Provide useful page titles/headings, descriptive links, text alternatives/captions for evidence images, and copyable code examples. Avoid a separate marketing site. Link the documentation from README while retaining usable installation/repository instructions there.

### Content authority and runnable examples

Document the released API rather than unreleased changes. The root exports `test`, `Journey`, and `JourneyOptions`; the reporter is the default export of `a11y-journey-evidence/reporter`. Its constructor options can be documented structurally without pretending `JourneyReporterOptions` is a named root export.

Use exact released package/Playwright versions in the first-run instructions and retain native `page.keyboard`, locators, `test.step`, `expect`, and `mergeTests`. Fresh-project verification must use a separate consumer with its own installed npm dependency and declarations, rather than accidentally resolving the checkout's package self-reference. Snippets must correspond to runnable sources or be meaningfully validated against the released API.

Recipe and historical-evidence links should identify the applicable `v0.1.0` source or release. Write a current comparison synthesis; preserve original historical documents and label them as historical when linked. Do not copy their former private/batch version statements into current installation guidance.

### Static evidence publication

Include one representative dialog failure and one representative form failure, drawn from the existing synthetic regression variants. The implementer may select the particular existing variants without changing the supported scope. Preserve the actual native failure location, expected/actual meaning, observation order, and teardown capture timing.

Publish curated static explanations/excerpts and inspected screenshot/ARIA artifacts with source/version and reproduction provenance. Disclose editorial omissions or anonymization rather than presenting altered excerpts as untouched raw output. Do not publish arbitrary run directories, real application data, machine-local paths, private fixture JSON, traces, or native HTML reports. Explain how readers generate and share a complete local bundle instead. Treat application-like text as evidence when embedding it into Markdown/HTML, not as site structure or executable content.

### Hosting and rollout

Use GitHub Actions for Pages, including the required Pages source configuration. Pull-request checks build the site and validate generated internal links/assets. Deployment occurs only for approved content on main and has the required Pages/OIDC permissions; PR checks do not receive deployment write authority. Scope workflow triggers to documentation and its supporting tooling rather than introducing a general package CI pipeline.

Deployment must preserve the project subpath for page links, assets, search, and 404 recovery. Direct navigation to documented page URLs must work on static hosting without a custom server or history fallback.

The existing Git rules remain binding: no branch push or merge until the user requests it. Implementation can prepare and verify the branch and workflow, and configure the required Pages settings after both artifact approvals. When waiting for the user-controlled merge, report live verification as pending rather than declaring the full increment complete. After the merge, resume this same increment, verify the successful deployment and live site, and record the outcome. This is a rollout dependency, not an additional approval gate between implementation tasks.

## Acceptance criteria

| ID | Required outcome |
| --- | --- |
| AC-01 | A reproducibly built English VitePress site exists under `site/`, uses the standard theme and local search, clearly documents experimental v0.1.0, and links to npm, source, and release. Historical engineering documents remain outside generated site navigation/routes. |
| AC-02 | Fresh-project instructions contain all required files/setup and run against installed `a11y-journey-evidence@0.1.0` and `@playwright/test@1.64.1`. Verification proves a correct actual pass and an actual failure at the intended named assertion, rejects unrelated failures/unexpected passes, and records where the resulting evidence is found. Document native statuses/exit behavior accurately. |
| AC-03 | Existing-project guidance demonstrates fixture composition and native reporter coexistence using real public imports. Examples request/start the fixture after setup and before the tested actions, retain native actions/assertions, and explain unselected tests and requested-but-not-started journeys. |
| AC-04 | Both dialog and form recipes describe the correct journey and their two existing deliberate variants, include runnable/reproducible native assertions/actions, and link the appropriate released sources. Chosen focus/error policies are identified as example policies. |
| AC-05 | Public reference accurately covers `test`, `Journey`, `JourneyOptions`, and the default reporter subpath; required `root`; independent screenshot/snapshot controls (default true); observation default 1000 and integer range 1–10000; reporter `outputDir`/`reproductionCommand`; lifecycle restrictions; and relevant supported boundaries/defaults verified from the released implementation. No private type or attachment schema is advertised as a supported public export. |
| AC-06 | Static walkthroughs include actual synthetic dialog and form failures, identifying the failed expectation, relevant focus/semantic evidence, reproduction route, and capture phase. The narrative agrees with the generated native result and available screenshot/ARIA evidence. |
| AC-07 | Public sample material is deliberately selected, inspected, and limited to synthetic content. Published excerpts disclose editorial changes. Website output excludes arbitrary `.artifacts` data, private payloads, traces/native HTML reports, machine-local paths, and unintended engineering records. Sample content cannot introduce unintended links, raw HTML, or executable script into site pages. |
| AC-08 | Interpretation guidance separates actual/expected status, attempts/retries, executed assertions, and evidence completeness. It covers early/no assertions, fixture-teardown timing, unavailable or empty captures, truncation, late teardown failures, separate event/step order, and the whole-directory requirement for portable bundles. |
| AC-09 | Current comparison guidance fairly explains stock Playwright capabilities, dependencies/integration and attachment maintenance, package evidence, and author findings. It labels historical sources and external validation pending, with no invented productivity or preference claims. |
| AC-10 | Navigation and local search work from the project subpath using a keyboard. Verify skip/navigation access, opening/selecting/dismissing search with understandable focus behavior, and mobile-menu operation. At narrow/mobile and desktop widths, reading/navigation remain usable and code/image content does not cause unintended whole-page overflow. No accessibility-conformance claim is inferred from these checks. |
| AC-11 | Generated links, fragments, selected sample assets, direct page URLs, local search, and 404 recovery work with `/a11y-journey-evidence/`. Check the built output served at that subpath, not only the development server at `/`. |
| AC-12 | Documented development/install/build/preview/check commands match committed configuration and locked tooling. Documentation dependencies remain development-only. Existing package entrypoints, peers, version, runtime behavior, and packed-file boundary are preserved; site content/build outputs are not added to the npm distribution. |
| AC-13 | PR documentation build/link checks and deployment from main are configured in GitHub Actions. PR jobs cannot deploy; the deployment job has the required Pages permissions and publishes the built site artifact rather than checkout/run evidence. No general package CI pipeline is added. |
| AC-14 | Required Pages configuration is recorded and applied only during approved implementation. Branch push/merge remains user-controlled; no npm publication/tag changes, release replacement, unrelated repository-setting changes, or external messaging occurs. |
| AC-15 | Meaningful local verification executes the documented quickstart/recipes or their authoritative checked sources against the installed npm package, validates reference examples/types, builds/checks the site, and exercises the browser behaviors above. Reject tests that merely assert documentation/configuration text mirrors itself. Complete the integrated sequential specification/quality review under the existing workflow. |
| AC-16 | After the user's merge, verify the deployment workflow/run and deployed commit, public site URL, representative direct routes, assets, navigation/search, and README documentation link. Record actual results; failed deployment or pending merge must remain explicit and must not be reported as live completion. |
| AC-17 | A durable delivery record captures commands/exits, decisive outputs, example/source provenance, review, local and deployed verification, tested documentation toolchain/hosts, rollout state, and limitations. Documentation build checks on a CI host do not broaden package runtime/host/browser support claims. |
| AC-18 | The original approved release/batch/fix specifications, plans, comparisons, and results remain unchanged. Preserve the published npm version and GitHub tag/release. Current documentation states application-data risks, supported boundaries, no general sanitization, no screen-reader/conformance/usability proof, and external validation pending. Stop after this documentation increment. |

## Verification and safeguards

Plan verification around observable reader/site behavior: fresh installed-package execution, correct/intended-failure discrimination, real output interpretation, usable navigation/search, valid generated routes/assets, and actual deployed behavior. Package build/type/pack checks protect the distribution boundary; run affected existing checks if shared tooling changes. Behavioral changes require meaningful red/green verification; do not add tests solely to mirror files or configuration values.

Use the existing tested package baseline: Node 24.21.0, npm 11.19.0, TypeScript 7.0.2, Playwright 1.64.1, Chromium 156.0.8078.4, macOS 27.0.1 arm64. Record the tools and hosts actually used during this increment separately. No site build, example execution, workflow run, or deployment success is claimed by this draft.

The implementation plan must ground any new documentation command contract and dependency/action pins in current repository/tool evidence. This specification does not authorize installing a site scaffold, modifying product files, or changing GitHub settings before separate plan approval.

## Edge cases and constraints

- A working root-route preview can hide broken repository-subpath links; verify the production base explicitly.
- A passing Playwright command can contain expected actual failures; inspect named assertions and actual statuses rather than interpreting the summary as universally correct behavior.
- Checkout self-resolution can masquerade as npm integration; verify installation/resolution outside the checkout.
- A hidden dialog can yield an empty snapshot, and a closed page/missing root can make capture unavailable. Explain these honestly rather than fabricating complete artifacts.
- Example screenshots, snapshots, attributes, and diagnostics can retain data despite printable-input filtering. Publish only the inspected synthetic subset.
- A successful workflow alone does not prove the expected content is publicly served; verify the deployed pages and associated commit.
- Preserve local edits throughout Git preflight. Do not automatically stash/reset, create a worktree, force updates, or begin unrelated cleanup.
- The site supports this released version. Do not add automatic versioning, new patterns, live application demos, or new product support claims while writing documentation.

## Approval handoff

**Current stage:** Stage 2 — DRAFT specification review.

**Artifact:** `docs/superpowers/specs/2026-11-03-github-pages-documentation.md`

**Approval authorizes:** Preparation of a separate implementation plan for this confirmed increment only. Implementation, branch creation, and remote Pages configuration require that plan's subsequent separate approval. Keep this specification uncommitted until the implementation branch is created after both approvals.

**Execution endpoint:** Deliver the reviewed documentation site and deployment workflow, verify the live site after the user-controlled merge, record results and limitations, then stop before the personal-site increment or other improvements.
