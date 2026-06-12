'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

type HomeSectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string | null;
  headingId?: string;
  descriptionId?: string;
  align?: 'center' | 'left';
};

export default function HomeSectionHeader({
  eyebrow,
  title,
  description,
  headingId,
  descriptionId,
  align = 'center',
}: HomeSectionHeaderProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = mounted && prefersReducedMotion;

  const isCenter = align === 'center';

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
      className={isCenter ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      <span className='mb-3 block font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-accent md:text-xs'>
        {eyebrow}
      </span>
      <h2
        id={headingId}
        className='font-serif text-3xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl'
      >
        {title}
      </h2>
      {description ? (
        <p
          id={descriptionId}
          className='mt-4 text-base leading-relaxed text-foreground-subtle md:text-lg text-pretty'
        >
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
