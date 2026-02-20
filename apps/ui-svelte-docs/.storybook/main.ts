import type { StorybookConfig } from '@storybook/svelte-vite';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/svelte-vite'),
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
          '@wisihe/ui-svelte': resolve(__dirname, '../../../packages/ui-svelte/src/index.ts'),
        },
      },
    };
  },
};

export default config;
