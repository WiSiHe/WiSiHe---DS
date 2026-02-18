'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { IoAdd, IoClose } from 'react-icons/io5';
import Chip from '../Chip/Chip';

type Tag = {
  _id: string;
  name: string;
  count: number;
};

type ProjectFilterProps = {
  tags: Tag[];
  activeFilters: string[];
  onToggleFilter: (tag: string) => void;
  onClearAll: () => void;
  totalFilteredCount: number;
  totalCount: number;
};

const ProjectFilter = ({
  tags,
  activeFilters,
  onToggleFilter,
  onClearAll,
  totalFilteredCount,
  totalCount,
}: ProjectFilterProps) => {
  const availableTags = tags.filter(tag => !activeFilters.includes(tag.name));

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="font-medium text-sm text-foreground-subtle">Filter by tag:</h3>
        {activeFilters.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-accent hover:text-accent-hover hover:underline transition-colors duration-200"
          >
            Clear all ({activeFilters.length})
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Add filter listbox */}
        {availableTags.length > 0 && (
          <Listbox
            value={null}
            onChange={(tag: Tag | null) => {
              if (tag) {
                onToggleFilter(tag.name);
              }
            }}
          >
            <div className="relative">
              <ListboxButton
                className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-dashed border-border/50 rounded-full bg-surface hover:border-accent hover:bg-surface-hover hover:shadow-lg transition-all duration-200 w-auto min-w-[140px] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background cursor-pointer group shadow-sm"
              >
                <IoAdd className="w-4 h-4 text-foreground-muted group-hover:text-accent transition-colors duration-200" />
                <span className="text-foreground-subtle group-hover:text-foreground transition-colors duration-200 font-medium">
                  Add filter
                </span>
              </ListboxButton>

              <ListboxOptions
                anchor="bottom"
                className="w-[600px] bg-surface border border-border/50 rounded-lg shadow-2xl z-20 mt-4 mb-4 mx-2 max-h-96 overflow-y-auto p-4"
                transition
              >
                <AnimatePresence>
                  {availableTags.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
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
                            className="group flex flex-col gap-1 px-3 py-2.5 text-sm hover:bg-surface-hover hover:shadow-md text-foreground data-focus:bg-surface-hover data-focus:shadow-md cursor-pointer transition-all duration-200 rounded-lg border border-border/20 hover:border-accent/30"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-foreground group-hover:text-accent transition-colors">
                                {tag.name}
                              </span>
                              <span className="text-xs text-accent-text bg-accent-subtle group-hover:bg-accent-surface px-2 py-0.5 rounded-full font-medium transition-colors">
                                {tag.count}
                              </span>
                            </div>
                          </ListboxOption>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      className="px-4 py-6 text-sm text-foreground-muted text-center"
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

        {/* Active filters */}
        <AnimatePresence mode="popLayout">
          {activeFilters.map(filter => {
            const tag = tags.find(t => t.name === filter);
            const label = tag ? `${filter} (${tag.count})` : filter;
            
            return (
              <ActiveFilterChip
                key={filter}
                label={label}
                filter={filter}
                onToggleFilter={onToggleFilter}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50 text-sm text-foreground-muted">
          Showing {totalFilteredCount} of {totalCount} project{totalCount === 1 ? '' : 's'}
        </div>
      )}
    </div>
  );
};

// Component for active filter chips
const ActiveFilterChip = ({
  label,
  filter,
  onToggleFilter,
}: {
  label: string;
  filter: string;
  onToggleFilter: (tag: string) => void;
}) => {
  const handleToggle = () => {
    onToggleFilter(filter);
  };

  return (
    <motion.div
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
        label={label}
        onRemove={handleToggle}
        onClick={handleToggle}
        Icon={IoClose}
        variation="primary"
      />
    </motion.div>
  );
};

export default ProjectFilter;
