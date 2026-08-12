import { createFileRoute } from '@tanstack/react-router';
import type { GetAllProjectsResult } from '@wisihe/sanity-queries';
import { PageHero } from '../components/layout/PageHero';
import ProjectCategories from '../components/projects/ProjectCategories/ProjectCategories';
import { buildHead } from '../lib/seo';
import { getProjects } from '../server/fns';

export const Route = createFileRoute('/projects/')({
  loader: () => getProjects(),
  head: () =>
    buildHead({
      title: 'Projects | WiSiHe',
      description: 'Engineering and design projects by Henrik Sissener.',
      path: '/projects',
    }),
  component: Projects,
});

function Projects() {
  const { ongoingProjects, pastProjects, tags } = Route.useLoaderData() as GetAllProjectsResult;

  return (
    <div className='container mx-auto px-4 pt-32 pb-20'>
      <PageHero
        eyebrow='Work'
        title='Projects'
        description='A selection of engineering and design projects — case studies, experiments, and shipped work.'
      />

      <ProjectCategories
        ongoingProjects={ongoingProjects}
        pastProjects={pastProjects}
        tags={tags}
      />
    </div>
  );
}
