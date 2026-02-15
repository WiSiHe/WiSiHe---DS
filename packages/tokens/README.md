# @wisihe/tokens

Design tokens for the WiSiHe design system, built with **Style Dictionary** and organized as:

**primitives -> semantic -> component**

This structure makes the system more robust, easier to evolve, and safer for theming.

## Architecture

Token sources live in `tokens/`:

```text
tokens/
  primitives/      # raw scales (color, spacing, typography, effects)
  semantic/light/  # role-based tokens for light mode
  semantic/dark/   # role-based overrides for dark mode
  component/       # component-level decisions (button, input, etc.)
```

### Layer rules

1. **Primitives**: raw values only (`color.neutral.500`, `spacing.md`, `borderRadius.lg`)
2. **Semantic**: aliases to primitives (`semantic.color.background -> color.neutral.50`)
3. **Component**: aliases to semantic + primitives (`component.button.variant.primary.background -> semantic.color.accent`)

## Build outputs

`pnpm build` generates:

- `dist/css/variables.css` - core token variables from Style Dictionary
- `dist/css/semantic-colors.css` - light/dark semantic variables + Tailwind semantic mappings
- `dist/tailwind/config.js` - Tailwind v3 config output
- `dist/tailwind/theme.css` - Tailwind v4 `@theme` variables
- `dist/tailwind/theme-dark.css` - dark semantic override file

## Usage

### CSS variables

```css
@import '@wisihe/tokens/css';
@import '@wisihe/tokens/css/semantic';

.button {
  background: var(--color-accent-500);
  color: var(--color-foreground);
  border-radius: var(--radius-lg);
}
```

### Tailwind v4

```css
@import 'tailwindcss';
@import '@wisihe/tokens/tailwind-v4';
@import '@wisihe/tokens/css/semantic';
```

### Dark mode

```css
@import '@wisihe/tokens/tailwind-v4-dark';
```

Dark mode is applied via `.dark` semantic variable overrides.

## Development

```bash
pnpm build
pnpm clean
pnpm lint
```

## Legacy raw export

`@wisihe/tokens/raw` still points to `tokens.json` for backwards compatibility.
