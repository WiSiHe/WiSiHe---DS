import { SettingsQueryResult } from '@/sanity.types';
import { SocialListItem } from './SocialListItem';

type FooterProps = {
  socialLinks: NonNullable<SettingsQueryResult>['socialLinks'];
};

const Footer = ({ socialLinks }: FooterProps) => {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  return (
    <footer className="flex flex-wrap justify-between w-full gap-8 p-10 text-white bg-dark">
      <div className="flex flex-col w-full gap-8 md:flex-row md:justify-between">
        <nav className="md:w-1/3">
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold">Follow me</h3>
          </div>

          <ul className="flex flex-col justify-center">
            {socialLinks.map((link) => (
              <li key={link._key} className="group">
                <SocialListItem item={link} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:w-1/3">
          <h3 className="mb-4 text-2xl font-bold">About</h3>
          <p className="mb-4 text-gray-300">
            I&apos;m a passionate artist dedicated to creating unique and
            meaningful work. Feel free to explore my portfolio and reach out for
            collaborations.
          </p>
        </div>

        <div className="md:w-1/3">
          <h3 className="mb-4 text-2xl font-bold">Contact</h3>
          <p className="text-gray-300">Email: contact@example.com</p>
          <p className="text-gray-300">Location: New York, NY</p>
        </div>
      </div>

      <div className="w-full pt-6 mt-8 text-center text-gray-400 border-t border-gray-700">
        <p>© {new Date().getFullYear()} All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
