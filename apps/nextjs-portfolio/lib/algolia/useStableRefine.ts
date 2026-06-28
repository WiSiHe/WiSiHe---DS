'use client';

import { useCallback, useRef } from 'react';

/** Keeps InstantSearch `refine` stable so memoized facet rows do not all re-render. */
export function useStableRefine<TArgs extends unknown[]>(
  refine: (...args: TArgs) => void,
): (...args: TArgs) => void {
  const refineRef = useRef(refine);
  refineRef.current = refine;

  return useCallback((...args: TArgs) => {
    refineRef.current(...args);
  }, []);
}
