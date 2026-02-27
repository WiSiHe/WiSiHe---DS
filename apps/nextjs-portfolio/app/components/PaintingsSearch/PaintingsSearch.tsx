'use client';

import { Button } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { useEffect, useState } from 'react';
import {
  IoClose,
  IoEyeOutline,
  IoFilterOutline,
  IoHourglassOutline,
  IoStarOutline,
  IoTimeOutline,
} from 'react-icons/io5';
import { Configure, Pagination, useStats } from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { indexName, searchClient } from './AlgoliaClient';
import CustomHits from './CustomHits';
import CustomRefinementList from './CustomRefinementList';
import CustomSearchBox from './CustomSearchBox';
import CustomSortBy from './CustomSortBy';

// ---------------------------------------------------------------------------
// HitStats — shows "Showing X–Y of Z paintings"
// ---------------------------------------------------------------------------
function HitStats() {
  const { nbHits, page, hitsPerPage } = useStats();
  if (nbHits === 0 || hitsPerPage === undefined) return null;

  const from = page * hitsPerPage + 1;
  const to = Math.min((page + 1) * hitsPerPage, nbHits);

  return (
    <p className='text-sm text-foreground-subtle'>
      Showing{' '}
      <span className='font-medium text-foreground'>
        {from}–{to}
      </span>{' '}
      of{' '}
      <span className='font-medium text-foreground'>{nbHits.toLocaleString()}</span> paintings
    </p>
  );
}

// ---------------------------------------------------------------------------
// FiltersSidebar — defined OUTSIDE the parent so React never creates a new
// component identity on re-render (which would reset Algolia widget state).
// ---------------------------------------------------------------------------
type FiltersSidebarProps = {
  sortItems: React.ComponentProps<typeof CustomSortBy>['items'];
};

function FiltersSidebar({ sortItems }: FiltersSidebarProps) {
  return (
    <>
      <div className='flex flex-col gap-2'>
        <h3 className='font-semibold text-foreground text-sm uppercase tracking-wider'>Search</h3>
        <CustomSearchBox />
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='font-semibold text-foreground text-sm uppercase tracking-wider'>Sort</h3>
        <CustomSortBy items={sortItems} />
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='font-semibold text-foreground text-sm uppercase tracking-wider mb-2'>
          Filter by Tag
        </h3>
        <CustomRefinementList
          attribute='tags'
          limit={50}
          transformItems={items => {
            const filtered = items.filter(item => item.count >= 5 || item.isRefined);
            const storeItem = filtered.find(item => item.label.toLowerCase() === 'store');
            const otherItems = filtered.filter(item => item.label.toLowerCase() !== 'store');
            return storeItem ? [storeItem, ...otherItems] : otherItems;
          }}
        />
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function PaintingsSearch() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileFiltersOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFiltersOpen]);

  const sortItems = [
    { label: 'Featured', value: indexName, icon: <IoStarOutline className='w-4 h-4' /> },
    { label: 'Newest', value: `${indexName}_newest`, icon: <IoTimeOutline className='w-4 h-4' /> },
    {
      label: 'Oldest',
      value: `${indexName}_oldest`,
      icon: <IoHourglassOutline className='w-4 h-4' />,
    },
    {
      label: 'Most Viewed',
      value: `${indexName}_views`,
      icon: <IoEyeOutline className='w-4 h-4' />,
    },
  ];

  return (
    <InstantSearchNext searchClient={searchClient} indexName={indexName} routing={true}>
      <Configure hitsPerPage={12} filters='_type:painting' />

      <div className='flex flex-col md:flex-row gap-8 w-full mt-4'>
        {/* ---------------------------------------------------------------- */}
        {/* Mobile — Filter toggle button                                    */}
        {/* ---------------------------------------------------------------- */}
        <div className='md:hidden w-full'>
          <Button
            onClick={() => setIsMobileFiltersOpen(true)}
            variant='secondary'
            className='w-full justify-center'
            Icon={IoFilterOutline}
          >
            Filters &amp; Search
          </Button>
        </div>

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
            aria-hidden={!isMobileFiltersOpen}
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
            <div className='flex flex-col gap-8 pb-10'>
              <FiltersSidebar sortItems={sortItems} />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Desktop — Sidebar (always visible, always mounted)              */}
        {/* ---------------------------------------------------------------- */}
        <div className='hidden md:flex w-64 shrink-0 flex-col gap-8'>
          <FiltersSidebar sortItems={sortItems} />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Main content                                                     */}
        {/* ---------------------------------------------------------------- */}
        <div className='grow flex flex-col min-w-0'>
          <HitStats />
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
