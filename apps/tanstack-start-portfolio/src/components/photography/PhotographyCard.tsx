'use client';

import type { PhotographyListQueryResult } from '@wisihe/sanity-queries';
import { type PhotographyCardImageComponentProps, PhotographyCardView } from '@wisihe/ui-react';
import { RouterLink } from '@/components/layout/RouterLink';
import Image from '@/components/ui/Image';
import {
  getPhotographyAspectRatio,
  isValidPhotographyLqip,
  urlForPhotographyCard,
} from '@/lib/photography/photographyImage';

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

function getYear(capturedAt?: string | null): string | null {
  if (!capturedAt) return null;
  const date = new Date(capturedAt);
  if (Number.isNaN(date.getTime())) return null;
  return String(date.getFullYear());
}

function PhotographyImage(props: PhotographyCardImageComponentProps) {
  return (
    <Image
      src={props.src}
      alt={props.alt}
      fill={props.fill}
      className={props.className}
      sizes={props.sizes}
      priority={props.priority}
      fetchPriority={props.fetchPriority}
      placeholder={props.placeholder}
      blurDataURL={props.blurDataURL}
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

  const aspectRatio = getPhotographyAspectRatio(photo.image);
  const imageUrl = urlForPhotographyCard(photo.image, aspectRatio);
  if (!imageUrl) return null;

  const lqip = photo.image?.lqip;

  return (
    <PhotographyCardView
      title={photo.title}
      href={`/photography/${photo.slug}`}
      imageSrc={imageUrl}
      imageAlt={photo.image?.alt ?? photo.title ?? 'Photograph'}
      blurDataURL={isValidPhotographyLqip(lqip) ? lqip : null}
      aspectRatio={aspectRatio}
      placeLabel={formatPlaceLabel(photo)}
      caption={photo.caption}
      yearLabel={getYear(photo.capturedAt)}
      priority={priority}
      size={size}
      className={className}
      LinkComponent={RouterLink}
      ImageComponent={PhotographyImage}
    />
  );
}
