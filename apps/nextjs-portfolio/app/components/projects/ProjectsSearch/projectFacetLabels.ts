/** Maps stored Sanity / Algolia facet values to short labels for filter UI */
export const PROJECT_STATUS_LABELS: Record<string, string> = {
  inProgress: 'In progress',
  completed: 'Completed',
  onHold: 'On hold',
  cancelled: 'Cancelled',
  abandoned: 'Abandoned',
  unknown: 'Unknown',
  notStarted: 'Not started',
  planned: 'Planned',
};

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  art: 'Art',
  design: 'Design',
  development: 'Development',
  gameDevelopment: 'Game development',
  other: 'Other',
};

export function labelProjectStatus(value: string): string {
  return PROJECT_STATUS_LABELS[value] ?? value;
}

export function labelProjectType(value: string): string {
  return PROJECT_TYPE_LABELS[value] ?? value;
}
