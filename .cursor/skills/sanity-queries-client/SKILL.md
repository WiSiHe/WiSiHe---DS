---
name: sanity-queries-client
description: >-
  GROQ queries, generated types, and Next.js Sanity client usage in this
  monorepo. Use when editing packages/sanity-queries, fetching from Sanity in
  apps (next-sanity, defineLive), draft mode, stega, or adding/changing
  defineQuery strings; when the user mentions GROQ, sanityFetch, or
  @wisihe/sanity-queries.
---

# Sanity queries and clients (this repo)

## Query package

- **Source of truth**: @packages/sanity-queries/src/index.ts — export queries with `defineQuery` from `groq`, compose fragments, and re-export generated types from `./sanity.types`.
- **Consumers**: Apps import from `@wisihe/sanity-queries` (and may re-export via app `sanity/lib/queries.ts`, e.g. @apps/nextjs-portfolio/sanity/lib/queries.ts).
- After schema or query shape changes, ensure **typegen** / build steps for `sanity-queries` and consuming apps still pass (see root and app `package.json` scripts).

## Next.js portfolio client

- **Client**: @apps/nextjs-portfolio/sanity/lib/client.ts — `createClient` from `next-sanity`, `stega` with `studioUrl`, server token behavior.
- **Live / ISR**: @apps/nextjs-portfolio/sanity/lib/live.ts — `defineLive` with `sanityFetch` and `SanityLive`; requires token setup consistent with deployment.
- **Fetch**: Prefer `sanityFetch` with `stega: false` for metadata and non-visual responses; follow existing `next: { tags: [...] }` patterns for caching where used.
- **Draft mode**: Align with Presentation Tool routes and `draftMode()` usage in the app; do not strip stega from content that must be visually edited in preview without checking side effects.

## Patterns

- Use **parameterized** queries (`$slug`, `$id`) and `defineQuery` for type-safe GROQ.
- Project only fields the UI needs; coalesce defaults in GROQ where the schema allows optional data.
- For static paths, see `getStaticSlugs` / `generateStaticSlugs` patterns in queries and @apps/nextjs-portfolio/sanity/lib/queries.ts.

## Do not

- Embed large inline GROQ in random app files when the query is shared—add it to `packages/sanity-queries` and import.
- Enable CDN or `perspective` inconsistently for the same data path without a reason (published vs preview).
