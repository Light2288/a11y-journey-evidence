import { randomUUID } from 'node:crypto';
import type { Page, Frame } from '@playwright/test';
import { installObserver } from './browser-observer.js';
import type { Issue, Observation, ObservationCapture, ObservationSession } from './model.js';

export async function beginObservation(page: Page, options: { maxObservations: number }): Promise<ObservationSession> {
  if (!Number.isInteger(options.maxObservations) || options.maxObservations < 1 || options.maxObservations > 10000) throw new Error('maxObservations must be an integer from 1 to 10000');
  const token = randomUUID().replaceAll('-', '');
  const binding = `__aje_binding_${token}`, state = `__aje_state_${token}`;
  const observations: Observation[] = [], issues: Issue[] = [];
  const issue = (code: string, message: string) => { if (!issues.some(i => i.code === code)) issues.push({ code, message }); };
  const disposable = await page.exposeBinding(binding, (_source, value: { observation?: Observation; issue?: Issue }) => {
    if (value.issue) issue(value.issue.code, value.issue.message);
    if (value.observation) {
      if (observations.length < options.maxObservations) observations.push(value.observation);
      else issue('observation-truncated', 'Receiving observation buffer reached its configured limit.');
    }
  });
  const navigation = (frame: Frame) => issue(frame === page.mainFrame() ? 'unsupported-navigation' : 'unsupported-frame', 'Navigation/frame boundary is outside the observed main document.');
  const frame = () => issue('unsupported-frame', 'Frames are outside the supported main document.');
  const otherPage = (opened: Page) => { if (opened !== page) issue('unsupported-page', 'Additional pages are outside this journey.'); };
  const closed = () => issue('page-closed', 'Page closed before observation finalization.');
  page.on('framenavigated', navigation); page.on('frameattached', frame); page.on('close', closed);
  page.context().on('page', otherPage);
  if (page.frames().length > 1) frame();
  try { await page.evaluate(installObserver, { binding, state, maxObservations: options.maxObservations }); }
  catch (error) { issue('observation-install-failed', String(error)); }
  let result: ObservationCapture | undefined;
  return { async finish() {
    if (result) return result;
    try {
      if (page.isClosed()) closed();
      else {
        const finished = await page.evaluate(async stateKey => {
          const finish = (window as unknown as Record<string, any>)[stateKey];
          return finish ? await finish() as { transportFailed: boolean } : null;
        }, state);
        if (!finished) issue('observation-unavailable', 'Observer document was replaced or observer unavailable.');
        else if (finished.transportFailed) issue('observation-transport-failed', 'Some browser observations could not be delivered.');
      }
    } catch (error) { issue('observation-finalize-failed', String(error)); }
    finally {
      page.off('framenavigated', navigation); page.off('frameattached', frame); page.off('close', closed);
      page.context().off('page', otherPage);
      try { await disposable.dispose(); } catch (error) { issue('observation-cleanup-failed', String(error)); }
    }
    observations.sort((a, b) => a.seq - b.seq);
    result = { observations, issues, truncated: issues.some(i => i.code === 'observation-truncated'), complete: issues.length === 0 };
    return result;
  } };
}
