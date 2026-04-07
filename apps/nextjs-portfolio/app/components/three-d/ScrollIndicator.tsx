'use client';

import { motion } from 'motion/react';
import { useState } from 'react';

export const ScrollIndicator = ({
  currentSlide,
  totalSlides,
}: {
  currentSlide: number;
  totalSlides: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div
      className='hidden md:block fixed left-0 top-0 h-full w-1.5 z-40 pointer-events-none'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Track */}
      <div className='absolute inset-0 bg-surface-subtle rounded-r-full' />

      {/* Progress Fill */}
      <motion.div
        className='absolute bottom-0 left-0 right-0 bg-accent origin-bottom rounded-r-full'
        initial={{ scaleY: 0 }}
        animate={{ scaleY: progress / 100 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{
          boxShadow: '0 0 12px rgba(var(--color-accent-rgb), 0.4)',
        }}
      />

      {/* Hover Tooltip */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, x: -8, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -8, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className='absolute left-5 top-1/2 -translate-y-1/2 bg-surface border border-border px-4 py-2.5 rounded-lg shadow-xl pointer-events-auto'
        >
          <div className='flex items-center gap-2'>
            <div className='h-1.5 w-1.5 rounded-full bg-accent' />
            <div className='text-sm font-mono text-accent whitespace-nowrap font-semibold'>
              {currentSlide + 1} / {totalSlides}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
