import { getDocumentScrollTop } from '@/app/lib/lenis-registry';

const STORAGE_PREFIX = 'wisihe:list-scroll:';

/** Listing pages that should restore scroll when navigating back from detail. */
export const SCROLL_RESTORE_LIST_ROUTES = ['/paintings', '/projects', '/videos'] as const;

export type ScrollRestoreListRoute = (typeof SCROLL_RESTORE_LIST_ROUTES)[number];

export function isScrollRestoreListRoute(pathname: string): pathname is ScrollRestoreListRoute {
  return (SCROLL_RESTORE_LIST_ROUTES as readonly string[]).includes(pathname);
}

function storageKey(pathname: ScrollRestoreListRoute): string {
  return `${STORAGE_PREFIX}${pathname}`;
}

export function saveListScrollPosition(pathname: string): void {
  if (!isScrollRestoreListRoute(pathname)) return;

  try {
    sessionStorage.setItem(storageKey(pathname), String(getDocumentScrollTop()));
  } catch {
    // Private browsing / quota — ignore.
  }
}

export function consumeListScrollPosition(pathname: string): number | null {
  if (!isScrollRestoreListRoute(pathname)) return null;

  try {
    const raw = sessionStorage.getItem(storageKey(pathname));
    if (raw == null) return null;

    sessionStorage.removeItem(storageKey(pathname));
    const y = Number.parseInt(raw, 10);
    return Number.isFinite(y) && y >= 0 ? y : null;
  } catch {
    return null;
  }
}
