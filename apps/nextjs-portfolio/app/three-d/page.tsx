'use client';

import { useRef } from 'react';
import { motion } from 'motion/react';
import { ThreeDHero } from '../components/ThreeD/ThreeDHero';
import { IntroPresentation } from '../components/ThreeD/IntroPresentation';
import { TechnicalDeck } from '../components/ThreeD/Technical/TechnicalDeck';
import { SourcesSection } from '../components/ThreeD/SourcesSection';
import { GridBackground } from '../components/ThreeD/GridBackground';
import { StructuredData } from '../components/ThreeD/StructuredData';

export default function ThreeDSlideDeck() {
  const technicalDeckRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <StructuredData />
      <main
        className="w-full h-screen overflow-y-scroll snap-y snap-mandatory bg-background text-foreground overflow-x-hidden max-w-full"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Hero Section with Spline Viewer */}
        <ThreeDHero />

        {/* Intro Presentation Section */}
        <div className="snap-start h-screen shrink-0">
          <IntroPresentation technicalDeckRef={technicalDeckRef} />
        </div>
        {/* Separator Section */}
        <section
          aria-label="Transition to technical content"
          className="snap-start h-screen w-full flex flex-col items-center justify-center pt-28 md:pt-32 lg:pt-36 relative overflow-hidden bg-linear-to-b from-background via-surface/20 to-background shrink-0"
        >
          <GridBackground />

          {/* Decorative Lines */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-px bg-accent opacity-30" />

          {/* Content */}
          <div className="relative z-10 text-center space-y-6 px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-4 mb-4"
            >
              <div className="h-px w-16 bg-accent/50" />
              <div className="h-2 w-2 rounded-full bg-accent" />
              <div className="h-px w-16 bg-accent/50" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground uppercase tracking-tight"
            >
              Now for the
              <br />
              <span className="text-accent">Technical Part</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto"
            >
              Let's dive into how Three.js works and build something interactive
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center gap-4 mt-8"
            >
              <div className="h-px w-16 bg-accent/50" />
              <div className="h-2 w-2 rounded-full bg-accent" />
              <div className="h-px w-16 bg-accent/50" />
            </motion.div>
          </div>

          {/* Bottom decorative element */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl"
            >
              ↓
            </motion.div>
          </div>
        </section>
        {/* Technical Deck Section */}
        <div ref={technicalDeckRef}>
          <TechnicalDeck />
        </div>
        {/* Sources Section */}
        <SourcesSection />
      </main>
    </>
  );
}
