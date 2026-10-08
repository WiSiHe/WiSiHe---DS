'use client';

import { IconArrowUpRight } from '@tabler/icons-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@wisihe/ui-react';
import { getConnectedPagePresentation } from '@/lib/projects/connectedPagePresentation';

type ProjectLiveSiteCardProps = {
  connectedPage: string;
  projectTitle: string;
};

export function ProjectLiveSiteCard({ connectedPage, projectTitle }: ProjectLiveSiteCardProps) {
  const presentation = getConnectedPagePresentation(connectedPage);

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
          aria-label={`Visit ${projectTitle} live site`}
        >
          {presentation.cta}
        </Button>
      </CardFooter>
    </Card>
  );
}
