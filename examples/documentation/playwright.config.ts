import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '.', testMatch: '*.spec.ts', workers: 1,
  timeout: 15_000, expect: { timeout: 1_000 },
  outputDir: '.artifacts/results',
  reporter: [
    ['list'], ['json', { outputFile: '.artifacts/native.json' }],
    ['html', { outputFolder: '.artifacts/html', open: 'never' }],
    ['a11y-journey-evidence/reporter', {
      outputDir: '.artifacts/evidence', reproductionCommand: 'npm test',
    }],
  ],
  use: { browserName: 'chromium', trace: 'on', viewport: { width: 1280, height: 720 } },
});
