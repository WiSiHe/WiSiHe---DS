'use client';

import { IconMaximize } from '@tabler/icons-react';
import type { ReactNode } from 'react';

type ProjectHeroSlideInteractiveProps = {
  alt: string;
  onOpen: () => void;
  children: ReactNode;
};

/** Client wrapper that adds zoom/modal interaction to the server-rendered hero slide. */
export function ProjectHeroSlideInteractive({
  alt,
  onOpen,
  children,
}: ProjectHeroSlideInteractiveProps) {
  return (
    <button
      type='button'
      className='group/slide absolute inset-0 flex cursor-zoom-in items-center justify-center overflow-hidden border-0 bg-neutral-950/90 p-0'
      onClick={onOpen}
      aria-label={`View ${alt} full size`}
    >
      {children}
      <span className='pointer-events-none absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[11px] font-medium text-white/90 opacity-100 shadow-lg backdrop-blur-md sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover/slide:opacity-100'>
        <IconMaximize className='size-3.5' aria-hidden />
        Full size
      </span>
    </button>
  );
}
