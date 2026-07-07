'use client';

import {
  type ProjectCardImageComponentProps,
  ProjectCardImageFrame as ProjectCardImageFrameView,
  type ProjectCardImageFrameProps as ProjectCardImageFrameViewProps,
} from '@wisihe/ui-react';
import Image from 'next/image';
import { ContentMorphImageFrame } from '@/app/components/motion/ContentMorphImageFrame';
import { sharedLayoutTransition } from '@/lib/motion/sharedLayout';

export type ProjectCardImageFrameProps = Omit<
  ProjectCardImageFrameViewProps,
  'ImageComponent' | 'layoutTransition' | 'ImageMorphFrame'
>;

function NextImage({
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

/** Next.js adapter — wires `next/image` + shared layout morph transition into the package frame. */
export function ProjectCardImageFrame(props: ProjectCardImageFrameProps) {
  return (
    <ProjectCardImageFrameView
      {...props}
      ImageComponent={NextImage}
      ImageMorphFrame={ContentMorphImageFrame}
      layoutTransition={sharedLayoutTransition}
    />
  );
}
