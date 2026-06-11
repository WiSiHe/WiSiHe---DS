import { getCliClient } from 'sanity/cli';

type Block = {
  _key: string;
  _type: 'block';
  style: 'normal';
  markDefs: [];
  children: Array<{
    _key: string;
    _type: 'span';
    marks: [];
    text: string;
  }>;
};

function block(key: string, text: string): Block {
  return {
    _key: key,
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{ _key: `${key}-span`, _type: 'span', marks: [], text }],
  };
}

/** Per-project SEO and metadata overrides keyed by document _id */
const PROJECT_PATCHES: Record<
  string,
  {
    seoTitle?: string;
    seoDescription?: string;
    status?: string;
    projectEnd?: string;
    connectedPage?: string;
    slug?: string;
    extraContent?: string;
  }
> = {
  '037afd2c-3c85-4d30-b964-7444eb903a2c': {
    slug: 'bad-ui-battle-hackathon',
    seoTitle: 'BAD UI BATTLE | Hackathon',
    seoDescription:
      'BAD UI BATTLE: a one-day hackathon building hilariously terrible UIs with mystery-meat navigation, hostile patterns, and blinding colors.',
  },
  '212bb547-d945-45d5-a06c-8527c7b8c8c4': {
    slug: 'slik-bygger-vi-apper-for-alle-panel-debate',
    seoTitle: 'Slik bygger vi apper for alle | Panel Debate',
    seoDescription:
      'Panel debate on building accessible apps—why accessibility should be integral to product design, not a compliance checkbox.',
  },
  '22377a03-a8e9-4bb5-a44c-13a9da0a1427': {
    seoTitle: 'Nixis Website',
    seoDescription:
      'Custom WordPress site for Nixis with dark atmospheric design, Spotify embeds, and Mailchimp signup—built in one month.',
  },
  '90afc030-1c40-47b9-aaec-4066ffbd8a2a': {
    seoTitle: 'Moldbakken Website & Logo',
    seoDescription:
      'Logo and Squarespace store for Moldbakken, selling eco-friendly mushroom kits grown from recycled coffee grounds.',
  },
  'cb42f323-4d88-402e-91da-f729403ec045': {
    seoTitle: 'Hastings | First House',
    seoDescription:
      'Media tracking dashboard for Hastings First House built with React, Vite, TypeScript, and Redux for real-time insights.',
  },
  'f7b13fe2-566b-483e-855b-766521bbb64e': {
    seoTitle: 'BAD UI BATTLE 2.0 | Hackathon',
    seoDescription:
      'BAD UI BATTLE 2.0 hackathon: awful interfaces, misaligned buttons, clashing colors, and hostile design patterns—on purpose.',
  },
  '0fe76d1c-539b-48b9-bd5a-f831ad6beb97': {
    seoTitle: 'WiSiHe Portfolio Website',
    seoDescription:
      'The WiSiHe portfolio—a Next.js monorepo with Sanity CMS, design tokens, paintings, projects, and performance-focused UX.',
    projectEnd: '2026-06-01',
    connectedPage: 'https://www.wisihe.no',
  },
  'fff206cc-e2e4-40f7-aa51-e6843aebe29d': {
    seoTitle: 'Unge Drabanter',
    seoDescription:
      'Unge Drabanter whiskey tasting club platform with tasting notes, events, and member profiles—Next.js, Sanity, and NextAuth.',
  },
  '37b22ba7-f453-4ab2-a04f-d4241f178509': {
    seoTitle: 'Project Huldra',
    seoDescription:
      'Unreal Engine 5 forest horror prototype: outsmart the Huldra, solve puzzles, and escape the mystical woods.',
    status: 'onHold',
    projectEnd: '2024-06-01',
  },
  '03f8855c-bbfc-4933-a862-c49c0f8a47e4': {
    seoDescription:
      'Project Babel: an Unreal Engine 4 game about restoring life to a frozen wasteland using ancient plans.',
  },
  '030150dd-650c-48ae-9d85-a7d1e9401f9d': {
    seoTitle: 'Anton Sport Online Retail',
    connectedPage: 'https://www.antonsport.no',
    extraContent:
      'The storefront supports real product catalogues, filtering, and checkout flows on a Turborepo monorepo—built for maintainability beyond the initial delivery.',
  },
  '7c2e6663-3d89-4463-b807-45402c101fb7': {
    seoTitle: 'Bane NOR | Design System Lead',
    extraContent:
      'The design system is in active use across Bane NOR product teams—shared tokens, documented React components, and a sustainable contribution model.',
  },
  '7ea4c1a3-1780-4a29-b3d5-bc1229725aef': {
    seoTitle: 'TINE Designsystem - KREM',
    extraContent:
      'KREM cut redundant UI work across TINE teams and established a consistent, token-driven foundation for future digital products.',
  },
  'ab9134d7-c675-4445-b4ce-8af4d5e76c58': {
    seoTitle: 'TINE Kjøkken | Recipes',
    connectedPage: 'https://www.tine.no/kjokken/',
  },
};

const SLUG_REDIRECTS = [
  {
    id: 'redirect.project.bad-ui-battle',
    source: '/projects/bad-ui-battle-or-hackathon',
    destination: '/projects/bad-ui-battle-hackathon',
  },
  {
    id: 'redirect.project.slik-bygger-panel',
    source: '/projects/slik-bygger-vi-apper-for-alle-or-panel-debate',
    destination: '/projects/slik-bygger-vi-apper-for-alle-panel-debate',
  },
];

const SHOWCASE_PROJECT_IDS = [
  '7c2e6663-3d89-4463-b807-45402c101fb7', // Bane NOR | Design System Lead
  '037cce21-55e4-44be-beb1-17991a33f877', // 3D Black Hole
  '030150dd-650c-48ae-9d85-a7d1e9401f9d', // Anton Sport Online Retail
];

async function main() {
  const client = await getCliClient({ apiVersion: '2024-10-28' });

  const projects = await client.fetch<
    Array<{
      _id: string;
      name: string;
      image?: { asset?: { _ref: string }; alt?: string; crop?: unknown; hotspot?: unknown };
      seo?: { title?: string; description?: string; image?: unknown };
      content?: Block[];
    }>
  >(`*[_type == "project" && defined(slug.current)]{ _id, name, image, seo, content }`);

  for (const project of projects) {
    const patch = PROJECT_PATCHES[project._id] ?? {};
    const set: Record<string, unknown> = {};

    const seoTitle = patch.seoTitle ?? project.seo?.title ?? project.name;
    const seoDescription = patch.seoDescription ?? project.seo?.description;

    set.seo = {
      ...project.seo,
      title: seoTitle,
      description: typeof seoDescription === 'string' ? seoDescription.trim() : seoDescription,
    };

    if (project.image?.asset && !project.seo?.image) {
      (set.seo as Record<string, unknown>).image = {
        _type: 'image',
        asset: { _type: 'reference', _ref: project.image.asset._ref },
        alt: project.image.alt,
        crop: project.image.crop,
        hotspot: project.image.hotspot,
      };
    }

    if (patch.status) set.status = patch.status;
    if (patch.projectEnd) set.projectEnd = patch.projectEnd;
    if (patch.connectedPage) set.connectedPage = patch.connectedPage;
    if (patch.slug) {
      set.slug = { _type: 'slug', current: patch.slug };
    }

    if (patch.extraContent && project.content?.length) {
      const extraKey = `extra-${project._id.slice(0, 8)}`;
      const hasExtra = project.content.some(b => b._key === extraKey);
      if (!hasExtra) {
        set.content = [...project.content, block(extraKey, patch.extraContent)];
      }
    }

    await client.patch(project._id).set(set).commit({ autoGenerateArrayKeys: true });
  }

  for (const redirect of SLUG_REDIRECTS) {
    await client.createOrReplace({
      _id: redirect.id,
      _type: 'redirect',
      source: redirect.source,
      destination: redirect.destination,
      permanent: true,
      isEnabled: true,
    });
  }

  await client
    .patch('home')
    .set({
      showcaseProjects: SHOWCASE_PROJECT_IDS.map((ref, index) => ({
        _key: `showcase-project-${index + 1}`,
        _type: 'reference',
        _ref: ref,
      })),
    })
    .commit({ autoGenerateArrayKeys: true });

  console.log(
    `Updated ${projects.length} projects, ${SLUG_REDIRECTS.length} redirects, and home showcase projects.`,
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
