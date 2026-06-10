'use client';

import { useEffect, useRef, useState } from 'react';

// 8x8 Grid definitions for retro sprites
const SPRITES = {
  invader: [
    [0, 0, 1, 0, 0, 1, 0, 0],
    [1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 0, 0, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
  ],
  controller: [
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  sword: [
    [0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 0],
  ],
};

type Particle = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
};

export default function HeroArcadeWidget() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSprite, setActiveSprite] = useState<keyof typeof SPRITES>('invader');
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const spriteKeys: Array<keyof typeof SPRITES> = ['invader', 'controller', 'sword'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % spriteKeys.length;
      const key = spriteKeys[idx];
      if (key) {
        setActiveSprite(key);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    const resize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      canvas.width = rect?.width || 300;
      canvas.height = rect?.height || 300;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const spriteGrid = SPRITES[activeSprite];
      const cellSize = Math.min(canvas.width, canvas.height) / 12;
      const offsetX = (canvas.width - cellSize * 8) / 2;
      const offsetY = (canvas.height - cellSize * 8) / 2;

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (spriteGrid[r]?.[c] === 1) {
            const tx = offsetX + c * cellSize + cellSize / 2;
            const ty = offsetY + r * cellSize + cellSize / 2;
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              targetX: tx,
              targetY: ty,
              vx: 0,
              vy: 0,
              size: cellSize * 0.8,
              color: 'var(--color-accent, #10b981)',
            });
          }
        }
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Physics Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const spring = 0.08;
      const friction = 0.82;
      const mouseRepulsion = 120;
      const forceRadius = 80;

      particles.forEach(p => {
        // Magnetic repulsion from cursor
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < forceRadius) {
          const force = (forceRadius - dist) / forceRadius;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * mouseRepulsion * 0.15;
          p.vy += Math.sin(angle) * force * mouseRepulsion * 0.15;
        }

        // Return to target grid position (spring physics)
        const targetDx = p.targetX - p.x;
        const targetDy = p.targetY - p.y;
        p.vx += targetDx * spring;
        p.vy += targetDy * spring;

        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;

        // Render pixel block
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      });

      // Simple grid overlays
      ctx.strokeStyle = 'var(--color-border, rgba(255,255,255,0.05))';
      ctx.lineWidth = 1;
      const cellSize = Math.min(canvas.width, canvas.height) / 12;
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

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [activeSprite]);

  return (
    <div
      ref={containerRef}
      className='w-full h-full flex items-center justify-center relative bg-surface-elevated/40'
    >
      <div className='absolute top-4 left-4 font-mono text-[10px] uppercase text-foreground-muted tracking-wider bg-surface/80 px-2 py-0.5 border border-border'>
        MODULE: GAME_DEV / {activeSprite}
      </div>
      <canvas ref={canvasRef} className='block w-full h-full cursor-crosshair' />
    </div>
  );
}
