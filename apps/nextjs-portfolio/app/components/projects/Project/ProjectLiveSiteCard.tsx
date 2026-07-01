'use client';

import { IconArrowUpRight } from '@tabler/icons-react';
import type { ProjectQueryResult } from '@wisihe/sanity-queries';
import { Button } from '@wisihe/ui-react';
import { getProjectDisplayTitle } from '@/app/components/projects/projectCardHelpers';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';

type ProjectLiveSiteCardProps = {
  project: NonNullable<ProjectQueryResult>;
};

function displayHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function ProjectLiveSiteCard({ project }: ProjectLiveSiteCardProps) {
  const { _id, name, client, connectedPage } = project;
  if (!connectedPage) return null;

  const projectTitle = getProjectDisplayTitle({ name, client });
  const host = displayHost(connectedPage);

  const handleVisitClick = () => {
    trackEvent(AnalyticsEvent.PROJECT_EXTERNAL_LINK_CLICKED, {
      project_id: _id,
      project_name: projectTitle,
      external_url: connectedPage,
      external_host: host,
    });
  };

  return (
    <div className='rounded-2xl border border-border/80 bg-surface p-5 shadow-sm'>
      <p className='text-xs font-semibold uppercase tracking-wider text-foreground-muted'>
        Live site
      </p>
      <p className='mt-1 truncate font-medium text-foreground'>{host}</p>
      <p className='mt-2 text-sm leading-relaxed text-foreground-subtle'>
        Opens in a new tab — not embedded for performance and privacy.
      </p>
      <Button
        as='a'
        href={connectedPage}
        target='_blank'
        rel='noopener noreferrer'
        variant='primary'
        size='large'
        Icon={IconArrowUpRight}
        iconPosition='right'
        className='mt-4 w-full rounded-full'
        onClick={handleVisitClick}
      >
        Visit live site
      </Button>
    </div>
  );
}
