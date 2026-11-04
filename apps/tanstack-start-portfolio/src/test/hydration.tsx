import type { ReactElement } from 'react';
import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { vi } from 'vite-plus/test';

export type MatchMediaController = {
  setMatches: (query: string, matches: boolean) => void;
};

/** Minimal `matchMedia` whose results can change later (and notify listeners) like a real browser. */
export function installMatchMedia(initial: Record<string, boolean> = {}): MatchMediaController {
  const state = new Map<string, boolean>(Object.entries(initial));
  const listeners = new Map<string, Set<(event: MediaQueryListEvent) => void>>();

  window.matchMedia = ((query: string) => {
    const add = (listener: (event: MediaQueryListEvent) => void) => {
      if (!listeners.has(query)) listeners.set(query, new Set());
      listeners.get(query)?.add(listener);
    };
    const remove = (listener: (event: MediaQueryListEvent) => void) => {
      listeners.get(query)?.delete(listener);
    };
    return {
      get matches() {
        return state.get(query) ?? false;
      },
      media: query,
      onchange: null,
      addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) =>
        add(listener),
      removeEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) =>
        remove(listener),
      // Some libraries still use the legacy API.
      addListener: add,
      removeListener: remove,
      dispatchEvent: () => false,
    };
  }) as typeof window.matchMedia;

  return {
    setMatches(query, matches) {
      state.set(query, matches);
      for (const listener of listeners.get(query) ?? []) {
        listener({ matches, media: query } as MediaQueryListEvent);
      }
    },
  };
}

export function setViewportWidth(width: number, height = 800) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
}

/**
 * Server-renders `element`, then hydrates that HTML. Returns every hydration problem React or
 * the console reported. Change browser state (viewport, matchMedia) between the two phases via
 * `beforeHydrate` to mimic a client that differs from the server.
 */
export async function renderThenHydrate(
  element: ReactElement,
  beforeHydrate?: () => void,
): Promise<string[]> {
  const problems: string[] = [];
  const html = renderToString(element);

  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.append(container);

  const consoleError = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    const text = args.map(String).join(' ');
    if (/hydrat/i.test(text)) problems.push(`console.error: ${text.slice(0, 1500)}`);
  });

  beforeHydrate?.();

  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  let root: ReturnType<typeof hydrateRoot> | undefined;
  await act(async () => {
    root = hydrateRoot(container, element, {
      onRecoverableError: error => {
        problems.push(`recoverable: ${error instanceof Error ? error.message : String(error)}`);
      },
    });
  });
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
  });

  root?.unmount();
  container.remove();
  consoleError.mockRestore();
  return problems;
}
