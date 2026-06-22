'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import type React from 'react';
import { useEffect } from 'react';
import { getPostHogInitOptions } from '@/lib/posthog/config';
import PostHogPageView from './components/layout/PostHogPageView/PostHogPageView';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

// Re-export useTheme from next-themes for convenience
export { useTheme } from 'next-themes';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize analytics in production builds so localhost/dev traffic
    // never reaches the PostHog project.
    if (process.env.NODE_ENV === 'production' && posthogKey && posthogHost) {
      posthog.init(posthogKey, getPostHogInitOptions(posthogHost));
    }
  }, []);

  return (
    <NextThemesProvider attribute='class' defaultTheme='system' enableSystem>
      <PHProvider client={posthog}>
        <PostHogPageView />
        {children}
      </PHProvider>
    </NextThemesProvider>
  );
}
