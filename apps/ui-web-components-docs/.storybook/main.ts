import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/web-components-vite';

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
    name: '@storybook/web-components-vite',
    options: {},
  },
  async viteFinal(baseConfig) {
    const existingAliases =
      baseConfig.resolve?.alias && !Array.isArray(baseConfig.resolve.alias)
        ? baseConfig.resolve.alias
        : {};

    return {
      ...baseConfig,
      resolve: {
        ...(baseConfig.resolve ?? {}),
        alias: {
          ...existingAliases,
          '@wisihe/ui-web-components': resolve(
            __dirname,
            '../../../packages/ui-web-components/src/index.ts',
          ),
        },
      },
    };
  },
};

export default config;
