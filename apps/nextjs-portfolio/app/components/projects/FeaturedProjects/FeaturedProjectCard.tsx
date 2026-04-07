'use client';

import { IconArrowRight, IconCalendar, IconTag } from '@tabler/icons-react';
import type { HomePageQueryResult } from '@wisihe/sanity-queries';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/utils';

import {
  formatDateRange,
  formatProjectStatusLabel,
  toDateTimeAttr,
} from './featuredProjectHelpers';
import { ScrollStackItem } from './ScrollStack';

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

const FeaturedProjectCard = ({ project, index, panelColor }: FeaturedProjectCardProps) => {
  const titleId = `featured-project-title-${project._id}`;
  const titleTrimmed = (project.title as unknown as string | undefined)?.trim();
  const nameTrimmed = (project.name as string | undefined)?.trim();
  const headingText = titleTrimmed || nameTrimmed || 'Project';
  const showNameEyebrow = Boolean(titleTrimmed && nameTrimmed);
  const dateRange = formatDateRange(project.projectStart, project.projectEnd);
  const tags = project.tags?.slice(0, 4);
  const tagNames = tags?.map(t => t?.name).filter(Boolean) as string[];
  const dateTimeAttr = toDateTimeAttr(project.projectStart);
  const heroUrl = project.image
    ? urlForImage(project.image)?.width(1200).height(900).quality(80).url()
    : null;
  const previewSources = collectPreviewSources(project);

  return (
    <ScrollStackItem itemClassName='pointer-events-auto my-0 flex min-h-[min(360px,68svh)] w-full flex-col overflow-hidden rounded-2xl bg-surface p-0 shadow-lg drop-shadow-xl md:min-h-[min(440px,50svh)]'>
      <article
        className='flex min-h-0 flex-1 gap-3 p-5 md:gap-5 md:p-6 lg:p-7'
        aria-labelledby={titleId}
      >
        <div
          className='w-1 shrink-0 self-stretch rounded-full md:w-1.5'
          style={{ backgroundColor: panelColor }}
          aria-hidden
        />
        <div className='flex min-h-0 min-w-0 flex-1 flex-col gap-4 md:flex-row md:gap-6 lg:gap-8'>
          <div className='flex min-h-0 flex-1 flex-col justify-between gap-4 md:gap-3 md:py-0 md:pr-3 lg:pr-5'>
            <div>
              <div className='mb-2 flex flex-wrap items-center gap-2 md:mb-2'>
                {showNameEyebrow ? (
                  <span className='text-xs font-semibold uppercase tracking-wide text-foreground'>
                    {nameTrimmed}
                  </span>
                ) : null}
                {project.status ? (
                  <span className='text-[10px] font-medium uppercase tracking-wider text-foreground-subtle md:text-xs'>
                    {formatProjectStatusLabel(project.status)}
                  </span>
                ) : null}
              </div>
              <h3
                id={titleId}
                className='mb-1.5 font-serif text-2xl font-bold leading-tight text-foreground md:mb-2 md:text-3xl lg:text-4xl'
              >
                {headingText}
              </h3>
              <p className='line-clamp-3 text-sm leading-snug text-foreground-subtle md:text-base md:leading-relaxed'>
                {(project.seo?.description || project.description) ?? undefined}
              </p>
            </div>
            <div>
              <div className='mb-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-foreground-subtle md:mb-3 md:text-sm'>
                {dateRange ? (
                  <span className='inline-flex items-center gap-1'>
                    <IconCalendar aria-hidden className='h-3.5 w-3.5 shrink-0' />
                    <time dateTime={dateTimeAttr}>{dateRange}</time>
                  </span>
                ) : null}
                {tagNames && tagNames.length > 0 ? (
                  <span className='inline-flex items-center gap-1'>
                    <IconTag aria-hidden className='h-3.5 w-3.5 shrink-0' />
                    <span className='sr-only'>Technologies:</span>
                    {tagNames.join(', ')}
                  </span>
                ) : null}
              </div>
              <Link
                href={`projects/${project.slug}`}
                className='inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover md:px-6 md:py-2.5'
                aria-label={`View case study: ${headingText}`}
              >
                View case study
                <IconArrowRight aria-hidden className='h-4 w-4' />
              </Link>
            </div>
          </div>

          <div className='relative flex min-h-[130px] flex-1 flex-col gap-1.5 md:min-h-0 md:gap-2'>
            <span
              className='pointer-events-none absolute right-0 top-0 select-none font-mono text-4xl font-bold text-foreground/10 md:text-5xl'
              aria-hidden
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            {heroUrl ? (
              <div className='relative mt-6 min-h-[130px] flex-1 overflow-hidden rounded-xl bg-background md:mt-0 md:min-h-[200px] lg:min-h-[220px]'>
                <Image
                  src={heroUrl}
                  alt={
                    project.seo?.title || project.title || project.name || 'Project preview image'
                  }
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, 35vw'
                  priority={index === 0}
                />
              </div>
            ) : (
              <div
                className='mt-6 min-h-[130px] flex-1 rounded-xl bg-surface-hover md:mt-0 md:min-h-[200px] lg:min-h-[220px]'
                aria-hidden
              />
            )}
            {previewSources.length > 1 ? (
              <div
                className='grid grid-cols-4 gap-1.5'
                role='group'
                aria-label='Additional project preview images'
              >
                {previewSources.slice(0, 4).map((src, i) => {
                  const u = urlForImage(src)?.width(200).height(200).quality(70).url();
                  return (
                    <div
                      key={`${project._id}-t-${i}`}
                      className='relative aspect-square overflow-hidden rounded-md bg-background'
                    >
                      {u ? (
                        <Image src={u} alt='' fill className='object-cover' sizes='80px' />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </ScrollStackItem>
  );
};

export default FeaturedProjectCard;
