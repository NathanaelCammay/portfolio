// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Where the site is published. Used for absolute URLs (sitemap, social previews).
  site: 'https://nathanaelcammay.com',
  // Output about.html rather than about/index.html, so /about loads directly
  // instead of GitHub Pages redirecting it to /about/ first.
  // inlineStylesheets: the CSS is small (~3 KB compressed), so embedding it saves a render-blocking request.
  build: { format: 'file', inlineStylesheets: 'always' },
  // About, Contact and Projects used to be separate pages. Keep their old URLs working.
  redirects: {
    '/about': '/#about',
    '/contact': '/#contact',
    '/projects': '/#projects',
  },
  integrations: [react(), sitemap()],
});