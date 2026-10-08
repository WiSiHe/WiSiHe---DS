'use client';

import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { parseTldrToPortableText } from '@/lib/presentations/parseTldrToPortableText';
import type { PresentationSlide } from '@/lib/presentations/types';
import { GridBackground } from './GridBackground';
import { usePresentationLogic } from './hooks/usePresentationLogic';
import { PresentationControls } from './PresentationControls';
import { ScrollIndicator } from './ScrollIndicator';
import { ContentSlide } from './slides/ContentSlide';
import { SeparatorSlide } from './slides/SeparatorSlide';
import { TitleSlide } from './slides/TitleSlide';

type PresentationDeckProps = {
  scrollRoot: HTMLElement | null;
  slides: PresentationSlide[];
};

function CustomComponentPlaceholder({ slideData }: { slideData: PresentationSlide }) {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-center'>
      <p className='font-mono text-xs font-bold tracking-[0.25em] text-accent uppercase'>
        Interactive slide
      </p>
      <h2 className='max-w-3xl text-3xl font-black text-foreground md:text-5xl'>
        {slideData.title}
      </h2>
      <p className='max-w-xl text-foreground/60'>
        This slide uses a custom WebGL component. Open the 3D workshop route for the full
        experience.
      </p>
    </div>
  );
}

const PresentationDeck = memo(function PresentationDeck({
  scrollRoot,
  slides,
}: PresentationDeckProps) {
  const {
    currentSlide,
    showCategoryTransition,
    containerRef,
    slideRefs,
    handleScrollToTop,
    handlePrevSlide,
    handleNextSlide,
  } = usePresentationLogic({ slides, scrollRoot });

  const categoryTransitionContent = useMemo(() => {
    if (!showCategoryTransition || !slides[currentSlide]?.category) return null;
    return slides[currentSlide].category;
  }, [showCategoryTransition, slides, currentSlide]);

  return (
    <>
      <ScrollIndicator currentSlide={currentSlide} totalSlides={slides.length} />

      <AnimatePresence mode='wait' initial={false}>
        {categoryTransitionContent ? (
          <motion.div
            key={categoryTransitionContent}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className='pointer-events-none fixed top-16 left-1/2 z-50 -translate-x-1/2 md:top-24'
          >
            <div className='flex items-center gap-3 rounded-full border border-border bg-surface-elevated px-6 py-2.5 shadow-2xl'>
              <span className='relative flex h-2 w-2'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75' />
                <span className='relative inline-flex h-2 w-2 rounded-full bg-accent' />
              </span>
              <span className='text-[10px] font-medium tracking-widest text-foreground/90 uppercase'>
                {categoryTransitionContent}
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div aria-live='polite' aria-atomic='true' className='sr-only'>
        {slides[currentSlide]?.title ? (
          <span>
            Slide {currentSlide + 1} of {slides.length}: {slides[currentSlide].title}
          </span>
        ) : null}
      </div>

      <div ref={containerRef} className='relative w-full bg-background text-foreground'>
        <GridBackground fixed />

        {slides.map((slideData, index) => {
          const isNearViewport = Math.abs(index - currentSlide) <= 2;
          const slideKey = `${slideData.type}-${slideData.title || ''}-${index}`;
          const isCustomComponent = Boolean(slideData.customComponent);

          return (
            <div
              key={slideKey}
              ref={el => {
                slideRefs.current[index] = el;
              }}
              className={cn(
                'relative z-10 max-w-full shrink-0 snap-start overflow-hidden',
                isCustomComponent
                  ? 'h-[100dvh] w-full'
                  : 'flex h-[100dvh] w-full items-center justify-center px-6 pt-28 pb-6 md:px-12 md:pt-32 md:pb-12 lg:px-16 lg:pt-36 lg:pb-16',
              )}
              style={{
                contentVisibility: isNearViewport ? 'visible' : 'auto',
                contain: 'layout style paint',
                willChange: isNearViewport ? 'scroll-position' : 'auto',
              }}
            >
              {isCustomComponent ? (
                <CustomComponentPlaceholder slideData={slideData} />
              ) : (
                <div className='flex w-full max-w-full items-center justify-center overflow-hidden'>
                  {slideData.type === 'separator' ? <SeparatorSlide slideData={slideData} /> : null}
                  {slideData.type === 'title' ? <TitleSlide slideData={slideData} /> : null}
                  {slideData.type === 'content' ? (
                    <ContentSlide slideData={slideData} index={index} totalSlides={slides.length} />
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <PresentationControls
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onNext={handleNextSlide}
        onPrev={handlePrevSlide}
        onScrollToTop={handleScrollToTop}
        isVisible
      />
    </>
  );
});

type PresentationSlideDeckProps = {
  slides: PresentationSlide[] | null;
  tldr?: string | null;
  tldrPosition?: 'top' | 'bottom' | null;
};

export function PresentationSlideDeck({
  slides,
  tldr,
  tldrPosition = 'top',
}: PresentationSlideDeckProps) {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);

  const finalSlides = useMemo(() => {
    if (!slides?.length) return null;

    const list: PresentationSlide[] = [];
    const tldrSlide: PresentationSlide | null = tldr
      ? {
          title: 'TL;DR Summary 📝',
          type: 'content',
          content: parseTldrToPortableText(tldr),
          slideDesign: 'bold',
          category: 'Summary',
        }
      : null;

    const position = tldrPosition ?? 'top';

    const [firstSlide, ...restSlides] = slides;

    if (tldr && position === 'top' && tldrSlide && firstSlide) {
      list.push(firstSlide);
      list.push(tldrSlide);
      list.push(...restSlides);
    } else {
      list.push(...slides);
    }

    if (tldr && position === 'bottom' && tldrSlide) {
      list.push(tldrSlide);
    }

    return list;
  }, [slides, tldr, tldrPosition]);

  useEffect(() => {
    if (scrollRootRef.current) {
      setScrollRoot(scrollRootRef.current);
    }
  }, []);

  if (!finalSlides?.length) {
    return (
      <div className='flex h-full min-h-[50vh] items-center justify-center px-6 text-center text-foreground-muted'>
        This presentation has no published slides yet.
      </div>
    );
  }

  return (
    <div
      ref={scrollRootRef}
      className='presentation-scroll h-[100dvh] w-full touch-pan-y overflow-x-hidden overflow-y-auto overscroll-y-contain bg-background text-foreground snap-y snap-mandatory'
    >
      <PresentationDeck scrollRoot={scrollRoot} slides={finalSlides} />
    </div>
  );
}
