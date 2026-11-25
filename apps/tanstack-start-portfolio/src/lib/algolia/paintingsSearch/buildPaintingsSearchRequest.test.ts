import { describe, expect, it } from 'vite-plus/test';
import { buildPaintingsSearchRequests } from './buildPaintingsSearchRequest';
import { parsePaintingsSearchResults } from './parsePaintingsSearchResult';

const base = {
  query: '',
  page: 0,
  hitsPerPage: 24,
  tagFilters: [],
  colorFilters: [],
  forSale: false,
  sort: 'featured' as const,
};

function paramsOf(request: { params: string }) {
  return new URLSearchParams(request.params);
}

describe('buildPaintingsSearchRequests', () => {
  it('sends a single request when no facet is refined', () => {
    expect(buildPaintingsSearchRequests(base)).toHaveLength(1);
  });

  it('adds one hit-less request per refined facet group, ignoring that group own filter', () => {
    const requests = buildPaintingsSearchRequests({
      ...base,
      tagFilters: ['Cats'],
      colorFilters: ['Red'],
    });

    expect(requests).toHaveLength(3);

    const [main, tagsCounts, colorCounts] = requests.map(paramsOf);
    expect(JSON.parse(main?.get('facetFilters') ?? '[]')).toEqual([
      ['tags:Cats'],
      ['dominantColors:Red'],
    ]);

    // Tag counts must ignore the tag selection but keep the color selection.
    expect(tagsCounts?.get('facets')).toBe('["tags"]');
    expect(JSON.parse(tagsCounts?.get('facetFilters') ?? '[]')).toEqual([['dominantColors:Red']]);
    expect(tagsCounts?.get('hitsPerPage')).toBe('0');
    expect(tagsCounts?.get('analytics')).toBe('false');

    expect(colorCounts?.get('facets')).toBe('["dominantColors"]');
    expect(JSON.parse(colorCounts?.get('facetFilters') ?? '[]')).toEqual([['tags:Cats']]);
  });

  it('can turn analytics off for server-side renders', () => {
    const [serverMain] = buildPaintingsSearchRequests({ ...base, analytics: false });
    const [clientMain] = buildPaintingsSearchRequests(base);
    expect(new URLSearchParams(serverMain?.params).get('analytics')).toBe('false');
    expect(new URLSearchParams(clientMain?.params).has('analytics')).toBe(false);
  });
});

describe('parsePaintingsSearchResults', () => {
  it('replaces the main facet counts with the disjunctive counts', () => {
    const merged = parsePaintingsSearchResults([
      { hits: [{ objectID: '1' }], nbHits: 1, facets: { tags: { Cats: 1 } } },
      { hits: [], nbHits: 5, facets: { tags: { Cats: 1, Dogs: 4 } } },
    ]);

    expect(merged?.nbHits).toBe(1);
    expect(merged?.facets.tags).toEqual({ Cats: 1, Dogs: 4 });
  });
});
