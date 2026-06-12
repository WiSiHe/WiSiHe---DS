import { getCliClient } from 'sanity/cli';

type JourneyItem = {
  _key: string;
  year: string;
  title: string;
  content: string;
  placeName: string;
  locationType: string;
  coordinates: { _type: 'geopoint'; lat: number; lng: number };
  mapZoom: number;
};

const JOURNEY_ITEMS: JourneyItem[] = [
  {
    _key: 'journey-arendal',
    year: 'Growing up',
    title: 'Roots on the southern coast',
    content:
      'I spent formative years around Arendal and the Agder coast — long summers by the sea, early curiosity for games, drawing, and how things are built. That mix of craft and technology still defines how I work today.',
    placeName: 'Arendal, Norway',
    locationType: 'birthplace',
    coordinates: { _type: 'geopoint', lat: 58.461, lng: 8.7725 },
    mapZoom: 11,
  },
  {
    _key: 'journey-bergen',
    year: '2012 – 2016',
    title: 'Studying in Bergen',
    content:
      'At the University of Bergen I studied information and communication technologies — learning to think in systems, ship software, and collaborate across design and engineering.',
    placeName: 'University of Bergen',
    locationType: 'studied',
    coordinates: { _type: 'geopoint', lat: 60.3913, lng: 5.3221 },
    mapZoom: 12,
  },
  {
    _key: 'journey-tromso',
    year: 'Year course',
    title: 'Arctic detour at UiT',
    content:
      'A year course in informatics at UiT — The Arctic University of Norway pushed me north to Tromsø. Harsh light, sharp focus, and a reminder that great work often happens off the beaten path.',
    placeName: 'Tromsø, Norway',
    locationType: 'studied',
    coordinates: { _type: 'geopoint', lat: 69.6492, lng: 18.9553 },
    mapZoom: 11,
  },
  {
    _key: 'journey-oslo-early',
    year: '2016 – 2019',
    title: 'Building in Oslo',
    content:
      'Oslo became my base for frontend development — consulting, product work, and side projects in games and creative tech. I learned to bridge design systems, performance, and storytelling on the web.',
    placeName: 'Oslo, Norway',
    locationType: 'lived',
    coordinates: { _type: 'geopoint', lat: 59.9139, lng: 10.7522 },
    mapZoom: 11,
  },
  {
    _key: 'journey-oslo-work',
    year: '2019 – today',
    title: 'Design engineering at scale',
    content:
      'From product teams to leading frontend at NoA Ignite, I architect accessible, high-performance experiences for brands across Norway — while still making time for paintings, 3D experiments, and game jams.',
    placeName: 'Oslo — NoA Ignite',
    locationType: 'worked',
    coordinates: { _type: 'geopoint', lat: 59.917, lng: 10.727 },
    mapZoom: 12,
  },
  {
    _key: 'journey-iceland',
    year: 'Adventure',
    title: 'Iceland under midnight sun',
    content:
      'Road trips through lava fields and black beaches — the kind of trip that resets your sense of scale. I collect these moments for color, mood, and the stories behind my landscape paintings.',
    placeName: 'South Iceland',
    locationType: 'trip',
    coordinates: { _type: 'geopoint', lat: 63.4194, lng: -19.0086 },
    mapZoom: 8,
  },
  {
    _key: 'journey-japan',
    year: 'Adventure',
    title: 'Neon, temples, and sketchbooks',
    content:
      'Japan fused hyper-modern cities with quiet craft — exactly the tension I love in interface design. I still reference those trips when thinking about rhythm, contrast, and detail in both code and art.',
    placeName: 'Tokyo, Japan',
    locationType: 'trip',
    coordinates: { _type: 'geopoint', lat: 35.6762, lng: 139.6503 },
    mapZoom: 10,
  },
];

const KNOWS_ABOUT = [
  'React',
  'Next.js',
  'TypeScript',
  'Design Systems',
  'Accessibility',
  'Digital Painting',
  'Three.js',
  'Creative Technology',
  'Unreal Engine',
  'Sanity CMS',
];

async function main() {
  const client = await getCliClient({ apiVersion: '2024-10-28' });

  await client
    .patch('about')
    .set({
      heroTitle: 'Story of WiSiHe',
      heroSubtitle: 'Henrik Wilhelm Sissener',
      jobTitle: 'Senior Frontend Developer & Digital Artist',
      bio: 'Design engineer, painter, and maker based in Oslo. I build fast, accessible web products by day and explore color, 3D, and game worlds by night.',
      seoTitle: 'About Henrik Sissener | WiSiHe — Developer & Artist',
      seoDescription:
        'Life map of Henrik Wilhelm Sissener (WiSiHe): frontend lead in Oslo, digital artist, and creative technologist. From Agder to Bergen, Tromsø, and adventures abroad.',
      knowsAbout: KNOWS_ABOUT,
      journeyItems: JOURNEY_ITEMS,
    })
    .commit();

  console.log('Patched about document with journey map content.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
