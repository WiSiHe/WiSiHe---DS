import type { AboutQueryResult } from '@wisihe/sanity-queries';
import type { HomeAboutTeaserSection } from '@/lib/homePageBuilder';
import { SITE_BIO } from '@/lib/siteCopy';

export type HomeSectionIntroCopy = {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  linkLabel?: string | null;
};

type SectionIntroStrings = {
  eyebrow: string;
  title: string;
  description: string;
  linkLabel: string;
};

export function pickSectionIntro(
  intro: HomeSectionIntroCopy | null | undefined,
  defaults: SectionIntroStrings,
): SectionIntroStrings {
  return {
    eyebrow: intro?.eyebrow?.trim() || defaults.eyebrow,
    title: intro?.title?.trim() || defaults.title,
    description: intro?.description?.trim() || defaults.description,
    linkLabel: intro?.linkLabel?.trim() || defaults.linkLabel,
  };
}

export type AboutTeaserSectionData = HomeAboutTeaserSection;

export function buildAboutTeaserCopy(
  section: AboutTeaserSectionData | null,
  about: AboutQueryResult | null,
) {
  const custom = section?.description?.trim();
  if (custom) return custom;

  const name = about?.heroSubtitle?.trim() || 'Henrik Wilhelm Sissener';
  const jobTitle = (about?.jobTitle?.trim() || 'Frontend developer & digital artist').toLowerCase();
  const bio = about?.bio?.trim() || SITE_BIO;

  return `${name} — ${jobTitle}. ${bio}`;
}

export type ContactCtaSectionData = any;

export function buildContactCtaCopy(
  section: ContactCtaSectionData | null,
  about: AboutQueryResult | null,
) {
  return {
    eyebrow: section?.eyebrow?.trim() || '// Contact',
    title: section?.title?.trim() || about?.ctaTitle?.trim() || 'Say hello',
    description:
      section?.description?.trim() ||
      about?.ctaDescription?.trim() ||
      'Questions about the work, licensing, or anything else — I read every message.',
    primaryLabel: section?.primaryLabel?.trim() || about?.ctaButtonText?.trim() || 'Send a message',
    primaryUrl: section?.primaryUrl?.trim() || about?.ctaButtonUrl?.trim() || '/contact',
    secondaryLabel: section?.secondaryLabel?.trim() || 'View projects',
    secondaryUrl: section?.secondaryUrl?.trim() || '/projects',
  };
}
