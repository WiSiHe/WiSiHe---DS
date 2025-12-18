import fs from 'fs';
import path from 'path';

// Read the tokens.json file
const tokensPath = path.join(import.meta.dirname, '..', 'tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// Generate semantic colors CSS
function generateSemanticColors() {
  const semantic = tokens.colors?.semantic;
  if (!semantic) {
    console.warn('⚠️  No semantic colors found in tokens.json');
    return '';
  }

  let output = `/**
 * Do not edit directly, this file was auto-generated.
 * Semantic color system (theme-aware) generated from design tokens.
 * These colors change between light/dark mode.
 */

/* Light mode semantic colors */
:root {
`;

  // Generate light mode colors
  if (semantic.light) {
    Object.entries(semantic.light).forEach(([key, token]) => {
      if (token && token.$value) {
        const varName = `--${key.replace(/-/g, '-')}`;
        output += `  ${varName}: ${token.$value};\n`;
      }
    });
  }

  output += `}

/* Dark mode semantic colors */
.dark {
`;

  // Generate dark mode colors
  if (semantic.dark) {
    Object.entries(semantic.dark).forEach(([key, token]) => {
      if (token && token.$value) {
        const varName = `--${key.replace(/-/g, '-')}`;
        output += `  ${varName}: ${token.$value};\n`;
      }
    });
  }

  output += `}

/* Map to Tailwind utilities */
@theme inline {
  /* Semantic colors (theme-aware) */
  --color-background: var(--background);
  --color-background-subtle: var(--background-subtle);

  --color-surface: var(--surface);
  --color-surface-subtle: var(--surface-subtle);
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

  --color-info: var(--info);
  --color-info-contrast: var(--info-contrast);
  --color-info-subtle: var(--info-subtle);
  --color-info-text: var(--info-text);

  --color-ring: var(--ring);

  /* Legacy aliases (for backward compatibility) */
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

  /* Old custom names */
  --color-text-primary: var(--foreground);
  --color-text-secondary: var(--foreground-subtle);
  --color-text-tertiary: var(--foreground-muted);
  --color-on-primary: var(--accent-contrast);
  --color-on-surface: var(--foreground);
  --color-surface-elevated: var(--surface-hover);
}
`;

  return output;
}

// Generate the semantic colors CSS
const semanticColorsContent = generateSemanticColors();

// Ensure the directory exists
const outputDir = path.join(import.meta.dirname, '..', 'dist', 'css');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the semantic colors file
const outputPath = path.join(outputDir, 'semantic-colors.css');
fs.writeFileSync(outputPath, semanticColorsContent);

console.log('✅ Semantic colors generated:', outputPath);

