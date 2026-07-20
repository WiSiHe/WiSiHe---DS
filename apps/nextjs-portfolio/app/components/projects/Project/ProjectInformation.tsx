'use client';
import {
  IconCalendar,
  IconCircleCheck,
  IconCircleX,
  IconEye,
  IconEyeOff,
  IconHeart,
  IconHeartFilled,
  IconHelp,
  IconLoader2,
  IconPlayerPause,
  IconShare,
} from '@tabler/icons-react';
import type { ProjectQueryResult } from '@wisihe/sanity-queries';
import { Button, Chip } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import type { PortableTextBlock } from 'next-sanity';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { incrementProjectLike, incrementProjectView, removeProjectLike } from '@/app/actions';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';
import CustomPortableText from '../../cms/PortableText/PortableText';
import { getProjectDisplayTitle, getProjectTypeLabel } from '../projectCardHelpers';

type ProjectInformationProps = {
  project: NonNullable<ProjectQueryResult>;
  summary?: PortableTextBlock[] | null;
};

// Status configuration object for better maintainability
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

const TECH_TAG_NAMES = [
  'React',
  'NextJS',
  'TypeScript',
  'Typescript',
  'TailwindCSS',
  'Turborepo',
  'GraphQL',
  'CSS',
  'HTML',
  'Javascript',
  'JavaScript',
  'PHP',
  'Wordpress',
  'Vite',
  'Redux',
  'Unity',
  'C#',
  'Flash',
  'Unreal Engine 4',
  'Unreal Engine 5',
  'Blender',
  'ZBrush',
  'Substance Painter',
  'Figma',
  'Tokens',
  'Designsystem',
  'EnonicXP',
  'ThreeJS',
  'Framer Motion',
  'Speed Tree',
  'NextAuth',
  'Sanity',
] as const;

function getProjectYearMeta(projectStart?: string | null, projectEnd?: string | null) {
  const start = projectStart ? new Date(projectStart).getFullYear() : null;
  const end = projectEnd ? new Date(projectEnd).getFullYear() : null;
  const startDate = projectStart ? new Date(projectStart) : null;
  const endDate = projectEnd ? new Date(projectEnd) : null;
  const sameDay = startDate && endDate && startDate.toDateString() === endDate.toDateString();

  if (start && end && start !== end) return `${start}–${end}`;
  if (start && !end) return `Started ${start}`;
  if (sameDay || (start && end && start === end)) return String(start);
  return null;
}

type MetaStatProps = Readonly<{
  label: string;
  children: ReactNode;
}>;

function MetaStat({ label, children }: MetaStatProps) {
  return (
    <div className='inline-flex items-center gap-1.5 text-sm text-foreground'>
      <span className='sr-only'>{label}</span>
      {children}
    </div>
  );
}

const ProjectInformation = ({ project, summary }: ProjectInformationProps) => {
  const _id = project?._id ?? '';
  const likesCount = project?.likesCount;

  const generateOrRetrieveViewerId = useCallback((): string => {
    try {
      let viewerId = localStorage.getItem('viewerId');
      if (!viewerId) {
        viewerId = crypto.randomUUID();
        localStorage.setItem('viewerId', viewerId);
      }
      return viewerId;
    } catch (error) {
      console.error('Failed to access localStorage:', error);
      return crypto.randomUUID();
    }
  }, []);

  const [hasAddedView, setHasAddedView] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState<number>(likesCount ?? 0);
  const [hasLikedLocal, setHasLikedLocal] = useState(false);
  const [shareText, setShareText] = useState('Share');

  // Check if liked previously
  useEffect(() => {
    if (!_id) return;
    try {
      const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '{}');
      if (likedProjects[_id]) {
        setHasLikedLocal(true);
      }
    } catch (err) {
      console.error('Failed to parse likedProjects from localStorage', err);
    }
  }, [_id]);

  // On mount, track project view via PostHog + increment Sanity counter
  useEffect(() => {
    if (!_id || hasAddedView) return;
    setHasAddedView(true);
    const storageKey = `viewed_project_${_id}`;
    try {
      if (localStorage.getItem(storageKey)) return;
    } catch {
      /* private browsing — still attempt to count */
    }

    trackEvent(AnalyticsEvent.PROJECT_VIEWED, {
      project_id: _id,
      name: project?.name,
    });
    void incrementProjectView(_id).then(result => {
      if (!result.success) return;
      try {
        localStorage.setItem(storageKey, '1');
      } catch {
        /* ignore */
      }
    });
  }, [_id, hasAddedView, project?.name]);

  if (!project) {
    return null;
  }

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
  const tags = rawTags ?? [];

  const projectTitle = getProjectDisplayTitle({ name, client });
  const clientLabel = client?.trim() || null;
  const typeLabel = getProjectTypeLabel(projectType);
  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.unknown;
  const StatusIcon = statusConfig.icon;

  const handleLike = async () => {
    const likerId = generateOrRetrieveViewerId();

    if (hasLikedLocal) {
      setLocalLikesCount(prev => Math.max(0, prev - 1));
      setHasLikedLocal(false);

      try {
        const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '{}');
        delete likedProjects[_id];
        localStorage.setItem('likedProjects', JSON.stringify(likedProjects));
      } catch (err) {
        console.error('Failed to update likedProjects in localStorage', err);
      }

      trackEvent(AnalyticsEvent.PROJECT_UNLIKED, { project_id: _id });
      await removeProjectLike(_id, likerId);
    } else {
      setLocalLikesCount(prev => prev + 1);
      setHasLikedLocal(true);

      try {
        const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '{}');
        likedProjects[_id] = true;
        localStorage.setItem('likedProjects', JSON.stringify(likedProjects));
      } catch (err) {
        console.error('Failed to update likedProjects in localStorage', err);
      }

      trackEvent(AnalyticsEvent.PROJECT_LIKED, { project_id: _id });
      await incrementProjectLike(_id, likerId);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: projectTitle,
          url,
        });
      } catch (err) {
        console.error('Error sharing natively', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareText('Copied!');
        setTimeout(() => setShareText('Share'), 2500);
      } catch (err) {
        console.error('Failed to copy to clipboard', err);
      }
    }
  };

  // Separate tags into tech and non-tech for display
  const techTags = tags.filter(t =>
    TECH_TAG_NAMES.includes((t.name ?? '') as (typeof TECH_TAG_NAMES)[number]),
  );
  const otherTags = tags.filter(t => !techTags.includes(t));
  const yearMeta = getProjectYearMeta(projectStart, projectEnd);

  return (
    <motion.div
      layout
      className='rounded-2xl border border-border/80 bg-surface p-5 shadow-sm md:p-6'
    >
      <div className='space-y-5'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0 space-y-2'>
            <div className='flex flex-wrap items-center gap-2'>
              {typeLabel ? (
                <span className='rounded-full border border-border/60 bg-surface-subtle px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground-muted'>
                  {typeLabel}
                </span>
              ) : null}
              {clientLabel ? (
                <span className='text-[10px] font-semibold uppercase tracking-[0.14em] text-accent'>
                  {clientLabel}
                </span>
              ) : null}
            </div>
            <motion.h1
              className='text-2xl font-bold font-serif text-foreground leading-tight md:text-3xl'
              layoutId={`title-${projectTitle}`}
            >
              {name || 'Untitled Project'}
            </motion.h1>
          </div>

          <div className='flex shrink-0 items-center gap-2'>
            <Button
              onClick={handleLike}
              variant='secondary'
              size='small'
              className={cn(
                'gap-1.5 rounded-full px-3 shadow-sm transition-colors',
                hasLikedLocal
                  ? 'text-red-500 hover:text-red-500 border-red-500/20 bg-red-500/10 hover:bg-red-500/20'
                  : '',
              )}
            >
              {hasLikedLocal ? (
                <IconHeartFilled className='size-3.5' stroke={2} aria-hidden />
              ) : (
                <IconHeart className='size-3.5' stroke={2} aria-hidden />
              )}
              {hasLikedLocal ? 'Liked' : 'Like'}
            </Button>
            <Button
              onClick={handleShare}
              variant='secondary'
              size='small'
              className='gap-1.5 rounded-full px-3 shadow-sm'
            >
              <IconShare className='size-3.5' stroke={2} aria-hidden />
              {shareText}
            </Button>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-foreground-subtle'>
          <MetaStat label='Status'>
            <StatusIcon
              className={cn('size-3.5', status === 'inProgress' && 'animate-spin')}
              stroke={2}
              aria-hidden
            />
            <span className='font-medium text-foreground'>{statusConfig.label}</span>
          </MetaStat>

          {yearMeta ? (
            <>
              <span className='text-border' aria-hidden>
                ·
              </span>
              <MetaStat label='Timeline'>
                <IconCalendar className='size-3.5' stroke={2} aria-hidden />
                <span className='font-medium text-foreground'>{yearMeta}</span>
              </MetaStat>
            </>
          ) : null}

          <span className='text-border' aria-hidden>
            ·
          </span>
          <MetaStat label='Views'>
            <IconEye className='size-3.5' stroke={2} aria-hidden />
            <span className='font-medium text-foreground'>{viewsCount?.toString() ?? '0'}</span>
          </MetaStat>

          <span className='text-border' aria-hidden>
            ·
          </span>
          <MetaStat label='Likes'>
            {hasLikedLocal ? (
              <IconHeartFilled className='size-3.5 text-red-500' stroke={2} aria-hidden />
            ) : (
              <IconHeart className='size-3.5' stroke={2} aria-hidden />
            )}
            <span className={cn('font-medium', hasLikedLocal ? 'text-red-500' : 'text-foreground')}>
              {localLikesCount}
            </span>
          </MetaStat>
        </div>

        {techTags.length > 0 || otherTags.length > 0 ? (
          <div className='flex flex-wrap items-center gap-2'>
            {techTags.map((tag: { name?: string | null }) => (
              <Chip key={tag.name ?? ''} variation='secondary' label={tag.name ?? ''} />
            ))}
            {otherTags.map((tag: { name?: string | null }) => (
              <Chip key={tag.name ?? ''} variation='primary' label={tag.name ?? ''} />
            ))}
          </div>
        ) : null}

        {summary && summary.length > 0 ? (
          <div className='space-y-3 border-t border-border/60 pt-5'>
            <h2 className='text-[11px] font-semibold uppercase tracking-wider text-foreground-muted'>
              Overview
            </h2>
            <CustomPortableText variant='minimal' value={summary} />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default ProjectInformation;
