'use client';

import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function isTouchPrimaryDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

const CURSOR_ACCENT = 'var(--color-accent-val, var(--color-accent, #e02e00))';

export default function CustomCursor() {
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
    if (isTouchDevice || !isVisible) return;

    document.body.classList.add('custom-cursor-active');
    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isTouchDevice, isVisible]);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive =
          target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.closest('.cursor-pointer') ||
          window.getComputedStyle(target).cursor === 'pointer';

        setIsHovered(Boolean(isInteractive));
      }
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

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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
          transition: width 0.2s ease, height 0.2s ease, background-color 0.2s ease, transform 0.15s ease;
          will-change: width, height, transform;
        }

        .painterly-cursor-core.is-hovered {
          width: 6px;
          height: 6px;
          background-color: ${CURSOR_ACCENT};
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
          transition: width 0.25s cubic-bezier(0.25, 1, 0.5, 1),
                      height 0.25s cubic-bezier(0.25, 1, 0.5, 1),
                      opacity 0.2s ease,
                      border-color 0.2s ease,
                      transform 0.15s ease;
          will-change: width, height, opacity, transform;
        }

        .painterly-cursor-halo.is-hovered {
          width: 52px;
          height: 52px;
          border-width: 1.5px;
          opacity: 0.8;
          border-color: ${CURSOR_ACCENT};
        }

        .painterly-cursor-halo.is-clicked {
          width: 24px !important;
          height: 24px !important;
          opacity: 0.9;
          border-color: ${CURSOR_ACCENT};
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
