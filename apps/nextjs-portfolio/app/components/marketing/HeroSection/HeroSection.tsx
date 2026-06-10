'use client';

import type { HomePageQueryResult } from '@wisihe/sanity-queries';
import { AnimatePresence, motion } from 'motion/react';
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

// Check if a coordinate is valid on our cross-shaped grid in manual mode
const isValidCoord = (x: number, y: number) => {
  return x === 1 || y === 1;
};

// Get cell type based on coordinate modulo mapping in a 5x5 layout
const getCellType = (x: number, y: number) => {
  const mx = ((x % 5) + 5) % 5;
  const my = ((y % 5) + 5) % 5;

  const LAYOUT = [
    ['D1', 'P', 'D2', 'D1', 'P'],
    ['A', 'H', 'Pr', 'A', 'H'],
    ['D3', 'G', 'D4', 'D3', 'G'],
    ['D1', 'P', 'D2', 'D1', 'P'],
    ['A', 'H', 'Pr', 'A', 'H'],
  ];

  return LAYOUT[my]?.[mx] || 'D4';
};

// --- DUMMY DECORATIVE CELLS ---

function DummyCadCell({ gx, gy, isActive }: { gx: number; gy: number; isActive: boolean }) {
  return (
    <div className='w-full h-full flex flex-col justify-between p-6 bg-surface-elevated/20 font-mono text-[10px] text-foreground-muted select-none relative overflow-hidden'>
      <div className='flex justify-between border-b border-border/40 pb-2'>
        <span>NODE_SYS: CAD_VECTOR</span>
        <span>{`(${gx}, ${gy})`}</span>
      </div>
      <div className='flex-1 flex items-center justify-center relative'>
        <svg className='w-2/3 h-2/3 opacity-30 text-accent' viewBox='0 0 100 100'>
          <title>CAD Vector Grid Schema</title>
          <motion.circle
            cx='50'
            cy='50'
            r='40'
            fill='none'
            stroke='currentColor'
            strokeWidth='0.5'
            initial={{ pathLength: 0 }}
            animate={isActive ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
          <motion.path
            d='M 10 50 L 90 50 M 50 10 L 50 90'
            stroke='currentColor'
            strokeWidth='0.5'
            initial={{ pathLength: 0 }}
            animate={isActive ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <motion.rect
            x='30'
            y='30'
            width='40'
            height='40'
            fill='none'
            stroke='currentColor'
            strokeWidth='0.5'
            initial={{ pathLength: 0 }}
            animate={isActive ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          />
        </svg>
      </div>
      <div className='flex justify-between pt-2 border-t border-border/40'>
        <span>GRID_COMPILING: ACTIVE</span>
        <span className='text-accent animate-pulse'>OK</span>
      </div>
    </div>
  );
}

const LOG_POOL = [
  'LOADING BLUEPRINT GRAPHICS...',
  'CONNECTING TO SANITY CLIENT API...',
  'MEMORY REGISTER: 64MB STABLE',
  'INJECTING PAINTING CANVAS BUFFER...',
  'COMPILING GLSL SHADER METADATA...',
  'PORTAL GRID MATRIX ACTIVE',
  'INITIALIZING INPUT LISTENER HOOKS...',
  'BUFFER CHECK: OK',
];

type LogLine = { id: number; text: string };

function DummyLogsCell({ gx, gy }: { gx: number; gy: number }) {
  const [logs, setLogs] = useState<LogLine[]>([]);

  useEffect(() => {
    // Fill initial logs
    setLogs(LOG_POOL.slice(0, 4).map((text, id) => ({ id, text })));

    const interval = setInterval(() => {
      setLogs(prev => {
        const nextLine = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)] || '';
        const nextId = prev.length > 0 ? (prev[prev.length - 1]?.id ?? 0) + 1 : 0;
        return [...prev.slice(1), { id: nextId, text: nextLine }];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='w-full h-full flex flex-col justify-between p-6 bg-neutral-950/40 font-mono text-[9px] text-foreground-muted select-none'>
      <div className='flex justify-between border-b border-border/40 pb-2'>
        <span>NODE_SYS: LOGS_PIPELINE</span>
        <span>{`(${gx}, ${gy})`}</span>
      </div>
      <div className='flex-1 flex flex-col gap-1 mt-4 text-left justify-start overflow-hidden'>
        {logs.map(log => (
          <div key={log.id} className='truncate font-mono text-foreground-subtle'>
            {`> ${log.text}`}
          </div>
        ))}
      </div>
      <div className='text-right text-[8px] opacity-60'>COMPILE_STREAM: STABLE</div>
    </div>
  );
}

const GLITCH_KEYS = Array.from({ length: 64 }).map((_, i) => `glitch-cell-${i}`);

function DummyGlitchCell({ gx, gy }: { gx: number; gy: number }) {
  return (
    <div className='w-full h-full flex flex-col justify-between p-6 bg-surface-elevated/10 font-mono text-[10px] text-foreground-muted select-none relative overflow-hidden'>
      <div className='flex justify-between border-b border-border/40 pb-2'>
        <span>NODE_SYS: MEMORY_MAP</span>
        <span>{`(${gx}, ${gy})`}</span>
      </div>
      <div className='flex-1 grid grid-cols-8 grid-rows-8 gap-0.5 my-4 items-center justify-center max-w-[200px] mx-auto aspect-square w-full'>
        {GLITCH_KEYS.map(cellKey => (
          <div
            key={cellKey}
            className='bg-accent/20 w-full h-full border border-border/5'
            style={{
              animation: `pulse ${Math.random() * 2 + 1}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      <div className='flex justify-between border-t border-border/40 pt-2'>
        <span>SECTOR_COMPATIBILITY: 100%</span>
        <span>NODE_OK</span>
      </div>
    </div>
  );
}

function DummyEmptyCell({ gx, gy }: { gx: number; gy: number }) {
  return (
    <div className='w-full h-full flex items-center justify-center p-6 bg-background relative font-mono text-[9px] text-foreground-muted select-none'>
      <div className='absolute top-4 left-4'>{`[NODE_${gx}_${gy}_EMPTY]`}</div>
      <div className='w-4 h-4 border border-foreground/20 relative'>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-foreground/30' />
      </div>
    </div>
  );
}

// --- MAIN HERO CELL CONTENT COMPONENTS ---

function HubCell({ isActive }: { isActive: boolean }) {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center p-6 bg-background'>
      <motion.div
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.5 }}
        className='max-w-xl text-center flex flex-col items-center gap-6'
      >
        <div className='border border-foreground/20 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-foreground-muted'>
          {'COORDINATES: (1, 1) // HUB'}
        </div>
        <h1 className='text-7xl md:text-9xl font-serif font-black tracking-tight text-foreground uppercase select-none'>
          Henrik
        </h1>
        <p className='font-mono text-sm md:text-base text-accent font-bold tracking-wider'>
          [ DESIGN ENGINEER | PAINTER | MAKER ]
        </p>
        <p className='text-foreground-subtle leading-relaxed text-sm md:text-base max-w-md'>
          Welcome to my multi-disciplinary playground. Let the grid tour play, or click Skip Tour to
          navigate with WASD / Arrow keys.
        </p>
        <div className='flex flex-col items-center gap-2 mt-4 font-mono text-xs text-foreground-muted'>
          <span className='animate-pulse'>◄ ▲ ▼ ► MULTIDISCIPLINARY CORE</span>
        </div>
      </motion.div>
    </div>
  );
}

function PaintingsCell({
  paintings,
  isActive,
}: {
  paintings: HeroImageSectionProps['paintings'];
  isActive: boolean;
}) {
  return (
    <div className='w-full h-full flex flex-col justify-between p-8 bg-background'>
      <div className='flex justify-between items-center border-b border-border pb-4 font-mono'>
        <span className='text-sm font-bold'>{'[01 // GALLERY_OUTPOST]'}</span>
        <span className='text-xs text-foreground-muted'>PAINTINGS</span>
      </div>

      <div className='flex-1 my-6 overflow-hidden flex items-center justify-center'>
        <motion.div
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 w-full'
        >
          {paintings?.slice(0, 3).map(painting => {
            const { image, altText, slug, title } = painting;
            const imageUrl = image
              ? urlForImage(image)?.width(600).height(450).auto('format').quality(85).url()
              : '';

            return (
              <Link
                key={painting._id}
                href={`paintings/${slug}`}
                className='group border-2 border-border p-3 bg-surface hover:border-accent flex flex-col gap-3 transition-all duration-200'
              >
                {imageUrl && (
                  <div className='relative aspect-[4/3] w-full overflow-hidden bg-background'>
                    <Image
                      src={imageUrl}
                      alt={altText || 'Painting'}
                      fill
                      className='object-cover transition-transform duration-300 group-hover:scale-105'
                      sizes='(max-width: 768px) 100vw, 30vw'
                    />
                  </div>
                )}
                <div className='font-mono flex justify-between items-center text-xs'>
                  <span className='font-bold text-foreground truncate'>{title}</span>
                  <span className='text-accent shrink-0 group-hover:translate-x-1 transition-transform'>
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </motion.div>
      </div>
      <div className='h-4' />
    </div>
  );
}

function ProjectsCell({
  projects,
  isActive,
}: {
  projects: HeroImageSectionProps['projects'];
  isActive: boolean;
}) {
  return (
    <div className='w-full h-full flex flex-col justify-between p-8 bg-background'>
      <div className='flex justify-between items-center border-b border-border pb-4 font-mono'>
        <span className='text-sm font-bold'>{'[02 // PROJECT_INDEX]'}</span>
        <span className='text-xs text-foreground-muted'>DEV_WORK</span>
      </div>

      <div className='flex-1 my-6 overflow-hidden flex items-center justify-center'>
        <motion.div
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 w-full'
        >
          {projects?.slice(0, 3).map((project, index) => {
            const heading = project.title || project.name || 'Project';
            const tags = project.tags
              ?.slice(0, 3)
              .map(t => t?.name)
              .filter(Boolean);

            return (
              <div
                key={project._id}
                className='border-2 border-border p-6 bg-surface hover:border-accent flex flex-col justify-between h-full transition-all duration-200 group'
              >
                <div className='font-mono flex flex-col gap-2'>
                  <div className='text-[10px] text-foreground-muted uppercase tracking-wider'>
                    {`PROJECT_0${index + 1}`}
                  </div>
                  <h3 className='text-lg font-bold text-foreground group-hover:text-accent transition-colors truncate'>
                    {heading}
                  </h3>
                  <p className='text-xs text-foreground-subtle line-clamp-3 leading-relaxed mt-2'>
                    {project.description || 'Creative build details.'}
                  </p>
                </div>
                <div className='font-mono flex justify-between items-center text-xs mt-6 pt-4 border-t border-border/40'>
                  <div className='flex gap-1.5 text-[10px] text-foreground-muted'>
                    {tags?.map(t => (
                      <span key={t}>{`[${t}]`}</span>
                    ))}
                  </div>
                  <Link
                    href={`projects/${project.slug}`}
                    className='text-accent font-bold hover:underline'
                  >
                    {'[ STUDY ]'}
                  </Link>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
      <div className='h-4' />
    </div>
  );
}

function ArcadeCell() {
  return (
    <div className='w-full h-full flex flex-col justify-between p-8 bg-background'>
      <div className='flex justify-between items-center border-b border-border pb-4 font-mono'>
        <span className='text-sm font-bold'>{'[04 // ARCADE_OUTPOST]'}</span>
        <span className='text-xs text-foreground-muted'>GAME_DEV</span>
      </div>

      <div className='flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 my-6 overflow-hidden'>
        <div className='lg:col-span-2 border-2 border-border relative overflow-hidden h-full rounded'>
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

function SkillsCell({ isActive }: { isActive: boolean }) {
  return (
    <div className='w-full h-full flex flex-col justify-between p-8 bg-background'>
      <div className='flex justify-between items-center border-b border-border pb-4 font-mono'>
        <span className='text-sm font-bold'>{'[03 // INTEL_HUB]'}</span>
        <span className='text-xs text-foreground-muted'>ABOUT_SKILLS</span>
      </div>

      <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 my-6 overflow-hidden items-center'>
        <div className='border-2 border-border p-6 bg-surface font-mono text-xs md:text-sm leading-relaxed flex flex-col justify-between h-[230px]'>
          <div className='flex flex-col gap-2'>
            <div className='text-accent font-bold uppercase tracking-wider'>
              USER: HENRIK SISSENER
            </div>
            <div>ROLE: DESIGN ENGINEER & MAKER</div>
            <hr className='border-border my-2' />
            <p>
              I operate at the intersection of structural engineering, modern interface design, and
              organic creative arts.
            </p>
          </div>
          <div className='mt-4'>
            <Link
              href='/about'
              className='border border-foreground px-3 py-1 text-xs hover:border-accent hover:text-accent transition-colors'
            >
              {'[ READ MORE_ ]'}
            </Link>
          </div>
        </div>

        <div className='border-2 border-border p-6 bg-surface font-mono text-xs flex flex-col gap-4 h-[230px] justify-center'>
          <div className='text-foreground-muted font-bold tracking-wider mb-2'>SKILLS PROFILE:</div>
          <div className='flex flex-col gap-1.5'>
            <div className='flex justify-between'>
              <span>FRONTEND DEV</span>
              <span>85%</span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={isActive ? { width: '100%' } : { width: 0 }}
              className='text-accent font-bold overflow-hidden whitespace-nowrap'
            >
              {'[████████░░]'}
            </motion.div>
          </div>
          <div className='flex flex-col gap-1.5'>
            <div className='flex justify-between'>
              <span>UI/UX DESIGN</span>
              <span>90%</span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={isActive ? { width: '100%' } : { width: 0 }}
              className='text-accent font-bold overflow-hidden whitespace-nowrap'
            >
              {'[█████████░]'}
            </motion.div>
          </div>
          <div className='flex flex-col gap-1.5'>
            <div className='flex justify-between'>
              <span>GAME DEV</span>
              <span>70%</span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={isActive ? { width: '100%' } : { width: 0 }}
              className='text-accent font-bold overflow-hidden whitespace-nowrap'
            >
              {'[███████░░░]'}
            </motion.div>
          </div>
        </div>
      </div>
      <div className='h-4' />
    </div>
  );
}

// --- MAIN PORTAL GRID WRAPPER ---

export default function HeroImageSection({ paintings, projects }: HeroImageSectionProps) {
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState<Coord>({ x: 1, y: 1 });
  const [scale, setScale] = useState(1);
  const [autoplay, setAutoplay] = useState(true);
  const containerRef = useRef<HTMLElement>(null);

  // Render Cell content by mapped coordinate type
  const renderCellContent = (type: string, isActive: boolean, gx: number, gy: number) => {
    switch (type) {
      case 'H':
        return <HubCell isActive={isActive} />;
      case 'P':
        return <PaintingsCell paintings={paintings} isActive={isActive} />;
      case 'Pr':
        return <ProjectsCell projects={projects} isActive={isActive} />;
      case 'G':
        return <ArcadeCell />;
      case 'A':
        return <SkillsCell isActive={isActive} />;
      case 'D1':
        return <DummyCadCell gx={gx} gy={gy} isActive={isActive} />;
      case 'D2':
        return <DummyLogsCell gx={gx} gy={gy} />;
      case 'D3':
        return <DummyGlitchCell gx={gx} gy={gy} />;
      default:
        return <DummyEmptyCell gx={gx} gy={gy} />;
    }
  };

  const coordsRef = useRef(coords);
  useEffect(() => {
    coordsRef.current = coords;
  }, [coords]);

  const stopAutoplayAndNavigate = useCallback((target: Coord) => {
    setAutoplay(false);
    setScale(1.0);
    setCoords(target);
  }, []);

  // Autoplay sequencer tour loop
  useEffect(() => {
    if (!autoplay) {
      setScale(1.0);
      return;
    }

    let active = true;
    let step = 0;

    const PATH: Coord[] = [
      { x: 1, y: 1 }, // Hub
      { x: 1, y: 0 }, // Paintings
      { x: 2, y: 0 }, // D2
      { x: 2, y: 1 }, // Projects
      { x: 2, y: 2 }, // D4
      { x: 1, y: 2 }, // Arcade
      { x: 0, y: 2 }, // D3
      { x: 0, y: 1 }, // Skills
      { x: 0, y: 0 }, // D1
    ];

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const runTour = async () => {
      // Align step to current coordinates using ref to avoid exhaustive-deps ref cycle
      const currentIdx = PATH.findIndex(
        c => c.x === coordsRef.current.x && c.y === coordsRef.current.y,
      );
      step = currentIdx !== -1 ? currentIdx : 0;

      while (active) {
        // Step 1: Wait zoomed in (3 seconds focal time)
        await delay(3000);
        if (!active) break;

        // Step 2: Zoom out
        setScale(0.35);
        await delay(600);
        if (!active) break;

        // Step 3: Pan to next node in path
        step = (step + 1) % PATH.length;
        const target = PATH[step];
        if (target) {
          setCoords(target);
        }
        await delay(900);
        if (!active) break;

        // Step 4: Zoom back in
        setScale(1.0);
        await delay(600);
      }
    };

    runTour();

    return () => {
      active = false;
    };
  }, [autoplay]);

  const navigateTo = (x: number, y: number) => {
    if (isValidCoord(x, y)) {
      setCoords({ x, y });
    }
  };

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

      if (nextCoords && isValidCoord(nextCoords.x, nextCoords.y)) {
        stopAutoplayAndNavigate(nextCoords);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, coords, stopAutoplayAndNavigate]);

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
            nextCoords = { x: coords.x - 1, y: coords.y }; // Swipe Right -> Left
          } else {
            nextCoords = { x: coords.x + 1, y: coords.y }; // Swipe Left -> Right
          }
        } else {
          // Vertical Swipe
          if (dy > 0) {
            nextCoords = { x: coords.x, y: coords.y - 1 }; // Swipe Down -> Up
          } else {
            nextCoords = { x: coords.x, y: coords.y + 1 }; // Swipe Up -> Down
          }
        }

        if (nextCoords && isValidCoord(nextCoords.x, nextCoords.y)) {
          stopAutoplayAndNavigate(nextCoords);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [loading, coords, stopAutoplayAndNavigate]);

  // Infinite grid cells centered around current camera index (7x7 range window)
  const ix = Math.round(coords.x);
  const iy = Math.round(coords.y);
  const rangeX = Array.from({ length: 7 }, (_, i) => ix - 3 + i);
  const rangeY = Array.from({ length: 7 }, (_, i) => iy - 3 + i);

  return (
    <>
      <AnimatePresence>
        {loading && <HeroRetroLoader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <section
        ref={containerRef}
        className='relative w-full h-screen overflow-hidden bg-background select-none'
      >
        {/* The Infinite Grid Canvas Container */}
        <motion.div
          animate={{
            x: `${-coords.x * 100}vw`,
            y: `${-coords.y * 100}vh`,
            scale: scale,
          }}
          transition={{
            type: 'spring',
            stiffness: 70, // Softer spring for cinematic panning
            damping: 16,
          }}
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

        {/* ==================== PERSISTENT HUD OVERLAYS ==================== */}
        {!loading && (
          <>
            {/* 1. Skip / Autoplay Status Controller (Top Center) */}
            <div className='absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-3 bg-background/90 border-2 border-border px-4 py-2 font-mono text-[10px] shadow-lg'>
              <span
                className={`w-2 h-2 rounded-full ${autoplay ? 'bg-green-500 animate-ping' : 'bg-foreground-muted'}`}
              />
              <span className='text-foreground font-bold tracking-wider'>
                {autoplay ? 'AUTO TOUR: RUNNING' : 'MANUAL EXPLORE: ACTIVE'}
              </span>
              <button
                type='button'
                onClick={() => setAutoplay(prev => !prev)}
                className='border border-foreground/30 px-2 py-0.5 hover:border-accent hover:text-accent transition-colors font-bold cursor-pointer'
              >
                {autoplay ? '[ MANUAL_MODE ]' : '[ RESUME_TOUR ]'}
              </button>
            </div>

            {/* 2. Manual Overlay Edge Arrows (Only in Manual Mode) */}
            {!autoplay && (
              <div className='absolute inset-0 pointer-events-none z-30'>
                {/* Up Arrow */}
                {coords.y > 0 && (
                  <button
                    type='button'
                    onClick={() => navigateTo(coords.x, coords.y - 1)}
                    className='pointer-events-auto absolute top-36 left-1/2 -translate-x-1/2 bg-background/80 border-2 border-border px-4 py-2 font-mono text-xs text-foreground hover:border-accent hover:text-accent transition-all animate-bounce shadow-md cursor-pointer'
                  >
                    ▲ GALLERY
                  </button>
                )}

                {/* Down Arrow */}
                {coords.y < 2 && (
                  <button
                    type='button'
                    onClick={() => navigateTo(coords.x, coords.y + 1)}
                    className='pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2 bg-background/80 border-2 border-border px-4 py-2 font-mono text-xs text-foreground hover:border-accent hover:text-accent transition-all animate-bounce shadow-md cursor-pointer'
                  >
                    ▼ ARCADE
                  </button>
                )}

                {/* Left Arrow */}
                {coords.x > 0 && (
                  <button
                    type='button'
                    onClick={() => navigateTo(coords.x - 1, coords.y)}
                    className='pointer-events-auto absolute left-6 top-1/2 -translate-y-1/2 bg-background/80 border-2 border-border px-4 py-2 font-mono text-xs text-foreground hover:border-accent hover:text-accent transition-all shadow-md cursor-pointer'
                  >
                    ◄ ABOUT
                  </button>
                )}

                {/* Right Arrow */}
                {coords.x < 2 && (
                  <button
                    type='button'
                    onClick={() => navigateTo(coords.x + 1, coords.y)}
                    className='pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 bg-background/80 border-2 border-border px-4 py-2 font-mono text-xs text-foreground hover:border-accent hover:text-accent transition-all shadow-md cursor-pointer'
                  >
                    PROJECTS ►
                  </button>
                )}
              </div>
            )}

            {/* 3. Persistent HUD Minimap (Bottom-Right Corner) */}
            <div className='absolute bottom-6 right-6 z-30 bg-background/90 border-2 border-border p-4 font-mono text-[9px] uppercase tracking-wider flex flex-col gap-2 shadow-lg'>
              <div className='flex justify-between items-center font-bold text-foreground-muted gap-4'>
                <span>GRID HUD V2.0</span>
                <span className='w-1.5 h-1.5 bg-accent rounded-full animate-ping' />
              </div>
              <hr className='border-border/60' />
              <div className='grid grid-cols-3 gap-1 w-16 h-16 mt-1 self-center'>
                {[
                  { x: 0, y: 0, label: '', active: false, valid: false },
                  {
                    x: 1,
                    y: 0,
                    label: 'P',
                    active: ((coords.x % 5) + 5) % 5 === 1 && ((coords.y % 5) + 5) % 5 === 0,
                    valid: true,
                  },
                  { x: 2, y: 0, label: '', active: false, valid: false },

                  {
                    x: 0,
                    y: 1,
                    label: 'A',
                    active: ((coords.x % 5) + 5) % 5 === 0 && ((coords.y % 5) + 5) % 5 === 1,
                    valid: true,
                  },
                  {
                    x: 1,
                    y: 1,
                    label: 'H',
                    active: ((coords.x % 5) + 5) % 5 === 1 && ((coords.y % 5) + 5) % 5 === 1,
                    valid: true,
                  },
                  {
                    x: 2,
                    y: 1,
                    label: 'Pr',
                    active: ((coords.x % 5) + 5) % 5 === 2 && ((coords.y % 5) + 5) % 5 === 1,
                    valid: true,
                  },

                  { x: 0, y: 2, label: '', active: false, valid: false },
                  {
                    x: 1,
                    y: 2,
                    label: 'G',
                    active: ((coords.x % 5) + 5) % 5 === 1 && ((coords.y % 5) + 5) % 5 === 2,
                    valid: true,
                  },
                  { x: 2, y: 2, label: '', active: false, valid: false },
                ].map((cell, idx) => (
                  <button
                    key={`${cell.x}-${cell.y}-${idx}`}
                    disabled={!cell.valid}
                    type='button'
                    onClick={() => stopAutoplayAndNavigate({ x: cell.x, y: cell.y })}
                    className={`
                      border flex items-center justify-center font-bold select-none cursor-pointer transition-colors duration-150 text-[8px]
                      ${!cell.valid ? 'border-transparent bg-transparent cursor-default' : 'border-border'}
                      ${cell.active ? 'bg-accent text-accent-contrast border-accent' : 'bg-surface hover:bg-surface-hover'}
                    `}
                    title={cell.valid ? `Jump to ${cell.label}` : undefined}
                  >
                    {cell.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Controls Guide HUD (Bottom-Left Corner) */}
            <div className='absolute bottom-6 left-6 z-30 bg-background/90 border-2 border-border px-3 py-2 font-mono text-[9px] text-foreground-muted flex gap-2 shadow-lg items-center'>
              <span>
                {autoplay ? 'PRESS ANY KEY TO STOP TOUR AND PAN' : 'CONTROL: WASD / ARROWS / SWIPE'}
              </span>
            </div>
          </>
        )}
      </section>
    </>
  );
}
