'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getProjectDisplayTitle } from '@/app/components/projects/projectCardHelpers';
import { GlassSurface } from '@/app/components/ui/GlassSurface';
import { registerScrollElements } from '@/app/lib/lenis-registry';
import type { HomeProjectsSection } from '@/lib/homePageBuilder';
import { portableTextToPlainText, urlForImage } from '@/sanity/lib/utils';
import { formatDateRange, formatProjectStatusLabel } from './featuredProjectHelpers';

const panelEase = [0.22, 1, 0.36, 1] as const;

const panelContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.06 },
  },
};

function panelItemVariants(fromX: number) {
  return {
    hidden: {
      opacity: 0,
      x: fromX,
      y: 16,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.85, ease: panelEase },
    },
  };
}

export type FeaturedProject = NonNullable<HomeProjectsSection['showcaseProjects']>[number];

type ImageSourceWithRef = { asset: { _ref: string } };

function collectPreviewSources(project: FeaturedProject): ImageSourceWithRef[] {
  const contentImages = Array.isArray(project.content)
    ? (project.content as Array<{ _type?: string; asset?: { _ref?: string } }>).filter(
        item => item?._type === 'image' && item?.asset?._ref,
      )
    : [];
  return [project.image, ...contentImages]
    .filter((img): img is ImageSourceWithRef => Boolean(img?.asset?._ref))
    .filter((img, idx, arr) => {
      const ref = img?.asset?._ref;
      return ref ? arr.findIndex(other => other?.asset?._ref === ref) === idx : idx === 0;
    })
    .slice(0, 4);
}

type FeaturedProjectCardProps = {
  project: FeaturedProject;
  index: number;
  panelColor: string;
};

function parallaxAttrs(mounted: boolean, speed: string) {
  return mounted ? { 'data-scroll': true, 'data-scroll-speed': speed } : {};
}

const FeaturedProjectCard = ({ project, index }: FeaturedProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useLayoutEffect(() => {
    if (!mounted || !cardRef.current) return;
    registerScrollElements(cardRef.current);
  }, [mounted]);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(mounted && prefersReducedMotion);
  const isCardInView = useInView(cardRef, {
    once: true,
    amount: 0.38,
    margin: '0px 0px -12% 0px',
  });

  const isEven = index % 2 === 0;
  const panelFromX = isEven ? -24 : 24;
  const panelAnimate = reducedMotion ? false : isCardInView ? 'visible' : 'hidden';
  const titleId = `featured-project-title-${project._id}`;
  const clientLabel = (project.client as string | null | undefined)?.trim() || null;
  const nameTrimmed = (project.name as string | undefined)?.trim();
  const headingText = nameTrimmed || 'Project';
  const displayTitle = getProjectDisplayTitle({
    name: project.name as string | null | undefined,
    client: project.client as string | null | undefined,
  });
  const seoDescription = (project.seoDescription as string | null | undefined)?.trim() ?? '';
  const legacyDescription = (project.description as string | null | undefined)?.trim() ?? '';
  const summaryText =
    (project.seo?.description as string | undefined)?.trim() ||
    seoDescription ||
    legacyDescription ||
    portableTextToPlainText(
      project.content as Array<Record<string, unknown>> | null | undefined,
      220,
    ) ||
    null;
  const dateRange = formatDateRange(project.projectStart, project.projectEnd);
  const heroUrl = project.image
    ? urlForImage(project.image)?.width(1400).height(1050).quality(85).url()
    : null;
  const previewSources = collectPreviewSources(project);
  const backdropAlt = project.seo?.title || displayTitle || 'Project backdrop';

  return (
    <div
      ref={cardRef}
      className='relative flex h-screen w-full items-center justify-center overflow-hidden border-t border-border/20 bg-surface dark:border-white/5'
    >
      <div className='absolute inset-0 z-0 h-full w-full overflow-hidden'>
        <div className='pointer-events-none absolute inset-0 z-10 bg-black/50 transition-colors duration-300 dark:bg-black/60' />

        {heroUrl ? (
          <div className='absolute inset-0 z-0' {...parallaxAttrs(mounted, '-0.5')}>
            <Image
              src={heroUrl}
              alt={backdropAlt}
              fill
              className='z-0 scale-115 object-cover select-none'
              sizes='(max-width: 768px) 100vw, 60vw'
              priority={index === 0}
            />
          </div>
        ) : (
          <div className='h-full w-full bg-surface-subtle' />
        )}
      </div>

      <div className='absolute bottom-4 right-4 z-10 hidden select-none rounded-md border border-white/10 bg-black/25 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-widest text-white/45 backdrop-blur-sm md:block'>
        Fig. {String(index + 1).padStart(2, '0')}
        {' // '}
        {project.slug || 'Specimen'}
      </div>

      <div
        className={`relative z-20 mx-4 my-auto w-full max-w-[90%] md:absolute md:inset-y-0 md:flex md:items-center md:w-[480px] md:mx-0 ${
          isEven
            ? 'md:left-[10%] lg:left-[15%] md:right-auto'
            : 'md:right-[10%] lg:right-[15%] md:left-auto'
        }`}
      >
        <GlassSurface variant='backdrop' className='w-full rounded-3xl p-8 md:p-10'>
          <motion.div
            className='flex flex-col'
            variants={reducedMotion ? undefined : panelContainerVariants}
            initial={reducedMotion ? false : 'hidden'}
            animate={panelAnimate}
          >
            <motion.div
              variants={reducedMotion ? undefined : panelItemVariants(panelFromX)}
              className='mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] font-bold uppercase tracking-wider text-accent md:text-xs'
            >
              <span>EP-{String(index + 1).padStart(2, '0')}</span>
              <span className='select-none text-white/35'>•</span>
              <span className='text-white/90'>
                {formatProjectStatusLabel(project.status || 'unknown')}
              </span>
              {dateRange ? (
                <>
                  <span className='select-none text-white/35'>•</span>
                  <span className='text-white/90'>{dateRange}</span>
                </>
              ) : null}
            </motion.div>

            <motion.h3
              id={titleId}
              variants={reducedMotion ? undefined : panelItemVariants(panelFromX)}
              className='mb-4 font-sans text-2xl font-bold leading-tight text-white md:text-3xl'
            >
              {clientLabel ? (
                <span className='mb-2 block text-xs font-bold uppercase tracking-wider text-accent'>
                  {clientLabel}
                </span>
              ) : null}
              {headingText}
            </motion.h3>

            {summaryText ? (
              <motion.p
                variants={reducedMotion ? undefined : panelItemVariants(panelFromX)}
                className='mb-8 line-clamp-3 text-sm leading-relaxed text-white/78 md:text-base'
              >
                {summaryText}
              </motion.p>
            ) : null}

            {previewSources.length > 1 ? (
              <motion.div
                variants={reducedMotion ? undefined : panelItemVariants(panelFromX)}
                className='mb-8 grid grid-cols-4 gap-3'
              >
                {previewSources.slice(0, 4).map(src => {
                  const u = urlForImage(src)?.width(160).height(160).quality(70).url();
                  return (
                    <div
                      key={src.asset._ref}
                      className='relative aspect-square overflow-hidden rounded-xl border border-white/15 bg-white/5 transition-transform duration-300 hover:scale-105'
                    >
                      {u ? (
                        <Image src={u} alt='' fill className='object-cover' sizes='60px' />
                      ) : null}
                    </div>
                  );
                })}
              </motion.div>
            ) : null}

            <motion.div
              variants={reducedMotion ? undefined : panelItemVariants(panelFromX)}
              className='flex items-center justify-between pt-2'
            >
              <Link
                href={`projects/${project.slug}`}
                className='z-20 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-accent-contrast shadow-md transition-colors hover:bg-accent-hover'
              >
                <span className='sr-only'>{headingText}. </span>
                View Project
                <IconArrowRight aria-hidden className='h-4 w-4' />
              </Link>
            </motion.div>
          </motion.div>
        </GlassSurface>
      </div>
    </div>
  );
};

export default FeaturedProjectCard;
