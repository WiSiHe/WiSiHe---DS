import type { AboutQueryResult, HomePageQueryResult } from '@wisihe/sanity-queries';

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

export function buildAboutTeaserDescription(
  home: HomePageQueryResult | null,
  about: AboutQueryResult | null,
): string {
  const custom = home?.aboutTeaserDescription?.trim();
  if (custom) return custom;

  const name = about?.heroSubtitle?.trim() || 'Henrik Wilhelm Sissener';
  const jobTitle = (about?.jobTitle?.trim() || 'Frontend developer & digital artist').toLowerCase();
  const bio =
    about?.bio?.trim() ||
    'Frontend developer and digital artist based in Oslo. I build fast, polished web experiences and create digital paintings — two disciplines that keep feeding each other.';

  return `${name} — ${jobTitle}. ${bio}`;
}

export function buildContactCtaCopy(
  home: HomePageQueryResult | null,
  about: AboutQueryResult | null,
) {
  return {
    eyebrow: home?.contactCtaEyebrow?.trim() || '// Available for work',
    title:
      home?.contactCtaTitle?.trim() || about?.ctaTitle?.trim() || "Let's build something together.",
    description:
      home?.contactCtaDescription?.trim() ||
      'Open to freelance frontend work, design-engineering collaborations, and creative commissions.',
    primaryLabel:
      home?.contactCtaPrimaryLabel?.trim() || about?.ctaButtonText?.trim() || 'Get in touch',
    primaryUrl: home?.contactCtaPrimaryUrl?.trim() || about?.ctaButtonUrl?.trim() || '/contact',
    secondaryLabel: home?.contactCtaSecondaryLabel?.trim() || 'View projects',
    secondaryUrl: home?.contactCtaSecondaryUrl?.trim() || '/projects',
  };
}
