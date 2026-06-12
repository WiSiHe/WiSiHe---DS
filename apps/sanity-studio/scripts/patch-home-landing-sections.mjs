/**
 * Seed landing-page section copy on the home singleton.
 * Run: node scripts/patch-home-landing-sections.mjs
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

async function main() {
  await client
    .patch('home')
    .set({
      aboutTeaserEyebrow: '// About',
      aboutTeaserTitle: 'Code, canvas, and curiosity',
      aboutTeaserDescription:
        'Henrik Wilhelm Sissener — frontend developer and digital artist in Oslo. I build fast, polished web experiences and create digital paintings; the two disciplines keep feeding each other.',
      aboutTeaserPrimaryLabel: 'My story',
      aboutTeaserSecondaryLabel: 'Get in touch',
      aboutTeaserJourneyEyebrow: 'Life journey',
      aboutTeaserJourneyLinkLabel: 'View full journey',
      videosTeaser: {
        _type: 'homeSectionIntro',
        eyebrow: '// Motion',
        title: 'Process & playback',
        description:
          'Timelapses, animation tests, and game dev clips — a look behind the still frames.',
        linkLabel: 'All videos',
      },
      shopTeaser: {
        _type: 'homeSectionIntro',
        eyebrow: '// Shop',
        title: 'Available as prints',
        description:
          'Selected works available through print-on-demand — take a piece of the gallery home.',
        linkLabel: 'Browse gallery',
      },
      contactCtaEyebrow: '// Available for work',
      contactCtaDescription:
        'Open to freelance frontend work, design-engineering collaborations, and creative commissions.',
      contactCtaSecondaryLabel: 'View projects',
      contactCtaSecondaryUrl: '/projects',
    })
    .commit({ autoGenerateArrayKeys: true });

  console.log('Updated home landing section copy.');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
