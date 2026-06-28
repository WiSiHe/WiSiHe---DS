'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { searchClient } from '@/lib/algolia/searchClient';
import { buildPaintingsSearchRequest } from './buildPaintingsSearchRequest';
import { buildTagFacetItems, facetMapToItems, isNsfwTagFilterActive } from './facetItems';
import type {
  PaintingAlgoliaHit,
  PaintingsFacetItem,
  PaintingsSearchResults,
  PaintingsSortKey,
} from './types';

const HITS_PER_PAGE = 18;
const SEARCH_DEBOUNCE_MS = 120;

type PaintingsSearchContextValue = {
  query: string;
  setQuery: (query: string) => void;
  tagFilters: string[];
  colorFilters: string[];
  forSale: boolean;
  sort: PaintingsSortKey;
  page: number;
  status: 'idle' | 'loading';
  hits: PaintingAlgoliaHit[];
  nbHits: number;
  nbPages: number;
  tagItems: PaintingsFacetItem[];
  colorItems: PaintingsFacetItem[];
  nsfwFilterActive: boolean;
  toggleTag: (value: string) => void;
  toggleColor: (value: string) => void;
  toggleForSale: () => void;
  setSort: (sort: PaintingsSortKey) => void;
  setPage: (page: number) => void;
};

const PaintingsSearchContext = createContext<PaintingsSearchContextValue | null>(null);

export function usePaintingsSearchContext(): PaintingsSearchContextValue {
  const ctx = useContext(PaintingsSearchContext);
  if (!ctx) {
    throw new Error('usePaintingsSearchContext must be used within PaintingsSearchProvider');
  }
  return ctx;
}

function parseSearchResult(result: unknown): PaintingsSearchResults | null {
  if (!result || typeof result !== 'object') return null;
  const r = result as Record<string, unknown>;
  if (!Array.isArray(r['hits'])) return null;

  const facetsRaw = r['facets'];
  const facets =
    facetsRaw && typeof facetsRaw === 'object'
      ? (facetsRaw as PaintingsSearchResults['facets'])
      : {};

  return {
    hits: r['hits'] as PaintingAlgoliaHit[],
    nbHits: typeof r['nbHits'] === 'number' ? r['nbHits'] : 0,
    page: typeof r['page'] === 'number' ? r['page'] : 0,
    nbPages: typeof r['nbPages'] === 'number' ? r['nbPages'] : 0,
    hitsPerPage: typeof r['hitsPerPage'] === 'number' ? r['hitsPerPage'] : HITS_PER_PAGE,
    facets,
  };
}

export function PaintingsSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQueryState] = useState('');
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [colorFilters, setColorFilters] = useState<string[]>([]);
  const [forSale, setForSale] = useState(false);
  const [sort, setSortState] = useState<PaintingsSortKey>('featured');
  const [page, setPageState] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading'>('loading');
  const [results, setResults] = useState<PaintingsSearchResults | null>(null);

  const settledResultsRef = useRef<PaintingsSearchResults | null>(null);
  const requestIdRef = useRef(0);

  const setQuery = useCallback((next: string) => {
    setPageState(0);
    setQueryState(next);
  }, []);

  const setSort = useCallback((next: PaintingsSortKey) => {
    setPageState(0);
    setSortState(next);
  }, []);

  const setPage = useCallback((next: number) => {
    setPageState(next);
  }, []);

  const toggleTag = useCallback((value: string) => {
    setPageState(0);
    setTagFilters(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value],
    );
  }, []);

  const toggleColor = useCallback((value: string) => {
    setPageState(0);
    setColorFilters(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value],
    );
  }, []);

  const toggleForSale = useCallback(() => {
    setPageState(0);
    setForSale(prev => !prev);
  }, []);

  useEffect(() => {
    if (!searchClient) return;

    const requestId = ++requestIdRef.current;
    setStatus('loading');

    const timer = window.setTimeout(() => {
      const client = searchClient;
      if (!client) return;

      void client
        .search({
          requests: [
            buildPaintingsSearchRequest({
              query,
              page,
              hitsPerPage: HITS_PER_PAGE,
              tagFilters,
              colorFilters,
              forSale,
              sort,
            }),
          ],
        })
        .then(response => {
          if (requestId !== requestIdRef.current) return;

          const parsed = parseSearchResult(response.results[0]);
          if (parsed) {
            settledResultsRef.current = parsed;
            setResults(parsed);
          }
          setStatus('idle');
        })
        .catch(error => {
          if (requestId !== requestIdRef.current) return;
          if (process.env.NODE_ENV === 'development') {
            console.error('[PaintingsSearch] Algolia request failed', error);
          }
          setStatus('idle');
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query, page, tagFilters, colorFilters, forSale, sort]);

  const displayResults = status === 'loading' ? settledResultsRef.current : results;

  const tagItems = useMemo(
    () => buildTagFacetItems(displayResults?.facets.tags, tagFilters),
    [displayResults?.facets.tags, tagFilters],
  );

  const colorItems = useMemo(
    () => facetMapToItems(displayResults?.facets.dominantColors, colorFilters),
    [displayResults?.facets.dominantColors, colorFilters],
  );

  const value = useMemo<PaintingsSearchContextValue>(
    () => ({
      query,
      setQuery,
      tagFilters,
      colorFilters,
      forSale,
      sort,
      page,
      status,
      hits: displayResults?.hits ?? [],
      nbHits: displayResults?.nbHits ?? 0,
      nbPages: displayResults?.nbPages ?? 0,
      tagItems,
      colorItems,
      nsfwFilterActive: isNsfwTagFilterActive(tagFilters),
      toggleTag,
      toggleColor,
      toggleForSale,
      setSort,
      setPage,
    }),
    [
      query,
      setQuery,
      tagFilters,
      colorFilters,
      forSale,
      sort,
      page,
      status,
      displayResults,
      tagItems,
      colorItems,
      toggleTag,
      toggleColor,
      toggleForSale,
      setSort,
      setPage,
    ],
  );

  return (
    <PaintingsSearchContext.Provider value={value}>{children}</PaintingsSearchContext.Provider>
  );
}
