import type { PostHogConfig } from 'posthog-js';

/**
 * Privacy-first PostHog setup for EEA visitors (no cookie banner required when
 * Cookieless server hash mode is enabled in PostHog → Project Settings → Web analytics).
 *
 * @see https://posthog.com/tutorials/cookieless-tracking
 */
export function getPostHogInitOptions(apiHost: string): Partial<PostHogConfig> {
  return {
    // Route ingestion through the same-origin /ingest proxy (see next.config.ts
    // rewrites) so ad blockers that block *.posthog.com don't drop events.
    api_host: '/ingest',
    // Point the toolbar/links at the real region host (e.g. https://eu.posthog.com).
    ui_host: apiHost.replace('.i.posthog.com', '.posthog.com'),
    capture_pageview: false,
    capture_pageleave: true,
    person_profiles: 'identified_only',
    persistence: 'memory',
    disable_session_recording: true,
    respect_dnt: true,
    autocapture: false,
    // Supported in PostHog JS SDK when project has cookieless hash mode enabled
    cookieless_mode: 'always',
  };
}
