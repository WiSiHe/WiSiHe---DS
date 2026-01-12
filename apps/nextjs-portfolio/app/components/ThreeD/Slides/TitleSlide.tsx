'use client';

import { motion } from 'motion/react';
import type { PresentationSlide } from '../../../three-d/types';

interface TitleSlideProps {
  slideData: PresentationSlide;
  index: number;
  shouldAnimate: boolean;
  slideDirection: 'up' | 'down';
}

export const TitleSlide = ({
  slideData,
  index,
  shouldAnimate,
  slideDirection,
}: TitleSlideProps) => {
  return (
    <motion.div
      key={`title-${index}`}
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
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="text-center space-y-8 py-12 relative w-full"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="inline-flex items-center gap-3 mb-8 relative z-10 px-4 py-2.5 bg-surface-elevated/80 backdrop-blur-sm rounded-full border border-border/50 shadow-lg"
      >
        <span className="px-4 py-1.5 text-xs font-mono text-foreground/60 uppercase tracking-wider">
          PRESENTATION
        </span>
        {slideData.category && (
          <>
            <div className="h-1 w-1 rounded-full bg-border" />
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="px-4 py-1.5 text-xs font-semibold text-accent uppercase tracking-wider"
            >
              {slideData.category}
            </motion.span>
          </>
        )}
      </motion.div>
      <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[12rem] font-black mb-8 text-foreground uppercase leading-[1.1] tracking-tight relative z-10 px-4">
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="block mb-4 text-foreground"
        >
          {slideData.title.split(':')[0]}
        </motion.span>
        {slideData.title.includes(':') && (
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="block text-4xl md:text-5xl lg:text-6xl text-accent mt-4"
          >
            {slideData.title.split(':').slice(1).join(':')}
          </motion.span>
        )}
      </h1>
      {slideData.subtitle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10"
        >
          <p className="text-2xl md:text-4xl lg:text-5xl text-foreground/80 font-bold max-w-5xl mx-auto leading-relaxed mb-6">
            {slideData.subtitle}
          </p>
          <div className="flex justify-center gap-2 mt-8">
            <div className="h-1 w-16 bg-accent rounded-full" />
            <div className="h-1 w-8 bg-accent/50 rounded-full" />
            <div className="h-1 w-4 bg-accent/30 rounded-full" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

