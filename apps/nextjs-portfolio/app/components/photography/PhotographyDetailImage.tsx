'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { SharedLayoutFrame } from '@/app/components/motion/SharedLayoutFrame';
import {
  isValidPhotographyLqip,
  PHOTOGRAPHY_IMAGE_QUALITY,
} from '@/lib/photography/photographyImage';

type PhotographyDetailImageProps = {
  slug: string;
  imageUrl: string;
  alt: string;
  lqip?: string | null;
  aspectRatio: number;
};

export function PhotographyDetailImage({
  slug,
  imageUrl,
  alt,
  lqip,
  aspectRatio,
}: PhotographyDetailImageProps) {
  const hasLqip = isValidPhotographyLqip(lqip);

  return (
    <div className='relative w-full min-w-0 -mx-4 sm:mx-0 lg:col-start-1 lg:row-start-1'>
      <SharedLayoutFrame
        slug={slug}
        className='relative mx-auto w-full overflow-hidden rounded-none sm:rounded-xl'
        style={{
          aspectRatio,
          maxHeight: 'min(88vh, calc(100vh - 9rem))',
        }}
      >
        <motion.div layout='position' className='relative h-full w-full'>
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className='object-contain'
            sizes='(max-width: 1024px) 100vw, 72vw'
            priority
            fetchPriority='high'
            quality={PHOTOGRAPHY_IMAGE_QUALITY}
            unoptimized
            placeholder={hasLqip ? 'blur' : 'empty'}
            blurDataURL={hasLqip ? lqip : undefined}
          />
        </motion.div>
      </SharedLayoutFrame>
    </div>
  );
}
