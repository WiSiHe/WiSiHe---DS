'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

type ColorScale = {
  name: string;
  colors: { name: string; value: string }[];
};

const numericScales: ColorScale[] = [
  {
    name: 'Neutral',
    colors: [
      { name: 'neutral-50', value: 'var(--color-neutral-50)' },
      { name: 'neutral-100', value: 'var(--color-neutral-100)' },
      { name: 'neutral-200', value: 'var(--color-neutral-200)' },
      { name: 'neutral-300', value: 'var(--color-neutral-300)' },
      { name: 'neutral-400', value: 'var(--color-neutral-400)' },
      { name: 'neutral-500', value: 'var(--color-neutral-500)' },
      { name: 'neutral-600', value: 'var(--color-neutral-600)' },
      { name: 'neutral-700', value: 'var(--color-neutral-700)' },
      { name: 'neutral-800', value: 'var(--color-neutral-800)' },
      { name: 'neutral-900', value: 'var(--color-neutral-900)' },
      { name: 'neutral-950', value: 'var(--color-neutral-950)' },
    ],
  },
  {
    name: 'Neon Pink (Accent)',
    colors: [
      { name: 'neon-pink-50', value: 'var(--color-neon-pink-50)' },
      { name: 'neon-pink-100', value: 'var(--color-neon-pink-100)' },
      { name: 'neon-pink-200', value: 'var(--color-neon-pink-200)' },
      { name: 'neon-pink-300', value: 'var(--color-neon-pink-300)' },
      { name: 'neon-pink-400', value: 'var(--color-neon-pink-400)' },
      { name: 'neon-pink-500', value: 'var(--color-neon-pink-500)' },
      { name: 'neon-pink-600', value: 'var(--color-neon-pink-600)' },
      { name: 'neon-pink-700', value: 'var(--color-neon-pink-700)' },
      { name: 'neon-pink-800', value: 'var(--color-neon-pink-800)' },
      { name: 'neon-pink-900', value: 'var(--color-neon-pink-900)' },
      { name: 'neon-pink-950', value: 'var(--color-neon-pink-950)' },
    ],
  },
  {
    name: 'Neon Yellow (Dark Mode Accent)',
    colors: [
      { name: 'neon-yellow-50', value: 'var(--color-neon-yellow-50)' },
      { name: 'neon-yellow-100', value: 'var(--color-neon-yellow-100)' },
      { name: 'neon-yellow-200', value: 'var(--color-neon-yellow-200)' },
      { name: 'neon-yellow-300', value: 'var(--color-neon-yellow-300)' },
      { name: 'neon-yellow-400', value: 'var(--color-neon-yellow-400)' },
      { name: 'neon-yellow-500', value: 'var(--color-neon-yellow-500)' },
      { name: 'neon-yellow-600', value: 'var(--color-neon-yellow-600)' },
      { name: 'neon-yellow-700', value: 'var(--color-neon-yellow-700)' },
      { name: 'neon-yellow-800', value: 'var(--color-neon-yellow-800)' },
      { name: 'neon-yellow-900', value: 'var(--color-neon-yellow-900)' },
      { name: 'neon-yellow-950', value: 'var(--color-neon-yellow-950)' },
    ],
  },
  {
    name: 'Neon Orange (Light Mode Accent)',
    colors: [
      { name: 'neon-orange-50', value: 'var(--color-neon-orange-50)' },
      { name: 'neon-orange-100', value: 'var(--color-neon-orange-100)' },
      { name: 'neon-orange-200', value: 'var(--color-neon-orange-200)' },
      { name: 'neon-orange-300', value: 'var(--color-neon-orange-300)' },
      { name: 'neon-orange-400', value: 'var(--color-neon-orange-400)' },
      { name: 'neon-orange-500', value: 'var(--color-neon-orange-500)' },
      { name: 'neon-orange-600', value: 'var(--color-neon-orange-600)' },
      { name: 'neon-orange-700', value: 'var(--color-neon-orange-700)' },
      { name: 'neon-orange-800', value: 'var(--color-neon-orange-800)' },
      { name: 'neon-orange-900', value: 'var(--color-neon-orange-900)' },
      { name: 'neon-orange-950', value: 'var(--color-neon-orange-950)' },
    ],
  },
  {
    name: 'Brand 1 (Blue)',
    colors: [
      { name: 'brand-1-50', value: 'var(--color-brand-1-50)' },
      { name: 'brand-1-100', value: 'var(--color-brand-1-100)' },
      { name: 'brand-1-200', value: 'var(--color-brand-1-200)' },
      { name: 'brand-1-300', value: 'var(--color-brand-1-300)' },
      { name: 'brand-1-400', value: 'var(--color-brand-1-400)' },
      { name: 'brand-1-500', value: 'var(--color-brand-1-500)' },
      { name: 'brand-1-600', value: 'var(--color-brand-1-600)' },
      { name: 'brand-1-700', value: 'var(--color-brand-1-700)' },
      { name: 'brand-1-800', value: 'var(--color-brand-1-800)' },
      { name: 'brand-1-900', value: 'var(--color-brand-1-900)' },
      { name: 'brand-1-950', value: 'var(--color-brand-1-950)' },
    ],
  },
];

const semanticGroups = [
  {
    category: 'Surface',
    description: 'Backgrounds and containers.',
    colors: [
      {
        name: 'background',
        class: 'bg-background',
        var: 'var(--color-background)',
        desc: 'Page base',
      },
      {
        name: 'background-subtle',
        class: 'bg-background-subtle',
        var: 'var(--color-background-subtle)',
        desc: 'Secondary base',
      },
      {
        name: 'surface',
        class: 'bg-surface',
        var: 'var(--color-surface)',
        desc: 'Card background',
      },
      {
        name: 'surface-hover',
        class: 'bg-surface-hover',
        var: 'var(--color-surface-hover)',
        desc: 'Interactive surface',
      },
    ],
  },
  {
    category: 'Typography',
    description: 'Content readability.',
    colors: [
      {
        name: 'foreground',
        class: 'text-foreground',
        bgClass: 'bg-foreground',
        var: 'var(--color-foreground)',
        desc: 'Primary text',
      },
      {
        name: 'foreground-subtle',
        class: 'text-foreground-subtle',
        bgClass: 'bg-foreground-subtle',
        var: 'var(--color-foreground-subtle)',
        desc: 'Secondary text',
      },
      {
        name: 'foreground-muted',
        class: 'text-foreground-muted',
        bgClass: 'bg-foreground-muted',
        var: 'var(--color-foreground-muted)',
        desc: 'Utility text',
      },
    ],
  },
  {
    category: 'Accent',
    description: 'Brand highlights.',
    colors: [
      { name: 'accent', class: 'bg-accent', var: 'var(--color-accent)', desc: 'Primary action' },
      {
        name: 'accent-hover',
        class: 'bg-accent-hover',
        var: 'var(--color-accent-hover)',
        desc: 'Action hover',
      },
      {
        name: 'accent-contrast',
        class: 'bg-accent-contrast',
        var: 'var(--color-accent-contrast)',
        desc: 'Text on accent',
      },
      {
        name: 'accent-border',
        class: 'border-accent-border',
        bgClass: 'bg-accent-border',
        var: 'var(--color-accent-border)',
        desc: 'Focus/Highlight',
      },
    ],
  },
];

export default function ColorsPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string, colorName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(colorName);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className='min-h-screen bg-transparent py-12 px-4'>
      <div className='max-w-5xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-12'
        >
          <h1 className='text-4xl md:text-5xl font-bold font-serif text-foreground mb-4'>Colors</h1>
          <p className='text-lg text-foreground-subtle max-w-2xl leading-relaxed'>
            The color system uses semantic tokens to ensure accessible contrast across themes,
            backed by a set of numeric primitive scales.
          </p>
        </motion.div>

        {/* Semantic Section */}
        <section className='mb-20'>
          <h2 className='text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border'>
            Semantic Tokens
          </h2>

          <div className='space-y-12'>
            {semanticGroups.map(group => (
              <div key={group.category}>
                <div className='mb-4'>
                  <h3 className='text-lg font-bold text-foreground'>{group.category}</h3>
                  <p className='text-sm text-foreground-muted'>{group.description}</p>
                </div>

                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                  {group.colors.map(color => (
                    <div
                      key={color.name}
                      onClick={() => copyToClipboard(color.var, color.name)}
                      className='group cursor-pointer bg-surface border border-border rounded-lg p-3 hover:border-accent hover:shadow-sm transition-all duration-200'
                    >
                      <div
                        className={`h-12 w-full rounded-md mb-3 border border-border/10 ${color.bgClass || color.class}`}
                      />
                      <div className='flex justify-between items-center mb-1'>
                        <span className='font-bold text-sm text-foreground'>{color.name}</span>
                        {copiedColor === color.name && <FaCheck className='text-success w-3 h-3' />}
                      </div>
                      <div className='text-[10px] font-mono text-foreground-muted truncate'>
                        {color.var}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Foundation Section */}
        <section className='mb-20'>
          <h2 className='text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border'>
            Primitives
          </h2>

          <div className='space-y-8'>
            {numericScales.map(scale => (
              <div key={scale.name}>
                <h3 className='text-sm font-bold text-foreground-subtle mb-3 uppercase tracking-wider'>
                  {scale.name}
                </h3>
                <div className='grid grid-cols-6 md:grid-cols-11 gap-2'>
                  {scale.colors.map(color => (
                    <div
                      key={color.name}
                      className='group cursor-pointer'
                      onClick={() => copyToClipboard(color.value, color.name)}
                      title={color.name}
                    >
                      <div
                        className='h-10 rounded-md border border-border/50 group-hover:border-accent group-hover:scale-110 transition-all duration-200 shadow-sm'
                        style={{ backgroundColor: color.value }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Transparency */}
        <section>
          <h2 className='text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border'>
            Opacity
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[90, 75, 50, 25].map(opacity => (
              <div key={opacity} className='flex flex-col gap-2'>
                <div className='h-12 w-full rounded-md bg-accent relative overflow-hidden border border-border/10'>
                  <div
                    className='absolute inset-0 bg-background/10'
                    style={{ backdropFilter: `opacity(${100 - opacity}%)` }}
                  />{' '}
                  {/* Simulation for visuals, simpler to just use class */}
                  <div className={`absolute inset-0 bg-accent/${opacity}`} />
                </div>
                <code className='text-xs font-mono text-foreground-muted'>/{opacity}</code>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
