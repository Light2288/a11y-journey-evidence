import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../..', import.meta.url));
const baseURL = process.env.DOCS_BASE_URL ?? 'http://localhost:4173/a11y-journey-evidence/';
export default defineConfig({
  testDir: '.', testMatch: '*.spec.ts', timeout: 30_000, workers: 1,
  expect: { timeout: 5_000 }, reporter: 'list', outputDir: `${root}/.artifacts/docs-browser`,
  use: { baseURL, browserName: 'chromium', viewport: { width: 1280, height: 900 } },
  webServer: process.env.DOCS_BASE_URL ? undefined : {
    command: 'npm run docs:preview', cwd: root, port: 4173, reuseExistingServer: false,
  },
});
