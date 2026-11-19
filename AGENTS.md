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

1. **The Single Source Rule.** Colors, type and spacing are defined only in `@wisihe/tokens`. In `packages/ui-react` and `apps/`, use token-mapped utilities (`bg-surface`, `text-foreground`), never hex or arbitrary values, and never edit generated token outputs. Style Dictionary rebuilds them, so hand edits are lost and themes drift.
2. **No manual memoization.** No `useMemo`, `useCallback` or `memo` in `apps/` and `packages/`. The React Compiler handles it, and hand-rolled memo adds noise and can fight the compiler. See `AI_RULES.md`.
3. **No glassmorphism.** No `backdrop-blur` or semi-transparent blurred surfaces anywhere. Use solid backgrounds, borders and shadows. This is a deliberate design decision for a clean, solid look.
4. **Build it once, document it.** UI used by more than one app lives in `@wisihe/ui-react`, imported via `workspace:*`, and apps never import from each other. Every new ui-react component ships with a colocated story whose `title` is a string literal matching `STORY.*` in `packages/ui-react/src/storybook/titles.ts` (Storybook 10 rejects dynamic titles). Duplicated or undocumented UI drifts across the portfolio apps.
5. **Turbo, not cd; dist is not source.** Run tasks with `pnpm --filter` or `turbo run`, never from inside a package directory, so the build order (tokens, ui-react, apps) and caching are respected. Never edit `dist/` or generated files; change the source and rebuild.
6. **Tests exercise the real code path and must be able to fail.** Regression and guard tests render or call the real component, route or function (e.g. `RootComponent`, the real hero), not a hand-built copy or constants the test defines itself; stub only external services (Sanity, GSAP). Before opening the PR, break the code on purpose (move the element, revert the fix), confirm the test fails, and put that command and its failing output in the PR description. A test that cannot fail gives false confidence: Qodo flagged this on #163, #165 and #168.

## Quality gate

Before reporting a coding task as done, review it with Qodo and meet this gate. Qodo Reviewer covers uncommitted changes (staged and unstaged); Review Resolver covers findings on an open PR. Pass the task requirements and the implementation decisions as context.

- **Fix:** every valid High and Medium finding, of any type (Bug, Rule violation, Requirement gap), including Medium Bugs. Investigate each against the code and requirements first. If a finding is wrong, dispute it with evidence (file and line, or test output) instead of fixing it.
- **Flag, don't block:** all Low findings, including Low Rule violations. Leave them unchanged and list them in the final report.
- **Loop:** fix, run `pnpm lint && pnpm typecheck && pnpm test`, rerun the review. Stop after 3 rounds or when a round makes no progress. For a PR, confirm the latest completed review covers the current head commit.
- **Not done:** report the task as not done, and say what you need from me, if a valid High or Medium finding is unresolved, checks or review are incomplete or failed, or the loop stalls.
- **Source expectation:** a PR for a ticket names one expectation from it, where it appears (link or section), and the test or check that fails if it is broken. Put the ticket reference (`Refs #N` or `Closes #N`) in the PR description so Qodo can read the source.
- **Final report:** every finding with its type, severity and decision; checks run; the latest review result; and the Low findings.
- **Severity labels:** where a tool shows only `action_level`, read `action_required` as High, `remediation_recommended` as Medium and `informational` as Low.

Releases use Changesets: add a `.changeset/*.md` for user-visible changes.

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
