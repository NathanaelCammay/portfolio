// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Where the site is published. Used for absolute URLs (sitemap, social previews).
  site: 'https://nathanaelcammay.github.io',
  // GitHub Pages serves this repo under /portfolio/. Remove once the custom domain is live.
  base: '/portfolio',
  integrations: [react()],
});
