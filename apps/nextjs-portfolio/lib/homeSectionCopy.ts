import type { AboutQueryResult } from '@wisihe/sanity-queries';
import type { HomeAboutTeaserSection, HomeContactCtaSection } from '@/lib/homePageBuilder';

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
  const bio =
    about?.bio?.trim() ||
    'Frontend developer and digital artist based in Oslo. I build fast, polished web experiences and create digital paintings — two disciplines that keep feeding each other.';

  return `${name} — ${jobTitle}. ${bio}`;
}

export type ContactCtaSectionData = HomeContactCtaSection;

export function buildContactCtaCopy(
  section: ContactCtaSectionData | null,
  about: AboutQueryResult | null,
) {
  return {
    eyebrow: section?.eyebrow?.trim() || '// Available for work',
    title: section?.title?.trim() || about?.ctaTitle?.trim() || "Let's build something together.",
    description:
      section?.description?.trim() ||
      'Open to freelance frontend work, design-engineering collaborations, and creative commissions.',
    primaryLabel: section?.primaryLabel?.trim() || about?.ctaButtonText?.trim() || 'Get in touch',
    primaryUrl: section?.primaryUrl?.trim() || about?.ctaButtonUrl?.trim() || '/contact',
    secondaryLabel: section?.secondaryLabel?.trim() || 'View projects',
    secondaryUrl: section?.secondaryUrl?.trim() || '/projects',
  };
}
