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