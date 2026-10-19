'use client';

import { IconShoppingBag } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { cn } from '@wisihe/utils';
import { useCallback } from 'react';
import Image from '@/components/ui/Image';
import {
  getPaintingImageLqip,
  srcSetForPaintingCard,
  urlForPaintingCard,
} from '@/lib/paintings/paintingCardImage';
import { getPaintingHref, getShopPrintFrameLayout, type ShopPainting } from './shopTeaserShared';

type ShopPrintFrameProps = {
  painting: ShopPainting;
  priority?: boolean;
  className?: string;
  rotation?: number;
  size?: 'hero' | 'duo-primary' | 'duo-secondary' | 'rack';
};

const SIZE_CLASS: Record<NonNullable<ShopPrintFrameProps['size']>, string> = {
  hero: 'w-[min(78vw,320px)] md:w-[min(42vw,440px)]',
  'duo-primary': 'w-[min(62vw,280px)]',
  'duo-secondary': 'w-[min(62vw,280px)]',
  rack: 'w-[min(72vw,280px)] shrink-0 md:w-[min(34vw,360px)]',
};

export default function ShopPrintFrame({
  painting,
  priority = false,
  className,
  rotation = 0,
  size = 'rack',
}: ShopPrintFrameProps) {
  const frameLayout = getShopPrintFrameLayout();
  const imageSrc = urlForPaintingCard(
    painting.image as Parameters<typeof urlForPaintingCard>[0],
    frameLayout,
    85,
  );
  const imageSrcSet = srcSetForPaintingCard(
    painting.image as Parameters<typeof srcSetForPaintingCard>[0],
    frameLayout,
    85,
  );
  const lqip = getPaintingImageLqip(painting.image as Parameters<typeof getPaintingImageLqip>[0]);
  const href = getPaintingHref(painting.slug);
  const title = painting.title?.trim() || 'Untitled';

  const stopDrag = useCallback((event: React.PointerEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  }, []);

  return (
    <div
      className={cn('group relative', SIZE_CLASS[size], className)}
      style={{ rotate: `${rotation}deg` }}
    >
      <Link
        to={href}
        className='block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
        onPointerDown={stopDrag}
        onMouseDown={event => event.stopPropagation()}
        draggable={false}
        aria-label={`View ${title}`}
      >
        <div className='relative overflow-hidden rounded-sm bg-neutral-50 p-2 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.4)] ring-1 ring-black/8 dark:bg-neutral-200/95 dark:ring-white/20'>
          <div className={cn('relative overflow-hidden bg-neutral-900', frameLayout.aspectClass)}>
            {imageSrc ? (
              <Image
                src={imageSrc}
                srcSet={imageSrcSet}
                alt={title}
                fill
                priority={priority}
                fetchPriority={priority ? 'high' : 'auto'}
                sizes='(min-width: 1024px) 40vw, 78vw'
                placeholder={lqip ? 'blur' : 'empty'}
                blurDataURL={lqip}
                className='object-cover'
                draggable={false}
              />
            ) : (
              <div className='absolute inset-0 bg-linear-to-br from-surface-subtle via-surface to-surface-elevated' />
            )}
          </div>

          <span className='mt-2 flex items-center justify-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-600'>
            <IconShoppingBag className='size-3' aria-hidden />
            Print
          </span>
        </div>
      </Link>
    </div>
  );
}
