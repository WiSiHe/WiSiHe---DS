import { IconArrowRight } from '@tabler/icons-react';
import type { GetAllProjectsResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import Link from 'next/link';
import {
  ProjectCardImageFrame,
  ProjectCardTags,
  ProjectCardTitleBlock,
} from '@/app/components/projects/ProjectCardParts';
import {
  formatProjectStatusLabel,
  getProjectCardExcerpt,
  getProjectDisplayTitle,
  getProjectTypeLabel,
} from '@/app/components/projects/projectCardHelpers';
import { contentImageLayoutId } from '@/lib/motion/sharedLayout';
import { urlForImage } from '@/sanity/lib/utils';

type OngoingProjectCardProps = {
  project: GetAllProjectsResult['ongoingProjects'][number];
  index: number;
};

function StatusBadge({ status }: { status: string | null | undefined }) {
  const label = formatProjectStatusLabel(status ?? 'unknown');
  const isActive = status === 'inProgress';

  return (
    <span className='inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-medium text-accent'>
      {isActive ? (
        <span className='relative flex size-2' aria-hidden>
          <span className='absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-40' />
          <span className='relative inline-flex size-2 rounded-full bg-accent' />
        </span>
      ) : null}
      {label}
    </span>
  );
}

const OngoingProjectCard = ({ project, index }: OngoingProjectCardProps) => {
  const {
    name,
    client,
    seoDescription,
    summary,
    image,
    slug,
    tags,
    projectStart,
    projectType,
    status,
  } = project;

  const projectTitle = getProjectDisplayTitle({ name, client });
  const year = projectStart ? new Date(projectStart).getFullYear() : null;
  const typeLabel = getProjectTypeLabel(projectType);
  const excerpt = getProjectCardExcerpt(
    summary as readonly Record<string, unknown>[] | null | undefined,
    seoDescription,
    220,
  );
  const imageSrc = image ? urlForImage(image)?.width(1400).height(1050).quality(85).url() : null;

  return (
    <li className='relative w-full'>
      <Link href={`projects/${slug}`} className='group block'>
        <article
          className={cn(
            'overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-sm',
            'transition-[border-color,box-shadow,transform] duration-300 ease-out',
            'hover:border-accent/25 hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.18)] md:hover:-translate-y-1',
          )}
        >
          <div className='grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]'>
            <div className='relative order-first lg:order-last'>
              <ProjectCardImageFrame
                layoutId={contentImageLayoutId(projectTitle)}
                imageSrc={imageSrc ?? null}
                alt={image?.alt || projectTitle}
                lqip={image?.lqip ?? null}
                priority={index === 0}
                fetchPriority={index === 0 ? 'high' : undefined}
                sizes='(max-width: 1024px) 100vw, 45vw'
                aspectClassName='aspect-16/10 lg:aspect-auto lg:min-h-[340px]'
              />
            </div>

            <div className='order-last flex flex-col justify-between gap-8 p-6 md:p-8 lg:p-10'>
              <div className='space-y-5'>
                <div className='flex flex-wrap items-center gap-2'>
                  <StatusBadge status={status} />
                  {typeLabel || year ? (
                    <p className='flex flex-wrap items-center gap-2 text-sm text-foreground-muted'>
                      {typeLabel ? <span>{typeLabel}</span> : null}
                      {typeLabel && year ? (
                        <span className='text-foreground-muted/50' aria-hidden>
                          ·
                        </span>
                      ) : null}
                      {year ? <span>Since {year}</span> : null}
                    </p>
                  ) : null}
                </div>

                <ProjectCardTitleBlock
                  name={name}
                  client={client}
                  titleClassName='text-3xl md:text-4xl lg:text-[2.75rem]'
                />

                {excerpt ? (
                  <p className='max-w-xl text-base leading-relaxed text-foreground-subtle md:text-[1.0625rem] md:leading-7'>
                    {excerpt}
                  </p>
                ) : null}
              </div>

              <div className='flex flex-col gap-5 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between'>
                {tags?.length ? <ProjectCardTags tags={tags} limit={4} /> : <span aria-hidden />}

                <span className='inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-accent transition-[gap] duration-200 group-hover:gap-2.5'>
                  View project
                  <IconArrowRight
                    className='size-4 transition-transform duration-200 group-hover:translate-x-0.5'
                    aria-hidden
                  />
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </li>
  );
};

export default OngoingProjectCard;
