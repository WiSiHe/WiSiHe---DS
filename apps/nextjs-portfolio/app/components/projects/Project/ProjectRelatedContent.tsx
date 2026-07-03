import type { ProjectQueryResult } from '@wisihe/sanity-queries';
import { isDuplicateOfEmbeddedVideo } from '@/lib/projects/connectedPagePresentation';
import ConnectedPaintingsCarousel from './ConnectedPaintingsCarousel';
import EmbeddedVideo from './EmbeddedVideo';
import { ProjectLiveSiteCard } from './ProjectLiveSiteCard';

type ProjectRelatedContentProps = {
  project: NonNullable<ProjectQueryResult>;
  connectedPaintings: NonNullable<ProjectQueryResult>['connectedPaintings'];
  connectedVideoUrl?: string | null;
};

export default function ProjectRelatedContent({
  project,
  connectedPaintings,
  connectedVideoUrl,
}: ProjectRelatedContentProps) {
  const hasPaintings = (connectedPaintings?.length ?? 0) > 0;
  const hasVideo = Boolean(connectedVideoUrl);
  const hasLiveSite =
    Boolean(project.connectedPage) &&
    !isDuplicateOfEmbeddedVideo(project.connectedPage, connectedVideoUrl);

  if (!hasPaintings && !hasVideo && !hasLiveSite) {
    return null;
  }

  return (
    <aside className='space-y-6' aria-label='Related project content'>
      {hasLiveSite ? <ProjectLiveSiteCard project={project} /> : null}
      {hasVideo && connectedVideoUrl ? (
        <div className='space-y-3'>
          <h2 className='font-serif text-lg font-semibold text-foreground'>Project video</h2>
          <EmbeddedVideo videoUrl={connectedVideoUrl} />
        </div>
      ) : null}
      {hasPaintings ? <ConnectedPaintingsCarousel paintings={connectedPaintings} /> : null}
    </aside>
  );
}

export function hasProjectRelatedContent(
  project: NonNullable<ProjectQueryResult>,
  connectedPaintings: NonNullable<ProjectQueryResult>['connectedPaintings'],
  connectedVideoUrl?: string | null,
): boolean {
  const hasConnectedPage =
    Boolean(project.connectedPage) &&
    !isDuplicateOfEmbeddedVideo(project.connectedPage, connectedVideoUrl);

  return (connectedPaintings?.length ?? 0) > 0 || Boolean(connectedVideoUrl) || hasConnectedPage;
}
