'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

// TypeScript declaration for the Spline viewer web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': {
        url: string;
        style?: React.CSSProperties;
        className?: string;
      };
    }
  }
}

export function ThreeDHero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Check if the custom element is already defined
    if (globalThis.window !== undefined && customElements.get('spline-viewer')) {
      setIsLoaded(true);
      return;
    }

    // Load the Spline viewer script as an ES module
    if (globalThis.window !== undefined && !scriptLoadedRef.current) {
      scriptLoadedRef.current = true;
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.12.33/build/spline-viewer.js';
      script.onload = () => {
        // Wait a bit for the custom element to be registered
        setTimeout(() => {
          if (customElements.get('spline-viewer')) {
            setIsLoaded(true);
          }
        }, 100);
      };
      script.onerror = () => {
        console.error('Failed to load Spline viewer');
        scriptLoadedRef.current = false;
      };
      document.head.appendChild(script);

      return () => {
        // Cleanup on unmount
        script.remove();
        scriptLoadedRef.current = false;
      };
    }
  }, []);

  return (
    <section
      className="snap-start h-screen w-full relative overflow-hidden bg-background flex items-center shrink-0"
      aria-label="3D Hero Section"
    >
      {/* Two-column layout: Text on left, 3D model on right */}
      <div className="w-full h-full flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-16 max-w-7xl mx-auto gap-8 lg:gap-12">
        {/* Left Side - Text Content (Left-aligned) */}
        <div className="flex-1 lg:w-1/2 flex flex-col justify-center items-start text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 w-full"
          >
            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-tight">
              Houston, we're coding 3D! 🚀
            </h1>

            {/* Subtitle */}
            <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white">
              Does Three.js have to be rocket science in 2026?
            </p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 flex flex-col items-start gap-4"
          >
            <div className="h-px w-16 bg-accent/50" />
            <div className="text-sm font-mono text-accent uppercase tracking-wider">
              Scroll to explore
            </div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-2xl text-accent"
            >
              ↓
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full h-full absolute inset-0"
        >
          {/* @ts-expect-error - spline-viewer is a custom web component */}
          <spline-viewer
            url="https://prod.spline.design/5dGiBg0kllGtEOHL/scene.splinecode"
            style={{
              width: '100%',
              height: '100%',
              pointerEvents: 'auto',
            }}
            className="w-full h-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
