'use client';

import { motion } from 'motion/react';
import { GridBackground } from './GridBackground';

export function TechnicalSeparator({ ref }: Readonly<{ ref?: React.Ref<HTMLElement> }>) {
  return (
    <section
      id="technical"
      ref={ref}
      aria-label="Transition to technical content"
      className="snap-start h-screen w-full flex flex-col items-center justify-center pt-28 md:pt-32 lg:pt-36 relative overflow-hidden bg-linear-to-b from-background via-surface/20 to-background shrink-0"
    >
      <GridBackground />

      {/* Decorative Lines */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-px bg-accent opacity-30" />

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center justify-center p-4 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-md mb-6"
        >
          <div className="h-3 w-3 rounded-full bg-accent animate-pulse" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]"
        >
          Now for the
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent/50">
            Technical Part
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl font-light text-white/70 max-w-2xl mx-auto tracking-wide"
        >
          Understanding what makes 3D on the web tick.
        </motion.p>
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
  );
}
