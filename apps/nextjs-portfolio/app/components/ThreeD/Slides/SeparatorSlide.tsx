'use client';

import { motion } from 'motion/react';
import type { PresentationSlide } from '../../../three-d/types';

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
  return (
    <motion.div
      key={`separator-${index}`}
      initial={
        shouldAnimate
          ? {
              opacity: 0,
              scale: 0.95,
              y: slideDirection === 'down' ? 50 : -50,
            }
          : { opacity: 1, scale: 1, y: 0 }
      }
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className="text-center space-y-8 py-12 relative w-full"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-0 w-32 h-1 bg-accent/20 rounded-full" />
      <div className="absolute top-1/2 right-0 w-32 h-1 bg-accent/20 rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="inline-flex items-center gap-3 mb-8 relative z-10 px-4 py-2.5 bg-surface-elevated/80 backdrop-blur-sm rounded-full border border-border/50 shadow-lg"
      >
        <span className="px-4 py-1.5 text-xs font-mono text-foreground/60 uppercase tracking-wider">
          SECTION
        </span>
        {slideData.category && (
          <>
            <div className="h-1 w-1 rounded-full bg-border" />
            <span className="px-4 py-1.5 text-xs font-semibold text-accent uppercase tracking-wider">
              {slideData.category}
            </span>
          </>
        )}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] 2xl:text-[14rem] font-black mb-8 text-foreground uppercase leading-[1.1] tracking-tight relative z-10 px-4"
      >
        <span className="block text-foreground">
          {slideData.title}
        </span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex justify-center gap-4 mt-12 relative z-10"
      >
        <div className="h-1 w-24 bg-accent rounded-full" />
        <div className="h-1 w-16 bg-accent/70 rounded-full" />
        <div className="h-1 w-8 bg-accent/50 rounded-full" />
      </motion.div>
    </motion.div>
  );
};

