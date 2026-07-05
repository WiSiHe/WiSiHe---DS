'use client';

import { IconArrowUpRight } from '@tabler/icons-react';
import type { ProjectQueryResult } from '@wisihe/sanity-queries';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@wisihe/ui-react';
import { getProjectDisplayTitle } from '@/app/components/projects/projectCardHelpers';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';
import {
  displayHost,
  getConnectedPagePresentation,
} from '@/lib/projects/connectedPagePresentation';

type ProjectLiveSiteCardProps = {
  project: NonNullable<ProjectQueryResult>;
};

export function ProjectLiveSiteCard({ project }: ProjectLiveSiteCardProps) {
  const { _id, name, client, connectedPage } = project;
  if (!connectedPage) return null;

  const projectTitle = getProjectDisplayTitle({ name, client });
  const host = displayHost(connectedPage);
  const presentation = getConnectedPagePresentation(connectedPage);

  const handleVisitClick = () => {
    trackEvent(AnalyticsEvent.PROJECT_EXTERNAL_LINK_CLICKED, {
      project_id: _id,
      project_name: projectTitle,
      external_url: connectedPage,
      external_host: host,
      link_kind: presentation.kind,
    });
  };

  return (
    <Card variant='default' padding='md' className='rounded-2xl shadow-sm'>
      <CardHeader padding='md' className='pb-0'>
        <p className='text-xs font-semibold uppercase tracking-wider text-foreground-muted'>
          {presentation.eyebrow}
        </p>
        <CardTitle size='sm' className='mt-1 truncate font-medium'>
          {presentation.title}
        </CardTitle>
      </CardHeader>
      <CardContent padding='md' className='pt-2'>
        <CardDescription>{presentation.description}</CardDescription>
      </CardContent>
      <CardFooter padding='md' className='pt-0'>
        <Button
          as='a'
          href={connectedPage}
          target='_blank'
          rel='noopener noreferrer'
          variant='primary'
          size='large'
          Icon={IconArrowUpRight}
          iconPosition='right'
          className='w-full rounded-full'
          onClick={handleVisitClick}
        >
          {presentation.cta}
        </Button>
      </CardFooter>
    </Card>
  );
}
