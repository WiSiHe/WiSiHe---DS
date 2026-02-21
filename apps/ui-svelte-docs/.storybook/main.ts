import type { StorybookConfig } from '@storybook/svelte-vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx|svelte)'],
  addons: ['@chromatic-com/storybook', '@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/svelte-vite',
    options: {
      docgen: false,
    },
  },
  async viteFinal(baseConfig) {
    const existingAliases =
      baseConfig.resolve?.alias && !Array.isArray(baseConfig.resolve.alias)
        ? baseConfig.resolve.alias
        : {};

    return {
      ...baseConfig,
      plugins: [...(baseConfig.plugins ?? []), svelte()],
      resolve: {
        ...(baseConfig.resolve ?? {}),
        alias: {
          ...existingAliases,
          '@wisihe/ui-svelte': resolve(__dirname, '../../../packages/ui-svelte/src/index.ts'),
        },
      },
    };
  },
};

export default config;
