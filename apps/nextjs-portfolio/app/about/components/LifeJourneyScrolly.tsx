'use client';

import { useGSAP } from '@gsap/react';
import { cn } from '@wisihe/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import { useRef, useState } from 'react';
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

export function LifeJourneyScrolly({ items }: LifeJourneyScrollyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMapIndex, setActiveMapIndex] = useState(0);
  const mappedItems = getJourneyItemsWithCoordinates(items);

  useGSAP(
    () => {
      const sections = gsap.utils.toArray<HTMLElement>('[data-journey-step]');
      sections.forEach(section => {
        const mapIndex = Number(section.dataset.mapIndex ?? -1);

        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            if (mapIndex >= 0) setActiveMapIndex(mapIndex);
          },
          onEnterBack: () => {
            if (mapIndex >= 0) setActiveMapIndex(mapIndex);
          },
        });

        const text = section.querySelector('[data-journey-text]');
        const media = section.querySelector('[data-journey-media]');

        if (text) {
          gsap.from(text, {
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          });
        }

        if (media) {
          gsap.from(media, {
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            y: 24,
            opacity: 0,
            scale: 0.96,
            duration: 0.9,
            ease: 'power3.out',
            delay: 0.1,
          });
        }
      });
    },
    { scope: containerRef, dependencies: [items.length] },
  );

  if (!items.length) return null;

  return (
    <section
      ref={containerRef}
      className='relative border-t border-border/40 bg-background'
      aria-label='Life journey map story'
    >
      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 lg:px-12 lg:py-24'>
        <div className='mb-12 max-w-2xl space-y-4'>
          <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
            Life map
          </p>
          <h2 className='font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl'>
            Places that shaped me
          </h2>
          <p className='text-lg text-foreground-subtle text-pretty'>
            Scroll through chapters of my life — from where I grew up, studied, and built a career,
            to the trips that still fuel my curiosity.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8'>
          <div className='lg:col-span-5 lg:sticky lg:top-24 lg:self-start'>
            <div className='h-[42vh] min-h-[280px] lg:h-[calc(100vh-8rem)]'>
              <LifeJourneyMap
                items={items}
                activeIndex={activeMapIndex}
                className='border border-border/50 shadow-2xl shadow-accent/5'
              />
            </div>
            {mappedItems.length > 0 ? (
              <p className='mt-4 text-center text-xs text-foreground-muted lg:text-left'>
                {activeMapIndex + 1} of {mappedItems.length} stops on the map
              </p>
            ) : (
              <p className='mt-4 text-sm text-foreground-muted'>
                Add coordinates to journey chapters in Sanity to enable the map fly-through.
              </p>
            )}
          </div>

          <div className='space-y-16 lg:col-span-7 lg:space-y-24'>
            {items.map((item, index) => {
              const meta = getLocationMeta(item.locationType);
              const imageUrl = item.image
                ? urlForImage(item.image)?.width(900).quality(80).url()
                : null;

              return (
                <article
                  key={item._key}
                  data-journey-step
                  data-map-index={getJourneyItemsWithCoordinates(items).findIndex(
                    j => j._key === item._key,
                  )}
                  className='min-h-[50vh] flex flex-col justify-center'
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
                      className='mt-8 relative aspect-[16/10] max-w-xl overflow-hidden rounded-2xl border border-border/50 shadow-lg'
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
                    <div className='mt-10 h-px w-full max-w-xl bg-gradient-to-r from-border via-accent/30 to-transparent' />
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
