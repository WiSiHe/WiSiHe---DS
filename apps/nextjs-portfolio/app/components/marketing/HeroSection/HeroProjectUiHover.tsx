'use client';

import { motion } from 'motion/react';

type HeroProjectUiHoverProps = {
  accentColor: string;
  secondaryColor: string;
  title?: string | null;
  tags?: string[] | null;
};

export function HeroProjectUiHover({
  accentColor,
  secondaryColor,
  title,
  tags,
}: HeroProjectUiHoverProps) {
  // Variants for parent container hover propagation
  const containerVariants = {
    initial: { opacity: 0 },
    hover: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  // Variants for technical blueprint borders/lines
  const lineVariants = {
    initial: { scaleX: 0, scaleY: 0, opacity: 0 },
    hover: {
      scaleX: 1,
      scaleY: 1,
      opacity: 0.85,
      transition: { duration: 0.45, ease: 'easeOut' as const },
    },
  };

  // Variants for corner crosshairs/braces sliding in
  const cornerVariants = (x: number, y: number) => ({
    initial: { x: x * 15, y: y * 15, opacity: 0 },
    hover: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 200, damping: 15 },
    },
  });

  // Variants for tag chips
  const tagVariants = {
    initial: { opacity: 0, y: 10, scale: 0.9 },
    hover: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 150, damping: 12 },
    },
  };

  // Variants for the project title
  const titleVariants = {
    initial: { opacity: 0, y: 8, filter: 'blur(2px)' },
    hover: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      className='absolute inset-0 z-2 flex flex-col justify-between p-4 pointer-events-none'
    >
      {/* Blueprint Grid Overlay */}
      <div className='absolute inset-0 bg-black/45 mix-blend-multiply transition-opacity duration-300' />
      <div
        className='absolute inset-0 opacity-15'
        style={{
          backgroundImage: `
            linear-gradient(to right, ${accentColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${accentColor} 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Cyber/Tech Border Borders (revealing lines) */}
      <motion.div
        variants={lineVariants}
        className='absolute left-3 right-3 top-3 h-[1px] origin-left'
        style={{ backgroundColor: accentColor }}
      />
      <motion.div
        variants={lineVariants}
        className='absolute bottom-3 left-3 right-3 h-[1px] origin-right'
        style={{ backgroundColor: accentColor }}
      />
      <motion.div
        variants={lineVariants}
        className='absolute bottom-3 top-3 left-3 w-[1px] origin-top'
        style={{ backgroundColor: secondaryColor }}
      />
      <motion.div
        variants={lineVariants}
        className='absolute bottom-3 top-3 right-3 w-[1px] origin-bottom'
        style={{ backgroundColor: secondaryColor }}
      />

      {/* Blueprint Corner Braces (springing in) */}
      <motion.div
        custom={[-1, -1]}
        variants={cornerVariants(-1, -1)}
        className='absolute left-2 top-2 h-3 w-3 border-l-2 border-t-2'
        style={{ borderColor: accentColor }}
      />
      <motion.div
        custom={[1, -1]}
        variants={cornerVariants(1, -1)}
        className='absolute right-2 top-2 h-3 w-3 border-r-2 border-t-2'
        style={{ borderColor: accentColor }}
      />
      <motion.div
        custom={[-1, 1]}
        variants={cornerVariants(-1, 1)}
        className='absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2'
        style={{ borderColor: secondaryColor }}
      />
      <motion.div
        custom={[1, 1]}
        variants={cornerVariants(1, 1)}
        className='absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2'
        style={{ borderColor: secondaryColor }}
      />

      {/* Top Section: Tech tags/chips */}
      <div className='relative z-3 flex flex-wrap gap-1.5 justify-start'>
        {tags && tags.length > 0
          ? tags.slice(0, 3).map((tag, idx) => (
              <motion.span
                key={`${tag}-${idx}`}
                variants={tagVariants}
                className='rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-white backdrop-blur-md border border-white/10'
                style={{
                  boxShadow: `0 0 8px ${accentColor}22`,
                }}
              >
                {tag}
              </motion.span>
            ))
          : null}
      </div>

      {/* Bottom Section: Modern cyber typography title */}
      <div className='relative z-3 mt-auto'>
        {title ? (
          <motion.div variants={titleVariants} className='space-y-1'>
            <span className='font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 block'>
              {'// PROJECT DETAILS'}
            </span>
            <h3 className='line-clamp-2 text-left font-sans text-xl font-black leading-tight tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] uppercase'>
              {title}
            </h3>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}
