'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { FaCode, FaDraftingCompass, FaFont, FaPalette } from 'react-icons/fa';

const categories = [
  {
    title: 'Colors',
    description: 'Semantic tokens and raw scales for theme-aware UI.',
    href: '/design-system/colors',
    icon: <FaPalette className='w-5 h-5' />,
    color: 'bg-accent/10 text-accent',
    borderColor: 'border-accent/20',
  },
  {
    title: 'Typography',
    description: 'Typeface rules for hierarchy and readability.',
    href: '/design-system/typography',
    icon: <FaFont className='w-5 h-5' />,
    color: 'bg-foreground/5 text-foreground',
    borderColor: 'border-foreground/10',
  },
  {
    title: 'Tone of Voice',
    description: 'Guidelines for clear, honest communication.',
    href: '/design-system/tone-of-voice',
    icon: <FaDraftingCompass className='w-5 h-5' />,
    color: 'bg-foreground/5 text-foreground',
    borderColor: 'border-foreground/10',
  },
  {
    title: 'Components',
    description: 'The building blocks of our interface.',
    href: '#',
    status: 'In Progress',
    icon: <FaCode className='w-5 h-5' />,
    color: 'bg-foreground/5 text-foreground',
    borderColor: 'border-foreground/10',
  },
];

export default function DesignSystemIntro() {
  return (
    <div className='min-h-screen bg-transparent py-12 px-4 md:px-8'>
      <div className='max-w-4xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-16'
        >
          <h1 className='text-4xl md:text-5xl font-bold font-serif text-foreground mb-6 tracking-tight'>
            Design <span className='text-accent'>System</span>
          </h1>
          <p className='text-lg text-foreground-subtle max-w-2xl leading-relaxed'>
            A utility-first collection of rules, tokens, and components. Built to ensure
            consistency, accessibility, and performance across our applications. No fluff, just
            tools.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.2 }}
            >
              <Link
                href={category.href}
                className={`group block p-6 rounded-lg bg-surface border border-border hover:border-accent transition-all duration-200 hover:shadow-sm relative overflow-hidden`}
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className={`p-3 rounded-md ${category.color}`}>{category.icon}</div>
                  {category.status && (
                    <span className='text-[10px] uppercase font-bold tracking-wider text-foreground-muted bg-surface-subtle px-2 py-1 rounded'>
                      {category.status}
                    </span>
                  )}
                </div>

                <h2 className='text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors'>
                  {category.title}
                </h2>
                <p className='text-foreground-subtle text-sm leading-relaxed'>
                  {category.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='mt-20 pt-10 border-t border-border flex flex-wrap gap-x-8 gap-y-4 text-xs font-mono text-foreground-muted'
        >
          <span>v1.2.4</span>
          <span>Next.js 15</span>
          <span>Tailwind v4</span>
          <span>Motion</span>
        </motion.div>
      </div>
    </div>
  );
}
