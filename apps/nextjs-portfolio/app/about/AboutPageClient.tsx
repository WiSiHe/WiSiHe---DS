'use client';

import { useGSAP } from '@gsap/react';
import type { AboutQueryResult } from '@wisihe/sanity-queries';
import { Button } from '@wisihe/ui-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Link from 'next/link';
import { useRef } from 'react';
import { BsTwitterX } from 'react-icons/bs';
import { FaChevronDown, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import SkillsSection from '../components/marketing/SkillsSection/SkillsSection';
import { LifeJourneyScrolly } from './components/LifeJourneyScrolly';
import { normalizeJourneyItems, normalizeVisitedCountries } from './components/lifeJourneyTypes';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  GitHub: <FaGithub />,
  LinkedIn: <FaLinkedin />,
  Linkedin: <FaLinkedin />,
  Instagram: <FaInstagram />,
  Twitter: <BsTwitterX />,
  X: <BsTwitterX />,
};

export default function AboutPageClient({ about }: { about: AboutQueryResult }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const heroTitle = about?.heroTitle ?? 'Story of WiSiHe';
  const heroSubtitle = about?.heroSubtitle ?? 'Henrik Wilhelm Sissener';
  const jobTitle = about?.jobTitle ?? 'Frontend developer & digital artist';
  const bio =
    about?.bio ??
    'Frontend developer and digital artist based in Oslo. I build fast, polished web experiences and create digital paintings — two disciplines that keep feeding each other.';
  const journeyItems = normalizeJourneyItems(about?.journeyItems);
  const visitedCountries = normalizeVisitedCountries(about?.visitedCountries);
  const ctaTitle = about?.ctaTitle ?? "Let's create the Future together.";
  const ctaButtonText = about?.ctaButtonText ?? 'Start a Conversation';
  const ctaButtonUrl = about?.ctaButtonUrl ?? '/contact';
  const socialLinks = about?.socialLinks ?? [];

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
    <div ref={containerRef} className='overflow-x-hidden bg-background text-foreground'>
      <section
        ref={heroRef}
        className='relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden border-b border-border/30 px-4 py-20'
      >
        <div className='hero-bg pointer-events-none absolute inset-0 bg-accent/10' aria-hidden />
        <div
          className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_20%,transparent_100%)]'
          aria-hidden
        />

        <div className='relative z-10 mx-auto max-w-4xl text-center'>
          <p className='hero-text font-mono text-xs font-semibold uppercase tracking-[0.3em] text-accent'>
            {jobTitle}
          </p>
          <h1 className='hero-text mt-4 font-serif text-5xl font-bold tracking-tight text-foreground sm:text-7xl md:text-8xl'>
            {heroTitle}
          </h1>
          <p className='hero-text mt-3 text-xl font-medium text-foreground-subtle sm:text-2xl'>
            {heroSubtitle}
          </p>
          <p className='hero-text mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-foreground-muted text-pretty'>
            {bio}
          </p>

          {socialLinks.length > 0 ? (
            <div className='hero-text mt-10 flex justify-center gap-4'>
              {socialLinks.map(social => (
                <a
                  key={social.url ?? social.platform}
                  href={social.url ?? undefined}
                  target='_blank'
                  rel='noopener noreferrer author'
                  className='flex size-11 items-center justify-center rounded-full border border-border text-xl text-foreground-subtle transition-colors hover:border-accent-border hover:text-accent'
                  aria-label={social.platform ?? 'Social profile'}
                >
                  {PLATFORM_ICONS[social.platform ?? ''] ?? social.platform?.[0]}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div
          className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-2xl text-accent/50'
          aria-hidden
        >
          <FaChevronDown />
        </div>
      </section>

      {journeyItems.length > 0 ? (
        <LifeJourneyScrolly items={journeyItems} visitedCountries={visitedCountries} />
      ) : null}

      <section className='border-t border-border/30 bg-background py-20 lg:py-32'>
        <SkillsSection />
      </section>

      <section className='border-t border-border/30 bg-surface/30 px-4 py-24 text-center sm:py-32'>
        <div className='mx-auto max-w-3xl space-y-8'>
          <h2 className='font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl'>
            {ctaTitle.includes('Future') ? (
              <>
                {ctaTitle.split('Future')[0]}
                <span className='text-accent italic'>Future</span>
                {ctaTitle.split('Future')[1]}
              </>
            ) : (
              ctaTitle
            )}
          </h2>
          <div className='flex justify-center'>
            <Button
              as={Link}
              href={ctaButtonUrl}
              variant='primary'
              size='large'
              className='rounded-full'
            >
              {ctaButtonText}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
