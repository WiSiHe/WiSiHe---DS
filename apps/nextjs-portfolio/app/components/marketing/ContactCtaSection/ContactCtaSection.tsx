'use client';

import { IconArrowRight } from '@tabler/icons-react';
import type { AboutQueryResult } from '@wisihe/sanity-queries';
import { Button } from '@wisihe/ui-react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { buildContactCtaCopy, type ContactCtaSectionData } from '@/lib/homeSectionCopy';

type ContactCtaSectionProps = {
  section: ContactCtaSectionData | null;
  about: AboutQueryResult | null;
};

function renderCtaTitle(title: string) {
  if (!title.includes('Future')) return title;
  const [before, after] = title.split('Future');
  return (
    <>
      {before}
      <span className='text-accent italic'>Future</span>
      {after}
    </>
  );
}

export default function ContactCtaSection({ section, about }: ContactCtaSectionProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = mounted && prefersReducedMotion;

  const copy = useMemo(() => buildContactCtaCopy(section, about), [section, about]);

  return (
    <section
      className='relative overflow-hidden border-t border-border/30 bg-surface/40 px-4 py-24 sm:py-32 md:px-8'
      aria-labelledby='contact-cta-heading'
    >
      <div
        className='pointer-events-none absolute top-1/2 left-1/2 h-[360px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[100px]'
        aria-hidden
      />

      <motion.div
        initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className='relative mx-auto max-w-3xl text-center'
      >
        <p className='font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-accent md:text-xs'>
          {copy.eyebrow}
        </p>
        <h2
          id='contact-cta-heading'
          className='mt-4 font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl text-balance'
        >
          {renderCtaTitle(copy.title)}
        </h2>
        <p className='mx-auto mt-5 max-w-xl text-base leading-relaxed text-foreground-subtle md:text-lg'>
          {copy.description}
        </p>

        <div className='mt-10 flex flex-wrap items-center justify-center gap-3'>
          <Button
            as={Link}
            href={copy.primaryUrl}
            variant='primary'
            size='large'
            Icon={IconArrowRight}
            iconPosition='right'
            className='rounded-full'
          >
            {copy.primaryLabel}
          </Button>
          <Button
            as={Link}
            href={copy.secondaryUrl}
            variant='secondary'
            size='large'
            className='rounded-full'
          >
            {copy.secondaryLabel}
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
