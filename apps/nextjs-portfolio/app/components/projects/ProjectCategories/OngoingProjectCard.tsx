import { IconArrowNarrowRight } from '@tabler/icons-react';
import type { GetAllProjectsResult } from '@wisihe/sanity-queries';
import { Chip } from '@wisihe/ui-react';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/utils';

type OngoingProjectCardProps = {
  project: GetAllProjectsResult['ongoingProjects'][number];
  index: number;
};

const OngoingProjectCard = ({ project, index }: OngoingProjectCardProps) => {
  const { name, seoDescription, image, slug, tags, status, projectStart } = project;

  const projectTitle = name;
  const year = projectStart ? new Date(projectStart).getFullYear() : null;
  const displayTags = (tags ?? []).slice(0, 4);
  const remainingTagsCount = Math.max(0, (tags?.length ?? 0) - 4);

  return (
    <li className='relative w-full'>
      <Link href={`projects/${slug}`} className='group block'>
        <article className='relative overflow-hidden rounded-2xl bg-surface border border-border transition-all duration-300 hover:border-accent-border hover:shadow-xl'>
          <div className='flex flex-col md:flex-row md:min-h-56'>
            {/* Content */}
            <div className='flex-1 flex flex-col justify-between gap-6 p-6 md:p-8'>
              <div className='space-y-3'>
                <div className='flex flex-wrap items-center gap-2'>
                  {status === 'inProgress' && (
                    <span className='inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 border border-green-500/20'>
                      <span className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse' />
                      In Progress
                    </span>
                  )}
                  {status && status !== 'inProgress' && (
                    <Chip variation='secondary' label={status} interactive={false} size='small' />
                  )}
                  {year && (
                    <span className='text-xs text-foreground-muted font-medium'>since {year}</span>
                  )}
                </div>

                <h3 className='text-2xl md:text-3xl font-serif font-bold text-foreground group-hover:text-accent transition-colors duration-200 leading-tight'>
                  {projectTitle}
                </h3>

                <p className='text-foreground-subtle text-sm md:text-base leading-relaxed line-clamp-2'>
                  {seoDescription}
                </p>
              </div>

              <div className='flex flex-wrap items-center gap-2'>
                {displayTags.map((tag: { name?: string | null }) => (
                  <Chip
                    key={tag.name ?? ''}
                    variation='tertiary'
                    label={tag.name ?? ''}
                    interactive={false}
                    size='small'
                  />
                ))}
                {remainingTagsCount > 0 && (
                  <Chip
                    variation='tertiary'
                    label={`+${remainingTagsCount}`}
                    interactive={false}
                    size='small'
                  />
                )}
                <IconArrowNarrowRight className='ml-auto w-5 h-5 text-foreground-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-200' />
              </div>
            </div>

            {/* Image */}
            {image && (
              <div className='relative w-full md:w-72 lg:w-96 aspect-video md:aspect-auto shrink-0 overflow-hidden rounded-b-2xl md:rounded-b-none md:rounded-r-2xl'>
                <Image
                  src={urlForImage(image)?.width(800).height(600).quality(80).url() || ''}
                  alt={image?.alt || projectTitle || ''}
                  priority={index === 0}
                  fetchPriority={index === 0 ? 'high' : undefined}
                  fill
                  sizes='(max-width: 768px) 100vw, 384px'
                  placeholder={image?.lqip ? 'blur' : 'empty'}
                  blurDataURL={image?.lqip ?? undefined}
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-linear-to-r from-surface/20 to-transparent md:block hidden' />
              </div>
            )}
          </div>
        </article>
      </Link>
    </li>
  );
};

export default OngoingProjectCard;
