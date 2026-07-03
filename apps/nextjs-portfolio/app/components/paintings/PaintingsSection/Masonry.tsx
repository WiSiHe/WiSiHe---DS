'use client';

/**
 * Masonry grid + Motion entrance (React Bits–style).
 * @see https://reactbits.dev/components/masonry
 */

import { cn } from '@wisihe/utils';
import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  type BrushRevealBadge,
  BrushRevealLayer,
} from '@/app/components/paintings/BrushReveal/BrushRevealLayer';
import { BrushRevealWrap } from '@/app/components/paintings/BrushReveal/BrushRevealWrap';
import { NsfwBlurredCardFooter } from '@/app/components/paintings/BrushReveal/NsfwBlurredCardFooter';
import { NsfwBrushCover } from '@/app/components/paintings/BrushReveal/NsfwBrushCover';
import { contentImageLayoutId, sharedLayoutTransition } from '@/lib/motion/sharedLayout';
import { getNsfwImageBlurClass, resolveNsfwRatingLabel } from '@/lib/paintings/nsfwCover';

export type MasonryItem = {
  id: string;
  img: string;
  lqip?: string;
  url: string;
  height: number;
  title?: string;
  strokeIndex: number;
  accentColor: string;
  secondaryColor: string;
  washColor: string;
  medium?: string;
  year?: string;
  tags?: string[];
  badges?: BrushRevealBadge[];
  isNsfwBlurred?: boolean;
};

type MasonryProps = {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
};

const MASONRY_MEDIA_QUERIES = [
  '(min-width: 1500px)',
  '(min-width: 1000px)',
  '(min-width: 600px)',
  '(min-width: 400px)',
] as const;
const MASONRY_MEDIA_COLUMNS = [5, 4, 3, 2] as const;

const ENTRANCE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const useMedia = (queries: readonly string[], values: readonly number[], defaultValue: number) => {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue;
    const idx = queries.findIndex(q => window.matchMedia(q).matches);
    return idx >= 0 ? values[idx]! : defaultValue;
  };

  const [value, setValue] = useState(get);

  useLayoutEffect(() => {
    setValue(get());
    const handler = () => setValue(get());
    queries.forEach(q => window.matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => window.matchMedia(q).removeEventListener('change', handler));
  }, [queries, values, defaultValue]);

  return value;
};

const useMeasure = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const { width, height } = el.getBoundingClientRect();
      setSize(prev => (prev.width === width && prev.height === height ? prev : { width, height }));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

const Masonry = ({
  items,
  duration = 0.6,
  stagger = 0.05,
  animateFrom: _animateFrom = 'bottom',
  scaleOnHover = false,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
}: MasonryProps) => {
  const columns = useMedia(MASONRY_MEDIA_QUERIES, MASONRY_MEDIA_COLUMNS, 1);
  const reduceMotion = useReducedMotion();

  const [containerRef, { width }] = useMeasure();

  const grid = useMemo(() => {
    if (!width || !items.length) return [];
    const colHeights = new Array(columns).fill(0) as number[];
    const gap = 16;
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    return items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const height = child.height / 2;
      const y = colHeights[col] ?? 0;

      colHeights[col] = y + height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width]);

  const gridHeight = useMemo(() => {
    if (!grid.length) return 0;
    return Math.max(...grid.map(item => item.y + item.h));
  }, [grid]);

  const itemIdsKey = useMemo(() => items.map(i => i.id).join('|'), [items]);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    setHasEntered(false);
  }, [itemIdsKey]);

  useEffect(() => {
    if (!grid.length || hasEntered || reduceMotion) {
      if (grid.length) setHasEntered(true);
      return;
    }
    const maxDelay = (grid.length - 1) * stagger + 0.8;
    const id = window.setTimeout(() => setHasEntered(true), maxDelay * 1000);
    return () => window.clearTimeout(id);
  }, [grid.length, hasEntered, itemIdsKey, reduceMotion, stagger]);

  if (!items.length) return null;

  const estimatedMinHeight = items.length * 180;

  return (
    <div
      ref={containerRef}
      className='relative w-full'
      style={{ minHeight: gridHeight > 0 ? gridHeight : estimatedMinHeight }}
    >
      {grid.map((item, index) => {
        const playEntrance = !hasEntered && !reduceMotion;

        return (
          <motion.div
            key={item.id}
            data-masonry-key={item.id}
            className={cn(
              'group absolute overflow-hidden rounded-xl shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] ring-1 ring-border/20',
            )}
            style={{ left: 0, top: 0, willChange: 'transform, width, height, opacity' }}
            initial={
              playEntrance
                ? {
                    opacity: 0,
                    x: item.x,
                    y: item.y,
                    width: item.w,
                    height: item.h,
                    scale: 1,
                    ...(blurToFocus ? { filter: 'blur(10px)' } : {}),
                  }
                : false
            }
            animate={{
              x: item.x,
              y: item.y,
              width: item.w,
              height: item.h,
              opacity: 1,
              scale: 1,
              ...(blurToFocus ? { filter: 'blur(0px)' } : {}),
            }}
            transition={{
              duration: playEntrance ? 0.8 : duration,
              delay: playEntrance ? index * stagger : 0,
              ease: ENTRANCE_EASE,
            }}
            whileHover={scaleOnHover ? { scale: hoverScale } : undefined}
          >
            <BrushRevealWrap className='h-full w-full'>
              <Link href={item.url} className='relative block h-full w-full'>
                <span className='sr-only'>
                  {item.title ? `View painting: ${item.title}` : 'View painting'}
                </span>
                {item.title && !reduceMotion ? (
                  <>
                    <motion.div
                      layoutId={contentImageLayoutId(item.title)}
                      initial={false}
                      transition={sharedLayoutTransition}
                      className='absolute inset-0 overflow-hidden rounded-xl'
                    >
                      <Image
                        src={item.img}
                        alt=''
                        aria-hidden
                        fill
                        className={cn(
                          'object-cover',
                          item.isNsfwBlurred && getNsfwImageBlurClass('card'),
                        )}
                        sizes='(min-width: 1500px) 18vw, (min-width: 1000px) 22vw, (min-width: 600px) 30vw, 45vw'
                        placeholder={item.lqip ? 'blur' : 'empty'}
                        blurDataURL={item.lqip}
                      />
                    </motion.div>
                    {item.isNsfwBlurred ? (
                      <NsfwBrushCover
                        accentColor={item.accentColor}
                        secondaryColor={item.secondaryColor}
                        washColor={item.washColor}
                        strokeVariantIndex={item.strokeIndex}
                      />
                    ) : null}
                    <BrushRevealLayer
                      accentColor={item.accentColor}
                      secondaryColor={item.secondaryColor}
                      washColor={item.washColor}
                      strokeVariantIndex={item.strokeIndex}
                      title={item.title ?? null}
                      medium={item.medium ?? null}
                      year={item.year ?? null}
                      tags={item.tags}
                      badges={item.badges}
                      isNsfwBlurred={item.isNsfwBlurred}
                    />
                    {item.isNsfwBlurred && item.title ? (
                      <NsfwBlurredCardFooter
                        title={item.title}
                        matureContentLabel={resolveNsfwRatingLabel(item.tags ?? [])}
                        paintedAt={item.year}
                      />
                    ) : null}
                    {colorShiftOnHover ? (
                      <div className='color-overlay pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0 transition-opacity duration-300 group-hover:opacity-30' />
                    ) : null}
                  </>
                ) : (
                  <div className='relative h-full w-full overflow-hidden rounded-xl'>
                    <Image
                      src={item.img}
                      alt=''
                      aria-hidden
                      fill
                      className={cn(
                        'object-cover',
                        item.isNsfwBlurred && getNsfwImageBlurClass('card'),
                      )}
                      sizes='(min-width: 1500px) 18vw, (min-width: 1000px) 22vw, (min-width: 600px) 30vw, 45vw'
                      placeholder={item.lqip ? 'blur' : 'empty'}
                      blurDataURL={item.lqip}
                    />
                    {item.isNsfwBlurred ? (
                      <NsfwBrushCover
                        accentColor={item.accentColor}
                        secondaryColor={item.secondaryColor}
                        washColor={item.washColor}
                        strokeVariantIndex={item.strokeIndex}
                      />
                    ) : null}
                    <BrushRevealLayer
                      accentColor={item.accentColor}
                      secondaryColor={item.secondaryColor}
                      washColor={item.washColor}
                      strokeVariantIndex={item.strokeIndex}
                      title={item.title ?? null}
                      medium={item.medium ?? null}
                      year={item.year ?? null}
                      tags={item.tags}
                      badges={item.badges}
                      isNsfwBlurred={item.isNsfwBlurred}
                    />
                    {item.isNsfwBlurred && item.title ? (
                      <NsfwBlurredCardFooter
                        title={item.title}
                        matureContentLabel={resolveNsfwRatingLabel(item.tags ?? [])}
                        paintedAt={item.year}
                      />
                    ) : null}
                    {colorShiftOnHover ? (
                      <div className='color-overlay pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0 transition-opacity duration-300 group-hover:opacity-30' />
                    ) : null}
                  </div>
                )}
              </Link>
            </BrushRevealWrap>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Masonry;
