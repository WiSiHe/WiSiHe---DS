import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';

// Regression for #148: the hero read `window.innerWidth` in its initial `useState`, so the first
// client render differed from the server HTML (React hydration error #418).
// This is a cheap source-level guard. `heroHydration.render.test.tsx` is the real check.
const heroSource = readFileSync(join(import.meta.dirname, 'HeroSection.tsx'), 'utf8');

/** Returns the full argument text of every `useState(...)`, including lazy `() => ...` initializers. */
function useStateInitializers(source: string): string[] {
  const results: string[] = [];
  for (const match of source.matchAll(/useState(?:<[^>(]*>)?\(/g)) {
    let depth = 1;
    let i = (match.index ?? 0) + match[0].length;
    const start = i;
    while (i < source.length && depth > 0) {
      if (source[i] === '(') depth++;
      if (source[i] === ')') depth--;
      i++;
    }
    results.push(source.slice(start, i - 1));
  }
  return results;
}

describe('hero first render is the same on server and client', () => {
  it('seeds viewport state from the shared constants', () => {
    expect(heroSource).toContain('useState<HeroViewport>(HERO_INITIAL_VIEWPORT)');
    expect(heroSource).toContain('useState<HeroViewportSize>(HERO_INITIAL_VIEWPORT_SIZE)');
  });

  it('finds lazy initializers (the form that caused #148)', () => {
    const found = useStateInitializers('useState<A>(() => window.innerWidth); useState(f(g()))');
    expect(found).toEqual(['() => window.innerWidth', 'f(g())']);
  });

  it('never reads browser globals inside a useState initializer', () => {
    const initializers = useStateInitializers(heroSource);
    expect(initializers.length).toBeGreaterThan(0);
    for (const init of initializers) {
      expect(init).not.toMatch(/\bwindow\b|\bdocument\b|readViewportSize|matchMedia/);
    }
  });
});
