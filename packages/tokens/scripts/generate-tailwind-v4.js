import fs from 'fs';
import path from 'path';
import {
  flattenTokenTree,
  loadLayeredTokens,
  replaceReferencesWithCssVars,
} from './lib/token-loader.js';

const { primitives, semanticLight, component } = loadLayeredTokens();

const namespaceMap = {
  color: 'color',
  spacing: 'spacing',
  fontSizes: 'text',
  fontWeights: 'font-weight',
  lineHeights: 'leading',
  letterSpacing: 'tracking',
  borderRadius: 'radius',
  shadows: 'shadow',
  opacity: 'opacity',
  zIndex: 'z-index',
  breakpoints: 'breakpoint',
  animation: 'animation',
  dimension: 'dimension',
  semantic: 'semantic',
  component: 'component',
};

// Keep Tailwind's built-in sizing scale untouched.
// We only export design-system values that don't replace core sizing utilities.
const excludedSizingCategories = new Set([
  'spacing',
  'fontSizes',
  'lineHeights',
  'letterSpacing',
  'borderRadius',
  'breakpoints',
  'dimension',
]);

function collectThemeVariables(tokenTree) {
  const lines = [];

  for (const [category, categoryTokens] of Object.entries(tokenTree)) {
    if (excludedSizingCategories.has(category)) {
      continue;
    }

    if (!categoryTokens || typeof categoryTokens !== 'object') {
      continue;
    }

    const namespace = namespaceMap[category] ?? category;
    const flattenedTokens = flattenTokenTree(categoryTokens);

    for (const { path: tokenPath, token } of flattenedTokens) {
      const variableName = `--${namespace}-${tokenPath.join('-')}`;
      const rawValue = token.$value;
      const cssValue = replaceReferencesWithCssVars(rawValue);
      lines.push(`  ${variableName}: ${cssValue};`);
    }
  }

  return lines;
}

function generateTailwindV4Theme() {
  const allLines = [
    ...collectThemeVariables(primitives),
    ...collectThemeVariables(semanticLight),
    ...collectThemeVariables(component),
  ];

  const dedupedLines = [...new Set(allLines)].sort((a, b) => a.localeCompare(b));

  return `/**
 * Do not edit directly, this file was auto-generated.
 * Tailwind CSS v4 theme variables generated from layered design tokens.
 */

@theme {
${dedupedLines.join('\n')}
}
`;
}

const themeContent = generateTailwindV4Theme();
const outputDir = path.join(import.meta.dirname, '..', 'dist', 'tailwind');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'theme.css');
fs.writeFileSync(outputPath, themeContent);

console.log('✅ Tailwind v4 theme generated:', outputPath);
