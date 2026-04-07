'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import type React from 'react';
import { useEffect } from 'react';
import PostHogPageView from './components/layout/PostHogPageView/PostHogPageView';

// eslint-disable-next-line no-undef
const posthogKey = process.env['NEXT_PUBLIC_POSTHOG_KEY'];
// eslint-disable-next-line no-undef
const posthogHost = process.env['NEXT_PUBLIC_POSTHOG_HOST'];

// Re-export useTheme from next-themes for convenience
export { useTheme } from 'next-themes';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (posthogKey && posthogHost) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        capture_pageview: false,
        capture_pageleave: true, // Enable pageleave capture
        person_profiles: 'identified_only',
      });
    } else {
      console.error('PostHog key or host is not defined');
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
