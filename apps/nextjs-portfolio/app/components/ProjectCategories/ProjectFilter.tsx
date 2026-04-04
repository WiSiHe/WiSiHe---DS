'use client';

import { Dialog, DialogPanel } from '@headlessui/react';
import { IconAdjustmentsHorizontal, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'motion/react';
import { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger row */}
      <div className='flex flex-wrap items-center gap-2'>
        <button
          type='button'
          onClick={() => setIsOpen(true)}
          className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-sm font-medium text-foreground hover:border-accent hover:bg-surface-hover transition-all duration-200 shadow-sm'
        >
          <IconAdjustmentsHorizontal className='w-4 h-4' />
          Filter
          {activeFilters.length > 0 && (
            <span className='inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-accent text-accent-contrast rounded-full'>
              {activeFilters.length}
            </span>
          )}
        </button>

        {/* Active filter pills inline */}
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

        {activeFilters.length > 0 && (
          <span className='text-sm text-foreground-muted'>
            {totalFilteredCount} of {totalCount}
          </span>
        )}
      </div>

      {/* Bottom sheet */}
      <AnimatePresence>
        {isOpen && (
          <Dialog static open={isOpen} onClose={() => setIsOpen(false)} className='relative z-50'>
            {/* Backdrop */}
            <motion.div
              className='fixed inset-0 bg-black/50 backdrop-blur-xs'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              aria-hidden
            />

            {/* Sheet panel */}
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
        )}
      </AnimatePresence>
    </>
  );
};

type SheetPanelProps = ProjectFilterProps & { onClose: () => void };

const SheetPanel = ({
  tags,
  activeFilters,
  onToggleFilter,
  onClearAll,
  totalFilteredCount,
  totalCount,
  onClose,
}: SheetPanelProps) => {
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
      className='bg-surface rounded-t-3xl shadow-2xl border-t border-border select-none touch-none'
    >
      <DialogPanel className='flex flex-col max-h-[80svh]'>
        {/* Drag handle */}
        <div className='flex justify-center pt-3 pb-1 shrink-0'>
          <div className='w-10 h-1 rounded-full bg-border' />
        </div>

        {/* Header */}
        <div className='flex items-center justify-between px-5 py-3 shrink-0'>
          <div>
            <h2 className='text-base font-semibold text-foreground'>Filter by tag</h2>
            {activeFilters.length > 0 && (
              <p className='text-xs text-foreground-muted mt-0.5'>
                {totalFilteredCount} of {totalCount} projects
              </p>
            )}
          </div>
          <div className='flex items-center gap-2'>
            {activeFilters.length > 0 && (
              <button
                type='button'
                onClick={onClearAll}
                className='text-sm text-accent hover:text-accent-hover transition-colors px-3 py-1.5 rounded-full hover:bg-surface-hover'
              >
                Clear all
              </button>
            )}
            <button
              type='button'
              onClick={onClose}
              className='p-2 rounded-full hover:bg-surface-hover transition-colors text-foreground-muted hover:text-foreground'
              aria-label='Close filter'
            >
              <IconX className='w-5 h-5' />
            </button>
          </div>
        </div>

        {/* Tag list — scrollable */}
        <div className='overflow-y-auto overscroll-contain px-5 pb-8 pt-2 touch-auto'>
          <div className='flex flex-wrap gap-2'>
            {tags.map(tag => {
              const isActive = activeFilters.includes(tag.name);
              return (
                <Chip
                  key={tag._id}
                  label={tag.name}
                  additionalText={`${tag.count}`}
                  variation={isActive ? 'primary' : 'secondary'}
                  selected={isActive}
                  size='medium'
                  onClick={() => onToggleFilter(tag.name)}
                />
              );
            })}
          </div>
        </div>
      </DialogPanel>
    </motion.div>
  );
};

export default ProjectFilter;
