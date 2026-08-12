'use client';

import { IconSearch, IconX } from '@tabler/icons-react';
import type { GetAllProjectsResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { getProjectDisplayTitle } from '@/components/projects/projectCardHelpers';
import OngoingProjectCard from './OngoingProjectCard';
import PastProjectCard from './PastProjectCard';
import ProjectFilter from './ProjectFilter';

type ProjectCategoriesProps = {
  ongoingProjects: GetAllProjectsResult['ongoingProjects'];
  pastProjects: GetAllProjectsResult['pastProjects'];
  tags: GetAllProjectsResult['tags'];
};

const PROJECT_TYPES = [
  { key: 'all', label: 'All' },
  { key: 'development', label: 'Development' },
  { key: 'gameDevelopment', label: 'Game Dev' },
  { key: 'design', label: 'Design' },
  { key: 'other', label: 'Other' },
] as const;

type ProjectItem =
  | GetAllProjectsResult['ongoingProjects'][number]
  | GetAllProjectsResult['pastProjects'][number];

function matchesSearch(project: ProjectItem, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const displayTitle = getProjectDisplayTitle({
    name: project.name,
    client: project.client,
  }).toLowerCase();
  const desc = (project.seoDescription ?? '').toLowerCase();
  return displayTitle.includes(q) || desc.includes(q);
}

function matchesType(project: ProjectItem, type: string): boolean {
  if (type === 'all') return true;
  return project.projectType === type;
}

function matchesTags(project: ProjectItem, filters: string[]): boolean {
  if (filters.length === 0) return true;
  return project.tags?.some(tag => filters.includes(tag.name ?? '')) ?? false;
}

export default function ProjectCategories({
  ongoingProjects,
  pastProjects,
  tags,
}: ProjectCategoriesProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeType, setActiveType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleFilter = (tag: string) => {
    setActiveFilters(prev => (prev.includes(tag) ? prev.filter(f => f !== tag) : [...prev, tag]));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
    setActiveType('all');
  };

  const filterProjects = (projects: ProjectItem[]) =>
    projects.filter(
      p =>
        matchesSearch(p, searchQuery) &&
        matchesType(p, activeType) &&
        matchesTags(p, activeFilters),
    );

  const filteredOngoing = useMemo(
    () => filterProjects(ongoingProjects),
    [ongoingProjects, searchQuery, activeType, activeFilters],
  );
  const filteredPast = useMemo(
    () => filterProjects(pastProjects),
    [pastProjects, searchQuery, activeType, activeFilters],
  );

  const totalFiltered = filteredOngoing.length + filteredPast.length;
  const totalCount = ongoingProjects.length + pastProjects.length;
  const hasActiveFilters =
    activeFilters.length > 0 || activeType !== 'all' || searchQuery.length > 0;

  const typeCounts = useMemo(() => {
    const all = [...ongoingProjects, ...pastProjects];
    const counts: Record<string, number> = {};
    counts.all = all.length;
    for (const p of all) {
      const t = p.projectType as string;
      counts[t] = (counts[t] ?? 0) + 1;
    }
    return counts;
  }, [ongoingProjects, pastProjects]);

  return (
    <section className='flex w-full flex-col gap-6'>
      <div className='flex flex-wrap gap-2'>
        {PROJECT_TYPES.map(({ key, label }) => {
          const count = typeCounts[key] ?? 0;
          if (count === 0 && key !== 'all') return null;
          return (
            <button
              key={key}
              type='button'
              onClick={() => setActiveType(key)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
                activeType === key
                  ? 'border-accent bg-accent text-accent-contrast'
                  : 'border-border bg-surface text-foreground-subtle hover:border-accent-border hover:text-foreground',
              )}
            >
              {label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-xs font-semibold',
                  activeType === key ? 'bg-accent-contrast/20' : 'bg-surface-subtle',
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className='flex flex-col gap-3 sm:flex-row'>
        <div className='relative flex-1'>
          <IconSearch className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted' />
          <input
            type='text'
            placeholder='Search projects...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full rounded-full border border-border bg-surface py-2.5 pl-9 pr-9 text-sm text-foreground transition-colors placeholder:text-foreground-muted focus:border-accent focus:outline-none'
          />
          {searchQuery ? (
            <button
              type='button'
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted transition-colors hover:text-foreground'
              aria-label='Clear search'
            >
              <IconX className='h-4 w-4' />
            </button>
          ) : null}
        </div>

        <ProjectFilter
          tags={tags}
          activeFilters={activeFilters}
          onToggleFilter={handleToggleFilter}
          onClearAll={() => setActiveFilters([])}
          totalFilteredCount={totalFiltered}
          totalCount={totalCount}
        />
      </div>

      {hasActiveFilters ? (
        <div className='flex items-center justify-between text-sm'>
          <span className='text-foreground-muted'>
            {totalFiltered === totalCount
              ? `${totalCount} projects`
              : `${totalFiltered} of ${totalCount} projects`}
          </span>
          <button
            type='button'
            onClick={clearAllFilters}
            className='text-accent transition-colors hover:text-accent-hover hover:underline'
          >
            Clear all filters
          </button>
        </div>
      ) : null}

      {hasActiveFilters && totalFiltered === 0 ? (
        <div className='px-4 py-16 text-center'>
          <p className='mb-2 text-lg text-foreground-subtle'>No projects match your search.</p>
          <button
            type='button'
            onClick={clearAllFilters}
            className='text-accent transition-colors hover:underline'
          >
            Clear filters
          </button>
        </div>
      ) : null}

      <AnimatePresence mode='wait'>
        {filteredOngoing.length > 0 ? (
          <motion.div
            key='ongoing'
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className='space-y-5'
          >
            <div>
              <p className='mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-accent'>
                {'// Active'}
              </p>
              <h2 className='font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
                Ongoing
              </h2>
            </div>
            <ul className='grid w-full grid-cols-1 gap-8'>
              {filteredOngoing.map((project, index) => (
                <OngoingProjectCard key={project._id} project={project} index={index} />
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        {filteredPast.length > 0 ? (
          <motion.div
            key='past'
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, delay: filteredOngoing.length > 0 ? 0.05 : 0 }}
            className='space-y-4'
          >
            {filteredOngoing.length > 0 ? (
              <h2 className='font-serif text-xl font-semibold text-foreground'>Past Projects</h2>
            ) : null}
            <ul className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              {filteredPast.map((project, index) => (
                <PastProjectCard
                  key={project._id}
                  project={project}
                  isLcpCandidate={filteredOngoing.length === 0 && index === 0}
                />
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
