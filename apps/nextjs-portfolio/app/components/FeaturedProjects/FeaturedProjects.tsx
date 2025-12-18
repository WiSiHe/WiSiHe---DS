'use client';

import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { useGSAP } from '@gsap/react';
import { IconArrowRight } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import Chip from '../Chip/Chip';

gsap.registerPlugin(ScrollTrigger);

type FeaturedProjectsProps = {
  showcaseProjects?: NonNullable<HomePageQueryResult>['showcaseProjects'] | null;
};

const FeaturedProjects = ({ showcaseProjects }: FeaturedProjectsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!showcaseProjects || showcaseProjects.length === 0) return;

      const panels = gsap.utils.toArray<HTMLElement>('.project-section');
      const header = headerRef.current;

      // Animate header to shrink and move to top-left corner
      if (header && panels.length > 0) {
        const firstPanel = panels[0] as HTMLElement;
        const headerContent = header.querySelector('div > div') as HTMLElement;

        ScrollTrigger.create({
          trigger: firstPanel,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
          onUpdate: self => {
            const progress = self.progress;
            const scale = 1 - progress * 0.45; // Scale from 1 to 0.55
            // Keep it in bounds - don't move it, just scale it
            // The sticky positioning already handles the corner placement

            gsap.set(header, {
              scale: scale,
              x: 0,
              y: 0,
            });

            // Also reduce padding on the inner content for a more compact look
            if (headerContent) {
              const padding = 40 - progress * 28; // Reduce padding from 40px to 12px
              gsap.set(headerContent, {
                padding: `${padding}px`,
              });
            }
          },
        });
      }

      // Set initial z-index for all panels (later sections higher, so they appear on top)
      panels.forEach((panel, index) => {
        gsap.set(panel, { zIndex: index + 1 });
      });

      // Remove last panel from animation (it stays visible)
      const animatedPanels = panels.slice(0, -1);

      animatedPanels.forEach((panel, index) => {
        // Get the element holding the content inside the panel
        const innerpanel = panel.querySelector('.section-inner') as HTMLElement;
        if (!innerpanel) return;

        // Get the Height of the content inside the panel
        const panelHeight = innerpanel.offsetHeight;

        // Get the window height
        const windowHeight = window.innerHeight;

        const difference = panelHeight - windowHeight;

        // ratio (between 0 and 1) representing the portion of the overall animation that's for the fake-scrolling
        const fakeScrollRatio = difference > 0 ? difference / (difference + windowHeight) : 0;

        // if we need to fake scroll (because the panel is taller than the window), add margin
        if (fakeScrollRatio) {
          panel.style.marginBottom = panelHeight * fakeScrollRatio + 'px';
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'bottom bottom',
            end: () => (fakeScrollRatio ? `+=${innerpanel.offsetHeight}` : 'bottom top'),
            pinSpacing: false,
            pin: true,
            scrub: true,
          },
        });

        // fake scroll. We use 1 because that's what the rest of the timeline consists of scale animation
        if (fakeScrollRatio) {
          tl.to(innerpanel, {
            yPercent: -100,
            y: window.innerHeight,
            duration: 1 / (1 - fakeScrollRatio) - 1,
            ease: 'none',
          });
        }
        // Scale down, fade out, and reduce z-index as it exits
        tl.to(panel, { scale: 0.9, opacity: 0, zIndex: 0, duration: 1 });
      });

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    },
    { scope: containerRef, dependencies: [showcaseProjects] },
  );

  if (!showcaseProjects || showcaseProjects.length === 0) {
    return null;
  }

  return (
    <section ref={containerRef} className="relative">
      <div
        ref={headerRef}
        className="sticky top-8 md:top-24 left-4 md:left-4 z-50 text-white mix-blend-difference pointer-events-none origin-top-left w-fit"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-3 md:mb-4">
          Featured Projects
        </h2>
        <p className="text-lg md:text-xl max-w-2xl">Selected works & experiments</p>
      </div>

      {/* Projects */}
      <div className="slides-wrapper pt-24">
        {showcaseProjects.map((project, index) => {
          const imageUrl = urlForImage(project.image)
            ?.height(1200)
            .width(1600)
            .auto('format')
            .quality(90)
            .url();
          const year = project.projectStart ? new Date(project.projectStart).getFullYear() : null;

          const isLastSection = index === showcaseProjects.length - 1;

          return (
            <section
              key={project._id}
              className={cn(
                'project-section relative w-full h-screen flex justify-center overflow-hidden',
                !isLastSection && 'rounded-2xl',
              )}
            >
              <div className="section-content w-full">
                <div className="section-inner h-full overflow-hidden">
                  {/* Background Image */}
                  <div className="absolute inset-0 w-full h-full">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={project.seo?.title || project.title || 'Project Image'}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority={index === 0}
                      />
                    ) : (
                      <div className="w-full h-full bg-surface flex items-center justify-center text-foreground-muted">
                        No Image
                      </div>
                    )}
                    {/* Subtle overlay - Enhanced for better text readability */}
                    <div className="absolute inset-0 bg-linear-to-b from-black to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex items-start pb-8 md:pt-16 lg:pt-24">
                    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6">
                        {project.name && (
                          <span className="text-xs md:text-sm lg:text-2xl font-semibold tracking-wider text-accent uppercase">
                            {project.name}
                          </span>
                        )}
                        {year && (
                          <span className="text-xs md:text-sm font-mono text-white drop-shadow-md">
                            {year}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-base md:text-lg lg:text-xl text-white leading-relaxed mb-4 md:mb-6 lg:mb-8 max-w-2xl drop-shadow-lg">
                        {project.seo?.description || project.description}
                      </p>

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6 lg:mb-8">
                          {project.tags.slice(0, 5).map((tag, i) => (
                            <Chip key={i} label={tag.name} variation="default" size="medium" />
                          ))}
                          {project.tags.length > 5 && (
                            <Chip
                              label={`+${project.tags.length - 5}`}
                              variation="secondary"
                              size="medium"
                            />
                          )}
                        </div>
                      )}

                      {/* CTA */}
                      <Link
                        href={`projects/${project.slug}`}
                        className={cn(
                          'inline-flex hover:scale-105 duration-200 items-center gap-2 md:gap-3 text-white font-medium text-sm md:text-base px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-accent group-hover:border-accent transition-all',
                          'hover:bg-accent hover:border-accent',
                          'hover:text-accent-contrast',
                          'hover:shadow-md',
                          'hover:scale-105',
                          'hover:translate-x-1',
                        )}
                      >
                        View Case Study
                        <IconArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedProjects;
