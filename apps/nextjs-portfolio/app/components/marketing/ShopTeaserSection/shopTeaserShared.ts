import type { HomeExtrasQueryResult } from '@wisihe/sanity-queries';
import { cleanTagName } from '@wisihe/utils';
import {
  type PaintingCardLayout,
  resolvePaintingCardLayout,
} from '@/lib/paintings/paintingCardImage';

export type ShopPainting = NonNullable<HomeExtrasQueryResult>['forSalePaintings'][number];

/** Unified mat opening — keeps rack/duo frames visually consistent regardless of source format. */
export const SHOP_PRINT_FRAME_LAYOUT: PaintingCardLayout = {
  format: 'portrait',
  aspectClass: 'aspect-[4/5]',
  aspectRatio: 4 / 5,
  cropWidth: 800,
  cropHeight: 1000,
};

export function getShopPrintFrameLayout(): PaintingCardLayout {
  return SHOP_PRINT_FRAME_LAYOUT;
}

export function getPaintingYear(paintedAt: ShopPainting['paintedAt']): string | null {
  if (!paintedAt) return null;
  if (typeof paintedAt === 'string') {
    if (paintedAt.includes('-')) {
      const date = new Date(paintedAt);
      return Number.isNaN(date.getTime()) ? null : String(date.getFullYear());
    }
    return paintedAt;
  }
  if (typeof paintedAt === 'number') return String(paintedAt);
  return null;
}

export function getPaintingHref(slug: string | null | undefined): string {
  return `/paintings/${slug ?? ''}`;
}

export function getShopPaintingLayout(painting: ShopPainting): PaintingCardLayout {
  return resolvePaintingCardLayout({
    aspectRatio: painting.image?.aspectRatio ?? null,
  });
}

/** Human-readable format label from the original artwork dimensions. */
export function getShopPaintingFormatLabel(painting: ShopPainting): string {
  const { format } = getShopPaintingLayout(painting);
  if (format === 'landscape') return 'Landscape';
  if (format === 'portrait') return 'Portrait';
  return 'Square';
}

export function getShopPaintingTags(painting: ShopPainting, limit = 3): string[] {
  const tags = (painting.tagsV2 ?? []).map(tag => cleanTagName(tag?.name ?? '')).filter(Boolean);
  return tags.slice(0, limit);
}

export function formatShopCount(count: number): string {
  return count === 1 ? '1 print' : `${count} prints`;
}
