import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
test('packed file set contains runtime and declaration entrypoints without repository sources',()=>{
  const pack=JSON.parse(execFileSync('npm',['pack','--dry-run','--json'],{encoding:'utf8'}))[0];
  const paths=pack.files.map((f:{path:string})=>f.path);
  for(const required of ['dist/index.js','dist/index.d.ts','dist/reporter.js','dist/reporter.d.ts','README.md','LICENSE'])assert.ok(paths.includes(required),required);
  assert.equal(paths.some((path:string)=>path.startsWith('src/')||path.startsWith('tests/')||path.startsWith('examples/')),false);
});
