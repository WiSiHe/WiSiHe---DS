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

  // Add manual spacing values first (resolved from dimension calculations)
  output += `  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 32px;
  --spacing-xl: 64px;
  --spacing-multi-value: 8px 64px;
  --radius-sm: 4px;
  --radius-lg: 8px;
  --radius-xl: 16px;
  --radius-multi-value: 4px 8px;
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

  // Skip dimension, spacing, and borderRadius categories as we handle them manually
  if (category === 'dimension' || category === 'spacing' || category === 'borderRadius') {
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
      return value;
    case 'dimension':
      return value.endsWith('px') || value.endsWith('rem') || value.endsWith('em')
        ? value
        : `${value}px`;
    case 'fontSize':
      return value.endsWith('rem') ? value : `${value}rem`;
    case 'fontWeight':
      return value;
    case 'lineHeight':
      return value;
    case 'letterSpacing':
      return value.endsWith('em') ? value : `${value}em`;
    case 'borderRadius':
      return value.endsWith('px') ? value : `${value}px`;
    case 'boxShadow':
      return value;
    case 'duration':
      return value;
    case 'cubicBezier':
      return value;
    case 'spacing':
      return value.endsWith('px') || value.endsWith('rem') || value.endsWith('em')
        ? value
        : `${value}px`;
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
