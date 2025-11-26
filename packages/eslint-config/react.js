import { config as libraryConfig } from './library.js';
import globals from 'globals';

export const config = [
  ...libraryConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];

export default config;
