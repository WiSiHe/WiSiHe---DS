// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import { MAIN_CONTENT_ID, SkipToContentLink } from './SkipToContentLink';

// Mirrors the tab order of the real page (`__root.tsx`): the skip link, then the header's
// controls, then `<main>` wired up exactly as the route does (`tabIndex={-1}` so it is a valid,
// non-tab-order focus target).
const FOCUSABLE_SELECTOR =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

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
  it('is the first focusable element on the page and links to #main-content', () => {
    const el = renderHarness();

    const focusable = el.querySelectorAll(FOCUSABLE_SELECTOR);
    const skipLink = focusable[0] as HTMLAnchorElement;

    expect(skipLink.tagName).toBe('A');
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
