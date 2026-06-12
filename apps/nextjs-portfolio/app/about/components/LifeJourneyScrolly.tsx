'use client';

import { useGSAP } from '@gsap/react';
import { cn } from '@wisihe/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getGlobalLenis, registerScrollElements } from '@/app/lib/lenis-registry';
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
  const mapPinRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const countriesRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
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
      if (!target) return;

      const lenis = getGlobalLenis();
      if (lenis) {
        lenis.scrollTo(target, { offset: -72, duration: 1.35 });
        return;
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    [mappedItems],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    registerScrollElements(container);
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => window.clearTimeout(timer);
  }, [items.length, visitedCountries.length]);

  useGSAP(
    () => {
      const sections = gsap.utils.toArray<HTMLElement>('[data-journey-step]');
      const story = storyRef.current;
      const mapPanel = mapPinRef.current;
      const progressBar = progressBarRef.current;

      sections.forEach(section => {
        const mapIndex = Number(section.dataset['mapIndex'] ?? -1);

        ScrollTrigger.create({
          trigger: section,
          start: 'top 55%',
          end: 'bottom 45%',
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
        const watermark = section.querySelector('[data-journey-watermark]');

        if (text) {
          gsap.from(text, {
            scrollTrigger: {
              trigger: section,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
            y: 48,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
          });
        }

        if (media) {
          gsap.from(media, {
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
            y: 32,
            opacity: 0,
            scale: 0.94,
            duration: 1,
            ease: 'power3.out',
            delay: 0.1,
          });
        }

        if (watermark) {
          gsap.fromTo(
            watermark,
            { opacity: 0, x: 24 },
            {
              scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                end: 'bottom 30%',
                scrub: 0.6,
              },
              opacity: 0.12,
              x: 0,
              ease: 'none',
            },
          );
        }
      });

      if (story && mapPanel) {
        const mm = gsap.matchMedia();
        mm.add('(min-width: 1024px)', () => {
          const pin = ScrollTrigger.create({
            trigger: story,
            start: 'top top',
            end: 'bottom bottom',
            pin: mapPanel,
            pinSpacing: false,
            invalidateOnRefresh: true,
          });
          return () => pin.kill();
        });
      }

      if (story && progressBar) {
        ScrollTrigger.create({
          trigger: story,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.35,
          onUpdate: self => {
            progressBar.style.transform = `scaleX(${self.progress})`;
          },
        });
      }

      if (countriesRef.current) {
        ScrollTrigger.create({
          trigger: countriesRef.current,
          start: 'top 65%',
          end: 'bottom 35%',
          onEnter: () => setMapMode('travel'),
          onEnterBack: () => {
            if (mappedItems.length > 0) {
              setMapMode('journey');
              setActiveMapIndex(mappedItems.length - 1);
            }
          },
        });
      }

      ScrollTrigger.refresh();
    },
    { scope: containerRef, dependencies: [items.length, mappedItems.length] },
  );

  if (!items.length) return null;

  return (
    <section
      ref={containerRef}
      className='relative overflow-hidden border-t border-border/40 bg-background'
      aria-label='Life journey map story'
      data-scroll-section
    >
      <div
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_0%,rgba(255,68,0,0.14),transparent_55%)]'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_90%_80%,rgba(56,189,248,0.08),transparent_50%)]'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.035)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,black,transparent_95%)]'
        aria-hidden
      />

      <div className='relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 lg:px-12 lg:py-24'>
        <div data-scroll data-scroll-speed='0.08' className='mb-14 max-w-2xl space-y-4 lg:mb-20'>
          <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
            Life map
          </p>
          <h2 className='font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl'>
            Places that shaped me
          </h2>
          <p className='text-lg text-foreground-subtle text-pretty sm:text-xl'>
            Scroll through the story — the map stays with you, flying from the Arctic north through
            childhood moves, student years, and the countries I&apos;ve explored.
          </p>
        </div>

        <div className='mb-10 h-[min(52svh,440px)] lg:hidden'>
          <LifeJourneyMap
            items={items}
            visitedCountries={visitedCountries}
            activeIndex={activeMapIndex}
            mapMode={mapMode}
            onSelectStop={scrollToChapter}
            className='h-full'
          />
          <p className='mt-3 text-center text-xs text-foreground-muted'>
            {mapMode === 'travel'
              ? 'Travel overview'
              : `${activeMapIndex + 1} of ${mappedItems.length} · tap a pin to jump`}
          </p>
        </div>

        <div className='relative lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16'>
          <aside ref={mapPinRef} className='hidden lg:col-span-5 lg:block'>
            <div className='flex h-[calc(100svh-2rem)] flex-col gap-3 py-2'>
              <div className='relative min-h-0 flex-1'>
                <div
                  ref={progressBarRef}
                  className='absolute inset-x-0 top-0 z-40 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-accent via-accent/80 to-transparent'
                  aria-hidden
                />
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
            </div>
          </aside>

          <div ref={storyRef} className='relative lg:col-span-7'>
            <div
              className='pointer-events-none absolute bottom-0 left-3 top-0 hidden w-px bg-gradient-to-b from-transparent via-border to-transparent lg:block xl:left-4'
              aria-hidden
            />

            {items.map((item, index) => {
              const meta = getLocationMeta(item.locationType);
              const mapIndex = getJourneyItemsWithCoordinates(items).findIndex(
                j => j._key === item._key,
              );
              const imageUrl = item.image
                ? urlForImage(item.image)?.width(1100).quality(82).url()
                : null;
              const isActiveChapter = mapMode === 'journey' && mapIndex === activeMapIndex;
              const chapterLabel = String(index + 1).padStart(2, '0');

              return (
                <article
                  key={item._key}
                  data-journey-step
                  data-map-index={mapIndex}
                  className={cn(
                    'relative flex min-h-[100svh] flex-col justify-center py-12 transition-[opacity,filter] duration-700 lg:py-16',
                    mapIndex >= 0 &&
                      !isActiveChapter &&
                      mapMode === 'journey' &&
                      'opacity-40 blur-[0.3px]',
                    isActiveChapter && 'opacity-100 blur-0',
                  )}
                  id={`journey-${item._key}`}
                >
                  <span
                    data-journey-watermark
                    aria-hidden
                    className='pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 select-none font-serif text-[clamp(5rem,14vw,11rem)] font-bold leading-none text-foreground/5 lg:block'
                  >
                    {chapterLabel}
                  </span>

                  <span
                    className={cn(
                      'absolute left-0 top-1/2 hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background ring-2 transition-all duration-500 lg:block',
                      isActiveChapter
                        ? 'scale-125 bg-accent ring-accent/40'
                        : 'scale-100 bg-border ring-border/60',
                    )}
                    aria-hidden
                  />

                  <div
                    data-scroll
                    data-scroll-speed='0.05'
                    data-journey-text
                    className='relative space-y-6 pl-0 lg:pl-10 xl:pl-12'
                  >
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

                    <p className='font-mono text-[11px] uppercase tracking-[0.35em] text-foreground-muted'>
                      Chapter {chapterLabel}
                    </p>

                    <h3 className='max-w-xl font-serif text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl lg:text-[3.25rem]'>
                      {item.title}
                    </h3>

                    {item.content ? (
                      <p className='max-w-xl text-lg leading-relaxed text-foreground-subtle text-pretty sm:text-xl'>
                        {item.content}
                      </p>
                    ) : null}
                  </div>

                  {imageUrl ? (
                    <div
                      data-scroll
                      data-scroll-speed='-0.06'
                      data-journey-media
                      className='relative mt-10 aspect-[16/10] max-w-xl overflow-hidden rounded-2xl border border-border/50 shadow-2xl shadow-accent/10 lg:ml-10 xl:ml-12'
                    >
                      <div
                        className='pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background/30 via-transparent to-transparent'
                        aria-hidden
                      />
                      <Image
                        src={imageUrl}
                        alt={item.title ?? item.placeName ?? 'Journey photo'}
                        fill
                        className='object-cover'
                        sizes='(max-width: 1024px) 100vw, 520px'
                        placeholder={item.image?.lqip ? 'blur' : 'empty'}
                        blurDataURL={item.image?.lqip ?? undefined}
                      />
                    </div>
                  ) : null}
                </article>
              );
            })}

            {visitedCountries.length > 0 ? (
              <div
                ref={countriesRef}
                data-scroll
                data-scroll-speed='0.04'
                className='relative flex min-h-[80svh] flex-col justify-center border-t border-border/40 py-16 lg:py-24'
              >
                <div className='mb-10 max-w-2xl space-y-4 lg:pl-10 xl:pl-12'>
                  <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
                    Travel
                  </p>
                  <h3 className='font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl'>
                    Countries I&apos;ve visited
                  </h3>
                  <p className='text-lg text-foreground-subtle text-pretty'>
                    Keep scrolling — the map zooms out to show everywhere I&apos;ve been, with
                    yellow pins across Europe and beyond.
                  </p>
                </div>
                <ul className='flex flex-wrap gap-2 lg:pl-10 xl:pl-12'>
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
