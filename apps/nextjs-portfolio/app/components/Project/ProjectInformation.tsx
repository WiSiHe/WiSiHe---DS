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

  return (
    <motion.div layout>
      <motion.h1
        className="pb-1 text-4xl font-black text-text-primary lg:text-8xl"
        layoutId={`title-${projectTitle}`}
      >
        {projectTitle}
      </motion.h1>
      <div className="flex pb-4 flex-wrap gap-2 pointer-events-auto max-w-prose">
        {/* Status chip */}
        <Chip label={statusConfig.label} Icon={statusConfig.icon} />

        {/* Project dates */}
        {projectStart && <Chip label={`Started: ${projectStart}`} />}
        {projectEnd && <Chip label={`Ended: ${projectEnd}`} />}

        {/* Tags */}
        {tags.map(tag => (
          <Chip key={tag.name} label={tag.name} />
        ))}
      </div>

      {projectContent && (
        <CustomPortableText value={projectContent} className="whitespace-pre-wrap max-w-prose" />
      )}
    </motion.div>
  );
};

export default ProjectInformation;
