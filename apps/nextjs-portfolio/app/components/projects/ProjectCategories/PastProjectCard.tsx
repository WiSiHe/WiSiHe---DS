import { cn } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/utils';

// biome-ignore lint/suspicious/noExplicitAny: GetAllProjectsResult resolves to null until typegen is fixed
type PastProjectCardProps = {
  project: any;
  index: number;
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  completed: {
    label: 'Completed',
    className: 'text-green-600 bg-green-500/10 border-green-500/20',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'text-foreground-muted bg-surface-subtle border-border',
  },
  abandoned: {
    label: 'Abandoned',
    className: 'text-foreground-muted bg-surface-subtle border-border',
  },
  inProgress: {
    label: 'In Progress',
    className: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
  },
  onHold: { label: 'On Hold', className: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20' },
};

const TYPE_LABEL: Record<string, string> = {
  development: 'Dev',
  gameDevelopment: 'Game',
  design: 'Design',
  other: 'Other',
};

const PastProjectCard = ({ project, index }: PastProjectCardProps) => {
  const {
    title,
    name,
    image,
    slug,
    tags,
    status,
    projectEnd,
    projectType,
    seoDescription,
    description,
  } = project;

  const projectTitle = title ?? name;
  const year = projectEnd ? new Date(projectEnd).getFullYear() : null;
  const displayTags = (tags ?? []).slice(0, 3);
  const remainingTagsCount = Math.max(0, (tags?.length ?? 0) - 3);
  const statusConfig = (status && STATUS_CONFIG[status]) || STATUS_CONFIG['completed'];
  const typeLabel = TYPE_LABEL[projectType] ?? null;
  const isDeprecated = status === 'cancelled' || status === 'abandoned';
  const excerpt = seoDescription ?? description ?? '';

  const imageSrc = image ? urlForImage(image)?.width(160).height(160).quality(70).url() : null;

  return (
    <li
      className={cn(
        'relative group',
        isDeprecated && 'opacity-60 hover:opacity-100 transition-opacity duration-300',
      )}
    >
      <Link href={`projects/${slug}`}>
        <article className='flex items-center gap-4 p-3 sm:p-4 rounded-xl bg-surface border border-border transition-all duration-200 hover:border-accent-border hover:bg-surface-hover hover:shadow-md'>
          {/* Thumbnail */}
          {imageSrc && (
            <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 bg-surface-subtle'>
              <Image
                src={imageSrc}
                alt={projectTitle}
                width={64}
                height={64}
                priority={index < 6}
                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
              />
            </div>
          )}

          {/* Content */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between gap-2'>
              <h3
                className={cn(
                  'font-semibold text-foreground group-hover:text-accent transition-colors duration-200 leading-snug truncate',
                  isDeprecated && 'text-foreground-subtle',
                )}
              >
                {projectTitle}
              </h3>
              {year && (
                <span className='text-xs text-foreground-muted shrink-0 mt-0.5'>{year}</span>
              )}
            </div>

            {excerpt && (
              <p className='text-xs text-foreground-muted mt-0.5 line-clamp-1'>{excerpt}</p>
            )}

            <div className='flex flex-wrap items-center gap-1.5 mt-2'>
              {/* Status badge */}
              <span
                className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full border',
                  statusConfig.className,
                )}
              >
                {statusConfig.label}
              </span>
              {/* Type badge */}
              {typeLabel && (
                <span className='text-xs font-medium px-2 py-0.5 rounded-full border border-border bg-surface-subtle text-foreground-muted'>
                  {typeLabel}
                </span>
              )}
              {/* Tags */}
              {displayTags.map((tag: { name?: string | null }) => (
                <span
                  key={tag.name}
                  className='text-xs text-foreground-muted px-1.5 py-0.5 rounded-full bg-surface-subtle'
                >
                  {tag.name}
                </span>
              ))}
              {remainingTagsCount > 0 && (
                <span className='text-xs text-foreground-muted'>+{remainingTagsCount}</span>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className='shrink-0 text-foreground-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200'>
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </div>
        </article>
      </Link>
    </li>
  );
};

export default PastProjectCard;
