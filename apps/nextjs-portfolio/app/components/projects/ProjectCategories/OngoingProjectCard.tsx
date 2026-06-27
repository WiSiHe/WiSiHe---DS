import { IconArrowRight } from '@tabler/icons-react';
import type { GetAllProjectsResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
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
  const displayTags = (tags ?? []).slice(0, 4);
  const remainingTagsCount = Math.max(0, (tags?.length ?? 0) - 4);
  const typeLabel = projectType ? (TYPE_LABEL[projectType] ?? null) : null;
  const imageSrc = image ? urlForImage(image)?.width(1400).height(900).quality(85).url() : null;

  const metaParts = ['Active project', typeLabel, year ? `Since ${year}` : null].filter(Boolean);

  return (
    <li className='relative w-full'>
      <Link href={`projects/${slug}`} className='group block'>
        <article
          className={cn(
            'overflow-hidden rounded-2xl border border-border bg-surface',
            'transition-[border-color,box-shadow,transform] duration-300',
            'hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 md:hover:-translate-y-0.5',
          )}
        >
          <div className='relative flex flex-col md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:min-h-[280px]'>
            {/* Image — top on mobile, right on desktop */}
            <div
              className={cn(
                'relative aspect-video w-full overflow-hidden bg-surface-subtle',
                'order-1 md:order-2 md:aspect-auto md:min-h-[280px]',
              )}
            >
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={image?.alt || projectTitle || ''}
                  priority={index === 0}
                  fetchPriority={index === 0 ? 'high' : undefined}
                  fill
                  sizes='(max-width: 768px) 100vw, 50vw'
                  placeholder={image?.lqip ? 'blur' : 'empty'}
                  blurDataURL={image?.lqip ?? undefined}
                  className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                />
              ) : (
                <div className='absolute inset-0 bg-linear-to-br from-accent/10 via-surface-subtle to-surface' />
              )}

              <div
                className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent md:bg-linear-to-l md:from-background/60 md:via-background/15 md:to-transparent'
                aria-hidden
              />
            </div>

            {/* Content — below image on mobile, left on desktop */}
            <div
              className={cn(
                'order-2 flex flex-col gap-4 border-t border-border p-5 md:order-1 md:border-t-0 md:border-r md:p-7 lg:p-8',
              )}
            >
              <div className='space-y-3'>
                <p className='font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent'>
                  {metaParts.join(' · ')}
                </p>

                <h3 className='font-serif text-2xl font-extrabold leading-tight tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent md:text-3xl lg:text-4xl'>
                  {projectTitle}
                </h3>

                {seoDescription ? (
                  <p className='line-clamp-3 text-sm leading-relaxed text-foreground-subtle md:line-clamp-4 md:text-base md:leading-7'>
                    {seoDescription}
                  </p>
                ) : null}
              </div>

              {displayTags.length > 0 ? (
                <div className='flex flex-wrap items-center gap-1.5'>
                  {displayTags.map((tag: { name?: string | null }) => (
                    <span
                      key={tag.name ?? ''}
                      className='rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-accent'
                    >
                      {tag.name}
                    </span>
                  ))}
                  {remainingTagsCount > 0 ? (
                    <span className='text-[10px] font-medium text-foreground-muted'>
                      +{remainingTagsCount}
                    </span>
                  ) : null}
                </div>
              ) : null}

              <span className='inline-flex items-center gap-2 text-sm font-semibold text-accent transition-[gap,color] duration-200 group-hover:gap-2.5'>
                View project
                <IconArrowRight
                  className='size-4 transition-transform duration-200 group-hover:translate-x-0.5'
                  aria-hidden
                />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </li>
  );
};

export default OngoingProjectCard;
