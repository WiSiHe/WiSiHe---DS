import type { Transition } from 'motion/react';
import type * as React from 'react';

export type ContentMorphFrameProps = {
  layoutId: string;
  transition?: Transition;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export type ContentMorphFrameComponent = React.ComponentType<ContentMorphFrameProps>;

/** @deprecated Use ContentMorphFrameComponent */
export type PaintingImageMorphFrameComponent = ContentMorphFrameComponent;
