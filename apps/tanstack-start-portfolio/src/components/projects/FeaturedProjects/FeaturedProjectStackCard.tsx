'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { getProjectCardTags } from '@/components/projects/ProjectCardParts';
import Image from '@/components/ui/Image';
import { urlForImage } from '@/lib/sanity';
import type { FeaturedProject } from './featuredProjectHelpers';
import { formatDateRange, formatProjectStatusLabel } from './featuredProjectHelpers';

type FeaturedProjectStackCardProps = {
  project: FeaturedProject;
  index: number;
};

export default function FeaturedProjectStackCard({
  project,
  index,
}: FeaturedProjectStackCardProps) {
  const clientLabel = (project.client as string | null | undefined)?.trim() || null;
  const nameTrimmed = (project.name as string | undefined)?.trim();
  const headingText = nameTrimmed || 'Project';
  const seoDescription = (project.seoDescription as string | null | undefined)?.trim() ?? '';
  const legacyDescription = (project.description as string | null | undefined)?.trim() ?? '';
  const summaryText =
    (project.seo?.description as string | undefined)?.trim() ||
    seoDescription ||
    legacyDescription ||
    null;
  const dateRange = formatDateRange(project.projectStart, project.projectEnd);
  const statusLabel = formatProjectStatusLabel(project.status || 'unknown');
  const { visible: visibleTags } = getProjectCardTags(
    project.tags as Array<{ name?: string | null }> | null | undefined,
    3,
  );
  const heroUrl = project.image
    ? urlForImage(project.image)?.width(1400).height(980).quality(85).url()
    : null;
  const backdropAlt = project.seo?.title || headingText || 'Project cover';

  return (
    <article className='relative flex h-[min(28rem,72vh)] w-full flex-col justify-end overflow-hidden rounded-[2rem] border border-border/40 bg-surface shadow-[0_24px_80px_-32px_rgba(0,0,0,0.45)] md:h-[min(32rem,78vh)] md:rounded-[2.5rem]'>
      <div className='pointer-events-none absolute inset-0' aria-hidden>
        {heroUrl ? (
          <Image
            src={heroUrl}
            alt={backdropAlt}
            fill
            priority={index === 0}
            sizes='(min-width: 1024px) 960px, 92vw'
            className='object-cover select-none'
          />
        ) : (
          <div className='absolute inset-0 bg-linear-to-br from-surface-subtle via-surface to-surface-elevated' />
        )}
        <div className='absolute inset-0 bg-linear-to-t from-black/88 via-black/45 to-black/20' />
      </div>

      <div className='relative z-10 flex h-full flex-col justify-between p-6 md:p-10'>
        <div className='flex items-start justify-between gap-4'>
          <span className='inline-flex items-center rounded-full border border-white/15 bg-black/30 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm'>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className='flex flex-wrap justify-end gap-2'>
            <span className='rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/88 backdrop-blur-sm md:text-[11px]'>
              {statusLabel}
            </span>
            {dateRange ? (
              <span className='rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/88 backdrop-blur-sm md:text-[11px]'>
                {dateRange}
              </span>
            ) : null}
          </div>
        </div>

        <div className='space-y-4'>
          <div className='space-y-2'>
            {clientLabel ? (
              <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-accent'>
                {clientLabel}
              </p>
            ) : null}
            <h3 className='max-w-2xl font-serif text-[clamp(1.75rem,5vw,3rem)] font-bold leading-[1.02] tracking-tight text-white'>
              {headingText}
            </h3>
            {summaryText ? (
              <p className='max-w-xl text-sm leading-relaxed text-white/72 md:text-base'>
                {summaryText}
              </p>
            ) : null}
          </div>

          {visibleTags.length > 0 ? (
            <div className='flex flex-wrap gap-1.5'>
              {visibleTags.map(tag => (
                <span
                  key={tag.name}
                  className='rounded-full border border-white/12 bg-white/8 px-2.5 py-0.5 text-[10px] font-medium text-white/80 md:text-[11px]'
                >
                  {tag.name}
                </span>
              ))}
            </div>
          ) : null}

          <Link
            to={`/projects/${project.slug}` as '/'}
            className='group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast shadow-md transition-[background-color,transform] duration-200 hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98]'
          >
            View project
            <IconArrowRight
              aria-hidden
              className='size-4 transition-transform duration-200 group-hover:translate-x-0.5'
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
