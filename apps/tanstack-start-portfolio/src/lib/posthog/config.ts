import type { PostHogConfig } from 'posthog-js';

/**
 * Privacy-first PostHog setup for EEA visitors: `persistence: 'memory'` stores nothing in cookies or browser
 * storage, so no cookie banner is needed. We deliberately do not use `cookieless_mode: 'always'`: it makes
 * PostHog silently drop events unless the project has "Cookieless server hash mode" enabled, and the trade-off
 * is that unique visitors are counted per page load rather than per day.
 */
export function getPostHogInitOptions(apiHost: string): Partial<PostHogConfig> {
  return {
    api_host: '/ingest',
    ui_host: apiHost.replace('.i.posthog.com', '.posthog.com'),
    capture_pageview: false,
    capture_pageleave: true,
    person_profiles: 'identified_only',
    persistence: 'memory',
    disable_session_recording: true,
    respect_dnt: true,
    autocapture: false,
  };
}
