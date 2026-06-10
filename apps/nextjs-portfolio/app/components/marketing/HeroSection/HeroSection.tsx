'use client';

import type { HomePageQueryResult } from '@wisihe/sanity-queries';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { urlForImage } from '@/sanity/lib/utils';
import HeroArcadeWidget from './HeroArcadeWidget';
import HeroRetroLoader from './HeroRetroLoader';

type HeroImageSectionProps = {
  paintings?: NonNullable<HomePageQueryResult>['showcasePaintings'] | null;
  projects?: NonNullable<HomePageQueryResult>['showcaseProjects'] | null;
};

type Coord = { x: number; y: number };

const gridPatternStyle = {
  backgroundImage: `
    linear-gradient(to right, var(--color-border) 1px, transparent 1px),
    linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)
  `,
  backgroundSize: '60px 60px',
};

// Canvas texture style simulating fine painting paper
const canvasTextureStyle = {
  backgroundImage: `
    radial-gradient(var(--color-border) 1px, transparent 1px),
    linear-gradient(to right, rgba(0,0,0,0.015) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.015) 1px, transparent 1px)
  `,
  backgroundSize: '30px 30px, 6px 6px, 6px 6px',
};

// --- CURATED DESIGN & ART QUOTES ---
const QUOTES = [
  {
    text: 'The canvas is a playground for the mind, and code is the brush that paints it in real-time.',
    author: 'Henrik Sissener',
  },
  {
    text: 'Design is not just what it looks like and feels like. Design is how it works.',
    author: 'Steve Jobs',
  },
  {
    text: 'Every stroke of the brush and every line of code is a search for order and expression.',
    author: 'Henrik Sissener',
  },
  {
    text: 'Technology is the canvas of our age, and code is the raw medium we shape.',
    author: 'Anonymous',
  },
  {
    text: 'To create is to bridge the gap between abstract logical systems and physical sensory art.',
    author: 'Henrik Sissener',
  },
];

// --- LOCAL FALLBACK DATA (To guarantee a filled grid) ---
const FALLBACK_PAINTINGS = [
  {
    title: 'The Resonance of Code',
    slug: 'resonance-of-code',
    altText: 'Abstract code elements painted in heavy oil textures',
    image: null,
  },
  {
    title: 'Digital Horizon',
    slug: 'digital-horizon',
    altText: 'Vibrant pixelated sunset blending with oil medium',
    image: null,
  },
  {
    title: 'Glitched Canvas',
    slug: 'glitched-canvas',
    altText: 'Traditional portrait with digital neon scanlines',
    image: null,
  },
  {
    title: 'Intertwined Disciplines',
    slug: 'intertwined-disciplines',
    altText: 'Complex brushstrokes morphing into technical CAD outlines',
    image: null,
  },
];

const FALLBACK_PROJECTS = [
  {
    title: 'Canvas Shaders',
    name: 'Canvas Shaders',
    slug: 'canvas-shaders',
    description:
      'An interactive WebGL physics engine simulating wet paint diffusion on canvas paper using custom fragment shaders.',
    tags: [{ name: 'WebGL' }, { name: 'GLSL' }, { name: 'React' }],
    image: null,
  },
  {
    title: 'Unreal Art Gallery',
    name: 'Unreal Art Gallery',
    slug: 'unreal-art-gallery',
    description:
      'A 3D virtual exhibition space built in Unreal Engine 5, showcasing physical paintings with realistic ray-traced canvas lighting.',
    tags: [{ name: 'Unreal Engine' }, { name: 'C++' }, { name: 'DirectX 12' }],
    image: null,
  },
  {
    title: 'Shader Symphony',
    name: 'Shader Symphony',
    slug: 'shader-symphony',
    description:
      'Audio-reactive screen-space shaders that transform live ambient noises into flowing oil paint strokes.',
    tags: [{ name: 'GLSL' }, { name: 'Web Audio API' }, { name: 'Vite' }],
    image: null,
  },
];

// Get cell type based on coordinate modulo mapping in a larger 8x8 layout
const getCellType = (x: number, y: number) => {
  const mx = ((x % 8) + 8) % 8;
  const my = ((y % 8) + 8) % 8;

  const LAYOUT = [
    ['Q', 'P', 'D3', 'Pr', 'Q', 'B', 'D3', 'P'],
    ['Pr', 'H', 'Q', 'S', 'P', 'D3', 'Pr', 'H'],
    ['D3', 'G', 'P', 'Q', 'Pr', 'G', 'Q', 'B'],
    ['Q', 'Pr', 'D3', 'H', 'Q', 'P', 'S', 'Q'],
    ['P', 'B', 'S', 'Pr', 'P', 'Q', 'Pr', 'G'],
    ['Pr', 'Q', 'P', 'G', 'D3', 'H', 'Q', 'Pr'],
    ['Q', 'S', 'Pr', 'Q', 'B', 'Q', 'P', 'D3'],
    ['D3', 'P', 'Q', 'Pr', 'Q', 'S', 'G', 'H'],
  ];

  return LAYOUT[my]?.[mx] || 'D3';
};

const getCellLabel = (type: string) => {
  switch (type) {
    case 'H':
      return 'HUB';
    case 'P':
      return 'PAINTING';
    case 'Pr':
      return 'PROJECT';
    case 'G':
      return 'ARCADE';
    case 'B':
      return 'ABOUT';
    case 'S':
      return 'SKILLS';
    case 'D3':
      return 'WATERCOLOR';
    default:
      return 'QUOTE';
  }
};

// --- FANCY CINEMATIC FOCUS-PULL DEPTH-OF-FIELD CELL WRAPPER ---
function FocusPullWrapper({
  children,
  isActive,
  shouldReduceMotion,
}: {
  children: React.ReactNode;
  isActive: boolean;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.div
      animate={
        shouldReduceMotion
          ? { opacity: isActive ? 1.0 : 0.25, filter: 'blur(0px)', scale: 1.0 }
          : {
              opacity: isActive ? 1.0 : 0.35,
              filter: isActive ? 'blur(0px)' : 'blur(4px)',
              scale: isActive ? 1.0 : 0.94,
            }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1], // easeOutExpo
            }
      }
      className='w-full h-full overflow-hidden'
    >
      {children}
    </motion.div>
  );
}

// --- CURATED GRAPHIC CELLS ---

function QuoteCell({ gx, gy }: { gx: number; gy: number }) {
  const index = Math.abs(gx + gy) % QUOTES.length;
  const quote = QUOTES[index] || { text: '', author: '' };

  return (
    <div
      className='w-full h-full flex flex-col justify-between p-8 bg-background relative'
      style={canvasTextureStyle}
    >
      <div className='flex justify-between border-b border-border/40 pb-2 font-mono text-[9px] text-foreground-muted select-none'>
        <span>SECTOR: QUOTE_ARCHIVE</span>
        <span>{`(${gx}, ${gy})`}</span>
      </div>

      <div className='flex-1 flex flex-col justify-center max-w-sm mx-auto text-center gap-4 my-auto'>
        <p className='font-serif text-lg md:text-xl italic text-foreground leading-relaxed'>
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className='font-mono text-[10px] text-accent tracking-wider uppercase'>
          — {quote.author}
        </p>
      </div>

      <div className='font-mono text-[8px] text-foreground-muted flex justify-between border-t border-border/40 pt-2 select-none'>
        <span>REF_STREAM: PERSISTED</span>
        <span>OK</span>
      </div>
    </div>
  );
}

// Organic Watercolor Morphing Blob Cell
function DummyWatercolorCell({ gx, gy, isActive }: { gx: number; gy: number; isActive: boolean }) {
  return (
    <div
      className='w-full h-full flex flex-col justify-between p-6 select-none relative overflow-hidden'
      style={canvasTextureStyle}
    >
      <div className='flex justify-between border-b border-border/40 pb-2 font-mono text-[10px] text-foreground-muted z-10'>
        <span>NODE_SYS: WATERCOLOR_MEDIUM</span>
        <span>{`(${gx}, ${gy})`}</span>
      </div>

      {/* Morphing paint blob */}
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
        <motion.div
          animate={
            isActive
              ? {
                  scale: [1, 1.2, 0.85, 1],
                  borderRadius: [
                    '42% 58% 70% 30% / 45% 45% 55% 55%',
                    '70% 30% 52% 48% / 60% 40% 60% 40%',
                    '42% 58% 70% 30% / 45% 45% 55% 55%',
                  ],
                  rotate: [0, 90, 180, 360],
                }
              : { scale: 0.8, rotate: 0 }
          }
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
          className='w-[45vw] h-[45vw] md:w-[25vw] md:h-[25vw] rounded-full filter blur-3xl opacity-25 bg-gradient-to-tr from-accent via-violet-500 to-emerald-400'
        />
      </div>

      <div className='z-10 font-mono text-[9px] text-foreground-muted flex justify-between border-t border-border/40 pt-2'>
        <span>BLENDING_PROCESS: ONGOING</span>
        <span className='animate-pulse text-accent'>MORPHING</span>
      </div>
    </div>
  );
}

// --- MAIN HERO CELL CONTENT COMPONENTS ---

function HubCell({ isActive }: { isActive: boolean }) {
  return (
    <div
      className='w-full h-full flex flex-col items-center justify-center p-6 bg-background'
      style={canvasTextureStyle}
    >
      <motion.div
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.5 }}
        className='max-w-xl text-center flex flex-col items-center gap-6 z-10'
      >
        <div className='border border-foreground/20 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-foreground-muted'>
          {'COORDINATES: (1, 1) // HUB'}
        </div>
        <h1 className='text-7xl md:text-9xl font-serif font-black tracking-tight text-foreground uppercase select-none leading-none'>
          Henrik
        </h1>
        <p className='font-mono text-sm md:text-base text-accent font-bold tracking-wider'>
          [ DESIGN ENGINEER | PAINTER | MAKER ]
        </p>
        <p className='text-foreground-subtle leading-relaxed text-sm md:text-base max-w-md'>
          I bridge traditional canvas painting with digital graphics. Explore my work, code
          blueprints, and interactive widgets in this infinite wrapping canvas.
        </p>
        <div className='flex flex-col items-center gap-2 mt-4 font-mono text-xs text-foreground-muted'>
          <span className='animate-pulse'>▲ ▼ ◄ ► NAVIGATE CANVAS</span>
        </div>
      </motion.div>
    </div>
  );
}

function BioCell({ isActive }: { isActive: boolean }) {
  return (
    <div
      className='w-full h-full flex flex-col items-center justify-center p-8 bg-background'
      style={canvasTextureStyle}
    >
      <motion.div
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.5 }}
        className='max-w-md text-left flex flex-col gap-4 border border-border/80 bg-surface/40 p-6 rounded relative'
      >
        <div className='font-mono text-[9px] uppercase tracking-wider text-accent border-b border-border/40 pb-2 flex justify-between'>
          <span>SECTOR: BIO_MANIFESTO</span>
          <span>{'02 // PHILOSOPHY'}</span>
        </div>
        <p className='font-serif text-lg italic text-foreground leading-relaxed'>
          &ldquo;I bridge the physical paint canvas with digital software, creating systems that act
          like brushstrokes and art that lives in the browser.&rdquo;
        </p>
        <p className='font-mono text-xs text-foreground-subtle leading-relaxed'>
          Henrik Sissener is a design engineer and painter from Norway. By day, he crafts
          high-performance web systems and interactive tools; by night, he works with traditional
          oil paints, acrylics, and GLSL shaders.
        </p>
        <div className='border-t border-border/40 pt-2 flex justify-between font-mono text-[8px] text-foreground-muted'>
          <span>NORWAY / EARTH</span>
          <span>EST. 1990</span>
        </div>
      </motion.div>
    </div>
  );
}

function SkillsCell({ isActive }: { isActive: boolean }) {
  return (
    <div
      className='w-full h-full flex flex-col justify-center p-8 bg-background relative'
      style={canvasTextureStyle}
    >
      <motion.div
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className='max-w-xl mx-auto w-full border-2 border-foreground bg-surface p-6 rounded shadow-xl font-mono text-xs'
      >
        <div className='flex justify-between items-center border-b-2 border-foreground pb-2 mb-4'>
          <span className='font-bold text-accent'>[TOOLKIT_COMPARATIVE]</span>
          <span className='text-[10px] text-foreground-muted'>CANVAS x CODE</span>
        </div>
        <div className='grid grid-cols-2 gap-6'>
          {/* Art Column */}
          <div className='border-r border-border/80 pr-4'>
            <h3 className='font-bold uppercase border-b border-border/60 pb-1 mb-2 text-foreground'>
              🎨 Fine Art
            </h3>
            <ul className='space-y-1.5 text-foreground-subtle text-[11px] list-none pl-0'>
              <li>• Oil Paintings</li>
              <li>• Acrylic Mediums</li>
              <li>• Charcoal Sketching</li>
              <li>• Color Chemistry</li>
              <li>• Canvas Texturing</li>
              <li>• Blending & Glazing</li>
            </ul>
          </div>
          {/* Tech Column */}
          <div className='pl-4'>
            <h3 className='font-bold uppercase border-b border-border/60 pb-1 mb-2 text-foreground'>
              💻 Software
            </h3>
            <ul className='space-y-1.5 text-foreground-subtle text-[11px] list-none pl-0'>
              <li>• React & Next.js</li>
              <li>• Svelte / Vite</li>
              <li>• WebGL / GLSL</li>
              <li>• TypeScript / JS</li>
              <li>• C++ / Unreal Engine</li>
              <li>• Headless CMS / Sanity</li>
            </ul>
          </div>
        </div>
        <div className='mt-4 pt-2 border-t border-border/40 text-[9px] text-foreground-muted text-center'>
          TRANSVERSING DISCIPLINES IN REAL-TIME
        </div>
      </motion.div>
    </div>
  );
}

// Single Painting Museum Placard Frame Cell
function PaintingsCell({
  paintings,
  isActive,
  gx,
  gy,
}: {
  paintings: HeroImageSectionProps['paintings'];
  isActive: boolean;
  gx: number;
  gy: number;
}) {
  const list = paintings && paintings.length > 0 ? paintings : FALLBACK_PAINTINGS;
  const index = Math.abs(gx + gy) % list.length;
  const painting = list[index];

  if (!painting) {
    return (
      <div
        className='w-full h-full flex items-center justify-center bg-background'
        style={canvasTextureStyle}
      >
        <span className='font-mono text-xs opacity-50'>[ NO_PAINTINGS_FOUND ]</span>
      </div>
    );
  }

  const { image, altText, slug, title } = painting;
  const imageUrl = image
    ? urlForImage(image)?.width(800).height(600).auto('format').quality(85).url()
    : '';

  return (
    <div
      className='w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 p-8 bg-background'
      style={canvasTextureStyle}
    >
      <motion.div
        animate={isActive ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className='relative w-full max-w-[70vw] md:max-w-[40vw] aspect-[4/3] border-[6px] border-foreground p-3 bg-surface shadow-2xl origin-center flex-shrink-0'
      >
        {imageUrl ? (
          <div className='relative w-full h-full overflow-hidden bg-background'>
            <Image
              src={imageUrl}
              alt={altText || 'Painting'}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 70vw, 40vw'
            />
          </div>
        ) : (
          <div className='relative w-full h-full overflow-hidden bg-gradient-to-br from-orange-100 via-pink-100 to-indigo-100 dark:from-neutral-900 dark:via-purple-950 dark:to-neutral-950 flex items-center justify-center border border-border/40'>
            {/* Abstract vector brush decoration */}
            <svg className='w-1/2 h-1/2 opacity-20 text-accent animate-pulse' viewBox='0 0 100 100'>
              <title>Brush stroke line decoration</title>
              <path
                d='M 10 50 Q 30 20, 50 50 T 90 50'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              />
            </svg>
            <div className='absolute bottom-4 left-4 font-mono text-[8px] text-foreground-muted uppercase'>
              [ LOCAL_EXHIBITION_PREVIEW ]
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='flex flex-col justify-between max-w-xs p-5 border-l border-border/80 font-mono text-xs leading-relaxed self-center'
      >
        <div className='flex flex-col gap-2'>
          <div className='text-[9px] text-foreground-muted uppercase tracking-wider'>
            {`CANVAS_SECTOR: P_${index}`}
          </div>
          <h2 className='text-lg font-serif font-bold italic text-foreground tracking-tight leading-snug'>
            {title}
          </h2>
          <hr className='border-border/60 my-1.5' />
          <p className='text-[10px] text-foreground-muted'>Fine art painting catalog item.</p>
        </div>
        {slug && (
          <div className='mt-6'>
            <Link
              href={`/paintings/${slug}`}
              className='inline-flex items-center gap-1 border border-foreground/30 px-3 py-1 hover:border-accent hover:text-accent transition-colors font-bold'
            >
              {'[ VIEW DETAILS ]'}
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Single Project Viewport Card Cell
function ProjectsCell({
  projects,
  isActive,
  gx,
  gy,
}: {
  projects: HeroImageSectionProps['projects'];
  isActive: boolean;
  gx: number;
  gy: number;
}) {
  const list = projects && projects.length > 0 ? projects : FALLBACK_PROJECTS;
  const index = Math.abs(gx * gy) % list.length;
  const project = list[index];

  if (!project) {
    return (
      <div
        className='w-full h-full flex items-center justify-center bg-background'
        style={canvasTextureStyle}
      >
        <span className='font-mono text-xs opacity-50'>[ NO_PROJECTS_FOUND ]</span>
      </div>
    );
  }

  const heading = project.title || project.name || 'Project';
  const tags = project.tags
    ?.slice(0, 3)
    .map(t => t?.name)
    .filter(Boolean);
  const imageUrl = project.image
    ? urlForImage(project.image)?.width(800).height(480).quality(85).url()
    : null;

  return (
    <div
      className='w-full h-full flex flex-col lg:flex-row items-center justify-center gap-8 p-8 bg-background'
      style={canvasTextureStyle}
    >
      {/* Mock Browser Frame */}
      <motion.div
        animate={isActive ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className='relative w-full max-w-[80vw] lg:max-w-[45vw] border-4 border-foreground bg-surface rounded shadow-2xl flex flex-col overflow-hidden flex-shrink-0'
      >
        <div className='border-b-4 border-foreground bg-surface-elevated px-3 py-1.5 flex items-center justify-between font-mono text-[9px] text-foreground-muted'>
          <div className='flex gap-1'>
            <span className='w-1.5 h-1.5 bg-foreground rounded-full' />
            <span className='w-1.5 h-1.5 bg-foreground rounded-full' />
            <span className='w-1.5 h-1.5 bg-foreground rounded-full' />
          </div>
          <div className='bg-surface border border-foreground/30 px-3 py-0.5 rounded truncate max-w-[200px] select-none text-[8px]'>
            {`wisihe.no/projects/${project.slug}`}
          </div>
          <div className='w-3' />
        </div>
        {imageUrl ? (
          <div className='relative w-full aspect-[16/10] bg-background'>
            <Image
              src={imageUrl}
              alt={heading}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 80vw, 45vw'
            />
          </div>
        ) : (
          <div className='relative w-full aspect-[16/10] bg-gradient-to-tr from-amber-50/50 to-indigo-50/50 dark:from-neutral-900 dark:to-neutral-950 flex flex-col items-center justify-center font-mono text-xs text-foreground-muted gap-2 border border-border/20 overflow-hidden'>
            <svg
              className='w-12 h-12 opacity-25 text-foreground animate-spin'
              style={{ animationDuration: '20s' }}
              viewBox='0 0 100 100'
            >
              <title>Loading wireframe decoration</title>
              <circle
                cx='50'
                cy='50'
                r='30'
                fill='none'
                stroke='currentColor'
                strokeWidth='1'
                strokeDasharray='10 5'
              />
            </svg>
            <span className='text-[9px] tracking-widest opacity-60'>[ MOCK_ENGINE_ACTIVE ]</span>
          </div>
        )}
      </motion.div>

      {/* Case Study Metadata */}
      <motion.div
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='flex flex-col justify-between max-w-xs p-5 border-l border-border/80 font-mono text-xs leading-relaxed self-center'
      >
        <div className='flex flex-col gap-2'>
          <div className='text-[9px] text-foreground-muted uppercase tracking-wider'>
            {`PROJECT_SECTOR: PR_${index}`}
          </div>
          <h2 className='text-lg font-bold text-foreground tracking-tight leading-snug truncate'>
            {heading}
          </h2>
          <hr className='border-border/60 my-1.5' />
          <p className='text-[10px] text-foreground-subtle line-clamp-3'>
            {project.description || 'Detailed software case study.'}
          </p>
          <div className='flex flex-wrap gap-1.5 mt-2 text-[8px] text-foreground-muted'>
            {tags?.map(t => (
              <span key={t}>{`[${t}]`}</span>
            ))}
          </div>
        </div>
        {project.slug && (
          <div className='mt-6'>
            <Link
              href={`/projects/${project.slug}`}
              className='inline-flex items-center gap-1 border border-foreground/30 px-3 py-1 hover:border-accent hover:text-accent transition-colors font-bold'
            >
              {'[ CASE STUDY ]'}
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function ArcadeCell() {
  return (
    <div
      className='w-full h-full flex flex-col justify-between p-8 bg-background'
      style={canvasTextureStyle}
    >
      <div className='flex justify-between items-center border-b border-border pb-4 font-mono'>
        <span className='text-sm font-bold'>{'[04 // ARCADE_OUTPOST]'}</span>
        <span className='text-xs text-foreground-muted'>GAME_DEV</span>
      </div>

      <div className='flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 my-6 overflow-hidden'>
        <div className='lg:col-span-2 border-2 border-border relative overflow-hidden h-full rounded bg-neutral-950'>
          <HeroArcadeWidget />
        </div>
        <div className='flex flex-col justify-between p-6 border-2 border-border bg-surface font-mono text-xs leading-relaxed'>
          <div className='flex flex-col gap-3'>
            <div className='text-accent font-bold uppercase tracking-wider'>
              MODULE: GAME_DEV_SYS
            </div>
            <hr className='border-border' />
            <p>
              I design games and interactive environments focusing on rigid-body physics,
              screen-space shaders, and particle layouts.
            </p>
            <p>
              Hover over the canvas to interact with the grid sprites. The particles react to cursor
              magnetism with spring physics.
            </p>
          </div>
          <div className='flex flex-col gap-1 text-foreground-muted'>
            <div>ENGINE: UNREAL / CANVAS</div>
            <div>LANGUAGE: C++ / TS</div>
            <div>SHADERS: GLSL</div>
          </div>
        </div>
      </div>
      <div className='h-4' />
    </div>
  );
}

// --- MAIN PORTAL GRID WRAPPER ---

export default function HeroImageSection({ paintings, projects }: HeroImageSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = !!(mounted && prefersReducedMotion);

  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState<Coord>({ x: 1, y: 1 });
  const [scale, setScale] = useState(1);
  const [autoplay, setAutoplay] = useState(true);
  const containerRef = useRef<HTMLElement>(null);

  // Scroll hooks for exit parallax
  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scrollScale = useTransform(scrollY, [0, 600], [1, shouldReduceMotion ? 1.0 : 0.88]);
  const scrollYOffset = useTransform(scrollY, [0, 600], [0, shouldReduceMotion ? 0 : -100]);

  const renderCellContent = (type: string, isActive: boolean, gx: number, gy: number) => {
    let content: React.ReactNode;
    switch (type) {
      case 'H':
        content = <HubCell isActive={isActive} />;
        break;
      case 'P':
        content = <PaintingsCell paintings={paintings} isActive={isActive} gx={gx} gy={gy} />;
        break;
      case 'Pr':
        content = <ProjectsCell projects={projects} isActive={isActive} gx={gx} gy={gy} />;
        break;
      case 'G':
        content = <ArcadeCell />;
        break;
      case 'B':
        content = <BioCell isActive={isActive} />;
        break;
      case 'S':
        content = <SkillsCell isActive={isActive} />;
        break;
      case 'Q':
        content = <QuoteCell gx={gx} gy={gy} />;
        break;
      default:
        content = <DummyWatercolorCell gx={gx} gy={gy} isActive={isActive} />;
        break;
    }

    return (
      <FocusPullWrapper isActive={isActive} shouldReduceMotion={shouldReduceMotion}>
        {content}
      </FocusPullWrapper>
    );
  };

  const coordsRef = useRef(coords);
  useEffect(() => {
    coordsRef.current = coords;
  }, [coords]);

  const stopAutoplayAndNavigate = useCallback((target: Coord) => {
    setAutoplay(false);
    setScale(1.0);
    setCoords(target);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wisihe_hero_tour_played', 'true');
    }
  }, []);

  const handleUserNavigate = useCallback(
    (target: Coord) => {
      stopAutoplayAndNavigate(target);
    },
    [stopAutoplayAndNavigate],
  );

  const handleScrollDown = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
      stopAutoplayAndNavigate({ x: 1, y: 1 });
    }
  };

  // Load persistence (play-once) and mount status
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const hasPlayed = localStorage.getItem('wisihe_hero_tour_played');
      if (hasPlayed) {
        setAutoplay(false);
        setCoords({ x: 1, y: 1 });
      }
    }
  }, []);

  // Accessibility: disable animations and panning if motion sensitivity is true
  useEffect(() => {
    if (shouldReduceMotion) {
      setAutoplay(false);
      setScale(1.0);
    }
  }, [shouldReduceMotion]);

  // Autoplay sequencer tour loop (continuous swoosh)
  useEffect(() => {
    if (!autoplay || shouldReduceMotion) {
      setScale(1.0);
      return;
    }

    let active = true;
    let step = 0;

    // 16-step winding organic coordinate path
    const PATH: Coord[] = [
      { x: 1, y: 1 }, // Hub (H)
      { x: 1, y: 0 }, // Paintings (P)
      { x: 2, y: 0 }, // Watercolor (D3)
      { x: 3, y: 0 }, // Projects (Pr)
      { x: 3, y: 1 }, // Skills (S)
      { x: 4, y: 1 }, // Paintings (P)
      { x: 5, y: 1 }, // Watercolor (D3)
      { x: 5, y: 2 }, // Arcade (G)
      { x: 5, y: 3 }, // Paintings (P)
      { x: 4, y: 4 }, // Paintings (P)
      { x: 3, y: 4 }, // Projects (Pr)
      { x: 2, y: 4 }, // Skills (S)
      { x: 1, y: 4 }, // Bio (B)
      { x: 1, y: 3 }, // Projects (Pr)
      { x: 0, y: 2 }, // Watercolor (D3)
      { x: 1, y: 2 }, // Arcade (G)
    ];

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const runTour = async () => {
      const currentIdx = PATH.findIndex(
        c => c.x === coordsRef.current.x && c.y === coordsRef.current.y,
      );
      step = currentIdx !== -1 ? currentIdx : 0;

      while (active) {
        // Wait zoomed in (focal time: 4.5 seconds)
        await delay(4500);
        if (!active) break;

        // Swoosh out & pan at the same time (pull further out to reveal more of the grid!)
        setScale(0.24);
        step = (step + 1) % PATH.length;
        const target = PATH[step];
        if (target) {
          setCoords(target);
        }
        await delay(550); // Snappy glide zoom out/pan
        if (!active) break;

        // Swoosh back in
        setScale(1.0);
        await delay(550); // Snappy settle zoom in
      }
    };

    runTour();

    return () => {
      active = false;
    };
  }, [autoplay, shouldReduceMotion]);

  // Keyboard navigation overrides WASD & Arrows
  useEffect(() => {
    if (loading) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      let nextCoords: Coord | null = null;

      if (e.key === 'ArrowUp' || key === 'w') {
        nextCoords = { x: coords.x, y: coords.y - 1 };
      } else if (e.key === 'ArrowDown' || key === 's') {
        nextCoords = { x: coords.x, y: coords.y + 1 };
      } else if (e.key === 'ArrowLeft' || key === 'a') {
        nextCoords = { x: coords.x - 1, y: coords.y };
      } else if (e.key === 'ArrowRight' || key === 'd') {
        nextCoords = { x: coords.x + 1, y: coords.y };
      }

      if (nextCoords) {
        handleUserNavigate(nextCoords);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, coords, handleUserNavigate]);

  // Touch swipe overrides for mobile
  useEffect(() => {
    if (loading) return;

    let touchStart = { x: 0, y: 0 };
    const handleTouchStart = (e: TouchEvent) => {
      touchStart = {
        x: e.touches[0]?.clientX || 0,
        y: e.touches[0]?.clientY || 0,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.x || !touchStart.y) return;
      const touchEnd = {
        x: e.changedTouches[0]?.clientX || 0,
        y: e.changedTouches[0]?.clientY || 0,
      };

      const dx = touchEnd.x - touchStart.x;
      const dy = touchEnd.y - touchStart.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (Math.max(absX, absY) > 50) {
        let nextCoords: Coord | null = null;
        if (absX > absY) {
          // Horizontal Swipe
          if (dx > 0) {
            nextCoords = { x: coords.x - 1, y: coords.y }; // Swipe Right
          } else {
            nextCoords = { x: coords.x + 1, y: coords.y }; // Swipe Left
          }
        } else {
          // Vertical Swipe
          if (dy > 0) {
            nextCoords = { x: coords.x, y: coords.y - 1 }; // Swipe Down
          } else {
            nextCoords = { x: coords.x, y: coords.y + 1 }; // Swipe Up
          }
        }

        if (nextCoords) {
          handleUserNavigate(nextCoords);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [loading, coords, handleUserNavigate]);

  // Infinite grid rendering: dynamic 7x7 render range window centered on current coordinates
  const ix = Math.round(coords.x);
  const iy = Math.round(coords.y);
  const rangeX = Array.from({ length: 7 }, (_, i) => ix - 3 + i);
  const rangeY = Array.from({ length: 7 }, (_, i) => iy - 3 + i);

  // local 3x3 cells for interactive scanner HUD map
  const localCells = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const gx = coords.x + dx;
      const gy = coords.y + dy;
      const type = getCellType(gx, gy);
      localCells.push({
        x: gx,
        y: gy,
        label: getCellLabel(type),
        abbr: type,
        active: dx === 0 && dy === 0,
      });
    }
  }

  return (
    <>
      <AnimatePresence>
        {loading && <HeroRetroLoader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <section
        ref={containerRef}
        className='relative w-full h-screen overflow-hidden bg-background select-none'
      >
        {/* Fine art canvas paper texture overlay */}
        <div
          className='absolute inset-0 pointer-events-none z-20 opacity-[0.06] mix-blend-overlay'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Outer Scroll-Parallax Exit Wrapper */}
        <motion.div
          style={{
            opacity: scrollOpacity,
            scale: scrollScale,
            y: scrollYOffset,
          }}
          className='w-full h-full relative'
        >
          {/* The Infinite Grid Canvas Container */}
          <motion.div
            animate={{
              x: `${-coords.x * 100}vw`,
              y: `${-coords.y * 100}vh`,
              scale: loading ? 0.15 : scale,
              opacity: loading ? 0 : 1,
              filter: loading ? 'blur(10px)' : 'blur(0px)',
              rotate: shouldReduceMotion || scale === 1.0 ? 0 : (coords.x - coords.y) * 2.5,
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    type: 'spring',
                    stiffness: 95, // Snappy spring camera (was 16)
                    damping: 20, // Snappy damping (was 22)
                    mass: 1.0, // Snappy mass (was 1.4)
                  }
            }
            className='absolute top-0 left-0 w-[300vw] h-[300vh]'
            style={{
              ...gridPatternStyle,
              transformOrigin: `${coords.x * 100 + 50}vw ${coords.y * 100 + 50}vh`,
            }}
          >
            {/* Dynamic 7x7 Cellular Rendering Grid */}
            {rangeY.map(gy =>
              rangeX.map(gx => {
                const cellType = getCellType(gx, gy);
                const isActive = coords.x === gx && coords.y === gy;
                return (
                  <div
                    key={`${gx}-${gy}`}
                    className='absolute border-[3px] border-border bg-background overflow-hidden'
                    style={{
                      left: `${gx * 100}vw`,
                      top: `${gy * 100}vh`,
                      width: '100vw',
                      height: '100vh',
                    }}
                  >
                    {renderCellContent(cellType, isActive, gx, gy)}
                  </div>
                );
              }),
            )}
          </motion.div>
        </motion.div>

        {/* ==================== PERSISTENT HUD OVERLAYS ==================== */}
        {!loading && (
          <>
            {/* 1. Skip / Autoplay Status Controller (Top Center) */}
            <div className='absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col sm:flex-row items-center gap-3 bg-background/90 border-2 border-border p-4 font-mono text-xs shadow-2xl rounded'>
              <div className='flex items-center gap-2'>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    autoplay ? 'bg-accent animate-pulse' : 'bg-foreground-muted'
                  }`}
                />
                <span className='font-bold tracking-widest text-[10px] text-foreground-subtle'>
                  {autoplay ? 'AUTO TOUR IN PROGRESS' : 'MANUAL CONTROL ENGAGED'}
                </span>
              </div>
              <div className='flex gap-2 text-[10px]'>
                {autoplay ? (
                  <button
                    type='button'
                    onClick={() => stopAutoplayAndNavigate({ x: 1, y: 1 })}
                    className='bg-accent text-accent-contrast border border-accent px-3 py-1 font-bold hover:bg-accent/90 transition-all cursor-pointer'
                  >
                    [ SKIP TOUR & ENTER ]
                  </button>
                ) : (
                  <button
                    type='button'
                    onClick={() => setAutoplay(true)}
                    className='border border-foreground/30 px-3 py-1 hover:border-accent hover:text-accent transition-all cursor-pointer'
                  >
                    [ START AUTO TOUR ]
                  </button>
                )}
              </div>
            </div>

            {/* 2. Manual Overlay Edge Arrows (Only in Manual Mode) */}
            {!autoplay && (
              <div className='absolute inset-0 pointer-events-none z-30'>
                {/* Up Arrow */}
                <button
                  type='button'
                  onClick={() => handleUserNavigate({ x: coords.x, y: coords.y - 1 })}
                  className='pointer-events-auto absolute top-36 left-1/2 -translate-x-1/2 bg-background/90 border-2 border-border px-4 py-2 font-mono text-[10px] text-foreground hover:border-accent hover:text-accent transition-all shadow-lg cursor-pointer'
                >
                  ▲ {getCellLabel(getCellType(coords.x, coords.y - 1))}
                </button>

                {/* Down Arrow */}
                <button
                  type='button'
                  onClick={() => handleUserNavigate({ x: coords.x, y: coords.y + 1 })}
                  className='pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2 bg-background/90 border-2 border-border px-4 py-2 font-mono text-[10px] text-foreground hover:border-accent hover:text-accent transition-all shadow-lg cursor-pointer'
                >
                  ▼ {getCellLabel(getCellType(coords.x, coords.y + 1))}
                </button>

                {/* Left Arrow */}
                <button
                  type='button'
                  onClick={() => handleUserNavigate({ x: coords.x - 1, y: coords.y })}
                  className='pointer-events-auto absolute left-6 top-1/2 -translate-y-1/2 bg-background/90 border-2 border-border px-4 py-2 font-mono text-[10px] text-foreground hover:border-accent hover:text-accent transition-all shadow-lg cursor-pointer'
                >
                  ◄ {getCellLabel(getCellType(coords.x - 1, coords.y))}
                </button>

                {/* Right Arrow */}
                <button
                  type='button'
                  onClick={() => handleUserNavigate({ x: coords.x + 1, y: coords.y })}
                  className='pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 bg-background/90 border-2 border-border px-4 py-2 font-mono text-[10px] text-foreground hover:border-accent hover:text-accent transition-all shadow-lg cursor-pointer'
                >
                  {getCellLabel(getCellType(coords.x + 1, coords.y))} ►
                </button>
              </div>
            )}

            {/* 3. Persistent HUD Minimap scanner */}
            <div className='absolute bottom-6 right-6 z-30 bg-background/90 border-2 border-border p-4 font-mono text-[9px] uppercase tracking-wider flex flex-col gap-2 shadow-2xl rounded'>
              <div className='flex justify-between items-center font-bold text-foreground-muted gap-4'>
                <span>RADAR SCAN v4.0</span>
                <span className='w-1.5 h-1.5 bg-accent rounded-full animate-ping' />
              </div>
              <hr className='border-border/60' />
              <div className='grid grid-cols-3 gap-1 w-24 h-24 mt-1 self-center'>
                {localCells.map((cell, idx) => (
                  <button
                    key={`${cell.x}-${cell.y}-${idx}`}
                    type='button'
                    onClick={() => handleUserNavigate({ x: cell.x, y: cell.y })}
                    className={`
                      border flex items-center justify-center font-mono font-bold select-none cursor-pointer transition-all duration-150 text-[9px] w-7 h-7 rounded
                      ${
                        cell.active
                          ? 'bg-accent text-accent-contrast border-accent shadow-md scale-105 shadow-accent/20'
                          : 'bg-surface border-border hover:bg-surface-hover hover:border-accent text-foreground-subtle'
                      }
                    `}
                    title={`Pan to (${cell.x}, ${cell.y}) - ${cell.label}`}
                  >
                    {cell.abbr}
                  </button>
                ))}
              </div>
              <div className='text-[8px] text-center text-foreground-muted mt-1'>
                COORD: ({coords.x}, {coords.y})
              </div>
            </div>

            {/* 4. Controls Guide HUD (Bottom-Left Corner) */}
            <div className='absolute bottom-6 left-6 z-30 bg-background/90 border-2 border-border px-3 py-2 font-mono text-[9px] text-foreground-muted flex gap-2 shadow-2xl rounded items-center'>
              <span>
                {autoplay
                  ? 'PRESS WASD/ARROWS OR SWIPE TO INTERACT'
                  : 'KEYS: WASD / ARROWS | MOUSE: CLICK RADAR SCAN'}
              </span>
            </div>

            {/* 5. Enter Portfolio Scroll Button (Bottom Center) */}
            <div className='absolute bottom-12 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center gap-1.5'>
              <button
                type='button'
                onClick={handleScrollDown}
                className='px-4 py-2 border border-foreground/30 bg-background/80 hover:border-accent hover:text-accent font-mono text-[10px] tracking-widest uppercase rounded shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2'
              >
                <span>ENTER PORTFOLIO</span>
                <span className='animate-bounce text-xs'>▼</span>
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
