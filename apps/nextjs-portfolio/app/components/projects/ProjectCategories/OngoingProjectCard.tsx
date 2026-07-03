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
  getProjectTypeLabel,
} from '@/app/components/projects/projectCardHelpers';
import { contentImageLayoutId } from '@/lib/motion/sharedLayout';
import { urlForImage } from '@/sanity/lib/utils';

type OngoingProjectCardProps = {
  project: GetAllProjectsResult['ongoingProjects'][number];
  index: number;
};

function OngoingImageOverlay({
  status,
  projectType,
  sinceYear,
}: {
  status: string | null | undefined;
  projectType: string | null | undefined;
  sinceYear: number | null;
}) {
  const statusLabel = formatProjectStatusLabel(status ?? 'unknown');
  const typeLabel = getProjectTypeLabel(projectType);
  const isActive = status === 'inProgress';

  return (
    <div className='pointer-events-none absolute inset-0 z-10 flex flex-col justify-between'>
      <div className='p-3 md:p-4'>
        <span className='inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent backdrop-blur-sm md:text-[11px]'>
          {isActive ? (
            <span className='relative flex size-1.5' aria-hidden>
              <span className='absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-50' />
              <span className='relative inline-flex size-1.5 rounded-full bg-accent' />
            </span>
          ) : null}
          {statusLabel}
        </span>
      </div>

      <div className='mt-auto flex items-end justify-between gap-3 px-3 pb-3 pt-10 md:px-4 md:pb-4'>
        {typeLabel ? (
          <span className='text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 md:text-[11px]'>
            {typeLabel}
          </span>
        ) : (
          <span aria-hidden />
        )}
        {sinceYear ? (
          <span className='font-mono text-xs font-medium tabular-nums text-white/75'>
            Since {sinceYear}
          </span>
        ) : null}
      </div>
    </div>
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

  const projectTitle = name?.trim() || client?.trim() || 'Untitled Project';
  const sinceYear = projectStart ? new Date(projectStart).getFullYear() : null;
  const excerpt = getProjectCardExcerpt(
    summary as readonly Record<string, unknown>[] | null | undefined,
    seoDescription,
    200,
  );
  const imageSrc = image ? urlForImage(image)?.width(1600).height(900).quality(85).url() : null;

  return (
    <li className='relative w-full'>
      <Link href={`/projects/${slug}`} className='group block'>
        <article
          className={cn(
            'relative overflow-hidden rounded-2xl border border-border/50 bg-surface',
            'transition-[border-color,box-shadow] duration-300',
            'hover:border-accent/30 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.2)]',
          )}
        >
          <ProjectCardImageFrame
            layoutId={contentImageLayoutId(projectTitle)}
            imageSrc={imageSrc ?? null}
            alt={image?.alt || projectTitle}
            lqip={image?.lqip ?? null}
            priority={index === 0}
            fetchPriority={index === 0 ? 'high' : undefined}
            sizes='(max-width: 768px) 100vw, 80vw'
            aspectClassName='aspect-16/10 md:aspect-21/9'
            overlay={
              <OngoingImageOverlay
                status={status}
                projectType={projectType}
                sinceYear={sinceYear}
              />
            }
          />

          <div className='relative z-10 mx-4 -mt-10 mb-5 md:absolute md:inset-x-0 md:bottom-0 md:mx-0 md:mb-0 md:flex md:items-end md:p-6 lg:p-8'>
            <div className='w-full max-w-xl rounded-xl border border-border/60 bg-surface/95 p-5 shadow-lg backdrop-blur-md md:p-6 lg:max-w-lg'>
              <ProjectCardTitleBlock
                name={name}
                client={client}
                titleClassName='text-2xl md:text-3xl'
              />

              {excerpt ? (
                <p className='mt-3 line-clamp-3 text-sm leading-relaxed text-foreground-subtle md:text-[15px] md:leading-7'>
                  {excerpt}
                </p>
              ) : null}

              <div className='mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                {tags?.length ? <ProjectCardTags tags={tags} limit={4} /> : <span aria-hidden />}

                <span className='inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-[border-color,color,gap] duration-200 group-hover:border-accent/40 group-hover:text-accent group-hover:gap-2.5'>
                  View project
                  <IconArrowRight
                    className='size-4 transition-transform duration-200 group-hover:translate-x-0.5'
                    aria-hidden
                  />
                </span>
              </div>
            </div>
          </div>

          <div className='hidden md:block md:h-28 lg:h-32' aria-hidden />
        </article>
      </Link>
    </li>
  );
};

export default OngoingProjectCard;
