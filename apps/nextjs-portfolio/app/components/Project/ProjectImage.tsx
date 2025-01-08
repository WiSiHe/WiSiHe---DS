'use client';
import { ProjectQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

type ProjectImageProps = {
  project: ProjectQueryResult;
};

const ProjectImage = ({ project }: ProjectImageProps) => {
  if (!project) {
    return null;
  }

  const { title, image, connectedPage } = project;
  return (
    <>
      <motion.div
        layoutId={`image-${title}`}
        className="relative rounded-xl aspect-square lg:aspect-video overflow-clip"
      >
        {image && (
          <Image
            src={urlForImage(image)?.width(1200)?.height(800)?.url() || ''}
            alt={title || 'Default Alt Text'}
            fill
            className="object-cover"
          />
        )}

        {connectedPage && (
          <iframe
            src={connectedPage}
            className="absolute inset-0 w-full h-full"
          />
        )}
      </motion.div>
    </>
  );
};

export default ProjectImage;
