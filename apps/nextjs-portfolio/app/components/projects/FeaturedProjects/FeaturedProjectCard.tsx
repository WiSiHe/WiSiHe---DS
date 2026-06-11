'use client';

import { IconArrowRight } from '@tabler/icons-react';
import type { HomePageQueryResult } from '@wisihe/sanity-queries';
import Image from 'next/image';
import Link from 'next/link';
import { portableTextToPlainText, urlForImage } from '@/sanity/lib/utils';
import { GlassSurface } from '../../ui/GlassSurface';

import { formatDateRange, formatProjectStatusLabel } from './featuredProjectHelpers';

export type FeaturedProject = NonNullable<
  NonNullable<HomePageQueryResult>['showcaseProjects']
>[number];

type ImageSourceWithRef = { asset: { _ref: string } };

function collectPreviewSources(project: FeaturedProject): ImageSourceWithRef[] {
  const contentImages = Array.isArray(project.content)
    ? (project.content as Array<{ _type?: string; asset?: { _ref?: string } }>).filter(
        item => item?._type === 'image' && item?.asset?._ref,
      )
    : [];
  return [project.image, ...contentImages]
    .filter((img): img is ImageSourceWithRef => Boolean(img?.asset?._ref))
    .filter((img, idx, arr) => {
      const ref = img?.asset?._ref;
      return ref ? arr.findIndex(other => other?.asset?._ref === ref) === idx : idx === 0;
    })
    .slice(0, 4);
}

type FeaturedProjectCardProps = {
  project: FeaturedProject;
  index: number;
  panelColor: string;
};

const FeaturedProjectCard = ({ project, index }: FeaturedProjectCardProps) => {
  const isEven = index % 2 === 0;
  const titleId = `featured-project-title-${project._id}`;
  const titleTrimmed = (project.title as unknown as string | undefined)?.trim();
  const nameTrimmed = (project.name as string | undefined)?.trim();
  const headingText = titleTrimmed || nameTrimmed || 'Project';
  const seoDescription = (project.seoDescription as string | null | undefined)?.trim() ?? '';
  const legacyDescription = (project.description as string | null | undefined)?.trim() ?? '';
  const summaryText =
    (project.seo?.description as string | undefined)?.trim() ||
    seoDescription ||
    legacyDescription ||
    portableTextToPlainText(
      project.content as Array<Record<string, unknown>> | null | undefined,
      220,
    ) ||
    null;
  const dateRange = formatDateRange(project.projectStart, project.projectEnd);
  const heroUrl = project.image
    ? urlForImage(project.image)?.width(1200).height(900).quality(85).url()
    : null;
  const previewSources = collectPreviewSources(project);

  return (
    <div className='relative w-full h-screen overflow-hidden flex items-center justify-center border-t border-border/20 dark:border-white/5 bg-card'>
      {/* 1. PARALLAX BACKGROUND IMAGE (Fills the Height of the Cell) */}
      <div className='absolute inset-0 z-0 overflow-hidden w-full h-full'>
        {/* Modern dark dim overlay */}
        <div className='absolute inset-0 bg-black/35 dark:bg-black/55 z-10 pointer-events-none transition-colors duration-300' />

        {heroUrl ? (
          <Image
            src={heroUrl}
            alt={project.seo?.title || project.title || project.name || 'Project backdrop'}
            fill
            className='object-cover scale-115 select-none z-0'
            sizes='(max-width: 768px) 100vw, 60vw'
            priority={index === 0}
            data-scroll
            data-scroll-speed='-0.5'
          />
        ) : (
          <div className='w-full h-full bg-muted' />
        )}
      </div>

      {/* Modern Floating Corner Fig Label (Desktop only) */}
      <div className='absolute bottom-4 right-4 z-10 font-mono text-[9px] tracking-widest text-white/40 bg-black/20 backdrop-blur-sm px-2.5 py-1.5 border border-white/5 select-none uppercase hidden md:block rounded-md'>
        Fig. {String(index + 1).padStart(2, '0')}
        {' // '}
        {project.slug || 'Specimen'}
      </div>

      {/* 2. MODERN FLOATING GLASSMORPHIC PLACARD CARD */}
      <div
        className={`relative z-20 w-full max-w-[90%] md:w-[480px] md:absolute md:top-1/2 md:-translate-y-1/2 my-auto mx-4 md:mx-0
          ${
            isEven
              ? 'md:left-[10%] lg:left-[15%] md:right-auto'
              : 'md:right-[10%] lg:right-[15%] md:left-auto'
          }`}
        data-scroll
        data-scroll-speed='0.2'
      >
        <GlassSurface className='w-full h-full p-8 md:p-10'>
          <div className='flex flex-col h-full'>
            {/* Modern Eyebrow Tags */}
            <div className='mb-3 font-mono text-[10px] md:text-xs tracking-wider text-accent uppercase font-bold flex flex-wrap gap-x-2 gap-y-1 items-center'>
              <span>EP-{String(index + 1).padStart(2, '0')}</span>
              <span className='opacity-30 select-none'>•</span>
              <span>{formatProjectStatusLabel(project.status || 'unknown')}</span>
              {dateRange ? (
                <>
                  <span className='opacity-30 select-none'>•</span>
                  <span>{dateRange}</span>
                </>
              ) : null}
            </div>

            {/* Title - Clean modern sans-serif */}
            <h3
              id={titleId}
              className='mb-4 font-sans text-2xl md:text-3xl font-bold leading-tight text-foreground'
            >
              {headingText}
            </h3>

            {/* Description */}
            {summaryText ? (
              <p className='text-sm md:text-base leading-relaxed text-foreground-subtle mb-8 line-clamp-3'>
                {summaryText}
              </p>
            ) : null}

            {/* Sub-specimens (Thumbnails) styled as clean rounded-lg items */}
            {previewSources.length > 1 ? (
              <div className='grid grid-cols-4 gap-3 mb-8'>
                {previewSources.slice(0, 4).map(src => {
                  const u = urlForImage(src)?.width(160).height(160).quality(70).url();
                  return (
                    <div
                      key={src.asset._ref}
                      className='relative aspect-square overflow-hidden rounded-xl bg-muted border border-border/40 hover:scale-105 transition-transform duration-300'
                    >
                      <div className='relative w-full h-full overflow-hidden'>
                        {u ? (
                          <Image src={u} alt='' fill className='object-cover' sizes='60px' />
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* Button - Standard modern pill button */}
            <div className='flex items-center justify-between mt-auto pt-2'>
              <Link
                href={`projects/${project.slug}`}
                className='inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-accent-contrast transition-colors hover:bg-accent-hover shadow-md z-20'
                aria-label={`View project: ${headingText}`}
              >
                View Project
                <IconArrowRight aria-hidden className='h-4 w-4' />
              </Link>
            </div>
          </div>
        </GlassSurface>
      </div>
    </div>
  );
};

export default FeaturedProjectCard;
