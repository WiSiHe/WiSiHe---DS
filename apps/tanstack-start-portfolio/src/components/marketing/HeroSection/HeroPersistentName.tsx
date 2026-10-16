'use client';

import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import { type CSSProperties, useEffect, useRef } from 'react';
import { HeroSplitChars } from './HeroSplitChars';
import {
  COUNTER_DELAY,
  COUNTER_DURATION,
  NAME_REVEAL_DELAY,
  NAME_REVEAL_DURATION,
  NAME_REVEAL_STAGGER,
} from './heroStackConfig';

type HeroPersistentNameProps = {
  text: string;
  hasExploded: boolean;
  reducedMotion: boolean;
};

/** One name from stack intro through hero copy — chars reveal once, then layout morphs. */
export function HeroPersistentName({ text, hasExploded, reducedMotion }: HeroPersistentNameProps) {
  const counterRef = useRef<HTMLParagraphElement>(null);
  const isIntroStyle = !hasExploded && !reducedMotion;

  // 000 -> 100 count-up; the counter's rise-in itself is CSS (see `.hero-char-reveal`).
  useEffect(() => {
    const counter = counterRef.current;
    if (!isIntroStyle || !counter) return;

    const startAt = performance.now() + (NAME_REVEAL_DELAY + COUNTER_DELAY) * 1000;
    const durationMs = COUNTER_DURATION * 1000;
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(Math.max((now - startAt) / durationMs, 0), 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; // power2.inOut
      counter.textContent = String(Math.round(eased * 100)).padStart(3, '0');
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isIntroStyle]);

  if (reducedMotion) {
    return (
      <h1 className='mb-3 w-full text-center text-4xl font-black leading-none tracking-tighter text-foreground sm:text-5xl md:mb-4 md:text-6xl lg:text-8xl'>
        {text}
      </h1>
    );
  }

  return (
    <motion.div
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
            reveal={{
              delay: NAME_REVEAL_DELAY,
              stagger: NAME_REVEAL_STAGGER,
              duration: NAME_REVEAL_DURATION,
            }}
          />
        </h1>

        {isIntroStyle ? (
          <div className='absolute top-0 left-[calc(100%+0.75rem)] overflow-hidden whitespace-nowrap sm:left-[calc(100%+1.5rem)]'>
            <p
              ref={counterRef}
              style={
                {
                  '--hero-char-delay': `${NAME_REVEAL_DELAY}s`,
                  '--hero-char-duration': `${NAME_REVEAL_DURATION}s`,
                } as CSSProperties
              }
              className='hero-char-reveal font-mono text-[clamp(0.875rem,1.5vw,1.25rem)] leading-none tabular-nums text-foreground-subtle'
            >
              000
            </p>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
