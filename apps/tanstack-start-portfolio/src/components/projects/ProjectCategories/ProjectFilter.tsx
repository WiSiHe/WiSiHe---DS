'use client';

import { Dialog, DialogPanel } from '@headlessui/react';
import { IconAdjustmentsHorizontal, IconX } from '@tabler/icons-react';
import { Chip } from '@wisihe/ui-react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'motion/react';
import { useState } from 'react';

type Tag = {
  _id: string;
  name: string | null;
  count: number;
  isFeatured?: boolean | null;
};

type ProjectFilterProps = {
  tags: Tag[];
  activeFilters: string[];
  onToggleFilter: (tag: string) => void;
  onClearAll: () => void;
  totalFilteredCount: number;
  totalCount: number;
};

export default function ProjectFilter({
  tags,
  activeFilters,
  onToggleFilter,
  onClearAll,
  totalFilteredCount,
  totalCount,
}: ProjectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className='flex flex-wrap items-center gap-2'>
        <button
          type='button'
          onClick={() => setIsOpen(true)}
          className='inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:border-accent hover:bg-surface-hover'
        >
          <IconAdjustmentsHorizontal className='h-4 w-4' />
          Filter
          {activeFilters.length > 0 ? (
            <span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-contrast'>
              {activeFilters.length}
            </span>
          ) : null}
        </button>

        <AnimatePresence mode='popLayout'>
          {activeFilters.map(filter => (
            <motion.div
              key={filter}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Chip
                label={filter}
                variation='primary'
                size='small'
                interactive={false}
                removable
                onRemove={() => onToggleFilter(filter)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {activeFilters.length > 0 ? (
          <span className='text-sm text-foreground-muted'>
            {totalFilteredCount} of {totalCount}
          </span>
        ) : null}
      </div>

      <AnimatePresence>
        {isOpen ? (
          <Dialog static open={isOpen} onClose={() => setIsOpen(false)} className='relative z-50'>
            <motion.div
              className='fixed inset-0 bg-black/50 backdrop-blur-xs'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              aria-hidden
            />

            <div className='fixed inset-x-0 bottom-0 z-50'>
              <SheetPanel
                tags={tags}
                activeFilters={activeFilters}
                onToggleFilter={onToggleFilter}
                onClearAll={onClearAll}
                totalFilteredCount={totalFilteredCount}
                totalCount={totalCount}
                onClose={() => setIsOpen(false)}
              />
            </div>
          </Dialog>
        ) : null}
      </AnimatePresence>
    </>
  );
}

type SheetPanelProps = ProjectFilterProps & { onClose: () => void };

function SheetPanel({
  tags,
  activeFilters,
  onToggleFilter,
  onClearAll,
  totalFilteredCount,
  totalCount,
  onClose,
}: SheetPanelProps) {
  const featuredTags = tags.filter(tag => tag.isFeatured);
  const otherTags = tags.filter(tag => !tag.isFeatured);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 240], [1, 0]);

  const handleDragEnd = (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    if (info.offset.y > 120 || info.velocity.y > 400) {
      onClose();
    }
  };

  return (
    <motion.div
      style={{ y, opacity }}
      drag='y'
      dragConstraints={{ top: 0 }}
      dragElastic={{ top: 0, bottom: 0.15 }}
      onDragEnd={handleDragEnd}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className='select-none touch-none rounded-t-3xl border-t border-border bg-surface shadow-2xl'
    >
      <DialogPanel className='flex max-h-[80svh] flex-col'>
        <div className='flex shrink-0 justify-center pb-1 pt-3'>
          <div className='h-1 w-10 rounded-full bg-border' />
        </div>

        <div className='flex shrink-0 items-center justify-between px-5 py-3'>
          <div>
            <h2 className='text-base font-semibold text-foreground'>Filter by tag</h2>
            {activeFilters.length > 0 ? (
              <p className='mt-0.5 text-xs text-foreground-muted'>
                {totalFilteredCount} of {totalCount} projects
              </p>
            ) : null}
          </div>
          <div className='flex items-center gap-2'>
            {activeFilters.length > 0 ? (
              <button
                type='button'
                onClick={onClearAll}
                className='rounded-full px-3 py-1.5 text-sm text-accent transition-colors hover:bg-surface-hover hover:text-accent-hover'
              >
                Clear all
              </button>
            ) : null}
            <button
              type='button'
              onClick={onClose}
              className='rounded-full p-2 text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground'
              aria-label='Close filter'
            >
              <IconX className='h-5 w-5' />
            </button>
          </div>
        </div>

        <div className='touch-auto space-y-5 overflow-y-auto overscroll-contain px-5 pb-8 pt-2'>
          {featuredTags.length > 0 ? (
            <div className='space-y-2'>
              <p className='text-xs font-semibold uppercase tracking-wide text-foreground-muted'>
                Popular tags
              </p>
              <div className='flex flex-wrap gap-2'>
                {featuredTags.map(tag => {
                  const tagName = tag.name ?? '';
                  const isActive = activeFilters.includes(tagName);
                  return (
                    <Chip
                      key={tag._id}
                      label={tagName}
                      additionalText={`${tag.count}`}
                      variation={isActive ? 'primary' : 'secondary'}
                      selected={isActive}
                      size='medium'
                      onClick={() => onToggleFilter(tagName)}
                    />
                  );
                })}
              </div>
            </div>
          ) : null}

          {otherTags.length > 0 ? (
            <div className='space-y-2'>
              {featuredTags.length > 0 ? (
                <p className='text-xs font-semibold uppercase tracking-wide text-foreground-muted'>
                  All tags
                </p>
              ) : null}
              <div className='flex flex-wrap gap-2'>
                {otherTags.map(tag => {
                  const tagName = tag.name ?? '';
                  const isActive = activeFilters.includes(tagName);
                  return (
                    <Chip
                      key={tag._id}
                      label={tagName}
                      additionalText={`${tag.count}`}
                      variation={isActive ? 'primary' : 'secondary'}
                      selected={isActive}
                      size='medium'
                      onClick={() => onToggleFilter(tagName)}
                    />
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </DialogPanel>
    </motion.div>
  );
}
