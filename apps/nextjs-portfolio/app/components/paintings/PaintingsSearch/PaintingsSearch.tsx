'use client';

import { cn } from '@wisihe/utils';
import { memo, startTransition, useDeferredValue, useEffect, useRef, useState } from 'react';
import { BsEye } from 'react-icons/bs';
import {
  IoCheckmark,
  IoChevronDown,
  IoClose,
  IoFilterOutline,
  IoHeartOutline,
  IoHourglassOutline,
  IoStarOutline,
  IoTimeOutline,
} from 'react-icons/io5';
import {
  Configure,
  useCurrentRefinements,
  useInstantSearch,
  useRefinementList,
  useSortBy,
  useStats,
} from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import SearchAnalytics from '@/app/components/search/SearchAnalytics';
import { getGlobalLenis } from '@/app/lib/lenis-registry';
import {
  ALGOLIA_INDEX_NAME,
  PAINTING_HIT_ATTRIBUTES,
  PAINTINGS_INDEX_FILTER,
  replicaIndexName,
} from '@/lib/algolia/constants';
import { tagFacetTransformItems } from '@/lib/algolia/facets';
import { isAlgoliaConfigured, searchClient } from '@/lib/algolia/searchClient';
import CustomHits from './CustomHits';
import CustomRefinementList from './CustomRefinementList';
import CustomSearchBox from './CustomSearchBox';
import ForSaleFilter from './ForSaleFilter';
import PaintingsPagination from './PaintingsPagination';

// ── Colour swatch map ────────────────────────────────────────────────────────
const COLOR_SWATCHES: Record<string, string> = {
  Red: '#c0392b',
  Orange: '#e67e22',
  Yellow: '#f1c40f',
  Green: '#27ae60',
  Teal: '#16a085',
  Blue: '#2980b9',
  Purple: '#8e44ad',
  Pink: '#e91e8c',
  Black: '#1a1a1a',
  Grey: '#7f8c8d',
  White: '#ecf0f1',
};

const COLOR_ORDER = [
  'Red',
  'Orange',
  'Yellow',
  'Green',
  'Teal',
  'Blue',
  'Purple',
  'Pink',
  'Black',
  'Grey',
  'White',
];

function ColourRefinement() {
  const { items, refine } = useRefinementList({ attribute: 'dominantColors', limit: 20 });
  const deferredItems = useDeferredValue(items);

  if (deferredItems.length === 0) return null;

  const sorted = [...deferredItems].sort((a, b) => {
    const ai = COLOR_ORDER.indexOf(a.label);
    const bi = COLOR_ORDER.indexOf(b.label);
    if (ai === -1 && bi === -1) return a.label.localeCompare(b.label);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div className='flex flex-wrap gap-2'>
      {sorted.map(item => {
        const swatch = COLOR_SWATCHES[item.label] ?? '#aaa';
        return (
          <button
            key={item.label}
            type='button'
            onClick={() => startTransition(() => refine(item.value))}
            title={`${item.label} (${item.count})`}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 border',
              item.isRefined
                ? 'bg-foreground text-background border-foreground shadow-sm'
                : 'bg-surface border-border text-foreground-subtle hover:border-foreground-muted hover:text-foreground',
            )}
          >
            <span
              className='w-3.5 h-3.5 rounded-full border border-black/10 shrink-0'
              style={{ backgroundColor: swatch }}
            />
            {item.label}
            <span className='text-[10px] opacity-60'>{item.count}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// HitStats + custom Sort dropdown — compact results header
// ---------------------------------------------------------------------------
type SortItem = { label: string; value: string; icon?: React.ReactNode };

function SortDropdown({ items }: { items: SortItem[] }) {
  const { currentRefinement, refine } = useSortBy({ items });
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = items.find(i => i.value === currentRefinement) ??
    items[0] ?? { label: 'Sort', value: '' };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className='relative'>
      <button
        type='button'
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150',
          'bg-surface border border-border text-foreground-subtle',
          'hover:border-accent-border hover:text-foreground',
          open && 'border-accent text-foreground',
        )}
      >
        {current.icon && <span className='shrink-0'>{current.icon}</span>}
        {current.label}
        <IoChevronDown
          className={cn('w-3.5 h-3.5 transition-transform duration-150', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className='absolute right-0 top-full mt-1.5 z-50 min-w-[140px] bg-surface border border-border rounded-xl shadow-lg overflow-hidden'>
          {items.map(item => (
            <button
              key={item.value}
              type='button'
              onClick={() => {
                refine(item.value);
                setOpen(false);
              }}
              className={cn(
                'w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors duration-100 text-left',
                item.value === currentRefinement
                  ? 'text-foreground bg-surface-hover font-medium'
                  : 'text-foreground-subtle hover:text-foreground hover:bg-surface-hover',
              )}
            >
              <span className='flex items-center gap-2'>
                {item.icon && <span className='shrink-0 opacity-60'>{item.icon}</span>}
                {item.label}
              </span>
              {item.value === currentRefinement && (
                <IoCheckmark className='w-3.5 h-3.5 text-accent shrink-0' />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type HitStatsProps = { sortItems: SortItem[] };

function HitStatsWithSort({ sortItems }: HitStatsProps) {
  const { nbHits, page, hitsPerPage } = useStats();
  const { status } = useInstantSearch();
  const isPending = status === 'loading' || status === 'stalled';

  if (nbHits === 0 || hitsPerPage === undefined) return null;
  const from = page * hitsPerPage + 1;
  const to = Math.min((page + 1) * hitsPerPage, nbHits);

  return (
    <div className='flex items-center justify-between gap-4 mb-2'>
      <p className='text-sm text-foreground-subtle'>
        <span className='font-medium text-foreground'>
          {from}–{to}
        </span>{' '}
        of <span className='font-medium text-foreground'>{nbHits.toLocaleString()}</span> paintings
        {isPending ? (
          <span className='ml-2 text-xs text-foreground-muted' aria-live='polite'>
            Updating…
          </span>
        ) : null}
      </p>
      <SortDropdown items={sortItems} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ScrollToResults — scroll after user-driven search changes (not initial load)
// ---------------------------------------------------------------------------
const RESULTS_ID = 'paintings-results';
const PAGE_HEADER_OFFSET = -128;

type SearchSnapshot = {
  page: number;
  query: string;
  refinements: string;
};

function scrollPageToTop() {
  const lenis = getGlobalLenis();
  if (lenis) {
    lenis.scrollTo(0, { duration: 0.6 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function scrollResultsIntoView() {
  const el = document.getElementById(RESULTS_ID);
  if (!el) return;

  const lenis = getGlobalLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: PAGE_HEADER_OFFSET, duration: 0.6 });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function ScrollToResults() {
  const { results } = useInstantSearch();
  const snapshotRef = useRef<SearchSnapshot | null>(null);

  useEffect(() => {
    if (!results) return;

    const page = results.page ?? 0;
    const query = results.query ?? '';
    const refinements = JSON.stringify(results._state?.disjunctiveFacetsRefinements ?? {});

    const previous = snapshotRef.current;
    if (previous === null) {
      snapshotRef.current = { page, query, refinements };
      return;
    }

    const pageChanged = previous.page !== page;
    const queryChanged = previous.query !== query;
    const refinementsChanged = previous.refinements !== refinements;

    snapshotRef.current = { page, query, refinements };

    if (!pageChanged && !queryChanged && !refinementsChanged) {
      return;
    }

    // Page/query changes scroll the user back to results; refinement toggles keep
    // the sidebar in view on desktop so skip the expensive Lenis scroll there.
    if (refinementsChanged && !pageChanged && !queryChanged) {
      return;
    }

    // Let InstantSearch paint the new hits before scrolling.
    window.setTimeout(() => {
      if (pageChanged) {
        scrollPageToTop();
      } else {
        scrollResultsIntoView();
      }
    }, 80);
  }, [results]);

  return null;
}

// ---------------------------------------------------------------------------
// MobileFilterButton — shows active refinement count badge
// ---------------------------------------------------------------------------
function MobileFilterButton({ onClick }: { onClick: () => void }) {
  const { items } = useCurrentRefinements();
  const activeCount = items.reduce((sum, item) => sum + item.refinements.length, 0);
  return (
    <div className='md:hidden w-full'>
      <button
        type='button'
        onClick={onClick}
        className='w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-surface border border-border text-sm font-medium text-foreground hover:border-accent-border hover:bg-surface-hover transition-all duration-200 shadow-sm'
      >
        <IoFilterOutline className='w-4 h-4' />
        Filters
        {activeCount > 0 && (
          <span className='inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-accent text-accent-contrast rounded-full'>
            {activeCount}
          </span>
        )}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FiltersSidebar — defined OUTSIDE the parent so React never creates a new
// component identity on re-render (which would reset Algolia widget state).
// ---------------------------------------------------------------------------
const FiltersSidebar = memo(function FiltersSidebar() {
  return (
    <>
      {/* Search */}
      <div className='flex flex-col gap-1.5'>
        <p className='text-xs font-semibold text-foreground-muted uppercase tracking-wider'>
          Search
        </p>
        <CustomSearchBox />
      </div>

      {/* For sale — always visible, pinned above tag facets */}
      <div className='flex flex-col gap-1.5'>
        <p className='text-xs font-semibold text-foreground-muted uppercase tracking-wider'>Shop</p>
        <ForSaleFilter />
      </div>

      {/* Colour */}
      <div className='flex flex-col gap-2'>
        <p className='text-xs font-semibold text-foreground-muted uppercase tracking-wider'>
          Colour
        </p>
        <ColourRefinement />
      </div>

      {/* Tags — CustomRefinementList handles its own expand/collapse */}
      <div className='flex flex-col gap-2'>
        <p className='text-xs font-semibold text-foreground-muted uppercase tracking-wider'>Tags</p>
        <CustomRefinementList attribute='tags' limit={50} transformItems={tagFacetTransformItems} />
      </div>
    </>
  );
});

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function PaintingsSearch() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktopLayout(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileFiltersOpen && !isDesktopLayout ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDesktopLayout, isMobileFiltersOpen]);

  const mobileDrawerClosed = !isDesktopLayout && !isMobileFiltersOpen;

  if (!isAlgoliaConfigured || !searchClient) {
    return (
      <div className='mt-4 rounded-xl border border-border bg-surface px-6 py-10 text-center'>
        <p className='text-lg font-medium text-foreground'>Gallery search is unavailable</p>
        <p className='mt-2 text-sm text-foreground-subtle'>
          Algolia environment variables are missing. Add{' '}
          <code className='text-xs'>NEXT_PUBLIC_ALGOLIA_APP_ID</code> and{' '}
          <code className='text-xs'>NEXT_PUBLIC_ALGOLIA_SEARCH_KEY</code> to your environment.
        </p>
      </div>
    );
  }

  const sortItems = [
    {
      label: 'Featured',
      value: ALGOLIA_INDEX_NAME,
      icon: <IoStarOutline className='w-3.5 h-3.5' />,
    },
    {
      label: 'Newest',
      value: replicaIndexName('newest'),
      icon: <IoTimeOutline className='w-3.5 h-3.5' />,
    },
    {
      label: 'Oldest',
      value: replicaIndexName('oldest'),
      icon: <IoHourglassOutline className='w-3.5 h-3.5' />,
    },
    {
      label: 'Most Viewed',
      value: replicaIndexName('views'),
      icon: <BsEye className='w-3.5 h-3.5' />,
    },
    {
      label: 'Most Liked',
      value: replicaIndexName('likes'),
      icon: <IoHeartOutline className='w-3.5 h-3.5' />,
    },
  ];

  return (
    <InstantSearchNext
      searchClient={searchClient}
      indexName={ALGOLIA_INDEX_NAME}
      routing
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure
        hitsPerPage={18}
        filters={PAINTINGS_INDEX_FILTER}
        attributesToRetrieve={[...PAINTING_HIT_ATTRIBUTES]}
        facets={['tags', 'dominantColors', 'isForSale']}
        maxValuesPerFacet={50}
      />
      <SearchAnalytics section='paintings' />
      <ScrollToResults />

      <div className='flex flex-col md:flex-row gap-8 w-full mt-4'>
        <MobileFilterButton onClick={() => setIsMobileFiltersOpen(true)} />

        {/* Mobile backdrop */}
        <div
          aria-hidden='true'
          onClick={() => setIsMobileFiltersOpen(false)}
          className={cn(
            'fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden',
            'transition-opacity duration-300',
            isMobileFiltersOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
          )}
        />

        {/*
          Single filter panel — one set of Algolia widgets for mobile drawer + desktop sidebar.
          Duplicating FiltersSidebar doubled facet work and caused visible lag on filter toggles.
        */}
        <div
          className={cn(
            'flex flex-col gap-6 z-50',
            'max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:w-full max-md:max-h-[90dvh] max-md:overflow-y-auto',
            'max-md:bg-background max-md:border-t max-md:border-border max-md:shadow-2xl max-md:p-6 max-md:rounded-t-3xl',
            'max-md:transition-transform max-md:duration-300 max-md:ease-out',
            isMobileFiltersOpen
              ? 'max-md:translate-y-0'
              : 'max-md:translate-y-full max-md:pointer-events-none',
            'md:relative md:w-56 md:shrink-0 md:translate-y-0 md:pointer-events-auto md:p-0 md:border-0 md:shadow-none md:max-h-none md:overflow-visible',
          )}
          inert={mobileDrawerClosed || undefined}
          role={isDesktopLayout ? undefined : 'dialog'}
          aria-modal={isDesktopLayout ? undefined : isMobileFiltersOpen}
          aria-label={isDesktopLayout ? undefined : 'Filters & Search'}
          aria-hidden={mobileDrawerClosed || undefined}
        >
          <div className='flex items-center justify-between pb-2 border-b border-border/50 md:hidden'>
            <h2 className='text-xl font-bold text-foreground'>Filters &amp; Search</h2>
            <button
              type='button'
              onClick={() => setIsMobileFiltersOpen(false)}
              className='p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors'
              aria-label='Close filters'
            >
              <IoClose className='w-6 h-6' />
            </button>
          </div>

          <FiltersSidebar />
        </div>

        <div id={RESULTS_ID} className='grow flex flex-col min-w-0'>
          <HitStatsWithSort sortItems={sortItems} />
          <CustomHits />
          <PaintingsPagination />
        </div>
      </div>
    </InstantSearchNext>
  );
}
