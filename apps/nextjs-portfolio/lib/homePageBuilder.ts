import type {
  AboutQueryResult,
  HomeExtrasQueryResult,
  HomePageQueryResult,
} from '@wisihe/sanity-queries';
import type { PortableTextBlock } from 'next-sanity';
import type { ReactNode } from 'react';
import type { ShowcaseItem } from '@/app/components/marketing/HeroSection/HeroSection';
import { urlForImage } from '@/sanity/lib/utils';

export type HomePageSection = NonNullable<NonNullable<HomePageQueryResult>['sections']>[number];

export type HomeHeroSection = Extract<HomePageSection, { _type: 'homeHeroSection' }>;
export type HomeProjectsSection = Extract<HomePageSection, { _type: 'homeProjectsSection' }>;
export type HomePaintingsSection = Extract<HomePageSection, { _type: 'homePaintingsSection' }>;
export type HomeAboutTeaserSection = Extract<HomePageSection, { _type: 'homeAboutTeaserSection' }>;
export type HomeVideosTeaserSection = Extract<
  HomePageSection,
  { _type: 'homeVideosTeaserSection' }
>;
export type HomeShopTeaserSection = Extract<HomePageSection, { _type: 'homeShopTeaserSection' }>;
export type HomeSkillsSection = Extract<HomePageSection, { _type: 'homeSkillsSection' }>;
export type HomeContactCtaSection = Extract<HomePageSection, { _type: 'homeContactCtaSection' }>;

export function getHomeSections(home: HomePageQueryResult | null): HomePageSection[] {
  return (home?.sections ?? []).filter(
    section => (section._type as string) !== 'homeContactCtaSection',
  ) as HomePageSection[];
}

export function findHomeSection<T extends HomePageSection['_type']>(
  home: HomePageQueryResult | null,
  type: T,
): Extract<HomePageSection, { _type: T }> | undefined {
  return getHomeSections(home).find(
    (section): section is Extract<HomePageSection, { _type: T }> => section._type === type,
  );
}

const HERO_COLLAGE_MAX_ITEMS = 14;

function isShowcasePainting(item: ShowcaseItem): item is ShowcaseItem & { _type: 'painting' } {
  return item._type === 'painting';
}

/** Interleave curated projects and paintings in CMS order (no shuffle). */
export function buildHeroCollageItems(home: HomePageQueryResult | null): ShowcaseItem[] {
  const projectsSection = findHomeSection(home, 'homeProjectsSection');
  const paintingsSection = findHomeSection(home, 'homePaintingsSection');

  const projects = (projectsSection?.showcaseProjects ?? []).filter(
    project => project.image?.asset?._ref,
  );
  const paintings = (paintingsSection?.showcasePaintings ?? []).filter(
    painting => painting.image?.asset?._ref && painting.isNSFW !== true,
  );

  const combined: ShowcaseItem[] = [];
  const maxLen = Math.max(projects.length, paintings.length);

  for (let i = 0; i < maxLen; i++) {
    const project = projects[i];
    const painting = paintings[i];
    if (project) combined.push(project);
    if (painting && isShowcasePainting(painting)) combined.push(painting);
  }

  return combined.slice(0, HERO_COLLAGE_MAX_ITEMS);
}

const HERO_LCP_FALLBACK_ASPECT = 4 / 3;

/** URL for the homepage hero LCP image (first collage item). */
export function getHeroLcpImageUrl(home: HomePageQueryResult | null): string | null {
  const items = buildHeroCollageItems(home);
  const first = items.find(item => item.image?.asset?._ref);
  if (!first?.image) return null;

  const aspectRatio = first.image.aspectRatio ?? HERO_LCP_FALLBACK_ASPECT;
  return (
    urlForImage(first.image)
      ?.width(800)
      .height(Math.round(800 / aspectRatio))
      .fit('crop')
      .auto('format')
      .quality(85)
      .url() ?? null
  );
}

export function getHeroOverview(home: HomePageQueryResult | null): PortableTextBlock[] | null {
  const hero = findHomeSection(home, 'homeHeroSection');
  if (hero?.overview) {
    return hero.overview as PortableTextBlock[];
  }
  return (home?.overview as PortableTextBlock[] | null) ?? null;
}

export type HomePageSectionsContext = {
  home: HomePageQueryResult;
  about: AboutQueryResult | null;
  extras: HomeExtrasQueryResult | null;
  heroEyebrow?: string | null;
  heroName?: string | null;
};

export type HomeSectionRenderer = (
  section: HomePageSection,
  context: HomePageSectionsContext,
) => ReactNode | null;
