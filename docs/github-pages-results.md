# GitHub Pages documentation delivery

Created: 2026-11-03. Updated: 2026-11-03.

Scope: the approved [specification](superpowers/specs/2026-11-03-github-pages-documentation.md) and [plan](superpowers/plans/2026-11-03-github-pages-documentation.md). Implementation branch: `docs/github-pages-documentation`, based on `31d0f79f186f782adbf04b921870b6186884b0e9`.

## Delivery state

Local implementation and verification passed. The specification review is blocked on missing image content in the review package; the quality stage and Pages configuration have not run. PR checks, production deployment and live verification are **pending the user-controlled push and merge**. No public-site completion is claimed.

The English VitePress site covers onboarding, native fixture composition, dialog/form recipes, evidence interpretation, API, stock comparison, limits and troubleshooting. It builds only `site/`, with the production base `/a11y-journey-evidence/` and `.html` routes. Target URL: <https://light2288.github.io/a11y-journey-evidence/>.

## Observed local verification

Commands used Node 24.21.0 from `/Users/davide/.nvm/versions/node/v24.21.0/bin` at the front of subprocess PATH, with `NO_COLOR` and `FORCE_COLOR` unset. npm 11.19.0, TypeScript 7.0.2, Playwright 1.64.1, Chromium 156.0.8078.4, VitePress 1.6.4; macOS 27.0.1 (26A434), arm64. These results do not establish other package hosts or browser support.

| Command | Exit | Decisive result |
| --- | --- | --- |
| `npm test` | 0 | 6 unit tests and 53 browser tests passed; browser summary `53 passed (25.9s)` |
| `npm run docs:verify-examples` | 0 | `Documentation examples verified: 3 actual passes, 4 intended actual failures; npm 0.1.0; fixture composition and native/evidence reports.` |
| `npm run docs:check` | 0 | 5 verifier unit tests; production build; `12 passed (10.4s)` documentation browser checks |
| `npm pack --dry-run --json` | 0 | 23 files: compiled distribution/declarations, manifest, README, license; no site, workflow, documentation tooling or generated evidence |
| `git diff --check` | 0 | No whitespace diagnostics |

Ignored logs: `.artifacts/docs-verification/final-{npm-test,examples,docs-check}.log`, `final-pack.json`, and `external-links.log`. The example verifier preserves native JSON/HTML, evidence and `proof.json` under `.artifacts/docs-examples/`; these local files are not public site assets.

The fresh external consumer installed official registry package 0.1.0 with integrity:

```text
sha512-83TBUtc4z6Htmjrl+kse6d2uRgVlI7GVOskUvsgYwoGJMAzZNCjkClVJhGcnmaifY7TRi1B1HavTsj+GHKnydg==
```

The resolved reporter was inside the temporary consumer's `node_modules`, outside this checkout. Both correct journeys and the unselected control actually passed. Four intentional regressions actually failed at their specified named assertions; preceding steps passed. The verifier rejects unrelated failures, unexpected passes and missing cases. `mergeTests` composition and native/package reporters worked; the control was omitted from evidence. Playwright's `7 passed` summary counts expected failures as successful demonstrations, not passed behavior.

Browser checks exercised direct production-base routes/assets, fragments, 404 recovery, keyboard skip/navigation, search opening/result selection/Escape focus return, mobile menu, reading at 375×812 and 1280×900, and literal hostile-sample imports in a temporary production build. Desktop/mobile reference screenshots and both public synthetic PNGs were visually inspected. Code scrolls inside its own container at narrow widths.

Version-pinned source, GitHub release and historical-assessment destinations returned HTTP 200. npm's website returned HTTP 403 to the automated request; its registry metadata/archive and fresh installation succeeded. No claim is made that the npm web page was inspected successfully during this check.

## Samples and evidence handling

Public samples derive from the verified npm 0.1.0 consumer's `dialog escaping-focus` and `form missing-error-association` cases. Their original run was generated 2026-11-02 UTC / 2026-11-03 locally. [Provenance](../site/samples/provenance.json) records runtime, integrity, actual/expected failures, fixture-teardown phase, editorial omissions and screenshot SHA-256 values. A later final example run reconfirmed behavior on 2026-11-03 UTC; it did not silently replace the curated samples.

Only two visually inspected synthetic PNGs and selected literal text excerpts are published. Diagnostics omit ANSI, call logs, source excerpts and machine-local stack paths. Observations preserve order and all observed records; screenshots and scoped ARIA text are unmodified. Raw private handoffs, traces, native HTML reports and arbitrary run folders remain outside the site. The hostile-sample test confirms HTML, Markdown links and fences stay literal.

## Execution rulings

- An absent VitePress site builds successfully as 404-only output. Browser route assertions supply the meaningful missing-content red check; TCP preview readiness prevents that failure being hidden by server startup.
- VitePress 1.6.4's local-search input had an empty accessible name and Escape left focus on body. An initial deferral was superseded by a small standard-theme setup extension that labels the field and restores search-button focus only on dismissal without navigation/intentional alternate focus. Both defects were observed red before green. This depends on pinned search DOM and must be checked on upgrades; the standard visual layout remains unchanged.
- Test assumptions were corrected against actual output: the 404 recovery link's accessible name is `go to home`; fragment checks retain each source URL when resolving relative links.

## Review and rollout

Integrated sequential gate: **specification review BLOCKED; quality not dispatched**. Package identity and hash were verified, but its image entries contained hashes/sizes and the author's visual-inspection statements without reviewable PNG contents. The reviewer cannot independently assess the two synthetic public samples from that package. This is a review-input deficiency, not a reported product defect. Resume with reviewable image evidence before proceeding to quality or Pages configuration.

Reviewed commit: `e24f183e1abfa3ec869ee0907c35b29cbc93b8dc`. Gate ID: `pages-ddd17307-ee55-4094-88a5-92c41dbdd595`. Reviewed-state ID: `e24f183e1abfa3ec869ee0907c35b29cbc93b8dc-25f1ae59-9535-4722-8302-3e2ad58bfd6b`. Package SHA-256: `5b578eac760a2aaa38fb8d71512c663988913a776e51aa1382a730d26e5a128f`.

Future deployment evidence remains unobserved during local review; it is not a missing implementation claim.

The workflow uses read-only PR builds, pinned action commits, main-only upload of `site/.vitepress/dist/`, and Pages/OIDC write permission confined to the deployment job. It does not run package examples on Linux or broaden package compatibility claims. Actual workflow behavior still requires observation after publication/merge.

Pages settings: pending post-review inspection/configuration. Production run URL/SHA, public build marker, live browser checks and merged README documentation link: pending. No branch push or merge is performed by this increment's agent.

## Assessment and boundaries

This remains an **author assessment; external validation pending**. Synthetic reproducibility does not prove independent usefulness, accessibility conformance, screen-reader announcements, general sanitization or measured productivity. Artifacts may retain application data; readers must inspect complete bundles before sharing. Package runtime, exports, peer, version, npm publication, GitHub tag/release and historical records are preserved.

After the user-controlled merge, resume this same increment: inspect PR/main runs, compare the public build SHA, run the shared live smoke checks and commit the outcome on a documentation branch. Personal-site work, live demos, product changes and broader improvements remain deferred.
