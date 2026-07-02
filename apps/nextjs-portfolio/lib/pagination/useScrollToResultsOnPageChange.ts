'use client';

import { useEffect, useRef } from 'react';
import { scrollToSearchResults } from './scrollToSearchResults';

type Options = Readonly<{
  page: number;
  isLoading: boolean;
  targetId: string;
}>;

/** Scroll results into view once a pagination request has finished loading. */
export function useScrollToResultsOnPageChange({ page, isLoading, targetId }: Options) {
  const previousPageRef = useRef(page);
  const pendingScrollRef = useRef(false);

  useEffect(() => {
    if (page === previousPageRef.current) return;
    previousPageRef.current = page;
    pendingScrollRef.current = true;
  }, [page]);

  useEffect(() => {
    if (!pendingScrollRef.current || isLoading) return;

    pendingScrollRef.current = false;

    let innerFrame = 0;
    const outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        scrollToSearchResults(targetId);
      });
    });

    return () => {
      cancelAnimationFrame(outerFrame);
      cancelAnimationFrame(innerFrame);
    };
  }, [isLoading, targetId]);
}
