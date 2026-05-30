/**
 * 1. Fix project-nokken slug → project-huldra
 * 2. Generate real SEO descriptions for 19 projects with placeholder text
 *
 * Run: node fix-projects.mjs
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '.env.local') });

const client = createClient({
  projectId: 'cbjsv7wi', dataset: 'production',
  apiVersion: '2024-01-01', token: process.env.SANITY_API_WRITE_TOKEN, useCdn: false,
});

const OPENAI_KEY = process.env.SANITY_STUDIO_OPENAI_API_KEY;

async function openai(prompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 60,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error?.message ?? JSON.stringify(d));
  return d.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
}

// Projects needing SEO descriptions (from previous query)
const projects = [
  { id: '030150dd-650c-48ae-9d85-a7d1e9401f9d', name: 'Anton Sport Online Retail', text: "Anton Sport is one of Norway's established sports retailers. I built their e-commerce platform from the ground up — product listings, filtering, cart flows, and checkout — using Next.js, TypeScript, Tailwind CSS, and Turborepo." },
  { id: '037afd2c-3c85-4d30-b964-7444eb903a2c', name: 'BAD UI BATTLE | Hackathon', text: "A one-day design hackathon where the goal was to build the most deliberately terrible UI imaginable. Mystery meat navigation, moving buttons, blinding contrast — weaponising every anti-pattern for laughs and learning." },
  { id: '212bb547-d945-45d5-a06c-8527c7b8c8c4', name: 'Slik bygger vi apper for alle | Panel Debate', text: "A panel debate on building accessible apps — pushing back on accessibility as a compliance checkbox and making the case for building it in from day one." },
  { id: '22377a03-a8e9-4bb5-a44c-13a9da0a1427', name: 'Nixis Website', text: "Custom WordPress site for musician Nixis — dark, atmospheric design, Spotify integration, Mailchimp newsletter signup, and a complete online presence built in about a month." },
  { id: '26276cb3-2e1b-46e8-968d-5256a7ef445e', name: 'TINE Litago', text: "A Flash-based infinite runner built for one of Norway's most iconic kids' brands — the Litago strawberry cow. My first shipped game, built with friends in high school using ActionScript 3." },
  { id: '27ee8b4d-6513-4288-9bf4-e08a72082788', name: 'Nixis Album Covers', text: "Four years of album cover design for musician Nixis. Each release was a fresh visual challenge, building a brand identity that evolved with the music." },
  { id: '2d707aac-070a-4fb7-bf72-b8cbf37a0e13', name: 'Bama | Transport Optimisation Dashboard', text: "An internal logistics dashboard for one of Norway's largest food distributors — real-time transport data via GraphQL, built with Next.js and TailwindCSS." },
  { id: '38987d1d-75a9-486c-af3b-bccc85b6a091', name: 'Hove Music Festival 2019', text: "A WordPress festival site built for the attempted revival of Norway's beloved Hove Music Festival. The site was ready; the festival was cancelled before it launched." },
  { id: '7c2e6663-3d89-4463-b807-45402c101fb7', name: 'Bane NOR | Design System Lead', text: "Led the design system for Norway's national rail operator — a React component library with token-based CSS, adopted across dozens of internal product teams." },
  { id: '7ea4c1a3-1780-4a29-b3d5-bc1229725aef', name: 'TINE Designsystem - KREM', text: "Design system developer at TINE building KREM — a React component library with Figma token pipeline, TailwindCSS, Storybook docs, and Turborepo monorepo setup." },
  { id: '90afc030-1c40-47b9-aaec-4066ffbd8a2a', name: 'Moldbakken', text: "Logo and Squarespace store for a family startup selling mushroom-growing kits made from recycled coffee grounds. Eight days, from brief to launch." },
  { id: 'a0953f6d-9c90-4e09-b9b5-647ff7164cc7', name: 'Sealift Systems', text: "Two and a half years building a maritime logistics platform for sea rescue and cargo operations — real-time vessel tracking and ops management in HTML, CSS, PHP, and vanilla JavaScript." },
  { id: 'ab9134d7-c675-4445-b4ce-8af4d5e76c58', name: 'TINE Kjøkken | Recipes', text: "Rebuilt TINE Kjøkken's recipe platform as a Next.js app integrated with Enonic XP CMS — handling thousands of recipes and millions of monthly visitors." },
  { id: 'c6c7060d-0313-4ef0-bf60-bea88a1eff66', name: 'Gi Av Deg Selv | Ruter', text: "Holiday campaign site for Oslo's public transport authority — built with Next.js and TailwindCSS, from brief to launch in under two months." },
  { id: 'cb42f323-4d88-402e-91da-f729403ec045', name: 'Hastings | First House', text: "Client-facing media tracking dashboard for comms firm First House — React, Vite, TypeScript, Redux Toolkit, and RTK Query for live data and responsive charting." },
  { id: 'dba5d7b2-da21-4d52-a976-6ed4c0ff1c83', name: 'Far Erik - Christmas Beer', text: "A custom Christmas beer label designed as a personal gift — a son commissioning a label for his father's homebrewed ale. Nordic character and warmth in two weeks." },
  { id: 'e46f4d50-38a1-4d6e-96ab-cb8de2b22bb3', name: 'BoxBoi-Unity', text: "A complete game built solo in 48 hours during a game jam — an endless runner in Unity using C# with custom art, featuring Nicolas Cage's face as a hazard." },
  { id: 'ed9b5322-8d87-4441-986b-8861ff3ade7b', name: 'Spline Workshop', text: "Internal workshop teaching colleagues Spline — a browser-based 3D design tool. Participants went from zero to a published interactive 3D scene in a single session." },
  { id: 'f7b13fe2-566b-483e-855b-766521bbb64e', name: 'BAD UI BATTLE 2.0 | Hackathon', text: "Round two of the deliberate bad UI hackathon — misaligned buttons, illegible colours, hostile interactions. The gallery is live. Proceed with low expectations." },
];

async function throttle(items, fn, concurrency = 5) {
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
}

async function main() {
  // ── Step 1: Fix slug mismatch ─────────────────────────────────────────────
  console.log('\n── Step 1: Fix project-nokken slug → project-huldra ─────────────\n');
  await client
    .patch('37b22ba7-f453-4ab2-a04f-d4241f178509')
    .set({ slug: { _type: 'slug', current: 'project-huldra' } })
    .commit();
  console.log('  ✅ project-nokken → project-huldra');

  // ── Step 2: Generate SEO descriptions ────────────────────────────────────
  console.log('\n── Step 2: Generating SEO descriptions ──────────────────────────\n');

  let done = 0;
  await throttle(projects, async (project) => {
    try {
      const seoDescription = await openai(
        `Write an SEO meta description of max 155 characters for a portfolio project called "${project.name}". ` +
        `Based on: ${project.text.slice(0, 400)}. ` +
        `Be specific and punchy. No generic filler. Return only the description.`
      );
      const trimmed = seoDescription.slice(0, 155);
      await client.patch(project.id).set({ 'seo.description': trimmed }).commit();
      done++;
      console.log(`  ✅ [${done}/${projects.length}] ${project.name}`);
      console.log(`       ${trimmed}\n`);
    } catch (e) {
      console.error(`  ❌ ${project.name}: ${e.message}`);
    }
  }, 5);

  console.log(`\n✨ Done! ${done}/${projects.length} SEO descriptions generated.\n`);
}

main().catch(console.error);
