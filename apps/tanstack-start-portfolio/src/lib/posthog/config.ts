import type { PostHogConfig } from 'posthog-js';

/**
 * Privacy-first PostHog setup for EEA visitors (no cookie banner required when
 * Cookieless server hash mode is enabled in PostHog → Project Settings → Web analytics).
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
    cookieless_mode: 'always',
  };
}
