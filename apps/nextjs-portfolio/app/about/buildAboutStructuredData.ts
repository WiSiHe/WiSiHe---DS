import type { AboutQueryResult } from '@wisihe/sanity-queries';
import {
  getJourneyItemsWithCoordinates,
  normalizeJourneyItems,
} from './components/lifeJourneyTypes';

const DEFAULT_KNOWS_ABOUT = [
  'React',
  'Next.js',
  'TypeScript',
  'Design Systems',
  'Digital Painting',
  'Three.js',
  'Accessibility',
  'Creative Technology',
];

export function buildAboutStructuredData(about: AboutQueryResult | null) {
  const name = about?.heroSubtitle ?? 'Henrik Wilhelm Sissener';
  const knowsAboutRaw = (about as { knowsAbout?: string[] | null } | null)?.knowsAbout;
  const knowsAbout =
    Array.isArray(knowsAboutRaw) && knowsAboutRaw.length > 0
      ? knowsAboutRaw.filter((topic): topic is string => Boolean(topic))
      : DEFAULT_KNOWS_ABOUT;

  const mappedPlaces = getJourneyItemsWithCoordinates(normalizeJourneyItems(about?.journeyItems));
  const birthplace = mappedPlaces.find(p => p.locationType === 'birthplace');
  const home = mappedPlaces.find(p => p.locationType === 'lived' && p.placeName?.includes('Oslo'));
  const studied = mappedPlaces.filter(p => p.locationType === 'studied');

  const person = {
    '@id': 'https://www.wisihe.no/about#person',
    '@type': 'Person',
    name,
    alternateName: 'WiSiHe',
    jobTitle: about?.jobTitle ?? 'Frontend Developer & Digital Artist',
    description: about?.bio ?? '',
    url: 'https://www.wisihe.no',
    image: 'https://www.wisihe.no/wisihe.png',
    sameAs: (about?.socialLinks ?? []).map(l => l.url).filter((url): url is string => Boolean(url)),
    knowsAbout,
    nationality: { '@type': 'Country', name: 'Norway' },
    ...(birthplace?.placeName
      ? { birthPlace: { '@type': 'Place', name: birthplace.placeName } }
      : {}),
    ...(home?.placeName ? { homeLocation: { '@type': 'Place', name: home.placeName } } : {}),
    ...(studied.length
      ? {
          alumniOf: studied.map(s => ({
            '@type': 'CollegeOrUniversity',
            name: s.placeName ?? s.title,
          })),
        }
      : {}),
  };

  const profilePage = {
    '@type': 'ProfilePage',
    '@id': 'https://www.wisihe.no/about#profile',
    url: 'https://www.wisihe.no/about',
    name: about?.seoTitle ?? `About ${name}`,
    description: about?.seoDescription ?? about?.bio ?? '',
    mainEntity: { '@id': 'https://www.wisihe.no/about#person' },
    isPartOf: { '@id': 'https://www.wisihe.no/#website' },
  };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.wisihe.no',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: 'https://www.wisihe.no/about',
      },
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [profilePage, person, breadcrumb],
  };
}
