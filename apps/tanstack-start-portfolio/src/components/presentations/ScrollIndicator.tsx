'use client';

import { motion } from 'motion/react';
import { useState } from 'react';

export function ScrollIndicator({
  currentSlide,
  totalSlides,
}: {
  currentSlide: number;
  totalSlides: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div
      className='pointer-events-none fixed top-0 left-0 z-40 hidden h-full w-1.5 md:block'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='absolute inset-0 rounded-r-full bg-surface-subtle' />
      <motion.div
        className='absolute right-0 bottom-0 left-0 origin-bottom rounded-r-full bg-accent'
        initial={{ scaleY: 0 }}
        animate={{ scaleY: progress / 100 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{
          boxShadow: '0 0 12px rgba(var(--color-accent-rgb), 0.4)',
        }}
      />
      {isHovered ? (
        <motion.div
          initial={{ opacity: 0, x: -8, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -8, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className='pointer-events-auto absolute top-1/2 left-5 -translate-y-1/2 rounded-lg border border-border bg-surface px-4 py-2.5 shadow-xl'
        >
          <div className='flex items-center gap-2'>
            <div className='h-1.5 w-1.5 rounded-full bg-accent' />
            <div className='font-mono text-sm font-semibold whitespace-nowrap text-accent'>
              {currentSlide + 1} / {totalSlides}
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
