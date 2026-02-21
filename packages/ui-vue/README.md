# @wisihe/ui-vue

Simple Vue UI components for the WiSiHe design system.

## Installation

```bash
pnpm add @wisihe/ui-vue @wisihe/tokens @wisihe/utils
```

## Setup

Import design token styles once in your app:

```css
@import '@wisihe/tokens/css';
```

## Components

### Button

```vue
<script setup lang="ts">
import { Button } from '@wisihe/ui-vue';
</script>

<template>
  <Button>Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="danger" :loading="true">Deleting...</Button>
</template>
```

### Badge

```vue
<script setup lang="ts">
import { Badge } from '@wisihe/ui-vue';
</script>

<template>
  <Badge>Default</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="outline">Outline</Badge>
</template>
```

## Development

```bash
pnpm --filter @wisihe/ui-vue build
pnpm --filter @wisihe/ui-vue typecheck
pnpm --filter @wisihe/ui-vue lint
```
