import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { cp, mkdir, mkdtemp, readFile, readdir, stat, writeFile, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const registry='https://registry.npmjs.org';

async function verifyConsumer() {
const release=JSON.parse(await readFile(join(root,'package.json'),'utf8'));
const args=process.argv.slice(2);
let mode='default';
let tarball;
if(args.length){
  const [flag,value]=args;
  if(!['--tarball','--published-version'].includes(flag))throw new Error('Unknown consumer source option');
  if(!value||value.startsWith('--'))throw new Error(`${flag} requires a ${flag==='--tarball'?'tarball path':'version'}`);
  if(args.length!==2)throw new Error('Choose only one consumer source, without additional arguments');
  if(flag==='--published-version'){
    if(!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value))throw new Error('An exact published version is required');
    if(value!==release.version)throw new Error('Published version must match the release manifest');
    mode='registry';
  }else{
    mode='candidate';
    tarball=resolve(value);
    try{
      if(!(await stat(tarball)).isFile())throw new Error('not a regular file');
      tarball=await realpath(tarball);
    }catch(error){throw new Error(`Explicit tarball unavailable: ${tarball}`,{cause:error});}
  }
}
let integrity;
let registryTarball;
if(mode==='default'){
  const packDir=join(root,'.artifacts/package');await mkdir(packDir,{recursive:true});
  const packed=JSON.parse(execFileSync('npm',['pack','--json','--pack-destination',packDir],{cwd:root,encoding:'utf8'}))[0];
  tarball=await realpath(join(packDir,packed.filename));
}
if(mode==='registry'){
  const published=JSON.parse(execFileSync('npm',['view',`${release.name}@${release.version}`,'--json',`--registry=${registry}`],{encoding:'utf8'}));
  assert.equal(published.name,release.name);assert.equal(published.version,release.version);
  integrity=published.dist.integrity;
  registryTarball=published.dist.tarball;
  const url=new URL(registryTarball);
  assert.equal(url.protocol,'https:');assert.equal(url.hostname,'registry.npmjs.org');
  assert.match(integrity,/^sha512-[A-Za-z0-9+/]+={0,2}$/);
}else{
  integrity=`sha512-${createHash('sha512').update(await readFile(tarball)).digest('base64')}`;
}
const sourceKind=mode==='registry'?'registry':'tarball';
const packageSpec=sourceKind==='tarball'?`file:${tarball}`:release.version;
const outputName=mode==='default'?'consumer':`consumer-${mode}`;
const consumer=await mkdtemp(join(tmpdir(),'aje-consumer-'));
let movedRoot;
try{
// A fresh copy prevents root node_modules or npm's same-version local-tarball cache from satisfying integration accidentally.
await cp(join(root,'examples/consumer'),consumer,{recursive:true,filter:source=>!['node_modules','.artifacts','package-lock.json'].includes(source.split('/').at(-1))});
const manifest=JSON.parse(await readFile(join(consumer,'package.json'),'utf8'));
manifest.devDependencies[release.name]=packageSpec;
await writeFile(join(consumer,'package.json'),JSON.stringify(manifest,null,2));
const env={...process.env};delete env.FORCE_COLOR;
// Isolate release-source cache entries as well as node_modules and the lockfile.
if(mode!=='default')env.npm_config_cache=join(consumer,'.npm-cache');
for(const args of [['install','--ignore-scripts','--no-audit','--no-fund',`--registry=${registry}`],['run','typecheck'],['test']])execFileSync('npm',args,{cwd:consumer,env,stdio:'inherit'});
const require=createRequire(join(consumer,'package.json'));
const installed=require.resolve('a11y-journey-evidence/reporter');
assert.ok(installed.startsWith((await realpath(join(consumer,'node_modules')))+sep),'reporter must resolve from installed package');
const installedManifest=JSON.parse(await readFile(resolve(dirname(installed),'../package.json'),'utf8'));
assert.equal(installedManifest.name,release.name);assert.equal(installedManifest.version,release.version);
const lock=JSON.parse(await readFile(join(consumer,'package-lock.json'),'utf8'));
const installedEntry=lock.packages[`node_modules/${release.name}`];
assert.equal(installedEntry.version,release.version);assert.equal(installedEntry.integrity,integrity);
if(sourceKind==='registry'){
  assert.equal(installedEntry.resolved,registryTarball);
  assert.equal(lock.packages[''].devDependencies[release.name],release.version);
}else{
  assert.ok(installedEntry.resolved.startsWith('file:'));
  assert.equal(await realpath(resolve(consumer,installedEntry.resolved.slice(5))),tarball);
  assert.equal(`sha512-${createHash('sha512').update(await readFile(tarball)).digest('base64')}`,integrity,'archive changed during verification');
}
const native=JSON.parse(await readFile(join(consumer,'.artifacts/native.json'),'utf8'));
const tests=[];
function visit(suite){for(const spec of suite.specs??[])for(const test of spec.tests)tests.push({...test,title:spec.title});for(const sub of suite.suites??[])visit(sub);}
for(const suite of native.suites)visit(suite);
assert.equal(tests.length,3);assert.ok(tests.every(test=>test.results[0].status==='passed'));
const selectedTitles=['packed consumer dialog uses existing fixture','packed consumer form uses existing fixture'];
const selected=tests.filter(test=>selectedTitles.includes(test.title));
const control=tests.find(test=>test.title==='packed consumer unselected control');
assert.deepEqual(selected.map(test=>test.title).sort(),[...selectedTitles].sort());assert.ok(control);
assert.equal(control.results[0].attachments.some(a=>a.name==='a11y-journey.v1.json'),false);
const payloads=[];
for(const testcase of selected){
  const attachments=testcase.results[0].attachments.filter(a=>a.name==='a11y-journey.v1.json');assert.equal(attachments.length,1);
  const attachment=attachments[0];
  const payload=JSON.parse(attachment.path?await readFile(attachment.path,'utf8'):Buffer.from(attachment.body,'base64').toString());
  assert.equal(payload.started,true);assert.equal(payload.observation.complete,true);
  if(testcase.title==='packed consumer form uses existing fixture')assert.ok(payload.observation.observations.some(o=>o.target?.attributes.id==='name'&&o.target.attributes['aria-invalid']==='true'&&o.target.attributes['aria-describedby']==='name-error'));
  payloads.push(payload);
}
assert.ok((await stat(join(consumer,'.artifacts/html/index.html'))).isFile());
const runs=await readdir(join(consumer,'.artifacts/evidence'));
assert.equal(runs.length,1);
const reportDir=join(consumer,'.artifacts/evidence',runs[0]);
movedRoot=await mkdtemp(join(tmpdir(),'aje-consumer-moved-'));
const moved=join(movedRoot,'bundle');await cp(reportDir,moved,{recursive:true});
const report=await readFile(join(moved,'report.md'),'utf8');
assert.match(report,/Selected attempts: 2/);assert.match(report,/packed consumer dialog uses existing fixture/);assert.match(report,/packed consumer form uses existing fixture/);assert.doesNotMatch(report,/packed consumer unselected control/);
for(const link of report.matchAll(/\]\((assets\/[^)]+)\)/g))assert.ok((await stat(join(moved,link[1]))).isFile());
const saved=join(root,'.artifacts',outputName);await rm(saved,{recursive:true,force:true});await cp(join(consumer,'.artifacts'),saved,{recursive:true});
const proof={sourceKind,packageSpec,packageVersion:installedManifest.version,integrity,resolved:installedEntry.resolved,tarball:tarball?basename(tarball):null,installedFromTarball:sourceKind==='tarball',freshExternalDirectory:true,consumerTests:tests.map(t=>({title:t.title,status:t.results[0].status})),existingFixtureVerified:true,formVerified:true,unselectedControlObserved:false,nativeAndEvidenceReports:true,movedLinksVerified:true,runtime:payloads[0].runtime,npm:execFileSync('npm',['--version'],{encoding:'utf8'}).trim(),typescript:require('typescript/package.json').version,host:process.platform==='darwin'?execFileSync('sw_vers',['-productVersion'],{encoding:'utf8'}).trim():process.platform,report:`.artifacts/${outputName}/evidence/${runs[0]}/report.md`};
await writeFile(join(root,'.artifacts',`${outputName}-verification.json`),JSON.stringify(proof,null,2)+'\n');
console.log(`${sourceKind==='registry'?'Registry':'Packed'} consumer verified: 3 passed; form, dialog, fixture composition, native reporter, opt-in isolation, declarations, and moved links.`);
console.log(`Evidence: ${proof.report}`);
}finally{
  await rm(consumer,{recursive:true,force:true});
  if(movedRoot)await rm(movedRoot,{recursive:true,force:true});
}
}

try{await verifyConsumer();}catch(error){console.error('Consumer verification failed:',error);process.exitCode=1;}
