'use client';

import { useGSAP } from '@gsap/react';
import { cn } from '@wisihe/utils';
import gsap from 'gsap';
import { motion } from 'motion/react';
import { useRef } from 'react';
import { HeroSplitChars } from './HeroSplitChars';
import {
  COUNTER_DELAY,
  COUNTER_DURATION,
  NAME_EXIT_EASE,
  NAME_REVEAL_DELAY,
  NAME_REVEAL_DURATION,
  NAME_REVEAL_EASE,
  NAME_REVEAL_STAGGER,
} from './heroStackConfig';

type HeroPersistentNameProps = {
  text: string;
  hasExploded: boolean;
  reducedMotion: boolean;
};

/** One name from stack intro through hero copy — chars reveal once, then layout morphs. */
export function HeroPersistentName({ text, hasExploded, reducedMotion }: HeroPersistentNameProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);
  const isIntroStyle = !hasExploded && !reducedMotion;

  useGSAP(
    () => {
      if (reducedMotion || !rootRef.current) return;

      const chars = gsap.utils.toArray<HTMLElement>(
        '[data-char-slot="hero-name-char"]',
        rootRef.current,
      );
      const counter = counterRef.current;

      if (!hasExploded) {
        gsap.set(chars, { y: '100%' });
        gsap.to(chars, {
          y: '0%',
          duration: NAME_REVEAL_DURATION,
          ease: NAME_REVEAL_EASE,
          stagger: { each: NAME_REVEAL_STAGGER, from: 'random' },
          delay: NAME_REVEAL_DELAY,
        });

        if (counter) {
          gsap.set(counter, { y: '100%' });
          gsap.to(counter, {
            y: '0%',
            duration: NAME_REVEAL_DURATION,
            ease: NAME_REVEAL_EASE,
            delay: NAME_REVEAL_DELAY,
            onStart: () => {
              const counterEl = counterRef.current;
              if (!counterEl) return;
              const counterState = { value: 0 };
              gsap.to(counterState, {
                value: 100,
                duration: COUNTER_DURATION,
                delay: COUNTER_DELAY,
                ease: 'power2.inOut',
                onUpdate: () => {
                  counterEl.textContent = String(Math.round(counterState.value)).padStart(3, '0');
                },
              });
            },
          });
        }
        return;
      }

      if (counter) {
        gsap.to(counter, { y: '-120%', duration: 0.45, ease: NAME_EXIT_EASE });
      }
    },
    { scope: rootRef, dependencies: [hasExploded, reducedMotion, text] },
  );

  if (reducedMotion) {
    return (
      <h1 className='mb-3 w-full text-center text-4xl font-black leading-none tracking-tighter text-foreground sm:text-5xl md:mb-4 md:text-6xl lg:text-8xl'>
        {text}
      </h1>
    );
  }

  return (
    <motion.div
      ref={rootRef}
      layout='position'
      transition={{ layout: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } }}
      className={cn(
        'pointer-events-none w-full',
        isIntroStyle
          ? 'absolute inset-0 z-[55] flex items-center justify-center px-4'
          : 'relative mb-3 flex w-full justify-center md:mb-4',
      )}
    >
      <div className='relative inline-flex max-w-none flex-nowrap items-start justify-center whitespace-nowrap text-center'>
        <h1
          className={cn(
            'font-black leading-none tracking-tighter whitespace-nowrap text-center transition-[color,font-size,text-shadow] duration-700 ease-out',
            isIntroStyle
              ? 'uppercase text-foreground [text-shadow:0_0_28px_var(--color-background-subtle-val),0_2px_12px_rgba(0,0,0,0.1)] text-[clamp(2rem,10vw,9rem)] md:text-[clamp(2.5rem,12vw,11rem)]'
              : 'w-full text-foreground text-4xl sm:text-5xl md:text-6xl lg:text-8xl',
          )}
        >
          <HeroSplitChars
            text={text}
            charDataAttr='hero-name-char'
            className='inline-flex flex-nowrap items-center justify-center whitespace-nowrap'
            charClassName={isIntroStyle ? 'translate-y-full' : undefined}
          />
        </h1>

        {isIntroStyle ? (
          <div className='absolute top-0 left-[calc(100%+0.75rem)] overflow-hidden whitespace-nowrap sm:left-[calc(100%+1.5rem)]'>
            <p
              ref={counterRef}
              className='translate-y-full font-mono text-[clamp(0.875rem,1.5vw,1.25rem)] leading-none tabular-nums text-foreground-subtle'
            >
              000
            </p>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
