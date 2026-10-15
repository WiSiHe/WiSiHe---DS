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
  const [key, setKey] = useState(0);

  return (
    <>
      <motion.h3
        key={key}
        className='font-serif text-lg font-bold text-foreground'
        initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        Featured work
      </motion.h3>
      <ReplayButton onClick={() => setKey(k => k + 1)} />
    </>
  );
}

function CardHoverDo() {
  return (
    <motion.div
      className='w-full max-w-[200px] rounded-xl border border-border bg-surface p-3'
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <p className='text-xs font-semibold text-foreground'>Gentle lift</p>
      <p className='text-[10px] text-foreground-muted'>-4px on hover</p>
    </motion.div>
  );
}

function CardHoverDont() {
  return (
    <motion.div
      className='w-full max-w-[200px] rounded-xl border border-border bg-surface p-3'
      whileHover={{ scale: 1.15, rotate: 3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <p className='text-xs font-semibold text-foreground'>Bouncy pop</p>
      <p className='text-[10px] text-foreground-muted'>Distracting motion</p>
    </motion.div>
  );
}

function LoadingDo() {
  return (
    <div className='flex items-center gap-2'>
      <div className='size-2 animate-pulse rounded-full bg-accent' />
      <span className='text-xs text-foreground-subtle'>Saving changes...</span>
    </div>
  );
}

function LoadingDont() {
  return (
    <div className='flex items-center gap-2'>
      <motion.div
        className='size-4 rounded-full border-2 border-accent border-t-transparent'
        animate={{ rotate: 360 }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.4, ease: 'linear' }}
      />
      <span className='text-xs text-foreground-subtle'>Hyper spin</span>
    </div>
  );
}

const items: DosDontItem[] = [
  {
    label: 'Section reveal',
    do: <SectionRevealDo />,
    dont: <SectionRevealDont />,
  },
  {
    label: 'Card hover',
    do: <CardHoverDo />,
    dont: <CardHoverDont />,
  },
  {
    label: 'Loading',
    do: <LoadingDo />,
    dont: <LoadingDont />,
  },
];

export function MotionLiveExamples() {
  return <DosDontGallery items={items} />;
}
