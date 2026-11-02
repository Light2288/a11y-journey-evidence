# Read an evidence bundle

Start with `report.md`, then use its relative screenshot, ARIA and available native trace links. Copy the **whole run directory**, preserving its `assets/` tree. A report copied alone loses those links. This site publishes selected synthetic excerpts rather than full raw bundles or a hosted trace viewer.

## Outcome and verification

**Actual status** is what Playwright observed. **Expected status** is what the test declared. An expected failure remains an actual failed outcome; a demonstration command can exit 0 while its intentionally broken checks fail. An unexpected pass fails Playwright's run.

The report lists executed named steps and native assertion records, retaining nesting and sequence. A hard assertion failure stops later checks. Soft failures can let later actions run while the attempt remains failed. An early setup failure provides no results for actions that never happened.

A selected fixture without `start` is marked not started. A started journey with no executed assertions does not establish verified behavior. An unselected test remains in native reporting but is omitted from evidence.

## Attempts remain separate

Project, test identity, repeat index and retry distinguish attempts. A failed attempt followed by a passed retry remains two outcomes; the later pass does not erase the earlier failure. Review each attempt's diagnostics, captures and completeness rather than combining artifacts from different attempts or workers.

## Two sequences

Browser sequence numbers describe captured keyboard/focus order. Native sequence numbers describe step starts. They use separate sequences and do not establish a common clock, a total ordering between them or causation. Transient body focus and focus loss can occur between stable targets.

Descriptors contain local references, tags and bounded raw attributes. They omit field values and text content; they are not computed accessible names or a continuously synchronized model of DOM state. Native assertions supply the behavior actually checked.

## Capture point and outcomes

Failure artifacts are attempted at **fixture teardown**, usually after an assertion failure, with per-artifact start/finish times. They are not guaranteed snapshots of the instant of failure. Screenshots cover the current page viewport; the ARIA snapshot uses the declared root.

| Outcome | Interpretation |
| --- | --- |
| `captured` | An artifact was produced at the stated capture point |
| `empty` | The scoped snapshot had no non-whitespace content, for example after a dialog became hidden |
| `disabled` | The corresponding capture option was disabled |
| `not-needed` | No actual failure was visible at fixture teardown |
| `unavailable` | Capture could not supply the artifact; inspect its reason and issues |

A removed, ambiguous, wrong-document or closed-page root does not authorize a broader snapshot. A screenshot may be available when the scoped snapshot is not. A final teardown failure can occur **after** the fixture already saw a pass; the final failure is retained and the report discloses that artifacts were not captured at that later point. Hard process termination can prevent finalization altogether.

## Completeness and limits

Complete evidence means no reported capture issue within the supported scope. It does not imply passing assertions, complete coverage, usability or conformance. Clipped descriptors/diagnostics, bounded buffers, unsupported boundaries, not-started observation, missing/corrupt handoff and unavailable files remain visible limitations.

The reporter makes handoff, artifact-copy and report-write failures visible and makes an otherwise successful run fail. This does not rewrite the native actual status of each test. Consult stderr if a report cannot be written.

[API and bounds](../reference/api.md) · [Application-data risks](../limitations.md) · [Troubleshooting](../troubleshooting.md)
