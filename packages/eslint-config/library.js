import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import onlyWarn from 'eslint-plugin-only-warn';
import turbo from 'eslint-config-turbo';

export const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'only-warn': onlyWarn,
      turbo: turbo,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
];

export default config;
