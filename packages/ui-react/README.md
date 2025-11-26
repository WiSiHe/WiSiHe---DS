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

### Flex

A flexible container component for layout.

```tsx
import { Flex } from '@wisihe/ui-react';

<Flex direction="row" justify="center" align="center" gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>

<Flex direction="column" gap={2}>
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>
```

### Grid

A grid layout component.

```tsx
import { Grid } from '@wisihe/ui-react';

<Grid columns={3} gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// With GridCol
<Grid columns={12}>
  <Grid.Col span={6}>Half width</Grid.Col>
  <Grid.Col span={6}>Half width</Grid.Col>
</Grid>
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
