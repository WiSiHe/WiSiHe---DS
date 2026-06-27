import { IconArrowRight } from '@tabler/icons-react';
import type { GetAllProjectsResult } from '@wisihe/sanity-queries';
import { Chip } from '@wisihe/ui-react';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/utils';

type OngoingProjectCardProps = {
  project: GetAllProjectsResult['ongoingProjects'][number];
  index: number;
};

const TYPE_LABEL: Record<string, string> = {
  development: 'Development',
  gameDevelopment: 'Game Dev',
  design: 'Design',
  other: 'Other',
};

const OngoingProjectCard = ({ project, index }: OngoingProjectCardProps) => {
  const { name, seoDescription, image, slug, tags, projectStart, projectType } = project;

  const projectTitle = name;
  const year = projectStart ? new Date(projectStart).getFullYear() : null;
  const displayTags = (tags ?? []).slice(0, 5);
  const remainingTagsCount = Math.max(0, (tags?.length ?? 0) - 5);
  const typeLabel = projectType ? (TYPE_LABEL[projectType] ?? null) : null;
  const imageSrc = image ? urlForImage(image)?.width(1200).height(800).quality(85).url() : null;

  return (
    <li className='relative w-full'>
      <Link href={`projects/${slug}`} className='group block'>
        <article className='relative overflow-hidden rounded-3xl border border-border/50 bg-surface shadow-sm transition-all duration-300 hover:border-accent/35 hover:shadow-xl hover:shadow-accent/5'>
          <div className='pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-accent/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

          <div className='relative flex flex-col md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] md:min-h-[300px]'>
            {/* Content */}
            <div className='relative z-10 flex flex-col justify-between gap-6 p-6 md:p-8 lg:p-10'>
              <div className='space-y-4'>
                <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
                  <span className='font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-accent'>
                    Active project
                  </span>
                  {typeLabel ? (
                    <span className='rounded-full border border-border/60 bg-surface-subtle px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle'>
                      {typeLabel}
                    </span>
                  ) : null}
                  {year ? (
                    <span className='font-mono text-[10px] uppercase tracking-wider text-foreground-muted'>
                      since {year}
                    </span>
                  ) : null}
                </div>

                <h3 className='font-serif text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent md:text-4xl lg:text-[2.75rem]'>
                  {projectTitle}
                </h3>

                {seoDescription ? (
                  <p className='max-w-xl text-sm leading-relaxed text-foreground-subtle md:text-base md:leading-7'>
                    {seoDescription}
                  </p>
                ) : null}
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
                {remainingTagsCount > 0 ? (
                  <Chip
                    variation='tertiary'
                    label={`+${remainingTagsCount}`}
                    interactive={false}
                    size='small'
                  />
                ) : null}

                <span className='ml-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface-subtle/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground-subtle transition-all duration-200 group-hover:border-accent/40 group-hover:bg-accent group-hover:text-accent-contrast'>
                  View project
                  <IconArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </span>
              </div>
            </div>

            {/* Image */}
            <div className='relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:min-h-full'>
              {imageSrc ? (
                <>
                  <Image
                    src={imageSrc}
                    alt={image?.alt || projectTitle || ''}
                    priority={index === 0}
                    fetchPriority={index === 0 ? 'high' : undefined}
                    fill
                    sizes='(max-width: 768px) 100vw, 45vw'
                    placeholder={image?.lqip ? 'blur' : 'empty'}
                    blurDataURL={image?.lqip ?? undefined}
                    className='object-cover transition-transform duration-700 group-hover:scale-[1.04]'
                  />
                  <div
                    className='absolute inset-0 bg-linear-to-t from-background/70 via-background/10 to-transparent md:bg-linear-to-l md:from-background/80 md:via-background/20 md:to-transparent'
                    aria-hidden
                  />
                </>
              ) : (
                <div className='absolute inset-0 bg-linear-to-br from-accent/15 via-surface-subtle to-brand-1-600/10' />
              )}
            </div>
          </div>
        </article>
      </Link>
    </li>
  );
};

export default OngoingProjectCard;
