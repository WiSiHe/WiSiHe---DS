import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import { HERO_INITIAL_VIEWPORT, HERO_INITIAL_VIEWPORT_SIZE } from './heroArcLayout';

// Regression for #148: the hero read `window.innerWidth` in its initial `useState`, so the first
// client render differed from the server HTML (React hydration error #418).
const heroSource = readFileSync(join(import.meta.dirname, 'HeroSection.tsx'), 'utf8');

describe('hero first render is the same on server and client', () => {
  it('starts from fixed, window-independent viewport values', () => {
    expect(HERO_INITIAL_VIEWPORT).toBe('desktop');
    expect(HERO_INITIAL_VIEWPORT_SIZE).toEqual({ width: 0, height: 0 });
  });

  it('seeds viewport state from the shared constants', () => {
    expect(heroSource).toContain('useState<HeroViewport>(HERO_INITIAL_VIEWPORT)');
    expect(heroSource).toContain('useState<HeroViewportSize>(HERO_INITIAL_VIEWPORT_SIZE)');
  });

  it('never reads browser globals inside a useState initializer', () => {
    const initializers = [...heroSource.matchAll(/useState(?:<[^>]*>)?\(([^)]*)\)/g)].map(
      m => m[1],
    );
    expect(initializers.length).toBeGreaterThan(0);
    for (const init of initializers) {
      expect(init).not.toMatch(/\bwindow\b|\bdocument\b|readViewportSize|matchMedia/);
    }
  });
});
