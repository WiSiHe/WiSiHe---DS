'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

const fontFamilies = [
  {
    name: 'Oswald',
    role: 'Headings / Display',
    variable: '--font-oswald',
    class: 'font-serif',
    desc: 'Structural and condensed. Used for impact.',
  },
  {
    name: 'Inter',
    role: 'Body / UI',
    variable: '--font-inter',
    class: 'font-sans',
    desc: 'Neutral and legible. Used for everything else.',
  },
  {
    name: 'Geist Mono',
    role: 'Code / Data',
    variable: '--font-geist-mono',
    class: 'font-mono',
    desc: 'Technical and precise. Used for numbers and code.',
  },
];

const fontSizes = [
  { name: 'xs', value: '12px', class: 'text-xs' },
  { name: 'sm', value: '14px', class: 'text-sm' },
  { name: 'base', value: '16px', class: 'text-base' },
  { name: 'lg', value: '18px', class: 'text-lg' },
  { name: 'xl', value: '20px', class: 'text-xl' },
  { name: '2xl', value: '24px', class: 'text-2xl' },
  { name: '3xl', value: '30px', class: 'text-3xl' },
  { name: '4xl', value: '36px', class: 'text-4xl' },
  { name: '5xl', value: '48px', class: 'text-5xl' },
  { name: '6xl', value: '60px', class: 'text-6xl' },
];

const fontWeights = [
  { name: 'Light', value: '300', class: 'font-light' },
  { name: 'Normal', value: '400', class: 'font-normal' },
  { name: 'Medium', value: '500', class: 'font-medium' },
  { name: 'Semi Bold', value: '600', class: 'font-semibold' },
  { name: 'Bold', value: '700', class: 'font-bold' },
];

export default function TypographyPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className='min-h-screen bg-transparent py-12 px-4'>
      <div className='max-w-5xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-16'
        >
          <h1 className='text-4xl md:text-5xl font-bold font-serif text-foreground mb-4'>
            Typography
          </h1>
          <p className='text-lg text-foreground-subtle max-w-2xl leading-relaxed'>
            The distinct voice of our system comes from the interplay between condensed headlines
            and highly readable body text.
          </p>
        </motion.div>

        {/* Font Families */}
        <section className='mb-20'>
          <h2 className='text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border'>
            Typefaces
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {fontFamilies.map(font => (
              <motion.div
                key={font.name}
                whileHover={{ y: -2 }}
                className='bg-surface border border-border rounded-lg p-6 hover:border-accent transition-all duration-200 cursor-pointer group'
                onClick={() => copyToClipboard(font.variable)}
              >
                <div className='flex justify-between items-start mb-4'>
                  <span className='text-[10px] font-bold uppercase tracking-wider text-foreground-muted bg-surface-subtle px-2 py-1 rounded'>
                    {font.role}
                  </span>
                  {copied === font.variable && <FaCheck className='w-3 h-3 text-success' />}
                </div>

                <div className={`${font.class} text-4xl text-foreground mb-4`}>{font.name}</div>

                <p className='text-sm text-foreground-subtle leading-relaxed mb-4'>{font.desc}</p>
                <code className='text-[10px] font-mono text-foreground-muted group-hover:text-accent transition-colors'>
                  {font.variable}
                </code>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Hierarchy Example */}
        <section className='mb-20'>
          <h2 className='text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border'>
            Hierarchy
          </h2>
          <div className='bg-surface border border-border rounded-xl p-8 md:p-12 relative overflow-hidden'>
            <div className='max-w-2xl relative z-10 space-y-6'>
              <div>
                <span className='text-xs font-bold text-accent uppercase tracking-widest mb-2 block'>
                  Article
                </span>
                <h1 className='text-4xl md:text-6xl font-bold font-serif text-foreground leading-tight tracking-tight'>
                  Design Engineering
                </h1>
              </div>
              <h2 className='text-2xl md:text-3xl font-serif text-foreground/80 leading-tight'>
                The intersection of code, craft, and chaos.
              </h2>
              <p className='text-lg text-foreground-subtle leading-relaxed'>
                We believe that the best products are built when design and engineering share a
                common language. Tokens act as the translation layer, ensuring that intent is
                preserved from Figma to production.
              </p>
              <div className='bg-background/50 rounded-lg p-4 font-mono text-sm text-foreground border border-border/50 w-fit'>
                <span className='text-accent'>$</span> pnpm add @wisihe/tokens
              </div>
            </div>

            {/* Minimal decoration */}
            <div className='absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none' />
          </div>
        </section>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Scale */}
          <section>
            <h2 className='text-xl font-bold text-foreground mb-6'>Scale</h2>
            <div className='space-y-1'>
              {fontSizes.reverse().map(size => (
                <div
                  key={size.name}
                  className='p-3 py-4 flex items-baseline justify-between border-b border-border/50 hover:bg-surface-hover/50 group transition-colors cursor-pointer'
                  onClick={() => copyToClipboard(`text-${size.name}`)}
                >
                  <div className='flex items-baseline gap-4'>
                    <code className='w-16 text-xs text-foreground-muted'>text-{size.name}</code>
                    <span className={`${size.class} text-foreground truncate`}>Ag</span>
                  </div>
                  <span className='text-xs font-mono text-foreground-muted group-hover:text-accent transition-colors'>
                    {size.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Weights */}
          <section>
            <h2 className='text-xl font-bold text-foreground mb-6'>Weights</h2>
            <div className='space-y-1'>
              {fontWeights.map(weight => (
                <div
                  key={weight.name}
                  className='p-3 py-4 flex items-center justify-between border-b border-border/50 hover:bg-surface-hover/50 group transition-colors cursor-pointer'
                  onClick={() => copyToClipboard(weight.class)}
                >
                  <div className='flex items-baseline gap-4'>
                    <span className={`${weight.class} text-2xl text-foreground`}>Inter</span>
                    <span className='text-sm text-foreground-subtle'>{weight.name}</span>
                  </div>
                  <code className='text-xs font-mono text-foreground-muted group-hover:text-accent transition-colors'>
                    {weight.class}
                  </code>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
