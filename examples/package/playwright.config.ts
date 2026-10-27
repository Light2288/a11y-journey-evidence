import { defineConfig } from '@playwright/test';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
export default defineConfig({testDir:'.',testMatch:['dialog.spec.ts','form.spec.ts'],timeout:15000,expect:{timeout:500},workers:2,outputDir:resolve('.artifacts/package-results'),reporter:[['list'],['json',{outputFile:process.env.PLAYWRIGHT_JSON_OUTPUT_FILE??resolve('.artifacts/package-native.json')}],['html',{outputFolder:resolve('.artifacts/package-html'),open:'never'}],[fileURLToPath(import.meta.resolve('a11y-journey-evidence/reporter')),{outputDir:process.env.AJE_CASE_OUTPUT??resolve('a11y-evidence'),reproductionCommand:'npm run demo:package'}]],use:{browserName:'chromium',trace:'on'}});
