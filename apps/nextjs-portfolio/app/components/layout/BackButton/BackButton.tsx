'use client';

/**
 * Floating back button — bottom-left, above the mobile bottom nav.
 * Uses router.back() if there's history; falls back to a given href.
 *
 * Appears with a subtle entrance animation and stays out of the way of content.
 */

import { IconArrowLeft } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface BackButtonProps {
  /** Fallback URL when the user landed directly (no browser history). */
  fallbackHref: string;
}

export default function BackButton({ fallbackHref }: BackButtonProps) {
  const router = useRouter();
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    // history.length > 1 means there's somewhere to go back to
    setHasHistory(window.history.length > 1);
  }, []);

  const handleBack = useCallback(() => {
    if (hasHistory) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }, [hasHistory, fallbackHref, router]);

  return (
    <motion.button
      type='button'
      onClick={handleBack}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.15, ease: 'easeOut' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className='fixed bottom-24 left-4 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full
        bg-surface/80 backdrop-blur-md border border-border shadow-lg
        text-sm font-medium text-foreground-subtle hover:text-foreground
        hover:border-accent-border hover:bg-surface
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
      aria-label='Go back'
    >
      <IconArrowLeft className='size-4' stroke={2} aria-hidden />
      Back
    </motion.button>
  );
}
