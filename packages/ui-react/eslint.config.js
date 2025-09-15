import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    rules: {
      // React-specific rules
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'react/prop-types': 'off', // Using TypeScript for prop validation
    },
  },
]);
