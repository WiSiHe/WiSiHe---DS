# Theming System Documentation

This project uses a modern, best-practice theming approach combining **Tailwind CSS v4**, **next-themes**, and **shadcn/ui** conventions.

## Overview

Our theming system provides:

- ✅ **Automatic dark mode** without `dark:` prefix spam
- ✅ **SSR-safe** theme switching with next-themes
- ✅ **System preference** detection
- ✅ **Semantic color naming** following shadcn/ui conventions
- ✅ **OKLCH color space** for perceptual uniformity
- ✅ **Type-safe** theme management

## Architecture

### 1. Color Definition (`globals.css`)

Colors are defined in three layers:

#### Layer 1: Base Variables (`:root` and `.dark`)

```css
:root {
  --background: oklch(98% 0.002 250);
  --foreground: oklch(12% 0.01 250);
  --primary: oklch(25% 0.02 250);
  --primary-foreground: oklch(98% 0.002 250);
  /* ... */
}

.dark {
  --background: oklch(8% 0.005 250);
  --foreground: oklch(98% 0.002 250);
  /* ... */
}
```

#### Layer 2: Tailwind Mapping (`@theme inline`)

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* ... */
}
```

#### Layer 3: Custom Dark Mode Variant

```css
@custom-variant dark (&:where(.dark, .dark *));
```

This eliminates the need for `dark:` prefixes in your components!

### 2. Theme Provider (`providers.tsx`)

Uses `next-themes` for robust theme management:

```tsx
<NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
  {children}
</NextThemesProvider>
```

## Usage

### Using Theme Colors

#### ✅ Recommended: Semantic Colors

```tsx
// Background and foreground
<div className="bg-background text-foreground">

// Primary actions
<button className="bg-primary text-primary-foreground">

// Cards and surfaces
<div className="bg-card text-card-foreground">

// Muted/disabled states
<div className="bg-muted text-muted-foreground">

// Accents
<div className="bg-accent text-accent-foreground">
```

#### ✅ With Custom Dark Mode Variant

Thanks to `@custom-variant dark`, you can write:

```tsx
// This automatically adapts to dark mode!
<div className="bg-primary">
```

Instead of:

```tsx
// ❌ Old way - no longer needed!
<div className="bg-primary dark:bg-primary-dark">
```

### Accessing Theme State

```tsx
import { useTheme } from '@/app/providers';

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current: {resolvedTheme}
    </button>
  );
}
```

## Available Colors

### Core Semantic Colors

| Color                                | Purpose                             | Example Usage                            |
| ------------------------------------ | ----------------------------------- | ---------------------------------------- |
| `background` / `foreground`          | Page background and primary text    | `bg-background text-foreground`          |
| `primary` / `primary-foreground`     | Primary actions and CTAs            | `bg-primary text-primary-foreground`     |
| `secondary` / `secondary-foreground` | Secondary actions                   | `bg-secondary text-secondary-foreground` |
| `accent` / `accent-foreground`       | Highlights and interactive elements | `bg-accent text-accent-foreground`       |
| `muted` / `muted-foreground`         | Subtle backgrounds, disabled states | `bg-muted text-muted-foreground`         |

### Surface Colors

| Color                            | Purpose                   |
| -------------------------------- | ------------------------- |
| `card` / `card-foreground`       | Card components           |
| `popover` / `popover-foreground` | Popover/dropdown surfaces |

### UI Elements

| Color    | Purpose              |
| -------- | -------------------- |
| `border` | Borders and dividers |
| `input`  | Input field borders  |
| `ring`   | Focus rings          |

### Semantic States

| Color                                    | Purpose                   |
| ---------------------------------------- | ------------------------- |
| `success` / `success-foreground`         | Success states            |
| `warning` / `warning-foreground`         | Warning states            |
| `destructive` / `destructive-foreground` | Error/destructive actions |

### Additional Accents

| Color         | Purpose                |
| ------------- | ---------------------- |
| `accent-warm` | Warm orange highlights |
| `accent-cool` | Cool purple accents    |

## Adding New Colors

To add a new color to the theme:

1. **Define in `:root` and `.dark`**:

```css
:root {
  --info: oklch(70% 0.15 240);
  --info-foreground: oklch(12% 0.01 250);
}

.dark {
  --info: oklch(80% 0.18 240);
  --info-foreground: oklch(8% 0.005 250);
}
```

2. **Map to Tailwind in `@theme inline`**:

```css
@theme inline {
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
}
```

3. **Use in components**:

```tsx
<div className="bg-info text-info-foreground">Info message</div>
```

## Best Practices

### ✅ DO

- Use semantic color names (`bg-primary`, `bg-accent`)
- Follow the `background`/`foreground` naming pattern
- Use OKLCH color space for new colors
- Test colors in both light and dark modes
- Ensure sufficient contrast for accessibility

### ❌ DON'T

- Use `dark:` prefixes (the custom variant handles this)
- Define colors directly in components
- Use hex colors for theme-aware elements
- Skip the `-foreground` variant for colored backgrounds

## Migration from Old System

If you have existing code using the old color system:

| Old                                         | New               |
| ------------------------------------------- | ----------------- |
| `bg-color-background`                       | `bg-background`   |
| `text-color-foreground`                     | `text-foreground` |
| `bg-color-primary`                          | `bg-primary`      |
| `bg-color-accent dark:bg-color-accent-dark` | `bg-accent`       |
| `border-color-border`                       | `border-border`   |

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [OKLCH Color Space](https://oklch.com/)

## Troubleshooting

### Theme flashing on page load

This is handled by `next-themes` automatically. Ensure `disableTransitionOnChange` is set in the provider.

### Colors not updating in dark mode

1. Check that the color is defined in both `:root` and `.dark`
2. Verify the `@theme inline` mapping exists
3. Ensure you're using the Tailwind class name (e.g., `bg-primary`, not `bg-color-primary`)

### CSS warnings about `@custom-variant` or `@theme`

These are expected - they're Tailwind v4 specific directives that CSS linters don't recognize yet. They work correctly at runtime.
