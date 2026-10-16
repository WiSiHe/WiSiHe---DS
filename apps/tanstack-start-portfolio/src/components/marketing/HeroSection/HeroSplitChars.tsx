'use client';

import { cn } from '@wisihe/utils';
import type { CSSProperties } from 'react';

/** CSS-driven entrance: each char rises from its mask, staggered in a seeded-random order. */
export type HeroCharReveal = { delay: number; stagger: number; duration: number };

/** Deterministic shuffle so server and client markup match (no Math.random during render). */
function seededOrder(length: number, seed: string): number[] {
  let state = 2166136261;
  for (let i = 0; i < seed.length; i++) state = Math.imul(state ^ seed.charCodeAt(i), 16777619);
  const order = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i--) {
    state = Math.imul(state ^ (state >>> 15), 2246822507) >>> 0;
    const j = state % (i + 1);
    [order[i], order[j]] = [order[j] as number, order[i] as number];
  }
  return order;
}

type HeroSplitCharsProps = {
  text: string;
  className?: string;
  charClassName?: string;
  maskClassName?: string;
  charDataAttr?: string;
  reveal?: HeroCharReveal;
};

/** Manual split chars with overflow masks; `reveal` animates inner `[data-char-slot]` in CSS. */
export function HeroSplitChars({
  text,
  className,
  charClassName,
  maskClassName,
  charDataAttr = 'hero-char',
  reveal,
}: HeroSplitCharsProps) {
  const chars = text.split('');
  const order = reveal ? seededOrder(chars.length, text) : [];

  return (
    <span className={className}>
      <span className='sr-only'>{text}</span>
      <span aria-hidden>
        {chars.map((char, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: split text is static for a given string.
            key={`${char}-${index}`}
            className={cn('inline-block overflow-hidden align-bottom', maskClassName)}
          >
            <span
              className={cn(
                'inline-block',
                reveal ? 'hero-char-reveal' : 'will-change-transform',
                charClassName,
              )}
              style={
                reveal
                  ? ({
                      '--hero-char-delay': `${(reveal.delay + (order[index] ?? index) * reveal.stagger).toFixed(3)}s`,
                      '--hero-char-duration': `${reveal.duration}s`,
                    } as CSSProperties)
                  : undefined
              }
              data-char-slot={charDataAttr}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
