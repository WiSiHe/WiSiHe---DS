'use client';

import type { HomePageQueryResult } from '@wisihe/sanity-queries';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { urlForImage } from '@/sanity/lib/utils';
import HeroArcadeWidget from './HeroArcadeWidget';
import HeroRetroLoader from './HeroRetroLoader';

const ThreeDScene = dynamic(() => import('../../three-d/BasicScene'), { ssr: false });

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

// --- CORE FOCUS TOPICS ---
const DEFAULT_FOCUS = {
  title: 'Web Development',
  description:
    'Crafting high-performance web systems, accessible interfaces, and fluid micro-animations with React, Next.js, and TypeScript.',
  tagline: 'PERFORMANCE x ACCESSIBILITY',
  category: 'WEB_DEV_SECTOR',
};

const FOCUS_AREAS = [
  DEFAULT_FOCUS,
  {
    title: 'Game Development',
    description:
      'Designing custom 2D/3D visual environments, canvas physics engines, custom shaders, and gameplay logic in Unreal Engine.',
    tagline: 'INTERACTIVE x GRAPHICS_PHYSICS',
    category: 'GAME_DEV_SECTOR',
  },
  {
    title: 'Paintings & Drawings',
    description:
      'Blending traditional physical mediums like oil paint and charcoal with digital art techniques to translate texture to the web.',
    tagline: 'CANVAS_TEXTURE x FINE_ART',
    category: 'ART_SECTOR',
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
    ['Q', 'MP', 'D3', 'MPr', 'Q', 'B', 'D3', 'P'],
    ['Pr', 'H', 'MPr', 'T', 'P', 'D3', 'Pr', 'H'],
    ['D3', 'G', 'P', 'Q', 'MPr', 'G', 'Q', 'B'],
    ['Q', 'MPr', 'D3', 'H', 'Q', 'MP', 'T', 'Q'],
    ['P', 'B', 'T', 'Pr', 'P', 'Q', 'MPr', 'G'],
    ['MPr', 'Q', 'MP', 'G', 'D3', 'H', 'Q', 'Pr'],
    ['Q', 'T', 'Pr', 'Q', 'B', 'Q', 'P', 'D3'],
    ['D3', 'MP', 'Q', 'MPr', 'Q', 'T', 'G', 'H'],
  ];

  return LAYOUT[my]?.[mx] || 'D3';
};

const getCellLabel = (type: string) => {
  switch (type) {
    case 'H':
      return 'HUB';
    case 'P':
      return 'PAINTING';
    case 'MP':
      return 'PAINTINGS';
    case 'Pr':
      return 'PROJECT';
    case 'MPr':
      return 'PROJECTS';
    case 'G':
      return 'ARCADE';
    case 'B':
      return 'ABOUT';
    case 'T':
      return '3D SCENE';
    case 'D3':
      return 'WATERCOLOR';
    default:
      return 'FOCUS';
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

function FocusCell({ gx, gy }: { gx: number; gy: number }) {
  const index = Math.abs(gx + gy) % FOCUS_AREAS.length;
  const area = FOCUS_AREAS[index] ?? DEFAULT_FOCUS;

  return (
    <div
      className='w-full h-full flex flex-col justify-between p-8 bg-background relative'
      style={canvasTextureStyle}
    >
      <div className='flex justify-between border-b border-border/40 pb-2 font-mono text-[9px] text-foreground-muted select-none'>
        <span>SECTOR: {area.category}</span>
        <span>{`(${gx}, ${gy})`}</span>
      </div>

      <div className='flex-1 flex flex-col justify-center max-w-sm mx-auto text-left gap-4 my-auto'>
        <div className='font-mono text-[9px] text-accent tracking-wider uppercase'>
          {`// ${area.tagline}`}
        </div>
        <h2 className='text-2xl font-serif font-black uppercase text-foreground leading-none tracking-tight'>
          {area.title}
        </h2>
        <p className='font-mono text-[10px] md:text-xs text-foreground-subtle leading-relaxed'>
          {area.description}
        </p>
      </div>

      <div className='font-mono text-[8px] text-foreground-muted flex justify-between border-t border-border/40 pt-2 select-none'>
        <span>DISCIPLINE_STREAM</span>
        <span>ACTIVE</span>
      </div>
    </div>
  );
}

// Pixelated grid wipe transition overlay
function PixelWipe({ triggerKey }: { triggerKey: string }) {
  const cols = 10;
  const rows = 8;
  const totalCells = cols * rows;

  return (
    <div className='absolute inset-0 z-40 grid grid-cols-10 grid-rows-8 pointer-events-none overflow-hidden'>
      <AnimatePresence mode='popLayout'>
        <motion.div key={triggerKey} className='absolute inset-0 grid grid-cols-10 grid-rows-8'>
          {Array.from({ length: totalCells }).map((_, i) => {
            const x = i % cols;
            const y = Math.floor(i / cols);
            // Stagger delay based on diagonal distance from top-left to bottom-right
            const delay = (x + y) * 0.018;

            return (
              <motion.div
                key={`${x}-${y}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 1, 0],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 0.42,
                  times: [0, 0.25, 0.75, 1],
                  delay,
                  ease: 'easeInOut',
                }}
                className='bg-background border-[0.5px] border-border/10 shadow-inner'
                style={{
                  gridColumnStart: x + 1,
                  gridRowStart: y + 1,
                }}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
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

// Interactive 3D distorted sphere canvas cell (ThreeJS Fiber)
function ThreeJSCell({ isActive }: { isActive: boolean }) {
  return (
    <div
      className='w-full h-full flex flex-col justify-between p-6 select-none relative overflow-hidden bg-background'
      style={canvasTextureStyle}
    >
      <div className='flex justify-between border-b border-border/40 pb-2 font-mono text-[10px] text-foreground-muted z-10'>
        <span>NODE_SYS: THREEJS_3D_SCENE</span>
        <span>ACTIVE</span>
      </div>

      <div className='absolute inset-0 flex items-center justify-center p-4 z-0'>
        {isActive && <ThreeDScene />}
      </div>

      <div className='z-10 font-mono text-[9px] text-foreground-muted flex justify-between border-t border-border/40 pt-2'>
        <span>RENDER_TARGET: CANVAS</span>
        <span className='animate-pulse text-accent'>3D_SHADERS</span>
      </div>
    </div>
  );
}

// Auto cross-fading Paintings slideshow cell
function MultiPaintingsCell({
  paintings,
  isActive,
}: {
  paintings: HeroImageSectionProps['paintings'];
  isActive: boolean;
}) {
  const list = paintings && paintings.length > 0 ? paintings : FALLBACK_PAINTINGS;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % list.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isActive, list.length]);

  const painting = list[currentIndex];
  if (!painting) return null;

  const imageUrl = painting.image
    ? urlForImage(painting.image)?.width(800).height(600).auto('format').quality(85).url()
    : '';

  return (
    <div
      className='w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 p-8 bg-background relative'
      style={canvasTextureStyle}
    >
      <div className='absolute top-6 left-6 font-mono text-[9px] text-foreground-muted uppercase z-10'>
        <span>EXHIBIT_DECK: MULTI_PAINTINGS</span>
      </div>

      <div className='relative w-full max-w-[70vw] md:max-w-[40vw] aspect-[4/3] border-[6px] border-foreground p-3 bg-surface shadow-2xl origin-center flex-shrink-0'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className='w-full h-full relative overflow-hidden bg-background'
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={painting.altText || 'Painting'}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 70vw, 40vw'
              />
            ) : (
              <div className='relative w-full h-full overflow-hidden bg-gradient-to-br from-orange-100 via-pink-100 to-indigo-100 dark:from-neutral-900 dark:via-purple-950 dark:to-neutral-950 flex items-center justify-center border border-border/40'>
                <svg
                  className='w-1/2 h-1/2 opacity-20 text-accent animate-pulse'
                  viewBox='0 0 100 100'
                >
                  <title>Brush stroke line decoration</title>
                  <path
                    d='M 10 50 Q 30 20, 50 50 T 90 50'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                  />
                </svg>
                <div className='absolute bottom-4 left-4 font-mono text-[8px] text-foreground-muted uppercase'>
                  [ {painting.title} ]
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className='flex flex-col justify-between max-w-xs p-5 border-l border-border/80 font-mono text-xs leading-relaxed self-center min-h-[150px]'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className='flex flex-col gap-2'
          >
            <div className='text-[9px] text-foreground-muted uppercase tracking-wider'>
              {`COLLECTION_INDEX: ${currentIndex + 1} / ${list.length}`}
            </div>
            <h2 className='text-lg font-serif font-bold italic text-foreground tracking-tight leading-snug'>
              {painting.title}
            </h2>
            <hr className='border-border/60 my-1.5' />
            <p className='text-[10px] text-foreground-muted'>
              {painting.altText || 'Part of the fine art showcase collection.'}
            </p>
            {painting.slug && (
              <div className='mt-4'>
                <Link
                  href={`/paintings/${painting.slug}`}
                  className='inline-flex items-center gap-1 border border-foreground/30 px-3 py-1 hover:border-accent hover:text-accent transition-colors font-bold'
                >
                  {'[ VIEW PAINTING ]'}
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Side-by-side Showcase Projects cell
function MultiProjectsCell({
  projects,
  isActive,
}: {
  projects: HeroImageSectionProps['projects'];
  isActive: boolean;
}) {
  const list = projects && projects.length > 0 ? projects : FALLBACK_PROJECTS;
  const proj1 = list[0];
  const proj2 = list[1] || list[0];

  return (
    <div
      className='w-full h-full flex flex-col justify-between p-8 bg-background'
      style={canvasTextureStyle}
    >
      <div className='flex justify-between items-center border-b border-border pb-2 font-mono text-[10px] text-foreground-muted'>
        <span>PROJECTS_OVERVIEW: MULTI_GRID</span>
        <span>ACTIVE</span>
      </div>

      <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center my-auto'>
        {[proj1, proj2].map((proj, idx) => {
          if (!proj) return null;
          const heading = proj.title || proj.name || 'Project';
          const tags = proj.tags
            ?.slice(0, 2)
            .map(t => t?.name)
            .filter(Boolean);
          const imageUrl = proj.image
            ? urlForImage(proj.image)?.width(400).height(240).quality(85).url()
            : null;

          return (
            <motion.div
              key={`${proj.slug}-${idx}`}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className='border-2 border-foreground bg-surface rounded shadow-lg flex flex-col overflow-hidden max-w-sm mx-auto w-full'
            >
              <div className='border-b-2 border-foreground bg-surface-elevated px-2 py-1 flex items-center justify-between font-mono text-[8px] text-foreground-muted select-none'>
                <div className='flex gap-0.5'>
                  <span className='w-1 h-1 bg-foreground rounded-full' />
                  <span className='w-1 h-1 bg-foreground rounded-full' />
                  <span className='w-1 h-1 bg-foreground rounded-full' />
                </div>
                <div className='bg-surface border border-foreground/30 px-1.5 py-0.2 rounded truncate max-w-[120px]'>
                  {`wisihe.no/${proj.slug}`}
                </div>
              </div>

              {imageUrl ? (
                <div className='relative w-full aspect-[16/9] bg-background'>
                  <Image
                    src={imageUrl}
                    alt={heading}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, 25vw'
                  />
                </div>
              ) : (
                <div className='w-full aspect-[16/9] bg-gradient-to-tr from-amber-50/50 to-indigo-50/50 dark:from-neutral-900 dark:to-neutral-950 flex flex-col items-center justify-center font-mono text-[9px] text-foreground-muted gap-1 border-b border-border/20'>
                  <span>[ PREVIEW_ACTIVE ]</span>
                </div>
              )}

              <div className='p-3 flex flex-col justify-between font-mono text-[10px] leading-snug flex-1 bg-background'>
                <div>
                  <h3 className='font-bold text-foreground truncate'>{heading}</h3>
                  <p className='text-[9px] text-foreground-subtle line-clamp-2 mt-1'>
                    {proj.description || 'Software case study.'}
                  </p>
                </div>
                <div className='flex justify-between items-center mt-3 pt-1 border-t border-border/40'>
                  <div className='flex gap-1 text-[8px] text-foreground-muted'>
                    {tags?.map(t => (
                      <span key={t}>{`[${t}]`}</span>
                    ))}
                  </div>
                  {proj.slug && (
                    <Link
                      href={`/projects/${proj.slug}`}
                      className='text-accent hover:underline font-bold text-[8px]'
                    >
                      {'[ DETAIL ]'}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className='font-mono text-[9px] text-foreground-muted flex justify-between border-t border-border/40 pt-2'>
        <span>SHOWCASE: DUAL_GRID</span>
        <span>TOTAL: {list.length}</span>
      </div>
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
              Play 'Catch the Paint Pixels'! Catch falling paint droplets with the paddle to
              splatter color onto the canvas background and score points. Use mouse moves, touch, or
              left/right arrows to steer.
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
  const isDev = process.env.NODE_ENV === 'development';

  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState<Coord>({ x: 1, y: 1 });
  const [scale, setScale] = useState(1);
  const [autoplay, setAutoplay] = useState(true);
  const containerRef = useRef<HTMLElement>(null);

  // Autoplay Timer progress bar states
  const [timerDuration, setTimerDuration] = useState(1.2);
  const [timerKey, setTimerKey] = useState(0);
  const [showTimer, setShowTimer] = useState(true);

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
      case 'MP':
        content = <MultiPaintingsCell paintings={paintings} isActive={isActive} />;
        break;
      case 'Pr':
        content = <ProjectsCell projects={projects} isActive={isActive} gx={gx} gy={gy} />;
        break;
      case 'MPr':
        content = <MultiProjectsCell projects={projects} isActive={isActive} />;
        break;
      case 'T':
        content = <ThreeJSCell isActive={isActive} />;
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
        content = <FocusCell gx={gx} gy={gy} />;
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
    setShowTimer(false);
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

  // One-time intro animation sequence (plays exactly once, then terminates)
  useEffect(() => {
    if (!autoplay || shouldReduceMotion) {
      setScale(1.0);
      setShowTimer(false);
      return;
    }

    let active = true;

    // Curved intro path: Hub -> Paintings -> Projects -> Hub (then settle)
    const PATH: Coord[] = [
      { x: 1, y: 1 }, // Start at Hub
      { x: 1, y: 0 }, // Pan to Paintings
      { x: 2, y: 1 }, // Pan to Projects
      { x: 1, y: 1 }, // Settle back on Hub
    ];

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const runIntro = async () => {
      // Step 0: Hub (1.2s focal time)
      if (!active) return;
      setShowTimer(true);
      setTimerDuration(1.2);
      setTimerKey(0);
      await delay(1200);
      if (!active) return;

      // Step 1: Pan to Paintings (1, 0)
      setShowTimer(false);
      setScale(0.24);
      setCoords(PATH[1] || { x: 1, y: 1 });
      await delay(550);
      if (!active) return;

      setScale(1.0);
      setShowTimer(true);
      setTimerDuration(1.8);
      setTimerKey(1);
      await delay(1800); // let them view the painting for 1.8s
      if (!active) return;

      // Step 2: Pan to Projects (2, 1)
      setShowTimer(false);
      setScale(0.24);
      setCoords(PATH[2] || { x: 1, y: 1 });
      await delay(550);
      if (!active) return;

      setScale(1.0);
      setShowTimer(true);
      setTimerDuration(1.8);
      setTimerKey(2);
      await delay(1800); // let them view the project for 1.8s
      if (!active) return;

      // Step 3: Pan back to Hub (1, 1) and settle
      setShowTimer(false);
      setScale(0.24);
      setCoords(PATH[3] || { x: 1, y: 1 });
      await delay(550);
      if (!active) return;

      setScale(1.0);
      setShowTimer(true);
      setTimerDuration(0.95);
      setTimerKey(3);
      await delay(950);
      if (!active) return;

      // Finish intro animation and hand over control to the user
      setShowTimer(false);
      stopAutoplayAndNavigate({ x: 1, y: 1 });
    };

    runIntro();

    return () => {
      active = false;
    };
  }, [autoplay, shouldReduceMotion, stopAutoplayAndNavigate]);

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

  // Konami Code easter egg listener to trigger autoplay again
  useEffect(() => {
    if (loading) return;

    const konamiCode = [
      'arrowup',
      'arrowup',
      'arrowdown',
      'arrowdown',
      'arrowleft',
      'arrowright',
      'arrowleft',
      'arrowright',
      'b',
      'a',
    ];
    let konamiIndex = 0;

    const handleKonamiKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          konamiIndex = 0;
          setAutoplay(true);
          setCoords({ x: 1, y: 1 });
        }
      } else {
        konamiIndex = key === 'arrowup' ? 1 : 0;
      }
    };

    window.addEventListener('keydown', handleKonamiKey);
    return () => window.removeEventListener('keydown', handleKonamiKey);
  }, [loading]);

  // Infinite grid rendering: dynamic 9x9 render range window centered on current coordinates
  const ix = Math.round(coords.x);
  const iy = Math.round(coords.y);
  const rangeX = Array.from({ length: 9 }, (_, i) => ix - 4 + i);
  const rangeY = Array.from({ length: 9 }, (_, i) => iy - 4 + i);

  // local 3x3 cells for interactive scanner HUD map (dev only)
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
            {/* Dynamic 9x9 Cellular Rendering Grid */}
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
            {/* Autoplay Progress Line */}
            {autoplay && showTimer && (
              <div className='absolute top-0 left-0 right-0 h-1 bg-border/20 z-[9999] pointer-events-none'>
                <motion.div
                  key={timerKey}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: timerDuration, ease: 'linear' }}
                  className='h-full bg-accent shadow-[0_0_8px_var(--color-accent)]'
                />
              </div>
            )}

            {/* Pixelated grid transition wipe overlay */}
            {!shouldReduceMotion && <PixelWipe triggerKey={`${coords.x}-${coords.y}`} />}

            {/* 1. Skip Intro Button (Top Right - positioned below ThemeToggle to prevent overlap) */}
            {autoplay && (
              <div className='absolute top-20 right-6 z-30 pointer-events-auto'>
                <button
                  type='button'
                  onClick={() => stopAutoplayAndNavigate({ x: 1, y: 1 })}
                  className='bg-background/90 border border-foreground/35 px-4 py-1.5 font-mono text-[9px] tracking-widest uppercase hover:border-accent hover:text-accent transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95'
                >
                  [ SKIP INTRO ]
                </button>
              </div>
            )}

            {/* 2. Developer Diagnostic HUD (Dev Mode only) */}
            {isDev && !autoplay && (
              <div className='absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-3 bg-background/90 border-2 border-border p-4 font-mono text-xs shadow-2xl rounded'>
                <div className='flex items-center gap-2'>
                  <span className='w-2.5 h-2.5 rounded-full bg-foreground-muted' />
                  <span className='font-bold tracking-widest text-[10px] text-foreground-subtle'>
                    DEV_MODE: MANUAL CONTROL ENGAGED
                  </span>
                </div>
                <button
                  type='button'
                  onClick={() => setAutoplay(true)}
                  className='border border-foreground/30 px-3 py-1 text-[10px] hover:border-accent hover:text-accent transition-all cursor-pointer'
                >
                  [ REPLAY INTRO ]
                </button>
              </div>
            )}

            {/* 3. Manual Overlay Edge Arrows (Only in Manual Mode) */}
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

            {/* 4. Persistent HUD Minimap scanner & Controls guide (Dev Mode only) */}
            {isDev && (
              <>
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

                <div className='absolute bottom-6 left-6 z-30 bg-background/90 border-2 border-border px-3 py-2 font-mono text-[9px] text-foreground-muted flex gap-2 shadow-2xl rounded items-center'>
                  <span>
                    {autoplay
                      ? 'PRESS WASD/ARROWS OR SWIPE TO INTERACT'
                      : 'KEYS: WASD / ARROWS | MOUSE: CLICK RADAR SCAN'}
                  </span>
                </div>
              </>
            )}

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
