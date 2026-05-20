/// <reference types="vite/client" />

/**
 * Optional `VITE_*` fallbacks for local tooling; prefer `SANITY_APP_*` (see `.env.example`).
 */
interface ImportMetaEnv {
  readonly VITE_SANITY_PROJECT_ID?: string;
  readonly VITE_SANITY_DATASET?: string;
  readonly VITE_AI_PROXY_URL?: string;
  readonly VITE_AI_PROXY_SECRET?: string;
}
