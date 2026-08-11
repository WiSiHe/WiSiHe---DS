'use client';

import { IconArrowLeft, IconArrowUpRight } from '@tabler/icons-react';
import { navigationItems } from '@wisihe/constants';
import { Button } from '@wisihe/ui-react';
import { motion, useMotionValue, useReducedMotion, useSpring, type Variants } from 'motion/react';
import Image from 'next/image';
import type { PointerEvent } from 'react';
import { Link } from '../ProgressLink';

/** Explorer painting — character left, negative space right for copy. */
const EXPLORER_IMAGE = '/images/explorer.png';

const DESTINATIONS = navigationItems.map(item => ({
  href: item.href,
  label: item.label,
}));

const NotFoundSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 60, damping: 20, mass: 0.4 });
  const springY = useSpring(pointerY, { stiffness: 60, damping: 20, mass: 0.4 });

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const { currentTarget, clientX, clientY } = event;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    pointerX.set(x * -14);
    pointerY.set(y * -10);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const textStaggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.09,
        delayChildren: reducedMotion ? 0 : 0.18,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 140,
        damping: 22,
      },
    },
  };

  return (
    <section
      className='relative min-h-dvh w-full overflow-hidden bg-background'
      aria-labelledby='not-found-heading'
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <motion.figure
        className='pointer-events-none absolute inset-0'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className='absolute inset-0 will-change-transform'
          style={reducedMotion ? undefined : { x: springX, y: springY }}
          initial={reducedMotion ? false : { scale: 1.08 }}
          animate={reducedMotion ? undefined : { scale: 1.04 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={EXPLORER_IMAGE}
            alt='Painting of a female explorer looking toward open trail ahead'
            fill
            priority
            sizes='100vw'
            className='object-cover object-[18%_42%] sm:object-[22%_40%] lg:object-left'
          />
        </motion.div>
        <div
          className='absolute inset-0 bg-linear-to-t from-background via-background/55 to-background/10 sm:via-background/40 lg:bg-linear-to-r lg:from-background/15 lg:via-background/55 lg:to-background'
          aria-hidden
        />
        <div
          className='absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,transparent_0%,var(--color-background)_78%)] opacity-80 max-lg:hidden'
          aria-hidden
        />
      </motion.figure>

      <div className='relative z-1 mx-auto flex min-h-dvh w-full max-w-7xl items-end px-6 pb-24 pt-28 sm:px-10 sm:pb-28 lg:items-center lg:justify-end lg:px-12 lg:pb-20 lg:pt-20'>
        <motion.div
          className='w-full max-w-lg lg:max-w-md xl:max-w-lg'
          initial='hidden'
          animate='visible'
          variants={textStaggerVariants}
        >
          <motion.p
            variants={itemVariants}
            className='font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl'
          >
            WiSiHe
          </motion.p>

          <motion.p
            variants={itemVariants}
            className='mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent'
          >
            Error 404
          </motion.p>

          <motion.h1
            id='not-found-heading'
            variants={itemVariants}
            className='mt-3 font-serif text-2xl font-bold leading-snug tracking-tight text-foreground text-balance sm:text-3xl lg:text-4xl'
          >
            This trail doesn&apos;t exist
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className='mt-5 max-w-md text-base leading-relaxed text-foreground-subtle text-pretty sm:text-lg'
          >
            You&apos;ve wandered off the map. Head home, or choose another destination.
          </motion.p>

          <motion.div variants={itemVariants} className='mt-9 flex flex-wrap items-center gap-3'>
            <Button
              as={Link}
              href='/'
              variant='primary'
              size='large'
              Icon={IconArrowLeft}
              iconPosition='left'
              className='rounded-full'
            >
              Back home
            </Button>
          </motion.div>

          <motion.nav
            variants={itemVariants}
            aria-label='Suggested destinations'
            className='mt-10 border-t border-foreground/10 pt-6'
          >
            <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground-subtle'>
              Destinations
            </p>
            <ul className='mt-4 flex flex-col gap-1'>
              {DESTINATIONS.map(destination => (
                <li key={destination.href}>
                  <Link
                    href={destination.href}
                    className='group inline-flex items-center gap-2 py-1.5 text-base font-medium text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
                  >
                    <span>{destination.label}</span>
                    <IconArrowUpRight
                      aria-hidden
                      className='size-4 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100'
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        </motion.div>
      </div>
    </section>
  );
};

export default NotFoundSection;
