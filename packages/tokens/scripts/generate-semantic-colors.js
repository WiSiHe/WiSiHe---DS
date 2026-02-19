import fs from 'fs';
import path from 'path';
import {
  flattenTokenTree,
  loadLayeredTokens,
  replaceReferencesWithCssVars,
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
    ['--color-accent-rgb-val', '219, 0, 109'], // Neon Pink 600
    ['--color-foreground-rgb-val', '23, 23, 23'], // Neutral 900
  ]);

  output += `
/* Dark mode semantic colors */
`;

  output += createColorBlock(':root.dark', darkColors, [
    ['--color-accent-rgb-val', '244, 114, 182'], // Neon Pink 400
    ['--color-foreground-rgb-val', '250, 250, 250'], // Neutral 50
  ]);

  // Output only standard CSS variables for runtime switching
  // The @theme definition is handled by generate-tailwind-v4.js
  
  return output;
}

const semanticColorsContent = generateSemanticColors();
const outputDir = path.join(import.meta.dirname, '..', 'dist', 'css');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'semantic-colors.css');
fs.writeFileSync(outputPath, semanticColorsContent);

console.log('✅ Semantic colors generated:', outputPath);

