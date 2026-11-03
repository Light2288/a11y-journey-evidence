# GitHub Pages documentation delivery

Created: 2026-11-03. Updated: 2026-11-03.

Scope: the approved [specification](superpowers/specs/2026-11-03-github-pages-documentation.md) and [plan](superpowers/plans/2026-11-03-github-pages-documentation.md). Implementation branch: `docs/github-pages-documentation`, based on `31d0f79f186f782adbf04b921870b6186884b0e9`.

## Delivery state

**Live delivery verified on 2026-11-03.** PR #6 merged, its documentation build passed without deployment, and the main build/deployment succeeded. The public build marker matches merge commit `30fed24a0b2d7a05f8ca92726a947b5697a11555`. All nine live smoke checks pass after correcting a browser-test hydration race. The integrated review remains passed with one deferred Minor scheduling finding.

The verification record and test-only correction are committed locally on `docs/github-pages-verification`, based on the aligned merged main. Integration of this follow-up branch remains user-controlled; it changes no site content or package runtime.

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

Integrated sequential gate: **SPEC REVIEW: PASS, then QUALITY REVIEW: PASS**, on the same immutable corrected package. No Critical or Important findings; one Minor finding is deferred under the enclosing review policy.

The initial attempt stopped BLOCKED because the package supplied image hashes and inspection statements without image bytes. The corrected evidence package supplied complete PNG bytes; both reviewers verified those bytes and visually inspected the images. The earlier package was left unchanged. This resumed the same logical review seat; it did not add a generic review or another fix loop.

Reviewed commit: `4a71a592ab54ae43d71d0c5701c007912eef7410`. Gate ID: `pages-0bb3b4e3-b5dc-439a-9626-c1495de33c9d`. Reviewed-state ID: `4a71a592ab54ae43d71d0c5701c007912eef7410-7c872470-11d7-4d50-99d7-fd1dc039117e`. Package SHA-256: `eae9e33b47bb174027ae0ffc793bbf058915f0937842252a35b52eecf0c6cdbd`. Both reports echoed matching identities. All 48 changed files and all five Review Focus conditions were reviewed.

**Deferred Minor:** deployment-only concurrency allows overlapping main builds to finish out of order and potentially deploy an older artifact last. No rollback was observed. A later workflow change can serialize build through deployment using a ref-specific workflow concurrency group. The current rollout must still compare the publicly served SHA with the intended deployment commit; this finding is not a live-completion claim.

The review set aside future Pages/CI/public outcomes, broader unchanged package compatibility, successful npm website access (HTTP 403), and the coordinator's final outcome recording. Those outcomes were pending at review time; the observed rollout is recorded below. Existing host limits and the npm website limitation remain disclosed.

The workflow uses read-only PR builds, pinned action commits, main-only upload of `site/.vitepress/dist/`, and Pages/OIDC write permission confined to the deployment job. It does not run package examples on Linux or broaden package compatibility claims. The observed PR and main runs below confirm the expected job separation. This observation does not simulate every possible workflow scheduling interleaving.

Pages preparation completed after the integrated gate:

- Repository identity: `Light2288/a11y-journey-evidence`, default branch `main`, matching origin; viewer permission `ADMIN`.
- Initial `gh api repos/Light2288/a11y-journey-evidence/pages` returned HTTP 404, consistent with the expected absent site.
- `gh api --method POST repos/Light2288/a11y-journey-evidence/pages -f build_type=workflow` exited 0.
- Subsequent `gh api repos/Light2288/a11y-journey-evidence/pages` exited 0 and confirmed `build_type: workflow`, public site, HTTPS enforced and `html_url: https://light2288.github.io/a11y-journey-evidence/`. Its deployment status was null; this is configuration evidence, not successful deployment.
- Ignored JSON records: `.artifacts/docs-verification/pages-create.json` and `pages-verified.json`.
- The task-closing `npm test` rerun exited 0: 6 unit tests and `53 passed (24.0s)` browser checks. `git diff --check` exited 0 before this preparation commit.

## Published rollout verification — 2026-11-03

Initial repository check after `git fetch origin`: clean local `main`, `HEAD` and `origin/main` all matched `30fed24a0b2d7a05f8ca92726a947b5697a11555`. The approved verification branch `docs/github-pages-verification` was then created from that commit; main was not edited.

| Evidence | Actual outcome |
| --- | --- |
| [PR #6](https://github.com/Light2288/a11y-journey-evidence/pull/6) | Merged 2026-11-03T12:05:54Z; merge SHA `30fed24a0b2d7a05f8ca92726a947b5697a11555` |
| [PR workflow run](https://github.com/Light2288/a11y-journey-evidence/actions/runs/41632840930) | `pull_request`; build success; deployment **skipped** |
| [Production workflow run](https://github.com/Light2288/a11y-journey-evidence/actions/runs/41632857449) | `push` to main; build and deployment success at the merge SHA |
| [Pages deployment job](https://github.com/Light2288/a11y-journey-evidence/actions/runs/41632857449/job/125907055373) | Deployment `7518244865`, environment `github-pages`, status **success** at 2026-11-03T12:07:16Z |
| [Public build marker](https://light2288.github.io/a11y-journey-evidence/build-info.json) | HTTP 200; `sourceCommit` exactly matches production run and merge; `packageVersion: 0.1.0` |
| [Public documentation](https://light2288.github.io/a11y-journey-evidence/) | Homepage/direct routes/assets, keyboard navigation/search, mobile navigation and 404 recovery passed live browser checks |
| Merged remote README | Its `Read the documentation` link points to the public site; verified through GitHub Contents API at the exact merged SHA |

GitHub CLI inspection used `gh run view 41632840930 --repo Light2288/a11y-journey-evidence --json databaseId,event,headSha,conclusion,jobs,url`, the equivalent command for run `41632857449`, and the deployments/status APIs. Every final inspection command exited 0. Pages' general API still reports `status: null` for workflow builds; successful deployment status and the actual served build marker establish publication.

### Live command and initial timing failure

With the pinned Node PATH and color settings above:

```sh
DOCS_BASE_URL=https://light2288.github.io/a11y-journey-evidence/ DOCS_EXPECTED_COMMIT=30fed24a0b2d7a05f8ca92726a947b5697a11555 npm run docs:test -- --grep live
```

First run: exit **1**, seven passed and two failed. The failed checks were keyboard skip focus and search activation. Diagnosis observed `document.readyState: complete` while the Vue app was not mounted. VitePress asynchronously imports the initial page module before attaching event handlers. A skip activation before mount left focus on the link; activation after actual mount focused `#VPContent`. This explains why fast local/CI checks passed but immediate public-host actions could race hydration.

A deterministic delayed-page-module browser regression reproduced the skip-focus failure: `npm run docs:test -- --grep "delayed initial page module"` exited **1** before the readiness fix and **0** afterward (`1 passed (2.1s)`). Interactive smoke checks now wait for Vue's actual mount marker before issuing keyboard actions; they do not retry the failed interaction or weaken focus/assertion requirements. The marker is private to the pinned Vue/VitePress runtime and must be reassessed on upgrades. This test-only correction and regression extend the originally outcome-only follow-up branch to make the approved live verification reliable. No product or site source was changed.

The corrected live command exited **0**, `9 passed (4.9s)`. It verified both synthetic walkthroughs, desktop/mobile reading, keyboard skip/navigation, search result selection and Escape focus return, mobile menu, direct routes/assets, 404 recovery and the exact deployed commit. Both live walkthroughs were additionally visually inspected in Chromium, including screenshots and scoped ARIA text. Checks assess the hydrated website; controls that depend on JavaScript require client initialization.

After the test correction:

| Command | Exit | Result |
| --- | --- | --- |
| `npm test` | 0 | 6 unit and `53 passed (24.9s)` browser checks |
| `npm run docs:check` | 0 | 5 verifier unit checks, production build and `13 passed (10.6s)` documentation browser checks, including delayed hydration |
| `git diff --check` | 0 | No whitespace diagnostics |

Ignored records: `.artifacts/docs-verification/live-{pr-run,main-run,deployments,deployment-statuses,build-info,main-readme}.json`; `live-smoke.log`, `live-hydration-diagnosis.log`, `hydration-{red,green}.log`, `live-smoke-green.log`, `postmerge-{npm-test,docs-check}.log`, and `live-{dialog,form}-walkthrough.png`. The original failed run remains retained alongside the green run. Actual browser/host: Chromium 156.0.8078.4, Node 24.21.0, macOS arm64. CI documentation checks observed on the configured Ubuntu runner do not extend package-host compatibility.

## Assessment and boundaries

This remains an **author assessment; external validation pending**. Synthetic reproducibility does not prove independent usefulness, accessibility conformance, screen-reader announcements, general sanitization or measured productivity. Artifacts may retain application data; readers must inspect complete bundles before sharing. Package runtime, exports, peer, version, npm publication, GitHub tag/release and historical records are preserved.

The documentation increment has reached its verified public endpoint. The local verification/test correction branch still needs user-controlled push/PR/merge if the record is to be retained on main. No push or merge was performed by the agent. Personal-site work, live demos, product changes and broader improvements remain deferred.
