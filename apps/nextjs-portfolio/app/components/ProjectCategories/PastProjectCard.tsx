import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/utils';
import { GetAllProjectsResult } from '@/sanity.types';
import Chip from '../Chip/Chip';

type PastProjectCardProps = {
  project: GetAllProjectsResult['pastProjects'][0];
  index: number;
};

const PastProjectCard = ({ project, index }: PastProjectCardProps) => {
  const {
    title,
    name,
    seoDescription,
    description,
    image,
    slug,
    tags,
    status,
    projectEnd,
  } = project;
  const projectTitle = title ?? name;
  const displayTags = tags?.slice(0, 2) || [];
  const remainingTagsCount = (tags?.length || 0) - 2;

  return (
    <motion.li
      key={project._id}
      layout
      className="relative z-10 flex flex-col items-start justify-start w-full overflow-hidden bg-surface border border-border/30 rounded-xl shadow-sm shrink-0 text-foreground col-span-full md:col-span-6 lg:col-span-4 group transition-all duration-300 hover:shadow-2xl hover:border-accent/50 hover:bg-surface-hover hover:-translate-y-1"
    >
      <motion.article className="w-full">
        <motion.div
          layoutId={`image-${projectTitle}`}
          className="relative pointer-events-none aspect-square overflow-clip rounded-t-xl"
        >
          <div className="absolute z-10 flex flex-wrap gap-2 p-2">
            {status && <Chip variation="secondary" label={status} interactive={false} />}
            {displayTags.map(tag => (
              <Chip variation="primary" key={tag.name} label={tag.name} interactive={false} />
            ))}
            {remainingTagsCount > 0 && (
              <Chip variation="tertiary" label={`+${remainingTagsCount}`} interactive={false} />
            )}
          </div>
          <Image
            src={urlForImage(image)?.width(400).height(500).quality(60).url() || ''}
            alt={image?.alt || projectTitle}
            priority={index < 4}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 scale-105 group-hover:scale-115"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
        <div className="p-4">
          <Link
            href={`projects/${slug}`}
            className="before:absolute before:inset-0 before:z-0"
          >
            <motion.h2
              layoutId={`title-${projectTitle}`}
              className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300"
            >
              {projectTitle}
            </motion.h2>
          </Link>
          <p className="line-clamp-3 text-foreground-subtle group-hover:text-foreground transition-colors duration-300">
            {seoDescription ?? description}
          </p>
          {projectEnd && (
            <p className="text-sm text-foreground-muted mt-2 group-hover:text-foreground-subtle transition-colors duration-300">
              Completed:{' '}
              {new Date(projectEnd).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </motion.article>
    </motion.li>
  );
};

export default PastProjectCard;
