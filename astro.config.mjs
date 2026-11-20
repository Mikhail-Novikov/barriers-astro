// @ts-check
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'path';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

const branchName = process.env.DEPLOY_BRANCH
  || process.env.GITHUB_HEAD_REF
  || process.env.GITHUB_REF_NAME
  || process.env.VERCEL_GIT_COMMIT_REF
  || process.env.BRANCH
  || (existsSync('.git')
    ? execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim()
    : '');

const branchBases = new Map([
  ['main', '/test/barriers/'],
  ['filter-with-radiobutton-ver.-A', '/test/barriers/a/'],
  ['filter-with-checkboxes-ver.-B', '/test/barriers/b/'],
]);

// https://astro.build/config
export default defineConfig({
  base: branchBases.get(branchName) ?? '/test/barriers/',
  vite: {
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@assets': path.resolve('./src/assets'),
        '@components': path.resolve('./src/components'),
        '@content': path.resolve('./src/content'),
        '@fonts/*': path.resolve('./src/assets/fonts/*'),
        '@hooks': path.resolve('./src/hooks'),
        '@layouts': path.resolve('./src/layouts'),
        '@pages': path.resolve('./src/pages'),
        '@styles': path.resolve('./src/styles'),
        '@types': path.resolve('./src/types'),
      }
    },
    plugins: [tailwindcss()]
  },
  integrations: [react()]
});