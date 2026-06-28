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

### Semantic naming model

Semantic colors follow Designsystemet-style semantics:

- **Scale**: `neutral`, `accent`, `success`, `warning`, `danger`, `info`, `brand-1..3`
- **Group**: `background`, `surface`, `border`, `text`, `base`
- **Variant**: `default`, `tinted`, `hover`, `active`, `contrast-*`

Example: `semantic.color.scale.accent.base.hover`

For developer experience in Tailwind, these are exposed through clean aliases such as:

- `bg-background`, `bg-surface`, `bg-surface-hover`
- `text-foreground`, `text-foreground-subtle`
- `border-border`, `border-border-strong`
- `bg-accent`, `text-accent-contrast`

### Naming canon (Tailwind utilities)

Use WiSiHe-native names only. Do **not** use shadcn aliases — they are not exported.

| Use | Do not use |
|-----|------------|
| `text-foreground-muted` | `text-muted-foreground` |
| `bg-surface` | `bg-card` |
| `bg-surface-subtle` | `bg-muted` |
| `hover:bg-surface-hover` | `hover:bg-muted` |
| `bg-accent` | `bg-primary` |
| `text-danger` | `text-destructive` |

## Build outputs

`pnpm build` generates:

- `dist/css/variables.css` - core token variables from Style Dictionary
- `dist/css/semantic-colors.css` - light/dark semantic variables for runtime theme switching
- `dist/tailwind/theme.css` - Tailwind v4 `@theme` variables
- `dist/tailwind/theme-dark.css` - `.dark` overrides + `@theme inline` fallbacks
- `tokens.json` - flat merged export (generated from layered sources)

## Usage

### Tailwind v4 apps (canonical)

Use this full block in your CSS entry (`globals.css`, `index.css`, etc.):

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@import "@wisihe/tokens/tailwind-v4";
@import "@wisihe/tokens/css";
@import "@wisihe/tokens/css/semantic";
@import "@wisihe/tokens/tailwind-v4-dark";
```

- `@custom-variant dark` — class-based dark mode (next-themes, Storybook, etc.)
- Prefer semantic utilities (`bg-surface`, `text-foreground`) over `dark:` prefixes

### CSS variables only (no Tailwind)

```css
@import "@wisihe/tokens/css";
@import "@wisihe/tokens/css/semantic";
```

### Primitive CSS variables

```css
@import "@wisihe/tokens/css";
@import "@wisihe/tokens/css/semantic";

.button {
  background: var(--color-accent);
  color: var(--color-foreground);
  border-radius: var(--radius-lg);
}
```

## Development

```bash
pnpm build   # from packages/tokens, or: pnpm --filter @wisihe/tokens build
pnpm clean
```

Token-consuming apps run `predev` / `prestorybook` hooks to rebuild tokens before dev.

## Raw export

`@wisihe/tokens/raw` points to generated `tokens.json` (merged primitives + semantic + component). Do not edit by hand.
