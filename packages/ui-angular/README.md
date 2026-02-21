# @wisihe/ui-angular

Simple Angular UI components for the WiSiHe design system.

## Installation

```bash
pnpm add @wisihe/ui-angular @wisihe/tokens @wisihe/utils
```

## Setup

Import design token styles once in your app:

```css
@import '@wisihe/tokens/css';
```

## Components

### Button

```ts
import { ButtonComponent } from '@wisihe/ui-angular';
```

```html
<wisihe-button>Default</wisihe-button>
<wisihe-button variant="secondary">Secondary</wisihe-button>
<wisihe-button variant="danger" [loading]="true">Deleting...</wisihe-button>
```

### Badge

```ts
import { BadgeComponent } from '@wisihe/ui-angular';
```

```html
<wisihe-badge>Default</wisihe-badge>
<wisihe-badge variant="success">Success</wisihe-badge>
<wisihe-badge variant="outline">Outline</wisihe-badge>
```

## Development

```bash
pnpm --filter @wisihe/ui-angular build
pnpm --filter @wisihe/ui-angular lint
```
