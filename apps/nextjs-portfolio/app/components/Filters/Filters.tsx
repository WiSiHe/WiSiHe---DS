'use client';

import { GetAllPaintingsandTagsResult } from '@/sanity.types';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import {
  IoCheckmarkCircleOutline,
  IoChevronDownCircleOutline,
} from 'react-icons/io5';
import Chip from '../Chip/Chip';

type FiltersProps = {
  /**
   * List of tags to be used as filters
   */
  tags: GetAllPaintingsandTagsResult['tags'];
};

const Filters = ({ tags }: FiltersProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const sortParam = searchParams.get('sort') || 'random';
  const [selectedSort, setSelectedSort] = useState(sortParam);

  const [selectedFilters, setSelectedFilters] = useState(
    searchParams.getAll('filter')
  );

  const sortingOptions = [
    { value: 'random', label: 'Random' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'most-viewed', label: 'Most Viewed' },
  ];

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Update the 'filter' parameters
    params.delete('filter');
    selectedFilters.forEach((value) => {
      params.append('filter', value);
    });

    // Update the 'sort' parameter
    params.set('sort', selectedSort);

    // Navigate to the new URL with all updated parameters
    router.push(`${pathname}?${params.toString()}`);

    setIsModalOpen(false);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-1 px-3 py-2 text-white rounded bg-primary hover:bg-primary/90"
      >
        <FaFilter />
        Filters & Sort
        {selectedFilters.length > 0 && (
          <div className="flex items-center justify-center flex-shrink-0 w-3 h-3 p-2 text-xs font-medium bg-white rounded-full text-dark">
            {selectedFilters.length}
          </div>
        )}
      </button>
      <div>
        <button
          onClick={clearFilters}
          className="px-3 py-2 text-sm transition-colors border-2 rounded border-primary w-fit hover:bg-primary hover:text-white"
        >
          Clear Filters
        </button>
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen(false)}
        >
          {/* The backdrop */}
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </TransitionChild>

          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* Panel */}
            <TransitionChild
              as={Fragment}
              enter="transition ease-out duration-300 transform"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-200 transform"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md p-6 overflow-hidden text-left align-middle bg-white rounded-lg shadow-xl">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Filters & Sorting
                </DialogTitle>

                <div className="relative mt-4">
                  <label className="block mb-1 text-sm font-semibold">
                    Sort By
                  </label>
                  <Listbox value={selectedSort} onChange={setSelectedSort}>
                    {({ open }) => (
                      <div className="relative w-full">
                        {/* --- Button --- */}
                        <ListboxButton className="relative flex items-center justify-between w-full px-3 py-2 text-left transition-colors border rounded-md shadow-sm cursor-pointer border-primary bg-tertiary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1">
                          <span className="block truncate">
                            {
                              sortingOptions.find(
                                (option) => option.value === selectedSort
                              )?.label
                            }
                          </span>
                          <div className="flex items-center pointer-events-none">
                            <IoChevronDownCircleOutline
                              className={cn(
                                'w-4 h-4 text-primary transition-all',
                                open && ' rotate-180'
                              )}
                              aria-hidden="true"
                            />
                          </div>
                        </ListboxButton>

                        <AnimatePresence>
                          {open && (
                            <ListboxOptions
                              static
                              as={motion.div}
                              initial={{
                                opacity: 0,
                                // height: 0.5,
                                scaleY: 0.5,
                                y: -5,
                                transition: {
                                  // duration: 0.4,
                                  type: 'spring',
                                },
                              }}
                              animate={{
                                opacity: 1,
                                scaleY: 1,
                                // height: 'auto',
                                y: 0,
                                transition: {
                                  // duration: 0.4,
                                  type: 'spring',
                                },
                              }}
                              exit={{
                                opacity: 0,
                                scaleY: 0.5,
                                // height: 0.5,
                                y: -5,
                                transition: {
                                  // duration: 0.4,
                                  type: 'spring',
                                },
                              }}
                              // anchor="bottom"
                              className="absolute z-10 w-full mt-1 overflow-auto origin-top bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                            >
                              {sortingOptions.map((option) => (
                                <ListboxOption
                                  key={option.value}
                                  value={option.value}
                                  className={({ selected, focus }) =>
                                    cn(
                                      'relative cursor-pointer flex gap-2 select-none py-2 px-4 transition-colors',
                                      focus && 'bg-primary/10',
                                      selected
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-dark'
                                    )
                                  }
                                >
                                  {({ selected }) => (
                                    <>
                                      {selected && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          exit={{ scale: 0 }}
                                          className="flex items-center text-primary"
                                        >
                                          <IoCheckmarkCircleOutline
                                            className="w-4 h-4"
                                            aria-hidden="true"
                                          />
                                        </motion.div>
                                      )}
                                      <span>{option.label}</span>
                                    </>
                                  )}
                                </ListboxOption>
                              ))}
                            </ListboxOptions>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </Listbox>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-col gap-5 pt-6">
                  <div>
                    <label className="block pb-2 font-semibold">Filters</label>
                    <div className="flex flex-wrap gap-x-3 gap-y-4">
                      {tags.map(({ _id, name, paintingsCount }) => {
                        const filterValue = name.toLowerCase();
                        const isActive = selectedFilters.includes(filterValue);
                        const isStore = name === 'Store';
                        return (
                          <button
                            key={_id}
                            type="button"
                            onClick={() => {
                              setSelectedFilters((prevFilters) => {
                                if (isActive) {
                                  return prevFilters.filter(
                                    (filter) => filter !== filterValue
                                  );
                                } else {
                                  return [...prevFilters, filterValue];
                                }
                              });
                            }}
                          >
                            <Chip
                              label={name}
                              additionalText={paintingsCount.toString()}
                              selected={isActive}
                              variation={isStore ? 'highlight' : 'default'}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Clear Filters Button */}
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 mt-2 text-sm transition-colors border-2 rounded border-primary w-fit hover:bg-primary hover:text-white"
                  >
                    Clear Filters
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mt-6 space-x-2">
                  <button
                    type="button"
                    className="px-3 py-2 mt-2 text-sm transition-colors border-2 rounded border-primary w-fit hover:bg-primary hover:text-white"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 mt-2 text-sm text-white transition-colors border-2 rounded bg-primary border-primary w-fit hover:bg-primary/90 hover:text-white"
                    onClick={applyFilters}
                  >
                    Apply
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Filters;
