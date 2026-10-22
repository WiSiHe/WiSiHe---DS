import type { PostHog } from 'posthog-js';
import { getPostHogInitOptions } from '@/lib/posthog/config';

/** Canonical event names — keep snake_case and stable for dashboards. */
export const AnalyticsEvent = {
  PROJECT_VIEWED: 'project_viewed',
  PROJECT_LIKED: 'project_liked',
  PROJECT_UNLIKED: 'project_unliked',
  PAINTING_VIEWED: 'painting_viewed',
  PAINTING_LIKED: 'painting_liked',
  PAINTING_UNLIKED: 'painting_unliked',
  VIDEO_VIEWED: 'video_viewed',
  VIDEO_LIKED: 'video_liked',
  VIDEO_UNLIKED: 'video_unliked',
  PHOTOGRAPHY_VIEWED: 'photography_viewed',
  PHOTOGRAPHY_LIKED: 'photography_liked',
  PHOTOGRAPHY_UNLIKED: 'photography_unliked',
  RECIPE_VIEWED: 'recipe_viewed',
  RECIPE_RATED: 'recipe_rated',
  RECIPE_PRINTED: 'recipe_printed',
  PROJECTS_LISTING_VIEWED: 'projects_listing_viewed',
  PROJECTS_FILTERED: 'projects_filtered',
  HOME_PAINTINGS_SECTION_VIEWED: 'home_paintings_section_viewed',
  EXPLORE_ALL_PROJECTS_CLICKED: 'explore_all_projects_clicked',
  PROJECT_EXTERNAL_LINK_CLICKED: 'project_external_link_clicked',
  FOOTER_SOCIAL_CLICKED: 'footer_social_clicked',
  FOOTER_CTA_CLICKED: 'footer_cta_clicked',
  SEARCH_PERFORMED: 'search_performed',
  SEARCH_NO_RESULTS: 'search_no_results',
  FOR_SALE_FILTER_TOGGLED: 'for_sale_filter_toggled',
  PAINTING_STORE_LINK_CLICKED: 'painting_store_link_clicked',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

function isPostHogReady(): boolean {
  if (typeof window === 'undefined') return false;
  const key = import.meta.env.VITE_POSTHOG_KEY?.trim();
  const host = import.meta.env.VITE_POSTHOG_HOST?.trim();
  if (!key || !host) return false;
  if (import.meta.env.DEV) return false;
  return true;
}

function whenIdle(): Promise<void> {
  return new Promise(resolve => {
    if ('requestIdleCallback' in window)
      window.requestIdleCallback(() => resolve(), { timeout: 1500 });
    else setTimeout(resolve, 1000);
  });
}

let posthogPromise: Promise<PostHog | null> | null = null;

/**
 * Lazily loads and initialises posthog-js once the browser is idle, so its ~100 KB chunk stays
 * out of the critical path. Every caller shares one promise, so early events queue and none are lost.
 */
function getPostHog(): Promise<PostHog | null> {
  if (!isPostHogReady()) return Promise.resolve(null);
  posthogPromise ??= whenIdle()
    .then(() => import('posthog-js'))
    .then(({ default: posthog }) => {
      const key = import.meta.env.VITE_POSTHOG_KEY?.trim() as string;
      const host = import.meta.env.VITE_POSTHOG_HOST?.trim() as string;
      posthog.init(key, getPostHogInitOptions(host));
      return posthog;
    })
    .catch(() => null);
  return posthogPromise;
}

/** Fire a PostHog event with typed, dashboard-friendly properties. No-op when unset or in dev. */
export function trackEvent(event: AnalyticsEventName, properties?: AnalyticsProperties): void {
  void getPostHog().then(posthog => posthog?.capture(event, properties));
}
