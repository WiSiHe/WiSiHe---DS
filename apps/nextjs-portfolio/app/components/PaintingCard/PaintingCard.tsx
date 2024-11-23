'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { BsYoutube } from 'react-icons/bs';
import { FaExclamation, FaShoppingCart } from 'react-icons/fa';
import { TbBoxMultiple } from 'react-icons/tb';

import { GetAllPaintingsandTagsResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { cn } from '@wisihe/utils';
import { motion } from 'framer-motion';

type PaintingCardProps = {
  paintingData: GetAllPaintingsandTagsResult['paintings'][0];
  shouldBeLazy?: boolean;
  storybook?: boolean;
};

const PaintingCard = ({
  paintingData,
  shouldBeLazy = false,
  storybook = false,
}: PaintingCardProps) => {
  const searchParams = useSearchParams();
  const filters = searchParams?.getAll('filter');

  // Compute filtered tags and properties
  const { filteredTags, salesTag, nsfwTag } = useMemo(() => {
    const tags = paintingData?.tagsV2?.filter((t) => t !== null) || [];
    return {
      filteredTags: tags,
      salesTag: tags.find((t) => t.name === 'Store'),
      nsfwTag: tags.find((t) => t.name === 'NSFW'),
    };
  }, [paintingData]);

  const hasStoreLinks = !!salesTag;
  const isNsfw = !!nsfwTag;
  const isNsfwUrl = filters?.includes('nsfw');

  // Early return for invalid data
  if (!paintingData || Object.keys(paintingData).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <TbBoxMultiple className="w-10 h-10 text-primary" />
        <strong>Could not find painting</strong>
      </div>
    );
  }

  const { image, title = '', video = '', imagesCount = 0, slug } = paintingData;

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

  return (
    <motion.article
      className={cn(
        'relative aspect-portrait within group overflow-hidden bg-dark text-white rounded-2xl'
      )}
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      {/* Animated Tags */}
      <motion.ul
        className="absolute z-20 flex flex-wrap items-start gap-1 pr-16 text-xs top-2 left-2 right-2"
        variants={listVariants}
      >
        {filteredTags.map((tag) => (
          <motion.li
            className="px-1 text-xs text-white uppercase rounded bg-dark"
            key={tag.name}
            variants={listItemVariants}
          >
            {tag.name}
          </motion.li>
        ))}
      </motion.ul>

      {/* Always Visible Icon */}
      {hasStoreLinks && (
        <div className="absolute z-20 right-2 top-2">
          <div className="p-2 text-xs rounded-full text-dark bg-highlight">
            <FaShoppingCart
              aria-label="Available for sale"
              className="w-4 h-4"
            />
          </div>
        </div>
      )}

      {/* Animated Icons */}
      <motion.ul
        className={cn(
          'absolute z-20 flex flex-col gap-1 text-xs right-2',
          hasStoreLinks ? 'top-12' : 'top-2'
        )}
        variants={iconsListVariants}
      >
        {imagesCount > 0 && (
          <motion.li
            className="p-2 text-xs text-white rounded-full bg-primary"
            variants={iconVariants}
          >
            <TbBoxMultiple className="w-4 h-4" />
          </motion.li>
        )}
        {video && (
          <motion.li
            className="p-2 text-xs text-white rounded-full bg-primary"
            variants={iconVariants}
          >
            <BsYoutube className="w-4 h-4" />
          </motion.li>
        )}
        {isNsfw && (
          <motion.li
            className="p-2 text-xs text-white rounded-full bg-primary"
            variants={iconVariants}
          >
            <FaExclamation className="w-4 h-4" />
          </motion.li>
        )}
      </motion.ul>

      {/* Animated Image */}
      <motion.div
        className="relative w-full h-full"
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
            placeholder="blur"
            blurDataURL={image?.lqip || undefined}
            quality={60}
            unoptimized={storybook}
            alt={title || 'Painting'}
            src={
              urlForImage(image)?.width(400).height(600).quality(60).url() || ''
            }
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-dark animate-pulse" />
        )}
      </motion.div>

      {/* NSFW Overlay */}
      {isNsfw && !isNsfwUrl && (
        <motion.div
          className="absolute inset-0 backdrop-blur-xl"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        />
      )}

      <Link
        href={`/paintings/${slug}`}
        className="before:absolute before:inset-0 before:z-0"
      >
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-2 transition-all duration-500 ease-in-out bg-primary/60 backdrop-blur-lg">
          <h2 className="text-base text-white capitalize line-clamp-1 font-inter">
            <strong>{title}</strong>
          </h2>
        </div>
      </Link>
    </motion.article>
  );
};

export default PaintingCard;
