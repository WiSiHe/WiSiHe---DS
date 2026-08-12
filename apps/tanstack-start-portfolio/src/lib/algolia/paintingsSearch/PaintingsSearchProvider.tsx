'use client';

import { useNavigate, useSearch } from '@tanstack/react-router';
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
import { writePaintingsGalleryReturnUrl } from '@/lib/paintings/paintingsGalleryReturnUrl';
import { buildPaintingsSearchRequest } from './buildPaintingsSearchRequest';
import { PAINTINGS_HITS_PER_PAGE } from './constants';
import { buildTagFacetItems, facetMapToItems, isNsfwTagFilterActive } from './facetItems';
import { parsePaintingsSearchParams } from './parsePaintingsSearchParams';
import { parsePaintingsSearchResult } from './parsePaintingsSearchResult';
import type { PaintingsRouteSearch } from './searchParamsSchema';
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

function buildRouteSearch(input: {
  q?: string;
  tag?: string[];
  color?: string[];
  sale?: boolean;
  sort?: PaintingsSortKey;
  p?: number;
}): PaintingsRouteSearch {
  const next: PaintingsRouteSearch = {};

  if (input.q) next.q = input.q;
  if (input.tag?.length) next.tag = input.tag.join(',');
  if (input.color?.length) next.color = input.color.join(',');
  if (input.sale) next.sale = 'true';
  if (input.sort && input.sort !== 'featured') next.sort = input.sort;
  if (input.p !== undefined && input.p > 0) next.p = String(input.p + 1);

  return next;
}

function searchParamsToString(search: PaintingsRouteSearch): string {
  const params = new URLSearchParams();
  if (search.q) params.set('q', search.q);
  if (search.tag) params.set('tag', search.tag);
  if (search.color) params.set('color', search.color);
  if (search.sale) params.set('sale', search.sale);
  if (search.sort) params.set('sort', search.sort);
  if (search.p) params.set('p', search.p);
  return params.toString();
}

export function PaintingsSearchProvider({
  children,
  initialResults = null,
}: {
  children: ReactNode;
  initialResults?: PaintingsSearchResults | null;
}) {
  const routeSearch = useSearch({ from: '/paintings/' });
  const navigate = useNavigate({ from: '/paintings/' });
  const parsed = useMemo(() => parsePaintingsSearchParams(routeSearch), [routeSearch]);

  const [query, setQueryState] = useState(parsed.query);
  const [tagFilters, setTagFilters] = useState<string[]>(parsed.tagFilters);
  const [colorFilters, setColorFilters] = useState<string[]>(parsed.colorFilters);
  const [forSale, setForSale] = useState(parsed.forSale);
  const [sort, setSortState] = useState<PaintingsSortKey>(parsed.sort);
  const [page, setPageState] = useState(parsed.page);
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
      const nextSearch = buildRouteSearch({
        q: newFilters.q !== undefined ? newFilters.q : query,
        tag: newFilters.tag !== undefined ? newFilters.tag : tagFilters,
        color: newFilters.color !== undefined ? newFilters.color : colorFilters,
        sale: newFilters.sale !== undefined ? newFilters.sale : forSale,
        sort: newFilters.sort !== undefined ? newFilters.sort : sort,
        p: newFilters.p !== undefined ? newFilters.p : page,
      });

      navigate({
        search: nextSearch,
        replace: true,
        resetScroll: false,
      });
    },
    [query, tagFilters, colorFilters, forSale, sort, page, navigate],
  );

  useEffect(() => {
    setQueryState(parsed.query);
    setTagFilters(parsed.tagFilters);
    setColorFilters(parsed.colorFilters);
    setForSale(parsed.forSale);
    setSortState(parsed.sort);
    setPageState(parsed.page);
  }, [parsed]);

  useEffect(() => {
    const qs = searchParamsToString(routeSearch);
    writePaintingsGalleryReturnUrl(qs ? `/paintings?${qs}` : '/paintings');
  }, [routeSearch]);

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

          const parsedResult = parsePaintingsSearchResult(response.results[0]);
          if (parsedResult) {
            settledResultsRef.current = parsedResult;
            setResults(parsedResult);
          }
          setStatus('idle');
        })
        .catch(error => {
          if (requestId !== requestIdRef.current) return;
          if (import.meta.env.DEV) {
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
