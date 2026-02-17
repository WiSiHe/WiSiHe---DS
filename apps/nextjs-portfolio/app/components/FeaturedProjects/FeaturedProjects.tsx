'use client';

import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { IconArrowRight } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import Chip from '../Chip/Chip';

type FeaturedProjectsProps = {
  showcaseProjects?: NonNullable<HomePageQueryResult>['showcaseProjects'] | null;
};

const FeaturedProjects = ({ showcaseProjects }: FeaturedProjectsProps) => {
  if (!showcaseProjects || showcaseProjects.length === 0) {
    return null;
  }

  // Only show the first 3 projects
  const displayedProjects = showcaseProjects.slice(0, 3);

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Header Section */}
        <div className="w-full max-w-4xl mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif mb-8 text-foreground">
            Featured Projects
          </h2>
          <div className="w-full min-w-0 max-w-3xl space-y-6 text-lg md:text-xl text-foreground-subtle leading-relaxed">
            <p className="text-pretty whitespace-normal [overflow-wrap:normal] [word-break:normal] [hyphens:none]">
              I specialize in bridging the gap between design and engineering, creating digital
              experiences that are both visually stunning and technically robust. My work often
              revolves around high-performance web applications, interactive 3D environments, and
              scalable design systems.
            </p>
            <p className="text-pretty whitespace-normal [overflow-wrap:normal] [word-break:normal] [hyphens:none]">
              Here's a selection of projects where I've pushed the boundaries of what's possible on
              the web, combining creative front-end development with solid architectural
              foundations.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {displayedProjects.map(project => {
            const imageUrl = urlForImage(project.image)
              ?.height(800)
              .width(1000)
              .auto('format')
              .quality(90)
              .url();
            const year = project.projectStart ? new Date(project.projectStart).getFullYear() : null;

            return (
              <Link
                key={project._id}
                href={`projects/${project.slug}`}
                className="group flex flex-col h-full glass-panel rounded-3xl overflow-hidden border border-border-subtle hover:border-accent-border transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5"
              >
                {/* Image Container */}
                <div className="relative aspect-4/3 overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={project.seo?.title || project.title || 'Project Image'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface flex items-center justify-center text-foreground-muted">
                      No Image
                    </div>
                  )}
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    {project.name && (
                      <span className="text-xs font-bold tracking-widest text-accent uppercase">
                        {project.name}
                      </span>
                    )}
                    {year && <span className="text-xs font-mono text-foreground-muted">{year}</span>}
                  </div>

                  <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-foreground-subtle text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
                    {project.seo?.description || project.description}
                  </p>

                  <div className="mt-auto pt-6 flex items-center gap-2 text-accent font-semibold text-sm">
                    View Case Study
                    <IconArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Global CTA */}
        <div className="mt-16 md:mt-24 flex justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full font-bold hover:bg-accent hover:text-accent-contrast transition-all duration-300 hover:scale-105 group"
          >
            Explore all projects
            <IconArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
