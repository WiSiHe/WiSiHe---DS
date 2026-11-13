// @vitest-environment jsdom
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vite-plus/test';
import { ProjectImageGallery } from './ProjectImageGallery';

// Only the Sanity URL builder is stubbed (it needs a project ID at import time); it encodes the
// requested width into the URL so the test can read it back from the rendered markup.
vi.mock('@/lib/sanity', () => ({
  urlForImage: () => {
    const crop = { w: 0 };
    const builder = {
      width: (w: number) => {
        crop.w = w;
        return builder;
      },
      height: () => builder,
      fit: () => builder,
      quality: () => builder,
      auto: () => builder,
      url: () => `https://cdn.example.test/p.jpg?w=${crop.w}`,
    };
    return builder;
  },
}));

const images = [
  {
    _key: 'a',
    asset: { _ref: 'image-a-1000x800-jpg' },
    alt: 'First',
    lqip: 'data:image/jpeg;base64,AAAA',
  },
  { _key: 'b', asset: { _ref: 'image-b-1000x800-jpg' }, alt: 'Second' },
];

function render() {
  return renderToString(<ProjectImageGallery projectTitle='Demo' images={images} />);
}

describe('ProjectImageGallery srcSet and LQIP (#112)', () => {
  it('gives every slide a 700/1050/1400w srcSet whose descriptors match the requested width', () => {
    const html = render();
    const sets = [...html.matchAll(/srcSet="([^"]+)"/g)].map(m => m[1] ?? '');
    expect(sets).toHaveLength(2);
    for (const set of sets) {
      const entries = set.split(', ').map(e => e.split(' '));
      expect(entries.map(([, d]) => d)).toEqual(['700w', '1050w', '1400w']);
      for (const [url, d] of entries) expect(url).toContain(`w=${parseInt(d ?? '', 10)}`);
    }
  });

  it('does not paint the LQIP behind object-contain slides, where it would show as letterbox fill', () => {
    // The first slide has an LQIP; `Image` would apply it as a CSS background on the <img>, which
    // stays visible around a contained photo.
    expect(render()).not.toContain('background-image');
  });
});
