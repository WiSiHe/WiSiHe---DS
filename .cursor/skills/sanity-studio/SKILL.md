---
name: sanity-studio
description: >-
  Edits and extends Sanity Studio in this monorepo—schemas, desk structure,
  config, and preview. Use when working under apps/sanity-studio, adding or
  changing document types, singletons, SEO fields, structure, or Studio
  plugins; when the user mentions Sanity CMS, GROQ in Vision, or content
  modeling for WiSiHe.
---

# Sanity Studio (this repo)

## Where things live

- **Config**: @apps/sanity-studio/sanity.config.ts — `defineConfig`, `projectId`, `dataset`, plugins (`structureTool`, `presentationTool`, `assist`, `media`, dev-only `visionTool`).
- **Schemas**: @apps/sanity-studio/schemas/ — register types in `schemas/index.ts`. Prefer `defineType` / schema patterns consistent with existing types (e.g. `project`, `painting`, `post`, singletons under `singletons/`).
- **Desk**: @apps/sanity-studio/structure/index.ts — document lists, singletons, ordering.
- **Types**: `sanity.types.ts` and typegen flows already used by the repo; run the app’s typegen script after schema changes when applicable (see `nextjs-portfolio` / studio `package.json` scripts).

## Conventions

- Keep field names and slug patterns aligned with GROQ in @packages/sanity-queries/src/index.ts — query shapes depend on `_type`, `slug.current`, and projected fields.
- **Presentation / preview**: `presentationTool` uses `previewUrl` and draft enable path; do not break allowed origins or preview URL env without updating deployment docs.
- **Images**: Reuse shared image helpers (e.g. @apps/sanity-studio/utils/image.ts) and alt/SEO components under `components/` when adding media-heavy fields.
- **Plugins**: Adding a new Studio plugin requires updating `sanity.config.ts` and verifying TypeScript compatibility (the repo may use `as any` for plugin typings—match existing style).

## Do not

- Duplicate query definitions in Studio—canonical GROQ for apps belongs in `packages/sanity-queries`.
- Store secrets in schema files; use `environment.ts` / env vars as the rest of the app does.
