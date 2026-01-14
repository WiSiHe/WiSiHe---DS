'use client';

import { GetAllProjectsResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import Chip from '../Chip/Chip';
import { useState } from 'react';
import { IconArrowNarrowRight } from '@tabler/icons-react';

type ProjectCategoriesProps = {
  ongoingProjects: GetAllProjectsResult['ongoingProjects'];
  pastProjects: GetAllProjectsResult['pastProjects'];
  tags: GetAllProjectsResult['tags'];
};

const ProjectCategories = ({ ongoingProjects, pastProjects, tags }: ProjectCategoriesProps) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleToggleFilter = (tag: string) => {
    if (activeFilters.includes(tag)) {
      setActiveFilters(activeFilters.filter(filter => filter !== tag));
    } else {
      setActiveFilters([...activeFilters, tag]);
    }
  };

  const filterProjects = (projects: GetAllProjectsResult['ongoingProjects']) => {
    return projects.filter(project => {
      if (activeFilters.length === 0) {
        return true;
      }
      return project.tags.some(tag => activeFilters.includes(tag.name));
    });
  };

  const filteredOngoingProjects = filterProjects(ongoingProjects);
  const filteredPastProjects = filterProjects(pastProjects);

  const totalFilteredCount = filteredOngoingProjects.length + filteredPastProjects.length;
  const totalCount = ongoingProjects.length + pastProjects.length;

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  return (
    <section className="flex flex-col w-full gap-6">
      {/* Filter Section */}
      <div className="bg-surface-elevated border border-border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="font-medium text-sm text-foreground-subtle">Filter by tag:</h3>
          {activeFilters.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-accent hover:text-accent-hover hover:underline transition-colors duration-200"
            >
              Clear all ({activeFilters.length})
            </button>
          )}
        </div>

        <ul className="flex flex-wrap gap-2">
          {tags.map(tag => {
            const { name, _id, count } = tag;
            const isActive = activeFilters.includes(name);

            return (
              <li key={_id} className="shrink-0">
                <Chip
                  size="medium"
                  variation={isActive ? 'primary' : 'default'}
                  outlined={!isActive}
                  selected={isActive}
                  label={`${name} (${count})`}
                  onClick={() => handleToggleFilter(name)}
                  className="transition-all duration-200"
                />
              </li>
            );
          })}
        </ul>

        {activeFilters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50 text-sm text-foreground-muted">
            Showing {totalFilteredCount} of {totalCount} project{totalCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* No Results Message */}
      {activeFilters.length > 0 && totalFilteredCount === 0 && (
        <div className="text-center py-12 px-4">
          <p className="text-lg text-foreground-subtle mb-2">
            No projects found with the selected filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="text-accent hover:text-accent-hover hover:underline transition-colors duration-200"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Ongoing Projects Section */}
      {filteredOngoingProjects.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold font-serif text-foreground">Ongoing Projects</h2>
          <ul className="grid w-full grid-cols-1 gap-6 lg:gap-8">
            {filteredOngoingProjects.map((project, index) => {
              const {
                title,
                name,
                seoDescription,
                description,
                image,
                slug,
                tags,
                status,
                projectStart,
              } = project;
              const projectTitle = title ?? name;

              return (
                <motion.li key={project._id} layout className="relative w-full">
                  <motion.article className="group relative overflow-hidden bg-surface border border-border/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-accent/30">
                    <Link href={`projects/${slug}`} className="block">
                      <div className="flex flex-col lg:flex-row">
                        {/* Image Section */}
                        <div className="relative w-full lg:w-80 lg:shrink-0 aspect-video lg:aspect-square overflow-hidden">
                          <Image
                            src={urlForImage(image)?.width(800).height(600).quality(80).url() || ''}
                            alt={image?.alt || projectTitle}
                            priority={index < 2}
                            fill
                            sizes="(max-width: 1024px) 100vw, 320px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Status Badge - Overlaid on image */}
                          {status && (
                            <div className="absolute top-4 right-4 z-10">
                              <Chip variation="secondary" label={status} />
                            </div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div className="space-y-4">
                            {/* Title */}
                            <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                              {projectTitle}
                            </h3>

                            {/* Tags */}
                            {tags && tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {tags.slice(0, 3).map(tag => (
                                  <Chip
                                    key={tag.name}
                                    variation="primary"
                                    label={tag.name}
                                    className="hover:scale-105 transition-transform duration-200"
                                  />
                                ))}
                                {tags.length > 3 && (
                                  <Chip variation="tertiary" label={`+${tags.length - 3} more`} />
                                )}
                              </div>
                            )}

                            {/* Description */}
                            <p className="text-foreground-subtle text-base leading-relaxed line-clamp-3">
                              {seoDescription ?? description}
                            </p>

                            {/* Link Button */}
                            <div className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-200 group/button">
                              <span>View Project</span>
                              <IconArrowNarrowRight className="w-4 h-4 transition-transform duration-200 group-hover/button:translate-x-1" />
                            </div>
                          </div>

                          {/* Bottom Content - Start Date */}
                          {projectStart && (
                            <div className="flex items-center gap-2 text-foreground-muted text-sm pt-4 mt-4 border-t border-border/20">
                              <div className="w-2 h-2 bg-accent rounded-full" />
                              <span>
                                Started{' '}
                                {new Date(projectStart).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Past Projects Section */}
      {filteredPastProjects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-serif text-foreground">Past Projects</h2>
          <ul className="grid w-full grid-cols-12 gap-4 lg:gap-6">
            {filteredPastProjects.map((project, index) => {
              const {
                title,
                name,
                seoDescription,
                description,
                image,
                slug,
                tags,
                status,
                projectEnd,
              } = project;
              const projectTitle = title ?? name;

              return (
                <motion.li
                  key={project._id}
                  layout
                  className="relative z-10 flex flex-col items-start justify-start w-full overflow-hidden bg-surface border border-border/30 rounded-xl shadow-sm hover:shadow-lg shrink-0 text-foreground col-span-full md:col-span-6 lg:col-span-4 group transition-all duration-300 hover:border-accent/30"
                >
                  <motion.article className="w-full">
                    <motion.div
                      layoutId={`image-${projectTitle}`}
                      className="relative pointer-events-none aspect-square overflow-clip"
                    >
                      <div className="absolute z-10 flex flex-wrap gap-2 p-2">
                        {status && <Chip variation="secondary" label={status} />}
                        {tags.slice(0, 2).map(tag => (
                          <Chip variation="primary" key={tag.name} label={tag.name} />
                        ))}
                        {tags.length > 2 && (
                          <Chip variation="tertiary" label={`+${tags.length - 2}`} />
                        )}
                      </div>
                      <Image
                        src={urlForImage(image)?.width(400).height(500).quality(60).url() || ''}
                        alt={image?.alt || projectTitle}
                        priority={index < 4}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 scale-105 group-hover:scale-110"
                      />
                    </motion.div>
                    <div className="p-4">
                      <Link
                        href={`projects/${slug}`}
                        className="before:absolute before:inset-0 before:z-0"
                      >
                        <motion.h2
                          layoutId={`title-${projectTitle}`}
                          className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300"
                        >
                          {projectTitle}
                        </motion.h2>
                      </Link>
                      <p className="line-clamp-3 text-foreground-subtle">
                        {seoDescription ?? description}
                      </p>
                      {projectEnd && (
                        <p className="text-sm text-foreground-muted mt-2">
                          Completed:{' '}
                          {new Date(projectEnd).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </motion.article>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
};

export default ProjectCategories;
