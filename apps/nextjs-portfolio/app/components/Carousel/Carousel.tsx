'use client';

import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react';
import React, { createContext, useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import type { JSX } from 'react';

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Avoid SSR mismatches by checking window width on the client side only
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  const scrollLeft = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }, []);

  const handleCardClose = useCallback(
    (index: number) => {
      if (carouselRef.current) {
        const cardWidth = isMobile ? 230 : 384; // (md:w-96)
        const gap = isMobile ? 4 : 8;
        const scrollPosition = (cardWidth + gap) * (index + 1);
        carouselRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
        setCurrentIndex(index);
      }
    },
    [isMobile],
  );

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto py-10 scroll-smooth [scrollbar-width:none]"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className="absolute right-0 z-10 h-auto w-[5%] overflow-hidden bg-gradient-to-l from-black/50 via-transparent to-transparent" />

          <div className="flex flex-row justify-start gap-4 pl-4 pointer-events-auto">
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: Math.min(0.1 * index, 0.5), // Cap delay at 0.5s for better performance
                    ease: 'easeOut',
                  },
                }}
                key={`card-${index}`}
                className="last:pr-[5%] overflow-clip rounded-3xl"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="relative z-10 flex items-center justify-center w-10 h-10 transition-colors duration-300 rounded-full cursor-pointer pointer-events-auto bg-primary disabled:opacity-50 hover:bg-primary-light"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <IconArrowNarrowLeft className="w-6 h-6 text-on-primary" />
          </button>
          <button
            className="relative z-10 flex items-center justify-center w-10 h-10 transition-colors duration-300 rounded-full cursor-pointer pointer-events-auto bg-primary disabled:opacity-50 hover:bg-primary-light"
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <IconArrowNarrowRight className="w-6 h-6 text-on-primary" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export default Carousel;
