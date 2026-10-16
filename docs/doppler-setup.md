# Doppler environment setup

This guide covers managing secrets for **nextjs-portfolio** (Vercel), **sanity-studio**, and related scripts using [Doppler](https://www.doppler.com/).

## Overview

| App | Deploy target | Example file |
|-----|---------------|--------------|
| `apps/nextjs-portfolio` | Vercel (`www.wisihe.no`) | [`apps/nextjs-portfolio/.env.example`](../apps/nextjs-portfolio/.env.example) |
| `apps/sanity-studio` | `sanity deploy` / local | [`apps/sanity-studio/.env.example`](../apps/sanity-studio/.env.example) |
| `apps/wisihe-ai` | Sanity App SDK | [`apps/wisihe-ai/.env.example`](../apps/wisihe-ai/.env.example) |

You can use **one Doppler project** with multiple **configs** (e.g. `dev`, `stg`, `prd`) or separate projects per app. The Vercel integration typically uses three configs synced to Preview / Production.

---

## 1. Create the Doppler project

1. Sign in at [dashboard.doppler.com](https://dashboard.doppler.com).
2. **Create Project** → e.g. `portfolio`.
3. Create configs:
   - **`dev`** — local development
   - **`stg`** — Vercel preview deployments (optional; can mirror `dev`)
   - **`prd`** — Vercel production

---

## 2. Add secrets (production checklist)

Copy variable **names** from [`apps/nextjs-portfolio/.env.example`](../apps/nextjs-portfolio/.env.example). Full cross-app reference: [env-variables.md](./env-variables.md). Values live only in Doppler.

### Required for the live site

| Secret | Notes |
|--------|--------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | e.g. `2024-08-22` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | `https://wisihe.sanity.studio/` |
| `SANITY_API_READ_TOKEN` | Read-only (Viewer) API token, server-only (masked in Doppler → synced as a Vercel Secret) |
| `SANITY_API_WRITE_TOKEN` | Write API token, server-only (masked) |
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | Algolia application ID |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` | **Search-only** key (never Admin) |
| `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` | `wisihe-search` |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | e.g. `https://eu.i.posthog.com` |

### Optional

| Secret | Feature |
|--------|---------|
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | About page map |
| `YOUTUBE_API_KEY` | YouTube metadata |
| `OPENAI_API_KEY` | AI tag suggestions API |
| `SANITY_AI_PROXY_SECRET` | Shared secret Studio ↔ Next.js AI route |
| `STATSIG_*` / `EXPERIMENTATION_*` | Feature flags (optional) |

### Sanity Studio & Algolia (same Doppler project or a `studio` config)

| Secret | Notes |
|--------|--------|
| `SANITY_STUDIO_PROJECT_ID` | Same as `NEXT_PUBLIC_SANITY_PROJECT_ID` |
| `SANITY_STUDIO_DATASET` | Same as `NEXT_PUBLIC_SANITY_DATASET` |
| `SANITY_STUDIO_PREVIEW_URL` | `https://www.wisihe.no` |
| `SANITY_API_READ_TOKEN` | For `pnpm sync-algolia` scripts |
| `OPENAI_API_KEY` | Studio Assist / bulk AI |
| `ALGOLIA_APP_ID` | Same app ID as public |
| `ALGOLIA_WRITE_KEY` | **Admin** key — server/scripts only |
| `ALGOLIA_INDEX_NAME` | `wisihe-search` |

> **Tip:** In Doppler, use **Shared secrets** or duplicate values across configs so Sanity IDs stay in sync between Studio and Next.js.

---

## 3. Connect Doppler to Vercel

1. Doppler → **Integrations** → **Vercel**.
2. Link the Vercel team and the **nextjs-portfolio** project.
3. Map configs:
   - Doppler `prd` → Vercel **Production**
   - Doppler `stg` (or `dev`) → Vercel **Preview**
4. After sync, Vercel shows `DOPPLER_PROJECT`, `DOPPLER_ENVIRONMENT`, and `DOPPLER_CONFIG` — leave those managed by the integration.

**Important for Next.js:** `NEXT_PUBLIC_*` variables must exist in the **build** environment. Doppler’s Vercel sync injects them before `next build`. Trigger a redeploy after adding new public vars.

---

## 4. Local development with Doppler CLI

### Install & login

```bash
brew install dopplerhq/cli/doppler   # or see https://docs.doppler.com/docs/install-cli
doppler login
```

### Link the repo (once per machine)

From the monorepo root:

```bash
doppler setup --project portfolio --config dev
```

This writes `.doppler.yaml` (safe to commit — it only stores project/config names, not secrets).

### Run apps with injected env

From the monorepo root (scripts wrap `doppler run` automatically):

```bash
# Next.js portfolio + Storybook + Studio + wisihe-ai
pnpm dev

# Sanity Studio only
pnpm dev:studio

# wisihe-ai only
pnpm dev:wisihe-ai

# Algolia sync against production index
pnpm sync-algolia
pnpm set-algolia-settings
```

Run a single app directly:

```bash
pnpm --filter nextjs-portfolio dev
pnpm --filter sanity-studio dev
```

Use `:local` variants (e.g. `pnpm dev:local`) when using `.env.local` instead of Doppler.

### Without Doppler CLI

```bash
cp apps/nextjs-portfolio/.env.example apps/nextjs-portfolio/.env.local
cp apps/sanity-studio/.env.example apps/sanity-studio/.env.local
# Fill in values manually
```

---

## 5. PostHog cookieless mode (privacy)

The site uses cookieless PostHog (`lib/posthog/config.ts`). In the PostHog dashboard:

1. **Project Settings → Web analytics**
2. Enable **Cookieless server hash mode**

Without this, unique visitor counts may be under-reported. No extra Doppler variables are needed.

---

## 6. Algolia index maintenance

After content or schema changes, from your machine:

```bash
pnpm sync-algolia
pnpm set-algolia-settings
```

Use `pnpm sync-algolia:dev` for the **dev** Doppler config when your Algolia index name differs per environment.

---

## 7. Security notes

- Never put **Algolia Admin** (`ALGOLIA_WRITE_KEY`) in `NEXT_PUBLIC_*`.
- Tokens must **not** use a `NEXT_PUBLIC_` prefix: Next inlines those into client bundles, and Vercel only accepts `NEXT_PUBLIC_*` as plain Config variables. Use `SANITY_API_READ_TOKEN` / `SANITY_API_WRITE_TOKEN` and keep them masked.
- Vercel sync: use the **Dynamic** variable type. Unmasked secrets sync as Config, masked ones as Secret. Set the genuinely public `NEXT_PUBLIC_*` values (project ID, dataset, Algolia search key, PostHog key/host, …) to **Unmasked**, otherwise Vercel rejects them and Doppler disables the sync.
- Do not commit `.env`, `.env.local`, or downloaded secret files.
- Rotate keys in Doppler; synced Vercel env updates on the next deploy.

---

## 8. Troubleshooting

| Symptom | Check |
|---------|--------|
| `/paintings` search broken in production | `NEXT_PUBLIC_ALGOLIA_*` set in Doppler **prd** and redeployed |
| PostHog shows zero users | Cookieless hash mode enabled in PostHog UI |
| Studio preview wrong site | `SANITY_STUDIO_PREVIEW_URL` matches deployed URL |
| Local env not loading | Using `.env.local` in the **app folder**, not repo root — see [env-variables.md](./env-variables.md) |

---

## Quick reference: config → environment

```
Doppler dev  → local machine (doppler run)
Doppler stg  → Vercel Preview deployments
Doppler prd  → Vercel Production (www.wisihe.no)
```

For questions about variable names, always treat the app `.env.example` files as the source of truth.
