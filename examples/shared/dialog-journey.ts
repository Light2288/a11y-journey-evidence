import { test, expect, type Page } from '@playwright/test';
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
