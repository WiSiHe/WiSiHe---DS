/** Matches project `status` values from Sanity for readable labels. */
export const PROJECT_STATUS_LABELS: Record<string, string> = {
  inProgress: 'In progress',
  onHold: 'On hold',
  notStarted: 'Not started',
  planned: 'Planned',
  completed: 'Completed',
  cancelled: 'Cancelled',
  abandoned: 'Abandoned',
  unknown: 'Unknown',
};

export function formatProjectStatusLabel(status: string): string {
  if (PROJECT_STATUS_LABELS[status]) return PROJECT_STATUS_LABELS[status];
  return status
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function formatDateRange(start?: string | null, end?: string | null) {
  if (!start) return null;
  const startYear = new Date(start).getFullYear();
  if (!end) return `${startYear} — Present`;
  const endYear = new Date(end).getFullYear();
  return startYear === endYear ? `${startYear}` : `${startYear} — ${endYear}`;
}

export function toDateTimeAttr(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}
