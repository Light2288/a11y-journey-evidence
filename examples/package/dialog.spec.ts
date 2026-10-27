import { test } from 'a11y-journey-evidence';
import { loadDialog, type DialogVariant } from '../shared/dialog.js';
import { exerciseDialog } from '../shared/dialog-journey.js';
for(const variant of ['correct','escaping-focus','failed-restoration'] as DialogVariant[]) {
  test(`dialog ${variant}`,async({page,journey})=>{
    if(variant!=='correct')test.fail();
    await test.step('Setup: load synthetic dialog',()=>loadDialog(page,variant));
    await journey.start({root:page.locator('#dialog')});
    await exerciseDialog(page);
  });
}
