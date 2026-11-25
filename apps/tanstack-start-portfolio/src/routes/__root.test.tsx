// @vitest-environment jsdom
import type { ReactNode } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { installMatchMedia } from '@/test/hydration';
import { MAIN_CONTENT_ID } from '../components/layout/SkipToContentLink';

// Mirrors the tab order assertion in SkipToContentLink.test.tsx, but against the real
// `RootComponent` tree so reordering `<SkipToContentLink />` in this file fails the test, not
// just a hand-built harness (#166).
const FOCUSABLE_SELECTOR =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

vi.mock('@tanstack/react-router', () => ({
  createRootRoute: (options: Record<string, unknown>) => ({
    ...options,
    useLoaderData: () => ({
      socialLinks: null,
      jobTitle: null,
      heroSubtitle: null,
      ctaLabel: null,
      ctaHref: null,
      previewEnabled: false,
    }),
  }),
  useLocation: () => ({ pathname: '/' }),
  // The chat widget only renders on the paintings gallery; `undefined` means "not matched".
  useMatch: () => undefined,
  useRouterState: ({ select }: { select: (state: unknown) => unknown }) =>
    select({ isLoading: false, location: { pathname: '/' } }),
  Outlet: () => null,
  Link: ({ children, to, ...rest }: { children?: ReactNode; to?: string }) => (
    <a href={String(to ?? '')} {...rest}>
      {children}
    </a>
  ),
}));

// Document chrome (html/head/body, fonts, inline theme script) isn't relevant to tab order and
// complicates rendering into a detached container; keep only its children.
vi.mock('../components/layout/RootDocument', () => ({
  RootDocument: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

// Initializes a real Locomotive Scroll/GSAP instance on mount, which jsdom can't support.
vi.mock('../components/layout/SmoothScroll', () => ({ default: () => null }));

// Only Header's *position* relative to the skip link matters here; its own contents (nav,
// lazy-loaded Dock) are covered elsewhere and add an unrelated Suspense boundary to deal with.
vi.mock('../components/layout/Header', () => ({
  Header: () => (
    <header>
      <button type='button'>Logo</button>
    </header>
  ),
}));

// `../server/fns` builds a Sanity client at import time and needs a project ID (absent in CI).
// The loader result comes from the `useLoaderData` mock above instead, so these are never called.
vi.mock('@/lib/sanity', () => ({
  urlForImage: () => ({ url: () => '' }),
  getSanityClientForRequest: () => null,
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

describe('RootComponent (#166)', () => {
  it('renders the skip link as the first focusable element, before the header', async () => {
    installMatchMedia();
    const { RootComponent } = await import('./__root');

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    act(() => {
      root?.render(<RootComponent />);
    });

    const focusable = container.querySelectorAll(FOCUSABLE_SELECTOR);
    const skipLink = focusable[0] as HTMLAnchorElement;

    expect(skipLink.tagName).toBe('A');
    expect(skipLink.getAttribute('href')).toBe(`#${MAIN_CONTENT_ID}`);
    expect(skipLink.textContent).toBe('Skip to main content');

    const main = container.querySelector(`#${MAIN_CONTENT_ID}`);
    expect(main?.tagName).toBe('MAIN');
    expect(main?.getAttribute('tabindex')).toBe('-1');
  });
});
