// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://elvicticor.github.io',
  base: process.env.NODE_ENV === 'production' ? '/Page_Santiago' : '/',
  integrations: [react()]
});