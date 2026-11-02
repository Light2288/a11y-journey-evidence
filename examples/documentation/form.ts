// Synthetic fixture and native journey adapted from released v0.1.0 examples/shared/.
import { test, expect, type Page } from '@playwright/test';

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

export async function exerciseForm(page: Page): Promise<void> {
  const name = page.getByRole('textbox', { name: 'Name', exact: true });
  const team = page.getByRole('textbox', { name: 'Team', exact: true });
  const submit = page.getByRole('button', { name: 'Submit', exact: true });

  await test.step('Keyboard submission', async () => {
    await expect(page.getByRole('form', { name: 'Team request' })).toHaveAttribute('novalidate', '');
    for (const field of [name, team]) {
      await expect(field).toHaveAttribute('aria-invalid', 'false');
      await expect(field).not.toHaveAttribute('aria-describedby', /.+/);
    }
    await expect(page.locator('#name-error')).toBeHidden();
    await expect(page.locator('#team-error')).toBeHidden();
    await expect(page.locator('#success')).toBeHidden();
    await page.keyboard.press('Tab');
    await expect(name).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(team).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(submit).toBeFocused();
    await page.keyboard.press('Enter');
  });
  await test.step('Visible errors and invalid states', async () => {
    await expect(page.locator('#name-error')).toBeVisible();
    await expect(page.locator('#name-error')).toHaveText('Enter a name.');
    await expect(page.locator('#team-error')).toBeVisible();
    await expect(page.locator('#team-error')).toHaveText('Enter a team.');
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(team).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#success')).toBeHidden();
  });
  await test.step('Declared error associations', async () => {
    await expect(name, 'Association: Name describes its visible error').toHaveAccessibleDescription('Enter a name.');
    await expect(team, 'Association: Team describes its visible error').toHaveAccessibleDescription('Enter a team.');
    await expect(name).toHaveAttribute('aria-describedby', 'name-error');
    await expect(team).toHaveAttribute('aria-describedby', 'team-error');
  });
  await test.step('Declared invalid-submit focus', async () => {
    await expect(name, 'Error focus: Name is the first invalid field').toBeFocused();
  });
  await test.step('Keyboard correction and successful resubmission', async () => {
    await page.keyboard.type('Example User');
    await page.keyboard.press('Tab');
    await expect(team).toBeFocused();
    await page.keyboard.type('Example Team');
    await expect(name).toHaveValue('Example User');
    await expect(team).toHaveValue('Example Team');
    // This example updates validation on submit, rather than on each edit.
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(team).toHaveAttribute('aria-invalid', 'true');
    await page.keyboard.press('Tab');
    await expect(submit).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toHaveText('Details saved.');
    await expect(page.getByRole('status')).toBeVisible();
    for (const field of [name, team]) {
      await expect(field).toHaveAttribute('aria-invalid', 'false');
      await expect(field).not.toHaveAttribute('aria-describedby', /.+/);
      await expect(field).toHaveAccessibleDescription('');
    }
    await expect(page.locator('#name-error')).toBeHidden();
    await expect(page.locator('#team-error')).toBeHidden();
    await expect(page.locator('#form')).toBeAttached();
  });
}
