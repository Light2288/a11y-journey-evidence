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

for (const [name, html] of [
  ['ordinary-button', '<button id="activate">Activate</button>'],
  ['explicit-noneditable-button', '<div contenteditable="true"><button id="activate" contenteditable="false">Activate</button></div>'],
  ['inherited-noneditable-button', '<div contenteditable="true"><div contenteditable="false"><button id="activate">Activate</button></div></div>'],
  ['input-button', '<input id="activate" type="button" value="Activate">'],
  ['checkbox', '<input id="activate" type="checkbox" aria-label="Activate">'],
] as const) {
  test(`observation Space activation ${name}`, async ({ page }) => {
    await page.setContent(`${html}<output id="activation-count">0</output>`);
    const control = page.locator('#activate');
    await control.evaluate(element => element.addEventListener('click', () => {
      const output = document.querySelector('#activation-count')!;
      output.textContent = String(Number(output.textContent) + 1);
    }));
    await control.focus();
    await expect(control).toBeFocused();
    const session = await beginObservation(page, { maxObservations: 100 });
    await page.keyboard.press('Space');
    await expect(page.locator('#activation-count')).toHaveText('1');
    if (name === 'checkbox') await expect(control).toBeChecked();
    const capture = await session.finish();
    const keys = capture.observations.filter(o => o.kind === 'key');
    expect(keys.map(o => o.key)).toEqual(['Space']);
    expect(keys[0]!.target?.attributes.id).toBe('activate');
    expect(capture.complete).toBe(true);
    expect(capture.issues).toEqual([]);
  });
}

for (const [name, html, nativeField] of [
  ['inherited-editable', '<div contenteditable="true"><span id="editor" tabindex="0">seed</span></div>', false],
  ['reenabled-editable', '<div contenteditable="true"><div contenteditable="false"><div id="editor" contenteditable="true">seed</div></div></div>', false],
  ['plaintext-only', '<div id="editor" contenteditable="plaintext-only">seed</div>', false],
  ['text-input', '<input id="editor">', true],
  ['textarea', '<textarea id="editor"></textarea>', true],
] as const) {
  test(`observation Space editing ${name}`, async ({ page }) => {
    await page.setContent(html);
    const editor = page.locator('#editor');
    await editor.focus();
    if (!nativeField) {
      await editor.evaluate(element => {
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        const selection = window.getSelection();
        if (!selection) throw new Error('Editing fixture selection unavailable.');
        selection.removeAllRanges();
        selection.addRange(range);
      });
      await editor.focus();
    }
    await expect(editor).toBeFocused();
    const session = await beginObservation(page, { maxObservations: 100 });
    await page.keyboard.type('editing-secret');
    await page.keyboard.press('Space');
    if (nativeField) expect(await editor.inputValue()).toBe('editing-secret ');
    else expect(await editor.evaluate(element => element.textContent?.replaceAll('\u00a0', ' '))).toBe('seedediting-secret ');
    const capture = await session.finish();
    expect(capture.observations.filter(o => o.kind === 'key').map(o => o.key)).not.toContain('Space');
    expect(JSON.stringify(capture.observations)).not.toContain('editing-secret');
    expect(capture.observations.every(o => !o.target || !('value' in o.target.attributes))).toBe(true);
    expect(capture.complete).toBe(true);
  });
}

test('observation Space preserves design-mode suppression', async ({ page }) => {
  await page.setContent('<button id="activate" contenteditable="false">Activate</button>');
  await page.evaluate(() => { document.designMode = 'on'; });
  await page.locator('#activate').focus();
  await expect(page.locator('#activate')).toBeFocused();
  const session = await beginObservation(page, { maxObservations: 100 });
  await page.keyboard.press('Space');
  const capture = await session.finish();
  expect(capture.observations.filter(o => o.kind === 'key').map(o => o.key)).not.toContain('Space');
  expect(capture.complete).toBe(true);
});

test('observation Space preserves modifier filtering', async ({ page }) => {
  await page.setContent('<button id="activate">Activate</button>');
  await page.locator('#activate').focus();
  await expect(page.locator('#activate')).toBeFocused();
  const session = await beginObservation(page, { maxObservations: 100 });
  await page.keyboard.press('Control+Space');
  await page.keyboard.press('Alt+Space');
  await page.keyboard.press('Meta+Space');
  await page.keyboard.press('Space');
  const capture = await session.finish();
  expect(capture.observations.filter(o => o.kind === 'key').map(o => o.key)).toEqual(['Space']);
  expect(capture.complete).toBe(true);
});
