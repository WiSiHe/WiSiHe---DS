'use client';
import type { ProjectQueryResult } from '@wisihe/sanity-queries';
import { Button } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import type { PortableTextBlock } from 'next-sanity';
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
import Chip from '../Chip/Chip';
import CustomPortableText from '../PortableText/PortableText';

type ProjectInformationProps = {
  project: ProjectQueryResult;
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
  if (!project) {
    return null;
  }

  const {
    _id,
    name,
    status = 'unknown',
    projectStart,
    projectEnd,
    tags = [],
    viewsCount,
    likesCount,
    views = [],
  } = project;

  const projectContent = project.content as PortableTextBlock[];

  const projectTitle = name || 'Untitled Project';
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
  const StatusIcon = statusConfig.icon;

  // Format dates
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

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
    try {
      const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '{}');
      if (likedProjects[_id]) {
        setHasLikedLocal(true);
      }
    } catch (err) {
      console.error('Failed to parse likedProjects from localStorage', err);
    }
  }, [_id]);

  // On mount, patch project views
  useEffect(() => {
    const addView = async () => {
      const viewerId = generateOrRetrieveViewerId();

      // Ensure views is an array
      const viewsArray = Array.isArray(views) ? views : [];

      if (!viewsArray.some((view: any) => view.viewerId === viewerId) && !hasAddedView) {
        setHasAddedView(true);
        await incrementProjectView(_id, viewerId);
      }
    };
    void addView();
  }, [_id, views, hasAddedView, generateOrRetrieveViewerId]);

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

  return (
    <motion.div layout className='space-y-6'>
      <motion.h1
        className='text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-foreground leading-tight'
        layoutId={`title-${projectTitle}`}
      >
        {projectTitle}
      </motion.h1>

      <div className='flex items-center flex-wrap gap-x-5 gap-y-2 text-sm text-foreground-subtle/80 font-medium'>
        <span className='flex items-center gap-1.5' title='Project Status'>
          <StatusIcon className='w-3.5 h-3.5' /> {statusConfig.label}
        </span>
        {projectStart && (
          <span className='flex items-center gap-1.5' title='Project Start Date'>
            <IconCalendar className='w-3.5 h-3.5' /> Started {formatDate(projectStart)}
          </span>
        )}
        {projectEnd && (
          <span className='flex items-center gap-1.5' title='Project End Date'>
            <IconCalendar className='w-3.5 h-3.5' /> Ended {formatDate(projectEnd)}
          </span>
        )}
        <span className='flex items-center gap-1.5' title='View count'>
          <BsEye className='w-4 h-4' /> {viewsCount?.toString() ?? '0'} Views
        </span>
        <span className='flex items-center gap-1.5' title='Like count'>
          <span className={cn(hasLikedLocal ? 'text-red-500' : '')}>
            {hasLikedLocal ? (
              <BsHeartFill className='w-3.5 h-3.5' />
            ) : (
              <BsHeart className='w-3.5 h-3.5' />
            )}
          </span>
          {localLikesCount} Likes
        </span>
      </div>

      {tags.length > 0 && (
        <div className='flex flex-wrap gap-2 mt-1'>
          {tags.map(tag => (
            <Chip key={tag.name} variation='primary' label={tag.name} />
          ))}
        </div>
      )}

      <div className='flex items-center flex-wrap gap-3 mt-1'>
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
