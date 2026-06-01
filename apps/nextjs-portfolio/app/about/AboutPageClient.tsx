'use client';

import { useGSAP } from '@gsap/react';
import type { AboutQueryResult } from '@wisihe/sanity-queries';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { FaChevronDown, FaGithub, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import SkillsSection from '../components/marketing/SkillsSection/SkillsSection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  GitHub: <FaGithub />,
  LinkedIn: <FaLinkedin />,
  Instagram: <FaInstagram />,
  Twitter: <FaTwitter />,
};

export default function AboutPageClient({ about }: { about: AboutQueryResult }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const heroTitle = about?.heroTitle ?? 'Story of WiSiHe';
  const heroSubtitle = about?.heroSubtitle ?? 'Henrik Sissener';
  const journeyItems = about?.journeyItems ?? [];
  const ctaTitle = about?.ctaTitle ?? "Let's create the Future together.";
  const ctaButtonText = about?.ctaButtonText ?? 'Start a Conversation';
  const ctaButtonUrl = about?.ctaButtonUrl ?? '/contact';
  const socialLinks = about?.socialLinks ?? [
    { platform: 'GitHub', url: 'https://github.com/wisihe' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/henrik-sissener' },
    { platform: 'Instagram', url: 'https://instagram.com/wisihe' },
    { platform: 'Twitter', url: 'https://twitter.com/wisihe' },
  ];

  useGSAP(
    () => {
      gsap.from('.hero-text', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
      });

      gsap.to('.hero-bg', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        y: 200,
        opacity: 0,
      });

      const sections = gsap.utils.toArray('.journey-section') as Element[];
      sections.forEach(section => {
        const text = section.querySelector('.journey-text');
        const image = section.querySelector('.journey-image');

        gsap.from(text, {
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 40%', scrub: 1 },
          x: -100,
          opacity: 0,
          ease: 'none',
        });

        gsap.from(image, {
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 40%', scrub: 1 },
          x: 100,
          opacity: 0,
          scale: 0.8,
          ease: 'none',
        });
      });

      gsap.from('.skills-entrance', {
        scrollTrigger: { trigger: '.skills-entrance', start: 'top 90%' },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className='bg-background text-foreground overflow-x-hidden'>
      {/* Hero */}
      <section
        ref={heroRef}
        className='relative h-screen flex flex-col items-center justify-center p-4 overflow-hidden border-b border-border/30'
      >
        <div className='hero-bg absolute inset-0 z-0 opacity-10 pointer-events-none bg-accent/10' />
        <div className='z-10 text-center max-w-5xl'>
          <h1 className='hero-text text-6xl md:text-9xl font-black mb-6 text-foreground leading-none uppercase'>
            {heroTitle}
          </h1>
          <p className='hero-text text-xl md:text-3xl text-accent font-medium uppercase tracking-[0.2em] mb-12'>
            {heroSubtitle}
          </p>
          <div className='hero-text flex justify-center gap-6'>
            {socialLinks.map((social: { platform: string | null; url: string | null }) => (
              <a
                key={social.url ?? social.platform}
                href={social.url ?? undefined}
                target='_blank'
                rel='noopener noreferrer'
                className='text-3xl text-foreground/50 hover:text-accent transition-colors'
                aria-label={social.platform ?? undefined}
              >
                {PLATFORM_ICONS[social.platform ?? ''] ?? null}
              </a>
            ))}
          </div>
        </div>
        <div className='absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-accent/50 text-2xl'>
          <FaChevronDown />
        </div>
      </section>

      {/* Journey */}
      {journeyItems.map((item, idx) => (
        <section
          key={item._key ?? item.title}
          className='journey-section min-h-screen py-32 px-4 md:px-8 flex items-center bg-surface/5 even:bg-background'
        >
          <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
            <div className={`journey-text space-y-8 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
              <span className='text-accent font-bold tracking-[0.3em] uppercase block'>
                {item.year}
              </span>
              <h2 className='text-4xl md:text-7xl font-black uppercase text-foreground leading-tight italic'>
                {item.title}
              </h2>
              <p className='text-xl md:text-2xl text-foreground/60 leading-relaxed font-light'>
                {item.content}
              </p>
            </div>
            <div className={`journey-image relative ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
              <div className='absolute -inset-3 rounded-[2.8rem] border-2 border-dashed border-accent/30' />
              <div className='relative aspect-4/5 rounded-[2.5rem] overflow-hidden border border-border/50 shadow-xl'>
                {item.image?.asset ? (
                  <Image
                    src={`https://cdn.sanity.io/images/cbjsv7wi/production/${item.image.asset._ref.replace('image-', '').replace(/-(\w+)$/, '.$1')}`}
                    alt={item.title ?? ''}
                    fill
                    className='object-cover'
                    placeholder={item.image.lqip ? 'blur' : 'empty'}
                    blurDataURL={item.image.lqip ?? undefined}
                  />
                ) : (
                  <div className='w-full h-full bg-surface-subtle' />
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Skills */}
      <section className='skills-entrance py-20 lg:py-40 bg-background border-t border-border/30'>
        <SkillsSection />
      </section>

      {/* CTA */}
      <section className='py-40 px-4 text-center bg-surface/5'>
        <div className='max-w-4xl mx-auto space-y-12'>
          <h2 className='text-4xl md:text-7xl font-black uppercase leading-tight'>
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
            <Link
              href={ctaButtonUrl}
              className='px-12 py-5 bg-accent text-accent-contrast font-black rounded-full text-xl uppercase tracking-widest border border-accent-border shadow-lg hover:brightness-105 transition-all'
            >
              {ctaButtonText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
