'use client';

import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { IconArrowRight } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

type FeaturedProjectsProps = {
  showcaseProjects?: NonNullable<HomePageQueryResult>['showcaseProjects'] | null;
};

const FeaturedProjects = ({ showcaseProjects }: FeaturedProjectsProps) => {
  if (!showcaseProjects || showcaseProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-4 md:px-8 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-4xl md:text-5xl font-bold font-serif text-[var(--color-text-primary)]">
            Featured Projects
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-prose mx-auto">
            Selected works & experiments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseProjects.map((project) => {
            const imageUrl = urlForImage(project.image)
              ?.height(600)
              .width(800)
              .auto('format')
              .quality(90)
              .url();
            const year = project.projectStart
              ? new Date(project.projectStart).getFullYear()
              : null;

            return (
              <Link
                key={project._id}
                href={`projects/${project.slug}`}
                className="group block h-full"
              >
                <article className="flex flex-col h-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--color-border-focus)] hover:shadow-lg hover:-translate-y-1">
                  {/* Image Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-surface)]">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={project.seo?.title || project.title || 'Project Image'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-text-tertiary)]">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow p-6">
                    <div className="flex items-center justify-between mb-4">
                      {project.name && (
                        <span className="text-xs font-bold tracking-[0.2em] text-[var(--color-primary)] uppercase">
                          {project.name}
                        </span>
                      )}
                      {year && (
                        <span className="text-xs font-mono text-[var(--color-text-tertiary)] border border-[var(--color-border)] px-2 py-1 rounded">
                          {year}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-medium mb-3 text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors font-serif tracking-tight">
                      {project.title}
                    </h3>

                    <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6 line-clamp-3 font-light flex-grow">
                      {project.seo?.description || project.description}
                    </p>

                    {/* Technologies / Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium px-2 py-1 rounded bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
                          >
                            {tag.name}
                          </span>
                        ))}
                         {project.tags.length > 3 && (
                           <span className="text-[10px] font-medium px-2 py-1 rounded bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                             +{project.tags.length - 3}
                           </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center text-[var(--color-text-primary)] font-medium text-sm pt-4 border-t border-[var(--color-border)] mt-auto">
                      View Case Study
                      <IconArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 text-[var(--color-primary)]" />
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
