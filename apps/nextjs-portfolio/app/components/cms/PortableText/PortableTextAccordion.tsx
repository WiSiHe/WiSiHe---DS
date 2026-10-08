'use client';

import { IconChevronDown } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { PortableText, type PortableTextBlock } from 'next-sanity';
import { useEffect, useId, useState } from 'react';
import { cn } from '@/lib/utils';

export interface PortableTextAccordionValue {
  _key?: string;
  title: string;
  badge?: string;
  variant?: 'card' | 'subtle' | 'glass';
  defaultOpen?: boolean;
  content?: PortableTextBlock[];
}

interface PortableTextAccordionProps {
  value: PortableTextAccordionValue;
  wide?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function PortableTextAccordion({ value, wide }: PortableTextAccordionProps) {
  const [isOpen, setIsOpen] = useState(Boolean(value.defaultOpen));
  const elementId = useId();
  const slug = value.title ? slugify(value.title) : elementId;
  const contentId = `accordion-content-${slug}`;
  const headerId = `accordion-header-${slug}`;

  // Auto-expand if URL hash links to this accordion
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && (hash === slug || hash === value._key)) {
        setIsOpen(true);
        const el = document.getElementById(slug);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [slug, value._key]);

  const variant = value.variant || 'card';

  const containerStyles = {
    card: 'bg-surface-elevated/70 border-border shadow-md backdrop-blur-sm',
    subtle: 'bg-transparent border-border/80',
    glass: 'bg-surface/40 border-accent/20 shadow-lg backdrop-blur-md shadow-accent/5',
  }[variant];

  return (
    <div
      id={slug}
      className={cn(
        'my-6 overflow-hidden rounded-xl border transition-colors duration-200 print:border-none print:shadow-none',
        containerStyles,
        wide && 'not-prose w-full',
      )}
    >
      <button
        id={headerId}
        type='button'
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className='group flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-surface-subtle/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:p-5'
      >
        <div className='flex items-center gap-3 min-w-0'>
          <h4 className='m-0 text-base font-semibold tracking-tight text-foreground group-hover:text-accent transition-colors md:text-lg'>
            {value.title || 'Untitled Collapsible Section'}
          </h4>
          {value.badge && (
            <span className='inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent border border-accent/20'>
              {value.badge}
            </span>
          )}
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className='flex-shrink-0 text-foreground-muted group-hover:text-foreground transition-colors'
        >
          <IconChevronDown size={20} stroke={2} aria-hidden='true' />
        </motion.div>
      </button>

      {/* Accordion Content Drawer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            role='region'
            aria-labelledby={headerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className='overflow-hidden print:!block print:!h-auto print:!opacity-100'
          >
            <div className='border-t border-border/50 px-4 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5'>
              {value.content && value.content.length > 0 ? (
                <div className='prose prose-sm md:prose-base max-w-none text-foreground-subtle'>
                  <PortableText value={value.content} />
                </div>
              ) : (
                <p className='m-0 italic text-foreground-muted text-sm'>
                  No content in this section.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
