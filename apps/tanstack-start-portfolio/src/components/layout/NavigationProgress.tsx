'use client';

import { useRouterState } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

/**
 * Top accent progress bar during client navigations — mirrors Next's
 * `react-transition-progress` ProgressBar look.
 */
export function NavigationProgress() {
  const isLoading = useRouterState({
    select: state => state.isLoading || state.isTransitioning,
  });
  const [visible, setVisible] = useState(false);
  const [complete, setComplete] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (hideTimerRef.current != null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (isLoading) {
      setComplete(false);
      setVisible(true);
      return;
    }

    if (!visible) return;

    setComplete(true);
    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      setComplete(false);
      hideTimerRef.current = null;
    }, 280);

    return () => {
      if (hideTimerRef.current != null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [isLoading, visible]);

  if (!visible) return null;

  return (
    <div className='pointer-events-none fixed inset-x-0 top-0 z-50 h-1 overflow-hidden' aria-hidden>
      <div
        className='h-full origin-left bg-accent shadow-lg shadow-accent transition-transform duration-300 ease-out'
        style={{
          transform: complete ? 'scaleX(1)' : 'scaleX(0.72)',
          transitionDuration: complete ? '200ms' : '1200ms',
        }}
      />
    </div>
  );
}
