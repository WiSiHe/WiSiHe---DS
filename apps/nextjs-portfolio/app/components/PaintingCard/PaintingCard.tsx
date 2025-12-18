'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BsYoutube } from 'react-icons/bs';
import { FaExclamation, FaShoppingCart } from 'react-icons/fa';
import { TbBoxMultiple } from 'react-icons/tb';

import { GetAllPaintingsandTagsResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';

type PaintingCardProps = {
  paintingData: GetAllPaintingsandTagsResult['paintings'][0];
  shouldBeLazy?: boolean;
  storybook?: boolean;
};

// Define Framer Motion variants
const listVariants = {
  rest: {
    opacity: 0,
    y: -20,
  },
  hover: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const listItemVariants = {
  rest: {
    opacity: 0,
    y: -10,
  },
  hover: {
    opacity: 1,
    y: 0,
  },
};

const iconsListVariants = {
  rest: { opacity: 0, x: 50 },
  hover: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const iconVariants = {
  rest: { opacity: 0, x: 50 },
  hover: { opacity: 1, x: 0 },
};

const PaintingCard = ({
  paintingData,
  shouldBeLazy = false,
  storybook = false,
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

  const hasStoreLinks = !!salesTag;

  const isNsfw = !!hasNSFWTag;

  const isNsfwUrl = filters?.includes('NSFW');

  // Early return for invalid data
  if (!paintingData || Object.keys(paintingData).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <TbBoxMultiple className="w-10 h-10 text-foreground-muted" />
        <strong className="text-foreground">Could not find painting</strong>
      </div>
    );
  }

  const { image, title = '', video = '', imagesCount = 0, slug } = paintingData;

  return (
    <motion.article
      className={cn(
        'relative aspect-[3/4] within group overflow-hidden bg-surface-subtle text-foreground rounded-2xl focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-background',
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
            className="px-2 py-0.5 text-xs text-accent-contrast uppercase rounded-md bg-accent backdrop-blur-sm shadow-sm"
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
          <div className="p-2 text-xs rounded-full text-accent-contrast bg-accent shadow-lg">
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
            className="p-2 text-xs text-accent-contrast rounded-full bg-accent backdrop-blur-sm shadow-sm"
            variants={iconVariants}
          >
            <TbBoxMultiple className="w-4 h-4" />
          </motion.li>
        )}
        {video && (
          <motion.li
            className="p-2 text-xs text-accent-contrast rounded-full bg-accent backdrop-blur-sm shadow-sm"
            variants={iconVariants}
          >
            <BsYoutube className="w-4 h-4" />
          </motion.li>
        )}
        {isNsfw && (
          <motion.li
            className="p-2 text-xs text-accent-contrast rounded-full bg-accent backdrop-blur-sm shadow-sm"
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
          hover: isNsfw || isNsfwUrl ? { scale: 1 } : { scale: 1.1 },
        }}
        transition={{ duration: 0.5 }}
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
      {isNsfw && !isNsfwUrl && <div className="absolute inset-0 w-full h-full backdrop-blur-lg" />}

      <Link href={`/paintings/${slug}`} className="before:absolute before:inset-0 before:z-0">
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-3 transition-all duration-500 ease-in-out bg-accent backdrop-blur-xl shadow-lg">
          <motion.h2
            layoutId={`title-${title}`}
            className="text-base text-accent-contrast font-black capitalize lg:text-lg line-clamp-1 font-inter"
          >
            {title}
          </motion.h2>
        </div>
      </Link>
    </motion.article>
  );
};

export default PaintingCard;
