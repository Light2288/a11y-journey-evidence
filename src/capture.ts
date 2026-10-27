import { writeFile } from 'node:fs/promises';
import type { Locator, Page, TestInfo } from '@playwright/test';
import type { ArtifactOutcome, Artifacts, Issue, JourneyOptions } from './model.js';
export async function rootIssue(page: Page, root: Locator): Promise<Issue | undefined> {
  if (root.page() !== page) return { code: 'unsupported-root', message: 'Root belongs to another page.' };
  const count = await root.count();
  if (!count) return { code: 'root-missing', message: 'Declared root does not exist; no wider snapshot was taken.' };
  if (count !== 1) return { code: 'root-ambiguous', message: 'Declared root matches multiple elements.' };
  const handle = await root.elementHandle({ timeout: 2000 });
  if (!handle) return { code: 'root-missing', message: 'Declared root disappeared.' };
  try {
    if (await handle.ownerFrame() !== page.mainFrame()) return { code: 'unsupported-root', message: 'Root is in a frame.' };
    if (await handle.evaluate(el => el.getRootNode() !== el.ownerDocument)) return { code: 'unsupported-root', message: 'Root is in a shadow tree.' };
  } finally { await handle.dispose(); }
}
export async function captureFailureArtifacts(page: Page, root: Locator | undefined, info: TestInfo, options: Omit<JourneyOptions, 'root'>): Promise<{ artifacts: Artifacts; issues: Issue[] }> {
  const issues: Issue[] = [];
  const failed = ['failed', 'timedOut', 'interrupted'].includes(info.status ?? '');
  const capture = async (kind: 'screenshot' | 'ariaSnapshot', enabled: boolean): Promise<ArtifactOutcome> => {
    if (!enabled) return { status: 'disabled' };
    if (!failed) return { status: 'not-needed' };
    const startedAt = new Date().toISOString();
    try {
      if (page.isClosed()) { issues.push({ code: 'page-closed', message: `${kind}: page closed before fixture teardown capture.` }); return { status: 'unavailable', reason: 'page closed', startedAt, finishedAt: new Date().toISOString() }; }
      if (kind === 'screenshot') {
        const path = info.outputPath('journey-screenshot.png');
        await page.screenshot({ path, timeout: 2000 });
        await info.attach('journey-screenshot', { path, contentType: 'image/png' });
        return { status: 'captured', path, startedAt, finishedAt: new Date().toISOString() };
      }
      if (!root) throw new Error('No valid declared root was provided.');
      const issue = await rootIssue(page, root);
      if (issue) { issues.push(issue); return { status: 'unavailable', reason: issue.message, startedAt, finishedAt: new Date().toISOString() }; }
      const snapshot = await root.ariaSnapshot({ timeout: 2000 });
      const path = info.outputPath('journey-aria.yml');
      await writeFile(path, snapshot, 'utf8');
      await info.attach('journey-aria', { path, contentType: 'text/yaml' });
      return { status: snapshot.trim() ? 'captured' : 'empty', path, startedAt, finishedAt: new Date().toISOString() };
    } catch (error) {
      const reason = String(error).slice(0, 16384);
      issues.push({ code: 'capture-failed', message: `${kind}: ${reason}` });
      return { status: 'unavailable', reason, startedAt, finishedAt: new Date().toISOString() };
    }
  };
  const screenshot = await capture('screenshot', options.screenshots !== false);
  const ariaSnapshot = await capture('ariaSnapshot', options.ariaSnapshots !== false);
  return { artifacts: { screenshot, ariaSnapshot }, issues };
}
