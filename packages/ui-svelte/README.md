# @wisihe/ui-svelte

Basic Svelte UI component library built with Tailwind CSS utility classes and design tokens.

## Installation

```bash
pnpm add @wisihe/ui-svelte @wisihe/tokens @wisihe/utils
```

## Setup

Import design token styles once in your app:

```css
@import '@wisihe/tokens/css';
```

## Components

### Button

```svelte
<script lang="ts">
  import { Button } from '@wisihe/ui-svelte';
</script>

<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger" loading={true}>Deleting...</Button>
```

### Badge

```svelte
<script lang="ts">
  import { Badge } from '@wisihe/ui-svelte';
</script>

<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="outline">Outline</Badge>
```

### Card

```svelte
<script lang="ts">
  import { Card } from '@wisihe/ui-svelte';
</script>

<Card>
  <h3 class="text-lg font-semibold">Card title</h3>
  <p class="text-sm text-foreground-subtle">Card content</p>
</Card>
```

### Stack

```svelte
<script lang="ts">
  import { Stack } from '@wisihe/ui-svelte';
</script>

<Stack gap="sm">
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>
```

## Development

```bash
pnpm --filter @wisihe/ui-svelte build
pnpm --filter @wisihe/ui-svelte typecheck
pnpm --filter @wisihe/ui-svelte lint
```
