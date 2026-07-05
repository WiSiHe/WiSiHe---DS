'use client';

import { cn } from '@wisihe/utils';
import {
  AnimatePresence,
  type MotionValue,
  motion,
  type SpringOptions,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link } from '@/app/components/layout/ProgressLink';

export type DockLinkItem = {
  href: string;
  label: ReactNode;
  icon: ReactNode;
  isActive?: boolean;
  className?: string;
  ariaLabel?: string;
};

export type DockProps = {
  items: DockLinkItem[];
  className?: string;
  distance?: number;
  baseItemSize?: number;
  magnification?: number;
  spring?: SpringOptions;
  'aria-label'?: string;
};

type DockItemProps = {
  href: string;
  label: ReactNode;
  icon: ReactNode;
  isActive?: boolean;
  className?: string;
  ariaLabel?: string;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  magnify: boolean;
};

function DockLabel({
  children,
  className,
  isHovered,
}: {
  children: ReactNode;
  className?: string;
  isHovered: MotionValue<number>;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: -8 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-foreground shadow-md',
            className,
          )}
          role='tooltip'
        >
          {children}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

function DockItem({
  href,
  label,
  icon,
  isActive = false,
  className,
  ariaLabel,
  mouseX,
  spring,
  distance,
  baseItemSize,
  magnification,
  magnify,
}: DockItemProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);
  const maxScale = magnification / baseItemSize;

  const mouseDistance = useTransform(mouseX, val => {
    const rect = slotRef.current?.getBoundingClientRect();
    if (!rect) return distance;
    return val - rect.x - rect.width / 2;
  });

  const targetScale = useTransform(mouseDistance, [-distance, 0, distance], [1, maxScale, 1]);
  const scale = useSpring(targetScale, spring);

  return (
    <div
      ref={slotRef}
      className='relative flex shrink-0 items-center justify-center'
      style={{ width: baseItemSize }}
      onPointerEnter={() => isHovered.set(1)}
      onPointerLeave={() => isHovered.set(0)}
    >
      <motion.div
        style={
          magnify
            ? {
                width: baseItemSize,
                height: baseItemSize,
                scale,
                transformOrigin: 'center center',
              }
            : { width: baseItemSize, height: baseItemSize }
        }
        className='relative will-change-transform'
      >
        <Link
          href={href}
          aria-label={ariaLabel ?? (typeof label === 'string' ? `Navigate to ${label}` : undefined)}
          aria-current={isActive ? 'page' : undefined}
          onFocus={() => isHovered.set(1)}
          onBlur={() => isHovered.set(0)}
          className={cn(
            'relative flex size-full items-center justify-center rounded-full border shadow-md transition-colors',
            isActive
              ? 'border-accent-border bg-accent text-accent-contrast'
              : 'border-border bg-surface text-foreground-subtle hover:border-accent-border hover:bg-surface-hover hover:text-accent',
            className,
          )}
        >
          <span className='flex items-center justify-center text-xl leading-none' aria-hidden>
            {icon}
          </span>
          {magnify ? <DockLabel isHovered={isHovered}>{label}</DockLabel> : null}
        </Link>
      </motion.div>
    </div>
  );
}

function useDockInteractionMode() {
  const [mode, setMode] = useState<'compact' | 'magnify'>('compact');

  useEffect(() => {
    const coarseMq = window.matchMedia('(pointer: coarse)');
    const narrowMq = window.matchMedia('(max-width: 639px)');

    const resolve = () => {
      const canMagnify = !coarseMq.matches && !narrowMq.matches;
      setMode(canMagnify ? 'magnify' : 'compact');
    };

    resolve();
    coarseMq.addEventListener('change', resolve);
    narrowMq.addEventListener('change', resolve);
    return () => {
      coarseMq.removeEventListener('change', resolve);
      narrowMq.removeEventListener('change', resolve);
    };
  }, []);

  return mode;
}

const PILL_CLASS =
  'flex w-fit max-w-[calc(100vw-1.5rem)] items-center gap-3 rounded-full border border-border bg-surface/95 px-4 py-2 shadow-xl backdrop-blur-xl sm:gap-4 sm:px-5';

export function Dock({
  items,
  className,
  spring = { mass: 0.12, stiffness: 180, damping: 18 },
  magnification = 62,
  distance = 130,
  baseItemSize = 48,
  'aria-label': ariaLabel = 'Application dock',
}: DockProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const interactionMode = useDockInteractionMode();
  const magnify = interactionMode === 'magnify' && !prefersReducedMotion;
  const mouseX = useMotionValue(Infinity);

  const itemProps = items.map(item => ({
    key: item.href,
    item,
    magnify,
    mouseX,
    spring,
    distance,
    magnification,
    baseItemSize,
  }));

  if (!magnify) {
    return (
      <div className='mx-auto flex max-w-full justify-center px-2'>
        <div className={cn(PILL_CLASS, className)} role='toolbar' aria-label={ariaLabel}>
          {itemProps.map(({ key, item, ...rest }) => (
            <DockItem
              key={key}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={item.isActive}
              className={item.className}
              ariaLabel={item.ariaLabel}
              magnify={false}
              mouseX={rest.mouseX}
              spring={rest.spring}
              distance={rest.distance}
              baseItemSize={rest.baseItemSize}
              magnification={rest.baseItemSize}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className='mx-auto flex max-w-full justify-center px-2 py-2'
      onPointerMove={event => mouseX.set(event.clientX)}
      onPointerLeave={() => mouseX.set(Infinity)}
    >
      <div
        className={cn(PILL_CLASS, 'overflow-visible', className)}
        role='toolbar'
        aria-label={ariaLabel}
      >
        {itemProps.map(({ key, item, ...rest }) => (
          <DockItem
            key={key}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={item.isActive}
            className={item.className}
            ariaLabel={item.ariaLabel}
            magnify
            mouseX={rest.mouseX}
            spring={rest.spring}
            distance={rest.distance}
            baseItemSize={rest.baseItemSize}
            magnification={rest.magnification}
          />
        ))}
      </div>
    </div>
  );
}
