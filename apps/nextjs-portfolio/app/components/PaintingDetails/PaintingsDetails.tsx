/* eslint-disable @next/next/no-img-element */
'use client';
import { PaintingQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { cn } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BsClockFill, BsEye } from 'react-icons/bs';
import Chip from '../Chip/Chip';

interface ImageData {
  lqip: string | null;
  [key: string]: unknown;
}

interface HandleSelectImage {
  (img: ImageData, index: number): void;
}

type PaintingDetailProps = {
  paintingData: PaintingQueryResult;
};

const PaintingDetail = ({ paintingData }: PaintingDetailProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!paintingData) {
    return null;
  }

  const {
    title,
    description,
    tagsV2 = [],
    paintedAt,
    viewsCount,
    format,
    image,
    images = [],
  } = paintingData;

  const allImages = [image, ...images];

  const imageFormatStyle = {
    portrait: 'aspect-portrait',
    landscape: 'aspect-video',
    square: 'aspect-square',
  }[format];

  const handleSelectImage: HandleSelectImage = (img, index) => {
    setSelectedIndex(index);
  };

  const formatedPaintedAt = new Date(paintedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentImage = allImages[selectedIndex] || image;

  // Ensure currentImage is defined
  if (!currentImage) {
    return <div>No image available</div>;
  }

  // Build the image URL
  const imageUrl =
    urlForImage(currentImage)?.format('webp').width(1200).fit('max').url() ??
    '';

  return (
    <section
      className={cn(
        'relative min-h-screen pt-16 lg:px-4 overflow-hidden bg-dark text-white'
      )}
    >
      <div className="flex flex-col items-start grid-cols-12 gap-4 mx-auto max-w-screen-2xl xl:grid 2xl:gap-10 2xl:pt-4 2xl:pb-40">
        <div className="relative w-full h-fit col-span-full xl:col-span-9 2xl:col-span-9">
          <div
            className={cn(
              'relative w-full h-full rounded-none outline-none',
              imageFormatStyle
            )}
          >
            <img
              src={currentImage.lqip ?? ''}
              alt={title}
              className="absolute inset-0 object-cover w-full h-full scale-105 rounded blur-3xl"
            />

            <Image
              src={imageUrl}
              alt={title}
              priority
              fill
              className="object-cover w-full h-full"
            />
          </div>

          {allImages.length > 1 && (
            <div className="relative flex items-center justify-center gap-4 py-4 overflow-x-auto">
              {allImages.map((img, index) => {
                const thumbUrl =
                  urlForImage(img)?.width(100).height(100).url() ?? '';
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectImage(img, index)}
                    className={cn(
                      'flex-shrink-0 transition-transform hover:scale-105 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary',
                      index === selectedIndex ? 'ring ring-primary' : ''
                    )}
                    aria-label={`Select image ${index + 1}`}
                  >
                    <Image
                      loading="lazy"
                      height={100}
                      width={100}
                      src={thumbUrl}
                      alt={`Thumbnail ${index + 1} for ${title}`}
                      className="object-cover w-16 h-16 rounded-lg"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <section className="p-4 pt-0 pb-10 xl:p-0 xl:sticky col-span-full top-4 xl:col-span-3">
          <div>
            <div>
              {tagsV2.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-3">
                  <Chip
                    Icon={() => <BsClockFill className="size-4" />}
                    label={formatedPaintedAt}
                  />
                  <Chip
                    Icon={() => <BsEye className="size-4" />}
                    label="Views:"
                    additionalText={viewsCount?.toString() ?? '0'}
                  />
                  {tagsV2.map((tag) => (
                    <Link
                      key={tag.name}
                      href={`/paintings?filter=${tag.name.toLocaleLowerCase()}`}
                    >
                      <Chip variation="primary" label={tag.name} />
                    </Link>
                  ))}
                </div>
              )}
              <div className="pt-2 prose text-white">
                <h1 className="text-2xl font-bold text-white text-balance">
                  {title}
                </h1>
                <p>{description}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default PaintingDetail;
