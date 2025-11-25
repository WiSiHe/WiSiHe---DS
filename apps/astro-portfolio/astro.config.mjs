// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap(), react(), svelte()],
	vite: {
		optimizeDeps: {
			include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
		},
	},
});