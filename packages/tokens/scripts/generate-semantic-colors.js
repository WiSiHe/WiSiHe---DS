import fs from 'fs';
import path from 'path';
import {
  flattenTokenTree,
  loadLayeredTokens,
  replaceReferencesWithCssVars,
} from './lib/token-loader.js';

const { semanticLight, semanticDark } = loadLayeredTokens();

function getSemanticColors() {
  const lightColors = semanticLight.semantic?.color ?? {};
  const darkColors = semanticDark.semantic?.dark?.color ?? {};
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
    output += `  --${key}: ${cssValue};\n`;
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
    ['--color-accent-rgb', '13, 148, 136'],
    ['--color-foreground-rgb', '31, 31, 31'],
  ]);

  output += `
/* Dark mode semantic colors */
`;

  output += createColorBlock('.dark', darkColors, [
    ['--color-accent-rgb', '244, 114, 182'],
    ['--color-foreground-rgb', '250, 250, 250'],
  ]);

  output += `
/* Map semantic tokens to Tailwind utilities */
@theme inline {
  --color-background: var(--background);
  --color-background-subtle: var(--background-subtle);
  --color-background-default: var(--background-default);
  --color-background-tinted: var(--background-tinted);

  --color-surface: var(--surface);
  --color-surface-subtle: var(--surface-subtle);
  --color-surface-default: var(--surface-default);
  --color-surface-tinted: var(--surface-tinted);
  --color-surface-hover: var(--surface-hover);
  --color-surface-active: var(--surface-active);

  --color-border: var(--border);
  --color-border-subtle: var(--border-subtle);
  --color-border-strong: var(--border-strong);

  --color-foreground: var(--foreground);
  --color-foreground-subtle: var(--foreground-subtle);
  --color-foreground-muted: var(--foreground-muted);

  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-accent-active: var(--accent-active);
  --color-accent-subtle: var(--accent-subtle);
  --color-accent-contrast: var(--accent-contrast);
  --color-accent-surface: var(--accent-surface);
  --color-accent-border: var(--accent-border);
  --color-accent-text: var(--accent-text);

  --color-success: var(--success);
  --color-success-contrast: var(--success-contrast);
  --color-success-subtle: var(--success-subtle);
  --color-success-text: var(--success-text);

  --color-warning: var(--warning);
  --color-warning-contrast: var(--warning-contrast);
  --color-warning-subtle: var(--warning-subtle);
  --color-warning-text: var(--warning-text);

  --color-danger: var(--danger);
  --color-danger-contrast: var(--danger-contrast);
  --color-danger-subtle: var(--danger-subtle);
  --color-danger-text: var(--danger-text);

  --color-error: var(--danger);
  --color-error-contrast: var(--danger-contrast);
  --color-error-subtle: var(--danger-subtle);
  --color-error-text: var(--danger-text);

  --color-info: var(--info);
  --color-info-contrast: var(--info-contrast);
  --color-info-subtle: var(--info-subtle);
  --color-info-text: var(--info-text);

  --color-ring: var(--ring);

  /* Semantic solid aliases */
  --color-base: var(--base-default);
  --color-base-hover: var(--base-hover);
  --color-base-active: var(--base-active);
  --color-base-contrast: var(--base-contrast-default);

  /* Legacy aliases */
  --color-primary: var(--accent);
  --color-primary-foreground: var(--accent-contrast);
  --color-secondary: var(--surface-hover);
  --color-secondary-foreground: var(--foreground);
  --color-muted: var(--surface-subtle);
  --color-muted-foreground: var(--foreground-muted);
  --color-card: var(--surface);
  --color-card-foreground: var(--foreground);
  --color-popover: var(--surface);
  --color-popover-foreground: var(--foreground);
  --color-input: var(--border);
  --color-destructive: var(--danger);
  --color-destructive-foreground: var(--danger-contrast);

  /* Backward compatibility aliases */
  --color-on-primary: var(--accent-contrast);
  --color-on-surface: var(--foreground);
  --color-surface-elevated: var(--surface-hover);
}
`;

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

