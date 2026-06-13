'use client';

import { IconSearch, IconX } from '@tabler/icons-react';
import type { GetAllProjectsResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import ProjectsFilterAnalytics from '@/app/components/analytics/ProjectsFilterAnalytics';
import OngoingProjectCard from './OngoingProjectCard';
import PastProjectCard from './PastProjectCard';
import ProjectFilter from './ProjectFilter';

type ProjectCategoriesProps = {
  ongoingProjects: GetAllProjectsResult['ongoingProjects'];
  pastProjects: GetAllProjectsResult['pastProjects'];
  tags: GetAllProjectsResult['tags'];
};

// Project type tab definitions
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
  const name = (project.name ?? '').toLowerCase();
  const desc = (project.seoDescription ?? '').toLowerCase();
  return name.includes(q) || desc.includes(q);
}

function matchesType(project: ProjectItem, type: string): boolean {
  if (type === 'all') return true;
  return project.projectType === type;
}

function matchesTags(project: ProjectItem, filters: string[]): boolean {
  if (filters.length === 0) return true;
  return project.tags?.some(tag => filters.includes(tag.name ?? '')) ?? false;
}

const ProjectCategories = ({ ongoingProjects, pastProjects, tags }: ProjectCategoriesProps) => {
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

  // Count per type across all projects
  const typeCounts = useMemo(() => {
    const all = [...ongoingProjects, ...pastProjects];
    const counts: Record<string, number> = {};
    counts['all'] = all.length;
    for (const p of all) {
      const t = p.projectType as string;
      counts[t] = (counts[t] ?? 0) + 1;
    }
    return counts;
  }, [ongoingProjects, pastProjects]);

  return (
    <section className='flex flex-col w-full gap-6'>
      <ProjectsFilterAnalytics
        activeType={activeType}
        activeTags={activeFilters}
        searchQuery={searchQuery}
        resultCount={totalFiltered}
        totalCount={totalCount}
      />
      {/* ── Type tabs ─────────────────────────────────────────────── */}
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
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
                activeType === key
                  ? 'bg-accent text-accent-contrast border-accent'
                  : 'bg-surface text-foreground-subtle border-border hover:border-accent-border hover:text-foreground',
              )}
            >
              {label}
              <span
                className={cn(
                  'text-xs rounded-full px-1.5 py-0.5 font-semibold',
                  activeType === key ? 'bg-accent-contrast/20' : 'bg-surface-subtle',
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Search + tag filter row ───────────────────────────────── */}
      <div className='flex flex-col sm:flex-row gap-3'>
        {/* Search input */}
        <div className='relative flex-1'>
          <IconSearch className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none' />
          <input
            type='text'
            placeholder='Search projects...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full pl-9 pr-9 py-2.5 rounded-full bg-surface border border-border text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent transition-colors'
          />
          {searchQuery && (
            <button
              type='button'
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors'
              aria-label='Clear search'
            >
              <IconX className='w-4 h-4' />
            </button>
          )}
        </div>

        {/* Tag filter (existing bottom sheet) */}
        <ProjectFilter
          tags={tags}
          activeFilters={activeFilters}
          onToggleFilter={handleToggleFilter}
          onClearAll={() => setActiveFilters([])}
          totalFilteredCount={totalFiltered}
          totalCount={totalCount}
        />
      </div>

      {/* ── Results summary ──────────────────────────────────────── */}
      {hasActiveFilters && (
        <div className='flex items-center justify-between text-sm'>
          <span className='text-foreground-muted'>
            {totalFiltered === totalCount
              ? `${totalCount} projects`
              : `${totalFiltered} of ${totalCount} projects`}
          </span>
          <button
            type='button'
            onClick={clearAllFilters}
            className='text-accent hover:text-accent-hover hover:underline transition-colors'
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────── */}
      {hasActiveFilters && totalFiltered === 0 && (
        <div className='text-center py-16 px-4'>
          <p className='text-lg text-foreground-subtle mb-2'>No projects match your search.</p>
          <button
            type='button'
            onClick={clearAllFilters}
            className='text-accent hover:underline transition-colors'
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ── Ongoing projects ─────────────────────────────────────── */}
      <AnimatePresence mode='wait'>
        {filteredOngoing.length > 0 && (
          <motion.div
            key='ongoing'
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className='space-y-4'
          >
            <h2 className='text-xl font-semibold font-serif text-foreground flex items-center gap-2'>
              Ongoing
              <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
            </h2>
            <ul className='grid w-full grid-cols-1 gap-6'>
              {filteredOngoing.map((project, index) => (
                <OngoingProjectCard key={project._id} project={project} index={index} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Past projects ────────────────────────────────────────── */}
      <AnimatePresence mode='wait'>
        {filteredPast.length > 0 && (
          <motion.div
            key='past'
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, delay: filteredOngoing.length > 0 ? 0.05 : 0 }}
            className='space-y-4'
          >
            {filteredOngoing.length > 0 && (
              <h2 className='text-xl font-semibold font-serif text-foreground'>Past Projects</h2>
            )}
            <ul className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {filteredPast.map((project, index) => (
                <PastProjectCard
                  key={project._id}
                  project={project}
                  isLcpCandidate={filteredOngoing.length === 0 && index === 0}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectCategories;
