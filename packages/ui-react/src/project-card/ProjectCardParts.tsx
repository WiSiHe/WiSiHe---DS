'use client';

import { cn } from '@wisihe/utils';
import { motion, type Transition, useReducedMotion } from 'motion/react';
import type * as React from 'react';
import type { ReactNode } from 'react';
import { Tag } from '../tag/Tag';

const DEFAULT_TECH_TAG_NAMES = new Set([
  'React',
  'NextJS',
  'TypeScript',
  'Typescript',
  'TailwindCSS',
  'Turborepo',
  'GraphQL',
  'CSS',
  'HTML',
  'Javascript',
  'JavaScript',
  'PHP',
  'Wordpress',
  'Vite',
  'Redux',
  'Unity',
  'C#',
  'Flash',
  'Unreal Engine 4',
  'Unreal Engine 5',
  'Blender',
  'ZBrush',
  'Substance Painter',
  'Figma',
  'Tokens',
  'Designsystem',
  'EnonicXP',
  'ThreeJS',
  'Framer Motion',
  'Speed Tree',
  'NextAuth',
  'Sanity',
]);

/** Orders known tech tags first, then others; returns a limited visible set + remaining count. */
export function getProjectCardTags(
  tags: Array<{ name?: string | null }> | null | undefined,
  limit: number,
  techTagNames: ReadonlySet<string> = DEFAULT_TECH_TAG_NAMES,
): { visible: Array<{ name: string }>; remaining: number } {
  const named = (tags ?? [])
    .map(tag => tag.name?.trim())
    .filter((name): name is string => Boolean(name));

  const tech = named.filter(name => techTagNames.has(name));
  const other = named.filter(name => !techTagNames.has(name));
  const ordered = [...tech, ...other];
  const visible = ordered.slice(0, limit).map(name => ({ name }));

  return {
    visible,
    remaining: Math.max(0, ordered.length - limit),
  };
}

export type ProjectCardImageComponentProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
};

function DefaultImage({ fill, className, alt = '', src }: ProjectCardImageComponentProps) {
  const fillStyle = fill
    ? ({ position: 'absolute', inset: 0, width: '100%', height: '100%' } as const)
    : undefined;
  return <img src={src} alt={alt} className={className} style={fillStyle} />;
}

export type ProjectCardImageFrameProps = {
  imageSrc: string | null;
  alt: string;
  lqip?: string | null;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  aspectClassName?: string;
  imageClassName?: string;
  /** Enables shared layout morph into project detail hero. */
  layoutId?: string;
  layoutTransition?: Transition;
  /** Badges/metadata layered on the image. */
  overlay?: ReactNode;
  /** When true, only top corners are rounded (card header image). */
  flushTop?: boolean;
  ImageComponent?: React.ComponentType<ProjectCardImageComponentProps>;
};

export function ProjectCardImageFrame({
  imageSrc,
  alt,
  lqip,
  priority,
  fetchPriority,
  sizes = '(max-width: 768px) 100vw, 50vw',
  aspectClassName = 'aspect-[4/3]',
  imageClassName = 'object-cover',
  layoutId,
  layoutTransition,
  overlay,
  flushTop = true,
  ImageComponent = DefaultImage,
}: ProjectCardImageFrameProps) {
  const reduceMotion = useReducedMotion();
  const effectiveLayoutId = layoutId && !reduceMotion ? layoutId : undefined;

  const frameClassName = cn(
    'relative h-full w-full overflow-hidden bg-neutral-950/5',
    flushTop ? 'rounded-t-2xl' : 'rounded-2xl',
  );

  const imageContent = imageSrc ? (
    <ImageComponent
      src={imageSrc}
      alt={alt}
      fill
      priority={priority}
      fetchPriority={fetchPriority}
      sizes={sizes}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip ?? undefined}
      className={cn(
        'transition-[transform,opacity] duration-500 ease-out group-hover:scale-[1.02]',
        imageClassName,
      )}
    />
  ) : (
    <div
      className='absolute inset-0 bg-linear-to-br from-accent/[0.08] via-surface-subtle to-surface'
      aria-hidden
    />
  );

  const frameBody = (
    <>
      {imageContent}
      <div
        className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95'
        aria-hidden
      />
      {overlay}
    </>
  );

  return (
    <div className={cn('relative overflow-hidden', aspectClassName)}>
      {effectiveLayoutId ? (
        <motion.div
          layoutId={effectiveLayoutId}
          initial={false}
          transition={layoutTransition}
          className={frameClassName}
        >
          {frameBody}
        </motion.div>
      ) : (
        <div className={frameClassName}>{frameBody}</div>
      )}
    </div>
  );
}

export type ProjectCardBadgeProps = {
  children: ReactNode;
  className?: string;
};

export function ProjectCardBadge({ children, className }: ProjectCardBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border/60 bg-background/85 px-2.5 py-1 text-[11px] font-semibold text-foreground-subtle shadow-sm backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </span>
  );
}

export type ProjectCardImageOverlayProps = {
  typeLabel?: string | null;
  trailingLabel?: string | null;
  statusLabel?: string | null;
};

export function ProjectCardImageOverlay({
  typeLabel,
  trailingLabel,
  statusLabel,
}: ProjectCardImageOverlayProps) {
  if (!typeLabel && !trailingLabel && !statusLabel) return null;

  return (
    <div className='pointer-events-none absolute inset-0 z-10 flex flex-col justify-between'>
      {statusLabel ? (
        <div className='p-3 md:p-4'>
          <ProjectCardBadge className='border-accent/30 bg-accent/15 text-accent'>
            {statusLabel}
          </ProjectCardBadge>
        </div>
      ) : null}

      <div className='mt-auto flex items-end justify-between gap-3 px-3 pb-3 pt-10 md:px-4 md:pb-4'>
        {typeLabel ? (
          <span className='text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 md:text-[11px]'>
            {typeLabel}
          </span>
        ) : (
          <span aria-hidden />
        )}
        {trailingLabel ? (
          <span className='font-mono text-xs font-medium tabular-nums text-white/75'>
            {trailingLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export type ProjectCardTagsProps = {
  tags: Array<{ name?: string | null }> | null | undefined;
  limit?: number;
  className?: string;
  techTagNames?: ReadonlySet<string>;
};

export function ProjectCardTags({
  tags,
  limit = 3,
  className,
  techTagNames,
}: ProjectCardTagsProps) {
  const { visible, remaining } = getProjectCardTags(tags, limit, techTagNames);

  if (visible.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {visible.map(tag => (
        <Tag
          key={tag.name}
          variant='surface'
          size='sm'
          shape='pill'
          className='border-accent/15 bg-accent/8 font-medium normal-case tracking-normal text-foreground-muted'
        >
          {tag.name}
        </Tag>
      ))}
      {remaining > 0 ? (
        <span className='text-[11px] font-medium text-foreground-muted'>+{remaining}</span>
      ) : null}
    </div>
  );
}

export type ProjectCardTitleBlockProps = {
  name?: string | null;
  client?: string | null;
  titleClassName?: string;
};

export function ProjectCardTitleBlock({
  name,
  client,
  titleClassName,
}: ProjectCardTitleBlockProps) {
  const clientLabel = client?.trim() || null;
  const title = name?.trim() || 'Untitled Project';

  return (
    <div className='space-y-1.5'>
      {clientLabel ? (
        <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-accent'>
          {clientLabel}
        </p>
      ) : null}
      <h3
        className={cn(
          'font-serif font-bold leading-tight tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent',
          titleClassName,
        )}
      >
        {title}
      </h3>
    </div>
  );
}
