'use client';

import { useEffect, useRef } from 'react';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';

type ProjectsFilterAnalyticsProps = {
  activeType: string;
  activeTags: string[];
  resultCount: number;
  totalCount: number;
};

export default function ProjectsFilterAnalytics({
  activeType,
  activeTags,
  resultCount,
  totalCount,
}: ProjectsFilterAnalyticsProps) {
  const isFirstRender = useRef(true);
  const countsRef = useRef({ resultCount, totalCount });
  countsRef.current = { resultCount, totalCount };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const hasFilters = activeType !== 'all' || activeTags.length > 0;
    const { resultCount: currentResultCount, totalCount: currentTotalCount } = countsRef.current;

    trackEvent(AnalyticsEvent.PROJECTS_FILTERED, {
      project_type: activeType,
      tag_count: activeTags.length,
      tags: activeTags.join(','),
      result_count: currentResultCount,
      total_count: currentTotalCount,
      has_active_filters: hasFilters,
    });
  }, [activeType, activeTags]);

  return null;
}
