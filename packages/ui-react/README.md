# @wisihe/ui-react

A React component library built with Tailwind CSS and design tokens from `@wisihe/tokens`.

## Features

- 🎨 **Design System Integration**: Uses design tokens from `@wisihe/tokens` for consistent theming
- 🎯 **TypeScript Support**: Fully typed components with excellent IDE support
- 🎭 **Variant-based Styling**: Built with `class-variance-authority` for flexible component variants
- 🧩 **Composable Components**: Compound component patterns for complex UI elements
- 🎨 **Tailwind CSS**: Leverages Tailwind for utility-first styling
- 📦 **Tree-shakeable**: Only import what you need

## Installation

```bash
pnpm add @wisihe/ui-react @wisihe/tokens @wisihe/utils
```

## Setup

### 1. Configure Tailwind

Add the Tailwind configuration to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    // your app's content paths
    './src/**/*.{js,ts,jsx,tsx}',
    // include the ui-react package
    './node_modules/@wisihe/ui-react/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Your existing theme extensions
    },
  },
  plugins: [],
};
```

### 3. Import Design Tokens

Make sure to import the design tokens CSS in your app:

```css
@import '@wisihe/tokens/css';
```

## Components

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@wisihe/ui-react';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>
<Button variant="destructive">Delete</Button>
<Button variant="success">Success</Button>

// With sizes
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>

// With icons
<Button Icon={PlusIcon} iconPosition="left">
  Add Item
</Button>

// Loading state
<Button isLoading>Loading...</Button>
```

### Card

A flexible card component with compound sub-components.

```tsx
import { Card } from '@wisihe/ui-react';

<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description goes here</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Card content goes here</p>
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>

// With variants
<Card variant="elevated">Elevated card</Card>
<Card variant="outlined">Outlined card</Card>
<Card variant="filled">Filled card</Card>
```

### Badge

A small status indicator component.

```tsx
import { Badge } from '@wisihe/ui-react';

<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="accent">Accent</Badge>
<Badge variant="outline">Outline</Badge>
```

### Spinner

A loading spinner component.

```tsx
import { Spinner } from '@wisihe/ui-react';

<Spinner />
<Spinner size="large" color="accent" />
```

## Design Tokens

This package uses design tokens from `@wisihe/tokens` for:

- **Colors**: Primary, secondary, accent, success, warning, error, and neutral color palettes
- **Spacing**: Consistent spacing scale
- **Typography**: Font sizes, weights, line heights, and letter spacing
- **Shadows**: Elevation and depth
- **Border Radius**: Consistent corner rounding
- **Animations**: Duration and easing functions

## TypeScript

All components are fully typed with TypeScript. You'll get excellent autocomplete and type safety when using these components.

```tsx
import { Button, type ButtonProps } from '@wisihe/ui-react';

const MyButton: React.FC<ButtonProps> = props => {
  return <Button {...props} />;
};
```

## Source Code

This package exports its uncompiled TypeScript source code. If you prefer to compile the components yourself (e.g., for debugging or optimization), you can configure your bundler to resolve the `source` field in `package.json`.

For example, in a Vite project, you might not need extra configuration if it supports `source` field resolution, or you can alias the package to `src/index.tsx`.

## Development Guidelines

To maintain consistency and scalability across the `@wisihe/ui-react` package, please adhere to the following structural and architectural guidelines when creating or modifying components.

### 1. Folder Structure & Atomic Classification

Every component should reside in its own dedicated directory within `src/`, named in `kebab-case` or lowercase.

\`\`\`text
src/
└── [component-name]/
├── [ComponentName].tsx # The main component implementation
├── [ComponentName].stories.tsx # Storybook documentation and examples
└── index.ts # (Optional) specific structural exports if it's a deeply composed tree
\`\`\`

Components should be conceptually organized and exported using **Atomic Design** principles:

- **Atoms**: Pure, foundational building blocks (e.g. `Button`, `Badge`, `Spinner`, `Skeleton`)
- **Layout**: Use Tailwind `flex` and `grid` utilities in apps — not wrapper components in this package.
- **Molecules**: Combinations of atoms functioning together (e.g. `Card` and its subcomponents)
- **Organisms**: Complex, distinct sections of an interface (built from molecules/atoms)

### 2. File Naming Rules

- **Component Files:** Must use `PascalCase` (e.g., `Button.tsx`, `Card.tsx`).
- **Storybook Titles:** The Story meta `title` string must categorize the component by its atomic level (e.g., `title: 'Atoms/Button'`, `title: 'Molecules/Card'`, `title: 'Molecules/Pagination'`).
- **Component Name:** The React function component and its `displayName` must match the file's `PascalCase` name.

### 3. Prop Types & Exports

- Every component must export its props interface.
- Name the interface `[ComponentName]Props` (e.g., `ButtonProps`, `SkeletonProps`).
- Inherit standard HTML attributes correctly using standard React Interfaces (e.g., `extends React.HTMLAttributes<HTMLDivElement>`).
- Export all publicly consumable components and their prop types from the root `src/index.tsx` file.

### 4. Styling Conventions

- **Tailwind:** Utilize Tailwind CSS classes for structure and layout. Use the `cn()` utility from `@wisihe/utils` to merge `className` props safely.
- **Design Tokens:** Strictly depend on design system tokens for colors, spacing, and styling rather than arbitrary hex values.
- **Variants:** For multi-variant components (e.g., standard/outline/ghost variants or different sizes), use `class-variance-authority` (cva) to type-safely define and export variants.

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Watch for changes
pnpm dev

# Lint
pnpm lint
```

## License

MIT
