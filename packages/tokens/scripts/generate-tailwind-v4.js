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
  borderRadius: 'borderRadius',
  shadows: 'shadow',
  opacity: 'opacity',
  zIndex: 'z-index',
  breakpoints: 'breakpoint',
  animation: 'animation',
  dimension: 'dimension',
  semantic: 'color',
  component: 'component',
};

// Keep Tailwind's built-in sizing scale untouched.
// We only export design-system values that don't replace core sizing utilities.
const excludedSizingCategories = new Set([
  'spacing',
  'fontSizes',
  'lineHeights',
  'letterSpacing',
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
      const joinedPath = tokenPath.join('-');
      let variableName = joinedPath.startsWith(`${namespace}-`)
        ? `--${joinedPath}`
        : `--${namespace}-${joinedPath}`;
      
      const rawValue = token.$value;
      const cssValue = replaceReferencesWithCssVars(rawValue);
      
      let finalValue = cssValue;

      // For semantic colors, we map the public utility (e.g., --color-accent) 
      // to the private runtime value (e.g., --color-accent-val) wrapped in color-mix().
      // This ensures Tailwind sees it as a color (for opacity) while allowing runtime switching.
      if (variableName.startsWith('--color-') && category === 'semantic' && token.$type === 'color') {
         finalValue = `color-mix(in srgb, var(${variableName}-val), transparent 0%)`;
      }
      
      lines.push(`  ${variableName}: ${finalValue};`);

      // Alias semantic radius tokens to standard --radius-* variables
      // This ensures utility classes like rounded-sm use the dynamic semantic value
      if (category === 'semantic' && token.$type === 'borderRadius') {
        const leafName = tokenPath[tokenPath.length - 1];
        // Override the primitive definition (e.g., --radius-sm)
        lines.push(`  --radius-${leafName}: var(--${joinedPath}-val);`);
      }
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
