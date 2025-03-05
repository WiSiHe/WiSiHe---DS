'use client';
import { ProjectQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { motion } from 'motion/react';
import Image from 'next/image';
import Chip from '../Chip/Chip';

import {
  FaCalendarAlt as IconCalendar,
  FaTimesCircle as IconCancel,
  FaCheckCircle as IconCheck,
  FaEyeSlash as IconEyePause,
  FaSpinner as IconLoader,
  FaPauseCircle as IconPause,
  FaQuestionCircle as IconQuestion,
} from 'react-icons/fa';

type ProjectImageProps = {
  project: ProjectQueryResult;
};

const ProjectImage = ({ project }: ProjectImageProps) => {
  if (!project) {
    return null;
  }

  const {
    name,
    image,
    connectedPage,
    status = 'unknown',
    projectStart,
    projectEnd,
    tags,
  } = project;

  const projectTitle = name;

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
    <motion.div
      layoutId={`image-${projectTitle}`}
      className="relative rounded-xl aspect-square lg:aspect-video overflow-clip"
    >
      {image && (
        <Image
          src={urlForImage(image)?.width(1200).fit('max').url() || ''}
          alt={projectTitle || 'Default Alt Text'}
          fill
          className="object-cover rounded-xl"
        />
      )}

      {connectedPage && (
        <iframe
          src={connectedPage}
          className="absolute inset-0 w-full h-full"
        />
      )}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-transparent to-dark/50" />
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-start justify-center p-4 drop-shadow-2xl">
        <motion.h1
          className="pb-4 text-4xl font-black pointer-events-auto lg:text-8xl"
          layoutId={`title-${projectTitle}`}
        >
          {projectTitle}
        </motion.h1>
        <div className="flex flex-wrap gap-2 pointer-events-auto max-w-prose">
          {status && <Chip label={`Status: ${status}`} Icon={STATUS_MAP} />}
          {status && (
            <div className="inline-flex flex-row items-center gap-2 px-3 py-1 text-base font-medium transition-all ease-in-out rounded-full font-inter bg-stone-100 text-dark">{`Status: ${status}`}</div>
          )}
          {projectStart && (
            <div>
              <Chip label={`Started: ${projectStart}`} />
            </div>
          )}
          {projectEnd && (
            <div>
              <Chip label={`Ended: ${projectEnd}`} />
            </div>
          )}
          {tags.map((tag) => (
            <Chip key={tag.name} label={tag.name} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectImage;
