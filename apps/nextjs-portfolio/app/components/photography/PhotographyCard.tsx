import type { PhotographyListQueryResult } from '@wisihe/sanity-queries';
import { type PhotographyCardImageComponentProps, PhotographyCardView } from '@wisihe/ui-react';
import Image from 'next/image';
import { Link } from '@/app/components/layout/ProgressLink';
import { urlForFullImage } from '@/sanity/lib/utils';

export type PhotographyListItem = PhotographyListQueryResult[number];

type PhotographyCardProps = {
  photo: PhotographyListItem;
  className?: string;
  priority?: boolean;
  size?: 'default' | 'large';
};

function formatPlaceLabel(photo: PhotographyListItem): string | null {
  const place = photo.place;
  if (place?.name && place.countryName) return `${place.name} · ${place.countryName}`;
  if (place?.name) return place.name;
  if (place?.countryName) return place.countryName;
  return null;
}

function getAspectRatio(photo: PhotographyListItem): number {
  const width = photo.image?.width;
  const height = photo.image?.height;
  if (typeof width === 'number' && typeof height === 'number' && width > 0 && height > 0) {
    return width / height;
  }

  const rawRatio = photo.image?.aspectRatio;
  return typeof rawRatio === 'number' && rawRatio > 0
    ? Math.min(1.9, Math.max(0.62, rawRatio))
    : 4 / 3;
}

function getYear(capturedAt?: string | null): string | null {
  if (!capturedAt) return null;
  const date = new Date(capturedAt);
  if (Number.isNaN(date.getTime())) return null;
  return String(date.getFullYear());
}

function PhotographyImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
  placeholder,
  blurDataURL,
}: PhotographyCardImageComponentProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
    />
  );
}

export function PhotographyCard({
  photo,
  className,
  priority = false,
  size = 'default',
}: PhotographyCardProps) {
  if (!photo.slug) return null;

  const imageUrl = photo.image
    ? urlForFullImage(photo.image)?.width(1200).quality(88).auto('format').url()
    : null;
  if (!imageUrl) return null;

  return (
    <PhotographyCardView
      title={photo.title}
      href={`/photography/${photo.slug}`}
      imageSrc={imageUrl}
      imageAlt={photo.image?.alt ?? photo.title ?? 'Photograph'}
      blurDataURL={photo.image?.lqip ?? null}
      aspectRatio={getAspectRatio(photo)}
      placeLabel={formatPlaceLabel(photo)}
      caption={photo.caption}
      yearLabel={getYear(photo.capturedAt)}
      priority={priority}
      size={size}
      className={className}
      LinkComponent={Link}
      ImageComponent={PhotographyImage}
    />
  );
}
