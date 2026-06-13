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
import { Configure, useStats } from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import InstantSearchPagination from '@/app/components/search/InstantSearchPagination';
import { ALGOLIA_INDEX_NAME, replicaIndexName } from '@/lib/algolia/constants';
import { isAlgoliaConfigured, searchClient } from '@/lib/algolia/searchClient';
import CustomRefinementList from '../../paintings/PaintingsSearch/CustomRefinementList';
import CustomSearchBox from '../../paintings/PaintingsSearch/CustomSearchBox';
import CustomSortBy from '../../paintings/PaintingsSearch/CustomSortBy';
import ProjectSearchHits from './ProjectSearchHits';
import { labelProjectStatus, labelProjectType } from './projectFacetLabels';

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
      of <span className='font-medium text-foreground'>{nbHits.toLocaleString()}</span> projects
    </p>
  );
}

type FiltersSidebarProps = {
  sortItems: React.ComponentProps<typeof CustomSortBy>['items'];
};

function FiltersSidebar({ sortItems }: FiltersSidebarProps) {
  return (
    <>
      <div className='flex flex-col gap-2'>
        <h3 className='font-semibold text-foreground text-sm uppercase tracking-wider'>Search</h3>
        <CustomSearchBox inputLabel='Search projects' placeholder='Search projects...' />
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='font-semibold text-foreground text-sm uppercase tracking-wider'>Sort</h3>
        <CustomSortBy items={sortItems} />
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='font-semibold text-foreground text-sm uppercase tracking-wider mb-2'>
          Status
        </h3>
        <CustomRefinementList
          attribute='status'
          limit={20}
          transformItems={items =>
            items.map(item => ({
              ...item,
              label: labelProjectStatus(item.label),
            }))
          }
        />
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='font-semibold text-foreground text-sm uppercase tracking-wider mb-2'>
          Project type
        </h3>
        <CustomRefinementList
          attribute='projectType'
          limit={20}
          transformItems={items =>
            items.map(item => ({
              ...item,
              label: labelProjectType(item.label),
            }))
          }
        />
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='font-semibold text-foreground text-sm uppercase tracking-wider mb-2'>
          Tags
        </h3>
        <CustomRefinementList
          attribute='tags'
          limit={50}
          transformItems={items => items.filter(item => item.count >= 1 || item.isRefined)}
        />
      </div>
    </>
  );
}

export default function ProjectsSearch() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileFiltersOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFiltersOpen]);

  if (!isAlgoliaConfigured || !searchClient) {
    return null;
  }

  const sortItems = [
    {
      label: 'Featured',
      value: ALGOLIA_INDEX_NAME,
      icon: <IoStarOutline className='w-4 h-4' />,
    },
    {
      label: 'Newest',
      value: replicaIndexName('newest'),
      icon: <IoTimeOutline className='w-4 h-4' />,
    },
    {
      label: 'Oldest',
      value: replicaIndexName('oldest'),
      icon: <IoHourglassOutline className='w-4 h-4' />,
    },
    {
      label: 'Most viewed',
      value: replicaIndexName('views'),
      icon: <IoEyeOutline className='w-4 h-4' />,
    },
  ];

  return (
    <InstantSearchNext searchClient={searchClient} indexName={ALGOLIA_INDEX_NAME} routing={false}>
      <Configure hitsPerPage={12} filters='_type:"project"' />

      <div className='flex flex-col md:flex-row gap-8 w-full mt-4'>
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

        <div className='md:hidden'>
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

          <div
            role='dialog'
            aria-modal='true'
            aria-label='Filters & Search'
            inert={!isMobileFiltersOpen}
            className={cn(
              'fixed inset-x-0 bottom-0 z-50',
              'w-full bg-background max-h-[90dvh] flex flex-col overflow-y-auto',
              'border-t border-border shadow-2xl p-6 gap-6 rounded-t-3xl',
              'transition-transform duration-300 ease-out',
              isMobileFiltersOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none',
            )}
          >
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

            <div className='flex flex-col gap-8 pb-10'>
              <FiltersSidebar sortItems={sortItems} />
            </div>
          </div>
        </div>

        <div className='hidden md:flex w-64 shrink-0 flex-col gap-8'>
          <FiltersSidebar sortItems={sortItems} />
        </div>

        <div className='grow flex flex-col min-w-0'>
          <HitStats />
          <ProjectSearchHits />

          <InstantSearchPagination />
        </div>
      </div>
    </InstantSearchNext>
  );
}
