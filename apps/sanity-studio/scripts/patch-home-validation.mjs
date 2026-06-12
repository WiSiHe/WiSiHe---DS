/**
 * Fix home singleton validation issues (minimal PT blocks + archive copy length).
 * Run: node scripts/patch-home-validation.mjs
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.join(__dirname, '..');
const require = createRequire(path.join(studioRoot, 'package.json'));
const { createClient } = require('@sanity/client');
const { config } = require('dotenv');

config({ path: path.join(studioRoot, '.env.local') });

const PROJECT_ID = process.env.SANITY_STUDIO_API_PROJECT_ID || 'cbjsv7wi';
const DATASET = process.env.SANITY_STUDIO_API_DATASET || 'production';
const WRITE_TOKEN =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_STUDIO_API_TOKEN;

if (!WRITE_TOKEN) {
  throw new Error('Missing SANITY_API_WRITE_TOKEN (or SANITY_API_READ_TOKEN with write access)');
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: WRITE_TOKEN,
  useCdn: false,
});

const COPY = {
  paintingsArchive:
    'Explore digital paintings — stylised portraits, landscapes, and cosmic scenes. Selected works available as prints.',
  paintingsSection:
    'Stylised portraits, ethereal landscapes, and cosmic scenes — browse featured work from the gallery.',
  projectsArchive:
    'A mix of professional work, side projects, and experiments — from design systems to games I learned a lot building.',
  projectsSection:
    'A curated gallery of engineering and design projects built with modern web technologies.',
  heroOverview:
    "I'm a design engineer, painter and maker. Explore paintings, projects, and experiments from my portfolio.",
};

function minimalBlock(text) {
  return [
    {
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', marks: [], text }],
    },
  ];
}

function normalizeSections(sections) {
  if (!Array.isArray(sections)) return sections;

  return sections.map(section => {
    switch (section._type) {
      case 'homeHeroSection':
        return { ...section, overview: minimalBlock(COPY.heroOverview) };
      case 'homeProjectsSection':
        return { ...section, description: minimalBlock(COPY.projectsSection) };
      case 'homePaintingsSection':
        return { ...section, description: minimalBlock(COPY.paintingsSection) };
      default:
        return section;
    }
  });
}

async function main() {
  const doc = await client.fetch('*[_id == "home"][0]{ sections }');
  if (!doc) throw new Error('Home document not found');

  await client
    .patch('home')
    .set({
      title: 'WiSiHe — Digital Portfolio',
      projectsTitle: doc.projectsTitle ?? 'Projects',
      paintingsTitle: doc.paintingsTitle ?? 'Paintings',
      projectsListingDescription: minimalBlock(COPY.projectsArchive),
      paintingsDescription: minimalBlock(COPY.paintingsArchive),
      sections: normalizeSections(doc.sections),
    })
    .commit({ autoGenerateArrayKeys: true });

  console.log('Fixed home validation: archive copy + page builder minimal text blocks.');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
