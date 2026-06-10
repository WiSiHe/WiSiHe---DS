'use client';

import type { HomePageQueryResult } from '@wisihe/sanity-queries';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { urlForImage } from '@/sanity/lib/utils';
import HeroArcadeWidget from './HeroArcadeWidget';
import HeroRetroLoader from './HeroRetroLoader';

type HeroImageSectionProps = {
  paintings?: NonNullable<HomePageQueryResult>['showcasePaintings'] | null;
  projects?: NonNullable<HomePageQueryResult>['showcaseProjects'] | null;
};

// Camera Coordinates: Center is (1,1)
type Coord = { x: number; y: number };

const gridPatternStyle = {
  backgroundImage: `
    linear-gradient(to right, var(--color-border) 1px, transparent 1px),
    linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)
  `,
  backgroundSize: '60px 60px',
};

// Check if a coordinate is valid on our cross-shaped grid
const isValidCoord = (x: number, y: number) => {
  return x === 1 || y === 1;
};

export default function HeroImageSection({ paintings, projects }: HeroImageSectionProps) {
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState<Coord>({ x: 1, y: 1 });
  const containerRef = useRef<HTMLElement>(null);

  const navigateTo = (x: number, y: number) => {
    if (isValidCoord(x, y)) {
      setCoords({ x, y });
    }
  };

  // Keyboard navigation listeners (WASD & Arrows)
  useEffect(() => {
    if (loading) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (e.key === 'ArrowUp' || key === 'w') {
        setCoords(prev => {
          const nextY = prev.y - 1;
          if (isValidCoord(prev.x, nextY) && nextY >= 0) return { x: prev.x, y: nextY };
          return prev;
        });
      } else if (e.key === 'ArrowDown' || key === 's') {
        setCoords(prev => {
          const nextY = prev.y + 1;
          if (isValidCoord(prev.x, nextY) && nextY <= 2) return { x: prev.x, y: nextY };
          return prev;
        });
      } else if (e.key === 'ArrowLeft' || key === 'a') {
        setCoords(prev => {
          const nextX = prev.x - 1;
          if (isValidCoord(nextX, prev.y) && nextX >= 0) return { x: nextX, y: prev.y };
          return prev;
        });
      } else if (e.key === 'ArrowRight' || key === 'd') {
        setCoords(prev => {
          const nextX = prev.x + 1;
          if (isValidCoord(nextX, prev.y) && nextX <= 2) return { x: nextX, y: prev.y };
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading]);

  // Touch swipe navigation for mobile
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
        if (absX > absY) {
          // Horizontal Swipe
          if (dx > 0) {
            // Swipe Right -> Go Left
            setCoords(prev => {
              const nextX = prev.x - 1;
              if (isValidCoord(nextX, prev.y) && nextX >= 0) return { x: nextX, y: prev.y };
              return prev;
            });
          } else {
            // Swipe Left -> Go Right
            setCoords(prev => {
              const nextX = prev.x + 1;
              if (isValidCoord(nextX, prev.y) && nextX <= 2) return { x: nextX, y: prev.y };
              return prev;
            });
          }
        } else {
          // Vertical Swipe
          if (dy > 0) {
            // Swipe Down -> Go Up
            setCoords(prev => {
              const nextY = prev.y - 1;
              if (isValidCoord(prev.x, nextY) && nextY >= 0) return { x: prev.x, y: nextY };
              return prev;
            });
          } else {
            // Swipe Up -> Go Down
            setCoords(prev => {
              const nextY = prev.y + 1;
              if (isValidCoord(prev.x, nextY) && nextY <= 2) return { x: prev.x, y: nextY };
              return prev;
            });
          }
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [loading]);

  return (
    <>
      <AnimatePresence>
        {loading && <HeroRetroLoader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <section
        ref={containerRef}
        className='relative w-full h-screen overflow-hidden bg-background select-none'
      >
        {/* The 3x3 Infinite Grid Canvas */}
        <motion.div
          animate={{
            x: `${-coords.x * 100}vw`,
            y: `${-coords.y * 100}vh`,
          }}
          transition={{
            type: 'spring',
            stiffness: 90,
            damping: 18,
          }}
          className='absolute top-0 left-0 w-[300vw] h-[300vh]'
          style={gridPatternStyle}
        >
          {/* ==================== CENTER CELL (1,1) ==================== */}
          <div className='absolute left-[100vw] top-[100vh] w-[100vw] h-[100vh] border-4 border-foreground/30 flex flex-col items-center justify-center p-6 bg-background'>
            <div className='max-w-xl text-center flex flex-col items-center gap-6'>
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
                Welcome to my multi-disciplinary playground. Explore the areas by clicking the edge
                markers or using WASD / Arrow keys.
              </p>

              {/* D-Pad Controls / Central Indicator */}
              <div className='flex flex-col items-center gap-2 mt-4 font-mono text-xs text-foreground-muted'>
                <span className='animate-pulse'>◄ ▲ ▼ ► NAVIGATE GRID</span>
              </div>
            </div>
          </div>

          {/* ==================== TOP CELL (1,0) - PAINTINGS ==================== */}
          <div className='absolute left-[100vw] top-0 w-[100vw] h-[100vh] border-4 border-foreground/30 flex flex-col justify-between p-8 bg-background'>
            <div className='flex justify-between items-center border-b border-border pb-4 font-mono'>
              <span className='text-sm font-bold'>{'[01 // GALLERY_OUTPOST]'}</span>
              <span className='text-xs text-foreground-muted'>COORDINATES: (1, 0)</span>
            </div>

            <div className='flex-1 my-6 overflow-y-auto pr-2'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 pt-4'>
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
              </div>
            </div>

            <div className='flex justify-center border-t border-border pt-4'>
              <button
                type='button'
                onClick={() => navigateTo(1, 1)}
                className='font-mono text-xs px-4 py-2 border border-border hover:border-accent hover:text-accent transition-colors cursor-pointer'
              >
                [ ▼ RETURN TO HUB ]
              </button>
            </div>
          </div>

          {/* ==================== BOTTOM CELL (1,2) - GAME DEV ==================== */}
          <div className='absolute left-[100vw] top-[200vh] w-[100vw] h-[100vh] border-4 border-foreground/30 flex flex-col justify-between p-8 bg-background'>
            <div className='flex justify-between items-center border-b border-border pb-4 font-mono'>
              <span className='text-sm font-bold'>{'[04 // ARCADE_OUTPOST]'}</span>
              <span className='text-xs text-foreground-muted'>COORDINATES: (1, 2)</span>
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
                    Hover over the canvas to interact with the grid sprites. The particles react to
                    cursor magnetism with spring physics.
                  </p>
                </div>
                <div className='flex flex-col gap-1 text-foreground-muted'>
                  <div>ENGINE: UNREAL / CANVAS</div>
                  <div>LANGUAGE: C++ / TS</div>
                  <div>SHADERS: GLSL</div>
                </div>
              </div>
            </div>

            <div className='flex justify-center border-t border-border pt-4'>
              <button
                type='button'
                onClick={() => navigateTo(1, 1)}
                className='font-mono text-xs px-4 py-2 border border-border hover:border-accent hover:text-accent transition-colors cursor-pointer'
              >
                [ ▲ RETURN TO HUB ]
              </button>
            </div>
          </div>

          {/* ==================== LEFT CELL (0,1) - ABOUT & SKILLS ==================== */}
          <div className='absolute left-0 top-[100vh] w-[100vw] h-[100vh] border-4 border-foreground/30 flex flex-col justify-between p-8 bg-background'>
            <div className='flex justify-between items-center border-b border-border pb-4 font-mono'>
              <span className='text-sm font-bold'>{'[03 // INTEL_HUB]'}</span>
              <span className='text-xs text-foreground-muted'>COORDINATES: (0, 1)</span>
            </div>

            <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 my-6 overflow-y-auto pr-2'>
              {/* Bio block */}
              <div className='border-2 border-border p-6 bg-surface font-mono text-xs md:text-sm leading-relaxed flex flex-col justify-between'>
                <div className='flex flex-col gap-2'>
                  <div className='text-accent font-bold uppercase tracking-wider'>
                    USER: HENRIK SISSENER
                  </div>
                  <div>ROLE: DESIGN ENGINEER & MAKER</div>
                  <hr className='border-border my-2' />
                  <p>
                    I operate at the intersection of structural engineering, modern interface
                    design, and organic creative arts.
                  </p>
                  <p>
                    Whether coding responsive frontend layouts in React/Svelte, rendering game
                    physics, or laying oil strokes on canvas, I focus on premium, interactive
                    experiences.
                  </p>
                </div>
                <div className='mt-6 flex flex-wrap gap-2'>
                  <Link
                    href='/about'
                    className='border border-foreground px-3 py-1 text-xs hover:border-accent hover:text-accent transition-colors'
                  >
                    [ READ MORE_ ]
                  </Link>
                </div>
              </div>

              {/* RPG-style Skills list */}
              <div className='border-2 border-border p-6 bg-surface font-mono text-xs flex flex-col gap-4 justify-center'>
                <div className='text-foreground-muted font-bold tracking-wider mb-2'>
                  SKILLS PROFILE:
                </div>
                <div className='flex flex-col gap-1.5'>
                  <div className='flex justify-between'>
                    <span>FRONTEND DEV</span>
                    <span>85%</span>
                  </div>
                  <div className='text-accent font-bold'>[████████░░]</div>
                </div>
                <div className='flex flex-col gap-1.5'>
                  <div className='flex justify-between'>
                    <span>UI/UX DESIGN</span>
                    <span>90%</span>
                  </div>
                  <div className='text-accent font-bold'>[█████████░]</div>
                </div>
                <div className='flex flex-col gap-1.5'>
                  <div className='flex justify-between'>
                    <span>GAME DEV</span>
                    <span>70%</span>
                  </div>
                  <div className='text-accent font-bold'>[███████░░░]</div>
                </div>
                <div className='flex flex-col gap-1.5'>
                  <div className='flex justify-between'>
                    <span>FINE ART</span>
                    <span>90%</span>
                  </div>
                  <div className='text-accent font-bold'>[█████████░]</div>
                </div>
              </div>
            </div>

            <div className='flex justify-center border-t border-border pt-4'>
              <button
                type='button'
                onClick={() => navigateTo(1, 1)}
                className='font-mono text-xs px-4 py-2 border border-border hover:border-accent hover:text-accent transition-colors cursor-pointer'
              >
                [ ► RETURN TO HUB ]
              </button>
            </div>
          </div>

          {/* ==================== RIGHT CELL (2,1) - PROJECTS ==================== */}
          <div className='absolute left-[200vw] top-[100vh] w-[100vw] h-[100vh] border-4 border-foreground/30 flex flex-col justify-between p-8 bg-background'>
            <div className='flex justify-between items-center border-b border-border pb-4 font-mono'>
              <span className='text-sm font-bold'>{'[02 // PROJECT_INDEX]'}</span>
              <span className='text-xs text-foreground-muted'>COORDINATES: (2, 1)</span>
            </div>

            <div className='flex-1 my-6 overflow-y-auto pr-2'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 pt-4'>
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
                          PROJECT_0{index + 1}
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
                            <span key={t}>[{t}]</span>
                          ))}
                        </div>
                        <Link
                          href={`projects/${project.slug}`}
                          className='text-accent font-bold hover:underline'
                        >
                          [ STUDY ]
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className='flex justify-center border-t border-border pt-4'>
              <button
                type='button'
                onClick={() => navigateTo(1, 1)}
                className='font-mono text-xs px-4 py-2 border border-border hover:border-accent hover:text-accent transition-colors cursor-pointer'
              >
                [ ◄ RETURN TO HUB ]
              </button>
            </div>
          </div>
        </motion.div>

        {/* ==================== GLOBAL PERSISTENT HUD OVERLAYS ==================== */}
        {!loading && (
          <>
            {/* 1. Thin Sleek Edge Navigation Arrows */}
            <div className='absolute inset-0 pointer-events-none z-30'>
              {/* Up Arrow (Paintings) */}
              {coords.y > 0 && (
                <button
                  type='button'
                  onClick={() => navigateTo(coords.x, coords.y - 1)}
                  className='pointer-events-auto absolute top-20 left-1/2 -translate-x-1/2 bg-background/80 border-2 border-border px-4 py-2 font-mono text-xs text-foreground hover:border-accent hover:text-accent transition-all animate-bounce shadow-md cursor-pointer'
                >
                  ▲ GALLERY
                </button>
              )}

              {/* Down Arrow (Game Dev) */}
              {coords.y < 2 && (
                <button
                  type='button'
                  onClick={() => navigateTo(coords.x, coords.y + 1)}
                  className='pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2 bg-background/80 border-2 border-border px-4 py-2 font-mono text-xs text-foreground hover:border-accent hover:text-accent transition-all animate-bounce shadow-md cursor-pointer'
                >
                  ▼ ARCADE
                </button>
              )}

              {/* Left Arrow (Skills/About) */}
              {coords.x > 0 && (
                <button
                  type='button'
                  onClick={() => navigateTo(coords.x - 1, coords.y)}
                  className='pointer-events-auto absolute left-6 top-1/2 -translate-y-1/2 bg-background/80 border-2 border-border px-4 py-2 font-mono text-xs text-foreground hover:border-accent hover:text-accent transition-all shadow-md cursor-pointer'
                >
                  ◄ ABOUT
                </button>
              )}

              {/* Right Arrow (Projects) */}
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

            {/* 2. Persistent HUD Minimap (Bottom-Right Corner) */}
            <div className='absolute bottom-6 right-6 z-30 bg-background/90 border-2 border-border p-4 font-mono text-[9px] uppercase tracking-wider flex flex-col gap-2 shadow-lg'>
              <div className='flex justify-between items-center font-bold text-foreground-muted gap-4'>
                <span>GRID HUD V1.0</span>
                <span className='w-1.5 h-1.5 bg-accent rounded-full animate-ping' />
              </div>
              <hr className='border-border/60' />
              <div className='grid grid-cols-3 gap-1 w-16 h-16 mt-1 self-center'>
                {/* HUD Map cells */}
                {[
                  { x: 0, y: 0, label: '', active: false, valid: false },
                  { x: 1, y: 0, label: 'P', active: coords.x === 1 && coords.y === 0, valid: true },
                  { x: 2, y: 0, label: '', active: false, valid: false },

                  { x: 0, y: 1, label: 'A', active: coords.x === 0 && coords.y === 1, valid: true },
                  { x: 1, y: 1, label: 'H', active: coords.x === 1 && coords.y === 1, valid: true },
                  {
                    x: 2,
                    y: 1,
                    label: 'Pr',
                    active: coords.x === 2 && coords.y === 1,
                    valid: true,
                  },

                  { x: 0, y: 2, label: '', active: false, valid: false },
                  { x: 1, y: 2, label: 'G', active: coords.x === 1 && coords.y === 2, valid: true },
                  { x: 2, y: 2, label: '', active: false, valid: false },
                ].map((cell, idx) => (
                  <button
                    key={`${cell.x}-${cell.y}-${idx}`}
                    type='button'
                    disabled={!cell.valid}
                    onClick={() => navigateTo(cell.x, cell.y)}
                    className={`
                      border flex items-center justify-center font-bold select-none cursor-pointer transition-colors duration-150
                      ${!cell.valid ? 'border-transparent bg-transparent cursor-default' : 'border-border'}
                      ${cell.active ? 'bg-accent text-accent-contrast border-accent' : 'bg-surface hover:bg-surface-hover'}
                    `}
                    title={cell.valid ? `Pan to Cell (${cell.x}, ${cell.y})` : undefined}
                  >
                    {cell.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Helper Controls HUD (Bottom-Left Corner) */}
            <div className='absolute bottom-6 left-6 z-30 bg-background/90 border-2 border-border px-3 py-2 font-mono text-[9px] text-foreground-muted flex gap-2 shadow-lg items-center'>
              <span>KEYS: WASD / ARROWS</span>
            </div>
          </>
        )}
      </section>
    </>
  );
}
