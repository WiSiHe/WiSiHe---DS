'use client';

import { IconArrowRight } from '@tabler/icons-react';
import type { GetAllProjectsResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import { RouterLink } from '@/components/layout/RouterLink';
import {
  ProjectCardImageFrame,
  ProjectCardImageOverlay,
  ProjectCardTags,
  ProjectCardTitleBlock,
} from '@/components/projects/ProjectCardParts';
import {
  formatProjectStatusLabel,
  getProjectCardExcerpt,
  getProjectDisplayTitle,
} from '@/components/projects/projectCardHelpers';
import { contentImageLayoutId } from '@/lib/motion/sharedLayout';
import { urlForImage } from '@/lib/sanity';
import { buildSrcSet } from '@/lib/sanityImageSrcSet';

type PastProjectCardProps = {
  project: GetAllProjectsResult['pastProjects'][number];
  isLcpCandidate?: boolean;
};

export default function PastProjectCard({ project, isLcpCandidate = false }: PastProjectCardProps) {
  const {
    name,
    client,
    image,
    slug,
    tags,
    status,
    projectEnd,
    projectStart,
    projectType,
    seoDescription,
    summary,
  } = project;

  const projectTitle = getProjectDisplayTitle({ name, client });
  const endYear = projectEnd ? new Date(projectEnd).getFullYear() : null;
  const sinceYear = projectStart ? new Date(projectStart).getFullYear() : null;
  const isOngoingInPastGrid =
    status === 'inProgress' ||
    status === 'onHold' ||
    status === 'notStarted' ||
    status === 'planned';
  const isDeprecated = status === 'cancelled' || status === 'abandoned';
  const excerpt = getProjectCardExcerpt(
    summary as readonly Record<string, unknown>[] | null | undefined,
    seoDescription,
    140,
  );

  const imageSrc = image ? urlForImage(image)?.width(960).height(720).quality(82).url() : null;
  const imageSrcSet = image
    ? buildSrcSet([480, 720, 960], width =>
        urlForImage(image)
          ?.width(width)
          .height(Math.round(width * 0.75))
          .quality(82)
          .url(),
      )
    : undefined;

  return (
    <li
      className={cn(
        'group relative',
        isDeprecated && 'opacity-70 transition-opacity duration-300 hover:opacity-100',
      )}
    >
      <RouterLink href={`/projects/${slug}`} className='block h-full'>
        <article
          className={cn(
            'flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface shadow-sm',
            'transition-[border-color,box-shadow] duration-300',
            'hover:border-accent/30 hover:shadow-[0_20px_40px_-22px_rgba(0,0,0,0.18)]',
            isDeprecated && 'border-border/40',
          )}
        >
          <ProjectCardImageFrame
            layoutId={slug ? contentImageLayoutId(slug) : undefined}
            imageSrc={imageSrc ?? null}
            imageSrcSet={imageSrcSet}
            alt={image?.alt || projectTitle}
            lqip={image?.lqip ?? null}
            priority={isLcpCandidate}
            fetchPriority={isLcpCandidate ? 'high' : undefined}
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            overlay={
              <ProjectCardImageOverlay
                projectType={projectType}
                year={isOngoingInPastGrid ? null : endYear}
                yearLabel={isOngoingInPastGrid && sinceYear ? `Since ${sinceYear}` : undefined}
                statusLabel={
                  isOngoingInPastGrid ? formatProjectStatusLabel(status ?? 'unknown') : undefined
                }
              />
            }
          />

          <div className='flex flex-1 flex-col gap-3 p-4 md:p-5'>
            <ProjectCardTitleBlock
              name={name}
              client={client}
              titleClassName={cn('text-lg md:text-xl', isDeprecated && 'text-foreground-subtle')}
            />

            {excerpt ? (
              <p className='line-clamp-2 text-sm leading-relaxed text-foreground-subtle'>
                {excerpt}
              </p>
            ) : null}

            <div className='mt-auto flex items-end justify-between gap-3 pt-1'>
              <ProjectCardTags tags={tags} limit={3} className='min-w-0 flex-1' />

              <span className='inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent opacity-0 transition-[opacity,gap] duration-200 group-hover:opacity-100 group-hover:gap-1.5'>
                View
                <IconArrowRight className='size-3.5' aria-hidden />
              </span>
            </div>
          </div>
        </article>
      </RouterLink>
    </li>
  );
}
