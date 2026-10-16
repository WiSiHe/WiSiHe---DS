'use client';

import { useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';
import { AnalyticsEvent, getPageType, getPostHog } from '@/lib/analytics/posthog';

export function PostHogPageView() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const searchStr = useRouterState({ select: state => state.location.searchStr });

  useEffect(() => {
    if (!pathname) return;

    let url = window.origin + pathname;
    if (searchStr) {
      url = `${url}${searchStr.startsWith('?') ? searchStr : `?${searchStr}`}`;
    }

    void getPostHog().then(posthog =>
      posthog?.capture(AnalyticsEvent.PAGE_VIEW, {
        $current_url: url,
        page_path: pathname,
        page_type: getPageType(pathname),
      }),
    );
  }, [pathname, searchStr]);

  return null;
}
