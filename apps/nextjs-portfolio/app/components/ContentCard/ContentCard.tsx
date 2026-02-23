'use client';

import { cn } from '@wisihe/utils';
import { motion, type Variants } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { urlForImage } from '@/sanity/lib/utils';

type ContentCardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  image: {
    lqip?: string;
    asset: {
      _ref: string;
      _type: string;
    };
  };
  href: string;
  tags?: { name: string }[];
  badgeIcon?: React.ReactNode;
  sideIcons?: React.ReactNode[];
  isNsfw?: boolean;
  isNsfwUrl?: boolean;
  aspectRatio?: string;
  priority?: boolean;
  layoutIdPrefix?: string;
  className?: string;
  imageWidth?: number;
  imageHeight?: number;
  variant?: 'portrait' | 'horizontal';
};

// Framer Motion variants
const listVariants: Variants = {
  rest: { opacity: 0, y: -20 },
  hover: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1 },
  },
};

const listItemVariants: Variants = {
  rest: { opacity: 0, y: -10 },
  hover: { opacity: 1, y: 0 },
};

const iconsListVariants: Variants = {
  rest: { opacity: 0, x: 50 },
  hover: {
    opacity: 1,
    x: 0,
    transition: { staggerChildren: 0.1 },
  },
};

const iconVariants: Variants = {
  rest: { opacity: 0, x: 50 },
  hover: { opacity: 1, x: 0 },
};

const ContentCard = ({
  title,
  subtitle,
  description,
  image,
  href,
  tags = [],
  badgeIcon,
  sideIcons = [],
  isNsfw = false,
  isNsfwUrl = false,
  aspectRatio,
  priority = false,
  layoutIdPrefix = '',
  className,
  imageWidth = 600,
  imageHeight = 800,
  variant = 'portrait',
}: ContentCardProps) => {
  const isHorizontal = variant === 'horizontal';
  const defaultAspectRatio = isHorizontal ? 'aspect-video lg:aspect-auto' : 'aspect-[3/4]';
  const finalAspectRatio = aspectRatio || defaultAspectRatio;

  return (
    <motion.article
      className={cn(
        'relative within group overflow-hidden bg-surface-subtle text-foreground rounded-md focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-background border border-border transition-all duration-300 hover:border-accent-border hover:bg-surface-hover hover:shadow-lg hover:-translate-y-1',
        !isHorizontal && finalAspectRatio,
        isHorizontal && 'flex flex-col lg:flex-row min-h-64',
        className,
      )}
      whileHover='hover'
      initial='rest'
      animate='rest'
      layout
    >
      {/* Animated Tags - Always floating for consistency */}
      {tags.length > 0 && (
        <motion.ul
          className={cn(
            'absolute z-30 flex flex-wrap items-start gap-1 pr-16 text-xs top-2 left-2 right-2',
          )}
          variants={listVariants}
        >
          {tags.map((tag, i) => (
            <motion.li
              className='px-2 py-0.5 text-xs text-accent-contrast uppercase bg-accent shadow-sm font-bold tracking-wider rounded-sm'
              key={`${tag.name}-${i}`}
              variants={listItemVariants}
            >
              {tag.name}
            </motion.li>
          ))}
        </motion.ul>
      )}

      {/* Badge Icon (e.g. Store) */}
      {badgeIcon && (
        <div className={cn('absolute z-30 right-2 top-2', isHorizontal && 'lg:top-4 lg:right-4')}>
          <div className='p-2 text-xs bg-accent text-accent-contrast shadow-sm rounded-md'>
            {badgeIcon}
          </div>
        </div>
      )}

      {/* Side Icons */}
      {sideIcons.length > 0 && (
        <motion.ul
          className={cn(
            'absolute z-30 flex flex-col gap-1 text-xs right-2',
            badgeIcon ? 'top-10' : 'top-2',
            isHorizontal && 'lg:right-4',
          )}
          variants={iconsListVariants}
        >
          {sideIcons.map((icon, i) => (
            <motion.li
              key={`icon-${i}`}
              className='p-1 text-xs bg-accent text-accent-contrast rounded-md shadow-sm'
              variants={iconVariants}
            >
              {icon}
            </motion.li>
          ))}
        </motion.ul>
      )}

      {/* Background Image Container */}
      <motion.div
        className={cn(
          'relative overflow-hidden',
          isHorizontal ? 'w-full lg:w-96 lg:shrink-0 aspect-video lg:aspect-auto' : 'w-full h-full',
        )}
        layoutId={layoutIdPrefix ? `${layoutIdPrefix}-image-${title}` : undefined}
        variants={{
          rest: { scale: 1 },
          hover: isNsfw || isNsfwUrl ? { scale: 1 } : { scale: 1.05 },
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href={href} aria-hidden='true' tabIndex={-1} className='block w-full h-full'>
          {image ? (
            <Image
              sizes={
                isHorizontal ? '(max-width: 1024px) 100vw, 400px' : '(min-width: 1040px) 20vw, 50vw'
              }
              fill
              priority={priority}
              fetchPriority={priority ? 'high' : 'auto'}
              placeholder={image?.lqip ? 'blur' : 'empty'}
              blurDataURL={image?.lqip || undefined}
              quality={80}
              alt={title}
              src={
                urlForImage(image)
                  ?.width(isHorizontal ? 1000 : imageWidth)
                  .height(isHorizontal ? 800 : imageHeight)
                  .quality(80)
                  .url() ||
                'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
              }
              className='object-cover w-full h-full transition-transform duration-500'
            />
          ) : (
            <div className='w-full h-full bg-surface-subtle animate-pulse' />
          )}
          <div className='absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
        </Link>
      </motion.div>

      {/* NSFW Overlay */}
      {isNsfw && !isNsfwUrl && (
        <div className='absolute inset-0 w-full h-full backdrop-blur-xl bg-black/40 z-10 pointer-events-none' />
      )}

      {/* Content Area */}
      <div
        className={cn(
          'relative z-20 flex flex-col justify-end',
          isHorizontal ? 'flex-1 p-0' : 'absolute bottom-0 left-0 right-0',
        )}
      >
        <div
          className={cn(
            'group/content block transition-all duration-300 border-t border-border bg-surface-elevated',
            !isHorizontal && 'px-4 py-3 border-t border-accent/20',
            isHorizontal &&
              'h-full p-6 lg:p-10 flex flex-col space-y-4 lg:border-l lg:border-t-0 border-t border-accent/20',
          )}
        >
          <div className='flex-1 space-y-3'>
            <motion.h2
              layoutId={layoutIdPrefix ? `${layoutIdPrefix}-title-${title}` : undefined}
              className={cn(
                'text-foreground font-black capitalize transition-colors duration-300 group-hover:text-accent font-inter',
                isHorizontal
                  ? 'text-2xl md:text-3xl lg:text-4xl pr-8'
                  : 'text-base lg:text-lg line-clamp-1 pr-6',
              )}
            >
              <Link href={href} className='hover:text-accent transition-colors duration-300'>
                {title}
              </Link>
            </motion.h2>

            {subtitle && (
              <p
                className={cn(
                  'text-foreground-subtle transition-colors duration-300 group-hover:text-foreground font-medium',
                  isHorizontal ? 'text-base' : 'text-xs line-clamp-1',
                )}
              >
                {subtitle}
              </p>
            )}

            {isHorizontal && description && (
              <p className='text-foreground-subtle leading-relaxed line-clamp-4 group-hover:text-foreground transition-colors duration-300 md:text-lg'>
                {description}
              </p>
            )}
          </div>

          {isHorizontal && (
            <div className='pt-6 mt-auto border-t border-border/20 group-hover:border-accent/30 transition-colors duration-300'>
              <Link
                href={href}
                aria-hidden='true'
                tabIndex={-1}
                className='inline-flex items-center gap-3 font-bold text-accent group-hover/content:text-accent-hover transition-colors duration-200'
              >
                View Project
                <svg
                  className='w-5 h-5 transition-transform duration-200 group-hover/content:translate-x-1.5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <title>Arrow icon</title>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ContentCard;
