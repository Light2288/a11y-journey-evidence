// Synthetic fixture and native journey adapted from released v0.1.0 examples/shared/.
import { test, expect, type Page } from '@playwright/test';
export type DialogVariant = 'correct' | 'escaping-focus' | 'failed-restoration';
export async function loadDialog(page: Page, variant: DialogVariant): Promise<void> {
  await page.setContent(`<!doctype html><html lang="en"><title>Synthetic dialog</title>
<style>body{font:18px system-ui;padding:32px}button{font:inherit;margin:8px;padding:8px}button:focus-visible{outline:3px solid #2358cc}#overlay:not([hidden]){position:fixed;inset:0;background:#0006;display:grid;place-items:center}#dialog{background:white;padding:24px;border-radius:8px}</style>
<button id="opener">Open preferences</button>
<div id="overlay" hidden><section id="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><h1 id="dialog-title">Preferences</h1><p>Synthetic settings; no personal data.</p><button id="continue">Continue</button><button id="cancel">Cancel</button></section></div>
<button id="after">After dialog</button>
<script>
const variant=${JSON.stringify(variant)};
const opener=document.querySelector('#opener'),overlay=document.querySelector('#overlay'),dialog=document.querySelector('#dialog'),first=document.querySelector('#continue'),last=document.querySelector('#cancel');
function closeDialog(){overlay.hidden=true;if(variant!=='failed-restoration')opener.focus();}
opener.addEventListener('click',()=>{overlay.hidden=false;first.focus();});
last.addEventListener('click',closeDialog);
document.addEventListener('keydown',event=>{if(!overlay.hidden&&event.key==='Escape'){event.preventDefault();closeDialog();}});
dialog.addEventListener('keydown',event=>{if(variant==='escaping-focus'||event.key!=='Tab')return;if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}});
</script></html>`);
}

export async function exerciseDialog(page: Page): Promise<void> {
  const opener=page.getByRole('button',{name:'Open preferences'});
  const dialog=page.getByRole('dialog',{name:'Preferences'});
  const first=page.getByRole('button',{name:'Continue',exact:true});
  const last=page.getByRole('button',{name:'Cancel',exact:true});
  await test.step('Keyboard activation and dialog semantics',async()=>{
    await page.keyboard.press('Tab');await expect(opener).toBeFocused();
    await page.keyboard.press('Enter');await expect(dialog).toBeVisible();
    await expect(dialog).toHaveRole('dialog');await expect(dialog).toHaveAccessibleName('Preferences');
  });
  await test.step('Declared initial focus',async()=>{await expect(first,'Initial focus: Continue').toBeFocused();});
  await test.step('Forward containment boundary',async()=>{
    await page.keyboard.press('Tab');await expect(last).toBeFocused();
    await page.keyboard.press('Tab');await expect(first,'Forward containment: focus returns to Continue').toBeFocused();
  });
  await test.step('Backward containment boundary',async()=>{await page.keyboard.press('Shift+Tab');await expect(last,'Backward containment: focus returns to Cancel').toBeFocused();});
  await test.step('Escape dismissal',async()=>{await page.keyboard.press('Escape');await expect(dialog).toBeHidden();});
  await test.step('Declared focus restoration',async()=>{await expect(opener,'Restoration: focus returns to Open preferences').toBeFocused();});
}
