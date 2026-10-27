import type { AttemptEvidence, RunContext } from './model.js';
function block(value: string): string {
  let longest = 0;
  for (const match of value.matchAll(/`+/g)) longest = Math.max(longest, match[0].length);
  const fence = '`'.repeat(Math.max(3,longest+1));
  return `${fence}text\n${value}\n${fence}\n`;
}
export function renderReport(attempts: readonly AttemptEvidence[], context: RunContext): string {
  const out = ['# A11y journey evidence\n', `Selected attempts: ${attempts.length}.\n`, 'Evidence covers observed supported behavior and explicit assertions, not accessibility conformance, screen-reader output, inclusive user testing, or every keyboard/focus path.\n', '## Run context\n', block(`Node: ${context.node}\nPlaywright: ${context.playwright}\nBundle generated: ${context.startedAt}`), '## Reproduction\n', 'Run the declared command, then select the source/project/test identified below using native Playwright filters.\n', block(context.reproductionCommand)];
  attempts.forEach((attempt, index) => {
    out.push(`## Attempt ${index+1}\n`, block(`Test: ${attempt.title}\nProject: ${attempt.project}\nSource: ${attempt.source}\nRepeat: ${attempt.repeat}; retry: ${attempt.retry}; worker: ${attempt.worker}\nactual: ${attempt.actualStatus}\nexpected: ${attempt.expectedStatus}\nEvidence: ${attempt.complete ? 'complete within supported scope' : 'incomplete'}\nDeclared behavioral assertions: ${attempt.verifiedBehavior ? 'passed' : 'not verified'}`));
    if (!attempt.assertions.length) out.push('No executed assertions; no verified behavioral checks.\n');
    if (attempt.actualStatus !== 'passed') out.push('Only executed checks are listed; later checks may be absent. An expected failure remains an actual failed outcome.\n');
    if (attempt.fixture) out.push('### Captured runtime\n', block(JSON.stringify(attempt.fixture.runtime,null,2)));
    out.push('### Native named steps and assertions\n', 'Sequence numbers describe native step starts; they do not establish a total order or causal relationship with browser observations.\n');
    const visibleSteps = attempt.steps.filter(step => ['expect','test.step'].includes(step.category));
    out.push(block(visibleSteps.map(step => `${step.seq} ${step.category} ${step.status}${step.parent ? ` (parent ${step.parent})` : ''}: ${step.title}${step.source ? `\n  ${step.source}` : ''}${step.error ? `\n${step.error}` : ''}`).join('\n') || 'No executed named steps or assertions.'));
    if (attempt.errors.length) out.push('### Native failure diagnostics\n', block(attempt.errors.join('\n\n')));
    out.push('### Keyboard/focus observations\n', 'Browser sequence order is separate from native step order. Raw attributes are identifying DOM data, not computed accessible names.\n', block(attempt.fixture?.observation.observations.map(o => `${o.seq} ${o.kind}${o.key ? ` ${o.key}` : ''} ${o.target ? `${o.target.ref} ${o.target.tag} ${JSON.stringify(o.target.attributes)}` : 'no target'}`).join('\n') || 'No observations available.'));
    out.push('### Failure artifacts\n', 'Artifacts describe fixture-teardown state when available, not necessarily the instant an assertion failed. Empty snapshots do not establish accessible structure.\n');
    for (const kind of ['screenshot','ariaSnapshot'] as const) {
      const artifact = attempt.fixture?.artifacts[kind];
      out.push(block(`${kind}: ${artifact?.status ?? 'unavailable'}\nphase: ${attempt.fixture?.capturePhase ?? 'unavailable'}${artifact?.reason ? `\n${artifact.reason}` : ''}${artifact?.startedAt ? `\nCapture start: ${artifact.startedAt}; finish: ${artifact.finishedAt}` : ''}`));
      if (artifact?.link) out.push(`[${kind === 'screenshot' ? 'Screenshot' : 'ARIA snapshot'}](${artifact.link})\n`);
    }
    for (const trace of attempt.traces) if (/^assets\/[a-f0-9]+\/trace-\d+\.zip$/.test(trace)) out.push(`[Native trace](${trace})\n`);
    out.push('### Completeness and limitations\n', block(attempt.issues.length ? attempt.issues.map(i => `${i.code}: ${i.message}`).join('\n') : 'No capture issues reported within the supported scope.'));
  });
  out.push('## Data and interpretation\n', 'Artifacts, attributes, native titles, locator diagnostics, and assertion errors may contain application data. Omitting typed values from observations is not general sanitization. Screenshots, DOM focus, and ARIA snapshots describe different evidence; none proves screen-reader announcements, focus-indicator quality, or a complete keyboard experience.\n');
  return out.join('\n');
}
