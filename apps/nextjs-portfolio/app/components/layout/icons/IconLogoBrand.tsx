'use client';

import { cn } from '@wisihe/utils';
import { motion, type TargetAndTransition, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import {
  ICON_LOGO_PATHS,
  LOGO_CASCADE_DURATION_S,
  LOGO_CASCADE_STAGGER_S,
  LOGO_ENTRANCE_DELAY_S,
  logoEntranceDurationMs,
} from './iconLogoPaths';

type LogoPhase = 'hidden' | 'entering' | 'idle';

/** Persists across client navigations — cascade runs once per full page load. */
let logoEntranceComplete = false;

type IconLogoBrandProps = {
  className?: string;
  size?: number | string;
};

const pathStyle = {
  transformBox: 'fill-box' as const,
  transformOrigin: 'center' as const,
};

export function IconLogoBrand({ className, size = '100%' }: IconLogoBrandProps) {
  const reduceMotion = useReducedMotion();
  const skipEntrance = logoEntranceComplete;
  const [phase, setPhase] = useState<LogoPhase>(() => (skipEntrance ? 'idle' : 'hidden'));

  useEffect(() => {
    if (logoEntranceComplete) {
      setPhase('idle');
      return;
    }

    if (reduceMotion) {
      const fadeTimer = window.setTimeout(() => {
        logoEntranceComplete = true;
        setPhase('idle');
      }, 300);
      return () => window.clearTimeout(fadeTimer);
    }

    const startTimer = window.setTimeout(() => {
      setPhase('entering');
    }, LOGO_ENTRANCE_DELAY_S * 1000);

    const doneTimer = window.setTimeout(() => {
      logoEntranceComplete = true;
      setPhase('idle');
    }, logoEntranceDurationMs());

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(doneTimer);
    };
  }, [reduceMotion]);

  const sizeValue = typeof size === 'number' ? `${size}px` : size;

  return (
    <motion.svg
      width={sizeValue}
      height={sizeValue}
      viewBox='0 0 512 512'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('inline-block text-foreground transition-colors duration-300', className)}
      initial={reduceMotion ? { opacity: 0 } : false}
      animate={
        reduceMotion ? { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } } : undefined
      }
      aria-hidden
    >
      {ICON_LOGO_PATHS.map((pathDef, index) => {
        const entranceTransition = {
          delay: LOGO_ENTRANCE_DELAY_S + pathDef.cascadeOrder * LOGO_CASCADE_STAGGER_S,
          duration: LOGO_CASCADE_DURATION_S,
          ease: [0.22, 1, 0.36, 1] as const,
        };

        const idleTransition = pathDef.idlePulse
          ? {
              duration: 3.2 + (index % 4) * 0.35,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut' as const,
              delay: (index % 5) * 0.18,
            }
          : undefined;

        let animate: TargetAndTransition;

        if (reduceMotion) {
          animate = { opacity: 1, scale: 1 };
        } else if (phase === 'hidden') {
          animate = { opacity: 0, scale: 0 };
        } else if (phase === 'entering') {
          animate = {
            opacity: 1,
            scale: 1,
            transition: entranceTransition,
          };
        } else if (pathDef.idlePulse) {
          animate = {
            opacity: [0.88, 1, 0.88],
            scale: 1,
            transition: idleTransition,
          };
        } else {
          animate = { opacity: 1, scale: 1 };
        }

        return (
          <motion.path
            key={pathDef.id}
            d={pathDef.d}
            fill='currentColor'
            style={pathStyle}
            initial={reduceMotion || skipEntrance ? false : { opacity: 0, scale: 0 }}
            animate={animate}
          />
        );
      })}
    </motion.svg>
  );
}
