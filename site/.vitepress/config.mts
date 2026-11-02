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
    nav: [{ text: 'Get started', link: '/getting-started' }],
    sidebar: [{ text: 'Start here', items: [{ text: 'Get started', link: '/getting-started' }] }],
    socialLinks: [{ icon: 'github', link: 'https://github.com/Light2288/a11y-journey-evidence' }],
    footer: { message: 'Experimental v0.1.0 · External validation pending', copyright: 'MIT licensed' },
  },
  async buildEnd(config) {
    const sourceCommit = process.env.GITHUB_SHA ?? execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    if (!/^[a-f0-9]{40}$/.test(sourceCommit)) throw new Error('Invalid documentation source commit');
    await writeFile(join(config.outDir, 'build-info.json'), JSON.stringify({ sourceCommit, packageVersion: '0.1.0' }) + '\n');
  },
});
