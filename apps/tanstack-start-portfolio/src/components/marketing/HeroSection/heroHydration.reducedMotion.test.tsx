// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vite-plus/test';
import { installMatchMedia, renderThenHydrate, setViewportWidth } from '@/test/hydration';
import HeroImageSection, { type ShowcaseItem } from './HeroSection';

// Separate file from the width matrix: `motion` reads the reduced-motion preference once per module
// instance, so each preference needs its own module registry (vitest isolates per test file).
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...rest }: { children?: React.ReactNode; to?: string }) => (
    <a href={String(to ?? '')} {...rest}>
      {children}
    </a>
  ),
}));
// `@/lib/sanity` builds a Sanity client at import time and needs a project ID (absent in CI).
// The hero only needs a deterministic image URL, so stub the builder.
vi.mock('@/lib/sanity', () => {
  const builder = {
    width: () => builder,
    height: () => builder,
    fit: () => builder,
    auto: () => builder,
    quality: () => builder,
    url: () => 'https://cdn.example.test/image.jpg',
  };
  return { urlForImage: () => builder };
});

vi.mock('@gsap/react', () => ({ useGSAP: () => {} }));

const REDUCE = '(prefers-reduced-motion)';

const items: ShowcaseItem[] = Array.from({ length: 8 }, (_, i) => ({
  _type: 'painting' as const,
  _id: `painting-${i}`,
  slug: `painting-${i}`,
  title: `Painting ${i}`,
  format: 'portrait' as const,
  image: { asset: { _ref: `image-abc${i}-800x1000-jpg` }, aspectRatio: 0.8 },
}));

describe('hero hydration with prefers-reduced-motion (#148)', () => {
  // The server cannot know the preference (no matchMedia), so it renders as if motion is allowed.
  // A visitor who prefers reduced motion must still hydrate without a mismatch.
  it('hydrates without errors when the client prefers reduced motion', async () => {
    const media = installMatchMedia({ [REDUCE]: false });
    setViewportWidth(1280);
    const problems = await renderThenHydrate(
      <HeroImageSection items={items} heroEyebrow='Hello' heroName='Henrik' />,
      () => media.setMatches(REDUCE, true),
    );
    expect(problems).toEqual([]);
  });
});
