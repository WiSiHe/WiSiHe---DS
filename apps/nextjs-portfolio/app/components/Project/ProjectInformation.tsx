'use client';
import { ProjectQueryResult } from '@/sanity.types';
import { motion } from 'motion/react';
import { PortableTextBlock } from 'next-sanity';
import CustomPortableText from '../PortableText/PortableText';

import {
  FaCalendarAlt as IconCalendar,
  FaTimesCircle as IconCancel,
  FaCheckCircle as IconCheck,
  FaEyeSlash as IconEyePause,
  FaSpinner as IconLoader,
  FaPauseCircle as IconPause,
  FaQuestionCircle as IconQuestion,
} from 'react-icons/fa';

import Chip from '../Chip/Chip';

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

  const { name, status = 'unknown', projectStart, projectEnd, tags = [] } = project;

  const projectContent = project.content as PortableTextBlock[];

  const projectTitle = name || 'Untitled Project';
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;

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

  return (
    <motion.div layout className="space-y-6">
      <motion.h1
        className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-foreground leading-tight"
        layoutId={`title-${projectTitle}`}
      >
        {projectTitle}
      </motion.h1>

      <div className="flex flex-wrap gap-2">
        {/* Status chip */}
        <Chip variation="secondary" label={statusConfig.label} Icon={statusConfig.icon} />

        {/* Project dates */}
        {projectStart && (
          <Chip
            variation="tertiary"
            label={`Started ${formatDate(projectStart)}`}
            Icon={IconCalendar}
          />
        )}
        {projectEnd && (
          <Chip
            variation="tertiary"
            label={`Ended ${formatDate(projectEnd)}`}
            Icon={IconCalendar}
          />
        )}

        {/* Tags */}
        {tags.map(tag => (
          <Chip key={tag.name} variation="primary" label={tag.name} />
        ))}
      </div>

      {projectContent && (
        <div className="prose prose-lg max-w-none">
          <CustomPortableText
            value={projectContent}
            className="text-foreground-subtle leading-relaxed"
          />
        </div>
      )}
    </motion.div>
  );
};

export default ProjectInformation;
