/**
 * Restore archive meta copy on home after page-builder migration.
 * Copies section intros to archive fields when archive fields are empty.
 * Run: node scripts/patch-home-archive-copy.mjs
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

const DEFAULT_PAINTINGS_ARCHIVE =
  'Explore my collection of digital paintings and artwork, featuring imaginative landscapes, character designs, and creative visual storytelling.';

const DEFAULT_PROJECTS_ARCHIVE =
  'A mix of professional work, side projects, and experiments — from design systems to games I learned a lot building.';

function blockText(blocks) {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .filter(block => block?._type === 'block')
    .flatMap(block => (block.children ?? []).map(child => child.text ?? ''))
    .join(' ')
    .trim();
}

/** Strip headings/embeds so copy fits blockContentMinimal. */
function toMinimalBlocks(blocks, fallbackText) {
  const text = blockText(blocks) || fallbackText;
  if (!text) return undefined;

  return [
    {
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          marks: [],
          text,
        },
      ],
    },
  ];
}

async function main() {
  const doc = await client.fetch(`*[_id == "home"][0]{
    paintingsDescription,
    projectsListingDescription,
    "paintingsSection": sections[_type == "homePaintingsSection"][0].description,
    "projectsSection": sections[_type == "homeProjectsSection"][0].description
  }`);

  if (!doc) throw new Error('Home document not found');

  const patch = {};

  if (!doc.paintingsDescription?.length) {
    patch.paintingsDescription = toMinimalBlocks(
      doc.paintingsSection,
      DEFAULT_PAINTINGS_ARCHIVE,
    );
  }

  if (!doc.projectsListingDescription?.length) {
    patch.projectsListingDescription = toMinimalBlocks(
      doc.projectsSection,
      DEFAULT_PROJECTS_ARCHIVE,
    );
  }

  if (Object.keys(patch).length === 0) {
    console.log('Archive copy already set — nothing to patch.');
    return;
  }

  await client.patch('home').set(patch).commit({ autoGenerateArrayKeys: true });

  console.log('Restored archive copy:', Object.keys(patch).join(', '));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
