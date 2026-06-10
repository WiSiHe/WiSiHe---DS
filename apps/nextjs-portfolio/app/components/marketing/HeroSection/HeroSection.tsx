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

type ProjectItem = {
  title?: string | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  tags?: { name?: string | null }[] | null;
  image?: Parameters<typeof urlForImage>[0] | null;
  role?: string | null;
  story?: string | null;
  challenge?: string | null;
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
  story:
    'I build digital systems that act like dynamic canvases. Every interface should combine flawless performance with tactile, organic micro-interactions that make the product feel alive.',
};

const FOCUS_AREAS = [
  DEFAULT_FOCUS,
  {
    title: 'Game Development',
    description:
      'Designing custom 2D/3D visual environments, canvas physics engines, custom shaders, and gameplay logic in Unreal Engine.',
    tagline: 'INTERACTIVE x GRAPHICS_PHYSICS',
    category: 'GAME_DEV_SECTOR',
    story:
      'From C++ algorithms in Unreal Engine 5 to screen-space shaders, I love designing digital playgrounds. I focus on implementing satisfying physics bounds, custom lighting, and responsive controls.',
  },
  {
    title: 'Paintings & Drawings',
    description:
      'Blending traditional physical mediums like oil paint and charcoal with digital art techniques to translate texture to the web.',
    tagline: 'CANVAS_TEXTURE x FINE_ART',
    category: 'ART_SECTOR',
    story:
      'Fine art is the foundation of my engineering. Physical painting teaches me light, shadow, texture, and chemistry—which I translate directly into custom GLSL fragment shaders.',
  },
];

// --- LOCAL FALLBACK DATA (To guarantee a filled grid) ---
const FALLBACK_PAINTINGS = [
  {
    title: 'The Resonance of Code',
    slug: 'resonance-of-code',
    altText: 'Abstract code elements painted in heavy oil textures',
    image: null,
    medium: 'Oil on Canvas',
    year: '2024',
    dimensions: '120 x 90 cm',
    story:
      'An exploration of heavy textured oil paint colliding with visual digital matrix patterns. Explores the tension between organic human expression and logical computer code.',
  },
  {
    title: 'Digital Horizon',
    slug: 'digital-horizon',
    altText: 'Vibrant pixelated sunset blending with oil medium',
    image: null,
    medium: 'Acrylic & Mixed Media',
    year: '2023',
    dimensions: '100 x 100 cm',
    story:
      'A vibrant sunset blending digital neon pigments with heavy textured acrylic impasto layers, representing the merging line between software horizons and physical reality.',
  },
  {
    title: 'Glitched Canvas',
    slug: 'glitched-canvas',
    altText: 'Traditional portrait with digital neon scanlines',
    image: null,
    medium: 'Oil & Spray Paint',
    year: '2025',
    dimensions: '80 x 100 cm',
    story:
      'A traditional portrait overlayed with bright digital scanlines, conveying the fragmentation of human identity in the social media era.',
  },
  {
    title: 'Intertwined Disciplines',
    slug: 'intertwined-disciplines',
    altText: 'Complex brushstrokes morphing into technical CAD outlines',
    image: null,
    medium: 'Charcoal & Oil on Canvas',
    year: '2024',
    dimensions: '150 x 120 cm',
    story:
      'A sweeping physical charcoal sketch morphing seamlessly into technical CAD wireframes, representing the duality of art and engineering.',
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
    role: 'Lead Creative Engineer',
    story:
      'Developed a custom 2D WebGL fluid dynamics solver that calculates real paint diffusion on textured paper backgrounds. Engineered custom fragment shaders running at 60 FPS.',
    challenge:
      'Achieving real-time fluid simulation and pigment mixing inside the constraints of a mobile browser.',
  },
  {
    title: 'Unreal Art Gallery',
    name: 'Unreal Art Gallery',
    slug: 'unreal-art-gallery',
    description:
      'A 3D virtual exhibition space built in Unreal Engine 5, showcasing physical paintings with realistic ray-traced canvas lighting.',
    tags: [{ name: 'Unreal Engine' }, { name: 'C++' }, { name: 'DirectX 12' }],
    image: null,
    role: '3D Graphics Programmer',
    story:
      'Created a virtual exhibition space allowing visitors to walk through a gallery of physical paintings. Features custom ray-traced canvas texture lighting and physics-based visitor controls.',
    challenge:
      'Optimizing high-polygon canvas assets and global illumination for standard hardware performance.',
  },
  {
    title: 'Shader Symphony',
    name: 'Shader Symphony',
    slug: 'shader-symphony',
    description:
      'Audio-reactive screen-space shaders that transform live ambient noises into flowing oil paint strokes.',
    tags: [{ name: 'GLSL' }, { name: 'Web Audio API' }, { name: 'Vite' }],
    image: null,
    role: 'Interactive Developer',
    story:
      'Programmed screen-space fragment shaders that hook into the Web Audio API, transforming live voice/music frequencies into dynamic, morphing watercolor ripples.',
    challenge:
      'Mapping real-time audio FFT bins to organic shader noise arrays without noticeable latency.',
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

// --- CURATED GRAPHIC CELLS ---

function FocusCell({ gx, gy }: { gx: number; gy: number }) {
  const index = Math.abs(gx + gy) % FOCUS_AREAS.length;
  const area = FOCUS_AREAS[index] ?? DEFAULT_FOCUS;

  return (
    <div
      className='w-full h-full flex flex-col justify-between p-8 bg-background relative overflow-hidden'
      style={canvasTextureStyle}
    >
      <div className='absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none' />
      <div className='flex justify-between border-b border-border/40 pb-2 font-mono text-[9px] text-foreground-muted select-none z-10'>
        <span>SECTOR: {area.category}</span>
        <span>{`(${gx}, ${gy})`}</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='flex-1 flex flex-col justify-center max-w-sm mx-auto text-left gap-4 my-auto z-10'
      >
        <div className='font-mono text-[9px] text-accent tracking-wider uppercase flex items-center gap-1.5'>
          <span className='w-1.5 h-1.5 bg-accent rounded-full animate-ping' />
          <span>{`// ${area.tagline}`}</span>
        </div>
        <h2 className='text-3xl font-serif font-black uppercase text-foreground leading-none tracking-tight bg-gradient-to-r from-foreground via-foreground-subtle to-foreground/80'>
          {area.title}
        </h2>
        <p className='font-mono text-[10.5px] md:text-xs text-foreground-subtle leading-relaxed border-l-2 border-accent pl-3 py-0.5'>
          {area.description}
        </p>
        <p className='font-mono text-[9.5px] text-foreground-muted italic leading-relaxed bg-surface/30 p-2.5 rounded border border-border/20 mt-1.5 shadow-sm'>
          {area.story}
        </p>
      </motion.div>

      <div className='font-mono text-[8px] text-foreground-muted flex justify-between border-t border-border/40 pt-2 select-none z-10'>
        <span>DISCIPLINE_STREAM</span>
        <span className='text-accent font-semibold'>STATUS: ONLINE</span>
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
  const blobIndex = Math.abs(gx * gy + 3) % 4;
  const gradientColors =
    [
      'from-accent via-violet-500 to-emerald-400',
      'from-pink-500 via-orange-400 to-yellow-300',
      'from-blue-500 via-cyan-400 to-purple-600',
      'from-rose-500 via-red-400 to-amber-500',
    ][blobIndex] || 'from-accent via-violet-500 to-emerald-400';

  return (
    <div
      className='w-full h-full flex flex-col justify-between p-6 select-none relative overflow-hidden bg-background'
      style={canvasTextureStyle}
    >
      <div className='absolute inset-0 bg-scanline opacity-[0.02]' />
      <div className='flex justify-between border-b border-border/40 pb-2 font-mono text-[10px] text-foreground-muted z-10'>
        <span>NODE_SYS: WATERCOLOR_FLUID</span>
        <span>{`(${gx}, ${gy})`}</span>
      </div>

      {/* Morphing paint blobs */}
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
        <motion.div
          animate={
            isActive
              ? {
                  scale: [1, 1.25, 0.82, 1.1, 1],
                  borderRadius: [
                    '42% 58% 70% 30% / 45% 45% 55% 55%',
                    '70% 30% 52% 48% / 60% 40% 60% 40%',
                    '35% 65% 80% 20% / 30% 50% 50% 70%',
                    '42% 58% 70% 30% / 45% 45% 55% 55%',
                  ],
                  rotate: [0, 90, 180, 270, 360],
                }
              : { scale: 0.75, rotate: 0 }
          }
          transition={{
            duration: 16,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
          className={`w-[60vw] h-[60vw] md:w-[28vw] md:h-[28vw] rounded-full filter blur-[48px] opacity-[0.22] bg-gradient-to-tr ${gradientColors}`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        className='z-10 max-w-xs mx-auto text-center flex flex-col gap-2 font-mono p-4 bg-surface/30 backdrop-blur-[2px] rounded-lg border border-border/30 shadow-md'
      >
        <span className='text-[8px] text-accent tracking-widest uppercase'>
          [ WATERCOLOR FLUID SIM ]
        </span>
        <p className='text-[9.5px] text-foreground-subtle leading-relaxed'>
          Capillary paint diffusion calculation running on paper grid node.
        </p>
      </motion.div>

      <div className='z-10 font-mono text-[9px] text-foreground-muted flex justify-between border-t border-border/40 pt-2'>
        <span>PIGMENT_DIFFUSION: SOLVED</span>
        <span className='animate-pulse text-accent'>DIFFUSING</span>
      </div>
    </div>
  );
}

// Interactive HTML5 paint splattering canvas
function InteractivePaintCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.clearRect(0, 0, rect.width, rect.height);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const COLORS = ['#ff4400', '#ff007f', '#00f3ff', '#7c3aed', '#ffc800', '#10b981'];

    interface PaintDrop {
      x: number;
      y: number;
      radius: number;
      targetRadius: number;
      color: string;
      opacity: number;
      bleedSpeed: number;
    }

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      opacity: number;
      life: number;
      maxLife: number;
    }

    let drops: PaintDrop[] = [];
    let particles: Particle[] = [];
    let animationFrameId: number;

    const bufferCanvas = document.createElement('canvas');
    const bufferCtx = bufferCanvas.getContext('2d');

    const syncBuffer = () => {
      bufferCanvas.width = canvas.width;
      bufferCanvas.height = canvas.height;
      if (bufferCtx) {
        bufferCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };
    syncBuffer();

    const addSplatter = (clientX: number, clientY: number, force = false) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const color = COLORS[Math.floor(Math.random() * COLORS.length)] ?? '#ff007f';
      const targetRadius = (force ? 18 : 7) + Math.random() * (force ? 28 : 14);

      drops.push({
        x,
        y,
        radius: 1,
        targetRadius,
        color,
        opacity: 0.85,
        bleedSpeed: 0.04 + Math.random() * 0.07,
      });

      const numParticles = force
        ? 12 + Math.floor(Math.random() * 15)
        : 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (force ? 2.5 : 1) + Math.random() * (force ? 6 : 3.5);
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 0.8 + Math.random() * 2.5,
          color,
          opacity: 0.85,
          life: 0,
          maxLife: 25 + Math.random() * 30,
        });
      }
    };

    const draw = () => {
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.drawImage(bufferCanvas, 0, 0, rect.width, rect.height);

      const nextDrops: PaintDrop[] = [];
      for (const d of drops) {
        if (d.radius < d.targetRadius) {
          d.radius += (d.targetRadius - d.radius) * d.bleedSpeed;
          d.opacity = Math.max(0.1, d.opacity - 0.004);
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.globalAlpha = d.opacity;
        ctx.fill();

        if (d.radius > 5) {
          ctx.beginPath();
          ctx.arc(d.x + d.radius * 0.22, d.y - d.radius * 0.12, d.radius * 0.78, 0, Math.PI * 2);
          ctx.arc(d.x - d.radius * 0.18, d.y + d.radius * 0.22, d.radius * 0.72, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        if (d.radius < d.targetRadius - 0.5) {
          nextDrops.push(d);
        } else {
          if (bufferCtx) {
            bufferCtx.save();
            bufferCtx.beginPath();
            bufferCtx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
            bufferCtx.fillStyle = d.color;
            bufferCtx.globalAlpha = d.opacity * 0.65;
            bufferCtx.fill();
            if (d.radius > 5) {
              bufferCtx.beginPath();
              bufferCtx.arc(
                d.x + d.radius * 0.22,
                d.y - d.radius * 0.12,
                d.radius * 0.78,
                0,
                Math.PI * 2,
              );
              bufferCtx.arc(
                d.x - d.radius * 0.18,
                d.y + d.radius * 0.22,
                d.radius * 0.72,
                0,
                Math.PI * 2,
              );
              bufferCtx.fill();
            }
            bufferCtx.restore();
          }
        }
      }
      drops = nextDrops;

      const nextParticles: Particle[] = [];
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.93;
        p.vy *= 0.93;
        p.life++;
        p.opacity = Math.max(0, 0.85 - (p.life / p.maxLife) * 0.85);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.restore();

        if (p.life < p.maxLife) {
          nextParticles.push(p);
        } else {
          if (bufferCtx) {
            bufferCtx.save();
            bufferCtx.beginPath();
            bufferCtx.arc(p.x, p.y, p.radius * 1.1, 0, Math.PI * 2);
            bufferCtx.fillStyle = p.color;
            bufferCtx.globalAlpha = p.opacity * 0.45;
            bufferCtx.fill();
            bufferCtx.restore();
          }
        }
      }
      particles = nextParticles;

      animationFrameId = requestAnimationFrame(draw);
    };
    animationFrameId = requestAnimationFrame(draw);

    let lastMove = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMove > 50) {
        addSplatter(e.clientX, e.clientY, false);
        lastMove = now;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      addSplatter(e.clientX, e.clientY, true);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);

    setTimeout(() => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w > 0 && h > 0) {
        addSplatter(rect.left + w * 0.25, rect.top + h * 0.35, true);
        addSplatter(rect.left + w * 0.72, rect.top + h * 0.28, true);
        addSplatter(rect.left + w * 0.48, rect.top + h * 0.68, true);
      }
    }, 150);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className='absolute inset-0 w-full h-full pointer-events-auto z-0 opacity-[0.28] mix-blend-multiply dark:mix-blend-screen'
    />
  );
}

// --- MAIN HERO CELL CONTENT COMPONENTS ---

function HubCell({ isActive, onScrollDown }: { isActive: boolean; onScrollDown: () => void }) {
  return (
    <div
      className='w-full h-full flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden'
      style={canvasTextureStyle}
    >
      <InteractivePaintCanvas />

      <motion.div
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.5 }}
        className='max-w-xl text-center flex flex-col items-center gap-6 z-10 select-none'
      >
        <div className='border border-foreground/20 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-foreground-muted bg-background/50 backdrop-blur-sm rounded'>
          {'COORDINATES: (1, 1) // HUB'}
        </div>
        <h1 className='text-7xl md:text-[10rem] font-serif font-black tracking-tighter uppercase select-none leading-none bg-gradient-to-r from-foreground via-accent to-pink-500 bg-clip-text text-transparent filter drop-shadow-[0_4px_20px_rgba(0,243,255,0.15)] transition-all duration-300 hover:skew-x-2'>
          Henrik
        </h1>
        <p className='font-mono text-xs md:text-sm text-accent font-bold tracking-[0.25em] bg-surface/50 border border-border/40 px-3 py-1 rounded backdrop-blur-sm'>
          [ DESIGN ENGINEER | PAINTER | MAKER ]
        </p>
        <p className='text-foreground-subtle leading-relaxed text-sm md:text-base max-w-md bg-background/45 backdrop-blur-[2px] p-4 rounded-xl border border-border/20 shadow-md font-sans'>
          I bridge traditional canvas painting with digital graphics. Explore my work, code
          blueprints, and interactive widgets in this infinite wrapping canvas.
        </p>
        <div className='flex flex-col items-center gap-2 mt-2 font-mono text-[10px] text-foreground-muted bg-background/60 px-3 py-1.5 rounded-full border border-border/30 shadow-sm'>
          <span className='animate-pulse text-accent'>▲ ▼ ◄ ► NAVIGATE CANVAS</span>
        </div>

        <button
          type='button'
          onClick={onScrollDown}
          className='mt-2 px-5 py-2.5 border-2 border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground font-mono text-xs tracking-widest uppercase rounded-lg shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2'
        >
          <span>ENTER PORTFOLIO</span>
          <span className='animate-bounce text-xs'>▼</span>
        </button>
      </motion.div>
    </div>
  );
}

function BioCell({ isActive }: { isActive: boolean }) {
  return (
    <div
      className='w-full h-full flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden'
      style={canvasTextureStyle}
    >
      <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-accent/5 to-transparent pointer-events-none' />
      <motion.div
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.5 }}
        className='max-w-md text-left flex flex-col gap-4 border-2 border-foreground bg-surface p-6 rounded-xl relative shadow-2xl overflow-hidden'
      >
        <div className='absolute -top-10 -right-10 w-24 h-24 bg-accent/10 rounded-full blur-xl' />
        <div className='font-mono text-[9px] uppercase tracking-wider text-accent border-b border-border/40 pb-2 flex justify-between items-center z-10'>
          <span className='flex items-center gap-1.5'>
            <span className='w-1.5 h-1.5 bg-accent rounded-full animate-ping' />
            <span>SECTOR: BIO_MANIFESTO</span>
          </span>
          <span>{'02 // PHILOSOPHY'}</span>
        </div>
        <p className='font-serif text-lg md:text-xl italic text-foreground leading-relaxed font-semibold bg-gradient-to-r from-foreground to-foreground-subtle bg-clip-text z-10'>
          &ldquo;I bridge the physical paint canvas with digital software, creating systems that act
          like brushstrokes and art that lives in the browser.&rdquo;
        </p>
        <p className='font-mono text-[10.5px] md:text-xs text-foreground-subtle leading-relaxed z-10'>
          Henrik Sissener is a design engineer and painter from Norway. By day, he crafts
          high-performance web systems and interactive tools; by night, he works with traditional
          oil paints, acrylics, and GLSL shaders.
        </p>
        <div className='border-t border-border/40 pt-2.5 flex justify-between font-mono text-[8px] text-foreground-muted z-10'>
          <span>LOCATION: OSLO, NORWAY</span>
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

// Reusable tabbed project card with hover scanline and outline glow
function ProjectCard({
  proj,
  idx,
  isActive,
}: {
  proj: ProjectItem;
  idx: number;
  isActive: boolean;
}) {
  const [activeTab, setActiveTab] = useState<'story' | 'challenge' | 'stack'>('story');

  const heading = proj.title || proj.name || 'Project';
  const tags =
    proj.tags?.map(t => t?.name).filter((name): name is string => typeof name === 'string') || [];
  const imageUrl = proj.image
    ? urlForImage(proj.image)?.width(400).height(240).quality(85).url()
    : null;

  const role = proj.role || 'Creative Developer';
  const story =
    proj.story ||
    'An engineering solution blending modern frontend technology with high-fidelity UI.';
  const challenge =
    proj.challenge || 'Optimizing client-side execution to ensure responsive rendering.';

  return (
    <motion.div
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ duration: 0.5, delay: idx * 0.15 }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,243,255,0.15)' }}
      className='relative border-2 border-foreground bg-surface rounded-xl flex flex-col overflow-hidden max-w-sm mx-auto w-full transition-shadow duration-300 select-none'
    >
      {/* Interactive Scanline overlay */}
      <div className='absolute inset-0 pointer-events-none z-10 bg-scanline opacity-0 hover:opacity-[0.03] transition-opacity duration-300' />

      {/* Header */}
      <div className='border-b-2 border-foreground bg-surface-elevated px-3 py-1.5 flex items-center justify-between font-mono text-[8px] text-foreground-muted select-none'>
        <div className='flex gap-1'>
          <span className='w-1.5 h-1.5 bg-foreground rounded-full' />
          <span className='w-1.5 h-1.5 bg-foreground rounded-full' />
          <span className='w-1.5 h-1.5 bg-foreground rounded-full' />
        </div>
        <div className='bg-surface border border-foreground/30 px-1.5 py-0.5 rounded truncate max-w-[120px]'>
          {`wisihe.no/${proj.slug}`}
        </div>
      </div>

      {/* Image / Thumbnail */}
      <div className='relative w-full aspect-[16/9] bg-background overflow-hidden border-b-2 border-foreground group'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={heading}
            fill
            className='object-cover transition-transform duration-700 group-hover:scale-105'
            sizes='(max-width: 768px) 80vw, 25vw'
          />
        ) : (
          <div className='w-full h-full bg-gradient-to-tr from-accent/10 to-pink-500/10 flex flex-col items-center justify-center font-mono text-[9px] text-foreground-muted gap-1 relative overflow-hidden'>
            <div className='absolute inset-0 bg-accent/5 opacity-50 backdrop-blur-[1px]' />
            <span className='z-15 text-[10px] tracking-wider font-bold text-accent group-hover:scale-110 transition-transform duration-300'>
              [ {heading.toUpperCase()} ]
            </span>
          </div>
        )}
        {/* Glow overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2'>
          <span className='text-[8px] text-white font-mono uppercase tracking-widest'>{role}</span>
        </div>
      </div>

      {/* Narrative content block */}
      <div className='p-3.5 flex flex-col justify-between font-mono text-[9px] leading-snug flex-1 bg-background'>
        <div className='flex flex-col gap-2'>
          <h3 className='font-bold text-foreground text-[12px] truncate uppercase tracking-tight'>
            {heading}
          </h3>

          {/* Tabs header */}
          <div className='flex border-b border-border/40 pb-1 text-[8px] gap-2'>
            <button
              type='button'
              onClick={() => setActiveTab('story')}
              className={`hover:text-accent font-bold px-1 py-0.5 rounded transition-all cursor-pointer ${activeTab === 'story' ? 'bg-accent/15 text-accent border border-accent/30' : 'text-foreground-muted'}`}
            >
              [ STORY ]
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('challenge')}
              className={`hover:text-accent font-bold px-1 py-0.5 rounded transition-all cursor-pointer ${activeTab === 'challenge' ? 'bg-accent/15 text-accent border border-accent/30' : 'text-foreground-muted'}`}
            >
              [ CHALLENGE ]
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('stack')}
              className={`hover:text-accent font-bold px-1 py-0.5 rounded transition-all cursor-pointer ${activeTab === 'stack' ? 'bg-accent/15 text-accent border border-accent/30' : 'text-foreground-muted'}`}
            >
              [ STACK ]
            </button>
          </div>

          {/* Dynamic Tab Body */}
          <div className='min-h-[56px] text-foreground-subtle leading-normal text-[9.5px] mt-1'>
            {activeTab === 'story' && <p>{story}</p>}
            {activeTab === 'challenge' && <p>{challenge}</p>}
            {activeTab === 'stack' && (
              <div className='flex flex-wrap gap-1 mt-1'>
                {tags.map((t: string) => (
                  <span
                    key={t}
                    className='border border-accent/30 px-1.5 py-0.5 rounded text-[8px] text-accent bg-accent/5 font-semibold shadow-[0_0_4px_rgba(0,243,255,0.05)]'
                  >
                    {t}
                  </span>
                ))}
                {tags.length === 0 && (
                  <span className='text-foreground-muted'>No tech stack tags loaded.</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='flex justify-between items-center mt-3 pt-2 border-t border-border/20'>
          <span className='text-[7.5px] text-foreground-muted uppercase'>ROLE: {role}</span>
          {proj.slug && (
            <Link
              href={`/projects/${proj.slug}`}
              className='text-accent hover:text-pink-500 font-bold text-[8px] transition-colors border border-accent/25 hover:border-pink-500/50 px-2 py-0.5 rounded cursor-pointer'
            >
              {'[ BLUEPRINT ]'}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
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

  const pData = painting as {
    medium?: string;
    year?: string;
    dimensions?: string;
    story?: string;
  };
  const medium = pData.medium || 'Oil & Mixed Media';
  const year = pData.year || '2024';
  const dimensions = pData.dimensions || '100 x 80 cm';
  const story =
    pData.story ||
    "Part of Henrik's fine art collection bridging organic expressions with digital concepts.";

  return (
    <div
      className='w-full h-full flex flex-col md:flex-row items-center justify-center gap-10 p-8 bg-background relative'
      style={canvasTextureStyle}
    >
      <div className='absolute top-6 left-6 font-mono text-[9px] text-foreground-muted uppercase z-10 flex items-center gap-2'>
        <span className='w-1.5 h-1.5 rounded-full bg-accent animate-pulse' />
        <span>EXHIBIT_DECK: SINGLE_PIECE_FEATURE</span>
      </div>
      <div className='flex flex-col md:flex-row items-center justify-center gap-10 max-w-4xl mx-auto'>
        {/* Museum-grade Single Painting Frame */}
        <div className='relative w-full max-w-[70vw] md:max-w-[35vw] aspect-[4/3] border-[6px] border-foreground p-3.5 bg-surface shadow-2xl origin-center flex-shrink-0 overflow-hidden rounded'>
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={isActive ? { opacity: 1, scale: 1.0 } : { opacity: 0 }}
            transition={{ duration: 0.7 }}
            className='w-full h-full relative overflow-hidden bg-background'
          >
            {imageUrl ? (
              <motion.div
                animate={isActive ? { scale: [1, 1.06], rotate: [0, 0.3] } : {}}
                transition={{ duration: 5.5, ease: 'linear' }}
                className='w-full h-full relative'
              >
                <Image
                  src={imageUrl}
                  alt={altText || 'Painting'}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 70vw, 35vw'
                />
              </motion.div>
            ) : (
              <div className='relative w-full h-full bg-gradient-to-br from-orange-100 via-pink-100 to-indigo-100 dark:from-neutral-900 dark:via-purple-950 dark:to-neutral-950 flex items-center justify-center border border-border/40'>
                <svg className='w-1/3 h-1/3 opacity-20 text-accent' viewBox='0 0 100 100'>
                  <title>Brush stroke line decoration</title>
                  <path
                    d='M 10 50 Q 30 20, 50 50 T 90 50'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                  />
                </svg>
              </div>
            )}
          </motion.div>
        </div>

        {/* Museum Placard */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex flex-col justify-center max-w-xs p-6 border border-border/80 bg-surface/30 backdrop-blur-sm rounded-xl font-mono text-xs leading-relaxed min-h-[180px] shadow-lg relative overflow-hidden group'
        >
          <div className='absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full blur-xl' />
          <div className='text-[8.5px] text-foreground-muted uppercase tracking-wider flex justify-between items-center mb-1'>
            <span>{`SECTOR: P_FEATURE`}</span>
            <span className='bg-accent/15 text-accent px-1.5 py-0.5 rounded font-bold'>{year}</span>
          </div>
          <h2 className='text-xl font-serif font-black italic text-foreground tracking-tight leading-tight uppercase mb-1.5'>
            {title}
          </h2>
          <div className='text-[9px] text-accent font-semibold tracking-wide uppercase border-b border-border/30 pb-1.5 mb-2'>
            {medium} • {dimensions}
          </div>
          <p className='text-[9.5px] text-foreground-subtle leading-relaxed italic pr-2 mb-3'>
            &ldquo;{story}&rdquo;
          </p>
          {slug && (
            <div>
              <Link
                href={`/paintings/${slug}`}
                className='inline-flex items-center gap-1.5 border border-foreground/30 px-3 py-1.5 hover:border-accent hover:text-accent transition-all font-bold text-[9px] rounded bg-background/50 hover:bg-accent/5 cursor-pointer'
              >
                <span>[ INSPECT ARTWORK ]</span>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
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

  return (
    <div
      className='w-full h-full flex items-center justify-center p-8 bg-background'
      style={canvasTextureStyle}
    >
      <ProjectCard proj={project} idx={0} isActive={isActive} />
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
    }, 5500);
    return () => clearInterval(timer);
  }, [isActive, list.length]);

  const painting = list[currentIndex];
  if (!painting) return null;

  const imageUrl = painting.image
    ? urlForImage(painting.image)?.width(800).height(600).auto('format').quality(90).url()
    : '';

  const pData = painting as {
    medium?: string;
    year?: string;
    dimensions?: string;
    story?: string;
  };
  const medium = pData.medium || 'Oil & Mixed Media';
  const year = pData.year || '2024';
  const dimensions = pData.dimensions || '100 x 80 cm';
  const story =
    pData.story ||
    "Part of Henrik's fine art collection bridging organic expressions with digital concepts.";

  return (
    <div
      className='w-full h-full flex flex-col md:flex-row items-center justify-center gap-10 p-8 bg-background relative'
      style={canvasTextureStyle}
    >
      <div className='absolute top-6 left-6 font-mono text-[9px] text-foreground-muted uppercase z-10 flex items-center gap-2'>
        <span className='w-1.5 h-1.5 rounded-full bg-accent animate-pulse' />
        <span>EXHIBIT_DECK: PAINTING_ARCHIVE</span>
      </div>

      {/* Ken Burns Image Container */}
      <div className='relative w-full max-w-[70vw] md:max-w-[40vw] aspect-[4/3] border-[6px] border-foreground p-3.5 bg-surface shadow-2xl origin-center flex-shrink-0 overflow-hidden rounded'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className='w-full h-full relative overflow-hidden bg-background'
          >
            {imageUrl ? (
              <motion.div
                animate={{ scale: [1, 1.06], rotate: [0, 0.3] }}
                transition={{ duration: 5.5, ease: 'linear' }}
                className='w-full h-full relative'
              >
                <Image
                  src={imageUrl}
                  alt={painting.altText || 'Painting'}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 70vw, 40vw'
                />
              </motion.div>
            ) : (
              <div className='relative w-full h-full bg-gradient-to-br from-orange-100 via-pink-100 to-indigo-100 dark:from-neutral-900 dark:via-purple-950 dark:to-neutral-950 flex items-center justify-center border border-border/40'>
                <svg
                  className='w-1/3 h-1/3 opacity-20 text-accent animate-pulse'
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
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Museum Placard */}
      <div className='flex flex-col justify-between max-w-xs p-6 border border-border/80 bg-surface/30 backdrop-blur-sm rounded-xl font-mono text-xs leading-relaxed self-center min-h-[200px] shadow-lg relative overflow-hidden group'>
        <div className='absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-xl group-hover:bg-accent/10 transition-colors' />
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className='flex flex-col gap-2.5 z-10'
          >
            <div className='text-[8px] text-foreground-muted uppercase tracking-wider flex justify-between items-center'>
              <span>{`CATALOG ITEM: ${currentIndex + 1} / ${list.length}`}</span>
              <span className='bg-accent/15 text-accent px-1.5 py-0.5 rounded font-bold'>
                {year}
              </span>
            </div>
            <h2 className='text-xl font-serif font-black italic text-foreground tracking-tight leading-tight uppercase bg-gradient-to-r from-foreground to-foreground-subtle bg-clip-text'>
              {painting.title}
            </h2>
            <div className='text-[9px] text-accent font-semibold tracking-wide uppercase border-b border-border/30 pb-1.5'>
              {medium} • {dimensions}
            </div>
            <p className='text-[9.5px] text-foreground-subtle leading-relaxed italic pr-2'>
              &ldquo;{story}&rdquo;
            </p>
            {painting.slug && (
              <div className='mt-2.5'>
                <Link
                  href={`/paintings/${painting.slug}`}
                  className='inline-flex items-center gap-1.5 border border-foreground/30 px-3 py-1.5 hover:border-accent hover:text-accent transition-all font-bold text-[9px] rounded bg-background/50 hover:bg-accent/5 cursor-pointer'
                >
                  <span>[ INSPECT ARTWORK ]</span>
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bullet Navigators */}
        <div className='flex gap-1.5 mt-5 justify-center z-10 border-t border-border/20 pt-3'>
          {list.map((p, idx) => (
            <button
              key={`${p.title || idx}-${idx}`}
              type='button'
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full border border-foreground/30 transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'bg-accent border-accent scale-125 shadow-[0_0_6px_var(--color-accent)]'
                  : 'bg-transparent hover:bg-foreground/20'
              }`}
              title={`View slide ${idx + 1}`}
            />
          ))}
        </div>
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
        <span>PROJECTS_OVERVIEW: DUAL_GRID</span>
        <span>ACTIVE</span>
      </div>

      <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center my-auto'>
        {proj1 && <ProjectCard proj={proj1} idx={0} isActive={isActive} />}
        {proj2 && <ProjectCard proj={proj2} idx={1} isActive={isActive} />}
      </div>

      <div className='font-mono text-[9px] text-foreground-muted flex justify-between border-t border-border/40 pt-2'>
        <span>SHOWCASE: PORTFOLIO</span>
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
        content = <HubCell isActive={isActive} onScrollDown={handleScrollDown} />;
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

  const [gridScaleX, setGridScaleX] = useState(1);
  const [gridScaleY, setGridScaleY] = useState(1);
  const [gridRotate, setGridRotate] = useState(0);
  const prevCoordsRef = useRef<Coord>({ x: 1, y: 1 });
  const [hoveredDir, setHoveredDir] = useState<string | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const prev = prevCoordsRef.current;
    const dx = coords.x - prev.x;
    const dy = coords.y - prev.y;
    prevCoordsRef.current = coords;

    if (dx === 0 && dy === 0) return;

    let targetScaleX = 1;
    let targetScaleY = 1;
    let targetRotate = 0;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > absDy) {
      targetScaleX = 1.24;
      targetScaleY = 0.8;
      targetRotate = dx > 0 ? -1.8 : 1.8;
    } else if (absDy > absDx) {
      targetScaleX = 0.8;
      targetScaleY = 1.24;
      targetRotate = dy > 0 ? 1.5 : -1.5;
    } else {
      targetScaleX = 1.15;
      targetScaleY = 1.15;
      targetRotate = dx > 0 ? -1.2 : 1.2;
    }

    setGridScaleX(targetScaleX);
    setGridScaleY(targetScaleY);
    setGridRotate(targetRotate);

    const timeout = setTimeout(() => {
      setGridScaleX(1);
      setGridScaleY(1);
      setGridRotate(0);
    }, 45);

    return () => clearTimeout(timeout);
  }, [coords, shouldReduceMotion]);

  const stopAutoplayAndNavigate = useCallback((target: Coord) => {
    setAutoplay(false);
    setScale(1.0);
    setCoords(target);
    setShowTimer(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wisihe_hero_tour_played', 'true');
    }
  }, []);

  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (navTimeoutRef.current) {
        clearTimeout(navTimeoutRef.current);
      }
    };
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
      setScale(0.18);
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
      setScale(0.18);
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
      setScale(0.18);
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
          if (dx > 0) {
            nextCoords = { x: coords.x - 1, y: coords.y }; // Swipe Right
          } else {
            nextCoords = { x: coords.x + 1, y: coords.y }; // Swipe Left
          }
        } else {
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

  const ix = Math.round(coords.x);
  const iy = Math.round(coords.y);
  const rangeX = Array.from({ length: 9 }, (_, i) => ix - 4 + i);
  const rangeY = Array.from({ length: 9 }, (_, i) => iy - 4 + i);

  // local 3x3 cells for interactive radar map
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
        <div
          className='absolute inset-0 pointer-events-none z-20 opacity-[0.06] mix-blend-overlay'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <motion.div
          style={{
            opacity: scrollOpacity,
            scale: scrollScale,
            y: scrollYOffset,
          }}
          className='w-full h-full relative'
        >
          <motion.div
            animate={{
              x: `${-coords.x * 100}vw`,
              y: `${-coords.y * 100}vh`,
              scaleX: loading ? 0.15 : scale !== 1.0 ? scale : gridScaleX,
              scaleY: loading ? 0.15 : scale !== 1.0 ? scale : gridScaleY,
              opacity: loading ? 0 : 1,
              filter: loading ? 'blur(10px)' : 'blur(0px)',
              rotate: shouldReduceMotion ? 0 : gridRotate,
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    type: 'spring',
                    stiffness: 125,
                    damping: 12,
                    mass: 0.65,
                  }
            }
            className='absolute top-0 left-0 w-[300vw] h-[300vh]'
            style={{
              ...gridPatternStyle,
              transformOrigin: `${coords.x * 100 + 50}vw ${coords.y * 100 + 50}vh`,
            }}
          >
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

            {!shouldReduceMotion && <PixelWipe triggerKey={`${coords.x}-${coords.y}`} />}

            {/* 1. Skip Intro Button (Top Center - safe from navigation overlaps) */}
            {autoplay && (
              <div className='absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto'>
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

            {/* 3. Consolidated Navigation HUD (Bottom Right Corner) */}
            {!autoplay && (
              <div className='absolute bottom-8 right-8 z-30 bg-background/80 backdrop-blur-md border border-border/60 p-4 rounded-xl shadow-2xl font-mono text-xs w-64 flex flex-col gap-3 pointer-events-auto select-none'>
                <div className='flex justify-between items-center border-b border-border/30 pb-2'>
                  <span className='font-bold text-foreground'>{'CTRL PANEL // CANVAS_NAV'}</span>
                  <span className='w-1.5 h-1.5 bg-accent rounded-full animate-ping' />
                </div>

                {/* 3x3 Radar Grid Navigator */}
                <div className='flex flex-col gap-1'>
                  <div className='text-[7.5px] text-foreground-muted tracking-wider uppercase mb-1'>
                    RADAR NEIGHBORS:
                  </div>
                  <div className='grid grid-cols-3 gap-1 w-28 h-28 mx-auto border border-border/20 p-1 bg-surface/30 rounded'>
                    {localCells.map((cell, idx) => (
                      <button
                        key={`${cell.x}-${cell.y}-${idx}`}
                        type='button'
                        onClick={() => handleUserNavigate({ x: cell.x, y: cell.y })}
                        onMouseEnter={() => setHoveredDir(`PAN TO: ${cell.label}`)}
                        onMouseLeave={() => setHoveredDir(null)}
                        className={`
                          border flex items-center justify-center font-mono font-bold select-none cursor-pointer transition-all duration-150 text-[7px] w-7 h-7 rounded
                          ${
                            cell.active
                              ? 'bg-accent text-accent-contrast border-accent shadow-md scale-105 shadow-accent/20'
                              : 'bg-surface border-border/50 hover:bg-surface-hover hover:border-accent text-foreground-subtle'
                          }
                        `}
                      >
                        {cell.abbr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive D-Pad Diamond Controller */}
                <div className='flex flex-col gap-1 border-t border-border/20 pt-2.5'>
                  <div className='text-[7.5px] text-foreground-muted tracking-wider uppercase mb-1'>
                    D-PAD STEERING:
                  </div>
                  <div className='grid grid-cols-3 gap-1.5 w-24 h-24 mx-auto'>
                    <div />
                    <button
                      type='button'
                      onClick={() => handleUserNavigate({ x: coords.x, y: coords.y - 1 })}
                      onMouseEnter={() =>
                        setHoveredDir(`UP: ${getCellLabel(getCellType(coords.x, coords.y - 1))}`)
                      }
                      onMouseLeave={() => setHoveredDir(null)}
                      className='flex items-center justify-center border border-border/60 rounded-lg bg-surface/50 hover:bg-accent/20 hover:border-accent text-foreground transition-all duration-150 active:scale-90 cursor-pointer'
                      title='Move Up'
                    >
                      ▲
                    </button>
                    <div />

                    <button
                      type='button'
                      onClick={() => handleUserNavigate({ x: coords.x - 1, y: coords.y })}
                      onMouseEnter={() =>
                        setHoveredDir(`LEFT: ${getCellLabel(getCellType(coords.x - 1, coords.y))}`)
                      }
                      onMouseLeave={() => setHoveredDir(null)}
                      className='flex items-center justify-center border border-border/60 rounded-lg bg-surface/50 hover:bg-accent/20 hover:border-accent text-foreground transition-all duration-150 active:scale-90 cursor-pointer'
                      title='Move Left'
                    >
                      ◄
                    </button>
                    <div className='flex items-center justify-center font-bold text-[8px] text-accent border border-border/30 rounded-lg bg-background/40'>
                      {getCellType(coords.x, coords.y)}
                    </div>
                    <button
                      type='button'
                      onClick={() => handleUserNavigate({ x: coords.x + 1, y: coords.y })}
                      onMouseEnter={() =>
                        setHoveredDir(`RIGHT: ${getCellLabel(getCellType(coords.x + 1, coords.y))}`)
                      }
                      onMouseLeave={() => setHoveredDir(null)}
                      className='flex items-center justify-center border border-border/60 rounded-lg bg-surface/50 hover:bg-accent/20 hover:border-accent text-foreground transition-all duration-150 active:scale-90 cursor-pointer'
                      title='Move Right'
                    >
                      ►
                    </button>

                    <div />
                    <button
                      type='button'
                      onClick={() => handleUserNavigate({ x: coords.x, y: coords.y + 1 })}
                      onMouseEnter={() =>
                        setHoveredDir(`DOWN: ${getCellLabel(getCellType(coords.x, coords.y + 1))}`)
                      }
                      onMouseLeave={() => setHoveredDir(null)}
                      className='flex items-center justify-center border border-border/60 rounded-lg bg-surface/50 hover:bg-accent/20 hover:border-accent text-foreground transition-all duration-150 active:scale-90 cursor-pointer'
                      title='Move Down'
                    >
                      ▼
                    </button>
                    <div />
                  </div>
                </div>

                {/* Readout Status Bar */}
                <div className='mt-2.5 pt-2 border-t border-border/20 text-center h-4 flex items-center justify-center text-[9px] text-foreground-muted font-bold tracking-wider'>
                  {hoveredDir || `LOC: [X: ${coords.x}, Y: ${coords.y}]`}
                </div>
              </div>
            )}

            {/* 4. Keyboard Shortcuts reminder (Bottom Left Corner) */}
            {!autoplay && (
              <div className='absolute bottom-8 left-8 z-30 bg-background/80 backdrop-blur-md border border-border/60 px-4 py-3 rounded-xl font-mono text-[9px] text-foreground-muted shadow-2xl flex flex-col gap-1 select-none pointer-events-auto w-52'>
                <span className='font-bold text-accent tracking-wider'>SHORTCUTS AVAILABLE:</span>
                <hr className='border-border/20 my-0.5' />
                <span>• WASD / ARROWS TO STEER</span>
                <span>• MOUSE OVER RADAR MAP</span>
                <span>• DRAG MOUSE FOR PAINT SPLATS</span>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
