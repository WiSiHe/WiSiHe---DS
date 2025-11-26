# `@wisihe/eslint-config`

Shared ESLint configuration for the WiSiHe Design System, using **ESLint Flat Config**.

## Installation

```bash
pnpm add -D @wisihe/eslint-config eslint typescript typescript-eslint globals
```

## Usage

### Library (Node.js / General)

In your `eslint.config.js`:

```javascript
import { config as libraryConfig } from '@wisihe/eslint-config/library';

export default [
  ...libraryConfig,
  // Your custom overrides
];
```

### React

In your `eslint.config.js`:

```javascript
import { config as reactConfig } from '@wisihe/eslint-config/react';

export default [
  ...reactConfig,
  // Your custom overrides
];
```

### Storybook

In your `eslint.config.js`:

```javascript
import { config as storybookConfig } from '@wisihe/eslint-config/storybook';

export default [
  ...storybookConfig,
  // Your custom overrides
];
```
