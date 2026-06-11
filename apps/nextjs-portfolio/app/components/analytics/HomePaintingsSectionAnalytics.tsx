'use client';

import { useEffect, useRef } from 'react';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';

type HomePaintingsSectionAnalyticsProps = {
  paintingCount: number;
  source: 'cms_showcase' | 'featured_fallback';
};

export default function HomePaintingsSectionAnalytics({
  paintingCount,
  source,
}: HomePaintingsSectionAnalyticsProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || paintingCount === 0) return;
    tracked.current = true;

    trackEvent(AnalyticsEvent.HOME_PAINTINGS_SECTION_VIEWED, {
      painting_count: paintingCount,
      source,
    });
  }, [paintingCount, source]);

  return null;
}
