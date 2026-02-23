'use client';

import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import type { IconType } from 'react-icons';
import { FaCode, FaPlug, FaReact, FaRocket } from 'react-icons/fa';

interface HistoryTimelineProps {
  activeIndex: number;
}

interface Phase {
  period: string;
  title: string;
  icon: IconType;
  iconColor: string;
}

const PHASES: Phase[] = [
  {
    period: '1995 - 2010',
    title: 'The Dark Ages',
    icon: FaPlug, // Flash/VRML plugins
    iconColor: 'text-neutral-500',
  },
  {
    period: '2011 - 2018',
    title: 'The Hard Way',
    icon: FaCode, // WebGL/Vanilla Three.js (Math heavy)
    iconColor: 'text-warning-500',
  },
  {
    period: '2019 - 2023',
    title: 'The React Era',
    icon: FaReact, // R3F changed the DX (Developer Experience)
    iconColor: 'text-info-500',
  },
  {
    period: 'Now & Beyond',
    title: 'WebGPU & Spline', // The "New" stuff: Performance + Tooling
    icon: FaRocket,
    iconColor: 'text-success-500',
  },
];

export const HistoryTimeline = ({ activeIndex }: HistoryTimelineProps) => {
  return (
    <div className='w-full h-full relative flex items-center justify-center p-8 lg:p-12'>
      {/* Main Container */}
      <div className='relative w-full max-w-lg'>
        {/* Timeline Line Container */}
        {/* Width of 4rem (16) matches the padding-right of the items to ensure alignment */}
        <div className='absolute right-0 top-0 bottom-0 w-16 flex justify-center z-0'>
          {/* Background Line */}
          <div className='w-0.5 h-full bg-border/20 rounded-full' />

          {/* Active Progress Line */}
          <motion.div
            className='absolute top-0 w-0.5 bg-accent rounded-full origin-top'
            initial={{ height: 0 }}
            animate={{ height: `${(activeIndex / (PHASES.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 10 }}
          />
        </div>

        {/* Items List */}
        <div className='flex flex-col gap-8 w-full'>
          {PHASES.map((phase, index) => {
            const isActive = index === activeIndex;
            const isPast = index < activeIndex;
            const isFuture = index > activeIndex;

            // Calculate opacity for animation
            const getOpacity = () => {
              if (isFuture) return 0;
              if (isPast) return 0.5;
              return 1;
            };

            // Get node classes based on state
            const getNodeClasses = () => {
              const base = 'rounded-full transition-all duration-700';
              if (isActive) {
                return `${base} w-4 h-4 bg-background border-2 border-accent shadow-[0_0_0_4px_rgba(77,212,212,0.2)]`;
              }
              if (isPast) {
                return `${base} w-3 h-3 bg-accent border-none`;
              }
              return `${base} w-3 h-3 bg-background border border-border`;
            };

            return (
              <motion.div
                key={phase.title}
                className={cn(
                  'relative flex items-center justify-end w-full pr-16', // 4rem padding for line
                  isFuture ? 'opacity-0 pointer-events-none' : 'opacity-100',
                )}
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: getOpacity(),
                  x: isFuture ? 20 : 0,
                }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 10 }}
              >
                {/* Node - Centered in the 4rem (w-16) right gutter */}
                <div className='absolute right-0 top-1/2 -translate-y-1/2 w-16 flex items-center justify-center z-10'>
                  <motion.div
                    className={getNodeClasses()}
                    animate={{
                      scale: isActive ? 1.2 : 1,
                    }}
                  />
                </div>

                {/* Card Content */}
                <motion.div
                  className={cn(
                    'w-full bg-surface border border-border rounded-xl transition-all duration-700 relative overflow-hidden',
                    isActive
                      ? 'bg-surface shadow-[0_8px_30px_rgb(0,0,0,0.12)] scale-[1.02]'
                      : 'grayscale opacity-70',
                  )}
                  style={{
                    // Only apply border to active item for emphasis, inactive blends in
                    border: isActive
                      ? '1px solid rgba(77, 212, 212, 0.2)'
                      : '1px solid transparent',
                  }}
                >
                  {/* Active Accent Strip */}
                  {isActive && (
                    <motion.div
                      layoutId='active-strip'
                      className='absolute left-0 top-0 bottom-0 w-1 bg-accent'
                    />
                  )}

                  <div className='p-4 pl-6 flex items-center gap-4'>
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors bg-surface-elevated',
                        phase.iconColor,
                        isActive ? 'opacity-100' : 'opacity-50',
                      )}
                    >
                      <phase.icon className={isActive ? 'w-6 h-6' : 'w-5 h-5'} />
                    </div>

                    <div className='min-w-0 flex-1'>
                      <div className='text-[10px] uppercase tracking-wider font-bold opacity-40 mb-1'>
                        {phase.period}
                      </div>
                      <div
                        className={cn(
                          'font-bold text-lg truncate transition-colors',
                          isActive ? 'text-foreground' : 'text-foreground/60',
                        )}
                      >
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
