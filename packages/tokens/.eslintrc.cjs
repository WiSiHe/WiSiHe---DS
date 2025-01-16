// Importing the Config type from eslint
/** @type {import("eslint").Linter.Config} */

// Exporting the ESLint configuration
module.exports = {
  // Specifying that this configuration file is the root configuration
  // ESLint stops looking in parent folders once it finds a configuration with "root": true
  root: true,

  // Extending the configuration from the @tine/eslint-config/react.js file
  extends: ['@tine/eslint-config/react.js'],

  parserOptions: {
    // Specifying the root directory for the TypeScript configuration
    // This is necessary because the TypeScript ESLint parser needs to know the location of your tsconfig.json file
    tsconfigRootDir: __dirname,

    // Specifying the TypeScript configuration file to use
    project: 'tsconfig.json',
  },

  // Specifying the files or directories to ignore
  // ESLint will not report errors or warnings for these files
  ignorePatterns: ['dist', 'node_modules', 'public', 'tailwind.config.js', 'vite.config.ts'],
};
