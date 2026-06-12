'use client';

import { cn } from '@wisihe/utils';
import { LayoutGroup, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
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
  Pagination,
  useCurrentRefinements,
  useInstantSearch,
  useRefinementList,
  useSortBy,
  useStats,
} from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';
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

  if (items.length === 0) return null;

  const sorted = [...items].sort((a, b) => {
    const ai = COLOR_ORDER.indexOf(a.label);
    const bi = COLOR_ORDER.indexOf(b.label);
    if (ai === -1 && bi === -1) return a.label.localeCompare(b.label);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <LayoutGroup id='colour-chips'>
      <motion.div layout className='flex flex-wrap gap-2'>
        {sorted.map(item => {
          const swatch = COLOR_SWATCHES[item.label] ?? '#aaa';
          return (
            <motion.button
              key={item.label}
              layout
              type='button'
              onClick={() => refine(item.value)}
              title={`${item.label} (${item.count})`}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
            </motion.button>
          );
        })}
      </motion.div>
    </LayoutGroup>
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
      </p>
      <SortDropdown items={sortItems} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ScrollToResults — scrolls the results area into view after every search
// ---------------------------------------------------------------------------
const RESULTS_ID = 'paintings-results';

function ScrollToResults() {
  const { results } = useInstantSearch();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the very first render — only scroll on subsequent state changes
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const el = document.getElementById(RESULTS_ID);
    if (el) {
      // Small delay so the DOM has updated before we scroll
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
    // results._state changes on every new search / page turn / filter toggle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results?.queryID, results?.page, results?._state?.disjunctiveFacetsRefinements]);

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
function FiltersSidebar() {
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
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function PaintingsSearch() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileFiltersOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFiltersOpen]);

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
      />
      <ScrollToResults />

      <div className='flex flex-col md:flex-row gap-8 w-full mt-4'>
        {/* ---------------------------------------------------------------- */}
        {/* Mobile — Filter toggle button                                    */}
        {/* ---------------------------------------------------------------- */}
        <MobileFilterButton onClick={() => setIsMobileFiltersOpen(true)} />

        {/* ---------------------------------------------------------------- */}
        {/* Mobile — Always-mounted slide-up drawer                         */}
        {/*                                                                  */}
        {/* IMPORTANT: We do NOT use HeadlessUI <Dialog> here because it    */}
        {/* unmounts its children on close, which destroys the Algolia      */}
        {/* widgets and clears all active refinements.                       */}
        {/*                                                                  */}
        {/* Instead we keep the panel always in the DOM and animate it with  */}
        {/* a CSS transform, so widgets are never unmounted.                 */}
        {/* ---------------------------------------------------------------- */}
        <div className='md:hidden'>
          {/* Backdrop — click to close */}
          <div
            aria-hidden='true'
            onClick={() => setIsMobileFiltersOpen(false)}
            className={cn(
              'fixed inset-0 z-40 bg-background/80 backdrop-blur-sm',
              'transition-opacity duration-300',
              isMobileFiltersOpen
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none',
            )}
          />

          {/* Drawer panel — always mounted, slides in/out */}
          <div
            role='dialog'
            aria-modal='true'
            aria-label='Filters & Search'
            // When closed, keep widgets mounted but non-interactive (aria-hidden + focusables fails axe)
            inert={!isMobileFiltersOpen}
            className={cn(
              'fixed inset-x-0 bottom-0 z-50',
              'w-full bg-background max-h-[90dvh] flex flex-col overflow-y-auto',
              'border-t border-border shadow-2xl p-6 gap-6 rounded-t-3xl',
              'transition-transform duration-300 ease-out',
              isMobileFiltersOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none',
            )}
          >
            {/* Header */}
            <div className='flex items-center justify-between pb-2 border-b border-border/50'>
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

            {/* Filters content */}
            <div className='flex flex-col gap-6 pb-10'>
              <FiltersSidebar />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Desktop — Sidebar (always visible, always mounted)              */}
        {/* ---------------------------------------------------------------- */}
        <div className='hidden md:flex w-56 shrink-0 flex-col gap-6'>
          <FiltersSidebar />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Main content                                                     */}
        {/* ---------------------------------------------------------------- */}
        <div id={RESULTS_ID} className='grow flex flex-col min-w-0'>
          <HitStatsWithSort sortItems={sortItems} />
          <CustomHits />

          <div className='mt-12 flex justify-center w-full'>
            <Pagination
              classNames={{
                root: 'flex justify-center',
                list: 'flex items-center gap-1.5',
                item: 'flex items-center',
                link: 'min-w-10 px-2.5 py-2 text-sm rounded-md transition-all duration-200 text-center text-foreground-subtle hover:bg-surface-hover hover:text-foreground border border-transparent',
                selectedItem: 'bg-accent/10 border-accent text-accent font-semibold',
                disabledItem: 'opacity-50 cursor-not-allowed pointer-events-none',
              }}
            />
          </div>
        </div>
      </div>
    </InstantSearchNext>
  );
}
