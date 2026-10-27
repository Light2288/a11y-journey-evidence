import { readFile } from 'node:fs/promises';
import { test, plainTest } from './fixtures.js';
import { expect } from '@playwright/test';
test('packed consumer dialog uses existing fixture',async({page,journey,tenant})=>{
  expect(tenant).toBe('synthetic-team');
  await page.setContent(await readFile(new URL('./dialog.html',import.meta.url),'utf8'));
  await journey.start({root:page.locator('#dialog')});
  await test.step('Keyboard opens dialog with declared initial focus',async()=>{
    await page.keyboard.press('Tab');await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog',{name:'Preferences'})).toBeVisible();
    await expect(page.locator('#continue')).toBeFocused();
  });
  await test.step('Keyboard stays inside both boundaries',async()=>{
    await page.keyboard.press('Tab');await expect(page.locator('#cancel')).toBeFocused();
    await page.keyboard.press('Tab');await expect(page.locator('#continue')).toBeFocused();
    await page.keyboard.press('Shift+Tab');await expect(page.locator('#cancel')).toBeFocused();
  });
  await test.step('Escape dismisses and restores focus',async()=>{
    await page.keyboard.press('Escape');await expect(page.locator('#dialog')).toBeHidden();await expect(page.locator('#opener')).toBeFocused();
  });
});
plainTest('packed consumer unselected control',async({page,tenant})=>{
  await page.setContent('<button>Control</button>');expect(tenant).toBe('synthetic-team');await page.keyboard.press('Tab');await expect(page.getByRole('button')).toBeFocused();
});
