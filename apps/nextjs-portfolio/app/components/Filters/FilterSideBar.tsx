'use client';

import { GetAllPaintingsandTagsResult } from '@/sanity.types';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import Chip from '../Chip/Chip';
import useFilterSidebarStore from '@/store/useFilterModalStore';
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
        <Dialog
          static
          open={isOpen}
          onClose={closeSidebar}
          className="relative z-50"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
          />

          {/* Sidebar Container */}
          <div className="fixed inset-0 flex items-start justify-end">
            {/* Sidebar Content */}
            <DialogPanel
              as={motion.div}
              initial={{ x: '100%', transition: { duration: 0.2 } }}
              animate={{ x: 0, transition: { duration: 0.2 } }}
              exit={{ x: '100%', transition: { duration: 0.2 } }}
              className="w-full h-full max-w-sm p-6 bg-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <DialogTitle className="text-lg font-semibold">
                  Filter Paintings
                </DialogTitle>
                <button
                  onClick={closeSidebar}
                  className="p-3 text-gray-500 hover:text-gray-700"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Sort Selector */}
              <Select
                label="Sort By"
                options={sortingOptions}
                value={selectedSort}
                onChange={(sort) => setSort(sort, pathname, router)}
              />

              <hr className="my-6" />

              {/* Filter Chips */}
              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold">
                  Filters
                </label>
                <div className="flex flex-wrap gap-3">
                  {tags.map(({ _id, name, paintingsCount }) => {
                    const filterValue = name.toLowerCase();
                    const isStore = name === 'Store';
                    return (
                      <button
                        key={_id}
                        type="button"
                        onClick={() =>
                          toggleFilter(filterValue, pathname, router)
                        }
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
              <div className="flex justify-between">
                <button
                  onClick={() => clearFilters(pathname, router)}
                  className="px-3 py-2 rounded-lg ring-3 text-dark ring-dark"
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
