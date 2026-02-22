'use client';

import { motion, Variants } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BsYoutube } from 'react-icons/bs';
import { FaExclamation, FaShoppingCart } from 'react-icons/fa';
import { TbBoxMultiple } from 'react-icons/tb';

import { GetAllPaintingsandTagsResult } from '@wisihe/sanity-queries';
import { urlForImage } from '@/sanity/lib/utils';
import { cn } from '@wisihe/utils';

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

type PaintingCardProps = {
  paintingData: GetAllPaintingsandTagsResult['paintings'][0];
  shouldBeLazy?: boolean;
};

const PaintingCard = ({
  paintingData,
  shouldBeLazy = false,
}: PaintingCardProps) => {
  const searchParams = useSearchParams();

  const { tagsV2 } = paintingData;

  const filters = searchParams?.getAll('filter');

  const filteredTags = tagsV2?.filter(Boolean) ?? [];

  // Helper function to clean tag names by removing invisible characters and normalizing
  const cleanTagName = (name: string) => {
    return name
      .normalize('NFD') // Decompose characters
      .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritical marks
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
      .replace(/[^\w\s-]/g, '') // Remove special characters except letters, numbers, spaces, and hyphens
      .trim(); // Remove leading/trailing whitespace
  };

  const salesTag = filteredTags.find(t => cleanTagName(t.name) === 'Store');
  const hasNSFWTag = filteredTags.find(t => cleanTagName(t.name) === 'NSFW');

  const isNsfw = !!hasNSFWTag;
  const isNsfwUrl = filters?.includes('NSFW');

  // Early return for invalid data
  if (!paintingData || Object.keys(paintingData).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] rounded-xl bg-surface-subtle border border-border/20">
        <TbBoxMultiple className="w-10 h-10 text-foreground-muted" />
        <strong className="text-foreground mt-2">Could not find painting</strong>
      </div>
    );
  }

  const { image, title = '', video = '', imagesCount = 0, slug } = paintingData;
  const hasStoreLinks = !!salesTag;
  const storybook = false; // Default to false as it's not passed in props

  return (
    <motion.article
      className={cn(
        'relative aspect-3/4 within group overflow-hidden rounded-xl focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-background bg-surface border border-border transition-all duration-300 hover:border-accent-border hover:bg-surface-hover hover:shadow-lg hover:-translate-y-1',
      )}
      whileHover="hover"
      initial="rest"
      animate="rest"
      layout
    >
      {/* Animated Tags */}
      <motion.ul
        className="absolute z-20 flex flex-wrap items-start gap-1 pr-16 text-xs top-2 left-2 right-2"
        variants={listVariants}
      >
        {filteredTags.map(tag => (
          <motion.li
            className="px-2 py-0.5 text-xs text-accent-contrast uppercase bg-accent shadow-sm font-bold tracking-wider rounded-sm"
            key={tag.name}
            variants={listItemVariants}
          >
            {cleanTagName(tag.name)}
          </motion.li>
        ))}
      </motion.ul>

      {/* Always Visible Icon */}
      {hasStoreLinks && (
        <div className="absolute z-20 right-2 top-2">
          <div className="p-2 text-xs bg-accent text-accent-contrast shadow-sm rounded-md">
            <FaShoppingCart aria-label="Available for sale" className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Animated Icons */}
      <motion.ul
        className={cn(
          'absolute z-20 flex flex-col gap-1 text-xs right-2',
          hasStoreLinks ? 'top-12' : 'top-2',
        )}
        variants={iconsListVariants}
      >
        {imagesCount > 0 && (
          <motion.li
            className="p-2 text-xs bg-accent text-accent-contrast shadow-sm rounded-lg"
            variants={iconVariants}
          >
            <TbBoxMultiple className="w-4 h-4" />
          </motion.li>
        )}
        {video && (
          <motion.li
            className="p-2 text-xs bg-accent text-accent-contrast shadow-sm rounded-lg"
            variants={iconVariants}
          >
            <BsYoutube className="w-4 h-4" />
          </motion.li>
        )}
        {isNsfw && (
          <motion.li
            className="p-2 text-xs bg-accent text-accent-contrast shadow-sm rounded-lg"
            variants={iconVariants}
          >
            <FaExclamation className="w-4 h-4" />
          </motion.li>
        )}
      </motion.ul>

      {/* Animated Image */}
      <motion.div
        className="relative w-full h-full"
        layoutId={`image-${title}`}
        variants={{
          rest: { scale: 1 },
          hover: isNsfw || isNsfwUrl ? { scale: 1 } : { scale: 1.05 },
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {image ? (
          <Image
            sizes="(min-width: 1040px) 20vw, 50vw"
            fill
            priority={shouldBeLazy}
            fetchPriority={shouldBeLazy ? 'high' : 'auto'}
            // placeholder="blur-sm"
            placeholder="blur"
            blurDataURL={image?.lqip || undefined}
            quality={80}
            unoptimized={storybook}
            alt={title || 'Painting'}
            src={urlForImage(image)?.width(600).height(800).quality(80).url() || ''}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-surface-subtle animate-pulse" />
        )}
      </motion.div>

      {/* NSFW Overlay */}
      {isNsfw && !isNsfwUrl && <div className="absolute inset-0 w-full h-full bg-background/75 z-10" />}

      <Link href={`/paintings/${slug}`} className="before:absolute before:inset-0 before:z-0">
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-3 transition-all duration-500 ease-in-out bg-surface/90 backdrop-blur-md border-t border-border opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
          <motion.h2
            layoutId={`title-${title}`}
            className="text-base text-foreground font-black capitalize lg:text-lg line-clamp-1 font-inter group-hover:text-accent transition-colors duration-300"
          >
            {title}
          </motion.h2>
        </div>
      </Link>
    </motion.article>
  );
};

export default PaintingCard;
