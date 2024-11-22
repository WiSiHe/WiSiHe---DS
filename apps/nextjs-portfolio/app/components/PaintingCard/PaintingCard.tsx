'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BsYoutube } from 'react-icons/bs';
import { FaExclamation } from 'react-icons/fa';
import { TbBoxMultiple } from 'react-icons/tb';
import { useMemo } from 'react';

import { urlForImage } from '@/sanity/lib/utils';
import { cn } from '@wisihe/utils';
import { GetAllPaintingsandTagsResult } from '@/sanity.types';

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

  return (
    <article
      className={cn(
        'relative aspect-portrait within overflow-hidden bg-dark text-white'
      )}
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
          className={cn(
            'object-cover w-full h-full transition-transform duration-500 ease-in-out',
            !isNsfw && !isNsfwUrl && 'group-hover:scale-110'
          )}
        />
      ) : (
        <div className="w-full h-full bg-dark animate-pulse" />
      )}

      {isNsfw && !isNsfwUrl && (
        <div className="absolute inset-0 backdrop-blur-xl" />
      )}

      {hasStoreLinks && (
        <div className="absolute flex items-center gap-2 p-2 text-xs rounded-lg left-2 top-2 bg-highlight text-dark">
          <div className="relative w-2 h-2 rounded-full bg-dark">
            <span className="absolute inset-0 rounded-full opacity-100 animate-ping bg-dark"></span>
          </div>
          <strong>For sale</strong>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 p-4 text-xs border-t bg-dark/50 backdrop-blur-sm group-hover:bg-primary border-dark">
        {slug ? (
          <Link
            href={`/paintings/${slug}`}
            className="before:absolute before:inset-0 before:z-0"
          >
            <h2 className="text-base text-white capitalize line-clamp-1 font-inter">
              <strong>{title}</strong>
            </h2>
          </Link>
        ) : (
          <h2 className="text-base text-white capitalize line-clamp-1 font-inter">
            <strong>{title}</strong>
          </h2>
        )}
        <div className="flex items-center gap-4 text-lg text-white">
          {video && <BsYoutube />}
          {imagesCount > 0 && <TbBoxMultiple />}
          {isNsfw && <FaExclamation />}
        </div>
      </div>
    </article>
  );
};

export default PaintingCard;
