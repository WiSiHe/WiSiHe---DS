---
name: wisihe-tokens
description: Work with the @wisihe/tokens design token pipeline — Style Dictionary, layered JSON sources, Tailwind v4 theme output, and dark mode. Use when editing tokens, theme CSS, semantic colors, or token build scripts.
---

# @wisihe/tokens

## Source layout

```text
packages/tokens/tokens/
  primitives/         # Raw scales — edit hex/spacing here
  semantic/light/     # Light role aliases
  semantic/dark/      # Dark role overrides
  component/          # Button, input, etc.
```

**Layer rules:** primitives → semantic → component. Never reference component tokens from primitives.

## Build

```bash
pnpm --filter @wisihe/tokens build
pnpm --filter @wisihe/tokens clean
```

Pipeline:

1. Style Dictionary → `dist/css/variables.css`
2. `scripts/build-tailwind-themes.js` → theme CSS + `tokens.json`

**Never edit `dist/` or committed `tokens.json` by hand** — both are generated.

## Outputs

| Export | File | Purpose |
|--------|------|---------|
| `@wisihe/tokens/css` | `dist/css/variables.css` | Primitive CSS variables |
| `@wisihe/tokens/css/semantic` | `dist/css/semantic-colors.css` | `-val` vars on `:root` / `:root.dark` |
| `@wisihe/tokens/tailwind-v4` | `dist/tailwind/theme.css` | Tailwind v4 `@theme` |
| `@wisihe/tokens/tailwind-v4-dark` | `dist/tailwind/theme-dark.css` | `.dark` + `@theme inline` fallbacks |
| `@wisihe/tokens/raw` | `tokens.json` | Flat merged export (generated) |

## Tailwind v4 app import recipe

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@import "@wisihe/tokens/tailwind-v4";
@import "@wisihe/tokens/css";
@import "@wisihe/tokens/css/semantic";
@import "@wisihe/tokens/tailwind-v4-dark";
```

CSS-only apps (no Tailwind): import `css` + `css/semantic` only.

## Dark mode model

- **Runtime switching:** `semantic-colors.css` sets `--color-*-val` on `:root` and `:root.dark`
- **Tailwind utilities:** `theme.css` maps public `--color-*` via `color-mix(in srgb, var(--color-*-val), transparent 0%)`
- **Opacity modifiers:** `theme-dark.css` provides resolved hex fallbacks in `@theme inline`

next-themes must use `attribute="class"` so `.dark` matches the token selectors.

## Semantic utilities (prefer these)

- `bg-background`, `bg-surface`, `bg-surface-hover`
- `text-foreground`, `text-foreground-subtle`, `text-foreground-muted`
- `border-border`, `border-border-subtle`, `border-border-strong`
- `bg-accent`, `text-accent-contrast`, `bg-danger`, etc.

Avoid hardcoded palette classes (`bg-neutral-900`) for theme-aware UI.

## Naming canon (WiSiHe-native)

| Use | Do not use |
|-----|------------|
| `text-foreground-muted` | `text-muted-foreground` |
| `bg-surface` | `bg-card` |
| `bg-surface-subtle` | `bg-muted` |
| `hover:bg-surface-hover` | `hover:bg-muted` |
| `bg-accent`, `text-accent-contrast` | `bg-primary`, `text-primary-foreground` |
| `bg-danger`, `text-danger-contrast` | `bg-destructive` |

## Scripts

| Script | Role |
|--------|------|
| `style-dictionary.config.js` | SD platform config (CSS variables only) |
| `scripts/generate-tailwind-v4.js` | `@theme` from primitives + light semantic + component |
| `scripts/generate-semantic-colors.js` | `:root` / `:root.dark` `-val` variables |
| `scripts/generate-dark-theme.js` | `.dark` block + generated `@theme inline` |
| `scripts/lib/token-loader.js` | Load layers, resolve refs, flatten trees |
| `scripts/debug-tokens.js` | Ad-hoc inspection (manual) |

## Release

`@wisihe/tokens` is published via Changesets. Bump version when changing exports or token semantics.
