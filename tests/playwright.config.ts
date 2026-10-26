import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './browser', timeout: 30_000, expect: { timeout: 1500 }, workers: 2, outputDir: '../.artifacts/tests', reporter: 'list', use: { browserName: 'chromium' } });
