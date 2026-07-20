import type { AboutQueryResult, SettingsQueryResult } from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/live';
import { aboutQuery, settingsQuery } from '@/sanity/lib/queries';
import ContactPageClient from './ContactPageClient';

const SITE_URL = 'https://www.wisihe.no';
const CONTACT_DESCRIPTION =
  'Questions about work, licensing, or collaboration — reach Henrik Sissener by email or social media.';

export const metadata: Metadata = {
  title: 'Contact',
  description: CONTACT_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: 'Contact | WiSiHe',
    description: CONTACT_DESCRIPTION,
    type: 'website',
    url: `${SITE_URL}/contact`,
    siteName: 'WiSiHe',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Contact | WiSiHe',
    description: CONTACT_DESCRIPTION,
  },
};

export default async function ContactPage() {
  const [{ data: settingsData }, { data: aboutData }] = await Promise.all([
    sanityFetch({ query: settingsQuery }),
    sanityFetch({ query: aboutQuery }),
  ]);

  const settings = settingsData as SettingsQueryResult | null;
  const about = aboutData as AboutQueryResult | null;

  const socialLinks =
    settings?.socialLinks && settings.socialLinks.length > 0
      ? settings.socialLinks
      : (about?.socialLinks ?? []);

  return <ContactPageClient socialLinks={socialLinks} />;
}
