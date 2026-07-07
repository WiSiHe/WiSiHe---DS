import type { ProjectQueryResult } from '@wisihe/sanity-queries';
import { getProjectDisplayTitle } from '@/app/components/projects/projectCardHelpers';
import { collectProjectGalleryImages } from '@/lib/projects/projectGalleryImages';
import { ProjectHeroSlide } from './ProjectHeroSlide.server';
import ProjectImageGallery from './ProjectImageGallery';

type ProjectImageSectionProps = {
  project: NonNullable<ProjectQueryResult>;
};

/** Server component: LCP hero image in HTML, carousel interactivity hydrates on the client. */
export default function ProjectImageSection({ project }: ProjectImageSectionProps) {
  const { name, client, image, extraImages = [], slug } = project;
  const projectTitle = getProjectDisplayTitle({ name, client });
  const allImages = collectProjectGalleryImages(image, extraImages);

  if (allImages.length === 0) {
    return null;
  }

  const firstImage = allImages[0];
  if (!firstImage) {
    return null;
  }

  const firstAlt = firstImage.alt || `${projectTitle} — image 1`;

  return (
    <ProjectImageGallery
      projectSlug={slug ?? ''}
      projectTitle={projectTitle}
      allImages={allImages}
      heroSlide={<ProjectHeroSlide image={firstImage} alt={firstAlt} />}
    />
  );
}
