'use client';

import { motion } from 'motion/react';
import { HiCodeBracket } from 'react-icons/hi2';
import DecryptedText from './Common/DecryptedText';
import RippleGrid from './Common/RippleGrid';

export function TechnicalSeparator({ ref }: Readonly<{ ref?: React.Ref<HTMLElement> }>) {
  return (
    <section
      id='technical'
      ref={ref}
      aria-label='Transition to technical content'
      className='snap-start h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-background shrink-0'
    >
      {/* Dynamic Ripple Grid Background */}
      <div className='absolute inset-0 opacity-40'>
        <RippleGrid
          gridColor='var(--color-accent)'
          gridSize={12}
          gridThickness={20}
          rippleIntensity={0.08}
          glowIntensity={0}
          mouseInteractionRadius={1.5}
        />
      </div>

      {/* Heavy Mechanical Accent Bars */}
      <div className='absolute top-0 left-0 right-0 h-2 md:h-3 bg-accent opacity-50' />
      <div className='absolute bottom-0 left-0 right-0 h-2 md:h-3 bg-accent opacity-50' />

      {/* Background Text Backdrop (Outline) */}
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden'>
        <motion.span
          initial={{ opacity: 0, scale: 1.2 }}
          whileInView={{ opacity: 0.05, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className='text-[35vw] font-black text-foreground uppercase tracking-tighter leading-none italic'
          style={{ WebkitTextStroke: '1px currentColor', color: 'transparent' }}
        >
          CODE
        </motion.span>
      </div>

      {/* Content */}
      <div className='relative z-30 flex flex-col items-center px-6 text-center w-full max-w-7xl'>
        {/* Technical Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring' }}
          className='group relative mb-8 md:mb-12'
        >
          <div className='relative flex flex-col items-center'>
            <div className='p-4 md:p-6 rounded-2xl bg-surface-elevated border border-border shadow-2xl flex items-center justify-center text-accent'>
              <HiCodeBracket className='w-10 h-10 md:w-14 md:h-14' />
            </div>
            <div className='mt-4 px-6 py-1 bg-accent text-accent-contrast text-[11px] font-black uppercase tracking-[0.4em] rounded-full shadow-sm'>
              <DecryptedText text='SYSTEM READY' animateOn='view' speed={40} sequential={true} />
            </div>
          </div>
        </motion.div>

        {/* Massive Typography */}
        <div className='space-y-0 md:-space-y-4'>
          <div className='overflow-hidden'>
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className='text-6xl sm:text-7xl md:text-9xl lg:text-[11rem] xl:text-[13rem] font-black text-foreground uppercase tracking-tighter leading-[0.85] antialiased'
            >
              TECHNICAL
            </motion.h2>
          </div>

          <div className='overflow-hidden'>
            <motion.h2
              initial={{ y: '-100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className='text-6xl sm:text-7xl md:text-9xl lg:text-[11rem] xl:text-[13rem] font-black uppercase tracking-tighter leading-[0.85] antialiased'
              style={{ WebkitTextStroke: '2px var(--color-foreground)', color: 'transparent' }}
            >
              SHOWCASE
            </motion.h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className='mt-12 md:mt-20 flex flex-col items-center'
        >
          <div className='flex items-center gap-4 mb-4'>
            <div className='h-px w-12 md:w-24 bg-border' />
            <p className='text-sm md:text-lg font-mono tracking-[0.2em] text-accent uppercase'>
              Architecture & Performance
            </p>
            <div className='h-px w-12 md:w-24 bg-border' />
          </div>
          <p className='text-lg md:text-2xl font-medium text-foreground/60 max-w-2xl mx-auto tracking-tight'>
            Transitioning to the structural implementation details.
          </p>
        </motion.div>
      </div>

      {/* Animated Down Arrow / Progress Line */}
      <motion.div
        animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className='absolute right-8 md:right-12 w-[1px] bg-accent/40'
      />

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className='absolute bottom-12 text-accent/60'
      >
        <div className='flex flex-col items-center gap-2'>
          <span className='text-[10px] font-black tracking-[0.3em] uppercase opacity-40'>
            Scroll
          </span>
          <div className='w-[1px] h-12 bg-accent/50' />
        </div>
      </motion.div>
    </section>
  );
}
