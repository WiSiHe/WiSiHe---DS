import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig, searchForWorkspaceRoot } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
  stories: [
    `${getAbsolutePath('@wisihe/ui-react')}/src/**/*.mdx`,
    `${getAbsolutePath('@wisihe/ui-react')}/src/**/*.stories.@(js|jsx|mjs|ts|tsx)`,
    join(__dirname, '../src/**/*.mdx'),
    join(__dirname, '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'),
  ],
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('storybook-addon-tag-badges'),
    getAbsolutePath('@storybook/addon-vitest'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  async viteFinal(config) {
    const uiReactRoot = getAbsolutePath('@wisihe/ui-react');
    const workspaceRoot = searchForWorkspaceRoot(process.cwd());
    const existingAllow = config.server?.fs?.allow;
    const fsAllow = Array.isArray(existingAllow)
      ? existingAllow
      : existingAllow
        ? [existingAllow]
        : [];

    return mergeConfig(config, {
      server: {
        fs: {
          allow: [...fsAllow, workspaceRoot, uiReactRoot],
        },
      },
      optimizeDeps: {
        include: ['motion/react'],
      },
      resolve: {
        alias: [
          { find: '@/sanity/lib/api', replacement: join(__dirname, 'mocks/sanity-api.ts') },
          { find: '@/sanity/lib/utils', replacement: join(__dirname, 'mocks/sanity-utils.ts') },
          {
            find: /^@wisihe\/ui-react$/,
            replacement: join(uiReactRoot, 'src/index.tsx'),
          },
          { find: 'next/image', replacement: join(__dirname, 'mocks/next-image.tsx') },
          { find: 'next/link', replacement: join(__dirname, 'mocks/next-link.tsx') },
        ],
      },
    });
  },
};
export default config;
