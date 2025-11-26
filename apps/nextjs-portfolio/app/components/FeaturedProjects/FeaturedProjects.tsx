'use client';

import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'motion/react';
import { IconArrowRight } from '@tabler/icons-react';

type FeaturedProjectsProps = {
  showcaseProjects?: NonNullable<HomePageQueryResult>['showcaseProjects'] | null;
};

const FeaturedProjects = ({ showcaseProjects }: FeaturedProjectsProps) => {
  if (!showcaseProjects || showcaseProjects.length === 0) {
    return null;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="mx-auto mb-24 text-center text-text-primary max-w-prose"
      >
        <h2 className="mb-6 text-4xl md:text-5xl font-bold font-serif">
          Featured Projects
        </h2>
        <p className="text-xl text-text-secondary leading-relaxed">
          A selection of my recent work, ranging from web applications to design systems.
        </p>
      </motion.div>
      
      <div className="flex flex-col">
        {showcaseProjects.map((project, index) => {
          const imageUrl = urlForImage(project.image)?.height(800).width(1200).auto('format').quality(90).url();
          const year = project.projectStart ? new Date(project.projectStart).getFullYear() : null;

          return (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="sticky mb-12 last:mb-0"
              style={{ 
                top: `calc(5rem + ${index * 1.5}rem)`,
                zIndex: index + 1 
              }}
            >
              <Link href={`projects/${project.slug}`} className="block group">
                <article className="flex flex-col md:flex-row bg-surface-elevated rounded-3xl overflow-hidden shadow-2xl border border-border/50 min-h-[400px] transition-transform duration-500 hover:scale-[1.02]">
                  {/* Image Container */}
                  <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden bg-surface-elevated">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={project.seo?.title || project.title || 'Project Image'}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index < 2}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-elevated text-text-tertiary">
                        No Image
                      </div>
                    )}
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center w-full md:w-1/2 p-8 md:p-10 bg-surface-elevated">
                    <div className="flex items-center justify-between mb-4">
                      {project.name && (
                        <span className="text-xs font-bold tracking-widest text-primary uppercase">
                          {project.name}
                        </span>
                      )}
                      {year && (
                        <span className="text-xs font-mono font-medium px-2 py-1 rounded-full bg-surface text-text-secondary border border-border">
                          {year}
                        </span>
                      )}
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary group-hover:text-primary transition-colors font-serif">
                      {project.title}
                    </h3>
                    
                    <p className="text-text-secondary text-base leading-relaxed mb-6 line-clamp-4">
                      {project.seo?.description || project.description}
                    </p>

                    {/* Technologies / Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.tags.map((tag, i) => (
                          <span 
                            key={i} 
                            className="text-xs font-medium px-2.5 py-1 rounded-md bg-surface border border-border text-text-secondary/80"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center text-primary font-bold text-lg mt-auto group/link">
                      View Project
                      <IconArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/link:translate-x-2" />
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedProjects;
