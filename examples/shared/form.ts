import type { Page } from '@playwright/test';

export type FormVariant = 'correct' | 'missing-error-association' | 'failed-error-focus';

export async function loadForm(page: Page, variant: FormVariant): Promise<void> {
  await page.setContent(`<!doctype html><html lang="en"><title>Synthetic form</title>
<style>body{font:18px system-ui;padding:32px;max-width:36rem}label,input,button{display:block;margin:12px 0}input,button{font:inherit;padding:8px}:focus-visible{outline:3px solid #2358cc}.error{color:#a11818}</style>
<form id="form" aria-labelledby="form-title" novalidate>
<h1 id="form-title">Team request</h1><p>Synthetic details; no personal data.</p>
<label for="name">Name</label><input id="name" name="name" type="text" required aria-invalid="false">
<p id="name-error" class="error" hidden>Enter a name.</p>
<label for="team">Team</label><input id="team" name="team" type="text" required aria-invalid="false">
<p id="team-error" class="error" hidden>Enter a team.</p>
<button id="submit" type="submit">Submit</button><p id="success" role="status" hidden>Details saved.</p>
</form>
<script>
const variant=${JSON.stringify(variant)};
const form=document.querySelector('#form'),success=document.querySelector('#success');
form.addEventListener('submit',event=>{
  event.preventDefault();
  const invalid=[];
  for(const id of ['name','team']){
    const input=document.getElementById(id),error=document.getElementById(id+'-error');
    const missing=input.value.trim()==='';
    error.hidden=!missing;
    input.setAttribute('aria-invalid',String(missing));
    if(missing&&!(variant==='missing-error-association'&&id==='name'))input.setAttribute('aria-describedby',error.id);
    else input.removeAttribute('aria-describedby');
    if(missing)invalid.push(input);
  }
  success.hidden=invalid.length!==0;
  // Native validation UI must not supply the focus policy omitted by the broken variant.
  if(invalid.length&&variant!=='failed-error-focus')invalid[0].focus();
});
</script></html>`);
}
