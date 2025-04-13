// eslint.config.js
import globals from "globals"; // Provides global variables (browser, node, etc.)
import js from "@eslint/js"; // ESLint's recommended built-in rules
import tsParser from "@typescript-eslint/parser"; // TypeScript parser
import tsPlugin from "@typescript-eslint/eslint-plugin"; // TypeScript plugin
import eslintConfigPrettier from "eslint-config-prettier"; // Prettier compatibility

export default [
  // 1. Global ignores (optional, but good practice)
  {
    ignores: [
      "**/node_modules/",
      "**/.turbo/",
      "**/dist/", // Add other build/output directories
      // Add other files/dirs to ignore globally
    ],
  },

  // 2. Base ESLint recommended rules
  js.configs.recommended,

  // 3. TypeScript configuration
  {
    files: ["**/*.{ts,tsx,mts,cts}"], // Target TypeScript/TSX files
    languageOptions: {
      parser: tsParser, // Use the TS parser
      parserOptions: {
        project: true, // Enable type-aware linting - requires tsconfig.json at root or discovery
        tsconfigRootDir: import.meta.dirname, // Helps ESLint find tsconfig.json relative to eslint.config.js
      },
      globals: {
        ...globals.browser, // Assuming browser environment, use globals.node for Node.js
        // Add any other specific globals your project uses
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin, // Enable the TS plugin
    },
    rules: {
      // Apply recommended rules from the TS plugin
      ...tsPlugin.configs["recommended-type-checked"].rules, // Or 'recommended' if not using type-aware linting
      // --- Add/override specific TS rules here ---
      // e.g., "@typescript-eslint/no-unused-vars": "warn",
    },
  },

  // 4. JavaScript/CommonJS configuration (optional, if you have JS files too)
  {
    files: ["**/*.{js,jsx,mjs,cjs}"], // Target JS/JSX files
    languageOptions: {
      globals: {
        ...globals.browser, // Or globals.node
      },
    },
    rules: {
      // --- Add/override specific JS rules here ---
    },
  },

  // 5. Prettier compatibility (MUST be LAST)
  // Disables ESLint formatting rules that conflict with Prettier
  eslintConfigPrettier,
];
