import { IconArrowNarrowRight } from '@tabler/icons-react';
import type { GetAllProjectsResult } from '@wisihe/sanity-queries';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/utils';
import Chip from '../Chip/Chip';

type OngoingProjectCardProps = {
  project: GetAllProjectsResult['ongoingProjects'][0];
  index: number;
};

const OngoingProjectCard = ({ project, index }: OngoingProjectCardProps) => {
  const { title, name, seoDescription, description, image, slug, tags, status, projectStart } =
    project;

  const projectTitle = title ?? name;
  const startDate = projectStart
    ? new Date(projectStart).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const displayTags = (tags ?? []).slice(0, 3);
  const remainingTagsCount = Math.max(0, (tags?.length ?? 0) - 3);

  return (
    <motion.li key={project._id} layout className='relative w-full'>
      <motion.article className='group relative overflow-hidden rounded-2xl bg-surface border border-border transition-all duration-300 hover:border-accent-border hover:bg-surface-hover hover:shadow-lg hover:-translate-y-1'>
        <Link href={`projects/${slug}`} className='block'>
          <div className='flex flex-col lg:flex-row'>
            {/* Image Section */}
            <div className='relative w-full lg:w-80 lg:shrink-0 aspect-video lg:aspect-square overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none'>
              <Image
                src={urlForImage(image)?.width(800).height(600).quality(80).url() || ''}
                alt={image?.alt || projectTitle}
                priority={index < 2}
                fill
                sizes='(max-width: 1024px) 100vw, 320px'
                className='object-cover transition-transform duration-500 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-background/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              {/* Status Badge - Overlaid on image */}
              {status && (
                <div className='absolute top-4 right-4 z-10'>
                  <Chip variation='secondary' label={status} interactive={false} />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className='flex-1 p-6 flex flex-col justify-between'>
              <div className='space-y-4'>
                {/* Title */}
                <h3 className='text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300'>
                  {projectTitle}
                </h3>

                {/* Tags */}
                {tags && tags.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {displayTags.map(tag => (
                      <Chip
                        key={tag.name}
                        variation='primary'
                        label={tag.name}
                        interactive={false}
                        className='transition-transform duration-200'
                      />
                    ))}
                    {remainingTagsCount > 0 && (
                      <Chip
                        variation='tertiary'
                        label={`+${remainingTagsCount} more`}
                        interactive={false}
                      />
                    )}
                  </div>
                )}

                {/* Description */}
                <p className='text-foreground-subtle text-base leading-relaxed line-clamp-3 group-hover:text-foreground transition-colors duration-300'>
                  {seoDescription ?? description}
                </p>

                {/* Link Button */}
                <div className='inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:text-accent-hover transition-colors duration-200 group/button'>
                  <span>View Project</span>
                  <IconArrowNarrowRight className='w-4 h-4 transition-transform duration-200 group-hover/button:translate-x-2' />
                </div>
              </div>

              {/* Bottom Content - Start Date */}
              {projectStart && (
                <div className='flex items-center gap-2 text-foreground-muted text-sm pt-4 mt-4 border-t border-border/20 group-hover:border-accent/30 transition-colors duration-300'>
                  <div className='w-2 h-2 bg-accent rounded-full group-hover:scale-125 transition-transform duration-300' />
                  <span>Started {startDate}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </motion.article>
    </motion.li>
  );
};

export default OngoingProjectCard;
