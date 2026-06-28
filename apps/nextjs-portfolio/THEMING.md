# Theming System

This app uses **`@wisihe/tokens`** with **Tailwind CSS v4** and **next-themes** (`attribute="class"` on `<html>`).

Canonical docs: [`packages/tokens/README.md`](../../packages/tokens/README.md)

## CSS setup (`globals.css`)

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@import "@wisihe/tokens/tailwind-v4";
@import "@wisihe/tokens/css";
@import "@wisihe/tokens/css/semantic";
@import "@wisihe/tokens/tailwind-v4-dark";
```

### Why each import

| Import | Role |
|--------|------|
| `tailwind-v4` | Tailwind `@theme` utilities (`bg-accent`, `text-foreground`, …) |
| `css` | Primitive CSS variables from Style Dictionary |
| `css/semantic` | Runtime `-val` variables on `:root` / `:root.dark` |
| `tailwind-v4-dark` | `.dark` overrides + `@theme inline` fallbacks for opacity modifiers |

### Class-based dark mode

`@custom-variant dark` wires Tailwind `dark:*` utilities to the `.dark` class from next-themes (not `prefers-color-scheme` alone).

Prefer semantic utilities that adapt automatically:

```tsx
<div className="bg-surface text-foreground border-border" />
```

Use `dark:*` only when you need an explicit light/dark split outside the token system (e.g. `dark:prose-invert`).

## Theme provider

`app/providers.tsx` uses next-themes with `attribute="class"` and `enableSystem`. No extra setup required.

## Editing tokens

1. Change JSON under `packages/tokens/tokens/`
2. Run `pnpm --filter @wisihe/tokens build`
3. Never edit `packages/tokens/dist/` directly

## Troubleshooting

| Issue | Check |
|-------|-------|
| Colors don't switch with theme toggle | `css/semantic` imported? `.dark` on `<html>`? |
| `dark:*` ignores toggle | `@custom-variant dark` in CSS entry? |
| Opacity modifiers broken on semantic colors | `tailwind-v4-dark` imported? Rebuild tokens. |
| Stale values after edit | Run token build; restart dev server |

See also: [`COLOR-SYSTEM.md`](./COLOR-SYSTEM.md)
