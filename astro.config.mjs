import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://reneleo.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react(), sitemap()],
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
});