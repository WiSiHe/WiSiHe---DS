import type { CaptureResult, PostHogConfig } from 'posthog-js';
import { getPageType } from '@/lib/analytics/pageType';

/** Adds `page_type` / `page_path` to every `$pageview` the SDK captures for us. */
export function addPageType(event: CaptureResult | null): CaptureResult | null {
  if (event?.event !== '$pageview') return event;
  const pathname = String(event.properties?.$pathname ?? '');
  return {
    ...event,
    properties: { ...event.properties, page_path: pathname, page_type: getPageType(pathname) },
  };
}

/**
 * Privacy-first PostHog setup for EEA visitors: `persistence: 'memory'` stores nothing in cookies or browser
 * storage, so no cookie banner is needed. We deliberately do not use `cookieless_mode: 'always'`: it makes
 * PostHog silently drop events unless the project has cookieless mode enabled, and the trade-off is that unique
 * visitors are counted per page load rather than per day.
 *
 * `defaults` pins PostHog's recommended option snapshot; explicit options below override it. Pageviews use the
 * SDK's own `history_change` handling for the SPA router instead of a hand-rolled capture.
 */
export function getPostHogInitOptions(apiHost: string): Partial<PostHogConfig> {
  return {
    defaults: '2026-08-30',
    api_host: '/ingest',
    ui_host: apiHost.replace('.i.posthog.com', '.posthog.com'),
    capture_pageview: 'history_change',
    capture_pageleave: true,
    person_profiles: 'identified_only',
    persistence: 'memory',
    disable_session_recording: true,
    respect_dnt: true,
    autocapture: false,
    capture_dead_clicks: false,
    before_send: addPageType,
  };
}
