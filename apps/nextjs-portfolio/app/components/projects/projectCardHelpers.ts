import { portableTextToPlainText } from '@/sanity/lib/utils';

export { formatProjectStatusLabel } from '@/app/components/projects/FeaturedProjects/featuredProjectHelpers';

export const PROJECT_TYPE_LABEL: Record<string, string> = {
  development: 'Development',
  gameDevelopment: 'Game Dev',
  design: 'Design',
  other: 'Other',
};

export function getProjectTypeLabel(projectType?: string | null): string | null {
  if (!projectType) return null;
  return PROJECT_TYPE_LABEL[projectType] ?? null;
}

export function getProjectCardExcerpt(
  summary: readonly Record<string, unknown>[] | null | undefined,
  seoDescription?: string | null,
  maxLength = 200,
): string {
  const fromSummary = portableTextToPlainText(summary, maxLength);
  if (fromSummary) return fromSummary;

  const seo = seoDescription?.trim() ?? '';
  if (!seo) return '';
  if (seo.length <= maxLength) return seo;
  return `${seo.slice(0, maxLength).trimEnd()}…`;
}

type ProjectTitleFields = {
  name?: string | null;
  client?: string | null;
};

/** Full display string for cards, breadcrumbs, and share dialogs. */
export function getProjectDisplayTitle({ name, client }: ProjectTitleFields): string {
  const title = name?.trim() ?? '';
  const context = client?.trim() ?? '';
  if (context && title) return `${context} — ${title}`;
  return title || 'Untitled Project';
}

/** SEO-friendly title — prefers explicit seo.title, falls back to display title. */
export function getProjectSeoFallbackTitle({ name, client }: ProjectTitleFields): string {
  return getProjectDisplayTitle({ name, client });
}
