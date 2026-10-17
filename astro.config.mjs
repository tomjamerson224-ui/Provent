// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://proventairconditioning.com.au',

  integrations: [react(), sitemap()],

  // Prefetch internal links on hover/tap so the next page is already loaded.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  // Emit about.html (not about/index.html) so Cloudflare serves /about
  // directly instead of 307-ing to /about/ — matches the canonical URLs.
  trailingSlash: 'never',
  // inlineStylesheets: the site CSS is ~16KB, so inlining it removes a
  // render-blocking request on first load.
  build: { format: 'file', inlineStylesheets: 'always' },

  // Old WordPress used plain ?page_id= permalinks — those are handled in
  // src/middleware.ts (query strings can't be matched here). These cover the
  // few path-style URLs WordPress also answered on.
  redirects: {
    '/about-us': '/about',
    '/services': '/service-repairs',
    '/services-2': '/service-repairs',
    '/our-work': '/supply-install',
    '/contact-2': '/contact',
    '/ducted-air-conditioner': '/ducted-air-conditioning',
    '/split-system-air-conditioners': '/split-system-air-conditioning',
  },

  // Every page is prerendered except /api/quote. Sessions are unused, so
  // opt out — otherwise the adapter demands a SESSION KV namespace.
  session: false,

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    // Dev only: Vite's SSR dep optimiser intermittently loses @lucide/astro
    // ("file does not exist in the optimize deps directory") after installs.
    optimizeDeps: { exclude: ['@lucide/astro'] },
    ssr: { optimizeDeps: { exclude: ['@lucide/astro'] } },
  },

  // 'compile' optimises images with sharp at build time, so no Cloudflare
  // Images binding is needed.
  adapter: cloudflare({ imageService: 'compile' }),
});
