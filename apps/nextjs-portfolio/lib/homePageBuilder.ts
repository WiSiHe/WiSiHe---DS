import type {
  AboutQueryResult,
  HomeExtrasQueryResult,
  HomePageQueryResult,
} from '@wisihe/sanity-queries';
import { shuffleArray } from '@wisihe/utils';
import type { PortableTextBlock } from 'next-sanity';
import type { ReactNode } from 'react';
import type { ShowcaseItem } from '@/app/components/marketing/HeroSection/HeroSection';

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
  return (home?.sections ?? []) as HomePageSection[];
}

export function findHomeSection<T extends HomePageSection['_type']>(
  home: HomePageQueryResult | null,
  type: T,
): Extract<HomePageSection, { _type: T }> | undefined {
  return getHomeSections(home).find(
    (section): section is Extract<HomePageSection, { _type: T }> => section._type === type,
  );
}

export function buildHeroCollageItems(home: HomePageQueryResult | null): ShowcaseItem[] {
  const projectsSection = findHomeSection(home, 'homeProjectsSection');
  const paintingsSection = findHomeSection(home, 'homePaintingsSection');

  const projects = projectsSection?.showcaseProjects ?? [];
  const paintings = paintingsSection?.showcasePaintings ?? [];

  const shuffledPaintings = paintings.length ? shuffleArray([...paintings]) : [];
  const shuffledProjects = projects.length ? shuffleArray([...projects]) : [];

  const combined: ShowcaseItem[] = [];
  const maxLen = Math.max(shuffledPaintings.length, shuffledProjects.length);
  for (let i = 0; i < maxLen; i++) {
    const painting = shuffledPaintings[i];
    const project = shuffledProjects[i];
    if (painting) combined.push(painting);
    if (project) combined.push(project);
  }

  return combined;
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
