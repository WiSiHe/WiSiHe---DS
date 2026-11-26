// @vitest-environment jsdom
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vite-plus/test';
import { PhotographyDetailView } from './PhotographyDetailView';

// Only the Sanity URL builder is stubbed (it needs a project ID at import time). It encodes the
// requested width into the URL so the test can read it back from the rendered markup, and models
// `fit('max')`: Sanity never upscales, so the delivered width is min(requested, original).
const ORIGINAL_WIDTH = { current: 4000 };

vi.mock('@/lib/sanity', () => ({
  urlForImage: () => {
    const crop = { w: 0 };
    const builder = {
      width: (w: number) => {
        crop.w = w;
        return builder;
      },
      fit: () => builder,
      quality: () => builder,
      auto: () => builder,
      url: () =>
        `https://cdn.example.test/p.jpg?w=${Math.min(crop.w, ORIGINAL_WIDTH.current)}&req=${crop.w}`,
    };
    return builder;
  },
}));

// Router- and client-state-bound children, not under test here.
vi.mock('@/components/detail/DetailNav', () => ({ DetailNav: () => null }));
vi.mock('@/components/detail/LikeButton', () => ({ LikeButton: () => null }));
vi.mock('@/components/detail/ShareButton', () => ({ ShareButton: () => null }));
vi.mock('@/components/motion/SharedLayoutFrame', () => ({
  SharedLayoutFrame: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function render(width: number | null) {
  ORIGINAL_WIDTH.current = width ?? 4000;
  const photo = {
    _id: 'photo-1',
    slug: 'a-photo',
    title: 'A photo',
    caption: null,
    place: null,
    camera: null,
    capturedAt: null,
    likesCount: 0,
    tagsV2: [],
    image: { width, height: 2000, alt: 'alt', lqip: null, palette: null },
  };
  return renderToString(<PhotographyDetailView photo={photo as never} />);
}

function srcSetCandidates(html: string) {
  const match = html.match(/srcSet="([^"]+)"/i);
  expect(match, 'detail <img> should have a srcSet').not.toBeNull();
  return (match?.[1] ?? '').split(', ').map(entry => {
    const [url, descriptor] = entry.split(' ');
    const params = new URL(url?.replaceAll('&amp;', '&') ?? '').searchParams;
    return { delivered: Number(params.get('w')), descriptor };
  });
}

describe('PhotographyDetailView srcSet (#112)', () => {
  it('renders three width candidates whose descriptors match the delivered width', () => {
    const candidates = srcSetCandidates(render(4000));
    expect(candidates.map(c => c.descriptor)).toEqual(['900w', '1350w', '1800w']);
    for (const c of candidates) expect(`${c.delivered}w`).toBe(c.descriptor);
  });

  it('caps candidates at the original width so no descriptor promises more than Sanity delivers', () => {
    // A 1000px original: an uncapped "1800w" candidate would deliver only 1000px.
    const candidates = srcSetCandidates(render(1000));
    expect(candidates.map(c => c.descriptor)).toEqual(['900w', '1000w']);
    for (const c of candidates) expect(`${c.delivered}w`).toBe(c.descriptor);
  });

  it('emits no srcset when the original width is unknown, so nothing can promise too much', () => {
    // Sanity may return a null width; an uncapped 900/1350/1800 list could exceed the delivered width.
    const html = render(null);
    expect(html).toContain('<img');
    expect(html).not.toMatch(/srcSet=/i);
  });

  it('bounds sizes by the height-capped frame so portrait photos do not fetch oversized candidates', () => {
    // Fixture is 4000x2000 (aspect ratio 2): the frame can never be wider than maxHeight * 2.
    const html = render(4000);
    const sizes = html.match(/sizes="([^"]+)"/i)?.[1];
    expect(sizes).toBe(
      '(max-width: 1024px) min(100vw, calc(min(88vh, calc(100vh - 9rem)) * 2)), min(72vw, calc(min(88vh, calc(100vh - 9rem)) * 2))',
    );
  });
});
