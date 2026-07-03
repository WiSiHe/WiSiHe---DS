'use client';

import { cn } from '@wisihe/utils';

type HeroSplitCharsProps = {
  text: string;
  className?: string;
  charClassName?: string;
  maskClassName?: string;
  charDataAttr?: string;
};

/** Manual split chars with overflow masks — GSAP animates inner `[data-char-slot]`. */
export function HeroSplitChars({
  text,
  className,
  charClassName,
  maskClassName,
  charDataAttr = 'hero-char',
}: HeroSplitCharsProps) {
  return (
    <span className={className}>
      <span className='sr-only'>{text}</span>
      <span aria-hidden>
        {text.split('').map((char, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: split text is static for a given string.
            key={`${char}-${index}`}
            className={cn('inline-block overflow-hidden align-bottom', maskClassName)}
          >
            <span
              className={cn('inline-block will-change-transform', charClassName)}
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
