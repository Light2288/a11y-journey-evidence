import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: '.', testMatch: '*.spec.ts', workers: 1, retries: 0, timeout: 10000, expect: { timeout: 400 }, reporter: [['json']], use: { browserName: 'chromium' } });
