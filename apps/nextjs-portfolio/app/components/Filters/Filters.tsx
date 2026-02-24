'use client';

import { AnimatePresence, motion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { FaFilter } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import useFilterSidebarStore from '@/store/useFilterModalStore';
import Chip from '../Chip/Chip';

export const Filters = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { openSidebar, selectedFilters, toggleFilter, clearFilters } = useFilterSidebarStore();

  return (
    <div className='flex flex-wrap items-center gap-2 py-4'>
      <button
        type='button'
        onClick={openSidebar}
        className='flex items-center gap-2 px-4 py-3 text-accent-contrast border rounded-full cursor-pointer border-accent bg-accent hover:bg-accent-hover'
      >
        <FaFilter />
        Filters & Sort
        {selectedFilters.length > 0 && (
          <div className='flex items-center justify-center w-2 h-2 p-2 text-xs font-medium bg-background rounded-full shrink-0 text-foreground'>
            {selectedFilters.length}
          </div>
        )}
      </button>

      <AnimatePresence>
        {selectedFilters.length > 0 && (
          <motion.button
            type='button'
            layout
            key='clear-filters'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40, transition: { delay: 0.5 } }}
            transition={{ type: 'spring' }}
            onClick={() => clearFilters(pathname, router)}
            className='flex items-center gap-1 px-3 py-3 text-foreground border border-border rounded-full cursor-pointer bg-surface hover:bg-surface-hover'
          >
            <IoClose />
            Clear Filters
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedFilters.length > 0 && (
          <motion.ul
            key='filter-chips'
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // exit={{ opacity: 0, y: 20 }}
            // transition={{ type: 'spring' }}
            className='flex flex-wrap gap-4'
          >
            {selectedFilters.map(filter => (
              <motion.li
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring' }}
                key={filter}
              >
                <button type='button' onClick={() => toggleFilter(filter, pathname, router)}>
                  <Chip label={filter} selected Icon={() => <IoClose />} />
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
