// eslint.config.js
import globals from 'globals'; // Provides global variables (browser, node, etc.)
import js from '@eslint/js'; // ESLint's recommended built-in rules
import eslintConfigPrettier from 'eslint-config-prettier'; // Prettier compatibility

export default [
  // 1. Global ignores (optional, but good practice)
  {
    ignores: [
      '**/node_modules/',
      '**/.turbo/',
      '**/dist/',
      '**/build/',
      '**/.next/',
      '**/storybook-static/',
      '**/sanity.types.ts',
      // Exclude packages that have their own ESLint configs
      '**/packages/ui-react/**',
      '**/packages/utils/**',
      '**/packages/tokens/**',
      '**/packages/typescript-config/**',
      '**/apps/storybook/**',
    ],
  },

  // 2. Base ESLint recommended rules
  js.configs.recommended,

  // 3. JavaScript/CommonJS configuration
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // 5. Prettier compatibility (MUST be LAST)
  eslintConfigPrettier,
];
