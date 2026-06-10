'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

type HeroRetroLoaderProps = {
  onComplete: () => void;
};

const BOOT_LINES = [
  'WISIHE(R) CONSOLE V4.2.4',
  '(C) 2026 HENRIK SISSENER LABS',
  '------------------------------------',
  'CPU: GEIST DUAL-CORE 4.2GHZ',
  'RAM: 64MB SYSTEM INSTALLED',
  'MEMCHECK: OK',
  'BOOTING HENRIK_OS_MAIN...',
  'INITIALIZING SYSTEM GRIDS... OK',
  'CONNECTING SANITY CMS CONTENT... OK',
  'ESTABLISHING CANVAS MATRIX... OK',
  'COMPILING DESIGN UTILITIES... OK',
  'ALL SYSTEMS ACTIVE.',
];

export default function HeroRetroLoader({ onComplete }: HeroRetroLoaderProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Staggered boot lines
    const lineInterval = setInterval(() => {
      setCurrentLineIndex(prev => {
        if (prev < BOOT_LINES.length - 1) {
          return prev + 1;
        }
        clearInterval(lineInterval);
        return prev;
      });
    }, 120);

    // Fast-loading progress counter
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          const next = prev + Math.floor(Math.random() * 8) + 3;
          return next > 100 ? 100 : next;
        }
        clearInterval(progressInterval);
        return prev;
      });
    }, 50);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100 && currentLineIndex === BOOT_LINES.length - 1) {
      const timeout = setTimeout(() => {
        setIsDone(true);
        // Delay parent complete callback so wipe animation plays out
        setTimeout(onComplete, 1000);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [progress, currentLineIndex, onComplete]);

  // Generate grid coordinates for the 8x8 block-wipe overlay
  const GRID_SIZE = 8;
  const gridCells = Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;
    // Calculate distance from center for radial stagger effect
    const center = (GRID_SIZE - 1) / 2;
    const distance = Math.sqrt((row - center) ** 2 + (col - center) ** 2);
    return { id: i, row, col, distance };
  });

  return (
    <div className='fixed inset-0 z-[100] pointer-events-none select-none overflow-hidden'>
      {/* 1. Terminal boot overlay */}
      <AnimatePresence>
        {!isDone && (
          <motion.div
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.4 }}
            className='absolute inset-0 bg-background flex flex-col justify-between p-6 md:p-12 font-mono text-foreground pointer-events-auto border-4 border-foreground'
          >
            <div className='flex flex-col gap-1 max-w-xl text-left'>
              {BOOT_LINES.slice(0, currentLineIndex + 1).map(line => (
                <div
                  key={line}
                  className={
                    line.startsWith('ALL SYSTEMS') || line.endsWith('OK')
                      ? 'text-accent font-bold'
                      : 'text-foreground-subtle'
                  }
                >
                  {line}
                </div>
              ))}
              <div className='w-2.5 h-4 bg-foreground animate-pulse inline-block ml-1 mt-1' />
            </div>

            <div className='flex flex-col gap-2 w-full max-w-xs md:max-w-md mt-8'>
              <div className='flex justify-between font-mono font-bold text-xs md:text-sm'>
                <span>LOADING SYSTEM MODULES</span>
                <span>{progress}%</span>
              </div>
              <div className='h-4 w-full bg-surface-elevated border border-foreground relative overflow-hidden'>
                <div
                  className='h-full bg-accent transition-all duration-75'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Grid block-wipe reveal overlay */}
      <AnimatePresence>
        {!isDone && (
          <div className='absolute inset-0 grid grid-cols-8 grid-rows-8 w-full h-full pointer-events-none z-[90]'>
            {gridCells.map(cell => (
              <div key={cell.id} className='bg-background border border-border/10 w-full h-full' />
            ))}
          </div>
        )}
        {isDone && (
          <div className='absolute inset-0 grid grid-cols-8 grid-rows-8 w-full h-full pointer-events-none z-[90]'>
            {gridCells.map(cell => (
              <motion.div
                key={cell.id}
                initial={{ scale: 1.05, opacity: 1 }}
                animate={{ scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.45,
                  delay: cell.distance * 0.08,
                  ease: [0.16, 1, 0.3, 1], // easeOutExpo
                }}
                className='bg-background border border-border/10 w-full h-full origin-center'
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
