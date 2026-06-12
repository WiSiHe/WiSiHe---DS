# WiSiHe Design System

A comprehensive, multi-framework design system powering WiSiHe applications.

Built with performance and cross-framework compatibility in mind, this monorepo uses [Turborepo](https://turbo.build/repo) and `pnpm` workspaces to manage a suite of UI components, design tokens, and applications.

## 🚀 Ecosystem

This repository is organized into `apps` and `packages`. The design system is framework-agnostic at its core (using Design Tokens), with specific UI libraries tailored for various frontend frameworks.

### Packages (`/packages`)

The building blocks of the design system:

- **`@wisihe/tokens`**: The single source of truth for design tokens (colors, typography, spacing). Outputs CSS variables and Tailwind v4 themes via Style Dictionary.
- **`@wisihe/ui-react`**: React component library built with Tailwind CSS, `cva`, and `radix-ui`. Bundled with `tsup`.
- **`@wisihe/ui-vue`**: Vue 3 component library. Bundled with Vite and `vue-tsc`.
- **`@wisihe/ui-svelte`**: Svelte 5 component library. Bundled with `@sveltejs/package`.
- **`@wisihe/ui-angular`**: Angular component library. Bundled with `ng-packagr`.
- **`@wisihe/ui-web-components`**: Framework-agnostic Web Components. Bundled with `tsup`.
- **`@wisihe/utils`**: Shared utilities and class-merging helpers (`cn()`).
- **Config Packages**: `@wisihe/eslint-config`, `@wisihe/typescript-config`, `@wisihe/constants`, `@wisihe/sanity-queries`.

### Apps (`/apps`)

Applications and documentation sites consuming the packages:

- **`ui-docs`**: React Storybook documentation.
- **`ui-vue-docs`**: Vue Storybook documentation.
- **`ui-svelte-docs`**: Svelte Storybook documentation.
- **`ui-web-components-docs`**: Web Components Storybook documentation.
- **`nextjs-portfolio`**: Main Next.js application.
- **`astro-portfolio`**: Alternate Astro.js portfolio.
- **`sanity-studio`**: Sanity CMS studio for managing content.

## 🛠 Getting Started

### Prerequisites

- Node.js `22.21.1` (see `.nvmrc`)
- `pnpm` (latest)

### Installation

Install dependencies from the root:

```sh
pnpm install
```

### Useful Commands

- `pnpm dev` - Start all development servers (Next.js and Storybooks) concurrently.
- `pnpm run ci` - Run the full CI pipeline locally (`lint`, `typecheck`, `test`, `build:packages`).
- `pnpm build` - Build all apps and packages (excluding docs and sanity-studio).
- `pnpm lint` - Run ESLint across the monorepo.
- `pnpm typecheck` - Run TypeScript type checking and Svelte/Vue/Angular diagnostics.
- `pnpm storybook` - Run the Storybook instances.
- `pnpm clean` - Remove all `node_modules`, `dist`, and cache directories.

## 📦 Versioning & Publishing

This repository uses [Changesets](https://github.com/changesets/changesets) for versioning. **All workspace packages and apps share one linked semver** via the `fixed` group in `.changeset/config.json` (the live site footer reads `nextjs-portfolio`'s version).

We intentionally do **not** also use [release-please](https://github.com/googleapis/release-please): it would duplicate the existing Release workflow on `main`.

1. **Create a changeset:** Run `pnpm changeset` and pick any package in the fixed group plus the bump type (minor/patch/major) — every linked package moves together.
2. **Commit:** Commit the generated Markdown file in the `.changeset` directory.
3. **Release:** When merged to `main`, the Release workflow opens a "Version Packages" PR. Merging it bumps all linked versions and publishes public packages to npm; private apps are versioned but not published.

## 🤝 Pre-commit Hooks

We use [Lefthook](https://github.com/evilmartians/lefthook) to ensure code quality before commits. Upon running `git commit`, Lefthook will automatically run:

1. `pnpm turbo typecheck`
2. `pnpm turbo lint`

If any of these fail, the commit will be aborted.
