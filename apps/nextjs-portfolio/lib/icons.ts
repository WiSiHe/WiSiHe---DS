import type { TablerIcon } from '@tabler/icons-react';
import { createElement, type ReactNode } from 'react';

/** Default stroke for UI icons (matches @wisihe/ui-react usage). */
export const ICON_STROKE = 2;

/** Slightly lighter stroke for dense chips / facet labels. */
export const ICON_STROKE_COMPACT = 1.75;

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeClass: Record<IconSize, string> = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
};

/** Render a Tabler icon with consistent size, stroke, and aria-hidden. */
export function renderIcon(
  Icon: TablerIcon,
  size: IconSize = 'sm',
  stroke: number = ICON_STROKE,
): ReactNode {
  return createElement(Icon, {
    className: sizeClass[size],
    stroke,
    'aria-hidden': true,
  });
}
