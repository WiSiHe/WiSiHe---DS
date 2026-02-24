import fs from 'node:fs';
import path from 'node:path';
import {
  flattenTokenTree,
  loadLayeredTokens,
  replaceReferencesWithCssVars,
} from './lib/token-loader.js';

const { semanticDark } = loadLayeredTokens();
const darkColors = semanticDark.semantic?.dark ?? {};

function createColorBlock(selector, colors, additionalVars = []) {
  const sortedEntries = flattenTokenTree(colors)
    .map(({ path: tokenPath, token }) => [tokenPath.join('-'), token])
    .sort(([a], [b]) => String(a).localeCompare(String(b)));

  let blockOutput = `${selector} {\n`;

  for (const [key, token] of sortedEntries) {
    if (!token || token.$value === undefined) {
      continue;
    }
    const cssValue = replaceReferencesWithCssVars(token.$value);
    blockOutput += `  --${key}: ${cssValue};\n`;
  }

  for (const [key, value] of additionalVars) {
    blockOutput += `  ${key}: ${value};\n`;
  }

  blockOutput += `}\n`;
  return blockOutput;
}

function generateDarkModeTheme() {
  let output = `/**
 * Do not edit directly, this file was auto-generated.
 * Dark theme semantic overrides generated from layered design tokens.
 */

`;

  output += createColorBlock('.dark', darkColors, [
    ['--color-accent-rgb', '244, 114, 182'], // Neon Pink 400
    ['--color-foreground-rgb', '250, 250, 250'], // Neutral 50
  ]);

  output += `
/* Map semantic tokens to Tailwind utilities */
/* Providing static fallbacks helps Tailwind v4's analyzer detect these as colors for opacity modifiers */
@theme inline {
  --color-background: var(--color-background, #0a0a0a);
  --color-background-subtle: var(--color-background-subtle, #171717);
  --color-background-default: var(--color-background-default, #0a0a0a);
  --color-background-tinted: var(--color-background-tinted, #022c22);

  --color-surface: var(--color-surface, #0a0a0a);
  --color-surface-subtle: var(--color-surface-subtle, #0a0a0a);
  --color-surface-default: var(--color-surface-default, #0a0a0a);
  --color-surface-tinted: var(--color-surface-tinted, #022c22);
  --color-surface-hover: var(--color-surface-hover, #171717);
  --color-surface-active: var(--color-surface-active, #262626);

  --color-border: var(--color-border, #404040);
  --color-border-subtle: var(--color-border-subtle, #262626);
  --color-border-strong: var(--color-border-strong, #737373);

  --color-foreground: var(--color-foreground, #fafafa);
  --color-foreground-subtle: var(--color-foreground-subtle, #d4d4d4);
  --color-foreground-muted: var(--color-foreground-muted, #a3a3a3);

  --color-accent: var(--color-accent, #f472b6);
  --color-accent-hover: var(--color-accent-hover, #f9a8d4);
  --color-accent-active: var(--color-accent-active);
  --color-accent-subtle: var(--color-accent-subtle);
  --color-accent-contrast: var(--color-accent-contrast, #0a0a0a);
  --color-accent-surface: var(--color-accent-surface);
  --color-accent-border: var(--color-accent-border);
  --color-accent-text: var(--color-accent-text);

  --color-success: var(--color-success, #34d399);
  --color-success-contrast: var(--color-success-contrast, #0a0a0a);
  --color-success-subtle: var(--color-success-subtle);
  --color-success-text: var(--color-success-text);

  --color-warning: var(--color-warning, #fbbf24);
  --color-warning-contrast: var(--color-warning-contrast, #0a0a0a);
  --color-warning-subtle: var(--color-warning-subtle);
  --color-warning-text: var(--color-warning-text);

  --color-danger: var(--color-danger, #f87171);
  --color-danger-contrast: var(--color-danger-contrast, #0a0a0a);
  --color-danger-subtle: var(--color-danger-subtle);
  --color-danger-text: var(--color-danger-text);

  --color-info: var(--color-info, #60a5fa);
  --color-info-contrast: var(--color-info-contrast, #0a0a0a);
  --color-info-subtle: var(--color-info-subtle);
  --color-info-text: var(--color-info-text);

  --color-ring: var(--color-ring, #f472b6);

  --radius-sm: var(--size-radius-sm, 0px);
  --radius-lg: var(--size-radius-lg, 0px);
  --radius-xl: var(--size-radius-xl, 0px);
  --radius-full: var(--size-radius-full, 0px);
}
`;

  return output;
}

const darkThemeContent = generateDarkModeTheme();
const outputDir = path.join(import.meta.dirname, '..', 'dist', 'tailwind');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'theme-dark.css');
fs.writeFileSync(outputPath, darkThemeContent);

console.log('✅ Dark mode theme generated:', outputPath);
