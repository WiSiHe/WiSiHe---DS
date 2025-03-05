'use client';

import useFilterSidebarStore from '@/store/useFilterModalStore';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { FaFilter } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import Chip from '../Chip/Chip';

export const Filters = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { openSidebar, selectedFilters, toggleFilter, clearFilters } =
    useFilterSidebarStore();

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      <button
        onClick={openSidebar}
        className="flex items-center gap-1 px-3 py-3 text-white border rounded-sm ring-primary bg-primary hover:bg-primary/90"
      >
        <FaFilter />
        Filters & Sort
        {selectedFilters.length > 0 && (
          <div className="flex items-center justify-center w-2 h-2 p-2 text-xs font-medium bg-white rounded-full shrink-0 text-dark">
            {selectedFilters.length}
          </div>
        )}
      </button>

      <AnimatePresence>
        {selectedFilters.length > 0 && (
          <motion.button
            layout
            key="clear-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40, transition: { delay: 0.5 } }}
            transition={{ type: 'spring' }}
            onClick={() => clearFilters(pathname, router)}
            className="flex items-center gap-1 px-3 py-3 text-white border rounded-sm ring-primary hover:bg-primary/90"
          >
            <IoClose />
            Clear Filters
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedFilters.length > 0 && (
          <motion.ul
            key="filter-chips"
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // exit={{ opacity: 0, y: 20 }}
            // transition={{ type: 'spring' }}
            className="flex flex-wrap gap-4"
          >
            {selectedFilters.map((filter) => (
              <motion.li
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring' }}
                key={filter}
              >
                <button onClick={() => toggleFilter(filter, pathname, router)}>
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
