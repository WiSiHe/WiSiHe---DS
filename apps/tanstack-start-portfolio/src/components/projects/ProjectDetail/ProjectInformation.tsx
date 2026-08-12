'use client';

import {
  IconCalendar,
  IconCircleCheck,
  IconCircleX,
  IconEye,
  IconEyeOff,
  IconHelp,
  IconLoader2,
  IconPlayerPause,
} from '@tabler/icons-react';
import { Chip } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import CustomPortableText from '@/components/cms/PortableText/PortableText';
import { ShareButton } from '@/components/detail/ShareButton';
import {
  getProjectDisplayTitle,
  getProjectTypeLabel,
} from '@/components/projects/projectCardHelpers';

const STATUS_CONFIG = {
  abandoned: { icon: IconEyeOff, label: 'Abandoned' },
  cancelled: { icon: IconCircleX, label: 'Cancelled' },
  completed: { icon: IconCircleCheck, label: 'Completed' },
  inProgress: { icon: IconLoader2, label: 'In Progress' },
  notStarted: { icon: IconPlayerPause, label: 'Not Started' },
  onHold: { icon: IconPlayerPause, label: 'On Hold' },
  planned: { icon: IconCalendar, label: 'Planned' },
  unknown: { icon: IconHelp, label: 'Unknown' },
} as const;

function getProjectYearMeta(projectStart?: string | null, projectEnd?: string | null) {
  const start = projectStart ? new Date(projectStart).getFullYear() : null;
  const end = projectEnd ? new Date(projectEnd).getFullYear() : null;
  if (start && end && start !== end) return `${start}–${end}`;
  if (start && !end) return `Started ${start}`;
  if (start) return String(start);
  return null;
}

type ProjectInformationProps = {
  project: Record<string, any>;
  summary?: readonly Record<string, unknown>[] | null;
};

export function ProjectInformation({ project, summary }: ProjectInformationProps) {
  const {
    name,
    client,
    status = 'unknown',
    projectStart,
    projectEnd,
    projectType,
    tags: rawTags = [],
    viewsCount = 0,
  } = project;

  const projectTitle = getProjectDisplayTitle({ name, client });
  const typeLabel = getProjectTypeLabel(projectType);
  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.unknown;
  const StatusIcon = statusConfig.icon;
  const yearMeta = getProjectYearMeta(projectStart, projectEnd);
  const tags = rawTags ?? [];

  return (
    <div className='rounded-2xl border border-border/80 bg-surface p-5 shadow-sm md:p-6'>
      <div className='space-y-5'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0 space-y-2'>
            <div className='flex flex-wrap items-center gap-2'>
              {typeLabel ? (
                <span className='rounded-full border border-border/60 bg-surface-subtle px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground-muted'>
                  {typeLabel}
                </span>
              ) : null}
              {client?.trim() ? (
                <span className='text-[10px] font-semibold uppercase tracking-[0.14em] text-accent'>
                  {client.trim()}
                </span>
              ) : null}
            </div>
            <h1 className='font-serif text-2xl font-bold leading-tight text-foreground md:text-3xl'>
              {name || 'Untitled Project'}
            </h1>
          </div>
          <ShareButton title={projectTitle} />
        </div>

        <div className='flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-foreground-subtle'>
          <span className='inline-flex items-center gap-1.5'>
            <StatusIcon
              className={cn('size-3.5', status === 'inProgress' && 'animate-spin')}
              stroke={2}
              aria-hidden
            />
            <span className='font-medium text-foreground'>{statusConfig.label}</span>
          </span>
          {yearMeta ? (
            <>
              <span aria-hidden>·</span>
              <span className='inline-flex items-center gap-1.5'>
                <IconCalendar className='size-3.5' stroke={2} aria-hidden />
                <span className='font-medium text-foreground'>{yearMeta}</span>
              </span>
            </>
          ) : null}
          <span aria-hidden>·</span>
          <span className='inline-flex items-center gap-1.5'>
            <IconEye className='size-3.5' stroke={2} aria-hidden />
            <span className='font-medium text-foreground'>{viewsCount ?? 0}</span>
          </span>
        </div>

        {tags.length > 0 ? (
          <div className='flex flex-wrap items-center gap-2'>
            {tags.map((tag: { name?: string | null }) =>
              tag.name ? <Chip key={tag.name} variation='primary' label={tag.name} /> : null,
            )}
          </div>
        ) : null}

        {summary && summary.length > 0 ? (
          <div className='space-y-3 border-t border-border/60 pt-5'>
            <h2 className='text-[11px] font-semibold uppercase tracking-wider text-foreground-muted'>
              Overview
            </h2>
            <CustomPortableText variant='minimal' value={summary as any} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
