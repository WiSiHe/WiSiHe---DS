import { SettingsQueryResult } from '@/sanity.types';
import { BiLogoRedbubble } from 'react-icons/bi';
import { BsTwitterX } from 'react-icons/bs';
import {
  FaArtstation,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from 'react-icons/fa';

type FooterProps = {
  socialLinks: NonNullable<SettingsQueryResult>['socialLinks'];
};

const Footer = ({ socialLinks }: FooterProps) => {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }
  const iconPlatform = {
    Instagram: <FaInstagram />,
    X: <BsTwitterX />,
    Facebook: <FaFacebook />,
    Linkedin: <FaLinkedin />,
    Redbubble: <BiLogoRedbubble />,
    Artstation: <FaArtstation />,
  };
  return (
    <footer className="flex flex-wrap items-center justify-center w-full gap-4 p-10 text-white bg-dark">
      <nav>
        <ul className="flex items-center gap-4">
          {socialLinks.map((link) => {
            const { platform } = link;
            const Icon = iconPlatform[platform as keyof typeof iconPlatform];
            return (
              <li key={link._key}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-1 text-2xl text-white transition-colors duration-500 rounded-md bg-dark/60 hover:bg-primary"
                  aria-label={`Follow me on ${platform}`}
                >
                  {Icon}
                </a>
              </li>
            );
          })}
        </ul>
        {/* <Link href="/contact">Contact</Link> */}
      </nav>
    </footer>
  );
};

export default Footer;
