'use client';

import { useRouterState } from '@tanstack/react-router';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';
import { AnalyticsEvent, getPageType } from '@/lib/analytics/posthog';

export function PostHogPageView() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const searchStr = useRouterState({ select: state => state.location.searchStr });
  const posthog = usePostHog();

  useEffect(() => {
    if (!pathname || !posthog) return;

    let url = window.origin + pathname;
    if (searchStr) {
      url = `${url}${searchStr.startsWith('?') ? searchStr : `?${searchStr}`}`;
    }

    posthog.capture(AnalyticsEvent.PAGE_VIEW, {
      $current_url: url,
      page_path: pathname,
      page_type: getPageType(pathname),
    });
  }, [pathname, searchStr, posthog]);

  return null;
}
