'use client';

import { motion } from 'motion/react';
import { resolveCssColorForAnimation } from '../ThreeD/utils/colorUtils';
import { useMemo } from 'react';

export const HistoryTimeline = ({
  currentHistorySlideIndex,
}: {
  currentHistorySlideIndex?: number;
}) => {
  // Timeline with all eras, progressively animating based on slide index (0-3)
  const milestones = [
    { period: '1995-2010', milestone: 'Plugin Era', position: 0 },
    { period: '2011', milestone: 'WebGL', position: 33 },
    { period: 'Mid-2010s', milestone: 'Three.js', position: 66 },
    { period: '2020s', milestone: 'React Three Fiber', position: 100 },
  ];

  // Calculate progress based on slide index (0-3 maps to 0%, 33%, 66%, 100%)
  const slideIndex = currentHistorySlideIndex ?? 0;
  const progressWidth = (slideIndex / 3) * 100;

  // Resolve CSS colors for animations (only on client side)
  const accentColor = useMemo(
    () => resolveCssColorForAnimation('hsl(var(--accent))', '#ff00ff'),
    [],
  );
  const foregroundColor = useMemo(
    () => resolveCssColorForAnimation('hsl(var(--foreground))', '#ffffff'),
    [],
  );
  const foregroundColor20 = useMemo(
    () => resolveCssColorForAnimation('hsl(var(--foreground) / 0.2)', 'rgba(255, 255, 255, 0.2)'),
    [],
  );
  const foregroundColor50 = useMemo(
    () => resolveCssColorForAnimation('hsl(var(--foreground) / 0.5)', 'rgba(255, 255, 255, 0.5)'),
    [],
  );
  const foregroundColor60 = useMemo(
    () => resolveCssColorForAnimation('hsl(var(--foreground) / 0.6)', 'rgba(255, 255, 255, 0.6)'),
    [],
  );

  return (
    <div className="w-full min-w-0 max-w-full py-4 md:py-6 px-2 md:px-4 overflow-hidden">
      <div className="relative max-w-full">
        {/* Timeline Line Background */}
        <div className="absolute top-6 md:top-8 left-0 right-0 h-1 md:h-1.5 bg-surface rounded-full" />

        {/* Animated Progress Line - Progressive Drawing with Spring */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressWidth}%` }}
          transition={{
            type: 'spring',
            bounce: 0.3,
            duration: 1.5,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="absolute top-6 md:top-8 left-0 h-1 md:h-1.5 bg-accent rounded-full origin-left"
          style={{
            boxShadow: '0 0 12px hsl(var(--accent) / 0.5)',
          }}
        />
        {/* Animated glow effect that follows the line */}
        <motion.div
          animate={{
            left: `${progressWidth}%`,
            opacity: progressWidth > 0 ? 1 : 0,
          }}
          transition={{
            type: 'spring',
            bounce: 0.2,
            duration: 1.5,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="absolute top-6 md:top-8 w-6 md:w-8 h-1 md:h-1.5 -translate-x-1/2 bg-accent rounded-full blur-md opacity-60"
        />

        {/* Milestone Points */}
        <div className="relative flex justify-between items-start pt-2 gap-2 md:gap-0">
          {milestones.map((milestone, index) => {
            const isActive = index === slideIndex;
            const isReached = index <= slideIndex;
            const isNewlyActive = isActive && index === slideIndex;

            return (
              <motion.div
                key={milestone.period}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{
                  opacity: isReached ? 1 : 0.3,
                  scale: isActive ? 1.2 : isReached ? 1 : 0.7,
                  y: 0,
                }}
                transition={{
                  type: 'spring',
                  bounce: isNewlyActive ? 0.6 : 0.3,
                  duration: 0.8,
                  delay: isReached ? index * 0.1 : 0,
                }}
                whileHover={
                  isReached
                    ? {
                        scale: isActive ? 1.3 : 1.15,
                        y: -8,
                        transition: { type: 'spring', bounce: 0.4, duration: 0.5 },
                      }
                    : {}
                }
                className="flex flex-col items-center relative z-10 cursor-pointer flex-1 min-w-0"
                style={{ maxWidth: index === milestones.length - 1 ? 'auto' : '25%' }}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.4 : isReached ? 1 : 0.5,
                    backgroundColor: isActive
                      ? accentColor
                      : isReached
                        ? accentColor
                        : foregroundColor20,
                  }}
                  transition={{
                    type: 'spring',
                    bounce: isNewlyActive ? 0.5 : 0.3,
                    duration: 0.7,
                    delay: isReached ? index * 0.1 : 0,
                  }}
                  className={[
                    'w-4 h-4 md:w-5 md:h-5 rounded-full border-2 md:border-4 border-background relative z-10 transition-all',
                    isActive && 'ring-4 ring-accent/50',
                    !isActive && isReached && 'ring-2 ring-accent/30',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
                <div className="mt-3 md:mt-4 text-center space-y-1 min-w-0 px-1">
                  <motion.div
                    animate={{
                      color: isActive
                        ? accentColor
                        : isReached
                          ? accentColor
                          : foregroundColor60,
                      fontWeight: isActive ? 700 : 600,
                      scale: isActive ? 1.05 : 1,
                    }}
                    transition={{
                      type: 'spring',
                      bounce: isNewlyActive ? 0.4 : 0.2,
                      duration: 0.6,
                    }}
                    className="text-xs md:text-sm font-semibold break-words"
                  >
                    {milestone.milestone}
                  </motion.div>
                  <motion.div
                    animate={{
                      color: isActive ? foregroundColor : foregroundColor50,
                      scale: isActive ? 1.05 : 1,
                    }}
                    transition={{
                      type: 'spring',
                      bounce: isNewlyActive ? 0.3 : 0.2,
                      duration: 0.5,
                    }}
                    className="text-[10px] md:text-xs mt-1 break-words"
                  >
                    {milestone.period}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
