# @wisihe/ui-web-components

Simple Web Components for the WiSiHe design system.

## Installation

```bash
pnpm add @wisihe/ui-web-components @wisihe/tokens
```

## Setup

Import design token styles in your app:

```css
@import '@wisihe/tokens/css';
@import '@wisihe/tokens/css/semantic';
```

Register the elements once at app startup:

```ts
import { registerWisiheWebComponents } from '@wisihe/ui-web-components';

registerWisiheWebComponents();
```

## Components

### Button

```html
<wisihe-button>Primary</wisihe-button>
<wisihe-button variant="secondary">Secondary</wisihe-button>
<wisihe-button variant="danger" loading>Deleting...</wisihe-button>
```

### Badge

```html
<wisihe-badge>Default</wisihe-badge>
<wisihe-badge variant="success">Success</wisihe-badge>
<wisihe-badge variant="outline">Outline</wisihe-badge>
```

## Development

```bash
pnpm --filter @wisihe/ui-web-components build
pnpm --filter @wisihe/ui-web-components lint
```
