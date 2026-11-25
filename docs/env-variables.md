# Environment variables

Canonical names for the WiSiHe monorepo. Each app loads its own `.env.local` (or Doppler / Vercel injects at runtime).

**Prefix rules**

| Prefix | Where | Meaning |
|--------|--------|---------|
| `VITE_` | `apps/tanstack-start-portfolio` | Inlined into the client bundle by Vite; never put secrets here |
| `SANITY_STUDIO_` | `apps/sanity-studio` | Sanity Studio UI (required by Sanity) |
| `SANITY_APP_` | `apps/wisihe-ai` | Sanity App SDK (required by Sanity CLI) |
| *(none)* | Server routes, scripts, API handlers | Secrets — never expose to the client |

Deprecated names still work during migration; update Doppler / Vercel when convenient.

---

## Shared values (same secret, different names per app)

| Value | TanStack portfolio | Sanity Studio | wisihe-ai |
|-------|-------------------|---------------|-----------|
| Project ID | `VITE_SANITY_PROJECT_ID` | `SANITY_STUDIO_PROJECT_ID` | `SANITY_APP_PROJECT_ID` |
| Dataset | `VITE_SANITY_DATASET` | `SANITY_STUDIO_DATASET` | `SANITY_APP_DATASET` |
| Read token | `SANITY_API_READ_TOKEN` (server-only) | `SANITY_API_READ_TOKEN` | — |
| Algolia app ID | `VITE_ALGOLIA_APP_ID` | `ALGOLIA_APP_ID` | — |
| Algolia index | `VITE_ALGOLIA_INDEX_NAME` | `ALGOLIA_INDEX_NAME` | — |
| AI proxy secret | `SANITY_AI_PROXY_SECRET` | — | `SANITY_APP_AI_PROXY_SECRET` |

---

## `apps/tanstack-start-portfolio`

See [`apps/tanstack-start-portfolio/.env.example`](../apps/tanstack-start-portfolio/.env.example) for the authoritative list.

### Required

| Variable | Notes |
|----------|--------|
| `VITE_SANITY_PROJECT_ID` | Sanity project ID |
| `VITE_SANITY_DATASET` | Usually `production` |
| `VITE_SANITY_API_VERSION` | e.g. `2024-08-22` |
| `SANITY_API_READ_TOKEN` | Viewer token. Server-only (draft mode / previews). Never use the `VITE_` prefix in deployed environments |
| `SANITY_API_WRITE_TOKEN` | Write token (server-only): engagement counters, ratings |
| `VITE_ALGOLIA_APP_ID` | Algolia application ID |
| `VITE_ALGOLIA_SEARCH_KEY` | Search-only key |
| `VITE_ALGOLIA_INDEX_NAME` | Default `wisihe-search` |
| `VITE_ALGOLIA_AGENT_ID` | Agent Studio agent ID; the "Ask about the art" chat is hidden when empty |

### Server-only

| Variable | Notes |
|----------|--------|
| `OPENAI_API_KEY` | AI tag suggestions API |
| `OPENAI_TAG_SUGGEST_MODEL` | Optional, default `gpt-5.4-nano` |
| `SANITY_AI_PROXY_SECRET` | Shared secret for Studio / wisihe-ai to `/api/wisihe-ai/*` |
| `SANITY_AI_PROXY_ALLOWED_ORIGINS` | Comma-separated CORS origins (optional) |

### Optional (client)

| Variable | Feature |
|----------|---------|
| `VITE_POSTHOG_KEY` | Analytics |
| `VITE_POSTHOG_HOST` | PostHog host |
| `VITE_MAPBOX_TOKEN` | About / photography maps |

---

## `apps/sanity-studio`

| Variable | Notes |
|----------|--------|
| `SANITY_STUDIO_PROJECT_ID` | Same as `VITE_SANITY_PROJECT_ID` |
| `SANITY_STUDIO_DATASET` | Same as `VITE_SANITY_DATASET` |
| `SANITY_STUDIO_PREVIEW_URL` | Portfolio site URL for the Presentation tool (e.g. `http://localhost:1992` locally) |
| `SANITY_API_READ_TOKEN` | GROQ scripts (`sync-algolia`, migrations) |
| `SANITY_API_WRITE_TOKEN` | One-off write scripts (`--apply`) |
| `ALGOLIA_APP_ID` | Same value as `VITE_ALGOLIA_APP_ID` |
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
| `SANITY_APP_AI_PROXY_URL` | Portfolio base URL, e.g. `http://localhost:1992` |
| `SANITY_APP_AI_PROXY_SECRET` | Same value as `SANITY_AI_PROXY_SECRET` on the portfolio |

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
# Full preview (reads apps/tanstack-start-portfolio/.env.local for PostHog keys)
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
vercel env pull apps/tanstack-start-portfolio/.env.local --environment=development

# Doppler (recommended)
pnpm doppler:setup   # once per machine
pnpm dev

# Or without Doppler — copy .env.example → .env.local per app
```

See [doppler-setup.md](./doppler-setup.md) for production / Vercel sync.

## TanStack app: edge caching (`ISR_BYPASS_TOKEN`)

| Variable | Where | Purpose |
|---|---|---|
| `ISR_BYPASS_TOKEN` | Vercel project `tanstack-portfolio` (Production + Preview, sensitive) | Build- and run-time secret (32+ chars, `openssl rand -base64 32`). When set at build, pages are cached at the edge for 60 s (Vercel ISR). `/api/draft-mode/enable` sets a matching `__prerender_bypass` cookie so Sanity preview sessions skip the cache; `/api/draft-mode/disable` clears it. When unset, nothing is cached (local dev, token-less builds). Rotate by replacing the variable and redeploying; active preview sessions must re-enter preview mode. |

