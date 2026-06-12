'use client';

import { useGSAP } from '@gsap/react';
import { cn } from '@wisihe/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getGlobalLenis } from '@/app/lib/lenis-registry';
import { urlForImage } from '@/sanity/lib/utils';
import { LifeJourneyMap } from './LifeJourneyMap';
import {
  getJourneyItemsWithCoordinates,
  getLocationMeta,
  type LifeJourneyItem,
} from './lifeJourneyTypes';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type LifeJourneyScrollyProps = {
  items: LifeJourneyItem[];
};

const journeyIntro = (
  <>
    <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
      Life map
    </p>
    <h2 className='mt-3 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]'>
      Places that shaped me
    </h2>
    <p className='mt-3 max-w-xl text-base text-foreground-subtle text-pretty sm:text-lg'>
      Scroll the timeline — the map follows along, always north up, while each chapter comes into
      focus.
    </p>
  </>
);

export function LifeJourneyScrolly({ items }: LifeJourneyScrollyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMapIndexRef = useRef(0);
  const [activeMapIndex, setActiveMapIndex] = useState(0);
  const mappedItems = getJourneyItemsWithCoordinates(items);

  const setActiveIndexIfChanged = useCallback((index: number) => {
    if (index < 0) return;
    if (lastMapIndexRef.current === index) return;
    lastMapIndexRef.current = index;
    setActiveMapIndex(index);
  }, []);

  const scrollToChapter = useCallback(
    (index: number) => {
      if (!mappedItems[index]) return;
      setActiveIndexIfChanged(index);

      const target = containerRef.current?.querySelector<HTMLElement>(
        `[data-journey-step][data-map-index="${index}"]`,
      );
      if (!target) return;

      const lenis = getGlobalLenis();
      if (lenis) {
        lenis.scrollTo(target, { offset: -120, duration: 1.2 });
        return;
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    [mappedItems, setActiveIndexIfChanged],
  );

  useEffect(() => {
    const timer = globalThis.window?.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => {
      if (timer) globalThis.window?.clearTimeout(timer);
    };
  }, [items.length]);

  useGSAP(
    () => {
      const journeySections = gsap.utils.toArray<HTMLElement>('[data-journey-step]');

      journeySections.forEach(section => {
        const mapIndex = Number(section.dataset['mapIndex'] ?? -1);

        ScrollTrigger.create({
          trigger: section,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => setActiveIndexIfChanged(mapIndex),
          onEnterBack: () => setActiveIndexIfChanged(mapIndex),
        });

        const card = section.querySelector('[data-journey-card]');
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: section,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
            y: 16,
            opacity: 0,
            duration: 0.45,
            ease: 'power2.out',
          });
        }
      });

      ScrollTrigger.refresh();
    },
    {
      scope: containerRef,
      dependencies: [items.length, mappedItems.length, setActiveIndexIfChanged],
    },
  );

  if (!items.length) return null;

  return (
    <section
      ref={containerRef}
      className='border-t border-border/40 bg-background'
      aria-label='Life journey map story'
    >
      <div className='mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start lg:gap-10 xl:gap-14'>
          {/* Story column — 60% on desktop */}
          <div className='order-2 lg:order-1'>
            <header className='mb-10 lg:mb-12'>{journeyIntro}</header>

            <div className='relative'>
              <div
                className='absolute bottom-0 left-4 top-0 hidden w-px bg-border/50 lg:block'
                aria-hidden
              />

              {items.map((item, index) => {
                const meta = getLocationMeta(item.locationType);
                const mapIndex = mappedItems.findIndex(j => j._key === item._key);
                const imageUrl = item.image
                  ? urlForImage(item.image)?.width(900).quality(80).url()
                  : null;
                const isActive = mapIndex === activeMapIndex;

                return (
                  <article
                    key={item._key}
                    data-journey-step
                    data-map-index={mapIndex}
                    className={cn(
                      'relative min-h-[44svh] py-8 lg:min-h-[52svh] lg:py-12 lg:pl-10',
                      mapIndex >= 0 && !isActive && 'opacity-65',
                    )}
                    id={`journey-${item._key}`}
                  >
                    <span
                      className={cn(
                        'absolute left-0 top-10 hidden size-2.5 -translate-x-1/2 rounded-full lg:block',
                        isActive ? 'bg-accent ring-4 ring-accent/20' : 'bg-border',
                      )}
                      aria-hidden
                    />

                    <div
                      data-journey-card
                      className={cn(
                        'rounded-2xl border p-5 transition-colors sm:p-6',
                        isActive
                          ? 'border-accent/35 bg-surface/60'
                          : 'border-border/50 bg-surface/30',
                      )}
                    >
                      <div className='mb-4 flex items-center justify-between gap-3'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <span className='font-mono text-xs font-semibold uppercase tracking-[0.25em] text-accent'>
                            {item.year}
                          </span>
                          <span
                            className={cn(
                              'rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                              meta.chipClass,
                            )}
                          >
                            {meta.label}
                          </span>
                        </div>
                        <span className='font-mono text-[10px] tabular-nums text-foreground-muted'>
                          {String(index + 1).padStart(2, '0')} /{' '}
                          {String(items.length).padStart(2, '0')}
                        </span>
                      </div>

                      {item.placeName ? (
                        <p className='text-sm text-foreground-muted'>{item.placeName}</p>
                      ) : null}

                      <h3 className='mt-1 font-serif text-2xl font-bold leading-tight text-foreground sm:text-3xl'>
                        {item.title}
                      </h3>

                      {item.content ? (
                        <p className='mt-3 text-base leading-relaxed text-foreground-subtle text-pretty'>
                          {item.content}
                        </p>
                      ) : null}

                      {imageUrl ? (
                        <div className='relative mt-5 aspect-16/10 overflow-hidden rounded-xl border border-border/50'>
                          <Image
                            src={imageUrl}
                            alt={item.title ?? item.placeName ?? 'Journey photo'}
                            fill
                            className='object-cover'
                            sizes='(max-width: 1024px) 100vw, 480px'
                            placeholder={item.image?.lqip ? 'blur' : 'empty'}
                            blurDataURL={item.image?.lqip ?? undefined}
                          />
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Map column — 40%, sticky (~38–42svh mobile, full height desktop) */}
          <div className='order-1 lg:order-2'>
            <div className='sticky top-0 z-10 -mx-4 h-[38svh] overflow-hidden border-b border-border/40 bg-background sm:-mx-6 sm:h-[42svh] lg:top-8 lg:mx-0 lg:h-[calc(100svh-4rem)] lg:rounded-2xl lg:border lg:border-border/50 lg:shadow-xl'>
              <LifeJourneyMap
                items={items}
                activeIndex={activeMapIndex}
                onSelectStop={scrollToChapter}
                className='h-full'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
