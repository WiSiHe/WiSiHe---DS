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
  paintingData: Exclude<PaintingQueryResult, null>;
};

const PaintingDetail = ({ paintingData }: PaintingDetailProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    title,
    description,
    tagsV2 = [],
    paintedAt,
    viewsCount,
    format,
    image,
    images = [],
    video,
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

  // Build the image URL
  const imageUrl =
    urlForImage(currentImage)?.format('webp').width(1200).fit('max').url() ??
    '';

  // useEffect(() => {
  //   const handleAddView = async () => {
  //     try {
  //       const viewerId = generateOrRetrieveViewerId();

  //       if (
  //         Array.isArray(views) &&
  //         !views.some((view) => view.viewerId === viewerId)
  //       ) {
  //         await patchPaintingViews(_id, viewerId);
  //       }
  //     } catch (error) {
  //       console.error('Failed to add view:', error);
  //     }
  //   };

  //   handleAddView();
  // }, []); // Empty dependency array ensures this runs only once on mount

  // const generateOrRetrieveViewerId = () => {
  //   // Attempt to get viewer ID from localStorage
  //   let viewerId = localStorage.getItem('viewerId');

  //   // If not present, generate a new ID and store it
  //   if (!viewerId) {
  //     viewerId = crypto.randomUUID();
  //     localStorage.setItem('viewerId', viewerId);
  //   }

  //   return viewerId;
  // };

  return (
    <section
      className={cn(
        'relative min-h-screen pt-16 lg:px-4 overflow-hidden bg-dark text-white'
      )}
    >
      <div className="flex flex-col items-start grid-cols-12 gap-4 mx-auto max-w-screen-2xl xl:grid 2xl:gap-10 2xl:pt-4 2xl:pb-44">
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
              className="absolute inset-0 object-cover w-full h-full scale-105 blur-3xl"
            />

            <Image
              src={imageUrl}
              alt={title}
              priority
              fill
              className="object-cover w-full h-full lg:rounded-xl bg-dark"
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
          {video && (
            <div className="relative pt-4 rounded aspect-video overflow-clip">
              <iframe
                src={`https://www.youtube.com/embed/${new URL(video).pathname.slice(1)}`}
                className="w-full h-full rounded"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Connected Video"
              />
            </div>
          )}
        </div>

        <section className="p-4 pt-0 pb-10 xl:p-0 lg:sticky col-span-full top-4 xl:col-span-3">
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
