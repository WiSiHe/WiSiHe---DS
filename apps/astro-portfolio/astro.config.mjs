// @ts-check

import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';

// Use Vercel adapter when deploying to Vercel, otherwise use Node adapter locally
// This avoids the Windows EPERM symlink issue with the Vercel adapter's NFT tracing
const useVercel = process.env.VERCEL === '1';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  output: 'server',
  integrations: [mdx(), sitemap(), react(), svelte()],

  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
  },

  image: {
    remotePatterns: [{ protocol: 'https' }],
  },

  security: {
    checkOrigin: false,
  },

  adapter: useVercel
    ? vercel({
        webAnalytics: { enabled: true },
        imageService: true,
      })
    : node({
        mode: 'standalone',
      }),
});
