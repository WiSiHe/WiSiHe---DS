'use client';

import { cn } from '@wisihe/utils';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
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
  PaintingsSearchProvider,
  usePaintingsSearchContext,
} from '@/lib/algolia/paintingsSearch/PaintingsSearchProvider';
import type { PaintingsSortKey } from '@/lib/algolia/paintingsSearch/types';
import { isAlgoliaConfigured, searchClient } from '@/lib/algolia/searchClient';
import CustomHits from './CustomHits';
import PaintingsFacetList from './PaintingsFacetList';
import PaintingsForSaleFilter from './PaintingsForSaleFilter';
import PaintingsSearchBox from './PaintingsSearchBox';
import PaintingsSearchPagination from './PaintingsSearchPagination';

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

type SortItem = {
  key: PaintingsSortKey;
  label: string;
  icon?: React.ReactNode;
};

const SORT_ITEMS: SortItem[] = [
  { key: 'featured', label: 'Featured', icon: <IoStarOutline className='w-3.5 h-3.5' /> },
  { key: 'newest', label: 'Newest', icon: <IoTimeOutline className='w-3.5 h-3.5' /> },
  { key: 'oldest', label: 'Oldest', icon: <IoHourglassOutline className='w-3.5 h-3.5' /> },
  { key: 'views', label: 'Most Viewed', icon: <BsEye className='w-3.5 h-3.5' /> },
  { key: 'likes', label: 'Most Liked', icon: <IoHeartOutline className='w-3.5 h-3.5' /> },
];

function ColourRefinement() {
  const { colorItems, toggleColor } = usePaintingsSearchContext();

  const sorted = useMemo(() => {
    if (colorItems.length === 0) return [];
    return [...colorItems].sort((a, b) => {
      const ai = COLOR_ORDER.indexOf(a.label);
      const bi = COLOR_ORDER.indexOf(b.label);
      if (ai === -1 && bi === -1) return a.label.localeCompare(b.label);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [colorItems]);

  if (sorted.length === 0) return null;

  return (
    <div className='flex flex-wrap gap-2'>
      {sorted.map(item => {
        const swatch = COLOR_SWATCHES[item.label] ?? '#aaa';
        return (
          <button
            key={item.label}
            type='button'
            onClick={() => toggleColor(item.value)}
            title={`${item.label} (${item.count})`}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border',
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
            <span className='text-[10px] opacity-60 tabular-nums'>{item.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function SortDropdown() {
  const { sort, setSort } = usePaintingsSearchContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SORT_ITEMS.find(item => item.key === sort) ?? SORT_ITEMS[0]!;

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className='relative'>
      <button
        type='button'
        onClick={() => setOpen(value => !value)}
        className={cn(
          'flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap',
          'bg-surface border border-border text-foreground-subtle',
          'hover:border-accent-border hover:text-foreground',
          open && 'border-accent text-foreground',
        )}
      >
        {current.icon}
        {current.label}
        <IoChevronDown className={cn('w-3.5 h-3.5', open && 'rotate-180')} />
      </button>

      {open ? (
        <div className='absolute right-0 top-full mt-1.5 z-50 w-max min-w-full bg-surface border border-border rounded-xl shadow-lg overflow-hidden'>
          {SORT_ITEMS.map(item => (
            <button
              key={item.key}
              type='button'
              onClick={() => {
                setSort(item.key);
                setOpen(false);
              }}
              className={cn(
                'w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-left whitespace-nowrap',
                item.key === sort
                  ? 'text-foreground bg-surface-hover font-medium'
                  : 'text-foreground-subtle hover:text-foreground hover:bg-surface-hover',
              )}
            >
              <span className='flex items-center gap-2 shrink-0'>
                {item.icon}
                {item.label}
              </span>
              {item.key === sort ? (
                <IoCheckmark className='w-3.5 h-3.5 shrink-0 text-accent' />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function HitStatsWithSort() {
  const { nbHits, page, status } = usePaintingsSearchContext();
  const hitsPerPage = 18;

  if (nbHits === 0) return null;

  const from = page * hitsPerPage + 1;
  const to = Math.min((page + 1) * hitsPerPage, nbHits);

  return (
    <div className='flex items-center justify-between gap-4 mb-2'>
      <p className='text-sm text-foreground-subtle'>
        <span className='font-medium text-foreground'>
          {from}–{to}
        </span>{' '}
        of <span className='font-medium text-foreground'>{nbHits.toLocaleString()}</span> paintings
        {status === 'loading' ? (
          <span className='ml-2 text-xs text-foreground-muted' aria-live='polite'>
            Updating…
          </span>
        ) : null}
      </p>
      <SortDropdown />
    </div>
  );
}

function MobileFilterButton({ onClick }: { onClick: () => void }) {
  const { tagFilters, colorFilters, forSale } = usePaintingsSearchContext();
  const activeCount = tagFilters.length + colorFilters.length + (forSale ? 1 : 0);

  return (
    <div className='md:hidden w-full'>
      <button
        type='button'
        onClick={onClick}
        className='w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-surface border border-border text-sm font-medium text-foreground hover:border-accent-border hover:bg-surface-hover shadow-sm'
      >
        <IoFilterOutline className='w-4 h-4' />
        Filters
        {activeCount > 0 ? (
          <span className='inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-accent text-accent-contrast rounded-full'>
            {activeCount}
          </span>
        ) : null}
      </button>
    </div>
  );
}

const FiltersSidebar = memo(function FiltersSidebar() {
  const { tagItems, toggleTag } = usePaintingsSearchContext();

  return (
    <>
      <div className='flex flex-col gap-1.5'>
        <p className='text-xs font-semibold text-foreground-muted uppercase tracking-wider'>
          Search
        </p>
        <PaintingsSearchBox />
      </div>

      <div className='flex flex-col gap-1.5'>
        <p className='text-xs font-semibold text-foreground-muted uppercase tracking-wider'>Shop</p>
        <PaintingsForSaleFilter />
      </div>

      <div className='flex flex-col gap-2'>
        <p className='text-xs font-semibold text-foreground-muted uppercase tracking-wider'>
          Colour
        </p>
        <ColourRefinement />
      </div>

      <div className='flex flex-col gap-2'>
        <p className='text-xs font-semibold text-foreground-muted uppercase tracking-wider'>Tags</p>
        <PaintingsFacetList items={tagItems} onToggle={toggleTag} />
      </div>
    </>
  );
});

function PaintingsSearchLayout() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isDesktopLayout, setIsDesktopLayout] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(min-width: 768px)').matches;
  });

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

  return (
    <div className='flex flex-col md:flex-row gap-8 w-full mt-4'>
      <MobileFilterButton onClick={() => setIsMobileFiltersOpen(true)} />

      <div
        aria-hidden='true'
        onClick={() => setIsMobileFiltersOpen(false)}
        className={cn(
          'fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden transition-opacity duration-300',
          isMobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      />

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
        role={isDesktopLayout ? undefined : 'dialog'}
        aria-modal={isDesktopLayout ? undefined : isMobileFiltersOpen}
        aria-label={isDesktopLayout ? undefined : 'Filters & Search'}
      >
        <div className='flex items-center justify-between pb-2 border-b border-border/50 md:hidden'>
          <h2 className='text-xl font-bold text-foreground'>Filters &amp; Search</h2>
          <button
            type='button'
            onClick={() => setIsMobileFiltersOpen(false)}
            className='p-2 -mr-2 text-foreground-muted hover:text-foreground hover:bg-surface-hover rounded-full'
            aria-label='Close filters'
          >
            <IoClose className='w-6 h-6' />
          </button>
        </div>

        <FiltersSidebar />
      </div>

      <div id='paintings-results' className='grow flex flex-col min-w-0'>
        <HitStatsWithSort />
        <CustomHits />
        <PaintingsSearchPagination />
      </div>
    </div>
  );
}

export default function PaintingsSearch() {
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

  return (
    <PaintingsSearchProvider>
      <PaintingsSearchLayout />
    </PaintingsSearchProvider>
  );
}
