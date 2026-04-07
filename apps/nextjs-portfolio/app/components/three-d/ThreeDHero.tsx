'use client';

import { motion } from 'motion/react';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

export function ThreeDHero() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldLoadSpline, setShouldLoadSpline] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Track visibility to optimize Spline viewer - load when visible, unload when not
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        const visible = (entry?.isIntersecting ?? false) && (entry?.intersectionRatio ?? 0) > 0.1;
        setIsVisible(visible);
        // Load Spline when section becomes visible for the first time
        if (visible && !shouldLoadSpline) {
          setShouldLoadSpline(true);
        }
        // Unload Spline when section is completely out of view (to save resources)
        // Only unload if it was previously loaded and now completely out of view
        if (!visible && shouldLoadSpline && (entry?.intersectionRatio ?? 0) === 0) {
          setShouldLoadSpline(false);
        }
      },
      { threshold: [0, 0.1, 0.5, 1], rootMargin: '100px' },
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [shouldLoadSpline]);

  return (
    <section
      ref={sectionRef}
      className='snap-start h-screen w-full relative overflow-hidden bg-black flex items-center shrink-0 z-10'
      aria-label='3D Hero Section'
    >
      {shouldLoadSpline && (
        <Script
          type='module'
          src='https://unpkg.com/@splinetool/viewer@1.12.36/build/spline-viewer.js'
        />
      )}

      {/* Two-column layout: Text on left, 3D model on right */}
      <div className='w-full h-full flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-16 max-w-7xl mx-auto gap-8 lg:gap-12'>
        {/* Left Side - Text Content (Left-aligned) */}
        <div className='flex-1 lg:w-1/2 flex flex-col justify-center items-start text-left z-10'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='space-y-6 w-full'
          >
            {/* Title */}
            <h1 className='text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-tight'>
              Houston, we're coding 3D! 🚀
            </h1>

            {/* Subtitle */}
            <p className='text-2xl md:text-3xl lg:text-4xl font-semibold text-white'>
              Does Three.js have to be rocket science in 2026?
            </p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className='mt-12 flex flex-col items-start gap-4'
          >
            <div className='h-px w-16 bg-accent/50' />
            <div className='text-sm font-mono text-accent uppercase tracking-wider'>
              Scroll to explore
            </div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className='text-2xl text-accent'
            >
              ↓
            </motion.div>
          </motion.div>
        </div>

        {shouldLoadSpline && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isVisible ? 1 : 0.3, scale: 1 }}
            transition={{ duration: 0.5 }}
            className='w-full h-full absolute inset-0 pointer-events-none'
            style={{
              pointerEvents: isVisible ? 'auto' : 'none',
              transition: 'opacity 0.3s ease-out',
            }}
          >
            {/* @ts-ignore */}
            <spline-viewer
              loading-anim-type='spinner-small-dark'
              url='https://prod.spline.design/5dGiBg0kllGtEOHL/scene.splinecode'
              style={{
                width: '100%',
                height: '100%',
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
              className='w-full h-full'
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
