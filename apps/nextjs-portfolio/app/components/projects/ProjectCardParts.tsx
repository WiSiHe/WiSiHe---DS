import { cn } from '@wisihe/utils';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { getProjectTypeLabel } from '@/app/components/projects/projectCardHelpers';

const TECH_TAG_NAMES = new Set([
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

export function getProjectCardTags(
  tags: Array<{ name?: string | null }> | null | undefined,
  limit: number,
): { visible: Array<{ name: string }>; remaining: number } {
  const named = (tags ?? [])
    .map(tag => tag.name?.trim())
    .filter((name): name is string => Boolean(name));

  const tech = named.filter(name => TECH_TAG_NAMES.has(name));
  const other = named.filter(name => !TECH_TAG_NAMES.has(name));
  const ordered = [...tech, ...other];
  const visible = ordered.slice(0, limit).map(name => ({ name }));

  return {
    visible,
    remaining: Math.max(0, ordered.length - limit),
  };
}

type ProjectCardBadgeProps = {
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

type ProjectCardImageFrameProps = {
  imageSrc: string | null;
  alt: string;
  lqip?: string | null;
  priority?: boolean;
  fetchPriority?: ImageProps['fetchPriority'];
  sizes?: string;
  aspectClassName?: string;
  imageClassName?: string;
};

export function ProjectCardImageFrame({
  imageSrc,
  alt,
  lqip,
  priority,
  fetchPriority,
  sizes = '(max-width: 768px) 100vw, 50vw',
  aspectClassName = 'aspect-4/3',
  imageClassName = 'object-cover',
}: ProjectCardImageFrameProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-linear-to-br from-accent/8 via-surface-subtle to-surface-subtle',
        aspectClassName,
      )}
    >
      <div className='absolute inset-0 p-4 md:p-5'>
        <div className='relative h-full w-full overflow-hidden rounded-2xl bg-surface-subtle/50 ring-1 ring-border/40'>
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={alt}
              fill
              priority={priority}
              fetchPriority={fetchPriority}
              sizes={sizes}
              placeholder={lqip ? 'blur' : 'empty'}
              blurDataURL={lqip ?? undefined}
              className={cn(
                'transition-transform duration-700 ease-out group-hover:scale-[1.03]',
                imageClassName,
              )}
            />
          ) : (
            <div
              className='absolute inset-0 bg-linear-to-br from-accent/[0.06] via-surface-subtle to-foreground/[0.03] dark:from-accent/[0.09] dark:to-foreground/[0.02]'
              aria-hidden
            />
          )}
        </div>
      </div>
    </div>
  );
}

type ProjectCardImageOverlayProps = {
  projectType?: string | null;
  year?: number | null;
  statusLabel?: string | null;
};

export function ProjectCardImageOverlay({
  projectType,
  year,
  statusLabel,
}: ProjectCardImageOverlayProps) {
  const typeLabel = getProjectTypeLabel(projectType);

  return (
    <>
      <div className='pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 md:p-5'>
        {typeLabel ? <ProjectCardBadge>{typeLabel}</ProjectCardBadge> : <span aria-hidden />}
        {year ? <ProjectCardBadge>{year}</ProjectCardBadge> : null}
      </div>
      {statusLabel ? (
        <div className='pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 md:p-5'>
          <ProjectCardBadge className='border-accent/25 bg-accent/10 text-accent'>
            {statusLabel}
          </ProjectCardBadge>
        </div>
      ) : null}
    </>
  );
}

type ProjectCardTagsProps = {
  tags: Array<{ name?: string | null }> | null | undefined;
  limit?: number;
  className?: string;
};

export function ProjectCardTags({ tags, limit = 3, className }: ProjectCardTagsProps) {
  const { visible, remaining } = getProjectCardTags(tags, limit);

  if (visible.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {visible.map(tag => (
        <span
          key={tag.name}
          className='rounded-full border border-accent/15 bg-accent/8 px-2.5 py-0.5 text-[11px] font-medium text-foreground-muted'
        >
          {tag.name}
        </span>
      ))}
      {remaining > 0 ? (
        <span className='text-[11px] font-medium text-foreground-muted'>+{remaining}</span>
      ) : null}
    </div>
  );
}

type ProjectCardTitleBlockProps = {
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
