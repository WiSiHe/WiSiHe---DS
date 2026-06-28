import fs from 'node:fs';
import path from 'node:path';
import {
  buildTokenResolutionRoot,
  flattenTokenTree,
  loadLayeredTokens,
  replaceReferencesWithCssVars,
  resolveTokenValue,
} from './lib/token-loader.js';

const { semanticDark, semanticLight } = loadLayeredTokens();
const darkColors = semanticDark.semantic?.dark ?? {};
const lightSemanticColors = semanticLight.semantic?.color ?? {};
const darkSemanticColors = darkColors.color ?? {};
const darkSizeTokens = darkColors.size ?? {};
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
    const darkTokenPath = tokenPath;
    const darkTokenNode = getNestedToken(darkSemanticColors, darkTokenPath);
    const fallback = darkTokenNode
      ? resolveTokenValue(darkTokenNode.$value, tokenRoot)
      : resolveTokenValue(token.$value, tokenRoot);

    if (typeof fallback === 'string' && fallback.startsWith('{')) {
      lines.push(`  --color-${utilityName}: var(--color-${utilityName});`);
      continue;
    }

    lines.push(`  --color-${utilityName}: var(--color-${utilityName}, ${fallback});`);
  }

  for (const { path: tokenPath, token } of flattenTokenTree(darkSizeTokens)) {
    if (token.$type !== 'borderRadius') {
      continue;
    }

    const fullKey = ['size', ...tokenPath].join('-');
    const fallback = resolveTokenValue(token.$value, tokenRoot);
    const radiusName = tokenPath[tokenPath.length - 1];
    lines.push(`  --radius-${radiusName}: var(--${fullKey}, ${fallback});`);
  }

  return [...new Set(lines)].sort((a, b) => a.localeCompare(b));
}

function getNestedToken(node, pathParts) {
  let current = node;
  for (const part of pathParts) {
    if (!current || typeof current !== 'object' || !(part in current)) {
      return null;
    }
    current = current[part];
  }

  if (current && typeof current === 'object' && Object.hasOwn(current, '$value')) {
    return current;
  }

  return null;
}

function generateDarkModeTheme() {
  let output = `/**
 * Do not edit directly, this file was auto-generated.
 * Dark theme semantic overrides generated from layered design tokens.
 */

`;

  output += createColorBlock('.dark', darkColors, [
    ['--color-accent-rgb', '244, 114, 182'],
    ['--color-foreground-rgb', '250, 250, 250'],
  ]);

  const themeInlineLines = collectThemeInlineLines();

  output += `
/* Map semantic tokens to Tailwind utilities */
/* Static fallbacks are resolved from dark semantic tokens for Tailwind v4 opacity analysis */
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
