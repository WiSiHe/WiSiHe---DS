import { createFileRoute, notFound } from '@tanstack/react-router';
import { NotFoundMessage } from '../components/layout/PageHero';
import { ProjectDetailView } from '../components/projects/ProjectDetail/ProjectDetailView';
import { portableTextToPlainText } from '../lib/portableText';
import { buildHead } from '../lib/seo';
import { buildBreadcrumbJsonLd } from '../lib/seo/jsonLd';
import { buildProjectStructuredData } from '../lib/seo/structuredData';
import { getProject, imageUrl } from '../server/fns';

export const Route = createFileRoute('/projects/$slug')({
  loader: async ({ params }) => {
    const project = await getProject({ data: { slug: params.slug } });
    if (!project?._id) throw notFound();
    return project;
  },
  head: ({ loaderData }) => {
    const displayName = loaderData?.name || 'Project';
    const structuredData = loaderData
      ? buildProjectStructuredData({
          slug: loaderData.slug,
          name: displayName,
          description:
            loaderData?.seo?.description || portableTextToPlainText(loaderData?.content, 160),
          imageUrl: imageUrl(loaderData?.seo?.image ?? loaderData?.image, 1200, 630),
          projectType: loaderData?.projectType,
          projectStart: loaderData?.projectStart,
          projectEnd: loaderData?.projectEnd,
          tags: loaderData?.tags?.map((t: { name?: string }) => t.name).filter(Boolean),
        })
      : null;
    const breadcrumbData = buildBreadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
      { name: displayName, path: `/projects/${loaderData?.slug}` },
    ]);

    return buildHead({
      title: loaderData?.seo?.title || loaderData?.name || 'Project',
      description:
        loaderData?.seo?.description ||
        portableTextToPlainText(loaderData?.content, 160) ||
        `Project by Henrik Sissener`,
      path: `/projects/${loaderData?.slug}`,
      imageUrl: imageUrl(loaderData?.seo?.image ?? loaderData?.image, 1200, 630),
      noIndex: loaderData?.seo?.noIndex,
      type: 'article',
      jsonLd: structuredData ? [structuredData, breadcrumbData] : undefined,
    });
  },
  notFoundComponent: () => (
    <NotFoundMessage title='Project not found' description='This project does not exist.' />
  ),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const project = Route.useLoaderData();
  return <ProjectDetailView project={project} />;
}
