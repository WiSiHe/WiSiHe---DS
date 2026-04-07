'use client';

import type { GetAllProjectsResult } from '@wisihe/sanity-queries';
import { useState } from 'react';
import OngoingProjectCard from './OngoingProjectCard';
import PastProjectCard from './PastProjectCard';
import ProjectFilter from './ProjectFilter';

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
    <section className='flex flex-col w-full gap-6'>
      <ProjectFilter
        tags={tags}
        activeFilters={activeFilters}
        onToggleFilter={handleToggleFilter}
        onClearAll={clearAllFilters}
        totalFilteredCount={totalFilteredCount}
        totalCount={totalCount}
      />

      {activeFilters.length > 0 && totalFilteredCount === 0 && (
        <div className='text-center py-12 px-4'>
          <p className='text-lg text-foreground-subtle mb-2'>
            No projects found with the selected filters.
          </p>
          <button
            type='button'
            onClick={clearAllFilters}
            className='text-accent hover:text-accent-hover hover:underline transition-colors duration-200'
          >
            Clear filters
          </button>
        </div>
      )}

      {filteredOngoingProjects.length > 0 && (
        <div className='space-y-6'>
          <h2 className='text-2xl font-semibold font-serif text-foreground'>Ongoing Projects</h2>
          <ul className='grid w-full grid-cols-1 gap-6 lg:gap-8'>
            {filteredOngoingProjects.map((project, index) => (
              <OngoingProjectCard key={project._id} project={project} index={index} />
            ))}
          </ul>
        </div>
      )}

      {filteredPastProjects.length > 0 && (
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold font-serif text-foreground'>Past Projects</h2>
          <ul className='grid w-full grid-cols-12 gap-4 lg:gap-6'>
            {filteredPastProjects.map((project, index) => (
              <PastProjectCard key={project._id} project={project} index={index} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default ProjectCategories;
