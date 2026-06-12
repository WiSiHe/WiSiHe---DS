import { getCliClient } from 'sanity/cli';

type GeoPoint = { _type: 'geopoint'; lat: number; lng: number };

type JourneyItem = {
  _key: string;
  year: string;
  title: string;
  content: string;
  placeName: string;
  locationType: string;
  coordinates: GeoPoint;
  mapZoom: number;
};

type VisitedCountry = {
  _key: string;
  country: string;
  placeName?: string;
  coordinates: GeoPoint;
  notes?: string;
};

const JOURNEY_ITEMS: JourneyItem[] = [
  {
    _key: 'journey-hammerfest',
    year: 'Youth',
    title: 'Born in the Arctic',
    content:
      'Born in Hammerfest — one of the northernmost towns in the world. I do not remember much from those earliest years, but it is where the map starts.',
    placeName: 'Hammerfest, Norway',
    locationType: 'birthplace',
    coordinates: { _type: 'geopoint', lat: 70.6634, lng: 23.6821 },
    mapZoom: 11,
  },
  {
    _key: 'journey-haslemoen',
    year: 'Youth',
    title: 'Haslemoen',
    content:
      'Kindergarten years at Haslemoen — swimming in the local river and living through a huge flood that still feels larger than life when I think back.',
    placeName: 'Haslemoen, Norway',
    locationType: 'lived',
    coordinates: { _type: 'geopoint', lat: 60.7167, lng: 11.8333 },
    mapZoom: 11,
  },
  {
    _key: 'journey-setermoen',
    year: 'Youth',
    title: 'Setermoen',
    content:
      'First grade in Setermoen. Skiing, fishing, long hikes, and drawing filled the days. Then my first video game — a 2D shooter — and my mind was blown.',
    placeName: 'Setermoen, Norway',
    locationType: 'lived',
    coordinates: { _type: 'geopoint', lat: 68.411, lng: 17.059 },
    mapZoom: 11,
  },
  {
    _key: 'journey-baerum',
    year: 'Youth',
    title: 'Bærum',
    content:
      'From first through third grade in Bærum: football, more skiing, and drawing. Our first family computer arrived — Flåklypa and Age of Empires — and I won a drawing contest that earned me a snowboard.',
    placeName: 'Bærum, Norway',
    locationType: 'lived',
    coordinates: { _type: 'geopoint', lat: 59.89, lng: 10.5267 },
    mapZoom: 11,
  },
  {
    _key: 'journey-arendal',
    year: 'Youth',
    title: 'Arendal & Agder',
    content:
      'Arendal was home until I turned 19 — coast, sea, swimming, and family. Later I worked at Doorway and Joker while the southern shore still felt like the centre of the world.',
    placeName: 'Arendal, Norway',
    locationType: 'lived',
    coordinates: { _type: 'geopoint', lat: 58.461, lng: 8.7725 },
    mapZoom: 11,
  },
  {
    _key: 'journey-tromso',
    year: 'Studies',
    title: 'Tromsø & UiT',
    content:
      'My first year living on my own. Beautiful nature and good people, though the dark winters were a bit long for my taste. The student culture, though — loved it.',
    placeName: 'Tromsø, Norway',
    locationType: 'studied',
    coordinates: { _type: 'geopoint', lat: 69.6492, lng: 18.9553 },
    mapZoom: 11,
  },
  {
    _key: 'journey-bergen',
    year: 'University',
    title: 'Bergen',
    content:
      'I love Bergen — endless hikes, mountains to traverse, and friends who became part of the story. The rain never bothered me; it is part of the charm. Work at Eplehuset and Seaway Systems, plus Hove Festivalen along the way.',
    placeName: 'Bergen, Norway',
    locationType: 'studied',
    coordinates: { _type: 'geopoint', lat: 60.3913, lng: 5.3221 },
    mapZoom: 12,
  },
  {
    _key: 'journey-oslo',
    year: 'Since 2016',
    title: 'Oslo',
    content:
      "I was sceptical at first, but Oslo grew on me and I have come to love it here. I started a master's degree but never finished — instead I have built a career at Evry, Godtlevert, and now NoA Ignite.",
    placeName: 'Oslo, Norway',
    locationType: 'lived',
    coordinates: { _type: 'geopoint', lat: 59.9139, lng: 10.7522 },
    mapZoom: 11,
  },
];

const VISITED_COUNTRIES: VisitedCountry[] = [
  {
    _key: 'visit-ukraine',
    country: 'Ukraine',
    placeName: 'Kyiv',
    coordinates: { _type: 'geopoint', lat: 50.4501, lng: 30.5234 },
  },
  {
    _key: 'visit-denmark',
    country: 'Denmark',
    placeName: 'Copenhagen',
    coordinates: { _type: 'geopoint', lat: 55.6761, lng: 12.5683 },
  },
  {
    _key: 'visit-sweden',
    country: 'Sweden',
    placeName: 'Stockholm',
    coordinates: { _type: 'geopoint', lat: 59.3293, lng: 18.0686 },
  },
  {
    _key: 'visit-monaco',
    country: 'Monaco',
    placeName: 'Monaco',
    coordinates: { _type: 'geopoint', lat: 43.7384, lng: 7.4246 },
  },
  {
    _key: 'visit-france',
    country: 'France',
    placeName: 'Paris',
    coordinates: { _type: 'geopoint', lat: 48.8566, lng: 2.3522 },
  },
  {
    _key: 'visit-spain',
    country: 'Spain',
    placeName: 'Madrid',
    coordinates: { _type: 'geopoint', lat: 40.4168, lng: -3.7038 },
  },
  {
    _key: 'visit-poland',
    country: 'Poland',
    placeName: 'Warsaw',
    coordinates: { _type: 'geopoint', lat: 52.2297, lng: 21.0122 },
  },
  {
    _key: 'visit-germany',
    country: 'Germany',
    placeName: 'Berlin',
    coordinates: { _type: 'geopoint', lat: 52.52, lng: 13.405 },
  },
  {
    _key: 'visit-uk',
    country: 'United Kingdom',
    placeName: 'London',
    coordinates: { _type: 'geopoint', lat: 51.5074, lng: -0.1278 },
  },
  {
    _key: 'visit-belgium',
    country: 'Belgium',
    placeName: 'Brussels',
    coordinates: { _type: 'geopoint', lat: 50.8503, lng: 4.3517 },
  },
  {
    _key: 'visit-netherlands',
    country: 'Netherlands',
    placeName: 'Amsterdam',
    coordinates: { _type: 'geopoint', lat: 52.3676, lng: 4.9041 },
  },
  {
    _key: 'visit-czechia',
    country: 'Czech Republic',
    placeName: 'Prague',
    coordinates: { _type: 'geopoint', lat: 50.0755, lng: 14.4378 },
  },
  {
    _key: 'visit-italy',
    country: 'Italy',
    placeName: 'Rome',
    coordinates: { _type: 'geopoint', lat: 41.9028, lng: 12.4964 },
  },
  {
    _key: 'visit-hungary',
    country: 'Hungary',
    placeName: 'Budapest',
    coordinates: { _type: 'geopoint', lat: 47.4979, lng: 19.0402 },
  },
  {
    _key: 'visit-turkey',
    country: 'Turkey',
    placeName: 'Istanbul',
    coordinates: { _type: 'geopoint', lat: 41.0082, lng: 28.9784 },
  },
  {
    _key: 'visit-greece',
    country: 'Greece',
    placeName: 'Athens',
    coordinates: { _type: 'geopoint', lat: 37.9838, lng: 23.7275 },
  },
  {
    _key: 'visit-luxembourg',
    country: 'Luxembourg',
    placeName: 'Luxembourg City',
    coordinates: { _type: 'geopoint', lat: 49.6116, lng: 6.1319 },
  },
  {
    _key: 'visit-portugal',
    country: 'Portugal',
    placeName: 'Lisbon',
    coordinates: { _type: 'geopoint', lat: 38.7223, lng: -9.1393 },
  },
  {
    _key: 'visit-usa',
    country: 'United States',
    placeName: 'New York',
    coordinates: { _type: 'geopoint', lat: 40.7128, lng: -74.006 },
  },
  {
    _key: 'visit-canada',
    country: 'Canada',
    placeName: 'Toronto',
    coordinates: { _type: 'geopoint', lat: 43.6532, lng: -79.3832 },
  },
  {
    _key: 'visit-norway',
    country: 'Norway',
    placeName: 'Oslo',
    coordinates: { _type: 'geopoint', lat: 59.9139, lng: 10.7522 },
  },
];

const KNOWS_ABOUT = [
  'React',
  'Next.js',
  'TypeScript',
  'Design Systems',
  'Accessibility',
  'Digital Painting',
  'Photography',
  'Three.js',
  'Creative Technology',
  'Sanity CMS',
];

async function main() {
  const client = await getCliClient({ apiVersion: '2024-10-28' });

  await client
    .patch('about')
    .set({
      heroTitle: 'Biography',
      heroSubtitle: 'Henrik Wilhelm Sissener',
      jobTitle: 'Senior Frontend Developer & Digital Artist',
      bio: 'Design engineer, painter, and maker based in Oslo. Born in Hammerfest, raised across Norway — from military towns and the coast to Tromsø, Bergen, and the capital. I build accessible web products and make art on the side.',
      seoTitle: 'About Henrik Sissener | WiSiHe — Developer & Artist',
      seoDescription:
        'Life map of Henrik Wilhelm Sissener (WiSiHe): from Hammerfest and Arendal to Tromsø, Bergen, and Oslo — plus travels across Europe and beyond.',
      knowsAbout: KNOWS_ABOUT,
      journeyItems: JOURNEY_ITEMS,
      visitedCountries: VISITED_COUNTRIES,
    })
    .commit();

  console.log(
    `Patched about document: ${JOURNEY_ITEMS.length} journey stops, ${VISITED_COUNTRIES.length} countries visited.`,
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
