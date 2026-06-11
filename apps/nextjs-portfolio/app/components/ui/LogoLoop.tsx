'use client';

import clsx from 'clsx';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

type LogoLoopProps = {
  children: ReactNode;
  speed?: number; // Duration in seconds for one full cycle
  direction?: 'left' | 'right';
  className?: string;
  gradient?: boolean;
};

/**
 * Endless scrolling component (Marquee) simulating React Bits LogoLoop.
 * Utilizes motion/react for perfectly smooth framer-synced transitions.
 */
export const LogoLoop = ({
  children,
  speed = 20,
  direction = 'left',
  className,
  gradient = true,
}: LogoLoopProps) => {
  const isLeft = direction === 'left';

  return (
    <div className={clsx('overflow-hidden flex w-full relative group', className)}>
      {/* Optional gradient fade at edges */}
      {gradient && (
        <>
          <div className='absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none' />
          <div className='absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none' />
        </>
      )}

      {/* The scrolling track */}
      <motion.div
        className='flex whitespace-nowrap min-w-max shrink-0 items-center'
        animate={{
          x: isLeft ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
      >
        {/* Render children twice to ensure the loop is seamless */}
        <div className='flex shrink-0 items-center px-4'>{children}</div>
        <div className='flex shrink-0 items-center px-4'>{children}</div>
      </motion.div>
    </div>
  );
};
