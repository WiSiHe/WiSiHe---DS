'use client';

import type { ReactNode } from 'react';
import { PostHogPageView } from './PostHogPageView';

/** posthog-js is loaded lazily (see `getPostHog`), so no provider/context is needed. */
export function PostHogProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <PostHogPageView />
      {children}
    </>
  );
}
