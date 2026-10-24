import { defineConfig } from 'astro/config';

// SITE_URL and BASE_PATH are set by the deploy workflow so the same build
// works on GitHub Pages (served from /mario-o-guide) or a custom domain.
export default defineConfig({
  site: process.env.SITE_URL || 'https://julian384.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
});
