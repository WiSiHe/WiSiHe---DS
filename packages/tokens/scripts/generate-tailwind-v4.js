import fs from 'fs';
import path from 'path';

// Read the tokens.json file
const tokensPath = path.join(import.meta.dirname, '..', 'tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// Convert tokens to Tailwind v4 @theme format
function generateTailwindV4Theme(tokens) {
  let output = `/**
 * Do not edit directly, this file was auto-generated.
 * Tailwind CSS v4 theme variables generated from design tokens.
 */

@theme {
`;

  // Process each token category
  Object.entries(tokens).forEach(([category, categoryTokens]) => {
    if (typeof categoryTokens === 'object' && categoryTokens !== null) {
      output = processTokenCategory(category, categoryTokens, output);
    }
  });

  output += `}`;
  return output;
}

function processTokenCategory(category, tokens, output) {
  // Map categories to Tailwind v4 namespaces
  const namespaceMap = {
    colors: 'color',
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
    component: 'component',
  };

  const namespace = namespaceMap[category] || category;

  // Skip dimension, spacing, borderRadius, and semantic categories
  // We let Tailwind use its default spacing scale
  if (category === 'dimension' || category === 'spacing' || category === 'borderRadius' || category === 'semantic') {
    return output;
  }

  // Recursively process nested tokens
  function processTokens(obj, prefix = []) {
    Object.entries(obj).forEach(([key, value]) => {
      if (value && typeof value === 'object' && value.$value !== undefined) {
        // This is a token
        const tokenPath = [...prefix, key];
        const varName = `--${namespace}-${tokenPath.join('-')}`;
        const cssValue = formatTokenValue(value.$value, value.$type);
        output += `  ${varName}: ${cssValue};\n`;
      } else if (value && typeof value === 'object' && !value.$value) {
        // This is a nested object, continue processing
        processTokens(value, [...prefix, key]);
      }
    });
  }

  processTokens(tokens);
  return output;
}

function formatTokenValue(value, type) {
  // Handle different token types
  switch (type) {
    case 'color':
      // Preserve OKLCH colors as-is
      if (typeof value === 'string' && value.startsWith('oklch(')) {
        return value;
      }
      return value;
    case 'dimension':
      // Convert numeric values to rem (assuming pixel values: 16px = 1rem)
      if (typeof value === 'string') {
        if (value.endsWith('px')) {
          const num = parseFloat(value);
          return `${num / 16}rem`;
        }
        if (value.endsWith('rem') || value.endsWith('em')) {
          return value;
        }
        // If it's a number without unit, assume pixels and convert to rem
        const num = parseFloat(value);
        if (!isNaN(num)) {
          return `${num / 16}rem`;
        }
      }
      return value;
    case 'fontSize':
      return value.endsWith('rem') ? value : `${value}rem`;
    case 'fontWeight':
      return value;
    case 'lineHeight':
      return value;
    case 'letterSpacing':
      return value.endsWith('em') ? value : `${value}em`;
    case 'borderRadius':
      // Convert numeric values to rem (assuming pixel values: 16px = 1rem)
      if (typeof value === 'string') {
        if (value.endsWith('px')) {
          const num = parseFloat(value);
          return `${num / 16}rem`;
        }
        if (value.endsWith('rem') || value.endsWith('em')) {
          return value;
        }
        // If it's a number without unit, assume pixels and convert to rem
        const num = parseFloat(value);
        if (!isNaN(num)) {
          return `${num / 16}rem`;
        }
      }
      return value;
    case 'boxShadow':
      return value;
    case 'duration':
      return value;
    case 'cubicBezier':
      return value;
    case 'spacing':
      // Convert numeric values to rem (assuming pixel values: 16px = 1rem)
      if (typeof value === 'string') {
        if (value.endsWith('px')) {
          const num = parseFloat(value);
          return `${num / 16}rem`;
        }
        if (value.endsWith('rem') || value.endsWith('em')) {
          return value;
        }
        // If it's a number without unit, assume pixels and convert to rem
        const num = parseFloat(value);
        if (!isNaN(num)) {
          return `${num / 16}rem`;
        }
      }
      return value;
    default:
      return value;
  }
}

// Generate the theme file
const themeContent = generateTailwindV4Theme(tokens);

// Ensure the directory exists
const outputDir = path.join(import.meta.dirname, '..', 'dist', 'tailwind');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the theme file
const outputPath = path.join(outputDir, 'theme.css');
fs.writeFileSync(outputPath, themeContent);

console.log('✅ Tailwind v4 theme generated:', outputPath);
