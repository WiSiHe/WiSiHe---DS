'use client';

import { IconArrowRight, IconMapPin } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import type { AboutQueryResult } from '@wisihe/sanity-queries';
import { Button, Chip, ScrollGrowSection, SectionHeader } from '@wisihe/ui-react';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { LOCATION_TYPE_META, normalizeJourneyItems } from '@/about/components/lifeJourneyTypes';
import { type AboutTeaserSectionData, buildAboutTeaserCopy } from '@/lib/homeSectionCopy';
import {
  staggerContainerVariants,
  staggerFadeUpItemVariants,
  useSectionReveal,
} from '@/lib/motion/sectionReveal';

type AboutTeaserSectionProps = {
  section: AboutTeaserSectionData | null;
  about: AboutQueryResult | null;
};

export default function AboutTeaserSection({ section, about }: AboutTeaserSectionProps) {
  const { reducedMotion, viewport, transition, slideInRightInitial, slideInRightAnimate } =
    useSectionReveal();
  const chipContainerVariants = staggerContainerVariants(reducedMotion, 0.06);
  const chipItemVariants = staggerFadeUpItemVariants(reducedMotion);

  const eyebrow = section?.eyebrow?.trim() || '// About';
  const title = section?.title?.trim() || 'Code, canvas, and curiosity';
  const description = buildAboutTeaserCopy(section, about);
  const primaryLabel = section?.primaryLabel?.trim() || 'My story';
  const secondaryLabel = section?.secondaryLabel?.trim() || 'Get in touch';
  const journeyEyebrow = section?.journeyEyebrow?.trim() || 'Life journey';
  const journeyLinkLabel = section?.journeyLinkLabel?.trim() || 'View full journey';

  const knowsAbout = (about?.knowsAbout ?? []).filter(Boolean).slice(0, 6);

  const journeyHighlight = useMemo(() => {
    const items = normalizeJourneyItems(about?.journeyItems);
    if (items.length === 0) return null;
    return items.find(item => item.placeName) ?? items[0] ?? null;
  }, [about?.journeyItems]);

  const locationMeta = journeyHighlight?.locationType
    ? LOCATION_TYPE_META[journeyHighlight.locationType]
    : null;

  return (
    <ScrollGrowSection
      className='border-t border-border/20 bg-background py-24 px-4 md:px-8'
      aria-labelledby='about-teaser-heading'
    >
      <div className='mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16 lg:items-center'>
        <div className='lg:col-span-7'>
          <SectionHeader
            align='left'
            eyebrow={eyebrow}
            title={title}
            headingId='about-teaser-heading'
            description={description}
          />

          {knowsAbout.length > 0 ? (
            <motion.ul
              aria-label='Areas of expertise'
              className='mt-6 flex flex-wrap gap-2'
              initial='hidden'
              whileInView='visible'
              viewport={viewport}
              variants={chipContainerVariants}
            >
              {knowsAbout.map(topic => (
                <motion.li key={topic} variants={chipItemVariants}>
                  <Chip label={topic} variation='secondary' interactive={false} />
                </motion.li>
              ))}
            </motion.ul>
          ) : null}

          <motion.div
            className='mt-8 flex flex-wrap gap-3'
            initial='hidden'
            whileInView='visible'
            viewport={viewport}
            variants={chipContainerVariants}
          >
            <motion.div variants={chipItemVariants}>
              <Button
                as={Link}
                to='/about'
                variant='primary'
                size='large'
                Icon={IconArrowRight}
                iconPosition='right'
                className='rounded-full'
              >
                {primaryLabel}
              </Button>
            </motion.div>
            <motion.div variants={chipItemVariants}>
              <Button
                as={Link}
                to='/contact'
                variant='secondary'
                size='large'
                className='rounded-full'
              >
                {secondaryLabel}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {journeyHighlight ? (
          <motion.aside
            className='lg:col-span-5'
            initial={slideInRightInitial}
            whileInView={slideInRightAnimate}
            viewport={viewport}
            transition={transition}
          >
            <Link
              to='/about'
              className='group block rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:border-accent-border hover:shadow-md md:p-8'
            >
              <p className='font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-accent'>
                {journeyEyebrow}
              </p>
              {journeyHighlight.year ? (
                <p className='mt-3 font-serif text-4xl font-bold text-foreground'>
                  {journeyHighlight.year}
                </p>
              ) : null}
              <h3 className='mt-2 text-xl font-semibold text-foreground transition-colors group-hover:text-accent'>
                {journeyHighlight.title ?? 'Explore the map'}
              </h3>
              {journeyHighlight.placeName ? (
                <p className='mt-3 flex items-center gap-2 text-sm text-foreground-subtle'>
                  <IconMapPin className='size-4 shrink-0 text-accent' aria-hidden />
                  {journeyHighlight.placeName}
                  {locationMeta ? (
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${locationMeta.chipClass}`}
                    >
                      {locationMeta.label}
                    </span>
                  ) : null}
                </p>
              ) : null}
              {journeyHighlight.content ? (
                <p className='mt-4 line-clamp-3 text-sm leading-relaxed text-foreground-muted'>
                  {journeyHighlight.content}
                </p>
              ) : null}
              <span className='mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent'>
                {journeyLinkLabel}
                <IconArrowRight className='size-4 transition-transform group-hover:translate-x-0.5' />
              </span>
            </Link>
          </motion.aside>
        ) : null}
      </div>
    </ScrollGrowSection>
  );
}
