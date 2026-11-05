// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import { MAIN_CONTENT_ID, SkipToContentLink } from './SkipToContentLink';

// `<main>` here is wired up exactly as the route does (`tabIndex={-1}` so it is a valid,
// non-tab-order focus target). Whether the skip link is actually first on the real page is
// covered separately by `../../routes/__root.test.tsx`, which renders the real `RootComponent`
// tree instead of this hand-built harness.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement | null = null;
let root: Root | null = null;

function renderHarness() {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root?.render(
      <>
        <SkipToContentLink />
        <header>
          <button type='button'>Logo</button>
        </header>
        <main id={MAIN_CONTENT_ID} tabIndex={-1}>
          <button type='button'>First main action</button>
        </main>
      </>,
    );
  });
  return container;
}

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

describe('SkipToContentLink (#166)', () => {
  it('renders a link labelled "Skip to main content" pointing at #main-content', () => {
    const el = renderHarness();

    const skipLink = el.querySelector('a') as HTMLAnchorElement;

    expect(skipLink.textContent).toBe('Skip to main content');
    expect(skipLink.getAttribute('href')).toBe(`#${MAIN_CONTENT_ID}`);
  });

  it('targets an element that exists in the page', () => {
    renderHarness();

    expect(document.getElementById(MAIN_CONTENT_ID)).not.toBeNull();
  });

  it('moves keyboard focus to #main-content when activated, without a route reload', () => {
    const el = renderHarness();
    const skipLink = el.querySelector('a') as HTMLAnchorElement;

    act(() => {
      skipLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });

    expect(document.activeElement?.id).toBe(MAIN_CONTENT_ID);
  });
});
