'use client';

import { useGSAP } from '@gsap/react';
import { cn } from '@wisihe/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getGlobalLenis, registerScrollElements } from '@/app/lib/lenis-registry';
import { urlForImage } from '@/sanity/lib/utils';
import { CountryPhotoStrip } from './CountryPhotoStrip';
import { resolveCountryIsoCode } from './countryCodes';
import { LifeJourneyMap, type LifeJourneyMapMode } from './LifeJourneyMap';
import {
  getJourneyItemsWithCoordinates,
  getLocationMeta,
  groupPhotosByCountry,
  type LifeJourneyItem,
  type TravelPhotoItem,
  type VisitedCountryItem,
} from './lifeJourneyTypes';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type LifeJourneyScrollyProps = {
  items: LifeJourneyItem[];
  visitedCountries?: VisitedCountryItem[];
  travelPhotos?: TravelPhotoItem[];
};

export function LifeJourneyScrolly({
  items,
  visitedCountries = [],
  travelPhotos = [],
}: LifeJourneyScrollyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapLayerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [activeMapIndex, setActiveMapIndex] = useState(0);
  const [activeCountryIndex, setActiveCountryIndex] = useState(0);
  const [mapMode, setMapMode] = useState<LifeJourneyMapMode>('journey');
  const mappedItems = getJourneyItemsWithCoordinates(items);
  const photosByCountry = useMemo(() => groupPhotosByCountry(travelPhotos), [travelPhotos]);

  const activeCountryCode = useMemo(() => {
    const country = visitedCountries[activeCountryIndex];
    if (!country) return null;
    return resolveCountryIsoCode(country.country, country.countryCode);
  }, [visitedCountries, activeCountryIndex]);

  const scrollToChapter = useCallback(
    (index: number) => {
      const item = mappedItems[index];
      if (!item) return;

      setMapMode('journey');
      setActiveMapIndex(index);

      const target = containerRef.current?.querySelector<HTMLElement>(
        `[data-journey-step][data-map-index="${index}"]`,
      );
      if (!target) return;

      const lenis = getGlobalLenis();
      if (lenis) {
        lenis.scrollTo(target, { offset: -24, duration: 1.2 });
        return;
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'end' });
    },
    [mappedItems],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    registerScrollElements(container);
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => window.clearTimeout(timer);
  }, [items.length, visitedCountries.length, travelPhotos.length]);

  useGSAP(
    () => {
      const journeySections = gsap.utils.toArray<HTMLElement>('[data-journey-step]');
      const countrySections = gsap.utils.toArray<HTMLElement>('[data-country-step]');
      const mapLayer = mapLayerRef.current;
      const story = storyRef.current;

      journeySections.forEach(section => {
        const mapIndex = Number(section.dataset['mapIndex'] ?? -1);

        ScrollTrigger.create({
          trigger: section,
          start: 'top 72%',
          end: 'bottom 28%',
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

        const card = section.querySelector('[data-journey-card]');
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            y: 28,
            opacity: 0,
            duration: 0.65,
            ease: 'power3.out',
          });
        }
      });

      countrySections.forEach(section => {
        const countryIndex = Number(section.dataset['countryIndex'] ?? -1);

        ScrollTrigger.create({
          trigger: section,
          start: 'top 72%',
          end: 'bottom 28%',
          onEnter: () => {
            if (countryIndex >= 0) {
              setMapMode('country');
              setActiveCountryIndex(countryIndex);
            }
          },
          onEnterBack: () => {
            if (countryIndex >= 0) {
              setMapMode('country');
              setActiveCountryIndex(countryIndex);
            }
          },
        });

        const card = section.querySelector('[data-country-card]');
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            y: 28,
            opacity: 0,
            duration: 0.65,
            ease: 'power3.out',
          });
        }
      });

      const travelIntro = containerRef.current?.querySelector('[data-travel-intro]');
      if (travelIntro) {
        ScrollTrigger.create({
          trigger: travelIntro,
          start: 'top 72%',
          end: 'bottom 28%',
          onEnter: () => setMapMode('travel'),
          onEnterBack: () => {
            if (mappedItems.length > 0) {
              setMapMode('journey');
              setActiveMapIndex(mappedItems.length - 1);
            }
          },
        });
      }

      if (mapLayer && story) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: mapLayer,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      }

      ScrollTrigger.refresh();
    },
    {
      scope: containerRef,
      dependencies: [items.length, mappedItems.length, visitedCountries.length],
    },
  );

  if (!items.length) return null;

  return (
    <section
      ref={containerRef}
      className='relative bg-background'
      aria-label='Life journey map story'
    >
      <div className='relative'>
        <div ref={mapLayerRef} className='relative h-svh w-full'>
          <LifeJourneyMap
            items={items}
            visitedCountries={visitedCountries}
            activeIndex={activeMapIndex}
            activeCountryCode={activeCountryCode}
            mapMode={mapMode}
            onSelectStop={scrollToChapter}
            fullBleed
            className='h-full'
          />

          <div className='pointer-events-none absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-1.5 rounded-full border border-border/50 bg-background/80 px-3 py-2 backdrop-blur-md'>
            <span
              className={cn(
                'size-1.5 rounded-full transition-all duration-300',
                mapMode === 'journey' ? 'scale-125 bg-accent' : 'bg-foreground/25',
              )}
              aria-hidden
            />
            <span
              className={cn(
                'size-1.5 rounded-full transition-all duration-300',
                mapMode === 'travel' ? 'scale-125 bg-neon-yellow-500' : 'bg-foreground/25',
              )}
              aria-hidden
            />
            <span
              className={cn(
                'size-1.5 rounded-full transition-all duration-300',
                mapMode === 'country' ? 'scale-125 bg-neon-yellow-500' : 'bg-foreground/25',
              )}
              aria-hidden
            />
          </div>
        </div>

        <div ref={storyRef} className='relative z-10 -mt-svh'>
          <article className='flex min-h-svh flex-col justify-end px-4 pb-8 pt-[42vh] sm:px-6'>
            <div
              data-scroll
              data-scroll-speed='0.04'
              className='mx-auto w-full max-w-lg rounded-2xl border border-border/60 bg-background/92 p-6 shadow-2xl backdrop-blur-xl'
            >
              <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
                Life map
              </p>
              <h2 className='mt-3 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
                Places that shaped me
              </h2>
              <p className='mt-3 text-base text-foreground-subtle text-pretty sm:text-lg'>
                Scroll to move through my story. The map stays full screen behind you — always north
                up — while each chapter slides into view.
              </p>
            </div>
          </article>

          {items.map((item, index) => {
            const meta = getLocationMeta(item.locationType);
            const mapIndex = mappedItems.findIndex(j => j._key === item._key);
            const imageUrl = item.image
              ? urlForImage(item.image)?.width(900).quality(80).url()
              : null;
            const isActive = mapMode === 'journey' && mapIndex === activeMapIndex;

            return (
              <article
                key={item._key}
                data-journey-step
                data-map-index={mapIndex}
                className={cn(
                  'flex min-h-svh flex-col justify-end px-4 pb-8 pt-[38vh] sm:px-6',
                  mapIndex >= 0 && !isActive && mapMode === 'journey' && 'opacity-90',
                )}
                id={`journey-${item._key}`}
              >
                <div
                  data-journey-card
                  className={cn(
                    'mx-auto w-full max-w-lg rounded-2xl border bg-background/92 p-5 shadow-2xl backdrop-blur-xl sm:p-6',
                    isActive ? 'border-accent/40' : 'border-border/60',
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
                      {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
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
                    <div className='relative mt-5 aspect-[16/10] overflow-hidden rounded-xl border border-border/50'>
                      <Image
                        src={imageUrl}
                        alt={item.title ?? item.placeName ?? 'Journey photo'}
                        fill
                        className='object-cover'
                        sizes='(max-width: 640px) 100vw, 512px'
                        placeholder={item.image?.lqip ? 'blur' : 'empty'}
                        blurDataURL={item.image?.lqip ?? undefined}
                      />
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}

          {visitedCountries.length > 0 ? (
            <>
              <article
                data-travel-intro
                className='flex min-h-[70svh] flex-col justify-end px-4 pb-8 pt-[38vh] sm:px-6'
              >
                <div
                  data-country-card
                  className='mx-auto w-full max-w-lg rounded-2xl border border-neon-yellow-500/30 bg-background/92 p-5 shadow-2xl backdrop-blur-xl sm:p-6'
                >
                  <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-neon-yellow-500'>
                    Travel
                  </p>
                  <h3 className='mt-3 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
                    Countries I&apos;ve visited
                  </h3>
                  <p className='mt-3 text-base text-foreground-subtle text-pretty'>
                    Keep scrolling — entire countries light up on the map. Tag photography with a
                    matching country name to show your photos here.
                  </p>
                </div>
              </article>

              {visitedCountries.map((country, index) => {
                const meta = getLocationMeta('visited');
                const countryPhotos = country.country
                  ? (photosByCountry.get(country.country) ?? [])
                  : [];
                const isActive = mapMode === 'country' && activeCountryIndex === index;

                return (
                  <article
                    key={country._key}
                    data-country-step
                    data-country-index={index}
                    className={cn(
                      'flex min-h-svh flex-col justify-end px-4 pb-8 pt-[38vh] sm:px-6',
                      !isActive && mapMode === 'country' && 'opacity-90',
                    )}
                  >
                    <div
                      data-country-card
                      className={cn(
                        'mx-auto w-full max-w-lg rounded-2xl border bg-background/92 p-5 shadow-2xl backdrop-blur-xl sm:p-6',
                        isActive ? 'border-neon-yellow-500/40' : 'border-neon-yellow-500/20',
                      )}
                    >
                      <div className='mb-3 flex items-center justify-between gap-3'>
                        <span
                          className={cn(
                            'rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                            meta.chipClass,
                          )}
                        >
                          Visited
                        </span>
                        <span className='font-mono text-[10px] tabular-nums text-foreground-muted'>
                          {String(index + 1).padStart(2, '0')} /{' '}
                          {String(visitedCountries.length).padStart(2, '0')}
                        </span>
                      </div>

                      <h3 className='font-serif text-2xl font-bold text-foreground sm:text-3xl'>
                        {country.country}
                      </h3>

                      {country.placeName ? (
                        <p className='mt-1 text-sm text-foreground-muted'>{country.placeName}</p>
                      ) : null}

                      {country.notes ? (
                        <p className='mt-3 text-base text-foreground-subtle text-pretty'>
                          {country.notes}
                        </p>
                      ) : null}

                      {country.country ? (
                        <CountryPhotoStrip photos={countryPhotos} country={country.country} />
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </>
          ) : null}

          <div className='h-[20svh]' aria-hidden />
        </div>
      </div>
    </section>
  );
}
