import type { PostHogConfig } from 'posthog-js';

/**
 * Privacy-first PostHog setup for EEA visitors (no cookie banner required when
 * Cookieless server hash mode is enabled in PostHog → Project Settings → Web analytics).
 *
 * @see https://posthog.com/tutorials/cookieless-tracking
 */
export function getPostHogInitOptions(apiHost: string): Partial<PostHogConfig> {
  return {
    api_host: apiHost,
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
