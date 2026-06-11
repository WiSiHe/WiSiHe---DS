import posthog from 'posthog-js';

/** Canonical event names — keep snake_case and stable for dashboards. */
export const AnalyticsEvent = {
  PAGE_VIEW: '$pageview',
  PROJECT_VIEWED: 'project_viewed',
  PROJECT_LIKED: 'project_liked',
  PROJECT_UNLIKED: 'project_unliked',
  PAINTING_VIEWED: 'painting_viewed',
  PAINTING_LIKED: 'painting_liked',
  PAINTING_UNLIKED: 'painting_unliked',
  VIDEO_VIEWED: 'video_viewed',
  VIDEO_LIKED: 'video_liked',
  VIDEO_UNLIKED: 'video_unliked',
  PROJECTS_LISTING_VIEWED: 'projects_listing_viewed',
  PROJECTS_FILTERED: 'projects_filtered',
  HOME_PAINTINGS_SECTION_VIEWED: 'home_paintings_section_viewed',
  EXPLORE_ALL_PROJECTS_CLICKED: 'explore_all_projects_clicked',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

/** Fire a PostHog event with typed, dashboard-friendly properties. */
export function trackEvent(event: AnalyticsEventName, properties?: AnalyticsProperties): void {
  if (typeof window === 'undefined') return;
  posthog.capture(event, properties);
}

export function getPageType(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname === '/projects') return 'projects_listing';
  if (pathname.startsWith('/projects/')) return 'project_detail';
  if (pathname === '/paintings') return 'paintings_listing';
  if (pathname.startsWith('/paintings/')) return 'painting_detail';
  if (pathname === '/about') return 'about';
  if (pathname.startsWith('/videos/')) return 'video_detail';
  if (pathname.startsWith('/three-d')) return 'three_d';
  return 'other';
}
