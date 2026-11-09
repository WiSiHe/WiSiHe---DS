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

The public semantic names describe purpose: `background`, `surface`, `surface-subtle`,
`surface-elevated`, `foreground`, `foreground-subtle`, `foreground-muted`, `border`,
`border-subtle`, `border-strong`, `accent`, and the status roles `success`, `warning`,
`danger`, and `info`. Add `-hover` or `-active` for interactive fills, `-contrast`
for text on those fills, and `-text` / `-subtle` for text on tinted status surfaces.
Do not use a `-text` role as a hover background: use the matching `-hover` role.
Use `ring` for keyboard focus, not a translucent accent; pair it with the adjacent
surface or a contrasting offset. Use `danger`, `danger-hover`, `danger-subtle`,
and `danger-text` for error fields and messages so they adapt to both themes.
`border` and `border-subtle` are decorative; use `border-strong` where a control
boundary is necessary to identify the control.

`surface-elevated` is neutral; `surface-subtle` is the existing tinted surface.
The accent intentionally resolves to electric blue in light mode and vivid pink in dark mode.
Light mode uses a cool pale gray background; dark mode uses purple-tinted charcoal
for its background, surface, and elevated surface.

Light mode uses the rounded radius scale; dark mode uses square corners for `sm`
through `3xl`. `full` remains round in both themes for avatars, switches, and pills.
Keep ordinary surfaces flat. Use `shadow-floating` with `surface-elevated` for
floating menus and dialogs. `shadow-glow` is a restrained accent glow in dark
mode and has no visible effect in light mode; reserve it for occasional decorative
highlights, not focus or state indication.
Warm and cool accents have their own `accent-warm[-hover|-contrast]` and
`accent-cool[-hover|-contrast]` pairings; do not combine their primitive scales
with theme-dependent `foreground` without checking contrast.

The older `background-default`, `surface-default`, `text-default`, `text-subtle`,
and `base-*` names remain available for compatibility but are deprecated for new
consumer code. Prefer `background`, `surface`, `foreground`, `foreground-subtle`,
and the matching `accent*` names. The nested `scale` roles are the internal source
of semantic decisions, not the preferred consumer API. Legacy `*-rgb` variables
remain available and are derived from the theme tokens; prefer using the semantic
color with Tailwind opacity modifiers or CSS `color-mix()` for new code.

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
