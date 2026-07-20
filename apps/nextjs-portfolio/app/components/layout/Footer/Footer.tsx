'use client';

import { IconArrowUpRight } from '@tabler/icons-react';
import { footerLinks, footerSecondaryLinks } from '@wisihe/constants';
import { Button } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';
import { scrollDocumentToTop } from '@/app/lib/lenis-registry';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';
import { useSectionReveal } from '@/lib/motion/sectionReveal';
import { SITE_TAGLINE } from '@/lib/siteCopy';
import { APP_VERSION } from '@/lib/version';
import IconLogo from '../icons/IconLogo';
import { Link } from '../ProgressLink';
import { SocialListItem } from './SocialListItem';

type FooterProps = {
  socialLinks: { _key: string; platform?: string | null; url?: string | null }[] | null | undefined;
  jobTitle?: string | null;
  heroSubtitle?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

const Footer = ({ socialLinks, jobTitle, heroSubtitle, ctaLabel, ctaHref }: FooterProps) => {
  const { fadeUpInitial, fadeUpAnimate, viewport, transition, reducedMotion } = useSectionReveal();

  const currentYear = new Date().getFullYear();
  const displayName = heroSubtitle?.trim() || 'Henrik Wilhelm Sissener';
  const displayRole = jobTitle?.trim() || 'Frontend developer & digital artist';
  const contactHref = ctaHref?.trim() || '/contact';
  const contactLabel = ctaLabel?.trim() || 'Get in touch';

  const motionProps = {
    initial: fadeUpInitial,
    whileInView: fadeUpAnimate,
    viewport,
    transition,
  };

  const scrollToTop = () => {
    scrollDocumentToTop({ immediate: Boolean(reducedMotion) });
  };

  return (
    <footer className='relative w-full overflow-hidden border-t border-border bg-surface print:hidden'>
      <div
        className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_20%,transparent_100%)]'
        aria-hidden
      />

      <div className='relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 md:px-8 lg:px-12'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10'>
          {/* Brand + bio */}
          <motion.div {...motionProps} className='space-y-5 lg:col-span-5'>
            <Link
              href='/'
              aria-label='WiSiHe home'
              className='group inline-flex items-center gap-3 text-foreground transition-colors hover:text-accent'
            >
              <IconLogo
                size={44}
                className='text-foreground transition-colors group-hover:text-accent'
              />
              <span className='font-serif text-2xl font-bold tracking-tight'>WiSiHe</span>
            </Link>

            <div className='space-y-3'>
              <p className='font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent'>
                {displayRole}
              </p>
              <h2 className='font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl'>
                {displayName}
              </h2>
              <p className='max-w-md text-base leading-relaxed text-foreground-subtle text-pretty'>
                {SITE_TAGLINE}
              </p>
            </div>

            <Button
              as={Link}
              href={contactHref}
              variant='primary'
              size='large'
              Icon={IconArrowUpRight}
              iconPosition='right'
              className='rounded-full'
              onClick={() =>
                trackEvent(AnalyticsEvent.FOOTER_CTA_CLICKED, {
                  label: contactLabel,
                  href: contactHref,
                })
              }
            >
              {contactLabel}
            </Button>
          </motion.div>

          {/* Navigation + social */}
          <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3'>
            <motion.nav
              {...motionProps}
              transition={{ ...transition, delay: reducedMotion ? 0 : 0.05 }}
              className='space-y-4'
              aria-label='Site navigation'
            >
              <h3 className='text-xs font-semibold uppercase tracking-widest text-foreground-muted'>
                Explore
              </h3>
              <ul className='space-y-2'>
                {footerLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className='text-base font-medium text-foreground-subtle transition-colors hover:text-accent'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>

            <motion.nav
              {...motionProps}
              transition={{ ...transition, delay: reducedMotion ? 0 : 0.1 }}
              className='space-y-4'
              aria-label='Additional pages'
            >
              <h3 className='text-xs font-semibold uppercase tracking-widest text-foreground-muted'>
                More
              </h3>
              <ul className='space-y-2'>
                {footerSecondaryLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className='text-base font-medium text-foreground-subtle transition-colors hover:text-accent'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>

            <motion.div
              {...motionProps}
              transition={{ ...transition, delay: reducedMotion ? 0 : 0.15 }}
              className='space-y-4'
            >
              <h3 className='text-xs font-semibold uppercase tracking-widest text-foreground-muted'>
                Connect
              </h3>
              {socialLinks?.length ? (
                <ul className='flex flex-wrap gap-2.5' aria-label='Social links'>
                  {socialLinks.map(link => (
                    <li key={link._key}>
                      <SocialListItem item={link} variant='icon' />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm text-foreground-muted'>
                  <Link href='/contact' className='text-accent hover:underline'>
                    Contact me
                  </Link>{' '}
                  for collaborations and inquiries.
                </p>
              )}
            </motion.div>
          </div>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className='rounded-xl border border-dashed border-accent/25 bg-accent/5 px-4 py-3'>
            <p className='mb-2 text-[10px] font-bold uppercase tracking-widest text-accent'>
              Dev links
            </p>
            <nav className='flex flex-wrap gap-x-5 gap-y-2 text-xs text-foreground-muted'>
              {[
                { name: 'Test', href: '/test' },
                { name: 'Data', href: '/data' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='hover:text-accent transition-colors'
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}

        <div
          className={cn(
            'flex flex-col gap-3 border-t border-border/40 pt-6 text-xs text-foreground-muted',
            'sm:flex-row sm:items-center sm:justify-between',
          )}
        >
          <p>
            © {currentYear} {displayName}
          </p>
          <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
            <Link
              href='/privacy'
              className='font-medium text-foreground-subtle transition-colors hover:text-accent'
            >
              Privacy
            </Link>
            <span>Built in Oslo with Next.js & Sanity</span>
            <span className='font-mono text-[10px] tracking-wide text-foreground-muted/80'>
              v{APP_VERSION}
            </span>
            <button
              type='button'
              onClick={scrollToTop}
              className='font-medium text-foreground-subtle transition-colors hover:text-accent'
            >
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
