'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoAdd, IoClose } from 'react-icons/io5';
import Chip from '../Chip/Chip';

type Tag = {
  _id: string;
  name: string;
  paintingsCount: number;
};

type FilterManagerProps = {
  tags: Tag[];
  currentFilters: string[];
};

const FilterManager = ({ tags, currentFilters }: FilterManagerProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter available tags (exclude already selected ones, only show tags with 7+ paintings) and sort by paintings count
  const availableTags = tags
    .filter(tag => !currentFilters.includes(tag.name) && tag.paintingsCount >= 7)
    .sort((a, b) => b.paintingsCount - a.paintingsCount);

  const addFilter = (tagName: string) => {
    const newFilters = [...currentFilters, tagName];
    updateURL(newFilters);
  };

  const removeFilter = (tagName: string) => {
    const newFilters = currentFilters.filter(filter => filter !== tagName);
    updateURL(newFilters);
  };

  const updateURL = (filters: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.length > 0) {
      params.set('filter', filters.join(','));
    } else {
      params.delete('filter');
    }

    // Reset to page 1 when filters change
    params.delete('page');

    router.push(`/paintings?${params.toString()}`);
  };

  const clearAllFilters = () => {
    updateURL([]);
  };

  return (
    <div className='mb-6'>
      <div className='flex items-center gap-2 mb-3'>
        <h3 className='font-medium text-sm text-foreground-subtle'>Filters:</h3>
        {currentFilters.length > 0 && (
          <button
            type='button'
            onClick={clearAllFilters}
            className='text-accent hover:text-accent-hover hover:underline transition-colors duration-200 text-sm'
          >
            Clear all
          </button>
        )}
      </div>

      <motion.div className='flex flex-wrap items-center gap-2 mb-3' layout>
        {/* Add filter listbox - always first */}
        <motion.div layout>
          {currentFilters.length < 5 && (
            <Listbox
              value={null}
              onChange={(tag: Tag | null) => {
                if (tag) {
                  addFilter(tag.name);
                }
              }}
            >
              <div className='relative'>
                <ListboxButton
                  id='add-filter-button'
                  className='inline-flex items-center gap-2 px-4 py-2 text-sm border border-dashed border-border/50 rounded-full bg-surface hover:border-accent hover:bg-surface-hover hover:shadow-lg transition-all duration-200 w-auto min-w-[140px] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background cursor-pointer group shadow-sm'
                >
                  <IoAdd className='w-4 h-4 text-foreground-muted group-hover:text-accent transition-colors duration-200' />
                  <span className='text-foreground-subtle group-hover:text-foreground transition-colors duration-200 font-medium'>
                    Add filter
                  </span>
                </ListboxButton>

                <ListboxOptions
                  id='add-filter-options'
                  anchor='bottom'
                  className='w-[600px] bg-surface border border-border/50 rounded-lg shadow-2xl z-20 mt-4 mb-4 mx-2 max-h-96 overflow-y-auto p-4'
                  transition
                >
                  <AnimatePresence>
                    {availableTags.length > 0 ? (
                      <div className='grid grid-cols-2 gap-2'>
                        {availableTags.map((tag, index) => (
                          <motion.div
                            key={tag._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{
                              delay: index * 0.02,
                              duration: 0.15,
                            }}
                          >
                            <ListboxOption
                              value={tag}
                              className='group flex flex-col gap-1 px-3 py-2.5 text-sm hover:bg-surface-hover hover:shadow-md text-foreground data-focus:bg-surface-hover data-focus:shadow-md cursor-pointer transition-all duration-200 rounded-lg border border-border/20 hover:border-accent/30'
                            >
                              <div className='flex items-center justify-between'>
                                <span className='font-medium text-foreground group-hover:text-accent transition-colors'>
                                  {tag.name}
                                </span>
                                <span className='text-xs text-accent-text bg-accent-subtle group-hover:bg-accent-surface px-2 py-0.5 rounded-full font-medium transition-colors'>
                                  {tag.paintingsCount}
                                </span>
                              </div>
                            </ListboxOption>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        className='px-4 py-6 text-sm text-foreground-muted text-center'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        No available tags
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ListboxOptions>
              </div>
            </Listbox>
          )}
        </motion.div>

        {/* Current filters */}
        <AnimatePresence mode='popLayout'>
          {currentFilters.map(filter => (
            <motion.div
              key={filter}
              layout
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
                duration: 0.2,
              }}
            >
              <Chip
                label={filter}
                onRemove={() => removeFilter(filter)}
                onClick={() => removeFilter(filter)}
                Icon={IoClose}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Max filters warning */}
        <AnimatePresence>
          {currentFilters.length >= 5 && (
            <motion.span
              className='text-xs text-warning-text bg-warning-subtle px-3 py-1.5 rounded-full border border-warning/30 shadow-sm'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              Maximum 5 filters reached
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FilterManager;
