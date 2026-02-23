'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import type { GetAllPaintingsandTagsResult } from '@wisihe/sanity-queries';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { IoClose } from 'react-icons/io5';
import useFilterSidebarStore from '@/store/useFilterModalStore';
import Chip from '../Chip/Chip';
import { Select } from '../Select/Select';

type FilterSideBarProps = {
  tags: GetAllPaintingsandTagsResult['tags'];
};

const sortingOptions = [
  { value: 'random', label: 'Random' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-viewed', label: 'Most Viewed' },
];

export const FilterSideBar = ({ tags }: FilterSideBarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const {
    isOpen,
    closeSidebar,
    selectedFilters,
    selectedSort,
    toggleFilter,
    setSort,
    clearFilters,
  } = useFilterSidebarStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog static open={isOpen} onClose={closeSidebar} className='relative z-50'>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black'
          />

          {/* Sidebar Container */}
          <div className='fixed inset-0 flex items-start justify-end'>
            {/* Sidebar Content */}
            <DialogPanel
              as={motion.div}
              initial={{ x: '100%', transition: { duration: 0.2 } }}
              animate={{ x: 0, transition: { duration: 0.2 } }}
              exit={{ x: '100%', transition: { duration: 0.2 } }}
              className='w-full h-full max-w-sm p-6 bg-surface text-foreground shadow-lg'
            >
              <div className='flex items-center justify-between mb-4 text-foreground'>
                <DialogTitle className='text-lg font-semibold'>Filter Paintings</DialogTitle>
                <button
                  type='button'
                  onClick={closeSidebar}
                  className='p-3 text-foreground-muted hover:text-foreground'
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Sort Selector */}
              <Select
                label='Sort By'
                options={sortingOptions}
                value={selectedSort}
                onChange={sort => setSort(sort, pathname, router)}
              />

              <hr className='my-6 border-border-subtle' />

              {/* Filter Chips */}
              <div className='mb-6'>
                <label className='block mb-2 text-sm font-semibold text-foreground'>Filters</label>
                <div className='flex flex-wrap gap-3'>
                  {tags.map(({ _id, name, paintingsCount }) => {
                    const filterValue = name.toLowerCase();
                    const isStore = name === 'Store';
                    return (
                      <button
                        key={_id}
                        type='button'
                        className='cursor-pointer text-foreground'
                        onClick={() => toggleFilter(filterValue, pathname, router)}
                      >
                        <Chip
                          label={name}
                          additionalText={paintingsCount.toString()}
                          selected={selectedFilters.includes(filterValue)}
                          variation={isStore ? 'highlight' : 'default'}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className='flex justify-between'>
                <button
                  type='button'
                  onClick={() => clearFilters(pathname, router)}
                  className='px-3 py-2 rounded-lg cursor-pointer text-foreground border border-border hover:bg-surface-hover'
                >
                  Clear Filters
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
