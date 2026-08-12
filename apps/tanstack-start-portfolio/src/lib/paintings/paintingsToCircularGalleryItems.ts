import type { CircularGalleryItem } from '@/components/effects/CircularGallery';
import { urlForImage } from '@/lib/sanity';
import { paintingSlug } from './paintingCompactCardProps';

type PaintingLike = Record<string, unknown> & {
  title?: string;
  image?: unknown;
  slug?: string | { current?: string } | null;
};

export function paintingsToCircularGalleryItems(paintings: PaintingLike[]): CircularGalleryItem[] {
  return paintings
    .filter(painting => painting.image && paintingSlug(painting))
    .map(painting => {
      const slug = paintingSlug(painting);
      const imageUrl =
        urlForImage(painting.image as Parameters<typeof urlForImage>[0])
          ?.width(1200)
          .height(900)
          .fit('max')
          .quality(85)
          .auto('format')
          .url() ?? '';

      return {
        image: imageUrl,
        text: typeof painting.title === 'string' ? painting.title : 'Painting',
        href: `/paintings/${slug}`,
      };
    })
    .filter(item => item.image.length > 0);
}
