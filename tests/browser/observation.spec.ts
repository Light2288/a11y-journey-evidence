import { test, expect } from '@playwright/test';
import { beginObservation } from '../../dist/observation.js';
import { loadForm } from '../../examples/shared/form.js';
import { exerciseForm } from '../../examples/shared/form-journey.js';

test('observation retains relevant keys and never typed values', async ({ page }) => {
  await page.setContent('<button id="first">First</button><input id="field"><button id="last">Last</button>');
  const session = await beginObservation(page, { maxObservations: 1000 });
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await page.locator('#first').focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await page.keyboard.press('Escape');
  await page.locator('#field').focus();
  await page.keyboard.type('typed-secret ');
  const result = await session.finish();
  expect(result.observations.filter(o => o.kind === 'key').map(o => o.key)).toEqual(['Tab','Shift+Tab','Enter','Space','Escape']);
  expect(JSON.stringify(result)).not.toContain('typed-secret');
  expect(result.observations.map(o => o.seq)).toEqual([...result.observations].map(o => o.seq).sort((a,b) => a-b));
});

test('observation bounds buffers and reports truncation', async ({ page }) => {
  await page.setContent('<button>One</button><button>Two</button>');
  const session = await beginObservation(page, { maxObservations: 3 });
  for (let i=0;i<8;i++) await page.keyboard.press('Tab');
  const result = await session.finish();
  expect(result.observations.length).toBeLessThanOrEqual(3);
  expect(result.truncated).toBe(true);
  expect(result.complete).toBe(false);
});

test('observation preserves application focus, document focus and removed targets', async ({ page }) => {
  await page.setContent('<button id="one">One</button><button id="two">Two</button>');
  const session = await beginObservation(page, { maxObservations: 100 });
  await page.locator('#two').focus();
  await page.locator('#two').evaluate(el => el.remove());
  const result = await session.finish();
  expect(result.observations.some(o => o.target?.attributes.id === 'two')).toBe(true);
  expect(result.observations.some(o => o.kind === 'removed')).toBe(true);
  expect(result.observations.some(o => o.target?.tag === 'body')).toBe(true);
});

test('observation discloses descriptor clipping and unsupported boundaries', async ({ page, context }) => {
  await page.setContent('<button id="one">One</button>');
  await page.locator('button').evaluate(el => el.setAttribute('aria-label', 'a'.repeat(300))); 
  const session = await beginObservation(page, { maxObservations: 100 });
  await page.locator('button').focus();
  await context.newPage();
  await page.evaluate(() => { const host = document.createElement('div'); document.body.append(host); host.attachShadow({ mode: 'open' }).innerHTML = '<button>Shadow</button>'; (host.shadowRoot!.firstElementChild as HTMLElement).focus(); });
  const result = await session.finish();
  expect(result.issues.some(i => i.code === 'descriptor-truncated')).toBe(true);
  expect(result.issues.some(i => i.code === 'unsupported-page')).toBe(true);
  expect(result.issues.some(i => i.code === 'unsupported-shadow')).toBe(true);
});

test('observation retains received events after page closure', async ({ page }) => {
  await page.setContent('<button id="one">One</button>');
  const session = await beginObservation(page, { maxObservations: 100 });
  await page.keyboard.press('Tab');
  await page.close();
  const result = await session.finish();
  expect(result.observations.some(o => o.key === 'Tab')).toBe(true);
  expect(result.complete).toBe(false);
  expect(result.issues.some(i => i.code === 'page-closed')).toBe(true);
});
test('observation discloses document replacement after recording starts',async({page})=>{
  await page.setContent('<button>Before</button>');
  const session=await beginObservation(page,{maxObservations:100});
  await page.setContent('<button>Replacement</button>');
  const capture=await session.finish();
  expect(capture.complete).toBe(false);
  expect(capture.issues.some(i=>i.code==='unsupported-document-replacement')).toBe(true);
});

test('observation form descriptors retain validation context without typed values', async ({ page }) => {
  await loadForm(page, 'correct');
  const session = await beginObservation(page, { maxObservations: 1000 });
  await exerciseForm(page);
  const capture = await session.finish();
  expect(capture.complete).toBe(true);
  expect(capture.observations.some(o => o.target?.attributes.id === 'name' &&
    o.target.attributes['aria-invalid'] === 'true' &&
    o.target.attributes['aria-describedby'] === 'name-error')).toBe(true);
  expect(capture.observations.some(o => o.target?.attributes.id === 'team' &&
    o.target.attributes['aria-describedby'] === 'team-error')).toBe(true);
  expect(JSON.stringify(capture.observations)).not.toContain('Example User');
  expect(JSON.stringify(capture.observations)).not.toContain('Example Team');
  expect(capture.observations.filter(o => o.kind === 'key').map(o => o.key)).not.toContain('Space');
  expect(capture.observations.every(o => !o.target || !('value' in o.target.attributes))).toBe(true);
});

test('observation form references are clipped with disclosure', async ({ page }) => {
  await page.setContent(`<input id="field" value="attribute-secret" data-private="private-secret" aria-invalid="true" aria-describedby="${'x'.repeat(300)}">`);
  const session = await beginObservation(page, { maxObservations: 100 });
  await page.keyboard.press('Tab');
  const capture = await session.finish();
  const descriptor = capture.observations.find(o => o.target?.attributes.id === 'field')!.target!;
  expect(descriptor.attributes['aria-describedby']).toBe('x'.repeat(256));
  expect(descriptor.attributes['aria-invalid']).toBe('true');
  expect(descriptor.attributes).not.toHaveProperty('value');
  expect(descriptor.attributes).not.toHaveProperty('data-private');
  expect(JSON.stringify(capture)).not.toContain('attribute-secret');
  expect(JSON.stringify(capture)).not.toContain('private-secret');
  expect(capture.issues.some(i => i.code === 'descriptor-truncated')).toBe(true);
  expect(capture.complete).toBe(false);
});
