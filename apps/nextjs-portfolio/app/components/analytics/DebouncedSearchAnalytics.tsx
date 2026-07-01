'use client';

import { useEffect, useRef } from 'react';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';

const DEBOUNCE_MS = 500;

type DebouncedSearchAnalyticsProps = {
  query: string;
  resultCount: number;
  /** Which search surface fired the query, e.g. 'projects' | 'paintings'. */
  section: string;
};

/**
 * Headless tracker for client-side search inputs. Fires `search_performed`
 * (and `search_no_results` when nothing matched) once per settled, non-empty
 * query after debouncing keystrokes.
 */
export default function DebouncedSearchAnalytics({
  query,
  resultCount,
  section,
}: DebouncedSearchAnalyticsProps) {
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    const timer = setTimeout(() => {
      if (!trimmed) return;

      const key = `${trimmed}::${resultCount}`;
      if (lastTracked.current === key) return;
      lastTracked.current = key;

      trackEvent(AnalyticsEvent.SEARCH_PERFORMED, {
        query: trimmed,
        section,
        result_count: resultCount,
      });

      if (resultCount === 0) {
        trackEvent(AnalyticsEvent.SEARCH_NO_RESULTS, { query: trimmed, section });
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, resultCount, section]);

  return null;
}
