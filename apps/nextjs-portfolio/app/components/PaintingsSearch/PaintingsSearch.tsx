'use client';

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { Button } from '@wisihe/ui-react';
import { useState } from 'react';
import {
  IoClose,
  IoEyeOutline,
  IoFilterOutline,
  IoHourglassOutline,
  IoStarOutline,
  IoTimeOutline,
} from 'react-icons/io5';
import { Configure, Pagination } from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { indexName, searchClient } from './AlgoliaClient';
import CustomHits from './CustomHits';
import CustomRefinementList from './CustomRefinementList';
import CustomSearchBox from './CustomSearchBox';
import CustomSortBy from './CustomSortBy';

// ---------------------------------------------------------------------------
// Defined OUTSIDE the parent component so React never creates a new identity
// on re-render (which would unmount/remount Algolia widgets and reset filters)
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
          limit={10}
          showMoreLimit={40}
          showMore={true}
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

export default function PaintingsSearch() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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
      {/* Only show paintings (exclude projects) */}
      <Configure hitsPerPage={12} filters='_type:painting' />

      <div className='flex flex-col md:flex-row gap-8 w-full mt-4'>
        {/* Mobile Filter Toggle */}
        <div className='md:hidden w-full'>
          <Button
            onClick={() => setIsMobileFiltersOpen(true)}
            variant='secondary'
            className='w-full justify-center'
            Icon={IoFilterOutline}
          >
            Filters & Search
          </Button>
        </div>

        {/* Mobile Filters Drawer */}
        <Dialog
          open={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
          className='relative z-50 md:hidden'
        >
          <DialogBackdrop
            transition
            className='fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ease-out data-closed:opacity-0'
          />
          <div className='fixed inset-0 flex justify-center items-end'>
            <DialogPanel
              transition
              className='w-full bg-background max-h-[90dvh] flex flex-col overflow-y-auto border-t border-border shadow-2xl p-6 gap-6 rounded-t-3xl transition-transform duration-300 ease-out data-closed:translate-y-full'
            >
              <div className='flex items-center justify-between pb-2 border-b border-border/50'>
                <h2 className='text-xl font-bold text-foreground'>Filters & Search</h2>
                <button
                  type='button'
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className='p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors'
                >
                  <IoClose className='w-6 h-6' />
                </button>
              </div>

              <div className='flex flex-col gap-8 pb-10'>
                <FiltersSidebar sortItems={sortItems} />
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Desktop Sidebar Filters */}
        <div className='hidden md:flex w-64 shrink-0 flex-col gap-8'>
          <FiltersSidebar sortItems={sortItems} />
        </div>

        {/* Main Content Area */}
        <div className='grow flex flex-col min-w-0'>
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
