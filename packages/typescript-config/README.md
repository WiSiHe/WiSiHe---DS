# TypeScript Configuration

This directory contains shared TypeScript configurations for the WiSiHe monorepo.

## Configurations Overview

### `base.json`

Base configuration with common settings for all TypeScript projects.

### `react-app.json`

Configuration for Next.js applications. Extends `base.json` with React-specific settings.

### `react-library.json`

Configuration for React component libraries. Extends `base.json` with library-specific settings.

## Detailed Configuration Breakdown

### Base Configuration (`base.json`)

The foundation that all other configs extend from:

```json
{
  "composite": false, // Not part of a TypeScript project reference
  "declaration": true, // Generate .d.ts files for libraries
  "declarationMap": true, // Generate source maps for .d.ts files
  "esModuleInterop": true, // Enable CommonJS/AMD/UMD module interop
  "forceConsistentCasingInFileNames": true, // Enforce consistent file naming
  "inlineSources": false, // Don't inline source files in source maps
  "isolatedModules": true, // Ensure each file can be safely transpiled
  "module": "ESNext", // Use latest ES module syntax
  "moduleResolution": "bundler", // Use bundler-based resolution
  "noUnusedLocals": false, // Don't error on unused local variables
  "noUnusedParameters": false, // Don't error on unused parameters
  "preserveWatchOutput": true, // Preserve console output in watch mode
  "skipLibCheck": true, // Skip type checking of declaration files
  "strict": true // Enable all strict type checking options
}
```

### React App Configuration (`react-app.json`)

For Next.js applications:

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "allowJs": true, // Allow JavaScript files alongside TypeScript
    "declaration": false, // No .d.ts files (Next.js handles this)
    "declarationMap": false, // No declaration source maps
    "incremental": true, // Enable incremental compilation
    "jsx": "preserve", // Let Next.js handle JSX transformation
    "lib": ["dom", "dom.iterable", "esnext"], // Browser APIs + latest JS
    "module": "esnext", // ES modules for tree-shaking
    "moduleResolution": "bundler", // Required for Next.js 15+
    "noEmit": true, // Don't emit files (Next.js compiles)
    "resolveJsonModule": true, // Import JSON files as modules
    "target": "ES2022" // Modern JS with broad browser support
  }
}
```

### React Library Configuration (`react-library.json`)

For React component libraries (like `@wisihe/ui-react`):

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx", // Use React 17+ JSX transform
    "lib": ["dom", "ES2015"], // DOM APIs + ES2015 features
    "module": "ESNext", // ES modules for bundlers
    "noEmit": false, // Libraries need to emit files
    "resolveJsonModule": true, // Import JSON files as modules
    "target": "es6" // ES6 for broad compatibility
  }
}
```

## Usage in the Monorepo

### Next.js Portfolio App (`apps/nextjs-portfolio/tsconfig.json`)

```json
{
  "extends": "../../packages/typescript-config/react-app.json",
  "compilerOptions": {
    "plugins": [
      {
        "name": "next" // Next.js TypeScript plugin
      }
    ],
    "paths": {
      "@/*": ["./*"] // Import alias for cleaner imports
    }
  },
  "include": [
    "next-env.d.ts", // Next.js type definitions
    "**/*.ts", // All TypeScript files
    "**/*.tsx", // All TSX files
    ".next/types/**/*.ts" // Next.js generated types
  ],
  "exclude": ["node_modules"]
}
```

### Sanity Studio (`apps/sanity-studio/tsconfig.json`)

Custom configuration for Sanity CMS:

```json
{
  "compilerOptions": {
    "target": "ES2022", // Modern JavaScript
    "lib": ["dom", "dom.iterable", "esnext"], // Browser APIs
    "allowJs": true, // Allow JavaScript files
    "skipLibCheck": true, // Skip library type checking
    "strict": false, // Less strict (Sanity requirement)
    "forceConsistentCasingInFileNames": true,
    "noEmit": false, // Sanity needs emitted files
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node", // Node.js resolution (not bundler)
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve", // Let Sanity handle JSX
    "incremental": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

### UI React Package (`packages/ui-react/tsconfig.json`)

```json
{
  "extends": "@wisihe/typescript-config/react-library.json",
  "include": ["."], // Include all files in package
  "exclude": ["dist", "build", "node_modules"]
}
```

### Utils Package (`packages/utils/tsconfig.json`)

```json
{
  "extends": "@wisihe/typescript-config/base.json",
  "include": ["."],
  "compilerOptions": {
    "target": "ES2017", // Support for Object.entries and modern features
    "resolveJsonModule": true // Allow importing JSON files
  },
  "exclude": ["dist", "build", "node_modules"]
}
```

## Key Differences Explained

### App vs Library Configurations

| Setting       | App (`react-app.json`)            | Library (`react-library.json`)        |
| ------------- | --------------------------------- | ------------------------------------- |
| `declaration` | `false` (Next.js handles)         | `true` (generates .d.ts)              |
| `jsx`         | `"preserve"` (Next.js transforms) | `"react-jsx"` (TypeScript transforms) |
| `noEmit`      | `true` (Next.js compiles)         | `false` (library needs output)        |
| `target`      | `"ES2022"` (modern browsers)      | `"es6"` (broad compatibility)         |

### Module Resolution

- **`"bundler"`**: For Next.js 15+ and modern bundlers
- **`"node"`**: For Node.js environments (Sanity Studio)

### JSX Handling

- **`"preserve"`**: Let framework handle JSX (Next.js, Sanity)
- **`"react-jsx"`**: TypeScript handles JSX transformation

## When to Use Each Configuration

### Use `react-app.json` for:

- Next.js applications
- React applications with bundlers
- Applications that don't need to generate declaration files

### Use `react-library.json` for:

- React component libraries
- Packages that need to generate `.d.ts` files
- Libraries that will be consumed by other projects

### Use `base.json` for:

- Utility packages
- Node.js applications
- Packages that don't need React-specific settings

## Browser Support

- **ES2022**: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ (2021)
- **ES6**: Chrome 51+, Firefox 54+, Safari 10+, Edge 14+ (2016)

## Common Customizations

### Adding Path Aliases

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"]
    }
  }
}
```

### Supporting Additional APIs

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext", "webworker"]
  }
}
```

### Stricter Type Checking

```json
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

## Recent Fixes Applied

1. **Fixed `moduleResolution` casing**: Changed from `"Bundler"` to `"bundler"` in `base.json` for consistency
2. **Added missing options to `react-library.json`**: Added `noEmit: false` and `resolveJsonModule: true`
3. **Fixed Sanity Studio config**: Changed `"includes"` to `"include"` (correct TypeScript field name)
4. **Fixed utils package target**: Added `target: "ES2017"` to support `Object.entries()` and modern JavaScript features
