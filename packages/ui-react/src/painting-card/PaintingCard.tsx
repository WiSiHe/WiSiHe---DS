'use client';

import { cn } from '@wisihe/utils';
import { motion, type Variants } from 'motion/react';
import type * as React from 'react';
import { PaintingCardBadgeItem } from './PaintingCardBadgeItem';
import { PaintingCardTag } from './PaintingCardTag';

// ---------------------------------------------------------------------------
// Motion variants
// ---------------------------------------------------------------------------
const listVariants: Variants = {
  rest: { opacity: 0, y: -20 },
  hover: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const iconsListVariants: Variants = {
  rest: { opacity: 0, x: 50 },
  hover: { opacity: 1, x: 0, transition: { staggerChildren: 0.1 } },
};

/** When hover is unavailable (touch), keep chips / badges readable without :hover. */
const alwaysVisibleTagVariants: Variants = {
  rest: { opacity: 1, y: 0 },
  hover: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const alwaysVisibleIconsVariants: Variants = {
  rest: { opacity: 1, x: 0 },
  hover: { opacity: 1, x: 0, transition: { staggerChildren: 0.1 } },
};

// ---------------------------------------------------------------------------
// Placeholder for missing images
// ---------------------------------------------------------------------------
function ImagePlaceholder() {
  return (
    <div className='relative w-full h-full bg-linear-to-br from-surface-subtle via-surface to-surface-elevated flex items-center justify-center overflow-hidden'>
      {/* Grid overlay */}
      <svg
        aria-hidden='true'
        className='absolute inset-0 w-full h-full opacity-10'
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <pattern id='pc-grid' width='24' height='24' patternUnits='userSpaceOnUse'>
            <path d='M 24 0 L 0 0 0 24' fill='none' stroke='currentColor' strokeWidth='0.5' />
          </pattern>
        </defs>
        <rect width='100%' height='100%' fill='url(#pc-grid)' />
      </svg>
      {/* Soft glowing blobs */}
      <div className='absolute top-1/4 left-1/4 w-24 h-24 rounded-full bg-accent/20 blur-2xl' />
      <div className='absolute bottom-1/4 right-1/4 w-16 h-16 rounded-full bg-accent/10 blur-xl' />
      {/* Palette icon */}
      <svg
        aria-hidden='true'
        className='relative z-10 w-12 h-12 text-foreground-muted opacity-40'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={1}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z'
        />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PaintingCardBadge {
  /** Unique key */
  key: string;
  /** Icon to display */
  icon: React.ReactNode;
  /** Accessible label for screen readers */
  label: string;
}

export interface PaintingCardProps {
  /** Title of the painting — shown in the hover footer and used for layout IDs */
  title: string;
  /** Absolute or relative URL of the painting detail page */
  href: string;
  /**
   * Optional link component to use instead of a plain `<a>` tag.
   * Pass `next/link` here to get client-side soft navigation in Next.js.
   * @example `LinkComponent={Link}` (from 'next/link')
   */
  LinkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    'aria-label'?: string;
    children: React.ReactNode;
  }>;
  /**
   * The image element to render inside the card.
   * The consumer is responsible for providing a filled, cover-positioned image.
   * @example `<Image src={src} alt={title} fill className="object-cover w-full h-full" />`
   */
  image?: React.ReactNode;
  /**
   * Tag labels displayed as animated chips on the card.
   * Passed as plain strings so the component is data-source agnostic.
   */
  tags?: string[];
  /** Whether the painting is marked NSFW — shows a blur overlay and an exclamation badge */
  isNsfw?: boolean;
  /** When true, the NSFW blur is lifted (e.g. user has actively filtered for NSFW content) */
  isNsfwVisible?: boolean;
  /**
   * Extra icon badges rendered in the top-right corner.
   * The first badge is always visible; subsequent ones animate in on hover.
   */
  badges?: PaintingCardBadge[];
  /**
   * Show tag chips, secondary badges, and the title strip without requiring hover.
   * Use on touch-first layouts (e.g. mobile carousel) where hover metadata would stay hidden.
   */
  alwaysShowTags?: boolean;
  /** Passed through to the wrapping `motion.article` */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PaintingCard({
  title,
  href,
  LinkComponent,
  image,
  tags = [],
  isNsfw = false,
  isNsfwVisible = false,
  badges = [],
  alwaysShowTags = false,
  className,
}: PaintingCardProps) {
  const showBlur = isNsfw && !isNsfwVisible;
  const [pinnedBadge, ...animatedBadges] = badges;
  const tagVariants = alwaysShowTags ? alwaysVisibleTagVariants : listVariants;
  const iconBadgeVariants = alwaysShowTags ? alwaysVisibleIconsVariants : iconsListVariants;

  const LinkEl = LinkComponent ?? 'a';

  return (
    <motion.article
      className={cn(
        'relative aspect-3/4 group overflow-hidden rounded-xl',
        'focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-background',
        'bg-surface border border-border',
        'transition-all duration-300',
        'hover:border-accent-border hover:bg-surface-hover hover:shadow-lg hover:-translate-y-1',
        className,
      )}
      whileHover='hover'
      initial='rest'
      animate='rest'
      layout
    >
      {/* ------------------------------------------------------------------ */}
      {/* Tag chips                                                           */}
      {/* ------------------------------------------------------------------ */}
      {tags.length > 0 && (
        <motion.ul
          className='absolute z-20 flex flex-wrap items-start gap-1 pr-16 text-xs top-2 left-2 right-2'
          variants={tagVariants}
        >
          {tags.map(tag => (
            <PaintingCardTag key={tag} label={tag} alwaysVisible={alwaysShowTags} />
          ))}
        </motion.ul>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Pinned badge                                                        */}
      {/* ------------------------------------------------------------------ */}
      {pinnedBadge && (
        <div className='absolute z-20 right-2 top-2'>
          <PaintingCardBadgeItem
            icon={pinnedBadge.icon}
            label={pinnedBadge.label}
            pinned
          />
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Animated secondary badges                                          */}
      {/* ------------------------------------------------------------------ */}
      {animatedBadges.length > 0 && (
        <motion.ul
          className={cn(
            'absolute z-20 flex flex-col gap-1 text-xs right-2',
            pinnedBadge ? 'top-12' : 'top-2',
          )}
          variants={iconBadgeVariants}
        >
          {animatedBadges.map(badge => (
            <PaintingCardBadgeItem
              key={badge.key}
              icon={badge.icon}
              label={badge.label}
              alwaysVisible={alwaysShowTags}
            />
          ))}
        </motion.ul>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Image container                                                    */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        className='relative w-full h-full'
        layoutId={`image-${title}`}
        variants={{
          rest: { scale: 1 },
          hover: showBlur ? { scale: 1 } : { scale: 1.05 },
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {image ?? <ImagePlaceholder />}
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* NSFW blur overlay                                                  */}
      {/* ------------------------------------------------------------------ */}
      {showBlur && (
        <div
          className='absolute inset-0 w-full h-full bg-background/60 backdrop-blur-xl z-10'
          aria-hidden='true'
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Hover footer / link                                                */}
      {/* ------------------------------------------------------------------ */}
      <LinkEl
        href={href}
        className='before:absolute before:inset-0 before:z-0'
        aria-label={`View painting: ${title}`}
      >
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 z-20 px-4 py-3 transition-all duration-500 ease-in-out bg-surface/90 backdrop-blur-md border-t border-border opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0',
            alwaysShowTags && 'opacity-100 translate-y-0',
          )}
        >
          <motion.h2
            layoutId={`title-${title}`}
            className={cn(
              'text-base text-foreground font-black capitalize lg:text-lg line-clamp-1 font-inter transition-colors duration-300 group-hover:text-accent',
              alwaysShowTags && 'text-accent',
            )}
          >
            {title}
          </motion.h2>
        </div>
      </LinkEl>
    </motion.article>
  );
}
