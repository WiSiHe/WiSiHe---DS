'use client';

import { GetAllProjectsResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Chip from '../Chip/Chip';
import { useState } from 'react';

type ProjectCategoriesProps = {
  projects: GetAllProjectsResult['projects'];
  tags: GetAllProjectsResult['tags'];
};

const ProjectCategories = ({ projects, tags }: ProjectCategoriesProps) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleToggleFilter = (tag: string) => {
    if (activeFilters.includes(tag)) {
      setActiveFilters(activeFilters.filter((filter) => filter !== tag));
    } else {
      setActiveFilters([...activeFilters, tag]);
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (activeFilters.length === 0) {
      return true;
    }

    return project.tags.some((tag) => activeFilters.includes(tag.name));
  });
  return (
    <section className="flex flex-col w-full gap-5">
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const { name, _id, count } = tag;
          const isActive = activeFilters.includes(name);

          const newName = `${name} (${count})`;
          return (
            <li key={_id}>
              <button onClick={() => handleToggleFilter(name)}>
                <Chip outlined selected={isActive} label={newName} />
              </button>
            </li>
          );
        })}
      </ul>

      <h3>Displaying {filteredProjects.length} projects</h3>
      <ul className="grid w-full grid-cols-12 gap-4">
        {filteredProjects.map((project, index) => {
          const { title, name, description, image, slug, tags } = project;

          const projectTitle = title ?? name;

          return (
            <motion.li
              key={project._id}
              layout
              className="relative z-10 flex flex-col items-start justify-start flex-shrink-0 w-full overflow-hidden bg-white shadow col-span-full md:col-span-6 lg:col-span-3 rounded-xl group"
            >
              <motion.article className="w-full">
                <motion.div
                  layoutId={`image-${projectTitle}`}
                  className="relative aspect-square overflow-clip"
                >
                  <div className="absolute z-10 flex flex-wrap gap-1 p-2">
                    {tags.map((tag) => (
                      <Chip
                        variation="primary"
                        key={tag.name}
                        label={tag.name}
                      />
                    ))}
                  </div>
                  <Image
                    src={urlForImage(image)?.url() || ''}
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
                      className="text-2xl font-bold"
                    >
                      {projectTitle}
                    </motion.h2>
                  </Link>

                  <p className="line-clamp-3">{description}</p>
                </div>
              </motion.article>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
};

export default ProjectCategories;
