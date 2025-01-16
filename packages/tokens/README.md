# @tine/designsystem-tokens 💫

**Description**

This package contains the design tokens used in the Tine Design System. The tokens are shared across all packages to ensure consistent styles and best practices. The tokens are also exposed as a npm package to be used in other projects.

**Features**

- 🌟 Design Tokens
- 🌟 JSON Format

**Main Scripts**

- **`pnpm build`:** Creates a production-ready build.
- **`pnpm clean`:** Deletes build artifacts and dependencies.

**Installation**

```bash
npm install @tine/designsystem-tokens
```

```bash

pnpm install @tine/designsystem-tokens
```

```bash

yarn add @tine/designsystem-tokens
```

**Usage**

This package is used to import the design tokens in your project. The tokens are exposed as CSS variables and can be used in any project.

Import the tokens into your project:

```javascript
import '@tine/designsystem-tokens/dist/css/tine/variables.css';
```

```html
<link rel="stylesheet" href="npm:@tine/designsystem-tokens/dist/css/tine/variables.css" />
```

Use the tokens in your styles:

```html
<style>
  .button {
    background-color: var(--color-brand-primary);
  }
</style>
```

**Development**

In order to use the tokens in the design system Turbo or if you have made any changes to the tokens, you need to build the package. To build the package, run the following command:

```bash
pnpm build
```

**License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Contributing Guidelines**

We welcome contributions of all kinds! Please refer to our contributing guidelines ([link to guidelines]) for details on how to submit bug reports, feature requests, or code changes.
