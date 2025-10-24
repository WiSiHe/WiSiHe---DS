'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { IoAdd, IoClose } from 'react-icons/io5';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { motion, AnimatePresence } from 'motion/react';
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

  // Filter available tags (exclude already selected ones) and sort by paintings count
  const availableTags = tags
    .filter(tag => !currentFilters.includes(tag.name))
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
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-medium text-sm text-text-secondary">Filters:</h3>
        {currentFilters.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-accent hover:text-accent-dark hover:underline transition-colors duration-200"
          >
            Clear all
          </button>
        )}
      </div>

      <motion.div className="flex flex-wrap items-center gap-2 mb-3" layout>
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
              <div className="relative">
                <ListboxButton
                  id="add-filter-button"
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm border border-dashed border-border rounded-full hover:border-accent hover:bg-surface-elevated transition-all duration-200 bg-transparent w-auto min-w-[120px] focus:outline-none focus:ring-2 focus:ring-border-focus cursor-pointer group"
                >
                  <IoAdd className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors duration-200" />
                  <span className="text-text-secondary group-hover:text-text-primary transition-colors duration-200">
                    Add filter
                  </span>
                </ListboxButton>

                <ListboxOptions
                  id="add-filter-options"
                  anchor="bottom"
                  className="w-64 bg-surface border border-border rounded-lg shadow-xl z-20 mt-2 backdrop-blur-sm max-h-48 overflow-y-auto"
                  transition
                >
                  <AnimatePresence>
                    {availableTags.length > 0 ? (
                      availableTags.map((tag, index) => (
                        <motion.div
                          key={tag._id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{
                            delay: index * 0.05,
                            duration: 0.2,
                          }}
                        >
                          <ListboxOption
                            value={tag}
                            className="group flex items-center justify-between px-3 py-2 text-sm hover:bg-surface-elevated text-text-primary data-focus:bg-surface-elevated cursor-pointer transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                          >
                            <span className="font-medium">{tag.name}</span>
                            <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                              {tag.paintingsCount} paintings
                            </span>
                          </ListboxOption>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        className="px-3 py-4 text-sm text-text-tertiary text-center italic"
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
        <AnimatePresence mode="popLayout">
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
              className="text-xs text-warning bg-surface-elevated px-2 py-1 rounded-full border border-border"
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
