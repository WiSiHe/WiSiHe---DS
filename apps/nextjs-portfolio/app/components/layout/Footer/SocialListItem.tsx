'use client';

import { BiLogoRedbubble } from 'react-icons/bi';
import { BsTwitterX } from 'react-icons/bs';
import { FaArtstation, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';

const iconPlatform = {
  Instagram: <FaInstagram />,
  X: <BsTwitterX />,
  Facebook: <FaFacebook />,
  Linkedin: <FaLinkedin />,
  Redbubble: <BiLogoRedbubble />,
  Artstation: <FaArtstation />,
};

interface SocialLink {
  platform?: string | null;
  _key: string;
  url?: string | null;
}

type SocialListItemProps = {
  item: SocialLink;
  variant?: 'card' | 'icon';
};

export const SocialListItem = ({ item, variant = 'card' }: SocialListItemProps) => {
  const { platform, url } = item;
  const Icon = platform ? iconPlatform[platform as keyof typeof iconPlatform] : null;

  if (!url) return null;

  const handleClick = () => {
    trackEvent(AnalyticsEvent.FOOTER_SOCIAL_CLICKED, {
      platform: platform ?? 'unknown',
      url,
    });
  };

  if (variant === 'icon') {
    return (
      <a
        href={url}
        target='_blank'
        rel='noopener noreferrer'
        onClick={handleClick}
        className='flex size-11 items-center justify-center rounded-full border border-border bg-background text-lg text-foreground-subtle transition-colors duration-200 hover:border-accent-border hover:bg-surface-hover hover:text-accent'
        aria-label={`Follow on ${platform}`}
      >
        {Icon}
      </a>
    );
  }

  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      onClick={handleClick}
      className='flex h-10 items-center gap-4 rounded-md border border-border bg-surface px-4 py-3 text-2xl text-foreground transition-all duration-200 hover:border-accent-border hover:bg-surface-hover hover:shadow-sm'
      aria-label={`Follow on ${platform}`}
    >
      <span className='shrink-0'>{Icon}</span>
      <span className='font-oswald text-xl font-semibold'>{platform}</span>
    </a>
  );
};
