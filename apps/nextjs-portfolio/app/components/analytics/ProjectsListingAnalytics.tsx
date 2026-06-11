'use client';

import { useEffect, useRef } from 'react';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';

type ProjectsListingAnalyticsProps = {
  ongoingCount: number;
  pastCount: number;
  tagCount: number;
  hasCmsIntro: boolean;
};

export default function ProjectsListingAnalytics({
  ongoingCount,
  pastCount,
  tagCount,
  hasCmsIntro,
}: ProjectsListingAnalyticsProps) {
  const trackedListing = useRef(false);

  useEffect(() => {
    if (trackedListing.current) return;
    trackedListing.current = true;

    trackEvent(AnalyticsEvent.PROJECTS_LISTING_VIEWED, {
      ongoing_projects_count: ongoingCount,
      past_projects_count: pastCount,
      total_projects_count: ongoingCount + pastCount,
      tag_count: tagCount,
      has_cms_intro: hasCmsIntro,
    });
  }, [ongoingCount, pastCount, tagCount, hasCmsIntro]);

  return null;
}
