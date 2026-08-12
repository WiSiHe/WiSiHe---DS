'use client';

import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
  IconPalette,
  IconShoppingBag,
} from '@tabler/icons-react';

const iconClass = 'size-5 stroke-[2]';

const iconPlatform = {
  Instagram: <IconBrandInstagram className={iconClass} aria-hidden />,
  X: <IconBrandX className={iconClass} aria-hidden />,
  Twitter: <IconBrandX className={iconClass} aria-hidden />,
  Facebook: <IconBrandFacebook className={iconClass} aria-hidden />,
  Linkedin: <IconBrandLinkedin className={iconClass} aria-hidden />,
  LinkedIn: <IconBrandLinkedin className={iconClass} aria-hidden />,
  GitHub: <IconBrandGithub className={iconClass} aria-hidden />,
  Github: <IconBrandGithub className={iconClass} aria-hidden />,
  YouTube: <IconBrandYoutube className={iconClass} aria-hidden />,
  Youtube: <IconBrandYoutube className={iconClass} aria-hidden />,
  Redbubble: <IconShoppingBag className={iconClass} aria-hidden />,
  Artstation: <IconPalette className={iconClass} aria-hidden />,
};

type SocialLink = {
  platform?: string | null;
  _key: string;
  url?: string | null;
};

type SocialListItemProps = {
  item: SocialLink;
};

export function SocialListItem({ item }: SocialListItemProps) {
  const { platform, url } = item;
  const Icon =
    platform && platform in iconPlatform ? (
      iconPlatform[platform as keyof typeof iconPlatform]
    ) : platform ? (
      <IconPalette className={iconClass} aria-hidden />
    ) : null;

  if (!url) return null;

  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='flex size-11 items-center justify-center rounded-full border border-border bg-background text-lg text-foreground-subtle transition-colors duration-200 hover:border-accent-border hover:bg-surface-hover hover:text-accent'
      aria-label={`Follow on ${platform}`}
    >
      {Icon}
    </a>
  );
}
