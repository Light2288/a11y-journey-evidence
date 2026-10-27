import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';
import { runCase } from '../support/run-case.js';
for(const mode of ['package','stock']) {
  test(`dialog-comparison ${mode} reaches precisely the intended failures`,async()=>{
    const run=await runCase('dialog', {config:resolve(`examples/${mode}/playwright.config.ts`)});
    expect(run.exitCode).toBe(0);
    expect(run.tests).toHaveLength(3);
    const correct=run.tests.find(t=>t.title==='dialog correct');
    expect(correct.results[0].status).toBe('passed');
    for(const [variant,message] of [['escaping-focus','Forward containment'],['failed-restoration','Restoration:']]) {
      const broken=run.tests.find(t=>t.title===`dialog ${variant}`);
      expect(broken.expectedStatus).toBe('failed');
      expect(broken.results[0].status).toBe('failed');
      expect(broken.results[0].errors[0].message).toContain(message);
      expect(broken.results[0].attachments.some((a:any)=>a.name==='trace')).toBe(true);
    }
    if(mode==='package') expect(run.payloads).toHaveLength(3);
    else {
      expect(run.payloads).toHaveLength(0);
      for(const broken of run.tests.filter(t=>t.title!=='dialog correct')) expect(broken.results[0].attachments.some((a:any)=>a.name==='stock-focus')).toBe(true);
    }
  });
}
