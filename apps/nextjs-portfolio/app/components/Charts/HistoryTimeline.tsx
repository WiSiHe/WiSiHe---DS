'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { cn } from '@wisihe/utils';

interface HistoryTimelineProps {
  activeIndex: number;
}

interface Phase {
  period: string;
  title: string;
  icon?: string;
  emoji?: string;
  color: string;
}

const PHASES: Phase[] = [
  {
    period: '1995-2010',
    title: 'The Dark Ages',
    emoji: '⚡',
    color: '#8b5cf6',
  },
  {
    period: '2011',
    title: 'The Spark',
    emoji: '🔺',
    color: '#f59e0b',
  },
  {
    period: 'Mid-2010s',
    title: 'The Foundation',
    emoji: '📦',
    color: '#10b981',
  },
  {
    period: '2020s',
    title: 'The Explosion',
    emoji: '🚀',
    color: '#ec4899',
  },
];

export const HistoryTimeline = ({ activeIndex }: HistoryTimelineProps) => {
  // Calculate progress percentage for the line fill
  const progressPercent = (activeIndex / (PHASES.length - 1)) * 100;

  return (
    <div className="w-full py-8 px-4">
      {/* Timeline container */}
      <div className="relative">
        {/* Horizontal line - background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-foreground/10" />

        {/* Horizontal line - progress fill */}
        <motion.div
          className="absolute top-5 left-0 h-0.5 origin-left"
          style={{ backgroundColor: PHASES[activeIndex].color }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Points and labels */}
        <div className="relative flex justify-between">
          {PHASES.map((phase, index) => {
            const isActive = index === activeIndex;
            const isReached = index <= activeIndex;

            return (
              <div
                key={phase.period}
                className="flex flex-col items-center"
                style={{ width: '25%' }}
              >
                {/* Dot */}
                <motion.div
                  className={cn(
                    'w-3 h-3 rounded-full border-2 transition-colors duration-300',
                    isReached ? 'border-transparent' : 'border-foreground/20 bg-background',
                  )}
                  style={{
                    backgroundColor: isReached ? phase.color : undefined,
                  }}
                  animate={{
                    scale: isActive ? 2 : 1,
                  }}
                  transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
                />

                {/* Icon container */}
                <motion.div
                  className={cn(
                    'mt-4 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300',
                    isReached ? 'bg-foreground/5' : 'bg-transparent',
                  )}
                  animate={{
                    opacity: isReached ? 1 : 0.4,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {phase.icon ? (
                    <Image
                      src={phase.icon}
                      alt={phase.title}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  ) : (
                    <span className={cn('text-2xl', !isReached && 'grayscale opacity-50')}>
                      {phase.emoji}
                    </span>
                  )}
                </motion.div>

                {/* Title */}
                <motion.span
                  className={cn(
                    'mt-2 text-xs md:text-sm font-semibold text-center leading-tight transition-colors duration-300',
                  )}
                  style={{
                    color: isActive ? phase.color : undefined,
                  }}
                  animate={{
                    opacity: isReached ? 1 : 0.4,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {phase.title}
                </motion.span>

                {/* Period */}
                <motion.span
                  className="mt-1 text-[10px] md:text-xs text-foreground/50 text-center"
                  animate={{
                    opacity: isReached ? 0.7 : 0.3,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {phase.period}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>

      {/* "We are here" indicator */}
      {activeIndex === PHASES.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex justify-center mt-6"
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${PHASES.at(-1)?.color}15`,
              color: PHASES.at(-1)?.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: PHASES.at(-1)?.color }}
            />
            We are here
          </span>
        </motion.div>
      )}
    </div>
  );
};
