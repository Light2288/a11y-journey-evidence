import { defineConfig } from 'vitepress';
import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export default defineConfig({
  lang: 'en-US', title: 'a11y-journey-evidence',
  description: 'Keyboard and focus evidence for native Playwright journeys. Experimental v0.1.0.',
  base: '/a11y-journey-evidence/', cleanUrls: false, ignoreDeadLinks: false,
  themeConfig: {
    search: { provider: 'local' },
    nav: [
      { text: 'Get started', link: '/getting-started' },
      { text: 'Recipes', link: '/recipes/dialog' },
      { text: 'Read evidence', link: '/evidence/reading' },
      { text: 'Reference', link: '/reference/api' },
      { text: 'Compare', link: '/comparison' },
    ],
    sidebar: [
      { text: 'Start here', items: [
        { text: 'Get started', link: '/getting-started' },
        { text: 'Integrate with Playwright', link: '/guide/integration' },
      ] },
      { text: 'Recipes', items: [
        { text: 'Dialog', link: '/recipes/dialog' }, { text: 'Form', link: '/recipes/form' },
      ] },
      { text: 'Read evidence', items: [
        { text: 'Interpret a bundle', link: '/evidence/reading' },
        { text: 'Dialog failure', link: '/evidence/dialog' }, { text: 'Form failure', link: '/evidence/form' },
      ] },
      { text: 'Reference and evaluation', items: [
        { text: 'API and lifecycle', link: '/reference/api' }, { text: 'Compare with stock', link: '/comparison' },
        { text: 'Limits and data', link: '/limitations' }, { text: 'Troubleshooting', link: '/troubleshooting' },
      ] },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/Light2288/a11y-journey-evidence' }],
    footer: { message: 'Experimental v0.1.0 · External validation pending', copyright: 'MIT licensed' },
  },
  async buildEnd(config) {
    const sourceCommit = process.env.GITHUB_SHA ?? execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    if (!/^[a-f0-9]{40}$/.test(sourceCommit)) throw new Error('Invalid documentation source commit');
    await writeFile(join(config.outDir, 'build-info.json'), JSON.stringify({ sourceCommit, packageVersion: '0.1.0' }) + '\n');
  },
});
