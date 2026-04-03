'use client';

import { IconArrowLeft, IconPalette } from '@tabler/icons-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/** Place the painting asset at `public/explorer.png` (female explorer). */
const EXPLORER_IMAGE = '/images/explorer.png';

const NotFoundSection = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = mounted && prefersReducedMotion;

  const textStaggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1,
        delayChildren: reducedMotion ? 0 : 0.06,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 20,
      },
    },
  };

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-background"
      aria-labelledby="not-found-heading"
    >
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <motion.figure
          className="relative aspect-4/5 w-full shrink-0 lg:aspect-auto lg:w-[min(58%,720px)] lg:min-h-screen"
          initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: reducedMotion ? 0 : 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Image
            src={EXPLORER_IMAGE}
            alt="Painting of a female explorer in outdoor gear, looking toward the horizon"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover object-[center_38%] max-lg:object-[center_35%] lg:object-[18%_42%]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-background/10 lg:to-background/95"
            aria-hidden
          />
        </motion.figure>

        <motion.div
          className="relative z-1 flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:py-20 lg:pl-4 lg:pr-16"
          initial="hidden"
          animate="visible"
          variants={textStaggerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-foreground-subtle"
          >
            Error 404
          </motion.div>

          <motion.h1
            id="not-found-heading"
            variants={itemVariants}
            className="font-serif text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            This trail doesn&apos;t exist
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-5 max-w-md text-base leading-relaxed text-foreground-subtle sm:text-lg"
          >
            That page isn&apos;t on this site. Pick a destination below or start
            from the home page.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <IconArrowLeft aria-hidden className="h-4 w-4" />
              Back home
            </Link>
            <Link
              href="/paintings"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <IconPalette aria-hidden className="h-4 w-4" />
              View paintings
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NotFoundSection;
