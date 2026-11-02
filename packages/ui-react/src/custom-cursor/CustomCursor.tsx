'use client';

import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function isTouchPrimaryDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

const INTERACTIVE_SELECTOR =
  'a, button, summary, label, select, input, textarea, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"]), .cursor-pointer';

const CURSOR_ACCENT = 'var(--color-accent-val, var(--color-accent, #e02e00))';

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [mounted, setMounted] = useState(false);
  const isVisibleRef = useRef(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 220, mass: 0.5 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    const touchPrimary = isTouchPrimaryDevice();
    setIsTouchDevice(touchPrimary);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;
    // The class carries `cursor: none !important` on `*`, so toggling it restyles the whole
    // document. Add it once on first movement and keep it until unmount.
    if (isVisible) document.body.classList.add('custom-cursor-active');
  }, [isTouchDevice, isVisible]);

  useEffect(
    () => () => {
      document.body.classList.remove('custom-cursor-active');
    },
    [],
  );

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // `mouseover` only fires when the hovered element changes, so the DOM lookup does not run on
    // every pointer move. No getComputedStyle: it forces a synchronous style recalculation.
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      setIsHovered(Boolean(target?.closest?.(INTERACTIVE_SELECTOR)));
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };
    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isTouchDevice, mouseX, mouseY]);

  if (!mounted || isTouchDevice || !isVisible) return null;

  return createPortal(
    <>
      <style
        // biome-ignore lint/security/noDangerouslySetInnerHtml: inline static styling
        dangerouslySetInnerHTML={{
          __html: `
        .painterly-cursor-core {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: ${CURSOR_ACCENT};
          transition: transform 0.2s ease;
          will-change: transform;
        }

        .painterly-cursor-core.is-hovered {
          transform: scale(0.75);
        }

        .painterly-cursor-core.is-clicked {
          transform: scale(0.6);
        }

        .painterly-cursor-halo {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid ${CURSOR_ACCENT};
          background-color: transparent;
          opacity: 0.45;
          transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.2s ease;
          will-change: transform, opacity;
        }

        .painterly-cursor-halo.is-hovered {
          transform: scale(1.625);
          opacity: 0.8;
        }

        .painterly-cursor-halo.is-clicked {
          transform: scale(0.75);
          opacity: 0.9;
        }
      `,
        }}
      />

      <motion.div
        className='fixed top-0 left-0 pointer-events-none z-[99999] flex items-center justify-center'
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div
          className={`painterly-cursor-core ${isHovered ? 'is-hovered' : ''} ${
            isClicked ? 'is-clicked' : ''
          }`}
        />
      </motion.div>

      <motion.div
        className='fixed top-0 left-0 pointer-events-none z-[99999] flex items-center justify-center'
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div
          className={`painterly-cursor-halo ${isHovered ? 'is-hovered' : ''} ${
            isClicked ? 'is-clicked' : ''
          }`}
        />
      </motion.div>
    </>,
    document.body,
  );
}
