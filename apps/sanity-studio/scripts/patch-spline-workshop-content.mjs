/**
 * Update Spline Workshop project copy, SEO, tags, and workshop guide URL.
 * Run: node scripts/patch-spline-workshop-content.mjs
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
config({ path: path.join(studioRoot, '.env') });

const PROJECT_ID = process.env.SANITY_STUDIO_API_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const DATASET =
  process.env.SANITY_STUDIO_API_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

if (!PROJECT_ID || !WRITE_TOKEN) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID or SANITY_API_WRITE_TOKEN');
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-10-28',
  token: WRITE_TOKEN,
  useCdn: false,
});

const DOCUMENT_ID = 'ed9b5322-8d87-4441-986b-8861ff3ade7b';

const WORKSHOP_GUIDE_URL =
  'https://thenorthalliance.notion.site/Spline-Workshop-1b2cf2f6604a8079876bd7b025269ed5';
const SPLINE_URL = 'https://spline.design/';
const SPLINE_DOWNLOAD_URL = 'https://spline.design/download';
const SPLINE_TUTORIALS_URL = 'https://spline.design/tutorials';

function span(key, text, marks = []) {
  return { _key: key, _type: 'span', marks, text };
}

function linkDef(key, href) {
  return {
    _key: key,
    _type: 'link',
    linkType: 'href',
    href,
    openInNewTab: true,
  };
}

function paragraph(key, children, markDefs = []) {
  return {
    _key: key,
    _type: 'block',
    style: 'normal',
    markDefs,
    children,
  };
}

function heading(key, text, level = 'h2') {
  return {
    _key: key,
    _type: 'block',
    style: level,
    markDefs: [],
    children: [span(`${key}-span`, text)],
  };
}

function bullet(key, text) {
  return {
    _key: key,
    _type: 'block',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [span(`${key}-span`, text)],
  };
}

function linkedParagraph(key, parts) {
  const markDefs = [];
  const children = parts.map((part, index) => {
    if (part.link) {
      const linkKey = `${key}-link-${index}`;
      markDefs.push(linkDef(linkKey, part.link));
      return span(`${key}-span-${index}`, part.text, [linkKey]);
    }
    return span(`${key}-span-${index}`, part.text);
  });
  return paragraph(key, children, markDefs);
}

function linkedBullet(key, parts) {
  const markDefs = [];
  const children = parts.map((part, index) => {
    if (part.link) {
      const linkKey = `${key}-link-${index}`;
      markDefs.push(linkDef(linkKey, part.link));
      return span(`${key}-span-${index}`, part.text, [linkKey]);
    }
    return span(`${key}-span-${index}`, part.text);
  });
  return {
    _key: key,
    _type: 'block',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs,
    children,
  };
}

function codeBlock(key, language, code, filename) {
  return {
    _key: key,
    _type: 'code',
    language,
    filename,
    code,
  };
}

const content = [
  linkedParagraph('intro-hook', [
    {
      text: 'I ran an internal workshop at NoA Ignite on building interactive 3D for the web with Spline — no Three.js, no Blender, no code editor required for the core build. The full walkthrough lives in the ',
    },
    { text: 'Spline Workshop guide on Notion', link: WORKSHOP_GUIDE_URL },
    {
      text: ' (also linked below as the workshop resource). Follow it step by step to go from zero to a published rocket in about 40 minutes.',
    },
  ]),

  heading('tldr-heading', 'TL;DR'),

  bullet(
    'tldr-1',
    'Goal: model a 3D rocket in Spline, animate lift-off on Spacebar, reset on R, and embed the scene in a plain HTML page.',
  ),
  bullet(
    'tldr-2',
    'Tools: free Spline account, browser (or desktop app), and a text editor for the final HTML file.',
  ),
  bullet(
    'tldr-3',
    'Build: Lathe body + hollow cylinder nozzle + vector fins cloned radially — all grouped as "Rocket Final".',
  ),
  bullet(
    'tldr-4',
    'Polish: matcap materials, particle exhaust at the nozzle, Bloom post-processing, and keyboard-driven state transitions.',
  ),
  bullet(
    'tldr-5',
    'Ship: export the scene URL from Spline and paste it into a spline-viewer embed — open rocket.html in any browser.',
  ),
  linkedBullet('tldr-6', [
    { text: 'Start here: ' },
    { text: 'open the workshop guide', link: WORKSHOP_GUIDE_URL },
    { text: ' — it has every click, inspector value, and screenshot from the session.' },
  ]),

  paragraph('intro-2', [
    span(
      'intro-2-span',
      'Spline is a browser-based 3D design tool that sits at the opposite end of the complexity spectrum from a Three.js shader workshop. You model, animate, and publish inside one app — then export a scene URL or embed code that runs on any modern website. I built this session for designers and developers who want interactive 3D without committing to a full WebGL stack.',
    ),
  ]),
  paragraph('intro-3', [
    span(
      'intro-3-span',
      'Participants went from a blank file to a working rocket with particle exhaust and keyboard controls in a single sitting. The "wait, that is it?" reaction was the point. Everyone left with something they could open in a browser tab and share — and a clear path to keep experimenting in the #noa-3d Slack channel.',
    ),
  ]),

  heading('guide-heading', 'Workshop guide'),

  linkedParagraph('guide-intro', [
    {
      text: 'The canonical resource for this project is the Notion guide: ',
    },
    { text: 'Spline Workshop — Build & Launch an Animated Rocket', link: WORKSHOP_GUIDE_URL },
    {
      text: '. It is structured in five parts (Part 0 through Part 4) and includes the exact inspector values, keyboard shortcuts, and export steps from the live session. Use the link in the Live project section below, or open it directly from here. What follows is an expanded summary — the Notion page is where you actually build along.',
    },
  ]),

  heading('part-0-heading', 'Part 0: Getting Spline', 'h3'),

  linkedParagraph('part-0-body', [
    { text: 'Before Part 1, get Spline running. Use the ' },
    { text: 'web app at spline.design', link: SPLINE_URL },
    { text: ' (easiest in a workshop — no install) or the optional ' },
    { text: 'desktop app', link: SPLINE_DOWNLOAD_URL },
    {
      text: ' for Mac, Windows, or Linux. Create a free account when prompted — you need it to save files and export scenes.',
    },
  ]),

  bullet('part-0-1', 'Web version: open spline.design, sign in, and you are ready for Part 1.'),
  bullet(
    'part-0-2',
    'Desktop version: download, install, log in with the same account — files sync across both.',
  ),
  bullet(
    'part-0-3',
    'Workshop tip: stick to one platform per session so everyone sees the same UI layout.',
  ),

  heading('part-1-heading', 'Part 1: Setup & preparation', 'h3'),

  paragraph('part-1-body', [
    span(
      'part-1-body-span',
      'Launch Spline and log in. From your dashboard, click the blue "New File" button (top right) and pick the "3D Text Example" template — it gives you a lit scene without starting from an empty canvas.',
    ),
  ]),

  bullet(
    'part-1-1',
    'Clean the scene: select the "Text" object in the Object List (left panel) and press Delete or Backspace.',
  ),
  bullet(
    'part-1-2',
    'Optional: delete or hide the "Rectangle" background (eye icon in the Object List) so the rocket sits on the default grid.',
  ),
  bullet(
    'part-1-3',
    'Rename the file: click the title top-left (e.g. "3D Text Example") and change it to "My Rocket".',
  ),
  bullet(
    'part-1-4',
    'Save early and often: Cmd+S (Mac) or Ctrl+S (Windows). You will thank yourself before Part 3.',
  ),

  heading('part-2-heading', 'Part 2: Building the rocket (Lathe & Vector method)', 'h3'),

  paragraph('part-2-body', [
    span(
      'part-2-body-span',
      'The rocket is built entirely from Spline primitives — no imported models. The body uses a Lathe (revolve a profile curve), the nozzle is a hollow Cylinder, and the fins are drawn with the Vector tool then cloned radially. Naming groups as you go makes Parts 3 and 4 much easier.',
    ),
  ]),

  bullet(
    'part-2-1',
    'Rocket body (Lathe): click "+" in the toolbar → Lathe. In the Inspector, set approximate Scale X: 2, Y: 3, Z: 2 (adjust Y first for height). Open the curve editor and drag points to a rocket profile — pointy nose, wider body, vertical points on the rotation axis.',
  ),
  bullet(
    'part-2-2',
    'Engine nozzle (Cylinder): add a Cylinder, move it (W key) to the bottom of the lathe, scale width to match the base. Set Hollow to ~0.80, Bottom Radius to ~0.30 if available, and Scale Y to ~0.5 for height. Check from Side and Front orthographic views.',
  ),
  bullet(
    'part-2-3',
    'Fins (Vector): switch to Right or Front orthographic view. Select the Vector tool (pen icon), draw a closed fin shape beside the rocket base, set Extrusion to ~10–20, optional small Bevel. Group the fin alone as "Fin Pivot Group" (Cmd+G / Ctrl+G).',
  ),
  bullet(
    'part-2-4',
    'Radial clone: with Fin Pivot Group selected, use the clone tool — Type: Radial, Count: 4, Radius ~50, Alignment: Yes. Rotate the group into position on the rocket body (W to move, R to rotate). Switch back to Perspective view to check.',
  ),
  bullet(
    'part-2-5',
    'Final group: Shift-select the Lathe, Cylinder, and all fin groups → Cmd+G / Ctrl+G → rename to "Rocket Final". Save.',
  ),

  heading('part-3-heading', 'Part 3: Materials, effects & animation', 'h3'),

  paragraph('part-3-body', [
    span(
      'part-3-body-span',
      'Part 3 is where the demo stops being a static model. You apply materials per part, add particle exhaust at the nozzle, wire keyboard events for launch and reset, and optionally enable Bloom so the lift-off reads on screen.',
    ),
  ]),

  bullet(
    'part-3-1',
    'Materials: expand "Rocket Final" in the Object List. Select the lathe body → Inspector → new material → matcap or colour. Repeat for fins and nozzle with contrasting treatments so parts read separately.',
  ),
  bullet(
    'part-3-2',
    'Particle exhaust: "+" → Effect → Emitter (Particles). Move the emitter gizmo to the nozzle opening. Inspector values from the guide: Birthrate ~90, Size Start 40 / End 90, Life 0.5–1.5s (add randomness), Speed ~31. Set Autoplay to No — exhaust should trigger on launch, not loop idle.',
  ),
  bullet(
    'part-3-3',
    'States: select "Rocket Final" → Inspector → States tab. Add a new state, rename it "Lift Off". With Lift Off active, move the group up on Position Y (visible lift). Base State stays on the pad.',
  ),
  bullet(
    'part-3-4',
    'Events — launch: Events tab → Add Event. Trigger: Key Down → Spacebar. Action: Transition → Target Self → State Lift Off. Duration 1500ms, Easing Expo Out.',
  ),
  bullet(
    'part-3-5',
    'Events — reset: second event. Trigger: Key Down → R. Action: Transition → Target Self → State Base State. Duration 1000ms, Easing Linear. Press Play (▶) to test; Stop (⏹) when done.',
  ),
  bullet(
    'part-3-6',
    'Bloom: click empty canvas or scene settings → Post Processing → enable Bloom. Intensity ~0.1–0.3, Threshold ~0.8–1.0. Subtle glow sells the exhaust without blowing out the scene.',
  ),

  heading('part-4-heading', 'Part 4: Optimize, export & integrate', 'h3'),

  paragraph('part-4-body', [
    span(
      'part-4-body-span',
      'Before export, tidy the scene: delete unused objects, remove extra lights if the template added more than you need, and centre Rocket Final at Position X: 0, Z: 0 (adjust Y so it sits on the grid). Save one last time, then open Export (top right) → Code Export / Embed & Share.',
    ),
  ]),

  bullet(
    'part-4-1',
    'Copy the Scene URL — format: https://prod.spline.design/xxxxxxxx/scene.splinecode. Keep it somewhere safe; this is what the web embed loads.',
  ),
  bullet(
    'part-4-2',
    'Note the script tag Spline provides (@splinetool/viewer) and the <spline-viewer> element structure — both are in the export panel and in the guide.',
  ),
  bullet(
    'part-4-3',
    'Paste the URL into the HTML template below, save as rocket.html, and open in Chrome, Safari, or Firefox. Spacebar launches, R resets — no npm, no bundler.',
  ),

  codeBlock(
    'embed-code',
    'html',
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Spline Rocket</title>
    <style>
      body { margin: 0; overflow: hidden; background: #000; }
      spline-viewer { width: 100vw; height: 100vh; display: block; }
    </style>
  </head>
  <body>
    <!-- Load the Spline viewer (from Export → Code Export) -->
    <script
      type="module"
      src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js"
    ></script>

    <!-- Replace with your Scene URL from Spline Export -->
    <spline-viewer url="https://prod.spline.design/YOUR-SCENE-ID/scene.splinecode"></spline-viewer>
  </body>
</html>`,
    'rocket.html',
  ),

  linkedParagraph('part-4-follow', [
    { text: 'Step-by-step export screenshots and the exact Export panel fields are in the ' },
    { text: 'workshop guide', link: WORKSHOP_GUIDE_URL },
    { text: ' under Part 4.' },
  ]),

  heading('finished-heading', 'Finished — what next?', 'h3'),

  linkedParagraph('outro', [
    { text: 'That is the full arc: sign up, model, animate, export, embed. The ' },
    { text: 'Notion workshop guide', link: WORKSHOP_GUIDE_URL },
    {
      text: ' is the document I used in the room — follow it if you want the same pacing and inspector numbers as the live session. For deeper Spline features, see ',
    },
    { text: 'Spline Tutorials', link: SPLINE_TUTORIALS_URL },
    {
      text: ' and the Discord community. The same workflow scales to product hero sections, configurators, and landing-page interactions — the rocket is just a friendly first ship.',
    },
  ]),
];

await client
  .patch(DOCUMENT_ID)
  .set({
    content,
    connectedPage: WORKSHOP_GUIDE_URL,
    seo: {
      title: 'Spline Workshop',
      description:
        'NoA Ignite Spline workshop: TL;DR, step-by-step rocket build, and link to the full Notion guide — model, animate, and embed interactive 3D in under 40 minutes without Three.js.',
    },
    tags: [
      { _type: 'reference', _ref: '27026017-4989-406f-b90e-42051f6a7c96', _key: 'tag-workshop' },
      { _type: 'reference', _ref: '5462d90f-b358-4754-b163-8f450e464f85', _key: 'tag-3d' },
      { _type: 'reference', _ref: 'f276ca21-f9ba-40e5-9231-9842d6d64137', _key: 'tag-work' },
      { _type: 'reference', _ref: 'e94ad9a6-540d-478b-ab91-95ca3371950f', _key: 'tag-html' },
    ],
  })
  .commit();

console.log('Updated Spline Workshop project content');
