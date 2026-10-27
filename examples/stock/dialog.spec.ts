import { test } from '@playwright/test';
import { loadDialog, type DialogVariant } from '../shared/dialog.js';
import { exerciseDialog } from '../shared/dialog-journey.js';
test.afterEach(async({page},info)=>{
  if(!['failed','timedOut','interrupted'].includes(info.status??''))return;
  const outcomes:unknown[]=[];
  for(const kind of ['focus','screenshot','aria']){
    const startedAt=new Date().toISOString();
    try{
      if(kind==='focus')await info.attach('stock-focus',{body:Buffer.from(JSON.stringify(await page.evaluate(()=>{const el=document.activeElement;return el?{tag:el.tagName.toLowerCase(),id:el.id}:null;}))),contentType:'application/json'});
      if(kind==='screenshot')await info.attach('stock-screenshot',{body:await page.screenshot({timeout:2000}),contentType:'image/png'});
      if(kind==='aria')await info.attach('stock-aria',{body:Buffer.from(await page.locator('#dialog').ariaSnapshot({timeout:2000})),contentType:'text/yaml'});
      outcomes.push({kind,status:'captured',phase:'afterEach',startedAt,finishedAt:new Date().toISOString()});
    }catch(error){outcomes.push({kind,status:'unavailable',phase:'afterEach',reason:String(error),startedAt,finishedAt:new Date().toISOString()});}
  }
  try{await info.attach('stock-capture-timing',{body:Buffer.from(JSON.stringify(outcomes,null,2)),contentType:'application/json'});}
  catch(error){process.stderr.write(`Stock attachment reporting failed: ${String(error)}\n`);}
});
for(const variant of ['correct','escaping-focus','failed-restoration'] as DialogVariant[]) {
  test(`dialog ${variant}`,async({page})=>{
    if(variant!=='correct')test.fail();
    await test.step('Setup: load synthetic dialog',()=>loadDialog(page,variant));
    await exerciseDialog(page);
  });
}
