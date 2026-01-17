'use client';

import { motion } from 'motion/react';
import { GridBackground } from './GridBackground';

export function TechnicalSeparator({ ref }: Readonly<{ ref?: React.Ref<HTMLElement> }>) {
  return (
    <section
      id="technical"
      ref={ref}
      aria-label="Transition to technical content"
      className="snap-start h-screen w-full flex flex-col items-center justify-center pt-24 md:pt-28 lg:pt-32 relative overflow-hidden bg-background shrink-0"
    >
      <GridBackground />

      {/* Bold Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 md:h-3 bg-accent" />

      {/* Bold Bottom Accent Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-2 md:h-3 bg-accent" />

      {/* Bold Horizontal Line */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-accent/40" />

      {/* Bold Vertical Accent Lines */}
      <div className="absolute top-0 bottom-0 left-8 md:left-16 lg:left-24 w-1 bg-accent/30" />
      <div className="absolute top-0 bottom-0 right-8 md:right-16 lg:right-24 w-1 bg-accent/30" />

      {/* Content */}
      <div className="relative z-10 text-center space-y-10 md:space-y-12 lg:space-y-16 px-4 md:px-6 lg:px-8">
        {/* Bold Icon Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center p-5 md:p-6 rounded-full bg-accent border-2 border-accent shadow-lg shadow-accent/50 mb-8 md:mb-10"
        >
          <div className="h-4 w-4 md:h-5 md:w-5 rounded-full bg-background" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, type: 'spring', stiffness: 100 }}
          className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-foreground uppercase tracking-tighter leading-[0.85] mb-6 md:mb-8"
        >
          Now for the
          <br />
          <span className="text-accent drop-shadow-lg">
            Technical Part
          </span>
        </motion.h2>

        {/* Bold Divider Line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-1 w-32 md:w-48 bg-accent mx-auto"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground/90 max-w-2xl mx-auto tracking-tight mt-6 md:mt-8"
        >
          Understanding what makes 3D on the web tick.
        </motion.p>
      </div>

      {/* Bold Bottom Arrow */}
      <div className="absolute bottom-16 md:bottom-20 lg:bottom-24 left-1/2 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-5xl md:text-6xl font-black text-accent"
        >
          ↓
        </motion.div>
      </div>
    </section>
  );
}
