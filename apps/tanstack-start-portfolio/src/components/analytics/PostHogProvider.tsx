'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { getPostHogInitOptions } from '@/lib/posthog/config';
import { PostHogPageView } from './PostHogPageView';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY?.trim();
const posthogHost = import.meta.env.VITE_POSTHOG_HOST?.trim();

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (import.meta.env.DEV || !posthogKey || !posthogHost) return;
    posthog.init(posthogKey, getPostHogInitOptions(posthogHost));
  }, []);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}
