import type { GetAllProjectsResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/utils';

type PastProjectCardProps = {
  project: GetAllProjectsResult['pastProjects'][number];
  isLcpCandidate?: boolean;
};

const STATUS_CONFIG: Record<string, { label: string; dot: string }> = {
  completed: { label: 'Completed', dot: 'bg-green-500' },
  cancelled: { label: 'Cancelled', dot: 'bg-foreground-muted' },
  abandoned: { label: 'Abandoned', dot: 'bg-foreground-muted' },
  inProgress: { label: 'In Progress', dot: 'bg-blue-500 animate-pulse' },
  onHold: { label: 'On Hold', dot: 'bg-yellow-500' },
};

const TYPE_LABEL: Record<string, string> = {
  development: 'Development',
  gameDevelopment: 'Game Dev',
  design: 'Design',
  other: 'Other',
};

const PastProjectCard = ({ project, isLcpCandidate = false }: PastProjectCardProps) => {
  const { name, image, slug, tags, status, projectEnd, projectType, seoDescription } = project;

  const projectTitle = name;
  const year = projectEnd ? new Date(projectEnd).getFullYear() : null;
  const displayTags = (tags ?? []).slice(0, 3);
  const remainingTagsCount = Math.max(0, (tags?.length ?? 0) - 3);
  const statusConfig = (status && STATUS_CONFIG[status]) ||
    STATUS_CONFIG['completed'] || { label: 'Completed', dot: 'bg-green-500' };
  const typeLabel = projectType ? (TYPE_LABEL[projectType] ?? null) : null;
  const isDeprecated = status === 'cancelled' || status === 'abandoned';
  const excerpt = seoDescription ?? '';

  const imageSrc = image ? urlForImage(image)?.width(600).height(400).quality(75).url() : null;

  return (
    <li
      className={cn(
        'relative group',
        isDeprecated && 'opacity-60 hover:opacity-100 transition-opacity duration-300',
      )}
    >
      <Link href={`projects/${slug}`}>
        <article className='flex flex-col overflow-hidden rounded-2xl bg-surface border border-border transition-all duration-300 hover:border-accent-border hover:shadow-lg hover:-translate-y-0.5'>
          {/* Thumbnail */}
          <div className='relative aspect-video w-full overflow-hidden bg-surface-subtle'>
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={projectTitle ?? ''}
                fill
                priority={isLcpCandidate}
                fetchPriority={isLcpCandidate ? 'high' : undefined}
                sizes='(max-width: 768px) 100vw, 50vw'
                placeholder={image?.lqip ? 'blur' : 'empty'}
                blurDataURL={image?.lqip ?? undefined}
                className='object-cover transition-transform duration-500 group-hover:scale-105'
              />
            ) : (
              <div className='absolute inset-0 bg-gradient-to-br from-surface-subtle to-surface' />
            )}

            {/* Year badge top-right */}
            {year && (
              <div className='absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full bg-background/70 backdrop-blur-sm text-foreground-subtle border border-border/40'>
                {year}
              </div>
            )}

            {/* Type badge top-left */}
            {typeLabel && (
              <div className='absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full bg-background/70 backdrop-blur-sm text-foreground-subtle border border-border/40'>
                {typeLabel}
              </div>
            )}
          </div>

          {/* Content */}
          <div className='flex flex-col flex-1 p-4 gap-2'>
            {/* Status + title row */}
            <div className='flex items-start gap-2'>
              <span
                className={cn('mt-1.5 w-2 h-2 rounded-full shrink-0', statusConfig.dot)}
                title={statusConfig.label}
              />
              <h3
                className={cn(
                  'font-semibold text-foreground group-hover:text-accent transition-colors duration-200 leading-snug',
                  isDeprecated && 'text-foreground-subtle',
                )}
              >
                {projectTitle}
              </h3>
            </div>

            {/* Description */}
            {excerpt && (
              <p className='text-xs text-foreground-muted line-clamp-1 leading-relaxed pl-4'>
                {excerpt}
              </p>
            )}

            {/* Tags */}
            {displayTags.length > 0 && (
              <div className='flex flex-wrap items-center gap-1 pl-4 mt-auto pt-1'>
                {displayTags.map((tag: { name?: string | null }) => (
                  <span
                    key={tag.name}
                    className='text-xs text-foreground-muted px-1.5 py-0.5 rounded bg-surface-subtle'
                  >
                    {tag.name}
                  </span>
                ))}
                {remainingTagsCount > 0 && (
                  <span className='text-xs text-foreground-muted'>+{remainingTagsCount}</span>
                )}
              </div>
            )}
          </div>
        </article>
      </Link>
    </li>
  );
};

export default PastProjectCard;
