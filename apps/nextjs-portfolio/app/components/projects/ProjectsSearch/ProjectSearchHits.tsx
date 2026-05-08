'use client';

import { Chip } from '@wisihe/ui-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useHits } from 'react-instantsearch';
import { urlForImage } from '@/sanity/lib/utils';

import { labelProjectStatus, labelProjectType } from './projectFacetLabels';

type AlgoliaProjectImage = NonNullable<Parameters<typeof urlForImage>[0]>;

/** Narrow InstantSearch hit (index signature) for project records */
type ProjectSearchAlgoliaHit = {
  objectID: string;
  slug?: unknown;
  title?: string;
  description?: string;
  status?: string;
  projectType?: string;
  tags?: string[];
  image?: AlgoliaProjectImage | null;
};

function slugFromHit(slug: unknown): string {
  if (typeof slug === 'string') return slug;
  if (slug && typeof slug === 'object' && 'current' in slug) {
    const c = (slug as { current?: string }).current;
    return typeof c === 'string' ? c : '';
  }
  return '';
}

export default function ProjectSearchHits() {
  const { items } = useHits();

  if (items.length === 0) {
    return (
      <div className='w-full py-20 flex flex-col justify-center items-center text-foreground-subtle'>
        <p className='text-lg'>No projects found matching your search.</p>
        <p className='text-sm mt-2'>Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <motion.div layout className='grid w-full h-full grid-cols-12 gap-2 mt-6'>
      <AnimatePresence mode='popLayout'>
        {items.map((hit, index: number) => {
          const h = hit as unknown as ProjectSearchAlgoliaHit;
          const slugStr = slugFromHit(h.slug);
          const title = h.title || 'Untitled';
          const description = h.description || '';
          const rawStatus = h.status;
          const rawType = h.projectType;
          const tagList = h.tags ?? [];
          const displayTags = tagList.slice(0, 3);
          const remainingTagsCount = Math.max(0, tagList.length - 3);
          const image = h.image;

          return (
            <motion.div
              key={h.objectID}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='relative col-span-6 md:col-span-4 lg:col-span-4'
            >
              <div className='relative z-10 flex flex-col items-start justify-start w-full overflow-hidden rounded-2xl shrink-0 text-foreground group bg-surface border border-border transition-all duration-300 hover:border-accent-border hover:bg-surface-hover hover:shadow-lg hover:-translate-y-1'>
                <article className='w-full'>
                  <div className='relative pointer-events-none aspect-square overflow-clip rounded-t-xl'>
                    <div className='absolute z-10 flex flex-wrap gap-2 p-2'>
                      {rawType ? (
                        <Chip
                          variation='secondary'
                          label={labelProjectType(rawType)}
                          interactive={false}
                        />
                      ) : null}
                      {rawStatus ? (
                        <Chip
                          variation='primary'
                          label={labelProjectStatus(rawStatus)}
                          interactive={false}
                        />
                      ) : null}
                      {displayTags.map(tagName => (
                        <Chip
                          variation='tertiary'
                          key={tagName}
                          label={tagName}
                          interactive={false}
                        />
                      ))}
                      {remainingTagsCount > 0 ? (
                        <Chip
                          variation='tertiary'
                          label={`+${remainingTagsCount}`}
                          interactive={false}
                        />
                      ) : null}
                    </div>
                    {image ? (
                      <Image
                        src={urlForImage(image)?.width(400).height(500).quality(60).url() || ''}
                        alt={
                          typeof image === 'object' &&
                          image !== null &&
                          'alt' in image &&
                          typeof (image as { alt?: string }).alt === 'string'
                            ? (image as { alt: string }).alt
                            : title
                        }
                        priority={index < 4}
                        fill
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        className='object-cover transition-transform duration-500 scale-105 group-hover:scale-115'
                      />
                    ) : (
                      <div className='absolute inset-0 bg-surface-hover' aria-hidden />
                    )}
                    <div className='absolute inset-0 bg-background/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                  </div>
                  <div className='p-4'>
                    <Link
                      href={`/projects/${slugStr}`}
                      className='before:absolute before:inset-0 before:z-0'
                    >
                      <h2 className='text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300'>
                        {title}
                      </h2>
                    </Link>
                    {description ? (
                      <p className='line-clamp-3 text-foreground-subtle group-hover:text-foreground transition-colors duration-300'>
                        {description}
                      </p>
                    ) : null}
                  </div>
                </article>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
