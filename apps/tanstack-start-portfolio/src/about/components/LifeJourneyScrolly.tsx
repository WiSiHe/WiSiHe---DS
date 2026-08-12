'use client';

import { useGSAP } from '@gsap/react';
import { cn } from '@wisihe/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getGlobalLenis } from '@/lib/lenis-registry';
import { JourneyCityCard } from './JourneyCityCard';
import { JourneyMobileCarousel } from './JourneyMobileCarousel';
import { JourneyMobileNav } from './JourneyMobileNav';
import { LifeJourneyMap } from './LifeJourneyMap';
import { getJourneyItemsWithCoordinates, type LifeJourneyItem } from './lifeJourneyTypes';
import { formatCityLabel } from './PlaceFactsGrid';

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
      Places I&apos;ve lived
    </h2>
    <p className='mt-3 max-w-xl text-base text-foreground-subtle text-pretty sm:text-lg'>
      <span className='lg:hidden'>
        Use the arrows to move between cities — the map follows along.
      </span>
      <span className='hidden lg:inline'>
        Scroll or use the arrows — the map sweeps between cities. Tap a pin for city facts.
      </span>
    </p>
  </>
);

const DESKTOP_MQ = '(min-width: 1024px)';
const SCROLL_SYNC_LINE_RATIO = 0.52;
const NAV_SCROLL_DURATION_S = 1.1;

export function LifeJourneyScrolly({ items }: LifeJourneyScrollyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const mapColRef = useRef<HTMLDivElement>(null);
  const lastMapIndexRef = useRef(0);
  const navigationLockRef = useRef(false);
  const navigationUnlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeMapIndex, setActiveMapIndex] = useState(0);
  const mappedItems = getJourneyItemsWithCoordinates(items);

  const setActiveIndexIfChanged = useCallback((index: number) => {
    if (index < 0) return;
    if (lastMapIndexRef.current === index) return;
    lastMapIndexRef.current = index;
    setActiveMapIndex(index);
  }, []);

  const syncActiveFromScroll = useCallback(() => {
    if (navigationLockRef.current) return;
    if (!window.matchMedia(DESKTOP_MQ).matches) return;

    const container = containerRef.current;
    if (!container) return;

    const syncLine = window.innerHeight * SCROLL_SYNC_LINE_RATIO;
    const sections = container.querySelectorAll<HTMLElement>('[data-journey-step][data-map-index]');

    let bestIndex = lastMapIndexRef.current;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const section of sections) {
      const mapIndex = Number(section.dataset['mapIndex'] ?? -1);
      if (mapIndex < 0) continue;

      const rect = section.getBoundingClientRect();
      if (rect.bottom < syncLine || rect.top > window.innerHeight) continue;

      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - syncLine);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = mapIndex;
      }
    }

    setActiveIndexIfChanged(bestIndex);
  }, [setActiveIndexIfChanged]);

  const releaseNavigationLock = useCallback(() => {
    navigationLockRef.current = false;
    if (navigationUnlockTimerRef.current) {
      clearTimeout(navigationUnlockTimerRef.current);
      navigationUnlockTimerRef.current = null;
    }
    syncActiveFromScroll();
  }, [syncActiveFromScroll]);

  const goToIndex = useCallback(
    (index: number) => {
      if (!mappedItems[index]) return;
      setActiveIndexIfChanged(index);

      const isDesktop = window.matchMedia(DESKTOP_MQ).matches;
      if (!isDesktop) return;

      const target = containerRef.current?.querySelector<HTMLElement>(
        `[data-journey-step][data-map-index="${index}"]`,
      );
      if (!target) return;

      navigationLockRef.current = true;
      if (navigationUnlockTimerRef.current) {
        clearTimeout(navigationUnlockTimerRef.current);
      }
      navigationUnlockTimerRef.current = setTimeout(
        releaseNavigationLock,
        NAV_SCROLL_DURATION_S * 1000 + 150,
      );

      const lenis = getGlobalLenis();
      if (lenis) {
        lenis.scrollTo(target, { offset: -120, duration: NAV_SCROLL_DURATION_S });
        return;
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    [mappedItems, releaseNavigationLock, setActiveIndexIfChanged],
  );

  useEffect(() => {
    const timer = globalThis.window?.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => {
      if (timer) globalThis.window?.clearTimeout(timer);
    };
  }, [items.length]);

  useEffect(() => {
    let detach: (() => void) | undefined;
    let attachRaf = 0;

    const attachScrollSync = () => {
      const lenis = getGlobalLenis();
      if (!lenis) {
        attachRaf = requestAnimationFrame(attachScrollSync);
        return;
      }

      const onScroll = () => syncActiveFromScroll();
      lenis.on('scroll', onScroll);
      syncActiveFromScroll();
      detach = () => lenis.off('scroll', onScroll);
    };

    attachScrollSync();

    return () => {
      cancelAnimationFrame(attachRaf);
      detach?.();
      if (navigationUnlockTimerRef.current) {
        clearTimeout(navigationUnlockTimerRef.current);
      }
    };
  }, [items.length, syncActiveFromScroll]);

  useGSAP(
    () => {
      const story = storyRef.current;
      const mapCol = mapColRef.current;

      ScrollTrigger.matchMedia({
        '(min-width: 1024px)': () => {
          const journeySections = gsap.utils.toArray<HTMLElement>(
            '[data-journey-step]',
            containerRef.current,
          );

          journeySections.forEach(section => {
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

          if (story && mapCol) {
            ScrollTrigger.create({
              trigger: story,
              start: 'top top+=2rem',
              end: 'bottom bottom',
              pin: mapCol,
              pinSpacing: false,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            });
          }

          ScrollTrigger.refresh();
        },
      });
    },
    {
      scope: containerRef,
      dependencies: [items.length, mappedItems.length],
    },
  );

  const activeMappedItem = mappedItems[activeMapIndex];
  const activeCityLabel = formatCityLabel(activeMappedItem?.placeName, activeMappedItem?.title);
  const activeDisplayIndex = activeMappedItem
    ? items.findIndex(item => item._key === activeMappedItem._key)
    : 0;

  if (!items.length) return null;

  return (
    <section
      ref={containerRef}
      className='border-t border-border/40 bg-background'
      aria-label='Places lived map story'
    >
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-20'>
        <header className='mb-6 max-w-2xl lg:mb-10'>
          {journeyIntro}
          <a
            href='#travel-map-section'
            className='mt-4 inline-flex font-mono text-[10px] uppercase tracking-wider text-foreground-muted underline-offset-4 hover:text-accent hover:underline lg:hidden'
          >
            Skip to countries visited
          </a>
        </header>

        <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start lg:gap-8 xl:gap-10'>
          <div ref={mapColRef} className='lg:self-start'>
            <div className='relative h-[min(36svh,280px)] overflow-hidden rounded-2xl border border-border/50 shadow-lg sm:h-[min(40svh,320px)] lg:h-[calc(100svh-4rem)]'>
              <LifeJourneyMap
                items={items}
                activeIndex={activeMapIndex}
                onSelectStop={goToIndex}
                className='h-full'
              />
              <JourneyMobileNav
                className='absolute bottom-3 left-3 right-3 z-10'
                activeIndex={activeMapIndex}
                total={mappedItems.length}
                label={activeCityLabel}
                onPrev={() => goToIndex(activeMapIndex - 1)}
                onNext={() => goToIndex(activeMapIndex + 1)}
              />
            </div>

            <JourneyMobileCarousel
              item={activeMappedItem ?? null}
              displayIndex={activeDisplayIndex >= 0 ? activeDisplayIndex : 0}
              total={items.length}
            />
          </div>

          <div ref={storyRef} className='hidden lg:block'>
            <div className='relative'>
              <div className='absolute bottom-0 left-4 top-0 w-px bg-border/50' aria-hidden />

              {items.map((item, index) => {
                const mapIndex = mappedItems.findIndex(j => j._key === item._key);
                const isActive = mapIndex === activeMapIndex;

                return (
                  <article
                    key={item._key}
                    data-journey-step
                    data-map-index={mapIndex}
                    className={cn(
                      'relative min-h-[46svh] py-10 pl-8',
                      mapIndex >= 0 && !isActive && 'opacity-55',
                    )}
                    id={`journey-${item._key}`}
                  >
                    <span
                      className={cn(
                        'absolute left-0 top-10 size-2.5 -translate-x-1/2 rounded-full',
                        isActive
                          ? 'bg-accent ring-4 ring-accent-border shadow-sm shadow-accent/35'
                          : 'bg-border',
                      )}
                      aria-hidden
                    />

                    <JourneyCityCard
                      item={item}
                      index={index}
                      total={items.length}
                      isActive={isActive}
                    />
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
