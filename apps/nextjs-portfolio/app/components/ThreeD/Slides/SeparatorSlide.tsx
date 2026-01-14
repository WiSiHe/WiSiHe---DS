'use client';

import { motion } from 'motion/react';
import type { PresentationSlide } from '../../../three-d/types';
import { cn } from '@wisihe/utils';

interface SeparatorSlideProps {
  slideData: PresentationSlide;
  index: number;
  shouldAnimate: boolean;
  slideDirection: 'up' | 'down';
}

export const SeparatorSlide = ({
  slideData,
  index,
  shouldAnimate,
  slideDirection,
}: SeparatorSlideProps) => {
  const design = slideData.slideDesign || 'default';

  // Design: minimal - clean, understated
  if (design === 'minimal') {
    return (
      <motion.div
        key={`separator-${index}`}
        initial={shouldAnimate ? { opacity: 0 } : {}}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full flex items-center justify-center"
      >
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-foreground/80 tracking-wide text-center px-4">
          {slideData.title}
        </h2>
      </motion.div>
    );
  }

  // Design: bold - dramatic, full impact
  if (design === 'bold') {
    return (
      <motion.div
        key={`separator-${index}`}
        initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : {}}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* Bold background accent */}
        <div className="absolute inset-0 bg-accent/10" />
        <div className="absolute top-0 left-0 w-full h-2 bg-accent" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-accent" />

        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground uppercase tracking-tighter text-center leading-none px-4"
        >
          {slideData.title}
        </motion.h2>
      </motion.div>
    );
  }

  // Design: hero - cinematic with gradient
  if (design === 'hero') {
    return (
      <motion.div
        key={`separator-${index}`}
        initial={shouldAnimate ? { opacity: 0, y: slideDirection === 'down' ? 60 : -60 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full h-full flex flex-col items-center justify-center relative"
      >
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />

        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground uppercase tracking-tight text-center px-4"
        >
          {slideData.title}
        </motion.h2>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '12rem' }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 h-1.5 bg-accent rounded-full"
        />
      </motion.div>
    );
  }

  // Design: centered - balanced with decorative elements
  if (design === 'centered') {
    return (
      <motion.div
        key={`separator-${index}`}
        initial={shouldAnimate ? { opacity: 0, y: slideDirection === 'down' ? 30 : -30 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full flex flex-col items-center justify-center relative"
      >
        {/* Decorative circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-accent/20 rounded-full" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="w-3 h-3 bg-accent rounded-full mb-8"
        />

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground text-center px-4 relative z-10">
          {slideData.title}
        </h2>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="w-3 h-3 bg-accent rounded-full mt-8"
        />
      </motion.div>
    );
  }

  // Default design - clean with horizontal line
  return (
    <motion.div
      key={`separator-${index}`}
      initial={shouldAnimate ? { opacity: 0, y: slideDirection === 'down' ? 40 : -40 } : {}}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full flex flex-col items-center justify-center relative"
    >
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-accent/5" />

      {/* Horizontal line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/30 to-transparent" />

      <motion.h2
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className={cn(
          'text-5xl md:text-7xl lg:text-8xl font-black text-foreground uppercase tracking-tight text-center px-4 relative z-10',
        )}
      >
        {slideData.title}
      </motion.h2>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 h-1 w-32 bg-accent rounded-full"
      />
    </motion.div>
  );
};
