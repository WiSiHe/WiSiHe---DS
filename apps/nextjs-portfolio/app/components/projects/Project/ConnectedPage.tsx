'use client';

import { IconArrowUpRight } from '@tabler/icons-react';
import type { ProjectQueryResult } from '@wisihe/sanity-queries';
import { Button } from '@wisihe/ui-react';
import Image from 'next/image';
import { getProjectDisplayTitle } from '@/app/components/projects/projectCardHelpers';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';
import { urlForImage } from '@/sanity/lib/utils';

type ConnectedPageProps = {
  project: NonNullable<ProjectQueryResult>;
};

function displayHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const ConnectedPage = ({ project }: ConnectedPageProps) => {
  const { _id, name, client, connectedPage, image } = project;
  const projectTitle = getProjectDisplayTitle({ name, client });

  if (!connectedPage) {
    return null;
  }

  const previewUrl = image ? urlForImage(image)?.width(1600).height(900).fit('crop').url() : null;
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
    <section className='max-w-7xl mx-auto px-4 py-8 lg:py-12'>
      <div className='space-y-6'>
        <div className='space-y-2'>
          <h2 className='text-2xl font-semibold font-serif text-foreground'>Live project</h2>
          <p className='text-foreground-subtle text-sm md:text-base max-w-prose'>
            Visit the live site on {host}. External sites are not embedded here for performance,
            privacy, and compatibility.
          </p>
        </div>

        <div className='rounded-xl border border-border/20 bg-surface overflow-hidden'>
          {previewUrl ? (
            <div className='relative aspect-video bg-surface-subtle'>
              <Image
                src={previewUrl}
                alt={`Preview image for ${projectTitle}`}
                fill
                className='object-cover'
                sizes='(max-width: 1280px) 100vw, 1280px'
                priority={false}
              />
              <div className='absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent' />
            </div>
          ) : null}

          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 md:p-6'>
            <div className='min-w-0'>
              <p className='text-sm text-foreground-muted'>External link</p>
              <p className='font-medium text-foreground truncate'>{host}</p>
            </div>
            <Button
              as='a'
              href={connectedPage}
              target='_blank'
              rel='noopener noreferrer'
              variant='primary'
              size='large'
              Icon={IconArrowUpRight}
              iconPosition='right'
              className='rounded-full shrink-0'
              onClick={handleVisitClick}
            >
              Visit live site
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectedPage;
