'use client';
import { FaInstagram } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import { BiLogoRedbubble } from 'react-icons/bi';
import { FaArtstation, FaLinkedin } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';

const iconPlatform = {
  Instagram: <FaInstagram />,
  X: <BsTwitterX />,
  Facebook: <FaFacebook />,
  Linkedin: <FaLinkedin />,
  Redbubble: <BiLogoRedbubble />,
  Artstation: <FaArtstation />,
};

interface SocialLink {
  platform: string;
  _key: string;
  url: string;
}

export const SocialListItem = ({ item }: { item: SocialLink }) => {
  const { platform, url } = item;
  const Icon = iconPlatform[platform as keyof typeof iconPlatform];

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center h-10 gap-4 px-4 py-3 text-2xl text-text-primary transition-all duration-300 rounded-md bg-surface-elevated hover:bg-accent-light hover:text-on-primary hover:scale-105"
      aria-label={`Follow me on ${platform}`}
    >
      <span className="shrink-0">{Icon}</span>
      <span className="text-xl font-semibold">{platform}</span>
    </a>
  );
};
