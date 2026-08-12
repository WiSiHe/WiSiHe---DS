import { IconArrowUpRight } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { footerLinks, footerSecondaryLinks } from '@wisihe/constants';
import { Button } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { SITE_BIO } from '@/lib/siteCopy';
import { IconLogo } from '../icons/IconLogo';
import { RouterLink } from './RouterLink';
import { SocialListItem } from './SocialListItem';

export type FooterData = {
  socialLinks: Array<{ _key: string; platform?: string | null; url?: string | null }> | null;
  jobTitle: string | null;
  heroSubtitle: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
};

type FooterProps = {
  data: FooterData;
};

export function Footer({ data }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const displayName = data.heroSubtitle?.trim() || 'Henrik Wilhelm Sissener';
  const displayRole = data.jobTitle?.trim() || 'Frontend developer & digital artist';
  const contactHref = data.ctaHref?.trim() || '/contact';
  const contactLabel = data.ctaLabel?.trim() || 'Get in touch';

  return (
    <footer className='relative mt-20 w-full overflow-hidden border-t border-border bg-surface recipe-screen-only print:hidden'>
      <div
        className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent'
        aria-hidden
      />
      <div className='relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 md:px-8 lg:px-12'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10'>
          <div className='space-y-5 lg:col-span-5'>
            <Link
              to='/'
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
                {SITE_BIO}
              </p>
            </div>

            <Button
              as={RouterLink}
              href={contactHref}
              variant='primary'
              size='large'
              Icon={IconArrowUpRight}
              iconPosition='right'
              className='rounded-full'
            >
              {contactLabel}
            </Button>
          </div>

          <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3'>
            <nav className='space-y-4' aria-label='Site navigation'>
              <h3 className='text-xs font-semibold uppercase tracking-widest text-foreground-muted'>
                Explore
              </h3>
              <ul className='space-y-2'>
                {footerLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      to={link.href as '/'}
                      className='text-base font-medium text-foreground-subtle transition-colors hover:text-accent'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className='space-y-4' aria-label='Additional pages'>
              <h3 className='text-xs font-semibold uppercase tracking-widest text-foreground-muted'>
                More
              </h3>
              <ul className='space-y-2'>
                {footerSecondaryLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      to={link.href as '/'}
                      className='text-base font-medium text-foreground-subtle transition-colors hover:text-accent'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to='/privacy'
                    className='text-base font-medium text-foreground-subtle transition-colors hover:text-accent'
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </nav>

            <div className='space-y-4'>
              <h3 className='text-xs font-semibold uppercase tracking-widest text-foreground-muted'>
                Connect
              </h3>
              {data.socialLinks?.length ? (
                <ul className='flex flex-wrap gap-2.5' aria-label='Social links'>
                  {data.socialLinks.map(link => (
                    <li key={link._key}>
                      <SocialListItem item={link} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm text-foreground-muted'>
                  <Link to='/contact' className='text-accent hover:underline'>
                    Contact me
                  </Link>{' '}
                  for collaborations and inquiries.
                </p>
              )}
            </div>
          </div>
        </div>

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
              to='/privacy'
              className='font-medium text-foreground-subtle transition-colors hover:text-accent'
            >
              Privacy
            </Link>
            <span>Built in Oslo with TanStack Start & Sanity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
