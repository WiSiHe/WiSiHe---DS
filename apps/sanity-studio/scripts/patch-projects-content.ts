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
    seoTitle: 'Bad UI Battle',
    seoDescription:
      'Hosted BAD UI BATTLE at NoA Ignite (2024) — awful-UI hackathon with Next.js signup site, public gallery, and a Figma entry. Deliberately terrible interfaces, crowd-voted.',
    connectedPage: 'https://bad-ui-battle-signup.vercel.app/gallery',
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
    seoTitle: 'First House — Hastings',
    seoDescription:
      'Hastings media-tracking dashboard for First House — React, RTK Query, and live AI-processed brand coverage for property clients.',
  },
  'f7b13fe2-566b-483e-855b-766521bbb64e': {
    seoTitle: 'Bad UI Battle 2.0',
    seoDescription:
      'Hosted BAD UI BATTLE at NoA Ignite (2025) — awful-UI hackathon with Next.js signup site, public gallery, and Worst Authenticator (coded entry). Deliberately terrible interfaces, crowd-voted.',
    connectedPage: 'https://bad-ui-battle-signup.vercel.app/gallery',
  },
  '0fe76d1c-539b-48b9-bd5a-f831ad6beb97': {
    seoTitle: 'WiSiHe — Portfolio Website',
    seoDescription:
      'WiSiHe portfolio — Next.js monorepo with Sanity CMS, design tokens, Algolia search, shared React components, and performance-focused UX. Ongoing since 2021.',
    status: 'inProgress',
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
      'Project Babel (2016–2019): UE4 frozen-world adventure with Fabien Guillaume — shifting puzzle rooms, vertical slice, teaser trailer, and hard-won scope lessons from an unreleased game.',
    connectedPage: 'https://youtu.be/_vomTdWqdP8',
  },
  '030150dd-650c-48ae-9d85-a7d1e9401f9d': {
    seoTitle: 'Anton Sport Online Retail',
    connectedPage: 'https://www.antonsport.no',
    extraContent:
      'The storefront supports real product catalogues, filtering, and checkout flows on a Turborepo monorepo—built for maintainability beyond the initial delivery.',
  },
  '7c2e6663-3d89-4463-b807-45402c101fb7': {
    seoTitle: 'Bane NOR — Design System Lead',
    seoDescription:
      'Succeeded design system lead at Bane NOR — maintaining and growing a live React library across 20+ rail product teams. Roadmap, releases, stakeholder reporting, and support at national-operator scale.',
    extraContent:
      'Succeeded the previous lead when they moved on — inherited tokens, pipelines, and 20+ components. Five months of roadmap, releases, stakeholder reporting, and support on a live system.',
  },
  '7ea4c1a3-1780-4a29-b3d5-bc1229725aef': {
    seoTitle: 'TINE — KREM Design System',
    connectedPage:
      'https://main--65aef5010dff543cab28da32.chromatic.com/?path=/docs/welcome-tine-design-system--docs',
    extraContent:
      'KREM gave TINE a shared foundation for React teams, with a token layer non-React products could adopt too. Button in production by end of Q1 2024; public Storybook on Chromatic.',
  },
  'ab9134d7-c675-4445-b4ce-8af4d5e76c58': {
    seoTitle: 'TINE Kjøkken — Recipes',
    seoDescription:
      'Next.js rebuild for TINE Kjøkken — Enonic XP headless CMS, ISR, dynamic routing, and recipe structured data. Live at tine.no/kjokken.',
    connectedPage: 'https://www.tine.no/kjokken/',
  },
  '037cce21-55e4-44be-beb1-17991a33f877': {
    seoTitle: '3D Black Hole',
    seoDescription:
      "Interactive 3D black hole from Bruno Simon's Awwwards 2022 shader workshop — Three.js, GLSL, gravitational lensing, step-by-step build notes, and links to Three.js Journey.",
    connectedPage: 'https://workshop-shaders.vercel.app/',
  },
  'ed9b5322-8d87-4441-986b-8861ff3ade7b': {
    seoTitle: 'Spline Workshop',
    seoDescription:
      'NoA Ignite Spline workshop for 20+ designers and developers — interactive 3D rocket in 2.5 hours, no Three.js. Full Notion guide: model, animate, and embed with Spline.',
    connectedPage:
      'https://thenorthalliance.notion.site/Spline-Workshop-1b2cf2f6604a8079876bd7b025269ed5',
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
  'd128c4e9-c0d3-4527-8b22-2ef792aa3421', // NoA Ignite | Website Performance Dashboard
  '030150dd-650c-48ae-9d85-a7d1e9401f9d', // Anton Sport | Online Retail
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
