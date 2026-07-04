'use client';

import { cn } from '@wisihe/utils';
import { useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import CircularGallery, { type CircularGalleryItem } from '@/app/components/ui/CircularGallery';
import { paintingsToCircularGalleryItems } from '@/lib/paintings/paintingsToCircularGalleryItems';
import PaintingsShowcaseCarousel from './PaintingsShowcaseCarousel';

// biome-ignore lint/suspicious/noExplicitAny: Painting data shape varies between Sanity and Algolia
type PaintingsShowcaseProps = {
  paintings: any[];
  showFooter?: boolean;
  className?: string;
  intro?: ReactNode;
};

function readGalleryThemeColors() {
  if (typeof window === 'undefined') {
    return { textColor: '#171717', fadeColor: 'var(--color-surface)' };
  }

  const root = document.documentElement;
  const styles = getComputedStyle(root);

  return {
    textColor: styles.getPropertyValue('--color-foreground').trim() || '#171717',
    fadeColor: styles.getPropertyValue('--color-surface').trim() || 'var(--color-surface)',
  };
}

function readGalleryBend(width: number): number {
  if (width < 768) return 2;
  if (width < 1024) return 2.5;
  return 3;
}

type PaintingsGalleryFrameProps = {
  fadeColor: string;
  className?: string;
  children: ReactNode;
};

function PaintingsGalleryFrame({ fadeColor, className, children }: PaintingsGalleryFrameProps) {
  return (
    <div
      className={cn('relative isolate w-full overflow-hidden', className)}
      style={{ '--paintings-gallery-fade': fadeColor } as CSSProperties}
    >
      {children}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-y-0 left-0 z-10 w-[clamp(32px,10%,160px)] bg-[linear-gradient(to_right,var(--paintings-gallery-fade)_0%,transparent_100%)]'
      />
      <div
        aria-hidden
        className='pointer-events-none absolute inset-y-0 right-0 z-10 w-[clamp(32px,10%,160px)] bg-[linear-gradient(to_left,var(--paintings-gallery-fade)_0%,transparent_100%)]'
      />
    </div>
  );
}

const PaintingsShowcase = ({
  paintings,
  showFooter = true,
  className,
  intro,
}: PaintingsShowcaseProps) => {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [textColor, setTextColor] = useState('#171717');
  const [fadeColor, setFadeColor] = useState('var(--color-surface)');
  const [bend, setBend] = useState(2.5);

  useEffect(() => {
    const sync = () => {
      setMounted(true);
      const colors = readGalleryThemeColors();
      setTextColor(colors.textColor);
      setFadeColor(colors.fadeColor);
      setBend(readGalleryBend(window.innerWidth));
    };

    sync();
    window.addEventListener('resize', sync);

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      window.removeEventListener('resize', sync);
      observer.disconnect();
    };
  }, []);

  const reducedMotion = Boolean(mounted && prefersReducedMotion);
  const galleryItems = useMemo(() => paintingsToCircularGalleryItems(paintings), [paintings]);

  const handleItemClick = useCallback(
    (item: CircularGalleryItem) => {
      if (item.href) router.push(item.href);
    },
    [router],
  );

  if (!galleryItems.length) {
    return null;
  }

  return (
    <section className={cn('px-4', className)} aria-label='Featured paintings gallery'>
      <div className='mx-auto max-w-7xl'>
        {intro ? <div className='mb-8 max-w-prose'>{intro}</div> : null}

        {reducedMotion ? (
          <PaintingsGalleryFrame fadeColor={fadeColor}>
            <PaintingsShowcaseCarousel paintings={paintings} />
          </PaintingsGalleryFrame>
        ) : (
          <>
            <PaintingsGalleryFrame
              fadeColor={fadeColor}
              className='h-[420px] sm:h-[480px] md:h-[540px]'
            >
              <div className='size-full'>
                <CircularGallery
                  items={galleryItems}
                  onItemClick={handleItemClick}
                  bend={bend}
                  textColor={textColor}
                  scrollSpeed={1.1}
                  borderRadius={0.06}
                  font='bold 22px Oswald, sans-serif'
                />
              </div>
            </PaintingsGalleryFrame>

            <ul className='sr-only'>
              {galleryItems.map(item => (
                <li key={item.href ?? item.image}>
                  <Link href={item.href ?? '/paintings'}>{item.text}</Link>
                </li>
              ))}
            </ul>

            <p className='mt-3 text-center text-sm text-foreground-subtle'>
              Drag to explore · Tap the center painting to open
            </p>
          </>
        )}

        {showFooter ? (
          <div className='mt-10 flex flex-col items-center justify-center gap-4 text-foreground md:mt-16'>
            <p>Like what you see?</p>
            <Link
              href='/paintings'
              className='rounded-full bg-accent px-4 py-2 text-accent-contrast transition-all duration-300 hover:bg-accent-hover'
            >
              Explore all paintings
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default PaintingsShowcase;
