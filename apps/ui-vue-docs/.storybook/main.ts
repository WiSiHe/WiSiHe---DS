import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/vue3-vite';
import vue from '@vitejs/plugin-vue';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    'storybook-addon-tag-badges',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  async viteFinal(baseConfig) {
    const existingAliases =
      baseConfig.resolve?.alias && !Array.isArray(baseConfig.resolve.alias)
        ? baseConfig.resolve.alias
        : {};

    return {
      ...baseConfig,
      plugins: [...(baseConfig.plugins ?? []), vue()],
      resolve: {
        ...(baseConfig.resolve ?? {}),
        alias: {
          ...existingAliases,
          '@wisihe/ui-vue': resolve(__dirname, '../../../packages/ui-vue/src/index.ts'),
        },
      },
    };
  },
};

export default config;
