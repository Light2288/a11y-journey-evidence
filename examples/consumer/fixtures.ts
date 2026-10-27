import { test as base, mergeTests } from '@playwright/test';
import { test as evidenceTest } from 'a11y-journey-evidence';
const existingTest=base.extend<{tenant:string}>({tenant:'synthetic-team'});
export const test=mergeTests(existingTest,evidenceTest);
export const plainTest=existingTest;
