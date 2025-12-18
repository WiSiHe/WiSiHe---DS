'use client';

import { GetAllProjectsResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import Chip from '../Chip/Chip';
import { useState } from 'react';

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
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
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
        <div className="relative">
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-background via-transparent to-background" />
          <ul className="flex w-full gap-2 overflow-x-auto py-2 px-1 scrollbar-hide">
            {tags.map(tag => {
              const { name, _id, count } = tag;
              const isActive = activeFilters.includes(name);

              return (
                <li key={_id} className="shrink-0">
                  <Chip
                    size="small"
                    variation={isActive ? 'default' : 'tertiary'}
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
        </div>
        {activeFilters.length > 0 && (
          <div className="text-sm text-foreground-muted">
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
          <h2 className="text-2xl font-semibold text-foreground">Ongoing Projects</h2>
          <ul className="grid w-full grid-cols-12 gap-6 lg:gap-8">
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
                <motion.li key={project._id} layout className="relative z-10 w-full col-span-full">
                  <motion.article className="group relative h-full flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-surface via-surface-hover to-surface rounded-2xl border border-border/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-accent/20">
                    {/* Image Section - Top on mobile, Left on desktop */}
                    <motion.div
                      layoutId={`image-${projectTitle}`}
                      className="relative aspect-square md:aspect-square md:min-w-96 md:h-full flex-shrink-0 overflow-hidden"
                    >
                      <Image
                        src={urlForImage(image)?.width(600).height(400).quality(80).url() || ''}
                        alt={image?.alt || projectTitle}
                        priority={index < 4}
                        fill
                        sizes="(max-width: 768px) 100vw, 320px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/10 to-transparent group-hover:from-black/20 group-hover:via-black/5 transition-all duration-500" />

                      {/* Subtle shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                      {/* Status Badge - Overlaid on image */}
                      <div className="absolute top-4 right-4 z-20">
                        {status && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                          >
                            <Chip variation="secondary" label={status} />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    {/* Content Section - Bottom on mobile, Right on desktop */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      {/* Top Content */}
                      <div className="space-y-4">
                        {/* Title */}
                        <Link
                          href={`projects/${slug}`}
                          className="before:absolute before:inset-0 before:z-0"
                        >
                          <motion.h2
                            layoutId={`title-${projectTitle}`}
                            className="text-2xl font-bold text-foreground group-hover:text-accent transition-all duration-300 group-hover:translate-x-1"
                          >
                            {projectTitle}
                          </motion.h2>
                        </Link>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {tags?.map((tag, tagIndex) => (
                            <motion.div
                              key={tag.name}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * tagIndex, duration: 0.3 }}
                            >
                              <Chip
                                variation="primary"
                                label={tag.name}
                                className="hover:scale-105 transition-transform duration-200 hover:shadow-md"
                              />
                            </motion.div>
                          ))}
                        </div>

                        {/* Description */}
                        <p className="text-foreground-subtle text-base leading-relaxed line-clamp-4">
                          {seoDescription || description}
                        </p>
                      </div>

                      {/* Bottom Content - Start Date */}
                      {projectStart && (
                        <div className="flex items-center gap-2 text-foreground-muted text-sm pt-4 border-t border-border/20">
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

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent/30 transition-all duration-500" />

                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-accent/5 via-transparent to-accent/5" />
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
          <h2 className="text-xl font-semibold text-foreground">Past Projects</h2>
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
                        {tags.map(tag => (
                          <Chip variation="primary" key={tag.name} label={tag.name} />
                        ))}
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
                        {seoDescription || description}
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
