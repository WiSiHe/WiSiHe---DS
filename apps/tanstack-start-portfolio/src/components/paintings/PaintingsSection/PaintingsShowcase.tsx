'use client';

import { Link, useNavigate } from '@tanstack/react-router';
import { cn } from '@wisihe/utils';
import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import CircularGallery, { type CircularGalleryItem } from '@/components/effects/CircularGallery';
import type { HomePaintingsSection } from '@/lib/homePageBuilder';
import { useSectionReveal } from '@/lib/motion/sectionReveal';
import { paintingsToCircularGalleryItems } from '@/lib/paintings/paintingsToCircularGalleryItems';
import PaintingsShowcaseCarousel from './PaintingsShowcaseCarousel';

type ShowcasePainting = NonNullable<HomePaintingsSection['showcasePaintings']>[number];

type PaintingsShowcaseProps = {
  paintings: ShowcasePainting[];
  showFooter?: boolean;
  className?: string;
};

function readGalleryThemeColors() {
  if (typeof window === 'undefined') {
    return { textColor: '#171717' };
  }

  const styles = getComputedStyle(document.documentElement);

  return {
    textColor: styles.getPropertyValue('--color-foreground-val').trim() || '#171717',
  };
}

function readGalleryBend(width: number): number {
  if (width < 768) return 1.4;
  if (width < 1024) return 2.5;
  return 3;
}

type PaintingsGalleryFrameProps = {
  className?: string;
  children: ReactNode;
};

function PaintingsGalleryFrame({ className, children }: PaintingsGalleryFrameProps) {
  return (
    <div className={cn('relative isolate w-full overflow-hidden', className)}>
      {children}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-y-0 left-0 z-10 w-[clamp(32px,12%,160px)] bg-gradient-to-r from-surface to-transparent'
      />
      <div
        aria-hidden
        className='pointer-events-none absolute inset-y-0 right-0 z-10 w-[clamp(32px,12%,160px)] bg-gradient-to-l from-surface to-transparent'
      />
    </div>
  );
}

const PaintingsShowcase = ({ paintings, showFooter = true, className }: PaintingsShowcaseProps) => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [textColor, setTextColor] = useState('#171717');
  const [bend, setBend] = useState(2.5);

  useEffect(() => {
    const mobileMq = window.matchMedia('(max-width: 767px)');

    const sync = () => {
      setMounted(true);
      setIsMobile(mobileMq.matches);
      setTextColor(readGalleryThemeColors().textColor);
      setBend(readGalleryBend(window.innerWidth));
    };

    sync();
    window.addEventListener('resize', sync);
    mobileMq.addEventListener('change', sync);

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      window.removeEventListener('resize', sync);
      mobileMq.removeEventListener('change', sync);
      observer.disconnect();
    };
  }, []);

  const reducedMotion = Boolean(mounted && prefersReducedMotion);
  const {
    horizontalSlideInitial,
    horizontalSlideAnimate,
    fadeUpInitial,
    fadeUpAnimate,
    viewport,
    transition,
  } = useSectionReveal();
  const useCarousel = reducedMotion;
  const galleryItems = useMemo(() => paintingsToCircularGalleryItems(paintings), [paintings]);

  const handleItemClick = useCallback(
    (item: CircularGalleryItem) => {
      if (item.href) {
        void navigate({ to: item.href as '/' });
      }
    },
    [navigate],
  );

  if (!galleryItems.length) {
    return null;
  }

  return (
    <section className={cn('px-4', className)} aria-label='Featured paintings gallery'>
      <div className='mx-auto max-w-7xl'>
        <motion.div
          initial={horizontalSlideInitial}
          whileInView={horizontalSlideAnimate}
          viewport={viewport}
          transition={transition}
        >
          {useCarousel ? (
            <PaintingsGalleryFrame>
              <PaintingsShowcaseCarousel paintings={paintings} />
            </PaintingsGalleryFrame>
          ) : (
            <>
              <PaintingsGalleryFrame className='h-[360px] sm:h-[480px] md:h-[540px]'>
                <div className='size-full'>
                  <CircularGallery
                    items={galleryItems}
                    onItemClick={handleItemClick}
                    bend={bend}
                    textColor={textColor}
                    scrollSpeed={isMobile ? 1.4 : 1.1}
                    borderRadius={0.06}
                    font={
                      isMobile ? 'bold 18px Oswald, sans-serif' : 'bold 22px Oswald, sans-serif'
                    }
                  />
                </div>
              </PaintingsGalleryFrame>

              <ul className='sr-only'>
                {galleryItems.map(item => (
                  <li key={item.href ?? item.image}>
                    <Link to={item.href ?? '/paintings'}>{item.text}</Link>
                  </li>
                ))}
              </ul>

              <p className='mt-3 text-center text-sm text-foreground-subtle'>
                {isMobile
                  ? 'Swipe to explore · Tap the center painting to open'
                  : 'Drag to explore · Click the center painting to open'}
              </p>
            </>
          )}
        </motion.div>

        {showFooter ? (
          <motion.div
            className='mt-10 flex flex-col items-center justify-center gap-4 text-foreground md:mt-16'
            initial={fadeUpInitial}
            whileInView={fadeUpAnimate}
            viewport={viewport}
            transition={transition}
          >
            <p>Like what you see?</p>
            <Link
              to='/paintings'
              className='rounded-full bg-accent px-4 py-2 text-accent-contrast transition-all duration-300 hover:bg-accent-hover'
            >
              Explore all paintings
            </Link>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
};

export default PaintingsShowcase;
