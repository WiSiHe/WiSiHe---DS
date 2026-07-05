'use client';

import { useGSAP } from '@gsap/react';
import { cn } from '@wisihe/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type CSSProperties, createContext, type ReactNode, useContext, useRef } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollStackConfig = {
  itemStackDistance: number;
  stackPosition: string;
};

const ScrollStackConfigContext = createContext<ScrollStackConfig | null>(null);

export type ScrollStackItemProps = {
  index: number;
  children: ReactNode;
  className?: string;
};

export function ScrollStackItem({ index, children, className = '' }: ScrollStackItemProps) {
  const config = useContext(ScrollStackConfigContext);
  const stackPosition = config?.stackPosition ?? '18%';
  const itemStackDistance = config?.itemStackDistance ?? 28;
  const top = `calc(${stackPosition} + ${index * itemStackDistance}px)`;

  return (
    <div
      className={cn('scroll-stack-card sticky w-full', className)}
      style={{ top, zIndex: index + 1 }}
    >
      <div className='scroll-stack-card-surface w-full origin-top will-change-transform'>
        {children}
      </div>
    </div>
  );
}

export type ScrollStackProps = {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  baseScale?: number;
  rotationAmount?: number;
  onStackComplete?: () => void;
};

export default function ScrollStack({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 28,
  stackPosition = '18%',
  baseScale = 0.88,
  rotationAmount = 0,
  onStackComplete,
}: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cards = gsap.utils.toArray<HTMLElement>('.scroll-stack-card', container);
      const surfaces = gsap.utils.toArray<HTMLElement>('.scroll-stack-card-surface', container);

      if (reducedMotion || cards.length === 0 || surfaces.length !== cards.length) return;

      gsap.set(surfaces, { transformOrigin: 'top center', force3D: true });

      const triggers: ScrollTrigger[] = [];

      surfaces.forEach((surface, i) => {
        if (i >= cards.length - 1) return;

        const nextCard = cards[i + 1];
        if (!nextCard) return;

        const targetScale = baseScale + i * itemScale;

        const tween = gsap.fromTo(
          surface,
          { scale: 1, rotation: 0 },
          {
            scale: targetScale,
            rotation: rotationAmount ? i * rotationAmount : 0,
            ease: 'none',
            scrollTrigger: {
              trigger: nextCard,
              start: 'top bottom',
              end: `top ${stackPosition}`,
              scrub: 0.35,
            },
          },
        );

        if (tween.scrollTrigger) {
          triggers.push(tween.scrollTrigger);
        }
      });

      const lastCard = cards[cards.length - 1];
      if (lastCard && onStackComplete) {
        triggers.push(
          ScrollTrigger.create({
            trigger: lastCard,
            start: `top ${stackPosition}`,
            onEnter: onStackComplete,
          }),
        );
      }

      const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 350);

      return () => {
        window.clearTimeout(refreshTimer);
        for (const trigger of triggers) {
          trigger.kill();
        }
        gsap.set(surfaces, { clearProps: 'transform' });
      };
    },
    {
      scope: containerRef,
      dependencies: [baseScale, itemScale, rotationAmount, stackPosition],
    },
  );

  const stackStyle = {
    '--scroll-stack-gap': `${itemDistance}px`,
  } as CSSProperties;

  return (
    <ScrollStackConfigContext.Provider value={{ itemStackDistance, stackPosition }}>
      <div
        ref={containerRef}
        className={cn(
          className,
          '[&_.scroll-stack-card:not(:last-child)]:mb-[var(--scroll-stack-gap)]',
        )}
        style={stackStyle}
      >
        {children}
        <div className='h-[45vh] w-full' aria-hidden />
      </div>
    </ScrollStackConfigContext.Provider>
  );
}
