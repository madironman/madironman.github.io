// @ts-check
import { defineConfig } from 'astro/config';

// If the GitHub repo is named <username>.github.io this is all you need.
// If you use a project repo (e.g. github.com/madironman/site) add: base: '/site'
export default defineConfig({
  site: 'https://madironman.github.io',
  trailingSlash: 'never',
  build: { format: 'file' },
});
