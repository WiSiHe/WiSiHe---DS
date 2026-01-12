'use client';

import { motion } from 'motion/react';

export const PerformanceChart = () => {
  // Visual comparison showing optimization improvements with side-by-side bars
  return (
    <div className="w-full min-w-0 overflow-hidden max-w-full py-4">
      <div className="space-y-8">
        {/* Load Time Comparison */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-foreground">Load Time</span>
            <span className="text-base text-accent font-bold">2s vs 5s baseline</span>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative h-8 bg-surface-elevated rounded-lg border-2 border-border overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '40%' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-accent"
              />
            </div>
            <div className="flex-1 relative h-8 bg-surface-elevated rounded-lg border-2 border-border overflow-hidden">
              <div className="h-full bg-foreground/20" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Bundle Size Comparison */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-foreground">Bundle Size</span>
            <span className="text-base text-accent font-bold">150KB vs 500KB baseline</span>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative h-8 bg-surface-elevated rounded-lg border-2 border-border overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '30%' }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                className="h-full bg-accent"
              />
            </div>
            <div className="flex-1 relative h-8 bg-surface-elevated rounded-lg border-2 border-border overflow-hidden">
              <div className="h-full bg-foreground/20" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* FPS Comparison */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-foreground">Frame Rate</span>
            <span className="text-base text-accent font-bold">60 FPS vs 30 FPS baseline</span>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative h-8 bg-surface-elevated rounded-lg border-2 border-border overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                className="h-full bg-accent"
              />
            </div>
            <div className="flex-1 relative h-8 bg-surface-elevated rounded-lg border-2 border-border overflow-hidden">
              <div className="h-full bg-foreground/20" style={{ width: '50%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


