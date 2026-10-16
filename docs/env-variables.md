# Environment variables

Canonical names for the WiSiHe monorepo. Each app loads its own `.env.local` (or Doppler / Vercel injects at runtime).

**Prefix rules**

| Prefix | Where | Meaning |
|--------|--------|---------|
| `NEXT_PUBLIC_` | `apps/nextjs-portfolio` | Inlined into the browser bundle by Next.js |
| `SANITY_STUDIO_` | `apps/sanity-studio` | Sanity Studio UI (required by Sanity) |
| `SANITY_APP_` | `apps/wisihe-ai` | Sanity App SDK (required by Sanity CLI) |
| *(none)* | Server routes, scripts, API handlers | Secrets — never expose to the client |

Deprecated names still work during migration; update Doppler / Vercel when convenient.

---

## Shared values (same secret, different names per app)

| Value | Next.js portfolio | Sanity Studio | wisihe-ai |
|-------|-------------------|---------------|-----------|
| Project ID | `NEXT_PUBLIC_SANITY_PROJECT_ID` | `SANITY_STUDIO_PROJECT_ID` | `SANITY_APP_PROJECT_ID` |
| Dataset | `NEXT_PUBLIC_SANITY_DATASET` | `SANITY_STUDIO_DATASET` | `SANITY_APP_DATASET` |
| Read token | `NEXT_PUBLIC_SANITY_API_READ_TOKEN` | `SANITY_API_READ_TOKEN` | — |
| Algolia app ID | `NEXT_PUBLIC_ALGOLIA_APP_ID` | `ALGOLIA_APP_ID` | — |
| Algolia index | `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` | `ALGOLIA_INDEX_NAME` | — |
| AI proxy secret | `SANITY_AI_PROXY_SECRET` | — | `SANITY_APP_AI_PROXY_SECRET` |

---

## `apps/nextjs-portfolio`

### Required

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | e.g. `2024-08-22` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | `https://wisihe.sanity.studio/` |
| `NEXT_PUBLIC_SANITY_API_READ_TOKEN` | Viewer token (also used for live preview in browser) |
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | Algolia application ID |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` | Search-only key |
| `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` | Default `wisihe-search` |

### Server-only

| Variable | Notes |
|----------|--------|
| `OPENAI_API_KEY` | AI tag suggestions API |
| `OPENAI_TAG_SUGGEST_MODEL` | Optional, default `gpt-5.4-nano` |
| `SANITY_AI_PROXY_SECRET` | Shared secret for Studio / wisihe-ai → `/api/wisihe-ai/suggest-tags` |
| `SANITY_AI_PROXY_ALLOWED_ORIGINS` | Comma-separated CORS origins (optional) |

### Optional (client)

| Variable | Feature |
|----------|---------|
| `NEXT_PUBLIC_POSTHOG_KEY` | Analytics |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | About / photography maps |
| `NEXT_PUBLIC_STORYBOOK_URL` | Design system link, default `http://localhost:6006` |
| `YOUTUBE_API_KEY` | YouTube metadata on `/videos` |

### Deprecated (still read as fallback)

| Old name | Use instead |
|----------|-------------|
| `SANITY_AI_BULK_SECRET` | `SANITY_AI_PROXY_SECRET` |
| `SANITY_AI_BULK_ALLOWED_ORIGINS` | `SANITY_AI_PROXY_ALLOWED_ORIGINS` |

---

## `apps/sanity-studio`

| Variable | Notes |
|----------|--------|
| `SANITY_STUDIO_PROJECT_ID` | Same as `NEXT_PUBLIC_SANITY_PROJECT_ID` |
| `SANITY_STUDIO_DATASET` | Same as `NEXT_PUBLIC_SANITY_DATASET` |
| `SANITY_STUDIO_PREVIEW_URL` | Next.js site URL for Presentation tool |
| `SANITY_API_READ_TOKEN` | GROQ scripts (`sync-algolia`, migrations) |
| `SANITY_API_WRITE_TOKEN` | One-off write scripts (`--apply`) |
| `ALGOLIA_APP_ID` | Same value as `NEXT_PUBLIC_ALGOLIA_APP_ID` |
| `ALGOLIA_WRITE_KEY` | Admin key — scripts only |
| `ALGOLIA_INDEX_NAME` | Default `wisihe-search` |
| `OPENAI_API_KEY` | Studio Assist / bulk AI |

### Deprecated

| Old name | Use instead |
|----------|-------------|
| `SANITY_STUDIO_API_PROJECT_ID` | `SANITY_STUDIO_PROJECT_ID` |
| `SANITY_STUDIO_API_DATASET` | `SANITY_STUDIO_DATASET` |
| `SANITY_STUDIO_OPENAI_API_KEY` | `OPENAI_API_KEY` |

---

## `apps/wisihe-ai`

| Variable | Notes |
|----------|--------|
| `SANITY_APP_PROJECT_ID` | Required by Sanity App SDK |
| `SANITY_APP_DATASET` | Required by Sanity App SDK |
| `SANITY_APP_AI_PROXY_URL` | Next.js base URL, e.g. `http://localhost:1992` |
| `SANITY_APP_AI_PROXY_SECRET` | Same value as `SANITY_AI_PROXY_SECRET` on Next.js |

Legacy `VITE_*` names still work as fallbacks in local `.env.local`.

---

## CI: Weekly site health

The `Weekly site health` GitHub Action (`.github/workflows/weekly-site-health.yml`, Mondays 08:00 UTC + manual) runs `scripts/weekly-site-health.mjs`, which composes three check sources and opens deduplicated GitHub issues (labels: source category + `improvement`):

- **PostHog analytics** — product/engagement heuristics (HogQL, last 7 days)
- **Lighthouse** — accessibility + SEO (+ opt-in performance) on key routes; needs Chrome in CI
- **Structured data** — JSON-LD validation on key routes (plain fetch, no Chrome)

### Secrets (GitHub repo secrets)

| Variable | Notes |
|----------|--------|
| `POSTHOG_PERSONAL_API_KEY` | Personal API key with `query:read` scope |
| `POSTHOG_PROJECT_ID` | PostHog project ID |
| `GITHUB_TOKEN` | Provided automatically by Actions (`issues: write`) |

### Vars (GitHub repo variables, all optional)

| Variable | Default | Notes |
|----------|---------|--------|
| `POSTHOG_API_HOST` | `https://eu.posthog.com` | PostHog Query API host |
| `SITE_HEALTH_BASE_URL` | `https://www.wisihe.no` | Target for Lighthouse + JSON-LD |
| `SITE_HEALTH_A11Y_MIN` | `0.9` | Accessibility score floor (0–1) |
| `SITE_HEALTH_SEO_MIN` | `0.9` | SEO score floor (0–1) |
| `SITE_HEALTH_PERF_MIN` | `0.75` | Performance floor (only used with `--perf`) |
| `SITE_HEALTH_MAX_ISSUES` | `5` | Cap on issues created per run |

### Local runs

```bash
# Full preview (reads apps/nextjs-portfolio/.env.local for PostHog keys)
pnpm site-health:weekly:dry-run

# Scope to one source
node scripts/weekly-site-health.mjs --dry-run --only=structured-data
node scripts/weekly-site-health.mjs --dry-run --only=lighthouse --perf
node scripts/weekly-site-health.mjs --dry-run --only=analytics
```

Lighthouse tooling lives in `tools/site-health/` (installed with a full `pnpm install`). PR CI skips that package to keep installs lean; the weekly workflow runs a full install. Lighthouse launches headless Chrome locally; the CI job installs it via `browser-actions/setup-chrome`.

---

## Local dev

```bash
# Vercel (development env → app folder)
vercel env pull apps/nextjs-portfolio/.env.local --environment=development

# Doppler (recommended)
pnpm doppler:setup   # once per machine
pnpm dev

# Or without Doppler — copy .env.example → .env.local per app
```

See [doppler-setup.md](./doppler-setup.md) for production / Vercel sync.
