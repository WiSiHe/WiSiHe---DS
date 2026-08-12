'use client';

import {
  type ProjectCardImageComponentProps,
  ProjectCardImageFrame as ProjectCardImageFrameView,
  type ProjectCardImageFrameProps as ProjectCardImageFrameViewProps,
} from '@wisihe/ui-react';
import Image from '@/components/ui/Image';

export type ProjectCardImageFrameProps = Omit<
  ProjectCardImageFrameViewProps,
  'ImageComponent' | 'layoutTransition' | 'ImageMorphFrame'
>;

function AppImage({
  fill,
  className,
  alt = '',
  src,
  priority,
  fetchPriority,
  placeholder,
  blurDataURL,
  sizes,
}: ProjectCardImageComponentProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      priority={priority}
      fetchPriority={fetchPriority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      sizes={sizes}
    />
  );
}

export function ProjectCardImageFrame(props: ProjectCardImageFrameProps) {
  return <ProjectCardImageFrameView {...props} ImageComponent={AppImage} />;
}
