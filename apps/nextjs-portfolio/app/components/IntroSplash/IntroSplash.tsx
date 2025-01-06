'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const slides = [
  {
    id: 'name',
    background: '/images/winter.jpg',
    content: 'Henrik Wilhelm Sissener',
    animation: {
      initial: { scale: 0.5 },
      animate: {
        scale: 1,
        y: 0,
      },
      exit: { y: -1000 },
    },
  },
  {
    id: 'norway',
    background: '/images/hell.jpg',
    content: 'From Norway',
    animation: {
      initial: { y: 1000, x: 0 },
      animate: { y: 0, x: 0 },
      exit: { y: 0, x: -1000 },
    },
  },
  {
    id: 'frontend',
    background: '/images/cloud.jpg',
    content: 'Senior Frontend Developer',
    animation: {
      initial: { y: -1000 },
      animate: { y: 0, x: 0 },
      exit: { x: 1000 },
    },
  },
  {
    id: 'artist',
    background: '/images/space.jpg',
    content: 'Digital Artist',
    animation: {
      initial: { x: -1000 },
      animate: { x: 0 },
      exit: { x: 1000 },
    },
  },
  {
    id: 'game developer',
    background: '/images/hell.jpg',
    content: 'Game Developer',
    animation: {
      initial: { x: 1000 },
      animate: { x: 0 },
      exit: { x: -1000 },
    },
  },
  {
    id: 'tagline',
    background: '/images/celestial.jpg',
    content: 'Crafting experiences at the intersection of code & art.',
    animation: {
      initial: { x: 1000 },
      animate: { x: 0, scale: 1 },
      exit: { y: -1000, scale: 0.4 },
    },
  },
];

export default function IntroSplash() {
  const [step, setStep] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const totalSlides = slides.length;
    const slideDuration = 3500; // 3.5 seconds per slide for readability

    if (step < totalSlides) {
      const timer = setTimeout(() => setStep(step + 1), slideDuration);
      return () => clearTimeout(timer);
    } else {
      const fadeOutTimer = setTimeout(() => setShowSplash(false), 1000);
      return () => clearTimeout(fadeOutTimer);
    }
  }, [step]);

  const currentSlide = slides[step];

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 1000 }}
        >
          <AnimatePresence mode="popLayout">
            {currentSlide && (
              <motion.div
                key={currentSlide.id}
                className="absolute inset-0 flex items-center justify-center scale-105"
                style={{
                  backgroundImage: `url(${currentSlide.background})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                initial={currentSlide.animation.initial}
                animate={currentSlide.animation.animate}
                exit={currentSlide.animation.exit}
                trasition={{ type: 'spring', duration: 1.5 }}
              >
                <div className="fixed inset-0 flex items-center justify-center p-4">
                  {/* <div className="relative flex items-center justify-center p-6 bg-black rounded-lg shadow-lg bg-opacity-70"> */}
                  <motion.div
                    className="text-2xl font-bold text-center text-white sm:text-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    // initial={currentSlide.animation.initial}
                    // animate={currentSlide.animation.animate}
                    // exit={currentSlide.animation.exit}
                  >
                    {currentSlide.content}
                  </motion.div>
                  {/* </div> */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
