/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@wisihe/eslint-config/storybook.js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
  ignorePatterns: ['dist', 'node_modules', 'public', 'vite.config.ts'],
};
