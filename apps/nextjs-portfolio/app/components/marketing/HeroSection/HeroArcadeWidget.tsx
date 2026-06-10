'use client';

import { useEffect, useRef, useState } from 'react';

type Drop = {
  x: number;
  y: number;
  vy: number;
  color: string;
  size: number;
};

type Splat = {
  x: number;
  y: number;
  r: number;
  color: string;
};

const PALETTE_COLORS = [
  '#ff4400', // orange
  '#7c3aed', // violet
  '#14b8a6', // teal
  '#eab308', // yellow
  '#ec4899', // pink
  '#10b981', // green
];

export default function HeroArcadeWidget() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const mouseXRef = useRef<number>(-1000);
  const splatsRef = useRef<Splat[]>([]);
  const dropsRef = useRef<Drop[]>([]);

  // Start the game
  const startGame = () => {
    splatsRef.current = [];
    dropsRef.current = [];
    setScore(0);
    setLives(3);
    setGameState('playing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      canvas.width = rect?.width || 300;
      canvas.height = rect?.height || 300;
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseXRef.current = e.clientX - rect.left;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseXRef.current = (e.touches[0]?.clientX || 0) - rect.left;
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Paddle definitions
    const paddleWidth = 80;
    const paddleHeight = 10;
    let currentPaddleX = canvas.width / 2 - paddleWidth / 2;

    // Game loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Canvas background grid
      ctx.strokeStyle = 'var(--color-border, rgba(255,255,255,0.03))';
      ctx.lineWidth = 1;
      const cellSize = 30;
      for (let x = 0; x < canvas.width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. Draw Splats on canvas background
      splatsRef.current.forEach(splat => {
        ctx.beginPath();
        ctx.arc(splat.x, splat.y, splat.r, 0, Math.PI * 2);
        ctx.fillStyle = splat.color;
        ctx.globalAlpha = 0.35; // semi-transparent splat
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 3. Smooth paddle movement interpolation
      const targetPaddleX =
        mouseXRef.current !== -1000
          ? mouseXRef.current - paddleWidth / 2
          : canvas.width / 2 - paddleWidth / 2;

      currentPaddleX += (targetPaddleX - currentPaddleX) * 0.22;
      // Clamp paddle inside canvas boundaries
      if (currentPaddleX < 0) currentPaddleX = 0;
      if (currentPaddleX > canvas.width - paddleWidth) currentPaddleX = canvas.width - paddleWidth;

      const paddleY = canvas.height - 30;

      // 4. Draw Palette Paddle
      ctx.fillStyle = 'var(--color-foreground, #ffffff)';
      ctx.beginPath();
      ctx.roundRect(currentPaddleX, paddleY, paddleWidth, paddleHeight, 5);
      ctx.fill();

      // Little color details on the paddle palette
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = PALETTE_COLORS[i % PALETTE_COLORS.length] || '#ff4400';
        ctx.beginPath();
        ctx.arc(currentPaddleX + 12 + i * 18, paddleY + paddleHeight / 2, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Game Playing State Logic
      if (gameStateRef.current === 'playing') {
        // Spawn drops
        if (Math.random() < 0.03 && dropsRef.current.length < 8) {
          dropsRef.current.push({
            x: Math.random() * (canvas.width - 20) + 10,
            y: -10,
            vy: Math.random() * 2 + 2.5,
            color: PALETTE_COLORS[Math.floor(Math.random() * PALETTE_COLORS.length)] || '#ff4400',
            size: Math.random() * 6 + 6,
          });
        }

        // Update & Render drops
        const activeDrops: Drop[] = [];
        dropsRef.current.forEach(drop => {
          drop.y += drop.vy;

          // Check hit paddle
          const hitX = drop.x >= currentPaddleX && drop.x <= currentPaddleX + paddleWidth;
          const hitY =
            drop.y + drop.size / 2 >= paddleY && drop.y - drop.size / 2 <= paddleY + paddleHeight;

          if (hitX && hitY) {
            // Catches drop! Add splat splatters
            splatsRef.current.push({
              x: drop.x,
              y: paddleY - 2,
              r: drop.size * (Math.random() * 1.5 + 1.5),
              color: drop.color,
            });
            // Splash secondary particles around
            for (let k = 0; k < 3; k++) {
              splatsRef.current.push({
                x: drop.x + (Math.random() * 30 - 15),
                y: paddleY - 2 - Math.random() * 10,
                r: drop.size * 0.4,
                color: drop.color,
              });
            }
            setScore(s => s + 10);
          } else if (drop.y > canvas.height + 10) {
            // Drops past bottom -> lose life
            setLives(l => {
              const next = l - 1;
              if (next <= 0) {
                setGameState('gameover');
              }
              return next;
            });
          } else {
            activeDrops.push(drop);
          }

          // Draw drop
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, drop.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = drop.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = drop.color;
          ctx.fill();
          ctx.shadowBlur = 0; // reset shadow
        });

        dropsRef.current = activeDrops;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className='w-full h-full flex items-center justify-center relative bg-surface-elevated/10 overflow-hidden select-none'
    >
      <canvas ref={canvasRef} className='block w-full h-full cursor-crosshair' />

      {/* State Overlays */}
      {gameState === 'start' && (
        <div className='absolute inset-0 bg-background/95 flex flex-col justify-center items-center p-6 text-center font-mono gap-4 pointer-events-auto'>
          <div className='flex flex-col gap-1'>
            <h4 className='text-accent font-bold tracking-widest text-sm uppercase'>
              CATCH THE PAINT PIXELS
            </h4>
            <p className='text-[10px] text-foreground-muted max-w-xs leading-relaxed mt-2'>
              Move mouse or swipe horizontally to steer the paddle. Catch falling neon drops to
              splash color onto the canvas!
            </p>
          </div>
          <button
            type='button'
            onClick={startGame}
            className='bg-accent text-accent-contrast border border-accent px-4 py-2 text-xs font-bold hover:bg-accent/80 transition-all cursor-pointer rounded mt-2 shadow-lg hover:scale-105 active:scale-95'
          >
            [ START GAME ]
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className='absolute top-4 left-4 right-4 flex justify-between items-center font-mono text-[10px] text-foreground-muted pointer-events-none'>
          <div className='bg-surface/80 px-2 py-0.5 border border-border rounded'>
            SCORE: <span className='text-accent font-bold'>{score}</span>
          </div>
          <div className='bg-surface/80 px-2 py-0.5 border border-border rounded flex gap-1 items-center'>
            LIVES:{' '}
            <span
              className={lives > 0 ? 'text-red-500 font-bold' : 'text-foreground-muted opacity-30'}
            >
              ♥
            </span>
            <span
              className={lives > 1 ? 'text-red-500 font-bold' : 'text-foreground-muted opacity-30'}
            >
              ♥
            </span>
            <span
              className={lives > 2 ? 'text-red-500 font-bold' : 'text-foreground-muted opacity-30'}
            >
              ♥
            </span>
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className='absolute inset-0 bg-background/95 flex flex-col justify-center items-center p-6 text-center font-mono gap-4 pointer-events-auto'>
          <div className='flex flex-col gap-1'>
            <h4 className='text-red-500 font-bold tracking-widest text-sm uppercase'>
              CANVAS COMPLETE!
            </h4>
            <p className='text-[11px] text-foreground-subtle mt-2 font-bold'>
              Final Score: <span className='text-accent'>{score}</span>
            </p>
            <p className='text-[9px] text-foreground-muted max-w-xs mt-1 leading-normal'>
              Your score painted {splatsRef.current.length} colored splats onto the grid board.
            </p>
          </div>
          <button
            type='button'
            onClick={startGame}
            className='bg-accent text-accent-contrast border border-accent px-4 py-2 text-xs font-bold hover:bg-accent/80 transition-all cursor-pointer rounded mt-2 shadow-lg hover:scale-105 active:scale-95'
          >
            [ PLAY AGAIN ]
          </button>
        </div>
      )}
    </div>
  );
}
