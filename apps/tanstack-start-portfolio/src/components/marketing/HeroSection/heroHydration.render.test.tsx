// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vite-plus/test';
import { installMatchMedia, renderThenHydrate, setViewportWidth } from '@/test/hydration';
import HeroImageSection, { type ShowcaseItem } from './HeroSection';

// `Link` needs a router; a plain anchor keeps the markup the same on both sides of hydration.
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...rest }: { children?: React.ReactNode; to?: string }) => (
    <a href={String(to ?? '')} {...rest}>
      {children}
    </a>
  ),
}));

// GSAP tweens need real layout (computed transforms), which jsdom doesn't have. They only run in
// effects, after hydration, so they don't affect what is being checked here.
vi.mock('@gsap/react', () => ({ useGSAP: () => {} }));

const items: ShowcaseItem[] = Array.from({ length: 8 }, (_, i) => ({
  _type: 'painting' as const,
  _id: `painting-${i}`,
  slug: `painting-${i}`,
  title: `Painting ${i}`,
  format: 'portrait' as const,
  image: { asset: { _ref: `image-abc${i}-800x1000-jpg` }, aspectRatio: 0.8 },
}));

const hero = <HeroImageSection items={items} heroEyebrow='Hello' heroName='Henrik' />;

describe('hero hydrates cleanly (#148)', () => {
  // The server has no window, so it renders the default layout; the client then hydrates at its
  // real width. Hydration must still match because the real size is only applied after mount.
  it.each([375, 1280])('server desktop render hydrates at %ipx without errors', async width => {
    installMatchMedia();
    setViewportWidth(1280);
    const problems = await renderThenHydrate(hero, () => setViewportWidth(width));
    expect(problems).toEqual([]);
  });
});
