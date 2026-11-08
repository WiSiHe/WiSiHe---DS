'use client';

import type { ProjectQueryResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import type { ComponentProps } from 'react';
import CustomPortableText from '@/components/cms/PortableText/PortableText';
import { DetailNav } from '@/components/detail/DetailNav';
import { getProjectDisplayTitle } from '@/components/projects/projectCardHelpers';
import { isDuplicateOfEmbeddedVideo } from '@/lib/projects/connectedPagePresentation';
import { collectProjectGalleryImages } from '@/lib/projects/projectGalleryImages';
import { resolveProjectContent } from '@/lib/projects/resolveProjectContent';
import { ConnectedPaintingsCarousel } from './ConnectedPaintingsCarousel';
import { EmbeddedVideo } from './EmbeddedVideo';
import { ProjectImageGallery } from './ProjectImageGallery';
import { ProjectInformation } from './ProjectInformation';
import { ProjectLiveSiteCard } from './ProjectLiveSiteCard';

type PortableTextValue = ComponentProps<typeof CustomPortableText>['value'];

type ProjectDetailViewProps = {
  project: NonNullable<ProjectQueryResult> & {
    questions?: Array<{ _key: string; question?: string | null; answer?: string | null }> | null;
  };
};

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const displayTitle = getProjectDisplayTitle({ name: project.name, client: project.client });
  const connectedVideoUrl = project.connectedVideo?.videoUrl ?? null;
  const connectedPaintings = project.connectedPaintings ?? [];
  const { sidebarSummary, caseStudyBody } = resolveProjectContent(project.summary, project.content);
  const galleryImages = collectProjectGalleryImages(project.image, project.extraImages);
  const questions = (project.questions ?? []).filter(
    item => item.question?.trim() && item.answer?.trim(),
  );
  const hasLiveSite =
    Boolean(project.connectedPage) &&
    !isDuplicateOfEmbeddedVideo(project.connectedPage, connectedVideoUrl);
  const showRelated = connectedPaintings.length > 0 || Boolean(connectedVideoUrl) || hasLiveSite;

  return (
    <div className='min-h-screen pt-28 md:pt-32'>
      <div className='mx-auto max-w-7xl px-4'>
        <DetailNav
          backHref='/projects'
          backLabel='All projects'
          ariaLabel='Project navigation'
          className='px-0'
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
            { label: displayTitle },
          ]}
        />

        {galleryImages.length > 0 ? (
          <section className='py-4 md:py-6'>
            <ProjectImageGallery
              projectSlug={typeof project.slug === 'string' ? project.slug : undefined}
              projectTitle={displayTitle}
              images={galleryImages}
            />
          </section>
        ) : null}
      </div>

      <section className='border-t border-border/60 bg-surface-subtle/25'>
        <div className='mx-auto max-w-7xl px-4 py-10 lg:py-14'>
          <div
            className={cn(
              'grid gap-8 lg:gap-12',
              showRelated ? 'lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]' : 'grid-cols-1',
            )}
          >
            <ProjectInformation project={project} summary={sidebarSummary} />

            {showRelated ? (
              <aside
                className='space-y-6 lg:sticky lg:top-28 lg:self-start'
                aria-label='Related project content'
              >
                {hasLiveSite ? (
                  <ProjectLiveSiteCard
                    connectedPage={project.connectedPage}
                    projectTitle={displayTitle}
                  />
                ) : null}
                {connectedVideoUrl ? (
                  <div className='space-y-3'>
                    <h2 className='font-serif text-lg font-semibold text-foreground'>
                      Project video
                    </h2>
                    <EmbeddedVideo videoUrl={connectedVideoUrl} />
                  </div>
                ) : null}
                <ConnectedPaintingsCarousel paintings={connectedPaintings} />
              </aside>
            ) : null}
          </div>
        </div>
      </section>

      {caseStudyBody && caseStudyBody.length > 0 ? (
        <section
          className='border-t border-border/60 bg-surface-subtle/20 py-14 lg:py-20'
          aria-label='Project case study'
        >
          <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
            <CustomPortableText
              variant='article'
              value={caseStudyBody as unknown as PortableTextValue}
            />
          </div>
        </section>
      ) : null}
      {questions.length > 0 ? (
        <section className='border-t border-border bg-surface py-14 lg:py-20'>
          <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
            <h2 className='font-serif text-3xl font-bold text-foreground'>Project questions</h2>
            <div className='mt-8 max-w-3xl space-y-8'>
              {questions.map(item => (
                <div key={item._key}>
                  <h3 className='text-xl font-semibold text-foreground'>{item.question}</h3>
                  <p className='mt-3 whitespace-pre-line text-foreground-muted'>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
