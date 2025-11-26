import storybook from 'eslint-plugin-storybook';
import { config as reactConfig } from './react.js';

export const config = [
  ...reactConfig,
  ...storybook.configs['recommended'],
  {
    files: ['**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
];

export default config;
