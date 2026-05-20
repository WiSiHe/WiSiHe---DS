'use client';

/**
 * Scroll-stack cards using CSS sticky positioning and GSAP ScrollTrigger.
 * Eliminates custom scroll events and layout thrashing (getBoundingClientRect) on scroll.
 */

import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type CSSProperties, type ReactNode, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export type ScrollStackItemProps = {
  children: ReactNode;
  /** Applied to an inner wrapper; the transformed surface keeps a stable class string for hydration. */
  itemClassName?: string;
};

export const ScrollStackItem = ({ children, itemClassName = '' }: ScrollStackItemProps) => (
  <div className='scroll-stack-card relative box-border w-full'>
    <div
      className='scroll-stack-card-surface box-border w-full'
      style={{
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
        willChange: 'transform, filter',
        transformOrigin: 'top center',
        perspective: '1000px',
        transform: 'translateZ(0)',
      }}
    >
      <div className={clsx(itemClassName)}>{children}</div>
    </div>
  </div>
);

export type ScrollStackProps = {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string | number;
  scaleEndPosition?: string | number;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  useLenis?: boolean;
  onStackComplete?: () => void;
  onActiveIndexChange?: (index: number) => void;
};

const parsePosition = (value: string | number): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.endsWith('%')) {
    return (parseFloat(value) / 100) * window.innerHeight;
  }
  return parseFloat(value);
};

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete,
  onActiveIndexChange,
}: ScrollStackProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const layouts = gsap.utils.toArray<HTMLElement>('.scroll-stack-card');
      const surfaces = gsap.utils.toArray<HTMLElement>('.scroll-stack-card-surface');
      if (!layouts.length || layouts.length !== surfaces.length) return;

      // Apply distance as margin-bottom on each card except the last,
      // and set up CSS sticky properties on all card elements.
      layouts.forEach((layoutCard, i) => {
        if (i < layouts.length - 1) {
          layoutCard.style.marginBottom = `${itemDistance}px`;
        }

        layoutCard.style.position = 'sticky';
        layoutCard.style.top = `calc(${stackPosition} + ${i * itemStackDistance}px)`;
        layoutCard.style.zIndex = `${i + 1}`;
      });

      // Create GSAP ScrollTriggers for card scaling and depth animations
      layouts.forEach((layoutCard, i) => {
        if (i < layouts.length - 1) {
          const currentSurface = surfaces[i];
          const nextLayoutCard = layouts[i + 1];

          if (!currentSurface || !nextLayoutCard) return;

          // Target values for card i when fully covered
          const targetScale = baseScale + i * itemScale;
          const rotation = rotationAmount ? (layouts.length - 1 - i) * rotationAmount : 0;
          const blur = blurAmount ? (layouts.length - 1 - i) * blurAmount : 0;

          // Animate the current card surface as the next card scrolls up
          gsap.to(currentSurface, {
            scale: targetScale,
            rotation: rotation,
            filter: blur > 0 ? `blur(${blur}px)` : 'none',
            ease: 'power1.out',
            scrollTrigger: {
              trigger: nextLayoutCard,
              start: 'top 85%',
              end: () => {
                const targetY = parsePosition(stackPosition) + (i + 1) * itemStackDistance;
                return `top ${targetY}px`;
              },
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }

        // Track active index change
        ScrollTrigger.create({
          trigger: layoutCard,
          start: `top calc(${stackPosition} + ${i * itemStackDistance}px + 10px)`,
          end: 'bottom bottom',
          onToggle: self => {
            if (self.isActive) {
              onActiveIndexChange?.(i);
            }
          },
        });
      });

      // Handle stack complete notification
      if (onStackComplete) {
        const lastLayout = layouts[layouts.length - 1];
        ScrollTrigger.create({
          trigger: lastLayout,
          start: `top calc(${stackPosition} + ${(layouts.length - 1) * itemStackDistance}px)`,
          onEnter: () => onStackComplete(),
        });
      }

      return () => {
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    },
    { scope: containerRef },
  );

  const containerStyles: CSSProperties = {
    overscrollBehavior: 'contain',
    WebkitOverflowScrolling: 'touch',
  };

  const containerClassName = `relative w-full ${className}`.trim();

  return (
    <div className={containerClassName} ref={containerRef} style={containerStyles}>
      <div className='scroll-stack-inner relative w-full'>
        {children}
        <div className='scroll-stack-end h-px w-full' aria-hidden />
      </div>
    </div>
  );
};

export default ScrollStack;
