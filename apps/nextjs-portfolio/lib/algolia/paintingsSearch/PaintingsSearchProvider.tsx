'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import { PAINTINGS_HITS_PER_PAGE } from './constants';
import { buildTagFacetItems, facetMapToItems, isNsfwTagFilterActive } from './facetItems';
import { parsePaintingsSearchResult } from './parsePaintingsSearchResult';
import type {
  PaintingAlgoliaHit,
  PaintingsFacetItem,
  PaintingsSearchResults,
  PaintingsSortKey,
} from './types';

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

export function PaintingsSearchProvider({
  children,
  initialResults = null,
}: {
  children: ReactNode;
  initialResults?: PaintingsSearchResults | null;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read initial values from URL
  const initialQuery = searchParams.get('q') || '';
  const initialTags = useMemo(
    () => searchParams.get('tag')?.split(',').filter(Boolean) || [],
    [searchParams],
  );
  const initialColors = useMemo(
    () => searchParams.get('color')?.split(',').filter(Boolean) || [],
    [searchParams],
  );
  const initialForSale = searchParams.get('sale') === 'true';
  const initialSort = (searchParams.get('sort') as PaintingsSortKey) || 'featured';
  const initialPage = Math.max(0, parseInt(searchParams.get('p') || '1', 10) - 1);

  const [query, setQueryState] = useState(initialQuery);
  const [tagFilters, setTagFilters] = useState<string[]>(initialTags);
  const [colorFilters, setColorFilters] = useState<string[]>(initialColors);
  const [forSale, setForSale] = useState(initialForSale);
  const [sort, setSortState] = useState<PaintingsSortKey>(initialSort);
  const [page, setPageState] = useState(initialPage);
  const [status, setStatus] = useState<'idle' | 'loading'>(initialResults ? 'idle' : 'loading');
  const [results, setResults] = useState<PaintingsSearchResults | null>(initialResults);

  const settledResultsRef = useRef<PaintingsSearchResults | null>(initialResults);
  const requestIdRef = useRef(0);
  const skipInitialFetchRef = useRef(initialResults != null);

  const updateUrl = useCallback(
    (newFilters: {
      q?: string;
      tag?: string[];
      color?: string[];
      sale?: boolean;
      sort?: PaintingsSortKey;
      p?: number;
    }) => {
      const currentParams = new URLSearchParams();

      const q = newFilters.q !== undefined ? newFilters.q : query;
      const tag = newFilters.tag !== undefined ? newFilters.tag : tagFilters;
      const color = newFilters.color !== undefined ? newFilters.color : colorFilters;
      const sale = newFilters.sale !== undefined ? newFilters.sale : forSale;
      const s = newFilters.sort !== undefined ? newFilters.sort : sort;
      const p = newFilters.p !== undefined ? newFilters.p : page;

      if (q) currentParams.set('q', q);
      if (tag.length) currentParams.set('tag', tag.join(','));
      if (color.length) currentParams.set('color', color.join(','));
      if (sale) currentParams.set('sale', 'true');
      if (s !== 'featured') currentParams.set('sort', s);
      if (p > 0) currentParams.set('p', String(p + 1));

      const search = currentParams.toString();
      const queryStr = search ? `?${search}` : '';

      router.replace(`${pathname}${queryStr}`, { scroll: false });
    },
    [query, tagFilters, colorFilters, forSale, sort, page, router, pathname],
  );

  // Sync URL changes to React state (e.g. browser back/forward buttons)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const tag = searchParams.get('tag')?.split(',').filter(Boolean) || [];
    const color = searchParams.get('color')?.split(',').filter(Boolean) || [];
    const sale = searchParams.get('sale') === 'true';
    const s = (searchParams.get('sort') as PaintingsSortKey) || 'featured';
    const p = Math.max(0, parseInt(searchParams.get('p') || '1', 10) - 1);

    if (q !== query) setQueryState(q);

    const tagChanged = tag.length !== tagFilters.length || tag.some((t, i) => t !== tagFilters[i]);
    if (tagChanged) setTagFilters(tag);

    const colorChanged =
      color.length !== colorFilters.length || color.some((c, i) => c !== colorFilters[i]);
    if (colorChanged) setColorFilters(color);

    if (sale !== forSale) setForSale(sale);
    if (s !== sort) setSortState(s);
    if (p !== page) setPageState(p);
  }, [searchParams, query, tagFilters, colorFilters, forSale, sort, page]);

  const setQuery = useCallback(
    (next: string) => {
      setPageState(0);
      setQueryState(next);
      updateUrl({ q: next, p: 0 });
    },
    [updateUrl],
  );

  const setSort = useCallback(
    (next: PaintingsSortKey) => {
      setPageState(0);
      setSortState(next);
      updateUrl({ sort: next, p: 0 });
    },
    [updateUrl],
  );

  const setPage = useCallback(
    (next: number) => {
      setPageState(next);
      updateUrl({ p: next });
    },
    [updateUrl],
  );

  const toggleTag = useCallback(
    (value: string) => {
      setPageState(0);
      const nextTags = tagFilters.includes(value)
        ? tagFilters.filter(item => item !== value)
        : [...tagFilters, value];
      setTagFilters(nextTags);
      updateUrl({ tag: nextTags, p: 0 });
    },
    [tagFilters, updateUrl],
  );

  const toggleColor = useCallback(
    (value: string) => {
      setPageState(0);
      const nextColors = colorFilters.includes(value)
        ? colorFilters.filter(item => item !== value)
        : [...colorFilters, value];
      setColorFilters(nextColors);
      updateUrl({ color: nextColors, p: 0 });
    },
    [colorFilters, updateUrl],
  );

  const toggleForSale = useCallback(() => {
    setPageState(0);
    const nextSale = !forSale;
    setForSale(nextSale);
    updateUrl({ sale: nextSale, p: 0 });
  }, [forSale, updateUrl]);

  useEffect(() => {
    if (!searchClient) return;

    if (skipInitialFetchRef.current) {
      skipInitialFetchRef.current = false;
      return;
    }

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
              hitsPerPage: PAINTINGS_HITS_PER_PAGE,
              tagFilters,
              colorFilters,
              forSale,
              sort,
            }),
          ],
        })
        .then(response => {
          if (requestId !== requestIdRef.current) return;

          const parsed = parsePaintingsSearchResult(response.results[0]);
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
