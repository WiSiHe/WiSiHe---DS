// @vitest-environment jsdom
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vite-plus/test';
import { PhotographyFeaturedHero } from './PhotographyFeaturedHero';

// Only the Sanity URL builder is stubbed (it needs a project ID at import time); it encodes the
// requested crop into the URL so the test can read it back from the rendered markup.
vi.mock('@/lib/sanity', () => ({
  urlForImage: () => {
    const crop = { w: 0, h: 0 };
    const builder = {
      width: (w: number) => {
        crop.w = w;
        return builder;
      },
      height: (h: number) => {
        crop.h = h;
        return builder;
      },
      fit: () => builder,
      quality: () => builder,
      auto: () => builder,
      url: () => `https://cdn.example.test/p.jpg?w=${crop.w}&h=${crop.h}`,
    };
    return builder;
  },
}));

vi.mock('@/components/layout/RouterLink', () => ({
  RouterLink: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

function render(width: number, height: number) {
  const photo = {
    slug: 'a-photo',
    title: 'A photo',
    caption: null,
    place: null,
    image: { width, height, alt: 'alt', lqip: null },
  };
  return renderToString(<PhotographyFeaturedHero photo={photo as never} />);
}

function srcSetCandidates(html: string) {
  const match = html.match(/srcSet="([^"]+)"/);
  expect(match, 'hero <img> should have a srcSet').not.toBeNull();
  return (match?.[1] ?? '').split(', ').map(entry => {
    const [url, descriptor] = entry.split(' ');
    const params = new URL(url?.replaceAll('&amp;', '&') ?? '').searchParams;
    return { w: Number(params.get('w')), h: Number(params.get('h')), descriptor };
  });
}

describe('PhotographyFeaturedHero srcSet (#112)', () => {
  it('renders three width candidates whose descriptors match the requested width', () => {
    const candidates = srcSetCandidates(render(3000, 2000));
    expect(candidates.map(c => c.descriptor)).toEqual(['700w', '1050w', '1400w']);
    for (const c of candidates) expect(`${c.w}w`).toBe(c.descriptor);
  });

  it('keeps one aspect ratio across candidates, even when the height clamp applies', () => {
    // Portrait ratio: the largest candidate's height is clamped to 900.
    const candidates = srcSetCandidates(render(1000, 2000));
    const [small, , large] = candidates;
    expect(large?.h).toBe(900);
    expect((small?.h ?? 0) / (small?.w ?? 1)).toBeCloseTo((large?.h ?? 0) / (large?.w ?? 1), 2);
  });
});
