/**
 * Migrate flat home fields into the page builder `sections` array.
 * Run: node scripts/patch-home-page-builder.mjs
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

const LEGACY_HOME_QUERY = `*[_id == "home"][0]{
  sections,
  overview,
  projectsDescription,
  projectsListingDescription,
  showcaseProjects,
  paintingsDescription,
  showcasePaintings,
  aboutTeaserEyebrow,
  aboutTeaserTitle,
  aboutTeaserDescription,
  aboutTeaserPrimaryLabel,
  aboutTeaserSecondaryLabel,
  aboutTeaserJourneyEyebrow,
  aboutTeaserJourneyLinkLabel,
  videosTeaser,
  shopTeaser,
  contactCtaEyebrow,
  contactCtaTitle,
  contactCtaDescription,
  contactCtaPrimaryLabel,
  contactCtaPrimaryUrl,
  contactCtaSecondaryLabel,
  contactCtaSecondaryUrl
}`;

function buildSections(doc) {
  if (Array.isArray(doc.sections) && doc.sections.length > 0) {
    return doc.sections;
  }

  return [
    {
      _type: 'homeHeroSection',
      overview: doc.overview,
    },
    {
      _type: 'homeProjectsSection',
      description: doc.projectsDescription,
      showcaseProjects: doc.showcaseProjects,
    },
    {
      _type: 'homePaintingsSection',
      description: doc.paintingsDescription,
      showcasePaintings: doc.showcasePaintings,
    },
    {
      _type: 'homeAboutTeaserSection',
      eyebrow: doc.aboutTeaserEyebrow,
      title: doc.aboutTeaserTitle,
      description: doc.aboutTeaserDescription,
      primaryLabel: doc.aboutTeaserPrimaryLabel,
      secondaryLabel: doc.aboutTeaserSecondaryLabel,
      journeyEyebrow: doc.aboutTeaserJourneyEyebrow,
      journeyLinkLabel: doc.aboutTeaserJourneyLinkLabel,
    },
    {
      _type: 'homeVideosTeaserSection',
      intro: doc.videosTeaser,
    },
    {
      _type: 'homeShopTeaserSection',
      intro: doc.shopTeaser,
    },
    {
      _type: 'homeSkillsSection',
      eyebrow: '// Skills',
      title: 'What I work with',
    },
    {
      _type: 'homeContactCtaSection',
      eyebrow: doc.contactCtaEyebrow,
      title: doc.contactCtaTitle,
      description: doc.contactCtaDescription,
      primaryLabel: doc.contactCtaPrimaryLabel,
      primaryUrl: doc.contactCtaPrimaryUrl,
      secondaryLabel: doc.contactCtaSecondaryLabel,
      secondaryUrl: doc.contactCtaSecondaryUrl,
    },
  ].filter(Boolean);
}

async function main() {
  const doc = await client.fetch(LEGACY_HOME_QUERY);

  if (!doc) {
    throw new Error('Home document not found');
  }

  const sections = buildSections(doc);

  const archiveCopy = {
    paintingsDescription:
      doc.paintingsDescription ??
      sections.find(section => section._type === 'homePaintingsSection')?.description,
    projectsListingDescription:
      doc.projectsListingDescription ??
      doc.projectsDescription ??
      sections.find(section => section._type === 'homeProjectsSection')?.description,
  };

  await client
    .patch('home')
    .set({ sections, ...archiveCopy })
    .unset([
      'overview',
      'projectsDescription',
      'showcaseProjects',
      'showcasePaintings',
      'aboutTeaserEyebrow',
      'aboutTeaserTitle',
      'aboutTeaserDescription',
      'aboutTeaserPrimaryLabel',
      'aboutTeaserSecondaryLabel',
      'aboutTeaserJourneyEyebrow',
      'aboutTeaserJourneyLinkLabel',
      'videosTeaser',
      'shopTeaser',
      'contactCtaEyebrow',
      'contactCtaTitle',
      'contactCtaDescription',
      'contactCtaPrimaryLabel',
      'contactCtaPrimaryUrl',
      'contactCtaSecondaryLabel',
      'contactCtaSecondaryUrl',
    ])
    .commit({ autoGenerateArrayKeys: true });

  console.log(`Migrated home document to page builder with ${sections.length} sections.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
