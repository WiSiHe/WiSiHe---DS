'use client';

import { IconArrowRight, IconMapPin } from '@tabler/icons-react';
import type { AboutQueryResult } from '@wisihe/sanity-queries';
import { Button, Chip } from '@wisihe/ui-react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LOCATION_TYPE_META, normalizeJourneyItems } from '@/app/about/components/lifeJourneyTypes';
import { type AboutTeaserSectionData, buildAboutTeaserCopy } from '@/lib/homeSectionCopy';
import HomeSectionHeader from '../HomeSectionHeader/HomeSectionHeader';

type AboutTeaserSectionProps = {
  section: AboutTeaserSectionData | null;
  about: AboutQueryResult | null;
};

export default function AboutTeaserSection({ section, about }: AboutTeaserSectionProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = mounted && prefersReducedMotion;

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
    <section
      className='relative overflow-hidden border-t border-border/20 bg-background py-24 px-4 md:px-8'
      aria-labelledby='about-teaser-heading'
    >
      <div
        className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_80%_60%_at_50%_0%,#000_20%,transparent_100%)]'
        aria-hidden
      />

      <div className='relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16 lg:items-center'>
        <div className='lg:col-span-7'>
          <HomeSectionHeader
            align='left'
            eyebrow={eyebrow}
            title={title}
            headingId='about-teaser-heading'
            description={description}
          />

          {knowsAbout.length > 0 ? (
            <motion.ul
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reducedMotion ? 0 : 0.15, duration: 0.4 }}
              className='mt-6 flex flex-wrap gap-2'
              aria-label='Areas of expertise'
            >
              {knowsAbout.map(topic => (
                <li key={topic}>
                  <Chip label={topic} variation='secondary' interactive={false} />
                </li>
              ))}
            </motion.ul>
          ) : null}

          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: reducedMotion ? 0 : 0.25, duration: 0.4 }}
            className='mt-8 flex flex-wrap gap-3'
          >
            <Button
              as={Link}
              href='/about'
              variant='primary'
              size='large'
              Icon={IconArrowRight}
              iconPosition='right'
              className='rounded-full'
            >
              {primaryLabel}
            </Button>
            <Button
              as={Link}
              href='/contact'
              variant='secondary'
              size='large'
              className='rounded-full'
            >
              {secondaryLabel}
            </Button>
          </motion.div>
        </div>

        {journeyHighlight ? (
          <motion.aside
            initial={reducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: reducedMotion ? 0 : 0.2, duration: 0.5 }}
            className='lg:col-span-5'
          >
            <Link
              href='/about'
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
    </section>
  );
}
