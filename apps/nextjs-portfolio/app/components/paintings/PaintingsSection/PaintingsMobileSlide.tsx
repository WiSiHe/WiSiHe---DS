'use client';

import { cleanTagName, cn } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import { NsfwBrushCover } from '@/app/components/paintings/BrushReveal/NsfwBrushCover';
import { getBrushStrokeColors } from '@/lib/paintings/brushStrokeColors';
import { getNsfwImageBlurClass } from '@/lib/paintings/nsfwCover';
import {
  getPaintingImageLqip,
  paintingBrushSeed,
  resolvePaintingCardLayout,
  urlForPaintingCard,
} from '@/lib/paintings/paintingCardImage';

// biome-ignore lint/suspicious/noExplicitAny: Sanity / Algolia hit shape varies by query
type PaintingSlideData = Record<string, any>;

type PaintingsMobileSlideProps = {
  painting: PaintingSlideData;
  index: number;
};

/** Mobile carousel slide — full-width image with caption below (no overlay chrome). */
export default function PaintingsMobileSlide({ painting, index }: PaintingsMobileSlideProps) {
  const {
    image,
    title = '',
    slug,
    tagsV2,
    tags,
    medium,
    paintedAt,
    isForSale,
    hasStoreLink,
    redbubbleUrl,
    gelatoUrl,
    isNSFW,
  } = painting;

  const normalizedSlug = typeof slug === 'string' ? slug : (slug?.current ?? '');
  const displayTitle = title?.trim() || 'Untitled painting';

  const tagNames: string[] = tagsV2?.length
    ? (tagsV2 as { name?: string }[]).map(t => cleanTagName(t.name ?? '')).filter(Boolean)
    : ((tags as string[] | undefined)?.map(cleanTagName).filter(Boolean) ?? []);

  const carouselLayout = resolvePaintingCardLayout({ format: 'landscape', aspectRatio: 4 / 3 });

  const imageSrc = urlForPaintingCard(image, carouselLayout);
  const lqip = getPaintingImageLqip(image);

  const availableForSale =
    isForSale === true || hasStoreLink === true || Boolean(redbubbleUrl || gelatoUrl);

  let yearString: string | undefined;
  if (paintedAt) {
    if (typeof paintedAt === 'string') {
      if (paintedAt.includes('-')) {
        const d = new Date(paintedAt);
        if (!Number.isNaN(d.getTime())) yearString = d.getFullYear().toString();
      } else {
        yearString = paintedAt;
      }
    } else if (typeof paintedAt === 'number') {
      yearString = paintedAt.toString();
    }
  }

  const visibleTags = tagNames.slice(0, 3);
  const showNsfwCover = isNSFW === true;
  const brushSeed = paintingBrushSeed(String(painting['_id'] ?? normalizedSlug ?? displayTitle));
  const strokeColors = getBrushStrokeColors(brushSeed, painting['palette'] ?? image?.palette);

  return (
    <div className='w-[min(88vw,340px)] shrink-0'>
      <Link
        href={`/paintings/${normalizedSlug}`}
        className='group block overflow-hidden rounded-2xl border border-border bg-surface transition-[border-color,box-shadow] duration-300 hover:border-accent/35'
      >
        <div className='relative aspect-[4/3] w-full overflow-hidden bg-neutral-900'>
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={displayTitle}
              fill
              priority={index < 2}
              fetchPriority={index < 2 ? 'high' : undefined}
              sizes='88vw'
              className={cn(
                'object-cover transition-transform duration-500 group-hover:scale-[1.03]',
                showNsfwCover && getNsfwImageBlurClass('thumbnail'),
              )}
              placeholder={lqip ? 'blur' : 'empty'}
              blurDataURL={lqip}
              quality={80}
            />
          ) : (
            <div className='absolute inset-0 bg-linear-to-br from-surface-subtle via-surface to-surface-elevated' />
          )}

          {showNsfwCover ? (
            <NsfwBrushCover {...strokeColors} strokeVariantIndex={brushSeed} variant='thumbnail' />
          ) : null}

          {availableForSale ? (
            <span className='absolute right-2.5 top-2.5 rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-contrast shadow-sm'>
              Print
            </span>
          ) : null}
        </div>

        <div className='border-t border-border px-3.5 py-3'>
          <h3 className='line-clamp-2 font-sans text-sm font-semibold leading-snug text-foreground group-hover:text-accent'>
            {displayTitle}
          </h3>
          {(yearString || medium || visibleTags.length > 0) && (
            <div className='mt-2 flex flex-wrap items-center gap-1.5'>
              {yearString ? (
                <span className='rounded border border-border bg-surface-hover px-1.5 py-0.5 font-sans text-[10px] font-bold text-foreground-subtle'>
                  {yearString}
                </span>
              ) : null}
              {visibleTags.map(tag => (
                <span
                  key={tag}
                  className='rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-accent'
                >
                  {tag}
                </span>
              ))}
              {medium ? (
                <span className='max-w-full truncate font-mono text-[9px] uppercase tracking-wider text-foreground-muted'>
                  {medium}
                </span>
              ) : null}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
