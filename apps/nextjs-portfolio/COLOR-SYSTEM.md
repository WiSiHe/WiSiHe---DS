# Color System Documentation

This project uses a **hybrid color system** combining **semantic tokens** (theme-aware) and **numeric scales** (fixed colors), following best practices from Tailwind CSS, shadcn/ui, and Designsystemet.

## Overview

### Two Types of Colors

1. **Semantic Colors** (Theme-Aware) ✨
   - Automatically adapt to light/dark mode
   - Use for UI components and layouts
   - Examples: `bg-background`, `text-foreground`, `border-border`

2. **Numeric Scales** (Fixed Colors) 🎨
   - Stay the same regardless of theme
   - Use for custom designs, illustrations, data visualization
   - Examples: `bg-neutral-500`, `text-accent-700`, `bg-success-200`

---

## Semantic Colors (Recommended for UI)

These colors automatically adapt when switching between light and dark mode.

### Background

Large surfaces like page backgrounds.

```tsx
<body className="bg-background">           // Main background
<div className="bg-background-subtle">     // Slightly tinted variant
```

### Surface

Elevated elements like cards and panels.

```tsx
<div className="bg-surface">               // Default surface (white in light mode)
<div className="bg-surface-subtle">        // Subtle variant
<div className="bg-surface-hover">         // Hover state
<div className="bg-surface-active">        // Active state
```

### Border

Borders and dividers.

```tsx
<div className="border-border">            // Standard border
<div className="border-border-subtle">     // Low contrast (decorative)
<div className="border-border-strong">     // High contrast
```

### Foreground

Text and icons.

```tsx
<p className="text-foreground">            // Primary text
<p className="text-foreground-subtle">     // Secondary text
<p className="text-foreground-muted">      // Tertiary text
```

### Accent (Teal)

Primary brand color for interactive elements.

```tsx
// Solid backgrounds
<button className="bg-accent text-accent-contrast">
<button className="bg-accent-hover">       // Hover state
<button className="bg-accent-active">      // Active state

// Subtle variants
<div className="bg-accent-subtle">         // Subtle background
<div className="bg-accent-surface">        // Accent-tinted surface
<div className="border-accent-border">     // Accent border
<p className="text-accent-text">           // Accent text
```

### Semantic States

```tsx
// Success (Green)
<div className="bg-success text-success-contrast">
<div className="bg-success-subtle text-success-text">

// Warning (Orange)
<div className="bg-warning text-warning-contrast">
<div className="bg-warning-subtle text-warning-text">

// Danger (Red)
<button className="bg-danger text-danger-contrast">
<div className="bg-danger-subtle text-danger-text">

// Info (Blue)
<div className="bg-info text-info-contrast">
<div className="bg-info-subtle text-info-text">
```

---

## Numeric Scales (For Custom Designs)

These colors are **fixed** and don't change with the theme. Perfect for:

- Custom illustrations
- Data visualization
- Brand-specific designs
- When you need precise color control

### Available Scales

Each scale has 11 shades from 50 (lightest) to 950 (darkest):

- `neutral-{50-950}` - Grayscale
- `accent-{50-950}` - Teal
- `success-{50-950}` - Green
- `warning-{50-950}` - Orange
- `danger-{50-950}` - Red
- `info-{50-950}` - Blue

### Usage Examples

```tsx
// Always light gray, even in dark mode
<div className="bg-neutral-100 text-neutral-900">

// Custom accent design
<div className="bg-accent-50 border-accent-200">
  <h2 className="text-accent-700">Custom Design</h2>
</div>

// Data visualization
<div className="bg-success-100 border-success-500">
  <span className="text-success-900">+15%</span>
</div>

// Mix semantic and numeric
<div className="bg-background">              {/* Theme-aware */}
  <div className="bg-neutral-50">            {/* Always light */}
    <p className="text-foreground">Text</p>  {/* Theme-aware */}
  </div>
</div>
```

---

## Complete Color Reference

### Semantic Tokens

| Token               | Light Mode   | Dark Mode    | Usage                     |
| ------------------- | ------------ | ------------ | ------------------------- |
| `background`        | Almost white | Deep dark    | Main page background      |
| `background-subtle` | Light tint   | Dark tint    | Subtle background variant |
| `surface`           | White        | Dark gray    | Cards, panels             |
| `surface-subtle`    | Off-white    | Darker gray  | Subtle surface            |
| `surface-hover`     | Light gray   | Lighter gray | Hover states              |
| `surface-active`    | Medium gray  | Even lighter | Active states             |
| `border`            | Gray         | Medium gray  | Standard borders          |
| `border-subtle`     | Light gray   | Dark gray    | Decorative borders        |
| `border-strong`     | Dark gray    | Light gray   | Prominent borders         |
| `foreground`        | Dark         | White        | Primary text              |
| `foreground-subtle` | Medium dark  | Light        | Secondary text            |
| `foreground-muted`  | Medium       | Medium light | Tertiary text             |
| `accent`            | Teal         | Bright teal  | Primary actions           |
| `accent-contrast`   | White        | Dark         | Text on accent            |
| `ring`              | Teal         | Bright teal  | Focus rings               |

### Numeric Scale Reference

```
50  - Lightest (almost white with hint of color)
100 - Very light
200 - Light
300 - Light-medium
400 - Medium-light
500 - Medium (base color)
600 - Medium-dark
700 - Dark
800 - Darker
900 - Very dark
950 - Darkest (almost black with hint of color)
```

---

## Migration Guide

### From Old System to New

| Old                     | New (Semantic)         | New (Numeric)        |
| ----------------------- | ---------------------- | -------------------- |
| `bg-color-background`   | `bg-background`        | `bg-neutral-50`      |
| `text-color-foreground` | `text-foreground`      | `text-neutral-900`   |
| `bg-color-surface`      | `bg-surface`           | `bg-neutral-50`      |
| `bg-color-primary`      | `bg-accent`            | `bg-accent-500`      |
| `text-color-on-primary` | `text-accent-contrast` | `text-neutral-50`    |
| `border-color-border`   | `border-border`        | `border-neutral-300` |

---

## Best Practices

### ✅ DO

```tsx
// Use semantic colors for UI components
<div className="bg-surface border-border">
  <h2 className="text-foreground">Title</h2>
  <p className="text-foreground-subtle">Description</p>
  <button className="bg-accent text-accent-contrast">
    Click me
  </button>
</div>

// Use numeric scales for custom designs
<div className="bg-gradient-to-r from-accent-500 to-accent-700">
  <span className="text-neutral-50">Custom gradient</span>
</div>

// Mix both when appropriate
<div className="bg-background">
  <div className="bg-neutral-100">  {/* Always light */}
    <p className="text-foreground">Theme-aware text</p>
  </div>
</div>
```

### ❌ DON'T

```tsx
// Don't use numeric scales for theme-aware UI
<div className="bg-neutral-50 text-neutral-900">  {/* Won't adapt to dark mode */}

// Don't use semantic colors for fixed designs
<div className="bg-accent">  {/* Color changes in dark mode */}
  {/* If you need a fixed teal, use bg-accent-500 */}
</div>

// Don't mix old and new naming
<div className="bg-color-background">  {/* Use bg-background instead */}
```

---

## Adding New Colors

### Add a New Semantic Token

1. Define in `:root` and `.dark`:

```css
:root {
  --highlight: oklch(85% 0.15 280);
  --highlight-contrast: oklch(12% 0.01 250);
}

.dark {
  --highlight: oklch(75% 0.18 280);
  --highlight-contrast: oklch(98% 0.002 250);
}
```

2. Map to Tailwind in `@theme inline`:

```css
@theme inline {
  --color-highlight: var(--highlight);
  --color-highlight-contrast: var(--highlight-contrast);
}
```

3. Use in components:

```tsx
<div className="bg-highlight text-highlight-contrast">
```

### Add a New Numeric Scale

1. Define in `@theme`:

```css
@theme {
  --color-purple-50: oklch(95% 0.05 280);
  --color-purple-100: oklch(90% 0.08 280);
  /* ... continue through 950 */
  --color-purple-950: oklch(20% 0.18 280);
}
```

2. Use directly:

```tsx
<div className="bg-purple-500 text-purple-50">
```

---

## Resources

- [Tailwind CSS v4 Theme Documentation](https://tailwindcss.com/docs/theme)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [Designsystemet Colors](https://designsystemet.no/no/fundamentals/design-elements/colors)
- [OKLCH Color Space](https://oklch.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)

---

## Troubleshooting

### Colors not updating in dark mode

**Semantic colors**: Check that the color is defined in both `:root` and `.dark`

**Numeric scales**: These are intentionally fixed and don't change with theme

### Need a color between two shades

Use arbitrary values with OKLCH:

```tsx
<div className="bg-[oklch(75%_0.12_180)]">
```

Or define a new semantic token if it's commonly used.
