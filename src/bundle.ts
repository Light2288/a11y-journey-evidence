import { randomUUID } from 'node:crypto';
import { mkdir, copyFile, writeFile, rename } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { renderReport } from './markdown.js';
import type { AttemptEvidence, JourneyReporterOptions } from './model.js';
const require = createRequire(import.meta.url);
export async function writeBundle(attempts: readonly AttemptEvidence[], options: JourneyReporterOptions): Promise<{ reportPath: string; failed: boolean }> {
  const directory = resolve(options.outputDir ?? 'a11y-evidence', randomUUID());
  await mkdir(directory, { recursive:true });
  const records = structuredClone([...attempts]).sort((a,b) => a.project.localeCompare(b.project) || a.source.localeCompare(b.source) || a.title.localeCompare(b.title) || a.repeat-b.repeat || a.retry-b.retry);
  let failed = false;
  for (const attempt of records) {
    const destination = join(directory,'assets',attempt.id);
    await mkdir(destination,{recursive:true});
    for (const [kind,name] of [['screenshot','screenshot.png'],['ariaSnapshot','aria.yml']] as const) {
      const artifact=attempt.fixture?.artifacts[kind];
      if (!artifact?.path || !['captured','empty'].includes(artifact.status)) continue;
      try { await copyFile(artifact.path,join(destination,name)); artifact.link=`assets/${attempt.id}/${name}`; }
      catch(error) { failed=true; attempt.complete=false; artifact.status='unavailable'; artifact.reason=`Bundle copy failed: ${String(error)}`; attempt.issues.push({code:'artifact-copy-failed',message:artifact.reason}); }
    }
    const traces:string[]=[];
    for (const [index,path] of attempt.traces.entries()) {
      try { const name=`trace-${index}.zip`; await copyFile(path,join(destination,name)); traces.push(`assets/${attempt.id}/${name}`); }
      catch(error) { failed=true;attempt.complete=false;attempt.issues.push({code:'trace-copy-failed',message:String(error)}); }
    }
    attempt.traces=traces;
    if(attempt.issues.some(issue=>issue.code==='handoff-failed')) failed=true;
  }
  const report=renderReport(records,{node:process.version,playwright:require('@playwright/test/package.json').version as string,startedAt:new Date().toISOString(),reproductionCommand:options.reproductionCommand ?? 'npx playwright test'});
  const reportPath=join(directory,'report.md');
  await writeFile(join(directory,'report.tmp'),report,'utf8');
  await rename(join(directory,'report.tmp'),reportPath);
  return {reportPath,failed};
}
