import { writeDarkTheme } from './generate-dark-theme.js';
import { writeSemanticColors } from './generate-semantic-colors.js';
import { writeTailwindV4Theme } from './generate-tailwind-v4.js';
import { writeTokensJson } from './generate-tokens-json.js';

const outputs = [
  writeTailwindV4Theme(),
  writeDarkTheme(),
  writeSemanticColors(),
  writeTokensJson(),
];

console.log(`@wisihe/tokens: wrote ${outputs.length} outputs`);
