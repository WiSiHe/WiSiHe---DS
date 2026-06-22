'use client';

import { useEffect, useRef } from 'react';
import { useInstantSearch } from 'react-instantsearch';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';

type SearchAnalyticsProps = {
  /** Which search surface fired the query, e.g. 'projects' | 'paintings'. */
  section: string;
};

/**
 * Headless tracker placed inside an InstantSearch provider. Fires
 * `search_performed` (and `search_no_results` when nothing matched) once per
 * settled, non-empty query — the search box already debounces keystrokes, so
 * this only sees queries the user paused on. Zero-result queries are the most
 * actionable signal: they reveal demand the content doesn't cover.
 */
export default function SearchAnalytics({ section }: SearchAnalyticsProps) {
  const { results, status } = useInstantSearch();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    // Only record once results have settled for the current query.
    if (status !== 'idle') return;

    const query = results?.query?.trim() ?? '';
    if (!query) return;

    const resultCount = results?.nbHits ?? 0;

    // Dedupe on query + count so re-renders don't double-fire the same search.
    const key = `${query}::${resultCount}`;
    if (lastTracked.current === key) return;
    lastTracked.current = key;

    trackEvent(AnalyticsEvent.SEARCH_PERFORMED, {
      query,
      section,
      result_count: resultCount,
    });

    if (resultCount === 0) {
      trackEvent(AnalyticsEvent.SEARCH_NO_RESULTS, { query, section });
    }
  }, [results, status, section]);

  return null;
}
