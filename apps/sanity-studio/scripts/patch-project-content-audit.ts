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

function summary(id: string, paragraphs: string[]): Block[] {
  return paragraphs.map((text, index) => block(`${id}-summary-${index}`, text));
}

type ProjectPatch = {
  summary?: string[];
  seoTitle?: string;
  seoDescription?: string;
  noIndex?: boolean;
  imageAlt?: string;
  connectedPage?: string;
  addTagNames?: string[];
};

/** Content audit patches — summaries, SEO, and quick fixes (Jul 2026). */
const PATCHES: Record<string, ProjectPatch> = {
  // ── Quick fixes ──────────────────────────────────────────────────────────
  '8bac924b-ba09-45a1-a6bb-5df54fab054b': {
    imageAlt:
      'Hand-lettered Stormhvalen sailboat name on hull — Nordic-inspired custom lettering design.',
  },
  'drafts.d47eb5c4-b974-4973-9813-088e5e3db72a': {
    noIndex: true,
    seoTitle: 'IB',
    seoDescription: 'Work in progress — project details coming soon.',
    addTagNames: ['Work'],
  },
  'drafts.b982fad5-ddf1-4274-b5de-f3f0e4ce63cf': {
    noIndex: true,
    seoTitle: 'NBIM — Oljefondet',
    seoDescription:
      'In-progress work for NBIM (Oljefondet). Full case study published when the project launches.',
    addTagNames: ['Work', 'NextJS'],
  },
  'd128c4e9-c0d3-4527-8b22-2ef792aa3421': {
    seoDescription:
      'Internal web performance dashboard — Core Web Vitals, load times, and error rates in one real-time view. Built in eight weeks at NoA Ignite.',
    summary: [
      'Internal tool that pulls Core Web Vitals, load times, error rates, and traffic patterns into one scannable dashboard — built at NoA Ignite in under eight weeks.',
      'Colour-coded status, trend sparklines, and threshold alerts so the team spots regressions without digging through logs. Filterable by date, page, and device.',
    ],
  },

  // ── Trim overlong summary ────────────────────────────────────────────────
  '037cce21-55e4-44be-beb1-17991a33f877': {
    summary: [
      "Built at Bruno Simon's Awwwards 2022 shader workshop — an interactive black hole tribute to Interstellar's Gargantua, rendered in Three.js and custom GLSL with no imported models.",
      'Gravitational lensing, procedural accretion disk, 60fps in a browser tab. Still one of the projects I am most proud of — the reason I kept going deeper into WebGL.',
    ],
    seoDescription:
      "Three.js black hole from Bruno Simon's Awwwards 2022 workshop — GLSL shaders, gravitational lensing, and step-by-step build notes.",
  },

  // ── Top client projects ──────────────────────────────────────────────────
  '7c2e6663-3d89-4463-b807-45402c101fb7': {
    summary: [
      "Led design system architecture for Bane NOR — Norway's national rail operator. React component library, token-based CSS, and documentation built for dozens of internal product teams.",
      'Hard calls on naming, contribution models, and docs engineers actually read. The system shipped and is in active use across Bane NOR product teams.',
    ],
    seoTitle: 'Bane NOR — Design System Lead',
    seoDescription:
      "Led Bane NOR's React design system — token-based CSS, component library, and docs adopted across Norway's national rail product teams.",
  },
  '7ea4c1a3-1780-4a29-b3d5-bc1229725aef': {
    summary: [
      'Built KREM for TINE over ten months — React + TypeScript component library with Figma token pipeline, TailwindCSS theming, Storybook docs, and Turborepo monorepo.',
      'Published as a private NPM package consumed by multiple product teams. Cut redundant UI work and gave TINE a consistent, scalable digital foundation.',
    ],
    seoTitle: 'TINE — KREM Design System',
    seoDescription:
      "KREM: TINE's React design system — Figma tokens, TailwindCSS, Storybook, Turborepo, and private NPM package for Norway's largest dairy brand.",
  },
  '030150dd-650c-48ae-9d85-a7d1e9401f9d': {
    summary: [
      "Built Anton Sport's e-commerce frontend Jan–Jul 2025 — product listings, filtering, cart, and checkout on Next.js + TypeScript in a Turborepo monorepo.",
      'Real retail deadlines, real stakeholders, and a codebase built for maintainability beyond my involvement. Live at antonsport.no.',
    ],
    seoTitle: 'Anton Sport — Online Retail',
    seoDescription:
      'E-commerce frontend for Anton Sport — Next.js, TypeScript, and Turborepo monorepo with catalogue, filters, and checkout flows.',
    connectedPage: 'https://www.antonsport.no',
  },
  'ab9134d7-c675-4445-b4ce-8af4d5e76c58': {
    summary: [
      "Rebuilt TINE Kjøkken's recipe platform frontend (Sep–Dec 2024) in Next.js with Enonic XP as headless CMS — one of Norway's most visited food destinations.",
      'Dynamic routing, ISR, and structured recipe data so editors manage thousands of recipes while the frontend stays fast. Live at tine.no/kjokken.',
    ],
    seoTitle: 'TINE Kjøkken — Recipes',
    seoDescription:
      'Next.js rebuild for TINE Kjøkken — Enonic XP headless CMS, ISR, and recipe structured data for millions of monthly visitors.',
    connectedPage: 'https://www.tine.no/kjokken/',
  },
  '2d707aac-070a-4fb7-bf72-b8cbf37a0e13': {
    summary: [
      "Internal transport optimisation dashboard for Bama's logistics team (Aug–Oct 2023). GraphQL API integration with Next.js + TailwindCSS.",
      'Data-heavy UI designed for ops staff making time-sensitive routing decisions — efficient queries, clear hierarchy, shipped on schedule.',
    ],
    seoTitle: 'Bama — Transport Optimisation Dashboard',
    seoDescription:
      'Bama logistics dashboard: GraphQL transport data and Next.js + Tailwind UI — built for ops teams making routing decisions at scale.',
  },

  // ── Remaining completed projects ─────────────────────────────────────────
  '27ee8b4d-6513-4288-9bf4-e08a72082788': {
    summary: [
      'Four years of album cover design for Nixis (2014–2018) — each release a fresh challenge in how visual identity and sound speak the same language.',
      'Listen first, sketch second, evolve the brand release by release. Long-term creative relationship that shaped how I approach multi-year design work.',
    ],
    seoTitle: 'Nixis — Album Covers',
    seoDescription:
      'Four years of album cover design for Nixis — evolving visual identity and branding across releases from 2014 to 2018.',
  },
  '5e65b3fc-fbf3-481f-a777-22573220d887': {
    summary: [
      'Horror tower-defense built in three days during a game jam — trapped in a blood-stained tower, holding off waves with whatever defenses you can build. Unity, ship under pressure.',
      'Free to play in the browser. One of those jam projects where every decision counts when the clock is running.',
    ],
    seoTitle: 'Blodtårnet',
    seoDescription:
      'Blodtårnet: Unity horror tower-defense game jam — survive the blood-stained tower. Free browser game built in three days.',
    connectedPage: 'https://play.unity.com/en/games/29bffa25-928f-4283-b5ef-97cc5c1f5a0a/game-web',
  },
  'e46f4d50-38a1-4d6e-96ab-cb9de2b22bb3': {
    summary: [
      '48-hour game jam entry — tiny box character, endless runner, increasingly chaotic hazards. Solo art and C# gameplay in Unity, November 2019.',
      'Scrappy, weird, and exactly what a jam should be. Proof you can ship a complete playable game when you stop overthinking.',
    ],
    seoTitle: 'Box Boi',
    seoDescription:
      'BoxBoi: solo Unity endless runner game jam — custom art, C# gameplay, and a Nicolas Cage hazard. Built in 48 hours.',
  },
  'dba5d7b2-da21-4d52-a976-6ed4c0ff1c83': {
    summary: [
      'Custom Christmas ale label for Erik — a gift brief turned into Nordic lettering with warmth, rich colour, and hand-crafted feel. Two weeks from phone call to finished label.',
      'No brand guidelines, no committee — just thoughtful design for a son wanting to do something special for his father.',
    ],
    seoTitle: 'Far Erik — Christmas Beer',
    seoDescription:
      'Custom Christmas ale label for Far Erik — Nordic-inspired lettering and illustration, crafted in two weeks as a heartfelt gift.',
  },
  'cb42f323-4d88-402e-91da-f729403ec045': {
    summary: [
      'Media tracking dashboard for First House (Hastings) — React, Vite, TypeScript, TailwindCSS. Turned AI-processed brand coverage into something client teams could actually use.',
      'Redux Toolkit + RTK Query for live data, custom widgets, and interactive charts. Three months, tight scope, real client depending on it.',
    ],
    seoTitle: 'Hastings — First House',
    seoDescription:
      'First House brand-tracking dashboard — React, RTK Query, and live AI-processed media data for property sector clients.',
  },
  'c6c7060d-0313-4ef0-bf60-bea88a1eff66': {
    summary: [
      'Holiday campaign site for Ruter (Oslo public transport) encouraging community giving at Christmas. Built with Next.js + Tailwind in under two months, Nov–Dec 2023.',
      "Public-facing work for one of Norway's most recognisable transport brands — fast, polished, and deadline-driven.",
    ],
    seoTitle: 'Ruter — Gi Av Deg Selv',
    seoDescription:
      'Gi Av Deg Selv: Ruter holiday campaign site — Next.js + Tailwind, built in two months for Oslo public transport.',
  },
  '38987d1d-75a9-486c-af3b-bccc85b6a091': {
    summary: [
      'WordPress site for the planned 2019 revival of Hove Music Festival — lineup pages, ticketing info, mobile-first layout, and SEO foundations.',
      "The festival was cancelled before launch. The site was ready; the event wasn't. Honest story — proud of what was built anyway.",
    ],
    seoTitle: 'Hove Music Festival 2019',
    seoDescription:
      'WordPress site for Hove Music Festival 2019 revival — mobile-first lineup and ticketing pages. Festival cancelled; site was production-ready.',
  },
  '26276cb3-2e1b-46e8-968d-5256a7ef445e': {
    summary: [
      "Flash + ActionScript 3 infinite runner for TINE Litago (2011) — built with friends in high school for Norway's iconic strawberry cow brand.",
      'First time I shipped something real that real kids could play. Flash is gone; this project is where game development started for me.',
    ],
    seoTitle: 'TINE — Litago',
    seoDescription:
      'TINE Litago Flash game (2011) — ActionScript 3 infinite runner built in high school. My first shipped game for a real brand.',
  },
  '0fe76d1c-539b-48b9-bd5a-f831ad6beb97': {
    summary: [
      "WiSiHe is my own portfolio — illustration and development in one space. Next.js, TypeScript, Sanity CMS, Tailwind, Framer Motion, and Three.js where flat isn't enough.",
      "Three years of evolving, rebuilding, and using the site as a live testbed for the tools I care about. No finish line — and that's the point.",
    ],
    seoTitle: 'WiSiHe — Portfolio Website',
    seoDescription:
      'WiSiHe portfolio — Next.js monorepo with Sanity CMS, design tokens, paintings, projects, and performance-focused UX.',
    connectedPage: 'https://www.wisihe.no',
  },
  'a0953f6d-9c90-4e09-b9b5-647ff7164cc7': {
    summary: [
      'Two-and-a-half year maritime logistics platform — real-time vessel tracking and ops management for sea rescue coordination. PHP and vanilla JavaScript, pre-framework era.',
      'Led frontend and owned significant backend work. By 2019 the platform handled live operational data for active rescue coordination.',
    ],
    seoTitle: 'Sealift Systems',
    seoDescription:
      'Sealift Systems maritime platform — real-time vessel tracking and rescue ops management. PHP + JavaScript, shipped 2016–2019.',
  },
  '212bb547-d945-45d5-a06c-8527c7b8c8c4': {
    summary: [
      'Panel debate on building accessible apps, 28 January 2025 — making the case that accessibility is core engineering and design, not a compliance checkbox.',
      'Direct conversation about where teams get stuck and why shared ownership from day one ships better products than "fix it later."',
    ],
    seoTitle: 'Slik bygger vi apper for alle',
    seoDescription:
      'Panel debate on accessible app development — why a11y belongs in product design from day one, not as a late compliance fix.',
  },
  'fff206cc-e2e4-40f7-aa51-e6843aebe29d': {
    summary: [
      'Three-year whiskey tasting club platform — Sanity CMS, Next.js, NextAuth, tasting notes, events, and member profiles. Shaped by real member feedback throughout.',
      'Full TypeScript data model for distilleries, regions, and taste profiles. The kind of long-running build I am most proud of — one that actually gets used.',
    ],
    seoTitle: 'Unge Drabanter',
    seoDescription:
      'Unge Drabanter whiskey club — Next.js, Sanity, NextAuth. Tasting notes, events, and member profiles built over three years.',
  },
  '22377a03-a8e9-4bb5-a44c-13a9da0a1427': {
    summary: [
      'WordPress site for Nixis — dark, atmospheric design with Spotify embeds and Mailchimp newsletter signup. Custom theme in HTML, CSS, and PHP.',
      'Built in about a month. Gave the artist a professional, on-brand presence that was easy to maintain without touching code.',
    ],
    seoTitle: 'Nixis — Website',
    seoDescription:
      'Custom WordPress site for Nixis — dark design, Spotify embeds, and Mailchimp signup. Built in one month.',
  },
  '90afc030-1c40-47b9-aaec-4066ffbd8a2a': {
    summary: [
      'Logo and Squarespace store for Moldbakken — family startup selling mushroom kits from recycled coffee grounds. Eight-day turnaround.',
      'Earthy identity rooted in "Moldbakken" (The Soil Hill). Considered brand, working shop, launched on time.',
    ],
    seoTitle: 'Moldbakken — Website & Logo',
    seoDescription:
      'Moldbakken logo and Squarespace store — eco-friendly mushroom kits from recycled coffee grounds. Eight-day sprint.',
  },

  // ── Bad UI 2.0: add Hackathon tag ────────────────────────────────────────
  'f7b13fe2-566b-483e-855b-766521bbb64e': {
    addTagNames: ['Hackathon'],
  },
};

async function main() {
  const client = await getCliClient({ apiVersion: '2024-10-28' });

  const tagByName = new Map<string, string>(
    await client
      .fetch<Array<{ _id: string; name: string }>>(
        `*[_type == "tag" && defined(name)]{ _id, name }`,
      )
      .then(tags => tags.map(t => [t.name, t._id] as const)),
  );

  let updated = 0;

  for (const [docId, patch] of Object.entries(PATCHES)) {
    const project = await client.fetch<{
      _id: string;
      seo?: { title?: string; description?: string; noIndex?: boolean; image?: unknown };
      image?: { alt?: string; asset?: { _ref: string }; crop?: unknown; hotspot?: unknown };
      tags?: Array<{ _key?: string; _ref: string; _type: 'reference' }>;
    } | null>(`*[_id == $id][0]{ _id, seo, image, tags }`, { id: docId });

    if (!project) {
      console.warn(`Skip ${docId}: document not found`);
      continue;
    }

    const set: Record<string, unknown> = {};

    if (patch.summary?.length) {
      set.summary = summary(docId.replace(/\./g, '-'), patch.summary);
    }

    const seo = { ...project.seo };
    if (patch.seoTitle) seo.title = patch.seoTitle;
    if (patch.seoDescription) seo.description = patch.seoDescription;
    if (patch.noIndex !== undefined) seo.noIndex = patch.noIndex;
    if (patch.seoTitle || patch.seoDescription || patch.noIndex !== undefined) {
      set.seo = seo;
    }

    if (patch.imageAlt && project.image) {
      set.image = { ...project.image, alt: patch.imageAlt };
    }

    if (patch.connectedPage) {
      set.connectedPage = patch.connectedPage;
    }

    if (patch.addTagNames?.length) {
      const existingRefs = new Set(project.tags?.map(t => t._ref) ?? []);
      const newTags = [...(project.tags ?? [])];
      for (const name of patch.addTagNames) {
        const ref = tagByName.get(name);
        if (ref && !existingRefs.has(ref)) {
          newTags.push({ _type: 'reference', _ref: ref, _key: `tag-${ref.slice(0, 8)}` });
          existingRefs.add(ref);
        }
      }
      set.tags = newTags;
    }

    if (Object.keys(set).length === 0) continue;

    await client.patch(project._id).set(set).commit({ autoGenerateArrayKeys: true });
    updated += 1;
    console.log(`Patched ${docId}`);
  }

  console.log(`Done — updated ${updated} project(s).`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
