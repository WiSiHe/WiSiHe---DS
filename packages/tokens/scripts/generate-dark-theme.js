import fs from 'fs';
import path from 'path';

// OKLCH to Hex conversion function
function oklchToHex(oklchString) {
  const match = oklchString.match(/oklch\((\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\)/);
  if (!match) return oklchString;

  const [, l, c, h] = match.map(Number);
  const lNorm = l / 100;
  const cNorm = c / 100;
  const hRad = (h * Math.PI) / 180;

  const a = cNorm * Math.cos(hRad);
  const b = cNorm * Math.sin(hRad);

  const r = Math.max(0, Math.min(1, lNorm + 0.3963377774 * a + 0.2158037573 * b));
  const g = Math.max(0, Math.min(1, lNorm - 0.1055613458 * a - 0.0638541728 * b));
  const blue = Math.max(0, Math.min(1, lNorm - 0.0894841775 * a - 1.291485548 * b));

  const toHex = n =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(blue)}`;
}

// Dark mode colors from your globals.css
const darkModeColors = {
  // Primary colors - more contrast
  'primary-50': 'oklch(95% 0.005 250)',
  'primary-100': 'oklch(90% 0.008 250)',
  'primary-200': 'oklch(85% 0.012 250)',
  'primary-300': 'oklch(80% 0.015 250)',
  'primary-400': 'oklch(95% 0.005 250)',
  'primary-500': 'oklch(90% 0.008 250)',
  'primary-600': 'oklch(80% 0.012 250)',
  'primary-700': 'oklch(70% 0.015 250)',
  'primary-800': 'oklch(60% 0.018 250)',
  'primary-900': 'oklch(50% 0.020 250)',

  // Secondary colors - enhanced contrast
  'secondary-50': 'oklch(90% 0.005 250)',
  'secondary-100': 'oklch(85% 0.008 250)',
  'secondary-200': 'oklch(80% 0.012 250)',
  'secondary-300': 'oklch(75% 0.015 250)',
  'secondary-400': 'oklch(85% 0.005 250)',
  'secondary-500': 'oklch(75% 0.008 250)',
  'secondary-600': 'oklch(65% 0.012 250)',
  'secondary-700': 'oklch(55% 0.015 250)',
  'secondary-800': 'oklch(45% 0.018 250)',
  'secondary-900': 'oklch(35% 0.020 250)',

  // Accent colors - more vibrant for dark mode
  'accent-50': 'oklch(95% 0.15 180)',
  'accent-100': 'oklch(90% 0.18 180)',
  'accent-200': 'oklch(85% 0.20 180)',
  'accent-300': 'oklch(80% 0.22 180)',
  'accent-400': 'oklch(90% 0.15 180)',
  'accent-500': 'oklch(80% 0.18 180)',
  'accent-600': 'oklch(70% 0.22 180)',
  'accent-700': 'oklch(60% 0.25 180)',
  'accent-800': 'oklch(50% 0.28 180)',
  'accent-900': 'oklch(40% 0.30 180)',

  // Accent warm - more vibrant
  'accent-warm-50': 'oklch(95% 0.15 60)',
  'accent-warm-100': 'oklch(90% 0.18 60)',
  'accent-warm-200': 'oklch(85% 0.20 60)',
  'accent-warm-300': 'oklch(80% 0.22 60)',
  'accent-warm-400': 'oklch(90% 0.15 60)',
  'accent-warm-500': 'oklch(85% 0.15 60)',
  'accent-warm-600': 'oklch(75% 0.18 60)',
  'accent-warm-700': 'oklch(65% 0.20 60)',
  'accent-warm-800': 'oklch(55% 0.22 60)',
  'accent-warm-900': 'oklch(45% 0.25 60)',

  // Accent cool - more vibrant
  'accent-cool-50': 'oklch(90% 0.12 280)',
  'accent-cool-100': 'oklch(85% 0.15 280)',
  'accent-cool-200': 'oklch(80% 0.18 280)',
  'accent-cool-300': 'oklch(75% 0.20 280)',
  'accent-cool-400': 'oklch(85% 0.12 280)',
  'accent-cool-500': 'oklch(75% 0.12 280)',
  'accent-cool-600': 'oklch(65% 0.15 280)',
  'accent-cool-700': 'oklch(55% 0.18 280)',
  'accent-cool-800': 'oklch(45% 0.20 280)',
  'accent-cool-900': 'oklch(35% 0.22 280)',

  // Accent success - more vibrant
  'accent-success-50': 'oklch(95% 0.15 140)',
  'accent-success-100': 'oklch(90% 0.18 140)',
  'accent-success-200': 'oklch(85% 0.20 140)',
  'accent-success-300': 'oklch(80% 0.22 140)',
  'accent-success-400': 'oklch(90% 0.15 140)',
  'accent-success-500': 'oklch(80% 0.15 140)',
  'accent-success-600': 'oklch(70% 0.18 140)',
  'accent-success-700': 'oklch(60% 0.20 140)',
  'accent-success-800': 'oklch(50% 0.22 140)',
  'accent-success-900': 'oklch(40% 0.25 140)',

  // Success colors - enhanced
  'success-50': 'oklch(95% 0.12 140)',
  'success-100': 'oklch(90% 0.15 140)',
  'success-200': 'oklch(85% 0.18 140)',
  'success-300': 'oklch(80% 0.20 140)',
  'success-400': 'oklch(90% 0.12 140)',
  'success-500': 'oklch(80% 0.12 140)',
  'success-600': 'oklch(70% 0.15 140)',
  'success-700': 'oklch(60% 0.18 140)',
  'success-800': 'oklch(50% 0.20 140)',
  'success-900': 'oklch(40% 0.22 140)',

  // Warning colors - enhanced
  'warning-50': 'oklch(95% 0.15 60)',
  'warning-100': 'oklch(90% 0.18 60)',
  'warning-200': 'oklch(85% 0.20 60)',
  'warning-300': 'oklch(80% 0.22 60)',
  'warning-400': 'oklch(90% 0.15 60)',
  'warning-500': 'oklch(85% 0.15 60)',
  'warning-600': 'oklch(75% 0.18 60)',
  'warning-700': 'oklch(65% 0.20 60)',
  'warning-800': 'oklch(55% 0.22 60)',
  'warning-900': 'oklch(45% 0.25 60)',

  // Error colors - enhanced
  'error-50': 'oklch(95% 0.18 25)',
  'error-100': 'oklch(90% 0.20 25)',
  'error-200': 'oklch(85% 0.22 25)',
  'error-300': 'oklch(80% 0.25 25)',
  'error-400': 'oklch(90% 0.18 25)',
  'error-500': 'oklch(80% 0.18 25)',
  'error-600': 'oklch(70% 0.20 25)',
  'error-700': 'oklch(60% 0.22 25)',
  'error-800': 'oklch(50% 0.25 25)',
  'error-900': 'oklch(40% 0.28 25)',

  // Surface colors
  'surface-background': 'oklch(8% 0.005 250)',
  'surface-foreground': 'oklch(98% 0.002 250)',
  'surface-pure': 'oklch(12% 0.008 250)',
  'surface-elevated': 'oklch(16% 0.012 250)',

  // Border colors
  'border-default': 'oklch(25% 0.015 250)',
  'border-focus': 'oklch(75% 0.18 180)',

  // Text colors
  'text-primary': 'oklch(98% 0.002 250)',
  'text-secondary': 'oklch(85% 0.008 250)',
  'text-tertiary': 'oklch(70% 0.012 250)',

  // Neutral colors for dark mode
  'neutral-50': 'oklch(95% 0.005 250)',
  'neutral-100': 'oklch(90% 0.008 250)',
  'neutral-200': 'oklch(85% 0.012 250)',
  'neutral-300': 'oklch(80% 0.015 250)',
  'neutral-400': 'oklch(70% 0.018 250)',
  'neutral-500': 'oklch(60% 0.020 250)',
  'neutral-600': 'oklch(50% 0.022 250)',
  'neutral-700': 'oklch(40% 0.025 250)',
  'neutral-800': 'oklch(30% 0.028 250)',
  'neutral-900': 'oklch(20% 0.030 250)',
};

// Convert OKLCH to hex
const darkModeHexColors = {};
Object.entries(darkModeColors).forEach(([key, oklch]) => {
  darkModeHexColors[key] = oklchToHex(oklch);
});

// Generate dark mode theme CSS
function generateDarkModeTheme() {
  let output = `/**
 * Do not edit directly, this file was auto-generated.
 * Dark mode theme variables generated from your custom OKLCH colors.
 */

@theme {
  /* Dark Mode Colors - Enhanced contrast and vibrancy */
`;

  // Add spacing and other non-color tokens (same as light mode)
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

  // Add dark mode colors
  Object.entries(darkModeHexColors).forEach(([key, hex]) => {
    const varName = `--color-${key}`;
    output += `  ${varName}: ${hex};\n`;
  });

  // Add other tokens (typography, etc.)
  output += `
  /* Typography */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --font-weight-thin: 100;
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0em;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  --shadow-none: 0 0 #0000;
  --opacity-0: 0;
  --opacity-5: 0.05;
  --opacity-10: 0.1;
  --opacity-20: 0.2;
  --opacity-25: 0.25;
  --opacity-30: 0.3;
  --opacity-40: 0.4;
  --opacity-50: 0.5;
  --opacity-60: 0.6;
  --opacity-70: 0.7;
  --opacity-75: 0.75;
  --opacity-80: 0.8;
  --opacity-90: 0.9;
  --opacity-95: 0.95;
  --opacity-100: 1;
  --z-index-0: 0;
  --z-index-10: 10;
  --z-index-20: 20;
  --z-index-30: 30;
  --z-index-40: 40;
  --z-index-50: 50;
  --z-index-auto: auto;
`;

  output += `}`;
  return output;
}

// Generate the dark mode theme
const darkThemeContent = generateDarkModeTheme();

// Ensure the directory exists
const outputDir = path.join(import.meta.dirname, '..', 'dist', 'tailwind');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the dark mode theme file
const outputPath = path.join(outputDir, 'theme-dark.css');
fs.writeFileSync(outputPath, darkThemeContent);

console.log('✅ Dark mode theme generated:', outputPath);
console.log('🎨 Dark mode colors converted from OKLCH to hex');
console.log('🌙 Enhanced contrast and vibrancy for dark mode');
