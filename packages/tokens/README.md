# @wisihe/tokens

Design tokens package for the WiSiHe Design System. This package uses Style Dictionary to generate design tokens from Figma (via Tokens Studio) and export them to multiple formats including CSS variables and Tailwind CSS configuration.

## Features

- 🎨 **Figma Integration**: Tokens Studio for Figma as the single source of truth
- 🔄 **Style Dictionary v5**: Industry-standard tool for design token management
- 📦 **Multiple Output Formats**: CSS variables and Tailwind config
- 🌙 **Dark Mode Support**: Separate dark theme generation
- 🚀 **Automated Build**: One-command build from tokens.json to all outputs

## Installation

```bash
pnpm add @wisihe/tokens
```

## Usage

### CSS Variables

```css
/* Import the generated CSS variables */
@import '@wisihe/tokens/css';

/* Use the variables in your CSS */
.button {
  background-color: var(--color-primary-500);
  padding: var(--size-spacing-md);
  border-radius: var(--size-border-radius-md);
}
```

### Tailwind CSS v3

```javascript
// tailwind.config.js
import tokens from '@wisihe/tokens/tailwind';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      ...tokens.theme.extend,
    },
  },
};
```

### Tailwind CSS v4

```css
/* app.css */
@import 'tailwindcss';
@import '@wisihe/tokens/tailwind-v4';

/* Your custom styles */
.button {
  @apply bg-color-primary-500 text-white px-spacing-md py-spacing-sm;
}
```

Or use the theme variables directly:

```css
/* app.css */
@import 'tailwindcss';
@import '@wisihe/tokens/tailwind-v4';

.custom-button {
  background-color: var(--color-primary-500);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}
```

### Dark Mode

```css
/* Import both light and dark themes */
@import 'tailwindcss';
@import '@wisihe/tokens/tailwind-v4';
@import '@wisihe/tokens/tailwind-v4-dark';

/* Dark mode will automatically apply when .dark class is present */
```

### Raw Tokens

You can access the raw `tokens.json` file directly:

```javascript
import tokens from '@wisihe/tokens/raw';

console.log(tokens.core.colors.primary['500'].$value); // "#3b82f6"
```

## Token Structure

The package includes the following token categories:

### Colors

- Primary colors (50-900 scale)
- Secondary colors (50-900 scale)
- Neutral colors (white, black, gray scale)

### Spacing

- Consistent spacing scale (xs, sm, md, lg, xl, 2xl, 3xl)
- Border radius values

### Typography

- Font families (sans, mono)
- Font sizes (xs to 4xl)
- Font weights (light to bold)
- Line heights (tight, normal, relaxed)

### Effects

- Box shadows (sm, md, lg, xl, 2xl, inner, none)

## Development

### Building Tokens

```bash
# Build all token outputs
pnpm build

# Clean build directory
pnpm clean
```

### Workflow

1. **Design in Figma**: Update your design tokens in Tokens Studio
2. **Export**: Download `tokens.json` from Tokens Studio and replace the existing one
3. **Build**: Run `pnpm build` to generate all outputs
4. **Use**: Import the generated files in your projects

### Token Format

The package expects tokens in the Tokens Studio format:

```json
{
  "core": {
    "dimension": {
      "xs": {
        "$value": "4rem",
        "$type": "dimension"
      }
    },
    "colors": {
      "primary": {
        "500": {
          "$value": "#3b82f6",
          "$type": "color"
        }
      }
    }
  }
}
```

## Output Formats

- **CSS Variables**: `dist/css/variables.css`
- **Tailwind v3 Config**: `dist/tailwind/config.js`
- **Tailwind v4 Theme**: `dist/tailwind/theme.css`
- **Tailwind v4 Dark Theme**: `dist/tailwind/theme-dark.css`

## Contributing

When adding new tokens:

1. Follow the existing naming conventions
2. Include proper descriptions
3. Test all output formats
4. Update documentation as needed
