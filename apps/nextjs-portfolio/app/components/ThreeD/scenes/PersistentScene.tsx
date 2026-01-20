'use client';

import { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { SlideMode } from '../../../three-d/types';
import { SceneLights } from './SceneLights';
import { useSceneAnimation } from '../hooks/useSceneAnimation';
import { IntroScene } from './IntroScene';
import { VerticesScene } from './VerticesScene';
import { EdgesScene } from './EdgesScene';
import { FacesScene } from './FacesScene';
import { ThreeJSIntroScene } from './ThreeJSIntroScene';
import { R3FFirstScene } from './R3FFirstScene';
import { R3FBasicsScene } from './R3FBasicsScene';
import { R3FMaterialsScene } from './R3FMaterialsScene';
import { R3FGeometriesScene } from './R3FGeometriesScene';
import { R3FAnimationScene } from './R3FAnimationScene';
import { R3FInteractionScene } from './R3FInteractionScene';
import { ShowcaseScene } from './ShowcaseScene';
import type { LightConfig } from '../types';

interface PersistentSceneProps {
  mode: SlideMode;
  showcaseTexture: string;
  autoRotate: boolean;
  directionalLightPosition?: [number, number, number];
  directionalLightIntensity?: number;
  isVisible?: boolean;
  boxCount?: number;
}

export function PersistentScene({
  mode,
  showcaseTexture,
  autoRotate,
  directionalLightPosition,
  directionalLightIntensity,
  isVisible = true,
  boxCount = 1,
}: PersistentSceneProps) {
  // Use correct types for refs based on their respective scene root elements
  const showcaseRef = useRef<THREE.Group>(null);
  const threejsIntroRef = useRef<THREE.Group>(null);
  const r3fFirstSceneRef = useRef<THREE.Mesh>(null);
  const r3fBasicsRef = useRef<THREE.Group>(null); // Matches R3FBasicsScene's group
  const r3fMaterialsRef = useRef<THREE.Group>(null);
  const r3fGeometriesRef = useRef<THREE.Group>(null);
  const r3fAnimationRef = useRef<THREE.Mesh>(null);
  const r3fInteractionRef = useRef<THREE.Mesh>(null);

  const lightConfig: LightConfig = {
    directionalLightPosition,
    directionalLightIntensity,
  };

  // Handle animations - pause when not visible
  useSceneAnimation({
    mode,
    autoRotate,
    isVisible,
    refs: {
      showcase: showcaseRef,
      threejsIntro: threejsIntroRef,
      r3fFirstScene: r3fFirstSceneRef,
      r3fBasics: r3fBasicsRef,
      r3fMaterials: r3fMaterialsRef,
      r3fGeometries: r3fGeometriesRef,
      r3fAnimation: r3fAnimationRef,
      r3fInteraction: r3fInteractionRef,
    },
  });

  // Enable OrbitControls for intro slides and everything from R3F Basics onwards
  // As requested, we introduce camera controls early to allow exploration
  const enableOrbit = [
    'intro', 'vertices', 'edges', 'faces', 
    'r3f-basics', 'r3f-first-scene', 'r3f-geometries', 
    'r3f-materials', 'r3f-animation', 'r3f-interaction', 'showcase'
  ].includes(mode);

  return (
    <>
      <SceneLights lightConfig={lightConfig} mode={mode} />

      {/* Only render the active scene to reduce render overhead */}
      {mode === 'intro' && <IntroScene />}
      {mode === 'vertices' && <VerticesScene />}
      {mode === 'edges' && <EdgesScene />}
      {mode === 'faces' && <FacesScene />}
      {mode === 'threejs-intro' && <ThreeJSIntroScene ref={threejsIntroRef} />}
      {mode === 'r3f-first-scene' && <R3FFirstScene ref={r3fFirstSceneRef} />}
      {mode === 'r3f-basics' && <R3FBasicsScene ref={r3fBasicsRef} boxCount={boxCount} />}
      {mode === 'r3f-materials' && <R3FMaterialsScene ref={r3fMaterialsRef} />}
      {mode === 'r3f-geometries' && <R3FGeometriesScene ref={r3fGeometriesRef} />}
      {mode === 'r3f-animation' && <R3FAnimationScene ref={r3fAnimationRef} />}
      {mode === 'r3f-interaction' && <R3FInteractionScene ref={r3fInteractionRef} />}
      {mode === 'showcase' && <ShowcaseScene texturePath={showcaseTexture} ref={showcaseRef} />}

      {enableOrbit && (
        <OrbitControls makeDefault enableZoom={true} enablePan={true} autoRotate={autoRotate} />
      )}
    </>
  );
}
