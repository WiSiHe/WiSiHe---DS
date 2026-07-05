'use client';

import { IconArrowNarrowLeft, IconArrowNarrowRight, IconArrowRight } from '@tabler/icons-react';
import { Button } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import {
  printLandingItemVariants,
  staggerContainerVariants,
  useSectionReveal,
} from '@/lib/motion/sectionReveal';
import ShopPrintFrame from './ShopPrintFrame';
import {
  formatShopCount,
  getPaintingHref,
  getPaintingYear,
  getShopPaintingFormatLabel,
  getShopPaintingTags,
  type ShopPainting,
} from './shopTeaserShared';

type ShopPrintShowcaseProps = {
  paintings: ShopPainting[];
  forSaleCount: number;
  shopHref: string;
  linkLabel: string;
};

const RACK_ROTATIONS = [-2.5, 1.5, -1];

type ShopPrintFrameSize = 'hero' | 'duo-primary' | 'duo-secondary' | 'rack';

function ShopPrintLandingGroup({ children }: { children: ReactNode }) {
  const { reducedMotion, viewport } = useSectionReveal();

  return (
    <motion.div
      initial='hidden'
      whileInView='visible'
      viewport={viewport}
      variants={staggerContainerVariants(reducedMotion, 0.1)}
    >
      {children}
    </motion.div>
  );
}

function ShopAnimatedPrint({
  painting,
  priority,
  size,
  rotation,
  className,
}: {
  painting: ShopPainting;
  priority?: boolean;
  size: ShopPrintFrameSize;
  rotation: number;
  className?: string;
}) {
  const { reducedMotion } = useSectionReveal();

  return (
    <motion.div className={className} variants={printLandingItemVariants(rotation, reducedMotion)}>
      <ShopPrintFrame painting={painting} priority={priority} size={size} rotation={0} />
    </motion.div>
  );
}

function ShopPrintMeta({
  painting,
  index,
  total,
}: {
  painting: ShopPainting;
  index: number;
  total: number;
}) {
  const title = painting.title?.trim() || 'Untitled';
  const year = getPaintingYear(painting.paintedAt);
  const formatLabel = getShopPaintingFormatLabel(painting);
  const tags = getShopPaintingTags(painting);

  return (
    <div className='mx-auto min-h-[9.5rem] w-full max-w-lg text-center md:max-w-none md:text-left'>
      <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground-subtle'>
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </p>
      <h3 className='mt-2 font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
        {title}
      </h3>
      <p className='mt-2 text-sm text-foreground-subtle'>
        {[year, formatLabel].filter(Boolean).join(' · ')}
      </p>
      {tags.length > 0 ? (
        <ul className='mt-3 flex flex-wrap justify-center gap-2 md:justify-start' aria-label='Tags'>
          {tags.map(tag => (
            <li
              key={tag}
              className='rounded-full border border-border/60 bg-surface/70 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-foreground-subtle'
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
      <Link
        href={getPaintingHref(painting.slug)}
        className='mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-hover'
      >
        View piece
        <IconArrowRight className='size-4' aria-hidden />
      </Link>
    </div>
  );
}

function ShopSinglePrint({ painting }: { painting: ShopPainting }) {
  return (
    <ShopPrintLandingGroup>
      <div className='flex flex-col items-center gap-8'>
        <ShopAnimatedPrint painting={painting} priority size='hero' rotation={-1.5} />
        <ShopPrintMeta painting={painting} index={0} total={1} />
      </div>
    </ShopPrintLandingGroup>
  );
}

function ShopDuoPrints({ paintings }: { paintings: ShopPainting[] }) {
  const primary = paintings[0];
  const secondary = paintings[1];
  if (!primary || !secondary) return null;

  return (
    <ShopPrintLandingGroup>
      <div className='mx-auto flex max-w-md flex-col gap-10 md:max-w-none'>
        <div className='relative mx-auto h-[min(58svh,440px)] w-full max-w-sm md:max-w-md'>
          <ShopAnimatedPrint
            painting={primary}
            priority
            size='duo-primary'
            rotation={-3.5}
            className='absolute left-0 top-2 z-10 md:left-4'
          />
          <ShopAnimatedPrint
            painting={secondary}
            size='duo-secondary'
            rotation={2.5}
            className='absolute bottom-0 right-0 z-20 md:right-4'
          />
        </div>

        <ul className='grid gap-8 md:grid-cols-2'>
          {paintings.map((painting, index) => (
            <li key={painting._id}>
              <ShopPrintMeta painting={painting} index={index} total={paintings.length} />
            </li>
          ))}
        </ul>
      </div>
    </ShopPrintLandingGroup>
  );
}

function ShopPrintRack({ paintings }: { paintings: ShopPainting[] }) {
  const { reducedMotion, viewport } = useSectionReveal();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: false,
    dragFree: false,
    containScroll: 'trimSnaps',
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const activePainting = paintings[selectedIndex] ?? paintings[0];

  return (
    <div className='flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-center lg:gap-12 xl:gap-16'>
      <div className='relative select-none'>
        <div className='overflow-hidden touch-pan-x py-1' ref={emblaRef}>
          <motion.div
            className='flex gap-4 md:gap-6'
            initial='hidden'
            whileInView='visible'
            viewport={viewport}
            variants={staggerContainerVariants(reducedMotion, 0.1)}
          >
            {paintings.map((painting, index) => (
              <ShopAnimatedPrint
                key={painting._id}
                painting={painting}
                priority={index === 0}
                size='rack'
                rotation={RACK_ROTATIONS[index % RACK_ROTATIONS.length] ?? 0}
              />
            ))}
          </motion.div>
        </div>

        {paintings.length > 1 ? (
          <div className='mt-6 flex items-center justify-center gap-3 md:justify-start'>
            <Button
              type='button'
              variant='secondary'
              size='icon'
              className='size-9 rounded-full'
              Icon={IconArrowNarrowLeft}
              aria-label='Previous print'
              onClick={scrollPrev}
              isDisabled={!canScrollPrev}
            />
            <div className='flex gap-1.5' role='tablist' aria-label='Print selection'>
              {paintings.map((painting, index) => (
                <button
                  key={painting._id}
                  type='button'
                  role='tab'
                  aria-selected={index === selectedIndex}
                  aria-label={`Show print ${index + 1}: ${painting.title ?? 'Untitled'}`}
                  className={cn(
                    'h-1.5 rounded-full transition-[width,background-color] duration-200',
                    index === selectedIndex
                      ? 'w-8 bg-accent'
                      : 'w-1.5 bg-border hover:bg-foreground-muted/50',
                  )}
                  onClick={() => scrollTo(index)}
                />
              ))}
            </div>
            <Button
              type='button'
              variant='secondary'
              size='icon'
              className='size-9 rounded-full'
              Icon={IconArrowNarrowRight}
              aria-label='Next print'
              onClick={scrollNext}
              isDisabled={!canScrollNext}
            />
          </div>
        ) : null}
      </div>

      {activePainting ? (
        <ShopPrintMeta painting={activePainting} index={selectedIndex} total={paintings.length} />
      ) : null}
    </div>
  );
}

export default function ShopPrintShowcase({
  paintings,
  forSaleCount,
  shopHref,
  linkLabel,
}: ShopPrintShowcaseProps) {
  const layoutMode = paintings.length === 1 ? 'single' : paintings.length === 2 ? 'duo' : 'rack';

  return (
    <div className='relative'>
      <div
        className='pointer-events-none absolute inset-0 bg-linear-to-br from-accent/6 via-transparent to-surface/30'
        aria-hidden
      />

      <div className='relative z-10 pt-2 md:pt-0'>
        {layoutMode === 'single' && paintings[0] ? (
          <ShopSinglePrint painting={paintings[0]} />
        ) : null}
        {layoutMode === 'duo' ? <ShopDuoPrints paintings={paintings} /> : null}
        {layoutMode === 'rack' ? <ShopPrintRack paintings={paintings} /> : null}
      </div>

      <div className='relative z-10 mt-10 flex flex-col items-center gap-4 border-t border-border/15 pt-8 md:mt-12 md:flex-row md:justify-between'>
        <p className='text-center text-sm text-foreground-subtle md:text-left'>
          {formatShopCount(forSaleCount)} available through print-on-demand partners.
        </p>
        <Button
          as={Link}
          href={shopHref}
          variant='primary'
          size='large'
          Icon={IconArrowRight}
          iconPosition='right'
          className='w-full rounded-full sm:w-auto'
        >
          {linkLabel}
        </Button>
      </div>
    </div>
  );
}
