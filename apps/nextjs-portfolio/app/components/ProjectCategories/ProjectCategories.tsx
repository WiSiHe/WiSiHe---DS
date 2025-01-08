'use client';

import { GetAllProjectsResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useFeatureFlagEnabled } from 'posthog-js/react';
import { motion } from 'framer-motion';

type ProjectCategoriesProps = {
  projects: GetAllProjectsResult['projects'];
};

const ProjectCategories = ({ projects }: ProjectCategoriesProps) => {
  const flagEnabled = useFeatureFlagEnabled('new-category-page');

  // group projects by projectType in an array, make sure to return as an array
  const groupedProjects = projects.reduce(
    (
      acc: {
        projectType: string;
        projects: GetAllProjectsResult['projects'];
      }[],
      project
    ) => {
      const projectType = project.projectType;
      const existingProjects = acc.find(
        (group) => group.projectType === projectType
      );

      if (existingProjects) {
        existingProjects.projects.push(project);
      } else {
        acc.push({ projectType, projects: [project] });
      }

      return acc;
    },
    []
  ) as {
    projectType: string;
    projects: GetAllProjectsResult['projects'];
  }[];

  return (
    <>
      {!flagEnabled ? (
        <section className="flex flex-col w-full gap-5">
          {groupedProjects.map((category) => {
            return (
              <section
                key={category.projectType}
                // className="w-full"
                // style={{ marginRight: '-100vw' }}
              >
                <div className="pb-4">
                  <h2 className="capitalize">
                    <strong>{category.projectType}</strong>
                  </h2>
                </div>
                <ul className="grid w-full grid-cols-12 gap-4">
                  {category.projects.map((project) => {
                    const { title, description, image, slug } = project;
                    return (
                      <li
                        key={project._id}
                        className="relative z-10 flex flex-col items-start justify-start flex-shrink-0 w-full overflow-hidden bg-white shadow col-span-full lg:col-span-4 rounded-xl group"
                      >
                        <motion.article layout className="w-full">
                          <motion.div
                            layoutId={`image-${title}`}
                            className="relative aspect-square"
                          >
                            <Image
                              src={urlForImage(image)?.url() || ''}
                              alt={title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover scale-105"
                            />
                          </motion.div>
                          <div className="p-4">
                            <Link
                              href={`projects/${slug}`}
                              className="before:absolute before:inset-0 before:z-0"
                            >
                              <motion.h2
                                layoutId={`title-${title}`}
                                className="text-2xl font-bold"
                              >
                                {title}
                              </motion.h2>
                            </Link>
                            <p className="line-clamp-3">{description}</p>
                          </div>
                        </motion.article>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project._id}
              className="relative rounded-lg bg-tertiary overflow-clip text-dark"
            >
              <div className="relative aspect-video">
                <Image
                  src={urlForImage(project.image)?.url() || ''}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover scale-105"
                />
              </div>
              <div className="p-4">
                <Link
                  href={`projects/${project.slug}`}
                  className="before:absolute before:inset-0 before:z-0"
                >
                  <h2 className="text-2xl font-bold">{project.title}</h2>
                </Link>
                <p className="line-clamp-3">{project.description}</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
};

export default ProjectCategories;
