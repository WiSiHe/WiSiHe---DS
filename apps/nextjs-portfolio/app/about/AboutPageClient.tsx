'use client';

import { useGSAP } from '@gsap/react';
import {
  IconArrowRight,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconChevronDown,
} from '@tabler/icons-react';
import type { AboutQueryResult } from '@wisihe/sanity-queries';
import { Button } from '@wisihe/ui-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { urlForImage } from '@/sanity/lib/utils';
import SkillsSection from '../components/marketing/SkillsSection/SkillsSection';
import { LifeJourneyScrolly } from './components/LifeJourneyScrolly';
import {
  normalizeAdventurePlaces,
  normalizeJourneyItems,
  normalizeVisitedCountries,
  type TravelPhotoItem,
} from './components/lifeJourneyTypes';
import { TravelOverviewSection } from './components/TravelOverviewSection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  GitHub: <IconBrandGithub className='size-5' stroke={2} aria-hidden />,
  LinkedIn: <IconBrandLinkedin className='size-5' stroke={2} aria-hidden />,
  Linkedin: <IconBrandLinkedin className='size-5' stroke={2} aria-hidden />,
  Instagram: <IconBrandInstagram className='size-5' stroke={2} aria-hidden />,
  Twitter: <IconBrandX className='size-5' stroke={2} aria-hidden />,
  X: <IconBrandX className='size-5' stroke={2} aria-hidden />,
};

export default function AboutPageClient({
  about,
  travelPhotos = [],
}: {
  about: AboutQueryResult;
  travelPhotos?: TravelPhotoItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const name = about?.heroSubtitle ?? 'Henrik Wilhelm Sissener';
  const heroEyebrow = about?.heroTitle?.trim() || 'Biography';
  const jobTitle = about?.jobTitle ?? 'Frontend developer & digital artist';
  const bio =
    about?.bio ??
    'Frontend developer and digital artist based in Oslo. I build fast, polished web experiences and create digital paintings — two disciplines that keep feeding each other.';
  const journeyItems = normalizeJourneyItems(about?.journeyItems);
  const visitedCountries = normalizeVisitedCountries(about?.visitedCountries);
  const adventurePlaces = normalizeAdventurePlaces(about?.adventurePlaces);
  const ctaTitle = about?.ctaTitle ?? 'Say hello';
  const ctaDescription =
    about?.ctaDescription ??
    'Questions about the work, licensing, or anything else — I read every message.';
  const ctaButtonText = about?.ctaButtonText ?? 'Send a message';
  const ctaButtonUrl = about?.ctaButtonUrl ?? '/contact';
  const socialLinks = about?.socialLinks ?? [];
  type AboutPortrait = NonNullable<NonNullable<AboutQueryResult>['journeyItems']>[number]['image'];
  const portrait = about?.portrait as AboutPortrait | null | undefined;
  const portraitUrl = portrait
    ? urlForImage(portrait)?.width(640).height(800).quality(85).url()
    : null;

  useGSAP(
    () => {
      gsap.from('.hero-text', {
        y: 48,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out',
      });

      gsap.to('.hero-bg', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        y: 120,
        opacity: 0,
      });
    },
    { scope: containerRef },
  );

  return (
    <main
      ref={containerRef}
      className='bg-background pb-[calc(5.5rem+env(safe-area-inset-bottom))] text-foreground'
    >
      <section
        ref={heroRef}
        aria-labelledby='about-hero-heading'
        className='relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden border-b border-border/30 px-4 py-20'
      >
        <div className='hero-bg pointer-events-none absolute inset-0 bg-accent/10' aria-hidden />
        <div
          className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_20%,transparent_100%)]'
          aria-hidden
        />

        <div className='relative z-10 mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,260px)_1fr] lg:items-center lg:gap-14'>
          <figure className='hero-text mx-auto w-full max-w-[220px] sm:max-w-[260px] lg:mx-0'>
            {portraitUrl ? (
              <div className='relative aspect-4/5 overflow-hidden rounded-2xl border border-border/60 shadow-xl'>
                <Image
                  src={portraitUrl}
                  alt={`Portrait of ${name}`}
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 220px, 260px'
                  priority
                  placeholder={portrait?.lqip ? 'blur' : 'empty'}
                  blurDataURL={portrait?.lqip ?? undefined}
                />
              </div>
            ) : (
              <div
                className='relative flex aspect-4/5 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed border-border/70 bg-surface/40'
                aria-label='Portrait placeholder'
              >
                <span className='font-serif text-5xl font-bold text-accent/35' aria-hidden>
                  HWS
                </span>
                <span className='font-mono text-[10px] uppercase tracking-[0.22em] text-foreground-muted'>
                  Portrait
                </span>
              </div>
            )}
          </figure>

          <div className='text-center lg:text-left'>
            <p className='hero-text font-mono text-xs font-semibold uppercase tracking-[0.3em] text-accent'>
              {heroEyebrow}
            </p>
            <h1
              id='about-hero-heading'
              className='hero-text mt-4 font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl'
            >
              {name}
            </h1>
            <p className='hero-text mt-4 text-lg font-medium text-foreground-subtle sm:text-xl'>
              {jobTitle}
            </p>
            <p className='hero-text mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-foreground-muted text-pretty lg:mx-0'>
              {bio}
            </p>

            {socialLinks.length > 0 ? (
              <div className='hero-text mt-10 flex justify-center gap-4 lg:justify-start'>
                {socialLinks.map(social =>
                  social.url ? (
                    <a
                      key={social.url}
                      href={social.url}
                      target='_blank'
                      rel='noopener noreferrer author'
                      className='flex size-11 items-center justify-center rounded-full border border-border text-xl text-foreground-subtle transition-colors hover:border-accent-border hover:text-accent'
                      aria-label={`${social.platform ?? 'Social profile'} (opens in new tab)`}
                    >
                      {PLATFORM_ICONS[social.platform ?? ''] ?? social.platform?.[0]}
                    </a>
                  ) : null,
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div
          className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-2xl text-accent/50'
          aria-hidden
        >
          <IconChevronDown className='size-5 animate-bounce stroke-[2]' aria-hidden />
        </div>
      </section>

      {journeyItems.length > 0 ? <LifeJourneyScrolly items={journeyItems} /> : null}

      {visitedCountries.length > 0 ? (
        <TravelOverviewSection
          visitedCountries={visitedCountries}
          adventurePlaces={adventurePlaces}
          travelPhotos={travelPhotos}
        />
      ) : null}

      <section className='border-t border-border/30 bg-background py-20 lg:py-32'>
        <SkillsSection />
      </section>

      <section
        className='border-t border-border/40 bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8'
        aria-labelledby='about-contact-heading'
      >
        <div className='mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-12'>
          <div className='max-w-xl space-y-3'>
            <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
              Contact
            </p>
            <h2
              id='about-contact-heading'
              className='font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance'
            >
              {ctaTitle}
            </h2>
            {ctaDescription ? (
              <p className='text-base leading-relaxed text-foreground-subtle text-pretty sm:text-lg'>
                {ctaDescription}
              </p>
            ) : null}
          </div>
          <Button
            as={Link}
            href={ctaButtonUrl}
            variant='secondary'
            size='large'
            Icon={IconArrowRight}
            iconPosition='right'
            className='shrink-0 self-start sm:self-auto'
          >
            {ctaButtonText}
          </Button>
        </div>
      </section>
    </main>
  );
}
