'use client';

/**
 * Featured projects — pinned sticky cards (GSAP + ScrollTrigger)
 *
 * **Customize** in `TIMELINE_CONFIG`: pile fan (`pileUp`, `pileXSpread`), stack (`stackDownY`, `exitedScale`),
 * scroll feel (`pinScrollHeightPerCard`, `scrubSmoothing`, `stepEase`), intro fade (`headerFadeSpan`).
 * Card colors: `stackColors`. Section uses theme tokens (`bg-background`, `text-foreground`).
 *
 * Scroll drives a step timeline: outgoing → pile, incoming → front, deeper cards shift slots.
 */

import { useGSAP } from '@gsap/react';
import { IconArrowRight, IconCalendar, IconTag } from '@tabler/icons-react';
import type { HomePageQueryResult } from '@wisihe/sanity-queries';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { urlForImage } from '@/sanity/lib/utils';

gsap.registerPlugin(ScrollTrigger);

type FeaturedProjectsProps = {
  showcaseProjects?: NonNullable<HomePageQueryResult>['showcaseProjects'] | null;
};

type Project = NonNullable<NonNullable<HomePageQueryResult>['showcaseProjects']>[number];

/** Tweak animation + scroll — see comments for customization */
const TIMELINE_CONFIG = {
  maxProjects: 3,
  /** Front card (active) */
  frontZ: 20,
  frontScale: 1,
  /** Cards on the “done” pile (older exits lower, newer on top) */
  backZ: 10,
  /** Keep high so all three cards stay readable in frame */
  exitedScale: 0.93,
  /** yPercent — pile cards above center */
  pileUp: 3.2,
  /** Horizontal fan so multiple pile cards stay visible (not stacked on one axis) */
  pileXSpread: 2.8,
  /** Behind front — small steps so deck stays compact */
  stackDownY: 3.5,
  stackScaleStep: 0.028,
  cardXOffset: 0.35,
  stackZBase: 16,
  /**
   * Pin scroll distance = innerHeight × this × card count.
   * Lower = less scroll through the deck (snappier section).
   */
  pinScrollHeightPerCard: 1.05,
  pastOpacity: 1,
  /** ScrollTrigger scrub (s). Lower = follows wheel/touch more closely. */
  scrubSmoothing: 0.28,
  /** Easing inside each handoff step */
  stepEase: 'power1.out',
  /** First fraction of pin progress (0–1) over which the intro header fades out */
  headerFadeSpan: 0.22,
} as const;

const stackColors = ['#3d2fa9', '#ff7722', '#ff3d33', '#785f47'];

type ImageSourceWithRef = { asset: { _ref: string } };

const FeaturedProjects = ({ showcaseProjects }: FeaturedProjectsProps) => {
  const stickyRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  if (!showcaseProjects || showcaseProjects.length === 0) {
    return null;
  }

  const displayedProjects = showcaseProjects.slice(0, TIMELINE_CONFIG.maxProjects);
  const totalCards = displayedProjects.length;

  useGSAP(
    () => {
      const root = stickyRef.current;
      if (!root) return;

      let st: ScrollTrigger | undefined;
      let rafId = 0;

      const {
        frontZ,
        frontScale,
        backZ,
        exitedScale,
        pileUp,
        pileXSpread,
        stackDownY,
        stackScaleStep,
        cardXOffset,
        stackZBase,
        pinScrollHeightPerCard,
        pastOpacity,
        scrubSmoothing,
        stepEase,
        headerFadeSpan,
      } = TIMELINE_CONFIG;

      const easeStep = gsap.parseEase(stepEase);
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      type Slot = {
        xPercent: number;
        yPercent: number;
        scale: number;
        zIndex: number;
      };

      const slotFront = (): Slot => ({
        xPercent: -50,
        yPercent: -50,
        scale: frontScale,
        zIndex: frontZ,
      });

      /** j = 0 first card behind current front */
      const slotStack = (j: number): Slot => ({
        xPercent: -50 + (j + 1) * cardXOffset,
        yPercent: -50 + (j + 1) * stackDownY,
        scale: Math.max(0.92, frontScale - (j + 1) * stackScaleStep),
        zIndex: Math.max(backZ + 1, stackZBase - j),
      });

      /**
       * Exited cards fan horizontally so 2+ pile cards don’t read as one layer.
       * `pileSize` = count of cards on the pile (indices 0 … pileSize-1).
       */
      const slotPile = (i: number, pileSize: number): Slot => {
        const mid = pileSize > 0 ? (pileSize - 1) / 2 : 0;
        return {
          xPercent: -50 + (i - mid) * pileXSpread,
          yPercent: -50 - (i + 1) * pileUp,
          scale: exitedScale,
          zIndex: backZ + i,
        };
      };

      /**
       * Timeline: `p` ∈ [0,1] → `stepFloat` ∈ [0, n−1]. Each unit step is one handoff.
       * `stepIndex` = which transition (0..n−2), `t` = eased progress within that step.
       */
      const applyDeckTransforms = (card: HTMLElement, i: number, progress: number) => {
        const n = totalCards;
        const p = Math.min(1, Math.max(0, progress));

        if (n <= 1) {
          gsap.set(card, {
            ...slotFront(),
            rotationX: 0,
            opacity: 1,
            transformOrigin: '50% 50%',
          });
          return;
        }

        const numSteps = n - 1;
        const stepFloat = p * numSteps;
        const stepIndex = Math.min(Math.floor(stepFloat + 1e-9), numSteps - 1);
        const tRaw = Math.min(1, Math.max(0, stepFloat - stepIndex));
        const t = easeStep(tRaw);

        /** All steps complete — last card holds front; others fanned on the pile */
        if (p >= 1 - 1e-9) {
          const pileSize = n - 1;
          const end = i === n - 1 ? slotFront() : slotPile(i, pileSize);
          gsap.set(card, {
            ...end,
            rotationX: 0,
            opacity: pastOpacity,
            transformOrigin: '50% 50%',
          });
          return;
        }

        const s = stepIndex;

        if (i < s) {
          const settled = slotPile(i, s);
          gsap.set(card, {
            ...settled,
            rotationX: 0,
            opacity: pastOpacity,
            transformOrigin: '50% 50%',
          });
          return;
        }

        if (i === s) {
          const from = slotFront();
          const to = slotPile(s, s + 1);
          gsap.set(card, {
            xPercent: lerp(from.xPercent, to.xPercent, t),
            yPercent: lerp(from.yPercent, to.yPercent, t),
            scale: lerp(from.scale, to.scale, t),
            zIndex: Math.round(lerp(from.zIndex, to.zIndex, t)),
            rotationX: 0,
            opacity: 1,
            transformOrigin: '50% 50%',
          });
          return;
        }

        if (i === s + 1) {
          const from = slotStack(0);
          const to = slotFront();
          gsap.set(card, {
            xPercent: lerp(from.xPercent, to.xPercent, t),
            yPercent: lerp(from.yPercent, to.yPercent, t),
            scale: lerp(from.scale, to.scale, t),
            zIndex: Math.round(lerp(from.zIndex, to.zIndex, t)),
            rotationX: 0,
            opacity: 1,
            transformOrigin: '50% 50%',
          });
          return;
        }

        const fromJ = i - s - 1;
        const toJ = i - s - 2;
        const from = slotStack(fromJ);
        const to = slotStack(toJ);
        gsap.set(card, {
          xPercent: lerp(from.xPercent, to.xPercent, t),
          yPercent: lerp(from.yPercent, to.yPercent, t),
          scale: lerp(from.scale, to.scale, t),
          zIndex: Math.round(lerp(from.zIndex, to.zIndex, t)),
          rotationX: 0,
          opacity: 1,
          transformOrigin: '50% 50%',
        });
      };

      let attempts = 0;
      const mount = () => {
        attempts += 1;
        const cards = Array.from(root.querySelectorAll<HTMLElement>('.featured-stack-card'));
        if (cards.length !== totalCards) {
          if (attempts < 90) rafId = requestAnimationFrame(mount);
          return;
        }

        cards.forEach((card, i) => applyDeckTransforms(card, i, 0));

        const introEl = introRef.current;
        const counterEl = counterRef.current;

        const updateCounter = (progress: number) => {
          const el = counterRef.current;
          if (!el || totalCards < 2) return;
          const stepFloat = progress * (totalCards - 1);
          const frontIdx = Math.min(totalCards, Math.max(1, Math.floor(stepFloat + 1e-9) + 1));
          el.textContent = `${String(frontIdx).padStart(2, '0')} / ${String(totalCards).padStart(2, '0')}`;
        };

        st = ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: () => `+=${window.innerHeight * pinScrollHeightPerCard * totalCards}`,
          pin: true,
          pinSpacing: true,
          scrub: scrubSmoothing,
          invalidateOnRefresh: true,
          onUpdate: self => {
            const progress = self.progress;
            cards.forEach((card, i) => applyDeckTransforms(card, i, progress));
            updateCounter(progress);
            const intro = introRef.current;
            if (intro) {
              const h = Math.min(1, progress / Math.max(0.05, headerFadeSpan));
              gsap.set(intro, {
                opacity: 1 - h,
                y: -14 * h,
                pointerEvents: h > 0.95 ? 'none' : 'auto',
              });
            }
          },
        });

        if (introEl) {
          gsap.set(introEl, { opacity: 1, y: 0, pointerEvents: 'auto' });
        }
        if (counterEl && totalCards >= 2) {
          counterEl.textContent = `01 / ${String(totalCards).padStart(2, '0')}`;
        }
      };

      rafId = requestAnimationFrame(mount);

      const onResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', onResize);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', onResize);
        st?.kill();
      };
    },
    { scope: stickyRef, dependencies: [totalCards, displayedProjects.map(p => p._id).join(',')] }
  );

  return (
    <section className='bg-background py-4 md:py-8'>
      {/*
        Pinned block: intro sits above the deck (tight spacing), fades on scroll via ScrollTrigger.
        Deck area uses flex-1 so cards stay in view; no solid fill — works in light & dark mode.
      */}
      <div
        ref={stickyRef}
        className='sticky-cards relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-transparent'
      >
        <motion.div
          ref={introRef}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='relative z-[35] shrink-0 px-6 pb-1 pt-3 md:px-12 md:pb-2 md:pt-4 lg:px-24'
        >
          <div className='max-w-5xl'>
            <p className='mb-1.5 font-mono text-sm uppercase tracking-widest text-accent'>Selected Work</p>
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

        <div className='relative -mt-1 flex min-h-0 w-full flex-1 flex-col items-center justify-center pb-4 pt-0 md:-mt-2 md:pb-6'>
          {totalCards >= 2 ? (
            <div
              ref={counterRef}
              className='pointer-events-none absolute bottom-3 right-4 z-[45] font-mono text-xs tabular-nums tracking-widest text-foreground/70 md:bottom-5 md:right-10 md:text-sm'
              aria-live='polite'
              aria-atomic='true'
            >
              01 / {String(totalCards).padStart(2, '0')}
            </div>
          ) : null}
        {displayedProjects.map((project, index) => {
          const panelColor = stackColors[index % stackColors.length];
          const dateRange = formatDateRange(project.projectStart, project.projectEnd);
          const tags = project.tags?.slice(0, 4);
          const heroUrl = project.image
            ? urlForImage(project.image)?.width(1200).height(900).quality(80).url()
            : null;

          const contentImages = Array.isArray(project.content)
            ? (project.content as Array<{ _type?: string; asset?: { _ref?: string } }>).filter(
                item => item?._type === 'image' && item?.asset?._ref
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
            <div
              key={project._id}
              className='featured-stack-card card pointer-events-auto absolute left-1/2 top-1/2 flex w-[calc(100%-2rem)] flex-col gap-4 rounded-2xl p-5 shadow-2xl md:h-[60%] md:max-h-[620px] md:w-[65%] md:flex-row md:gap-4 md:p-8 lg:p-10'
              style={{
                transformOrigin: '50% 50%',
                color: '#fff',
                backgroundColor: panelColor,
                willChange: 'transform',
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
                        <div key={`${project._id}-t-${i}`} className='relative aspect-square overflow-hidden rounded-md'>
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
          );
        })}
        </div>
      </div>

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
