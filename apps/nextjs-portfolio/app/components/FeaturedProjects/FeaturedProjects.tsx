'use client';

/**
 * Featured projects — scroll stack (React Bits–style ScrollStack + Lenis sync via RAF).
 * Tweak spacing/scale via `ScrollStack` props on the section below. Card colors: `stackColors`.
 */

import { IconArrowRight, IconCalendar, IconTag } from '@tabler/icons-react';
import type { HomePageQueryResult } from '@wisihe/sanity-queries';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { urlForImage } from '@/sanity/lib/utils';

import ScrollStack, { ScrollStackItem } from './ScrollStack';

type FeaturedProjectsProps = {
  showcaseProjects?: NonNullable<HomePageQueryResult>['showcaseProjects'] | null;
};

const MAX_PROJECTS = 3;

const stackColors = ['#3d2fa9', '#ff7722', '#ff3d33', '#785f47'];

type ImageSourceWithRef = { asset: { _ref: string } };

const FeaturedProjects = ({ showcaseProjects }: FeaturedProjectsProps) => {
  const [activeStackIndex, setActiveStackIndex] = useState(0);

  const onActiveIndexChange = useCallback((index: number) => {
    setActiveStackIndex(index);
  }, []);

  if (!showcaseProjects || showcaseProjects.length === 0) {
    return null;
  }

  const displayedProjects = showcaseProjects.slice(0, MAX_PROJECTS);
  const totalCards = displayedProjects.length;

  return (
    <section className='bg-background py-4 md:py-8'>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-80px' }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className='relative z-[2] px-6 pb-4 pt-3 md:px-12 md:pb-6 md:pt-4 lg:px-24'
      >
        <div className='max-w-5xl'>
          <p className='mb-1.5 font-mono text-sm uppercase tracking-widest text-accent'>
            Selected Work
          </p>
          <h2 className='mb-1.5 font-serif text-4xl font-bold leading-[1.05] text-foreground md:text-5xl lg:text-6xl xl:text-7xl'>
            Featured
            <br />
            Projects
          </h2>
          <p className='max-w-2xl text-base leading-snug text-foreground-subtle md:text-lg'>
            A curated selection of projects where design meets engineering. Scroll to explore each
            case study.
          </p>
        </div>
      </motion.div>

      {totalCards >= 2 ? (
        <div
          className='pointer-events-none fixed bottom-3 right-4 z-[45] font-mono text-xs tabular-nums tracking-widest text-foreground/70 md:bottom-5 md:right-10 md:text-sm'
          aria-live='polite'
          aria-atomic='true'
        >
          {String(activeStackIndex + 1).padStart(2, '0')} / {String(totalCards).padStart(2, '0')}
        </div>
      ) : null}

      <ScrollStack
        useWindowScroll
        useLenis={false}
        itemDistance={56}
        itemScale={0.04}
        itemStackDistance={28}
        stackPosition='22%'
        scaleEndPosition='12%'
        baseScale={0.8}
        onActiveIndexChange={onActiveIndexChange}
      >
        <>
          {displayedProjects.map((project, index) => {
            const panelColor = stackColors[index % stackColors.length];
            const dateRange = formatDateRange(project.projectStart, project.projectEnd);
            const tags = project.tags?.slice(0, 4);
            const heroUrl = project.image
              ? urlForImage(project.image)?.width(1200).height(900).quality(80).url()
              : null;

            const contentImages = Array.isArray(project.content)
              ? (project.content as Array<{ _type?: string; asset?: { _ref?: string } }>).filter(
                  item => item?._type === 'image' && item?.asset?._ref,
                )
              : [];
            const previewSources = [project.image, ...contentImages]
              .filter((img): img is ImageSourceWithRef => Boolean(img?.asset?._ref))
              .filter((img, idx, arr) => {
                const ref = img?.asset?._ref;
                return ref ? arr.findIndex(other => other?.asset?._ref === ref) === idx : idx === 0;
              })
              .slice(0, 4);

            return (
              <ScrollStackItem
                key={project._id}
                itemClassName='pointer-events-auto my-0 flex min-h-[min(380px,70svh)] w-full flex-col overflow-hidden rounded-2xl p-0 shadow-2xl md:min-h-[min(520px,56svh)]'
              >
                <div
                  className='flex min-h-0 flex-1 flex-col gap-4 p-5 md:min-h-0 md:flex-row md:gap-4 md:p-8 lg:p-10'
                  style={{
                    color: '#fff',
                    backgroundColor: panelColor,
                  }}
                >
                  <div className='flex min-h-0 flex-1 flex-col justify-between gap-4 md:py-1'>
                    <div>
                      <div className='mb-3 flex flex-wrap items-center gap-2'>
                        <span className='rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide'>
                          {project.name}
                        </span>
                        {project.status ? (
                          <span className='text-[10px] font-medium uppercase tracking-wider text-white/80 md:text-xs'>
                            {project.status}
                          </span>
                        ) : null}
                      </div>
                      <h3 className='mb-2 font-serif text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl'>
                        {project.title}
                      </h3>
                      <p className='line-clamp-3 text-sm leading-relaxed text-white/90 md:text-base'>
                        {(project.seo?.description || project.description) ?? undefined}
                      </p>
                    </div>
                    <div>
                      <div className='mb-3 flex flex-wrap gap-3 text-xs text-white/80 md:text-sm'>
                        {dateRange ? (
                          <span className='inline-flex items-center gap-1'>
                            <IconCalendar className='h-3.5 w-3.5' />
                            {dateRange}
                          </span>
                        ) : null}
                        {tags && tags.length > 0 ? (
                          <span className='inline-flex items-center gap-1'>
                            <IconTag className='h-3.5 w-3.5' />
                            {tags.map(t => t?.name).join(', ')}
                          </span>
                        ) : null}
                      </div>
                      <Link
                        href={`projects/${project.slug}`}
                        className='inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90 md:px-6 md:py-2.5'
                      >
                        View Case Study
                        <IconArrowRight className='h-4 w-4' />
                      </Link>
                    </div>
                  </div>

                  <div className='relative flex min-h-[140px] flex-1 flex-col gap-2 md:min-h-0'>
                    <span className='absolute right-0 top-0 font-mono text-4xl font-bold text-white/25 md:text-5xl'>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {heroUrl ? (
                      <div className='relative mt-8 min-h-[140px] flex-1 overflow-hidden rounded-xl md:mt-0 md:min-h-0'>
                        <Image
                          src={heroUrl}
                          alt={project.seo?.title || project.title || ''}
                          fill
                          className='object-cover'
                          sizes='(max-width: 768px) 100vw, 35vw'
                          priority={index === 0}
                        />
                      </div>
                    ) : (
                      <div className='mt-8 min-h-[140px] flex-1 rounded-xl bg-white/10 md:mt-0' />
                    )}
                    {previewSources.length > 1 ? (
                      <div className='grid grid-cols-4 gap-1.5'>
                        {previewSources.slice(0, 4).map((src, i) => {
                          const u = urlForImage(src)?.width(200).height(200).quality(70).url();
                          return (
                            <div
                              key={`${project._id}-t-${i}`}
                              className='relative aspect-square overflow-hidden rounded-md'
                            >
                              {u ? (
                                <Image src={u} alt='' fill className='object-cover' sizes='80px' />
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              </ScrollStackItem>
            );
          })}
        </>
      </ScrollStack>

      <div className='flex items-center justify-center px-6 py-12 md:px-12 md:py-16 lg:px-24'>
        <div className='text-center'>
          <p className='mb-8 text-lg text-foreground-subtle'>Want to see more of my work?</p>
          <Link
            href='/projects'
            className='group inline-flex items-center gap-3 rounded-full border-2 border-foreground px-8 py-4 text-base font-bold text-foreground transition-colors hover:bg-foreground hover:text-background md:px-10 md:py-5 md:text-lg'
          >
            Explore all projects
            <IconArrowRight className='h-5 w-5 transition-transform group-hover:translate-x-1 md:h-6 md:w-6' />
          </Link>
        </div>
      </div>
    </section>
  );
};

const formatDateRange = (start?: string | null, end?: string | null) => {
  if (!start) return null;
  const startYear = new Date(start).getFullYear();
  if (!end) return `${startYear} — Present`;
  const endYear = new Date(end).getFullYear();
  return startYear === endYear ? `${startYear}` : `${startYear} — ${endYear}`;
};

export default FeaturedProjects;
