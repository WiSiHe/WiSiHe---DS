'use client';

import { useEffect, useRef } from 'react';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';

type ProjectsFilterAnalyticsProps = {
  activeType: string;
  activeTags: string[];
  searchQuery: string;
  resultCount: number;
  totalCount: number;
};

export default function ProjectsFilterAnalytics({
  activeType,
  activeTags,
  searchQuery,
  resultCount,
  totalCount,
}: ProjectsFilterAnalyticsProps) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const hasFilters =
      activeType !== 'all' || activeTags.length > 0 || searchQuery.trim().length > 0;

    trackEvent(AnalyticsEvent.PROJECTS_FILTERED, {
      project_type: activeType,
      tag_count: activeTags.length,
      tags: activeTags.join(','),
      has_search: searchQuery.trim().length > 0,
      search_length: searchQuery.trim().length,
      result_count: resultCount,
      total_count: totalCount,
      has_active_filters: hasFilters,
    });
  }, [activeType, activeTags, searchQuery, resultCount, totalCount]);

  return null;
}
