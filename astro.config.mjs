// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// User site (madironman.github.io): no base path needed.
export default defineConfig({
  site: 'https://madironman.github.io',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  // Older links pointed at /resume and /writing; send them to the PDF and to
  // the Writing section of the home page (there is no separate index page).
  redirects: {
    '/resume': '/Madhevan_Ramalingam_Resume.pdf',
    '/writing': '/#writing',
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
