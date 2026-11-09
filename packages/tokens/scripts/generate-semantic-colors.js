import fs from 'node:fs';
import path from 'node:path';
import {
  flattenTokenTree,
  loadLayeredTokens,
  replaceReferencesWithCssVars,
  resolveRgbChannels,
} from './lib/token-loader.js';

const { semanticLight, semanticDark } = loadLayeredTokens();

function getSemanticColors() {
  const lightColors = semanticLight.semantic ?? {};
  const darkColors = semanticDark.semantic?.dark ?? {};
  return { lightColors, darkColors };
}

function createColorBlock(selector, colors, extraVariables = []) {
  const entries = flattenTokenTree(colors)
    .map(({ path: tokenPath, token }) => [tokenPath.join('-'), token])
    .sort(([a], [b]) => String(a).localeCompare(String(b)));

  let output = `${selector} {\n`;
  for (const [key, token] of entries) {
    if (!token || token.$value === undefined) {
      continue;
    }

    const cssValue = replaceReferencesWithCssVars(token.$value);
    output += `  --${key}-val: ${cssValue};\n`;
  }

  for (const [name, value] of extraVariables) {
    output += `  ${name}: ${value};\n`;
  }

  output += `}\n`;
  return output;
}

function generateSemanticColors() {
  const { lightColors, darkColors } = getSemanticColors();

  let output = `/**
 * Do not edit directly, this file was auto-generated.
 * Semantic color system (theme-aware) generated from layered design tokens.
 */

/* Light mode semantic colors */
`;

  output += createColorBlock(':root', lightColors, [
    ['--color-accent-rgb-val', resolveRgbChannels('{semantic.color.accent}')],
    ['--color-foreground-rgb-val', resolveRgbChannels('{semantic.color.foreground}')],
    ['--color-accent-rgb', 'var(--color-accent-rgb-val)'],
    ['--color-foreground-rgb', 'var(--color-foreground-rgb-val)'],
  ]);

  output += `
/* Dark mode semantic colors */
`;

  output += createColorBlock(':root.dark', darkColors, [
    ['--color-accent-rgb-val', resolveRgbChannels('{semantic.dark.color.accent}')],
    ['--color-foreground-rgb-val', resolveRgbChannels('{semantic.dark.color.foreground}')],
  ]);

  // Output only standard CSS variables for runtime switching
  // The @theme definition is handled by generate-tailwind-v4.js

  return output;
}

export function writeSemanticColors() {
  const semanticColorsContent = generateSemanticColors();
  const outputDir = path.join(import.meta.dirname, '..', 'dist', 'css');
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, 'semantic-colors.css');
  fs.writeFileSync(outputPath, semanticColorsContent);
  return outputPath;
}
