/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@wisihe/eslint-config/react.js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    'public',
    'tailwind.config.js',
    'vite.config.ts',
  ],
};
