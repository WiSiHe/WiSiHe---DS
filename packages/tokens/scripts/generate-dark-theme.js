import fs from 'node:fs';
import path from 'node:path';
import {
  buildTokenResolutionRoot,
  flattenTokenTree,
  loadLayeredTokens,
  replaceReferencesWithCssVars,
  resolveRgbChannels,
  resolveTokenValue,
} from './lib/token-loader.js';

const { semanticDark, semanticLight } = loadLayeredTokens();
const darkColors = semanticDark.semantic?.dark ?? {};
const lightSemanticColors = semanticLight.semantic?.color ?? {};
const lightSizeRadius = semanticLight.semantic?.size?.radius ?? {};
const lightShadows = semanticLight.semantic?.shadow ?? {};
const _darkSemanticColors = darkColors.color ?? {};
const _darkSizeTokens = darkColors.size ?? {};
const tokenRoot = buildTokenResolutionRoot();

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

function isPublicSemanticColor(pathParts) {
  return pathParts[0] !== 'scale' && !pathParts.includes('scale');
}

function collectThemeInlineLines() {
  const lines = [];

  for (const { path: tokenPath, token } of flattenTokenTree(lightSemanticColors)) {
    if (token.$type !== 'color' || !isPublicSemanticColor(tokenPath)) {
      continue;
    }

    const utilityName = tokenPath.join('-');
    // Light fallbacks: @theme inline uses `var(--token, fallback)` for Tailwind opacity
    // analysis. In light mode that fallback is what renders; `.dark` overrides at runtime.
    const fallback = resolveTokenValue(token.$value, tokenRoot);

    if (typeof fallback === 'string' && fallback.startsWith('{')) {
      lines.push(`  --color-${utilityName}: var(--color-${utilityName});`);
      continue;
    }

    lines.push(`  --color-${utilityName}: var(--color-${utilityName}, ${fallback});`);
  }

  for (const { path: tokenPath, token } of flattenTokenTree({ radius: lightSizeRadius })) {
    if (token.$type !== 'borderRadius') {
      continue;
    }

    const radiusName = tokenPath[tokenPath.length - 1];
    const varName = `size-radius-${radiusName}-val`;
    // Light fallbacks in @theme inline — same pattern as semantic colors.
    // .dark overrides --size-radius-*-val at runtime via semantic-colors.css.
    const fallback = resolveTokenValue(token.$value, tokenRoot);

    if (typeof fallback === 'string' && fallback.startsWith('{')) {
      lines.push(`  --radius-${radiusName}: var(--${varName});`);
      continue;
    }

    lines.push(`  --radius-${radiusName}: var(--${varName}, ${fallback});`);
  }

  for (const { path: tokenPath, token } of flattenTokenTree(lightShadows)) {
    if (token.$type === 'boxShadow') {
      const name = tokenPath.join('-');
      lines.push(`  --shadow-${name}: var(--shadow-${name}-val);`);
    }
  }

  return [...new Set(lines)].sort((a, b) => a.localeCompare(b));
}

function generateDarkModeTheme() {
  let output = `/**
 * Do not edit directly, this file was auto-generated.
 * Dark theme semantic overrides generated from layered design tokens.
 */

`;

  output += createColorBlock('.dark', darkColors, [
    ['--color-accent-rgb', resolveRgbChannels('{semantic.dark.color.accent}', tokenRoot)],
    ['--color-foreground-rgb', resolveRgbChannels('{semantic.dark.color.foreground}', tokenRoot)],
  ]);

  const themeInlineLines = collectThemeInlineLines();

  output += `
/* Map semantic tokens to Tailwind utilities */
/* Static fallbacks use light semantic tokens; .dark overrides at runtime */
@theme inline {
${themeInlineLines.join('\n')}
}
`;

  return output;
}

export function writeDarkTheme() {
  const darkThemeContent = generateDarkModeTheme();
  const outputDir = path.join(import.meta.dirname, '..', 'dist', 'tailwind');
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, 'theme-dark.css');
  fs.writeFileSync(outputPath, darkThemeContent);
  return outputPath;
}
