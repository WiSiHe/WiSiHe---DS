import { IconArrowRight } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/utils';

export type RelatedPainting = {
  _id: string;
  title: string;
  slug: string;
  paintedAt?: string;
  image?: {
    asset?: unknown;
    altText?: string;
    lqip?: string;
    width?: number;
    height?: number;
  };
};

type MorePaintingsProps = {
  paintings: RelatedPainting[];
};

export function MorePaintings({ paintings }: MorePaintingsProps) {
  if (!paintings.length) return null;

  return (
    <section
      aria-label='More paintings'
      className='relative z-10 mx-auto max-w-screen-2xl px-4 pt-8 pb-20 lg:px-8'
    >
      <div className='border-t border-border/40 pt-12'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-bold tracking-tight text-foreground md:text-2xl'>
              More Digital Paintings
            </h2>
            <p className='mt-1 text-sm text-foreground-muted'>
              Explore other artworks from the collection
            </p>
          </div>
          <Link
            href='/paintings'
            className='inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover'
          >
            All paintings
            <IconArrowRight className='size-4' stroke={2} aria-hidden />
          </Link>
        </div>

        <div className='grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6'>
          {paintings.map(painting => {
            const imageUrl = painting.image
              ? urlForImage(painting.image as Parameters<typeof urlForImage>[0])
                  ?.width(600)
                  .height(450)
                  .fit('crop')
                  .quality(80)
                  .url()
              : null;
            const year = painting.paintedAt ? new Date(painting.paintedAt).getFullYear() : null;

            return (
              <Link
                key={painting._id}
                href={`/paintings/${painting.slug}`}
                className='group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-surface transition-all duration-300 hover:border-accent/40 hover:shadow-lg'
              >
                <div className='relative aspect-4/3 w-full overflow-hidden bg-surface-subtle'>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={painting.image?.altText || painting.title}
                      fill
                      sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                      placeholder={painting.image?.lqip ? 'blur' : 'empty'}
                      blurDataURL={painting.image?.lqip}
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                  ) : null}
                </div>
                <div className='flex flex-1 flex-col justify-between p-3.5'>
                  <h3 className='line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-accent'>
                    {painting.title}
                  </h3>
                  {year ? <p className='mt-1 text-xs text-foreground-muted'>{year}</p> : null}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
