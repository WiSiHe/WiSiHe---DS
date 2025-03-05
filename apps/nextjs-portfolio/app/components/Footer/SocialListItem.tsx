'use client';
import { motion, AnimatePresence } from 'motion/react';
import { FaInstagram } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import { BiLogoRedbubble } from 'react-icons/bi';
import { FaArtstation, FaLinkedin } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';
import { useState } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);
  const { platform, url } = item;
  const Icon = iconPlatform[platform as keyof typeof iconPlatform];

  return (
    <motion.a
      //   layoutId={`link-${platform}`}
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center h-10 gap-4 px-4 py-3 text-2xl text-white transition-colors duration-500 rounded-md overflow-clip"
      aria-label={`Follow me on ${platform}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        backgroundColor: 'var(--color-primary)',
      }}
      whileTap={{
        backgroundColor: 'var(--color-primary)',
      }}
      transition={{
        type: 'spring',
        duration: 0.2,
      }}
    >
      <span className="shrink-0">{Icon}</span>
      <AnimatePresence>
        {isHovered && (
          <motion.span
            key={platform}
            initial={{ x: -40, opacity: 0, scale: 0 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{
              x: -40,
              opacity: 0,
              scale: 0,
            }}
            transition={{ type: 'spring' }}
            className="text-xl font-semibold"
          >
            {platform}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
};
