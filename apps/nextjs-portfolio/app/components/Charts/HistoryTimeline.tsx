'use client';

import { motion } from 'motion/react';
import { cn } from '@wisihe/utils';
import { GridBackground } from '../ThreeD/GridBackground';

interface HistoryTimelineProps {
  activeIndex: number;
}

interface Phase {
  period: string;
  title: string;
  emoji: string;
  color: string;
}

const PHASES: Phase[] = [
  {
    period: '1995 - 2010',
    title: 'The Dark Ages',
    emoji: '🔌', // Flash/VRML plugins
    color: '#64748b', 
  },
  {
    period: '2011 - 2018',
    title: 'The Hard Way',
    emoji: '📐', // WebGL/Vanilla Three.js (Math heavy)
    color: '#f59e0b',
  },
  {
    period: '2019 - 2023',
    title: 'The React Era',
    emoji: '⚛️', // R3F changed the DX (Developer Experience)
    color: '#3b82f6',
  },
  {
    period: 'Now & Beyond',
    title: 'WebGPU & Spline', // The "New" stuff: Performance + Tooling
    emoji: '🚀',
    color: '#10b981',
  },
];

export const HistoryTimeline = ({ activeIndex }: HistoryTimelineProps) => {
  return (
    <div className="w-full h-full relative flex items-center justify-center p-8 lg:p-12">
      {/* Grid Background */}
      <GridBackground size={40} opacity={0.05} />

      {/* Main Container */}
      <div className="relative w-full max-w-lg">

        {/* Timeline Line Container */}
        {/* Width of 4rem (16) matches the padding-right of the items to ensure alignment */}
        <div className="absolute right-0 top-0 bottom-0 w-16 flex justify-center z-0">
          {/* Background Line */}
          <div className="w-0.5 h-full bg-border/20 rounded-full" />

          {/* Active Progress Line */}
          <motion.div
            className="absolute top-0 w-0.5 bg-pink-500 rounded-full origin-top"
            initial={{ height: 0 }}
            animate={{ height: `${(activeIndex / (PHASES.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
          />
        </div>

        {/* Items List */}
        <div className="flex flex-col gap-8 w-full">
          {PHASES.map((phase, index) => {
            const isActive = index === activeIndex;
            const isPast = index < activeIndex;
            const isFuture = index > activeIndex;

            return (
              <motion.div
                key={phase.title}
                className={cn(
                  "relative flex items-center justify-end w-full pr-16", // 4rem padding for line
                  isFuture ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: isFuture ? 0 : isPast ? 0.5 : 1,
                  x: isFuture ? 20 : 0
                }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
              >
                {/* Node - Centered in the 4rem (w-16) right gutter */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 flex items-center justify-center z-10">
                  <motion.div
                    className={cn(
                      "rounded-full transition-all duration-700",
                      isActive ? "w-4 h-4 bg-background border-2 border-pink-500 shadow-[0_0_0_4px_rgba(236,72,153,0.2)]" :
                        isPast ? "w-3 h-3 bg-pink-500 border-none" : "w-3 h-3 bg-background border border-border"
                    )}
                    animate={{
                      scale: isActive ? 1.2 : 1,
                    }}
                  />
                </div>

                {/* Card Content */}
                <motion.div
                  className={cn(
                    "w-full bg-surface-elevated/50 rounded-xl transition-all duration-700 relative overflow-hidden",
                    isActive ? "bg-surface shadow-[0_8px_30px_rgb(0,0,0,0.12)] scale-[1.02]" : "grayscale opacity-70"
                  )}
                  style={{
                    // Only apply border to active item for emphasis, inactive blends in
                    border: isActive ? '1px solid rgba(236, 72, 153, 0.2)' : '1px solid transparent'
                  }}
                >
                  {/* Active Accent Strip */}
                  {isActive && (
                    <motion.div
                      layoutId="active-strip"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500"
                    />
                  )}

                  <div className="p-4 pl-6 flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors bg-surface-elevated/80",
                      isActive ? "text-xl" : "text-base opacity-50"
                    )}>
                      {phase.emoji}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase tracking-wider font-bold opacity-40 mb-1">
                        {phase.period}
                      </div>
                      <div className={cn(
                        "font-bold text-lg truncate transition-colors",
                        isActive ? "text-foreground" : "text-foreground/60"
                      )}>
                        {phase.title}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
