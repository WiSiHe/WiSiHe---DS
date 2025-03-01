'use client';
import { ProjectQueryResult } from '@/sanity.types';
import { motion } from 'framer-motion';
import { PortableTextBlock } from 'next-sanity';
import CustomPortableText from '../PortableText/PortableText';

type ProjectInformationProps = {
  project: ProjectQueryResult;
};

const ProjectInformation = ({ project }: ProjectInformationProps) => {
  if (!project) {
    return null;
  }

  const projectContent = project.content as PortableTextBlock[];

  return (
    <motion.div layout className="prose-invert">
      {projectContent && (
        <CustomPortableText value={projectContent} className="prose-invert" />
      )}
    </motion.div>
  );
};

export default ProjectInformation;
