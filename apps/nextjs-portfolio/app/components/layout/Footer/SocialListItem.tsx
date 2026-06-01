'use client';
import { BiLogoRedbubble } from 'react-icons/bi';
import { BsTwitterX } from 'react-icons/bs';
import { FaArtstation, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

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

export const SocialListItem = ({ item }: { item: SocialLink }) => {
  const { platform, url } = item;
  const Icon = platform ? iconPlatform[platform as keyof typeof iconPlatform] : null;

  return (
    <a
      href={url ?? undefined}
      target='_blank'
      rel='noreferrer'
      className='flex items-center h-10 gap-4 px-4 py-3 text-2xl text-foreground transition-all duration-200 rounded-md bg-surface border border-border hover:bg-surface-hover hover:border-accent-border hover:scale-105 hover:shadow-sm'
      aria-label={`Follow me on ${platform}`}
    >
      <span className='shrink-0'>{Icon}</span>
      <span className='text-xl font-semibold font-oswald'>{platform}</span>
    </a>
  );
};
