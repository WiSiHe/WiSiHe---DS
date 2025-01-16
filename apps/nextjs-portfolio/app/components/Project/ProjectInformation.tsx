'use client';
import { ProjectQueryResult } from '@/sanity.types';
import { motion } from 'framer-motion';
import { PortableTextBlock } from 'next-sanity';
import Chip from '../Chip/Chip';
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

type ProjectInformationProps = {
  project: ProjectQueryResult;
};

const ProjectInformation = ({ project }: ProjectInformationProps) => {
  if (!project) {
    return null;
  }

  const {
    title,
    name,
    tags,
    status = 'unknown',
    projectStart,
    projectEnd,
  } = project;

  const projectTitle = title ?? name;
  const projectContent = project.content as PortableTextBlock[];

  const STATUS_MAP = {
    abandoned: IconEyePause,
    cancelled: IconCancel,
    completed: IconCheck,
    inProgress: IconLoader,
    notStarted: IconPause,
    onHold: IconPause,
    planned: IconCalendar,
    unknown: IconQuestion,
  }[status];

  return (
    <motion.div layout className="p-4">
      <motion.h1 layoutId={`title-${projectTitle}`}>{projectTitle}</motion.h1>

      <div className="flex flex-wrap gap-2 pb-4">
        {status && <Chip label={`Status: ${status}`} Icon={STATUS_MAP} />}
        <Chip label={`Started: ${projectStart} - `} />
        <Chip label={`Ended: ${projectEnd}`} />
        {tags.map((tag) => (
          <Chip key={tag.name} label={tag.name} />
        ))}
      </div>
      {projectContent && (
        <CustomPortableText value={projectContent} className="prose-invert" />
      )}
    </motion.div>
  );
};

export default ProjectInformation;
