'use client';

import { motion } from 'motion/react';

interface TechnicalProgressBarProps {
  currentSlide: number;
  totalSlides: number;
}

export function TechnicalProgressBar({ currentSlide, totalSlides }: TechnicalProgressBarProps) {
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className="absolute top-0 left-0 right-0 h-1.5 bg-surface-subtle z-50">
      <motion.div
        className="h-full bg-accent shadow-lg"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
