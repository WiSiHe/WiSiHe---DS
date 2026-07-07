import { IconArrowRight } from '@tabler/icons-react';
import type { GetAllProjectsResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import Link from 'next/link';
import {
  getProjectCardTags,
  ProjectCardImageFrame,
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
  const clientLabel = client?.trim() || null;
  const sinceYear = projectStart ? new Date(projectStart).getFullYear() : null;
  const excerpt = getProjectCardExcerpt(
    summary as readonly Record<string, unknown>[] | null | undefined,
    seoDescription,
    200,
  );
  const imageSrc = image ? urlForImage(image)?.width(1600).height(900).quality(85).url() : null;
  const statusLabel = formatProjectStatusLabel(status ?? 'unknown');
  const typeLabel = getProjectTypeLabel(projectType);
  const isActive = status === 'inProgress';
  const { visible: visibleTags } = getProjectCardTags(tags, 4);

  return (
    <li className='relative w-full'>
      <Link href={`/projects/${slug}`} className='group block'>
        <article
          className={cn(
            'relative overflow-hidden rounded-[2rem] border border-border/40 bg-surface md:rounded-[2.5rem]',
            'shadow-[0_24px_80px_-32px_rgba(0,0,0,0.35)]',
            'transition-[border-color,box-shadow,transform] duration-300',
            'hover:border-accent/30 hover:shadow-[0_28px_88px_-28px_rgba(0,0,0,0.45)]',
          )}
        >
          <ProjectCardImageFrame
            layoutId={slug ? contentImageLayoutId(slug) : undefined}
            imageSrc={imageSrc ?? null}
            alt={image?.alt || projectTitle}
            lqip={image?.lqip ?? null}
            priority={index === 0}
            fetchPriority={index === 0 ? 'high' : undefined}
            sizes='(max-width: 768px) 100vw, 80vw'
            aspectClassName='aspect-16/10 md:aspect-21/9'
            flushTop={false}
            imageClassName='object-cover select-none'
            overlay={
              <div
                className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/92 via-black/48 to-black/20'
                aria-hidden
              />
            }
          />

          <div className='pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-5 md:p-8 lg:p-10'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <span className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/88 backdrop-blur-sm md:text-[11px]'>
                {isActive ? (
                  <span className='relative flex size-1.5' aria-hidden>
                    <span className='absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-50' />
                    <span className='relative inline-flex size-1.5 rounded-full bg-accent' />
                  </span>
                ) : null}
                {statusLabel}
              </span>

              <div className='flex flex-wrap justify-end gap-2'>
                {typeLabel ? (
                  <span className='rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/88 backdrop-blur-sm md:text-[11px]'>
                    {typeLabel}
                  </span>
                ) : null}
                {sinceYear ? (
                  <span className='rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[10px] font-semibold tabular-nums text-white/80 backdrop-blur-sm md:text-[11px]'>
                    Since {sinceYear}
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
                <h3 className='max-w-3xl font-serif text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-[1.02] tracking-tight text-white'>
                  {projectTitle}
                </h3>
                {excerpt ? (
                  <p className='max-w-2xl line-clamp-3 text-sm leading-relaxed text-white/72 md:text-base'>
                    {excerpt}
                  </p>
                ) : null}
              </div>

              <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
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
                ) : (
                  <span aria-hidden />
                )}

                <span className='inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast shadow-md transition-[background-color,transform,gap] duration-200 group-hover:gap-2.5 group-hover:bg-accent-hover sm:self-auto'>
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
