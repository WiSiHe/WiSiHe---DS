'use client';

/**
 * Masonry grid + GSAP entrance (React Bits–style).
 * @see https://reactbits.dev/components/masonry
 */

import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import {
  getHeroStrokeColors,
  HeroPaintingSvgHover,
  initHeroSvgStrokePaths,
} from '@/app/components/marketing/HeroSection/HeroPaintingSvgHover';
import {
  CARD_BRUSH_STROKE_SCALE,
  paintingSvgBrushEnter,
  paintingSvgBrushLeave,
} from '@/app/components/marketing/HeroSection/paintingSvgBrushHover';

export type MasonryItem = {
  id: string;
  img: string;
  url: string;
  /** Logical height used for column packing (pixels) */
  height: number;
  title?: string;
  /** Seed for brush stroke color + shape variant */
  strokeIndex: number;
  medium?: string;
  year?: string;
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

const useMedia = (queries: readonly string[], values: readonly number[], defaultValue: number) => {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue;
    const idx = queries.findIndex(q => window.matchMedia(q).matches);
    return idx >= 0 ? values[idx]! : defaultValue;
  };

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
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
      const r = el.getBoundingClientRect();
      setSize({ width: r.width, height: r.height });
    };
    read();
    const ro = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

const preloadImages = async (urls: string[]) => {
  await Promise.all(
    urls.map(
      src =>
        new Promise<void>(resolve => {
          if (!src) {
            resolve();
            return;
          }
          const img = new window.Image();
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }),
    ),
  );
};

const Masonry = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
}: MasonryProps) => {
  const columns = useMedia(MASONRY_MEDIA_QUERIES, MASONRY_MEDIA_COLUMNS, 1);

  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
  }, [items]);

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

  const getInitialPosition = (item: (typeof grid)[number]) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right'] as const;
      direction = dirs[Math.floor(Math.random() * dirs.length)]!;
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 };
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 };
      case 'left':
        return { x: -200, y: item.y };
      case 'right':
        return { x: window.innerWidth + 200, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  const hasMounted = useRef(false);
  const svgHoverTlByIdRef = useRef<Map<string, gsap.core.Timeline>>(new Map());
  const itemIdsKey = useMemo(() => items.map(i => i.id).join('|'), [items]);

  useEffect(() => {
    hasMounted.current = false;
  }, [itemIdsKey]);

  useLayoutEffect(() => {
    if (!imagesReady || !grid.length) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    grid.forEach((item, index) => {
      const selector = `[data-masonry-key="${CSS.escape(item.id)}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: reduced ? 1 : 0,
            x: reduced ? item.x : start.x,
            y: reduced ? item.y : start.y,
            width: item.w,
            height: item.h,
            ...(!reduced && blurToFocus ? { filter: 'blur(10px)' } : {}),
          },
          {
            opacity: 1,
            ...animProps,
            ...(!reduced && blurToFocus ? { filter: 'blur(0px)' } : {}),
            duration: reduced ? 0 : 0.8,
            ease: 'power3.out',
            delay: reduced ? 0 : index * stagger,
          },
        );
      } else {
        gsap.to(selector, {
          ...animProps,
          duration: reduced ? 0 : duration,
          ease,
          overwrite: 'auto',
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  useLayoutEffect(() => {
    if (!imagesReady || !grid.length) return;
    grid.forEach(item => {
      const tile = containerRef.current?.querySelector<HTMLElement>(
        `[data-masonry-key="${CSS.escape(item.id)}"]`,
      );
      if (tile) initHeroSvgStrokePaths(tile, CARD_BRUSH_STROKE_SCALE);
    });
  }, [grid, imagesReady]);

  const handleMouseEnter = (id: string, el: HTMLElement) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const item = grid.find(g => g.id === id);
    if (item) {
      svgHoverTlByIdRef.current.get(id)?.kill();
      const tl = paintingSvgBrushEnter(el, CARD_BRUSH_STROKE_SCALE);
      svgHoverTlByIdRef.current.set(id, tl);
    }
    if (!scaleOnHover) return;
    gsap.to(`[data-masonry-key="${CSS.escape(id)}"]`, {
      scale: hoverScale,
      duration: 0.3,
      ease: 'power2.out',
    });
    if (colorShiftOnHover) {
      const overlay = el.querySelector('.color-overlay');
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  };

  const handleMouseLeave = (id: string, el: HTMLElement) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const item = grid.find(g => g.id === id);
    if (item) {
      svgHoverTlByIdRef.current.get(id)?.kill();
      svgHoverTlByIdRef.current.delete(id);
      paintingSvgBrushLeave(el, CARD_BRUSH_STROKE_SCALE);
    }
    if (!scaleOnHover) return;
    gsap.to(`[data-masonry-key="${CSS.escape(id)}"]`, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
    if (colorShiftOnHover) {
      const overlay = el.querySelector('.color-overlay');
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  };

  if (!items.length) return null;

  return (
    <div
      ref={containerRef}
      className='relative w-full'
      style={{ minHeight: gridHeight > 0 ? gridHeight : undefined }}
    >
      {grid.map(item => (
        <div
          key={item.id}
          data-masonry-key={item.id}
          className='absolute box-content overflow-hidden rounded-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] ring-1 ring-border/20'
          style={{ willChange: 'transform, width, height, opacity' }}
          onMouseEnter={e => handleMouseEnter(item.id, e.currentTarget)}
          onMouseLeave={e => handleMouseLeave(item.id, e.currentTarget)}
        >
          <Link href={item.url} className='relative block h-full w-full'>
            <span className='sr-only'>
              {item.title ? `View painting: ${item.title}` : 'View painting'}
            </span>
            <div className='relative h-full w-full overflow-hidden rounded-[10px]'>
              <Image
                src={item.img}
                alt=''
                aria-hidden
                fill
                className='object-cover'
                sizes='(min-width: 1500px) 18vw, (min-width: 1000px) 22vw, (min-width: 600px) 30vw, 45vw'
              />
              <div className='pointer-events-none absolute inset-0 z-[15]' aria-hidden>
                <HeroPaintingSvgHover
                  {...getHeroStrokeColors(item.strokeIndex)}
                  strokeVariantIndex={item.strokeIndex}
                  strokeScale={CARD_BRUSH_STROKE_SCALE}
                  title={item.title ?? null}
                  medium={item.medium ?? null}
                  year={item.year ?? null}
                  useMotion={false}
                />
              </div>
              {colorShiftOnHover ? (
                <div className='color-overlay pointer-events-none absolute inset-0 rounded-[10px] bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0' />
              ) : null}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Masonry;
