import { defineConfig } from '@playwright/test';
import { resolve } from 'node:path';
export default defineConfig({testDir:'.',testMatch:['dialog.spec.ts','form.spec.ts'],timeout:15000,expect:{timeout:500},workers:2,outputDir:resolve('.artifacts/stock-results'),reporter:[['list'],['json',{outputFile:process.env.PLAYWRIGHT_JSON_OUTPUT_FILE??resolve('.artifacts/stock-native.json')}],['html',{outputFolder:resolve('.artifacts/stock-html'),open:'never'}]],use:{browserName:'chromium',trace:'on'}});
