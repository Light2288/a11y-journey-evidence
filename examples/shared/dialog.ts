import type { Page } from '@playwright/test';
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
