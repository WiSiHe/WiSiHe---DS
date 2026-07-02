import type { GetAllProjectsResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import Link from 'next/link';
import {
  ProjectCardImageFrame,
  ProjectCardImageOverlay,
  ProjectCardTags,
  ProjectCardTitleBlock,
} from '@/app/components/projects/ProjectCardParts';
import {
  getProjectCardExcerpt,
  getProjectDisplayTitle,
} from '@/app/components/projects/projectCardHelpers';
import { contentImageLayoutId } from '@/lib/motion/sharedLayout';
import { urlForImage } from '@/sanity/lib/utils';

type PastProjectCardProps = {
  project: GetAllProjectsResult['pastProjects'][number];
  isLcpCandidate?: boolean;
};

const PastProjectCard = ({ project, isLcpCandidate = false }: PastProjectCardProps) => {
  const {
    name,
    client,
    image,
    slug,
    tags,
    status,
    projectEnd,
    projectType,
    seoDescription,
    summary,
  } = project;

  const projectTitle = getProjectDisplayTitle({ name, client });
  const year = projectEnd ? new Date(projectEnd).getFullYear() : null;
  const isDeprecated = status === 'cancelled' || status === 'abandoned';
  const excerpt = getProjectCardExcerpt(
    summary as readonly Record<string, unknown>[] | null | undefined,
    seoDescription,
    160,
  );

  const imageSrc = image ? urlForImage(image)?.width(900).height(675).quality(82).url() : null;

  return (
    <li
      className={cn(
        'relative group',
        isDeprecated && 'opacity-65 hover:opacity-100 transition-opacity duration-300',
      )}
    >
      <Link href={`projects/${slug}`} className='block h-full'>
        <article
          className={cn(
            'flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-sm',
            'transition-[border-color,box-shadow,transform] duration-300 ease-out',
            'hover:border-accent/25 hover:shadow-[0_20px_40px_-18px_rgba(0,0,0,0.16)] hover:-translate-y-0.5',
            isDeprecated && 'border-border/60',
          )}
        >
          <div className='relative'>
            <ProjectCardImageFrame
              layoutId={contentImageLayoutId(projectTitle)}
              imageSrc={imageSrc ?? null}
              alt={image?.alt || projectTitle}
              lqip={image?.lqip ?? null}
              priority={isLcpCandidate}
              fetchPriority={isLcpCandidate ? 'high' : undefined}
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            />
            <ProjectCardImageOverlay projectType={projectType} year={year} />
          </div>

          <div className='flex flex-1 flex-col gap-3 p-5 md:p-6'>
            <ProjectCardTitleBlock
              name={name}
              client={client}
              titleClassName={cn(
                'text-xl md:text-[1.35rem]',
                isDeprecated && 'text-foreground-subtle',
              )}
            />

            {excerpt ? (
              <p className='line-clamp-2 text-sm leading-relaxed text-foreground-subtle'>
                {excerpt}
              </p>
            ) : null}

            <ProjectCardTags tags={tags} limit={3} className='mt-auto pt-1' />
          </div>
        </article>
      </Link>
    </li>
  );
};

export default PastProjectCard;
