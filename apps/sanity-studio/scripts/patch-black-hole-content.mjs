/**
 * Update 3D Black Hole project copy, SEO, tags, and live demo URL.
 * Run: node scripts/patch-black-hole-content.mjs
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.join(__dirname, '..');
const require = createRequire(path.join(studioRoot, 'package.json'));
const { createClient } = require('@sanity/client');
const { config } = require('dotenv');

config({ path: path.join(studioRoot, '.env.local'), quiet: true });
config({ path: path.join(studioRoot, '.env'), quiet: true });
config({ path: path.join(studioRoot, '../nextjs-portfolio/.env.local'), quiet: true });

const PROJECT_ID =
  process.env.SANITY_STUDIO_API_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET =
  process.env.SANITY_STUDIO_API_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production';

const DOCUMENT_ID = '037cce21-55e4-44be-beb1-17991a33f877';

const WORKSHOP_GUIDE_URL =
  'https://brunosimon.notion.site/Awwwards-2022-Workshop-Bruno-Simon-add300a6b00b42fb958ce3722666912c';
const THREEJS_JOURNEY_URL = 'https://threejs-journey.com/';
const BRUNO_REPO_URL = 'https://github.com/brunosimon/webgl-black-hole';

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
  paragraph('intro-1', [
    span(
      'intro-1-span',
      "During Bruno Simon's Awwwards Conference 2022 shader workshop in Amsterdam, I built this interactive black hole as a tribute to Interstellar's Gargantua — rendered entirely in the browser with Three.js and custom GLSL. No imported 3D models, no texture files, and no post-processing stack: just a handful of planes and spheres brought to life with shader code.",
    ),
  ]),
  paragraph('intro-2', [
    span(
      'intro-2-span',
      'The workshop was a crash course in writing your own shaders — the point where Three.js stops feeling like magic and starts feeling like graphics programming. The challenge was convincing GLSL: bending light around the event horizon, animating the accretion disk with procedural noise, and keeping the whole scene at 60fps in a normal browser tab.',
    ),
  ]),
  paragraph('intro-3', [
    span(
      'intro-3-span',
      'What stuck with me was how much atmosphere you can get from almost nothing. Drag to orbit the scene — the gravitational lensing looks different from every angle, which is half the fun. It is still one of the projects I am most proud of, and the reason I kept going deeper into WebGL.',
    ),
  ]),

  heading('my-changes-heading', 'What I changed from the workshop'),

  paragraph('my-changes-intro', [
    span(
      'my-changes-intro-span',
      'The workshop gives you a working baseline. I kept the same geometry and shader architecture, but pushed the look toward a warmer Interstellar palette and cranked lensing until the starfield felt like it was bending around the horizon.',
    ),
  ]),

  bullet(
    'my-changes-1',
    'Accretion disk: warmer orange-red colour ramp and faster UV scroll so the disk feels hotter and more turbulent.',
  ),
  bullet(
    'my-changes-2',
    'Gravitational lensing: stronger distortion near the event horizon — the bend reads differently as you orbit.',
  ),
  bullet(
    'my-changes-3',
    'Starfield: denser background stars with slightly higher contrast so the lensing pop is visible from more angles.',
  ),
  bullet(
    'my-changes-4',
    'Performance pass: pixel ratio capped at 2 and shader uniforms tuned so it stays smooth on a laptop GPU.',
  ),

  heading('how-built-heading', 'How the demo was built'),

  linkedParagraph('how-built-intro', [
    { text: 'I followed Bruno Simon’s ' },
    { text: 'Awwwards 2022 workshop guide', link: WORKSHOP_GUIDE_URL },
    {
      text: ', which walks through the scene step by step — from an empty Three.js project to a finished black hole with a glowing accretion disk and bent starlight. Bruno also maintains a public reference repo (',
    },
    { text: 'webgl-black-hole', link: BRUNO_REPO_URL },
    {
      text: ') that is useful to compare against once you have finished the workshop steps.',
    },
  ]),

  linkedParagraph('how-built-journey', [
    {
      text: 'If you want the full foundations behind the workshop — scene graph, cameras, renderers, materials, and a deep dive into shader math — ',
    },
    { text: 'Three.js Journey', link: THREEJS_JOURNEY_URL },
    {
      text: ' is Bruno’s course. The shaders chapter is where this project really starts to make sense: uniforms, varyings, noise functions, and writing fragment logic that Three.js materials cannot give you out of the box.',
    },
  ]),

  heading('setup-heading', '1. Project setup', 'h3'),

  paragraph('setup-body', [
    span(
      'setup-body-span',
      'The workshop starter is a small Vite + Three.js project. Clone or download the starter from the guide, install dependencies once, then run the dev server. The scene will be available on localhost (typically port 8080) and rebuilds as you edit the shader files.',
    ),
  ]),

  codeBlock(
    'setup-code',
    'bash',
    `# Install dependencies (first time only)
npm install

# Run the local dev server
npm run dev

# Build for production (outputs to dist/)
npm run build`,
    'terminal',
  ),

  heading('scene-heading', '2. Scene, camera, and controls', 'h3'),

  paragraph('scene-body', [
    span(
      'scene-body-span',
      'Before touching shaders, the guide sets up the basic Three.js loop: a WebGL renderer sized to the viewport, a perspective camera placed back from the origin, and a requestAnimationFrame tick that renders every frame. OrbitControls are added so you can drag to inspect the scene — essential when tuning lensing by eye.',
    ),
  ]),

  bullet(
    'scene-1',
    'Create a PerspectiveCamera and position it so the black hole sits near the centre of the frame.',
  ),
  bullet(
    'scene-2',
    'Attach a WebGLRenderer to the page and handle window resize so the canvas stays full-screen.',
  ),
  bullet(
    'scene-3',
    'Add OrbitControls with damping enabled — the slow settle after dragging makes the lensing effect easier to appreciate.',
  ),
  bullet(
    'scene-4',
    'Drive uTime (or equivalent) from the animation loop so shaders can animate the accretion disk over time.',
  ),

  codeBlock(
    'scene-code',
    'javascript',
    `import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 2, 6)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const timer = new THREE.Timer()

function tick(timestamp) {
  timer.update(timestamp)
  const elapsedTime = timer.getElapsed()
  // Pass elapsedTime into shader uniforms here
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

requestAnimationFrame(tick)`,
    'main.js',
  ),

  heading('shaders-heading', '3. Custom shaders and the black hole look', 'h3'),

  paragraph('shaders-body', [
    span(
      'shaders-body-span',
      'The visual trick is to stop using MeshBasicMaterial or MeshStandardMaterial. Instead, attach a ShaderMaterial to a sphere (the event horizon) and a plane (the accretion disk). The vertex shader mostly passes UVs and world positions through; the fragment shader does the heavy lifting — colour, glow, noise, and lensing distortion.',
    ),
  ]),

  bullet(
    'shaders-1',
    'Event horizon: a dark sphere with a shader that absorbs light and creates a hard falloff at the edge.',
  ),
  bullet(
    'shaders-2',
    'Accretion disk: a flat plane (or slightly warped geometry) with procedural noise scrolling over UVs to simulate swirling hot gas.',
  ),
  bullet(
    'shaders-3',
    'Starfield: either a large inverted sphere or a particle field behind the black hole, sampled in the same fragment pass.',
  ),
  bullet(
    'shaders-4',
    'Gravitational lensing: in the fragment shader, offset UV coordinates toward the black hole centre based on distance — closer pixels bend more, which sells the Interstellar look.',
  ),

  codeBlock(
    'material-code',
    'javascript',
    `const blackHoleMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
  transparent: true,
  depthWrite: false,
})

const blackHole = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), blackHoleMaterial)
scene.add(blackHole)`,
    'BlackHole.js',
  ),

  codeBlock(
    'glsl-code',
    'text',
    `// Fragment shader (simplified lensing idea)
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 center = vec2(0.5);
  vec2 dir = vUv - center;
  float dist = length(dir);

  // Pull UVs toward the centre — stronger when closer
  float strength = 0.08 / (dist * dist + 0.02);
  vec2 lensedUv = vUv - normalize(dir) * strength;

  // Sample noise / colour using lensedUv, animate with uTime
  vec3 colour = vec3(0.0);
  // ... disk noise, glow, star sampling ...

  gl_FragColor = vec4(colour, 1.0);
}`,
    'fragment.glsl',
  ),

  heading('tuning-heading', '4. Tuning, performance, and deploy', 'h3'),

  paragraph('tuning-body', [
    span(
      'tuning-body-span',
      'The workshop ends with polish: adjusting colour grading on the disk, clamping pixel ratio on high-DPI screens, and checking frame rate on a laptop GPU. Once you are happy with the look, npm run build bundles the project for static hosting — which is how the live demo above is deployed on Vercel.',
    ),
  ]),

  bullet(
    'tuning-1',
    'Keep geometry simple — a subdivided sphere and one or two planes are enough. Complexity lives in the shader, not the mesh count.',
  ),
  bullet('tuning-2', 'Cap devicePixelRatio at 2 to avoid burning GPU on retina displays.'),
  bullet(
    'tuning-3',
    'Iterate on uniform values (lensing strength, disk speed, colour ramps) while orbiting — small GLSL tweaks change the mood dramatically.',
  ),
  bullet(
    'tuning-4',
    'Deploy the dist/ folder to any static host. The live demo runs as a self-contained WebGL page with no backend.',
  ),

  linkedParagraph('how-built-outro', [
    {
      text: 'My version above is my own take from that workshop session — same core technique, with extra experimentation on the disk colours and lensing strength. If you work through the ',
    },
    { text: 'workshop guide', link: WORKSHOP_GUIDE_URL },
    { text: ' and then continue with the shaders track on ' },
    { text: 'Three.js Journey', link: THREEJS_JOURNEY_URL },
    {
      text: ', you will have a solid path from this one-day demo to building shader-driven experiences of your own.',
    },
  ]),
];

const patchPayload = {
  content,
  connectedPage: 'https://workshop-shaders.vercel.app/',
  summary: [
    paragraph('bh-s0', [
      span(
        'bh-s0-s',
        "Built at Bruno Simon's Awwwards 2022 shader workshop — an interactive black hole tribute to Interstellar's Gargantua, rendered in Three.js and custom GLSL with no imported models.",
      ),
    ]),
    paragraph('bh-s1', [
      span(
        'bh-s1-s',
        'Gravitational lensing, procedural accretion disk, 60fps in a browser tab. Still one of the projects I am most proud of — the reason I kept going deeper into WebGL.',
      ),
    ]),
  ],
  seo: {
    title: '3D Black Hole',
    description:
      "Interactive 3D black hole from Bruno Simon's Awwwards 2022 shader workshop — Three.js, GLSL, gravitational lensing, step-by-step build notes, and links to Three.js Journey.",
  },
  tags: [
    { _type: 'reference', _ref: 'f183c67b-f706-4442-8f6b-20a330c00b64', _key: 'tag-threejs' },
    { _type: 'reference', _ref: '65851e27-7ec4-4b54-b4c2-1d0602bc3fbb', _key: 'tag-javascript' },
  ],
};

if (process.argv.includes('--print-json')) {
  process.stdout.write(JSON.stringify(patchPayload));
  process.exit(0);
}

const WRITE_TOKEN =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_STUDIO_WRITE_TOKEN ||
  process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

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

await client.patch(DOCUMENT_ID).set(patchPayload).commit();

console.log('Updated 3D Black Hole project content');
