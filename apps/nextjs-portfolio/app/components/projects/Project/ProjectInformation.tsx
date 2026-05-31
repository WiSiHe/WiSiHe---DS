'use client';
import { Button, Chip } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import type { PortableTextBlock } from 'next-sanity';
import posthog from 'posthog-js';
import { useCallback, useEffect, useState } from 'react';
import { BsEye, BsHeart, BsHeartFill, BsShare } from 'react-icons/bs';
import {
  FaCalendarAlt as IconCalendar,
  FaTimesCircle as IconCancel,
  FaCheckCircle as IconCheck,
  FaEyeSlash as IconEyePause,
  FaSpinner as IconLoader,
  FaPauseCircle as IconPause,
  FaQuestionCircle as IconQuestion,
} from 'react-icons/fa';
import { incrementProjectLike, incrementProjectView, removeProjectLike } from '@/app/actions';
import CustomPortableText from '../../cms/PortableText/PortableText';

type ProjectInformationProps = {
  project: any;
};

// Status configuration object for better maintainability
const STATUS_CONFIG = {
  abandoned: { icon: IconEyePause, label: 'Abandoned' },
  cancelled: { icon: IconCancel, label: 'Cancelled' },
  completed: { icon: IconCheck, label: 'Completed' },
  inProgress: { icon: IconLoader, label: 'In Progress' },
  notStarted: { icon: IconPause, label: 'Not Started' },
  onHold: { icon: IconPause, label: 'On Hold' },
  planned: { icon: IconCalendar, label: 'Planned' },
  unknown: { icon: IconQuestion, label: 'Unknown' },
} as const;

const ProjectInformation = ({ project }: ProjectInformationProps) => {
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
    const addView = async () => {
      const storageKey = `viewed_project_${_id}`;
      try {
        if (localStorage.getItem(storageKey)) return;
        setHasAddedView(true);
        localStorage.setItem(storageKey, '1');
        posthog.capture('project_viewed', {
          project_id: _id,
          name: project?.name ?? project?.title,
        });
        await incrementProjectView(_id);
      } catch {
        posthog.capture('project_viewed', {
          project_id: _id,
          name: project?.name ?? project?.title,
        });
        await incrementProjectView(_id);
      }
    };
    void addView();
  }, [_id, hasAddedView, project]);

  if (!project) {
    return null;
  }

  const { name, status = 'unknown', projectStart, projectEnd, tags = [], viewsCount = 0 } = project;

  const projectContent = project.content as PortableTextBlock[];

  const projectTitle = name || 'Untitled Project';
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

      posthog.capture('project_unliked', { project_id: _id });
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

      posthog.capture('project_liked', { project_id: _id });
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
  const techTags = tags.filter((t: { name?: string | null }) =>
    [
      'React',
      'NextJS',
      'TypeScript',
      'TailwindCSS',
      'Turborepo',
      'GraphQL',
      'CSS',
      'HTML',
      'Javascript',
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
    ].includes(t.name ?? ''),
  );
  const otherTags = tags.filter((t: { name?: string | null }) => !techTags.includes(t));

  return (
    <motion.div layout className='space-y-8'>
      {/* Title + actions */}
      <div className='space-y-4'>
        <motion.h1
          className='text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-foreground leading-tight'
          layoutId={`title-${projectTitle}`}
        >
          {projectTitle}
        </motion.h1>

        <div className='flex items-center flex-wrap gap-3'>
          <Button
            onClick={handleLike}
            variant='secondary'
            className={cn(
              'gap-2 w-fit rounded-full pl-3 pr-4 shadow-sm transition-colors',
              hasLikedLocal
                ? 'text-red-500 hover:text-red-500 border-red-500/20 bg-red-500/10 hover:bg-red-500/20'
                : '',
            )}
          >
            {hasLikedLocal ? <BsHeartFill className='w-4 h-4' /> : <BsHeart className='w-4 h-4' />}
            {hasLikedLocal ? 'Liked' : 'Like'}
          </Button>
          <Button
            onClick={handleShare}
            variant='secondary'
            className='gap-2 w-fit rounded-full px-4 shadow-sm'
          >
            <BsShare className='w-4 h-4' />
            {shareText}
          </Button>
        </div>
      </div>

      {/* Stats panel */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
        {/* Status */}
        <div className='flex flex-col gap-1 p-3 rounded-xl bg-surface border border-border'>
          <span className='text-xs text-foreground-muted font-medium uppercase tracking-wider'>
            Status
          </span>
          <span className='flex items-center gap-1.5 text-sm font-semibold text-foreground'>
            <StatusIcon className='w-3.5 h-3.5' />
            {statusConfig.label}
          </span>
        </div>

        {/* Duration */}
        <div className='flex flex-col gap-1 p-3 rounded-xl bg-surface border border-border'>
          <span className='text-xs text-foreground-muted font-medium uppercase tracking-wider'>
            Duration
          </span>
          <span className='text-sm font-semibold text-foreground'>
            {(() => {
              const start = projectStart ? new Date(projectStart).getFullYear() : null;
              const end = projectEnd ? new Date(projectEnd).getFullYear() : null;
              if (start && end && start !== end) return `${start} – ${end}`;
              if (start && end && start === end) return String(start);
              if (start && !end) return `Since ${start}`;
              return '—';
            })()}
          </span>
        </div>

        {/* Views */}
        <div className='flex flex-col gap-1 p-3 rounded-xl bg-surface border border-border'>
          <span className='text-xs text-foreground-muted font-medium uppercase tracking-wider'>
            Views
          </span>
          <span className='flex items-center gap-1.5 text-sm font-semibold text-foreground'>
            <BsEye className='w-3.5 h-3.5' />
            {viewsCount?.toString() ?? '0'}
          </span>
        </div>

        {/* Likes */}
        <div className='flex flex-col gap-1 p-3 rounded-xl bg-surface border border-border'>
          <span className='text-xs text-foreground-muted font-medium uppercase tracking-wider'>
            Likes
          </span>
          <span
            className={cn(
              'flex items-center gap-1.5 text-sm font-semibold',
              hasLikedLocal ? 'text-red-500' : 'text-foreground',
            )}
          >
            {hasLikedLocal ? (
              <BsHeartFill className='w-3.5 h-3.5' />
            ) : (
              <BsHeart className='w-3.5 h-3.5' />
            )}
            {localLikesCount}
          </span>
        </div>
      </div>

      {/* Tech stack */}
      {techTags.length > 0 && (
        <div className='space-y-2'>
          <h3 className='text-xs text-foreground-muted font-medium uppercase tracking-wider'>
            Tech Stack
          </h3>
          <div className='flex flex-wrap gap-2'>
            {techTags.map((tag: { name?: string | null }) => (
              <Chip key={tag.name ?? ''} variation='secondary' label={tag.name ?? ''} />
            ))}
          </div>
        </div>
      )}

      {/* Other tags */}
      {otherTags.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {otherTags.map((tag: { name?: string | null }) => (
            <Chip key={tag.name ?? ''} variation='primary' label={tag.name ?? ''} />
          ))}
        </div>
      )}

      {/* Divider */}
      {projectContent && <hr className='border-border/40' />}

      {/* Content */}
      {projectContent && (
        <div className='prose prose-lg max-w-none'>
          <CustomPortableText
            value={projectContent}
            className='text-foreground-subtle leading-relaxed'
          />
        </div>
      )}
    </motion.div>
  );
};

export default ProjectInformation;
