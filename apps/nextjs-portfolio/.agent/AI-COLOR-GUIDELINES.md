# AI Color Usage Guidelines

## Quick Decision Tree

When writing code for this project, follow this decision tree to choose the right color:

```
Is this a UI component (button, card, text, border)?
├─ YES → Use SEMANTIC colors (bg-background, text-foreground, etc.)
│
└─ NO → Is this a custom design, illustration, or data viz?
   ├─ YES → Use NUMERIC scales (bg-neutral-500, text-accent-700, etc.)
   │
   └─ NO → Default to SEMANTIC colors
```

---

## Rules for AI Code Generation

### Rule 1: Default to Semantic Colors

**Always start with semantic colors** for UI components. They're theme-aware and maintain consistency.

```tsx
// ✅ CORRECT - Semantic colors
<div className="bg-surface border-border">
  <h2 className="text-foreground">Title</h2>
  <p className="text-foreground-subtle">Description</p>
  <button className="bg-accent text-accent-contrast hover:bg-accent-hover">
    Click me
  </button>
</div>

// ❌ WRONG - Don't use numeric scales for standard UI
<div className="bg-neutral-50 border-neutral-300">
  <h2 className="text-neutral-900">Title</h2>
  <button className="bg-accent-500 text-neutral-50">
    Click me
  </button>
</div>
```

### Rule 2: Component-Specific Color Patterns

#### Buttons

```tsx
// Primary button
<button className="bg-accent text-accent-contrast hover:bg-accent-hover active:bg-accent-active">

// Secondary button
<button className="bg-surface-hover text-foreground hover:bg-surface-active border-border">

// Danger button
<button className="bg-danger text-danger-contrast hover:bg-danger-hover">

// Ghost button
<button className="text-foreground hover:bg-surface-hover">
```

#### Cards & Panels

```tsx
// Standard card
<div className="bg-surface border-border">

// Elevated card
<div className="bg-surface-hover border-border-subtle">

// Accent card
<div className="bg-accent-subtle border-accent-border">
```

#### Text Hierarchy

```tsx
// Primary text (headings, important content)
<h1 className="text-foreground">

// Secondary text (descriptions, labels)
<p className="text-foreground-subtle">

// Tertiary text (captions, metadata)
<span className="text-foreground-muted">

// Accent text (links, highlights)
<a className="text-accent-text hover:text-accent">
```

#### Borders & Dividers

```tsx
// Standard border
<div className="border-border">

// Subtle border (decorative)
<div className="border-border-subtle">

// Strong border (emphasis)
<div className="border-border-strong">

// Accent border
<div className="border-accent-border">
```

#### Backgrounds

```tsx
// Page background
<body className="bg-background">

// Section background (subtle variation)
<section className="bg-background-subtle">

// Card/panel background
<div className="bg-surface">

// Hover state background
<div className="hover:bg-surface-hover">
```

### Rule 3: Semantic States

```tsx
// Success message
<div className="bg-success text-success-contrast">
  ✓ Success!
</div>

// Subtle success (less prominent)
<div className="bg-success-subtle text-success-text">
  Operation completed
</div>

// Warning message
<div className="bg-warning text-warning-contrast">
  ⚠ Warning!
</div>

// Error message
<div className="bg-danger text-danger-contrast">
  ✗ Error occurred
</div>

// Info message
<div className="bg-info text-info-contrast">
  ℹ Information
</div>
```

### Rule 4: When to Use Numeric Scales

Use numeric scales ONLY for:

1. **Custom illustrations or graphics**

```tsx
<svg className="text-accent-500">
  <circle fill="currentColor" />
</svg>
```

2. **Data visualization**

```tsx
<div className="bg-success-100 border-success-500">
  <span className="text-success-900">+15%</span>
</div>
```

3. **Brand-specific designs that shouldn't change with theme**

```tsx
<div className="bg-gradient-to-r from-accent-500 to-accent-700">
  <span className="text-neutral-50">Fixed gradient</span>
</div>
```

4. **When you need precise control between semantic shades**

```tsx
<div className="bg-neutral-100">
  {' '}
  {/* Specific shade needed */}
  <p className="text-foreground">Theme-aware text</p>
</div>
```

### Rule 5: Interactive States

Always use the semantic hover/active variants:

```tsx
// ✅ CORRECT
<button className="bg-accent hover:bg-accent-hover active:bg-accent-active">

<div className="bg-surface hover:bg-surface-hover">

// ❌ WRONG - Don't manually darken/lighten
<button className="bg-accent hover:bg-accent-600">  {/* Wrong! */}
```

### Rule 6: Focus States

Always use the `ring` color for focus states:

```tsx
<input className="border-border focus:border-ring focus:ring-2 focus:ring-ring">

<button className="focus-visible:ring-2 focus-visible:ring-ring">
```

### Rule 7: Never Use These Patterns

```tsx
// ❌ WRONG - Old variable syntax
<div className="bg-[var(--color-background)]">

// ❌ WRONG - Mixing old and new
<div className="bg-color-surface">

// ❌ WRONG - Hardcoded colors
<div className="bg-white text-black">

// ❌ WRONG - Arbitrary values for semantic colors
<div className="bg-[#ffffff]">

// ✅ CORRECT - Use semantic tokens
<div className="bg-surface text-foreground">
```

---

## Common Patterns Cheat Sheet

### Layout Components

```tsx
// Page wrapper
<div className="bg-background text-foreground min-h-screen">

// Container with border
<div className="bg-surface border-border rounded-lg p-6">

// Section divider
<hr className="border-border-subtle" />
```

### Form Elements

```tsx
// Input field
<input className="bg-surface border-border text-foreground focus:border-ring focus:ring-2 focus:ring-ring" />

// Label
<label className="text-foreground-subtle text-sm font-medium">

// Helper text
<p className="text-foreground-muted text-xs">

// Error message
<p className="text-danger-text text-sm">
```

### Navigation

```tsx
// Nav link (inactive)
<a className="text-foreground-subtle hover:text-foreground hover:bg-surface-hover">

// Nav link (active)
<a className="text-accent bg-accent-subtle">

// Nav background
<nav className="bg-surface border-b border-border">
```

### Modals & Overlays

```tsx
// Backdrop
<div className="bg-neutral-950/50">  {/* One of few cases for numeric */}

// Modal
<div className="bg-surface border-border shadow-lg">

// Modal header
<div className="border-b border-border-subtle">
```

---

## Migration from Old Code

When updating existing code, replace:

| Old Pattern                 | New Pattern              |
| --------------------------- | ------------------------ |
| `bg-color-background`       | `bg-background`          |
| `text-color-foreground`     | `text-foreground`        |
| `bg-color-surface`          | `bg-surface`             |
| `bg-color-primary`          | `bg-accent`              |
| `text-color-on-primary`     | `text-accent-contrast`   |
| `bg-color-muted`            | `bg-surface-subtle`      |
| `text-color-text-primary`   | `text-foreground`        |
| `text-color-text-secondary` | `text-foreground-subtle` |
| `border-color-border`       | `border-border`          |

---

## Quick Reference Table

| Use Case         | Color Class                        |
| ---------------- | ---------------------------------- |
| Page background  | `bg-background`                    |
| Card background  | `bg-surface`                       |
| Primary text     | `text-foreground`                  |
| Secondary text   | `text-foreground-subtle`           |
| Muted text       | `text-foreground-muted`            |
| Border           | `border-border`                    |
| Primary button   | `bg-accent text-accent-contrast`   |
| Secondary button | `bg-surface-hover text-foreground` |
| Danger button    | `bg-danger text-danger-contrast`   |
| Link text        | `text-accent-text`                 |
| Success message  | `bg-success text-success-contrast` |
| Warning message  | `bg-warning text-warning-contrast` |
| Error message    | `bg-danger text-danger-contrast`   |
| Info message     | `bg-info text-info-contrast`       |
| Focus ring       | `ring-ring`                        |
| Hover background | `hover:bg-surface-hover`           |

---

## Examples by Component Type

### Hero Section

```tsx
<section className="bg-background">
  <h1 className="text-foreground">Welcome</h1>
  <p className="text-foreground-subtle">Subtitle</p>
  <button className="bg-accent text-accent-contrast hover:bg-accent-hover">Get Started</button>
</section>
```

### Feature Card

```tsx
<div className="bg-surface border-border rounded-lg p-6">
  <h3 className="text-foreground">Feature Title</h3>
  <p className="text-foreground-subtle">Description</p>
  <a className="text-accent-text hover:text-accent">Learn more →</a>
</div>
```

### Alert/Notification

```tsx
<div className="bg-success-subtle border-success-border border-l-4 p-4">
  <p className="text-success-text font-medium">Success!</p>
  <p className="text-foreground-subtle text-sm">Operation completed</p>
</div>
```

### Data Table

```tsx
<table className="bg-surface">
  <thead className="bg-surface-subtle border-b border-border">
    <th className="text-foreground-subtle">Header</th>
  </thead>
  <tbody>
    <tr className="hover:bg-surface-hover border-b border-border-subtle">
      <td className="text-foreground">Data</td>
    </tr>
  </tbody>
</table>
```

---

## Remember

1. **Semantic first** - Use semantic colors for 95% of UI components
2. **Theme-aware** - Semantic colors automatically adapt to light/dark mode
3. **Consistent** - Follow the patterns above for consistency
4. **Accessible** - All color combinations meet WCAG contrast requirements
5. **Maintainable** - Semantic names make code easier to understand and update

When in doubt, use semantic colors!
