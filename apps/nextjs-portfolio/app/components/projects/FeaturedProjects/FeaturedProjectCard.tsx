'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { motion, useInView, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getProjectCardTags } from '@/app/components/projects/ProjectCardParts';
import { GlassSurface } from '@/app/components/ui/GlassSurface';
import { registerScrollElements } from '@/app/lib/lenis-registry';
import type { HomeProjectsSection } from '@/lib/homePageBuilder';
import { portableTextToPlainText, urlForImage } from '@/sanity/lib/utils';
import { formatDateRange, formatProjectStatusLabel } from './featuredProjectHelpers';

const panelEase = [0.22, 1, 0.36, 1] as const;

const panelContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.05 },
  },
};

function panelItemVariants(fromX: number) {
  return {
    hidden: {
      opacity: 0,
      x: fromX,
      y: 12,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.72, ease: panelEase },
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
    .slice(0, 3);
}

type FeaturedProjectCardProps = {
  project: FeaturedProject;
  index: number;
};

function parallaxAttrs(mounted: boolean, speed: string) {
  return mounted ? { 'data-scroll': true, 'data-scroll-speed': speed } : {};
}

function MetaPill({ children }: { children: ReactNode }) {
  return (
    <span className='inline-flex items-center rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/88 backdrop-blur-sm md:text-[11px]'>
      {children}
    </span>
  );
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
  const panelFromX = isEven ? -20 : 20;
  const panelAnimate = reducedMotion ? false : isCardInView ? 'visible' : 'hidden';
  const titleId = `featured-project-title-${project._id}`;
  const clientLabel = (project.client as string | null | undefined)?.trim() || null;
  const nameTrimmed = (project.name as string | undefined)?.trim();
  const headingText = nameTrimmed || 'Project';
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
  const statusLabel = formatProjectStatusLabel(project.status || 'unknown');
  const { visible: visibleTags, remaining: remainingTags } = getProjectCardTags(
    project.tags as Array<{ name?: string | null }> | null | undefined,
    4,
  );
  const heroUrl = project.image
    ? urlForImage(project.image)?.width(1400).height(1050).quality(85).url()
    : null;
  const previewSources = collectPreviewSources(project);
  const backdropAlt = project.seo?.title || headingText || 'Project backdrop';

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

      <div
        className={cn(
          'relative z-20 mx-4 my-auto w-full max-w-[90%] md:absolute md:inset-y-0 md:flex md:items-center md:w-[min(100%,32rem)] md:mx-0',
          isEven
            ? 'md:left-[10%] lg:left-[15%] md:right-auto'
            : 'md:right-[10%] lg:right-[15%] md:left-auto',
        )}
      >
        <GlassSurface variant='overlay' className='w-full rounded-2xl p-6 shadow-2xl md:p-8'>
          <motion.div
            className='flex flex-col'
            variants={reducedMotion ? undefined : panelContainerVariants}
            initial={reducedMotion ? false : 'hidden'}
            animate={panelAnimate}
          >
            <motion.div
              variants={reducedMotion ? undefined : panelItemVariants(panelFromX)}
              className='mb-4 flex flex-wrap items-center gap-2'
            >
              <MetaPill>{statusLabel}</MetaPill>
              {dateRange ? <MetaPill>{dateRange}</MetaPill> : null}
            </motion.div>

            <motion.div
              variants={reducedMotion ? undefined : panelItemVariants(panelFromX)}
              className='mb-4 space-y-2'
            >
              {clientLabel ? (
                <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-accent'>
                  {clientLabel}
                </p>
              ) : null}
              <h3
                id={titleId}
                className='font-serif text-2xl font-bold leading-[1.15] tracking-tight text-white md:text-[1.85rem]'
              >
                {headingText}
              </h3>
            </motion.div>

            {summaryText ? (
              <motion.p
                variants={reducedMotion ? undefined : panelItemVariants(panelFromX)}
                className='mb-5 line-clamp-4 text-sm leading-relaxed text-white/72 md:text-[15px]'
              >
                {summaryText}
              </motion.p>
            ) : null}

            {visibleTags.length > 0 ? (
              <motion.div
                variants={reducedMotion ? undefined : panelItemVariants(panelFromX)}
                className='mb-6 flex flex-wrap gap-1.5'
              >
                {visibleTags.map(tag => (
                  <span
                    key={tag.name}
                    className='rounded-full border border-white/12 bg-white/6 px-2.5 py-0.5 text-[10px] font-medium text-white/80 md:text-[11px]'
                  >
                    {tag.name}
                  </span>
                ))}
                {remainingTags > 0 ? (
                  <span className='self-center text-[10px] font-medium text-white/45'>
                    +{remainingTags}
                  </span>
                ) : null}
              </motion.div>
            ) : null}

            {previewSources.length > 1 ? (
              <motion.div
                variants={reducedMotion ? undefined : panelItemVariants(panelFromX)}
                className='mb-6 flex gap-2'
              >
                {previewSources.map(src => {
                  const u = urlForImage(src)?.width(200).height(140).quality(72).url();
                  return (
                    <div
                      key={src.asset._ref}
                      className='relative aspect-[5/3] min-w-0 flex-1 overflow-hidden rounded-lg border border-white/12 bg-white/5'
                    >
                      {u ? (
                        <Image src={u} alt='' fill className='object-cover' sizes='120px' />
                      ) : null}
                    </div>
                  );
                })}
              </motion.div>
            ) : null}

            <motion.div variants={reducedMotion ? undefined : panelItemVariants(panelFromX)}>
              <Link
                href={`/projects/${project.slug}`}
                className='group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast shadow-md transition-[background-color,transform] duration-200 hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98]'
              >
                <span className='sr-only'>{headingText}. </span>
                View project
                <IconArrowRight
                  aria-hidden
                  className='size-4 transition-transform duration-200 group-hover:translate-x-0.5'
                />
              </Link>
            </motion.div>
          </motion.div>
        </GlassSurface>
      </div>
    </div>
  );
};

export default FeaturedProjectCard;
