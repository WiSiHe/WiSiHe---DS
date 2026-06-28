'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DosDontGallery, type DosDontItem } from '../DosDontGallery';

function useMotionDemoReady() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return { reduced: mounted && prefersReducedMotion };
}

function ReplayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='mt-2 text-[11px] font-medium text-foreground-muted hover:text-accent'
    >
      Replay
    </button>
  );
}

const items: DosDontItem[] = [
  {
    label: 'Section reveal',
    hint: 'Once on enter — not a looping headline',
    do: <SectionRevealDo />,
    dont: <SectionRevealDont />,
  },
  {
    label: 'Card hover',
    hint: 'Subtle scale; disabled when reduced motion',
    do: <CardHoverDo />,
    dont: <CardHoverDont />,
  },
  {
    label: 'Tap feedback',
    do: <TapFeedbackDo />,
    dont: <TapFeedbackDont />,
  },
  {
    label: 'Loading',
    hint: 'Skeleton, not a fake progress bar',
    do: <LoadingDo />,
    dont: <LoadingDont />,
  },
];

function SectionRevealDo() {
  const { reduced } = useMotionDemoReady();
  const [key, setKey] = useState(0);

  return (
    <>
      <motion.h3
        key={key}
        className='font-serif text-lg font-bold text-foreground'
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
      >
        Featured work
      </motion.h3>
      <ReplayButton onClick={() => setKey(k => k + 1)} />
    </>
  );
}

function SectionRevealDont() {
  return (
    <motion.h3
      className='font-serif text-lg font-bold text-foreground'
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.4 }}
    >
      Featured work
    </motion.h3>
  );
}

function CardHoverDo() {
  const { reduced } = useMotionDemoReady();
  return (
    <motion.div
      className='flex h-20 w-full max-w-[200px] cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-sm'
      whileHover={reduced ? undefined : { scale: 1.02 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      Hover
    </motion.div>
  );
}

function CardHoverDont() {
  return (
    <motion.div
      className='flex h-20 w-full max-w-[200px] cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-sm shadow-lg'
      whileHover={{ rotate: 4, scale: 1.08 }}
      transition={{ duration: 0.35 }}
    >
      Hover
    </motion.div>
  );
}

function TapFeedbackDo() {
  const { reduced } = useMotionDemoReady();
  return (
    <motion.button
      type='button'
      className='rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast'
      whileTap={reduced ? undefined : { scale: 0.98 }}
    >
      Save
    </motion.button>
  );
}

function TapFeedbackDont() {
  return (
    <motion.button
      type='button'
      className='rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast'
      animate={{ scale: [1, 0.92, 1] }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2 }}
    >
      Save
    </motion.button>
  );
}

function LoadingDo() {
  return (
    <div className='w-full max-w-[200px] space-y-2' aria-busy='true'>
      <div className='h-2.5 w-3/4 animate-pulse rounded bg-surface-hover' />
      <div className='h-2.5 w-full animate-pulse rounded bg-surface-hover' />
    </div>
  );
}

function LoadingDont() {
  return (
    <div className='w-full max-w-[200px]'>
      <div className='h-1.5 overflow-hidden rounded-full bg-surface-hover'>
        <motion.div
          className='h-full w-1/3 rounded-full bg-accent'
          animate={{ x: ['-100%', '320%'] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: 'linear' }}
        />
      </div>
    </div>
  );
}

export function MotionLiveExamples() {
  return (
    <DosDontGallery
      description='Interact with the left column. Motion should orient or confirm — never decorate.'
      items={items}
    />
  );
}
