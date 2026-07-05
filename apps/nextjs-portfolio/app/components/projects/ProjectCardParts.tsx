import {
  getProjectCardTags,
  ProjectCardBadge,
  ProjectCardImageOverlay as ProjectCardImageOverlayView,
  type ProjectCardImageOverlayProps as ProjectCardImageOverlayViewProps,
  ProjectCardTags,
  ProjectCardTitleBlock,
} from '@wisihe/ui-react';
import { getProjectTypeLabel } from '@/app/components/projects/projectCardHelpers';

export { ProjectCardImageFrame, type ProjectCardImageFrameProps } from './ProjectCardImageFrame';
export { getProjectCardTags, ProjectCardBadge, ProjectCardTags, ProjectCardTitleBlock };

type ProjectCardImageOverlayProps = {
  projectType?: string | null;
  year?: number | null;
  yearLabel?: string | null;
  statusLabel?: string | null;
};

/** App adapter — resolves Sanity project type label, then defers to the package overlay. */
export function ProjectCardImageOverlay({
  projectType,
  year,
  yearLabel,
  statusLabel,
}: ProjectCardImageOverlayProps) {
  const props: ProjectCardImageOverlayViewProps = {
    typeLabel: getProjectTypeLabel(projectType),
    trailingLabel: yearLabel ?? (year ? String(year) : null),
    statusLabel: statusLabel ?? null,
  };
  return <ProjectCardImageOverlayView {...props} />;
}
