// @ts-check
import path from 'path';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  base: '/test/barriers/',
  vite: {
    resolve: {
      alias: {
        '@components': path.resolve('./src/components'),
        '@content': path.resolve('./src/content'),
        '@layouts': path.resolve('./src/layouts'),
        '@pages': path.resolve('./src/pages'),
        '@styles': path.resolve('./src/styles'),
        '@assets': path.resolve('./src/assets'),
        '@fonts/*': path.resolve('./src/assets/fonts/*'),
      }
    },
    plugins: [tailwindcss()]
  },
  integrations: [react()]
});