import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderReport } from '../../dist/markdown.js';
import type { AttemptEvidence } from '../../dist/model.js';
const attack = '```\n# injected\n[x](javascript:alert(1))\n<img src=x onerror=alert(1)>\n../../evil';
const attempt: AttemptEvidence = { id:'safe', title:attack, project:attack, source:attack, retry:0, repeat:0, worker:0, actualStatus:'failed', expectedStatus:'passed', errors:[attack], steps:[], assertions:[], issues:[{ code:'test',message:attack }], complete:false, verifiedBehavior:false, traces:[] };
test('Markdown renders hostile evidence as inert text within unbreakable fences', () => {
  const report = renderReport([attempt], { node:'v24.21.0',playwright:'1.64.1',startedAt:'test',reproductionCommand:attack });
  let fence = 0;
  const outside: string[] = [];
  for (const line of report.split('\n')) {
    const match = line.match(/^(`{3,})(?:text)?$/);
    if (match) { const n=match[1]!.length; if (!fence) fence=n; else if (n>=fence) fence=0; continue; }
    if (!fence) outside.push(line);
  }
  assert.equal(fence,0);
  const prose=outside.join('\n');
  for (const bad of ['# injected','javascript:','<img','../../evil']) assert.equal(prose.includes(bad),false);
  assert.equal(report.includes(attack),true);
  assert.match(prose,/No executed assertions/i);
  assert.match(prose,/not.*conformance/i);
});
test('large bounded evidence with many backtick runs does not exhaust argument limits', () => {
  const noisy = { ...attempt, errors: Array.from({length:160},()=> '`x'.repeat(1000)) };
  assert.doesNotThrow(() => renderReport([noisy], {node:'v24.21.0',playwright:'1.64.1',startedAt:'test',reproductionCommand:'npx playwright test'}));
});
