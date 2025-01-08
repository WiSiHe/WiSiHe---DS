'use client';
import { ProjectQueryResult } from '@/sanity.types';
import { motion } from 'framer-motion';
import { PortableTextBlock } from 'next-sanity';
import Chip from '../Chip/Chip';
import CustomPortableText from '../PortableText/PortableText';

type ProjectInformationProps = {
  project: ProjectQueryResult;
};

const ProjectInformation = ({ project }: ProjectInformationProps) => {
  if (!project) {
    return null;
  }

  const { title, tags, status, projectStart, projectEnd } = project;

  const projectContent = project.content as PortableTextBlock[];
  return (
    <motion.div layout className="p-4">
      <motion.h1 layoutId={`title-${title}`}>{title}</motion.h1>

      <div className="flex flex-wrap gap-2 pb-4">
        {tags.map((tag) => (
          <Chip key={tag.name} label={tag.name} />
        ))}
        <Chip label={`Status: ${status}`} />
        <Chip label={`Started: ${projectStart}`} />
        <Chip label={`Ended: ${projectEnd}`} />
      </div>
      {projectContent && (
        <CustomPortableText value={projectContent} className="prose-invert" />
      )}
    </motion.div>
  );
};

export default ProjectInformation;
