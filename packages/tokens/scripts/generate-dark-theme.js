import fs from 'fs';
import path from 'path';
import {
  flattenTokenTree,
  loadLayeredTokens,
  replaceReferencesWithCssVars,
} from './lib/token-loader.js';

const { semanticDark } = loadLayeredTokens();
const darkColors = semanticDark.semantic?.dark?.color ?? {};

function generateDarkModeTheme() {
  const sortedEntries = flattenTokenTree(darkColors)
    .map(({ path: tokenPath, token }) => [tokenPath.join('-'), token])
    .sort(([a], [b]) => String(a).localeCompare(String(b)));

  let output = `/**
 * Do not edit directly, this file was auto-generated.
 * Dark theme semantic overrides generated from layered design tokens.
 */

.dark {
`;

  for (const [key, token] of sortedEntries) {
    if (!token || token.$value === undefined) {
      continue;
    }

    const cssValue = replaceReferencesWithCssVars(token.$value);
    output += `  --${key}: ${cssValue};\n`;
  }

  output += `  --color-accent-rgb: 244, 114, 182;
  --color-foreground-rgb: 250, 250, 250;
}

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
