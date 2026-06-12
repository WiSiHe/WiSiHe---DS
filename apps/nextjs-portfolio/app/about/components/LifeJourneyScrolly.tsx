'use client';

import { useGSAP } from '@gsap/react';
import { cn } from '@wisihe/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { urlForImage } from '@/sanity/lib/utils';
import { JourneyMapProgress } from './JourneyMapProgress';
import { LifeJourneyMap, type LifeJourneyMapMode } from './LifeJourneyMap';
import {
  getJourneyItemsWithCoordinates,
  getLocationMeta,
  type LifeJourneyItem,
  type VisitedCountryItem,
} from './lifeJourneyTypes';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type LifeJourneyScrollyProps = {
  items: LifeJourneyItem[];
  visitedCountries?: VisitedCountryItem[];
};

export function LifeJourneyScrolly({ items, visitedCountries = [] }: LifeJourneyScrollyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const countriesRef = useRef<HTMLDivElement>(null);
  const [activeMapIndex, setActiveMapIndex] = useState(0);
  const [mapMode, setMapMode] = useState<LifeJourneyMapMode>('journey');
  const mappedItems = getJourneyItemsWithCoordinates(items);

  const scrollToChapter = useCallback(
    (index: number) => {
      const item = mappedItems[index];
      if (!item) return;

      setMapMode('journey');
      setActiveMapIndex(index);

      const target = containerRef.current?.querySelector<HTMLElement>(
        `[data-journey-step][data-map-index="${index}"]`,
      );
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    [mappedItems],
  );

  useGSAP(
    () => {
      const sections = gsap.utils.toArray<HTMLElement>('[data-journey-step]');
      sections.forEach(section => {
        const mapIndex = Number(section.dataset['mapIndex'] ?? -1);

        ScrollTrigger.create({
          trigger: section,
          start: 'top 58%',
          end: 'bottom 42%',
          onEnter: () => {
            if (mapIndex >= 0) {
              setMapMode('journey');
              setActiveMapIndex(mapIndex);
            }
          },
          onEnterBack: () => {
            if (mapIndex >= 0) {
              setMapMode('journey');
              setActiveMapIndex(mapIndex);
            }
          },
        });

        const text = section.querySelector('[data-journey-text]');
        const media = section.querySelector('[data-journey-media]');

        if (text) {
          gsap.from(text, {
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
            y: 36,
            opacity: 0,
            duration: 0.75,
            ease: 'power3.out',
          });
        }

        if (media) {
          gsap.from(media, {
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
            y: 20,
            opacity: 0,
            scale: 0.97,
            duration: 0.85,
            ease: 'power3.out',
            delay: 0.08,
          });
        }
      });

      if (countriesRef.current) {
        ScrollTrigger.create({
          trigger: countriesRef.current,
          start: 'top 70%',
          end: 'bottom 30%',
          onEnter: () => setMapMode('travel'),
          onEnterBack: () => {
            if (mappedItems.length > 0) {
              setMapMode('journey');
              setActiveMapIndex(mappedItems.length - 1);
            }
          },
        });
      }
    },
    { scope: containerRef, dependencies: [items.length, mappedItems.length] },
  );

  if (!items.length) return null;

  return (
    <section
      ref={containerRef}
      className='relative border-t border-border/40 bg-background'
      aria-label='Life journey map story'
    >
      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 lg:px-12 lg:py-24'>
        <div className='mb-12 max-w-2xl space-y-4 lg:mb-16'>
          <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
            Life map
          </p>
          <h2 className='font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl'>
            Places that shaped me
          </h2>
          <p className='text-lg text-foreground-subtle text-pretty'>
            The map follows you as you scroll — from the Arctic north through childhood moves,
            student years, and the countries I&apos;ve explored along the way.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10'>
          <aside className='lg:col-span-5'>
            <div className='sticky top-4 z-30 flex flex-col gap-3 lg:top-20 lg:h-[calc(100svh-6rem)]'>
              <div className='h-[min(46svh,420px)] min-h-[260px] flex-1 lg:min-h-0'>
                <LifeJourneyMap
                  items={items}
                  visitedCountries={visitedCountries}
                  activeIndex={activeMapIndex}
                  mapMode={mapMode}
                  onSelectStop={scrollToChapter}
                  className='h-full'
                />
              </div>
              <JourneyMapProgress
                items={mappedItems}
                activeIndex={activeMapIndex}
                onSelect={scrollToChapter}
              />
              <p className='text-center text-xs text-foreground-muted lg:hidden'>
                {mapMode === 'travel'
                  ? 'Travel overview'
                  : `${activeMapIndex + 1} of ${mappedItems.length} life stops`}
              </p>
            </div>
          </aside>

          <div className='space-y-20 lg:col-span-7 lg:space-y-28 lg:py-4'>
            {items.map((item, index) => {
              const meta = getLocationMeta(item.locationType);
              const mapIndex = getJourneyItemsWithCoordinates(items).findIndex(
                j => j._key === item._key,
              );
              const imageUrl = item.image
                ? urlForImage(item.image)?.width(900).quality(80).url()
                : null;
              const isActiveChapter = mapMode === 'journey' && mapIndex === activeMapIndex;

              return (
                <article
                  key={item._key}
                  data-journey-step
                  data-map-index={mapIndex}
                  className={cn(
                    'flex min-h-[55vh] flex-col justify-center scroll-mt-28 transition-opacity duration-500 lg:scroll-mt-32',
                    mapIndex >= 0 && !isActiveChapter && mapMode === 'journey' && 'opacity-55',
                    isActiveChapter && 'opacity-100',
                  )}
                  id={`journey-${item._key}`}
                >
                  <div data-journey-text className='space-y-5'>
                    <div className='flex flex-wrap items-center gap-3'>
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
                      {item.placeName ? (
                        <span className='text-sm text-foreground-muted'>{item.placeName}</span>
                      ) : null}
                    </div>

                    <h3 className='font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl'>
                      {item.title}
                    </h3>

                    {item.content ? (
                      <p className='max-w-xl text-lg leading-relaxed text-foreground-subtle text-pretty'>
                        {item.content}
                      </p>
                    ) : null}
                  </div>

                  {imageUrl ? (
                    <div
                      data-journey-media
                      className='relative mt-8 aspect-[16/10] max-w-xl overflow-hidden rounded-2xl border border-border/50 shadow-lg'
                    >
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

                  {index < items.length - 1 ? (
                    <div className='mt-12 h-px w-full max-w-xl bg-gradient-to-r from-border via-accent/30 to-transparent' />
                  ) : null}
                </article>
              );
            })}

            {visitedCountries.length > 0 ? (
              <div
                ref={countriesRef}
                className='scroll-mt-28 border-t border-border/40 pt-16 lg:scroll-mt-32 lg:pt-20'
              >
                <div className='mb-8 max-w-2xl space-y-3'>
                  <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
                    Travel
                  </p>
                  <h3 className='font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
                    Countries I&apos;ve visited
                  </h3>
                  <p className='text-foreground-subtle text-pretty'>
                    Scroll here and the map zooms out to show everywhere I&apos;ve been — yellow
                    pins across Europe and beyond.
                  </p>
                </div>
                <ul className='flex flex-wrap gap-2'>
                  {visitedCountries.map(country => (
                    <li
                      key={country._key}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-sm transition-colors',
                        getLocationMeta('visited').chipClass,
                      )}
                    >
                      <span className='font-medium'>{country.country}</span>
                      {country.placeName ? (
                        <span className='text-foreground-muted'> · {country.placeName}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
