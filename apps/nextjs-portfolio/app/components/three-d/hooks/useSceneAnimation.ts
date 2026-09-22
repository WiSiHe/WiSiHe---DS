'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { SlideMode } from '../../../three-d/types';
import { ANIMATION_SPEEDS } from '../constants';
import type { SceneRef } from '../types';

interface UseSceneAnimationProps {
  mode: SlideMode;
  autoRotate?: boolean;
  isVisible?: boolean;
  refs: {
    showcase?: React.RefObject<SceneRef>;
    threejsIntro?: React.RefObject<SceneRef>;
    r3fFirstScene?: React.RefObject<SceneRef>;
    r3fBasics?: React.RefObject<SceneRef>;
    r3fMaterials?: React.RefObject<SceneRef>;
    r3fGeometries?: React.RefObject<SceneRef>;
    r3fAnimation?: React.RefObject<SceneRef>;
    r3fInteraction?: React.RefObject<SceneRef>;
  };
}

export function useSceneAnimation({
  mode,
  autoRotate,
  isVisible = true,
  refs,
}: UseSceneAnimationProps) {
  const elapsedTimeRef = useRef(0);

  // Pause animations when not visible
  useFrame((_state, delta) => {
    if (!isVisible) return;

    elapsedTimeRef.current += delta;
    const elapsedTime = elapsedTimeRef.current;

    if (mode === 'showcase' && refs.showcase?.current && autoRotate) {
      // Rotate only on Y-axis (vertical rotation) for beer can
      if (refs.showcase.current) {
        refs.showcase.current.rotation.y = elapsedTime * ANIMATION_SPEEDS.showcase.y;
      }
    }
    if (mode === 'threejs-intro' && refs.threejsIntro?.current) {
      if (refs.threejsIntro.current) {
        refs.threejsIntro.current.rotation.y = elapsedTime * ANIMATION_SPEEDS.threejsIntro.y;
      }
    }
    if (mode === 'r3f-first-scene' && refs.r3fFirstScene?.current) {
      if (refs.r3fFirstScene.current) {
        refs.r3fFirstScene.current.rotation.y = elapsedTime * ANIMATION_SPEEDS.r3fFirstScene.y;
      }
    }
    if (mode === 'r3f-basics' && refs.r3fBasics?.current) {
      if (refs.r3fBasics.current) {
        refs.r3fBasics.current.rotation.y = elapsedTime * ANIMATION_SPEEDS.r3fBasics.y;
      }
    }
    if (mode === 'r3f-materials' && refs.r3fMaterials?.current) {
      if (refs.r3fMaterials.current) {
        refs.r3fMaterials.current.rotation.y = elapsedTime * ANIMATION_SPEEDS.r3fMaterials.y;
      }
    }
    if (mode === 'r3f-geometries' && refs.r3fGeometries?.current) {
      if (refs.r3fGeometries.current) {
        refs.r3fGeometries.current.rotation.y = elapsedTime * ANIMATION_SPEEDS.r3fGeometries.y;
      }
    }
  });
}
