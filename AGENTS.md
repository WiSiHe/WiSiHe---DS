# Agent instructions

pnpm + Turbo monorepo (`apps/`, `packages/`), Biome for lint/format, Changesets for releases.

- Project rules: @AI_RULES.md (React Compiler = no manual memo, Tailwind v4 tokens, no glassmorphism).
- Scoped rules live in `.cursor/rules/*.mdc` (a11y, SEO, component structure, Tailwind, workspace) — read the relevant one before editing.
- Skills live in `.agents/skills/` (managed by `npx skills`; refresh with `npx skills update`). Local-only skills: `.cursor/skills/`.
- Before finishing: `pnpm lint && pnpm typecheck && pnpm test`.

<!-- BEGIN:turborepo-agent-rules -->

## What this is

WiSiHe DS: a design system monorepo. `@wisihe/tokens` (design tokens) feeds `@wisihe/ui-react` (components, documented in Storybook), which powers the portfolio apps (`tanstack-start-portfolio`, `nextjs-portfolio`) backed by a Sanity CMS (`sanity-studio`).

## Setup and verification

- Node version in `.node-version`; install with `pnpm install`.
- Run locally: `pnpm dev:local` (no Doppler secrets needed) or `pnpm storybook`.
- Verify before finishing: `pnpm lint && pnpm typecheck && pnpm test`. CI runs `pnpm ci`.
- For UI changes, also check the page in the dev server (no console errors, mobile width).

## House rules

1. **No manual memoization.** Do not use `useMemo`, `useCallback` or `memo` in `apps/` and `packages/`. The React Compiler handles it; hand-rolled memo adds noise and can fight the compiler. See `AI_RULES.md`.
2. **Colors and spacing come from tokens.** In Tailwind code, use CSS variables or utilities mapped from `@wisihe/tokens` (e.g. `bg-surface`, `text-foreground`), never hex values or arbitrary values. This keeps themes consistent when tokens change.
3. **No glassmorphism.** No `backdrop-blur` or semi-transparent blurred surfaces anywhere. Use solid backgrounds, borders and shadows. This is a deliberate design decision for a clean, solid look.
4. **Reuse before you build.** Check `@wisihe/ui-react` and `src/components/detail/` before writing new markup. For example, use the shared `ShareButton` on detail pages. Duplicated UI drifts apart across the portfolio apps.
5. **Accessible by default.** Use `button` for actions, keep focus visible and heading order intact, and respect `prefers-reduced-motion`. See `.cursor/rules/apps-accessibility.mdc`.

Releases use Changesets: add a `.changeset/*.md` for user-visible changes.

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
