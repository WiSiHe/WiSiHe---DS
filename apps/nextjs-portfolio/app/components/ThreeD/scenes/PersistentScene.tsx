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
import { ShowcaseScene } from './ShowcaseScene';
import type { LightConfig } from '../types';

interface PersistentSceneProps {
  mode: SlideMode;
  showcaseTexture: string;
  autoRotate: boolean;
  directionalLightPosition?: [number, number, number];
  directionalLightIntensity?: number;
}

export function PersistentScene({
  mode,
  showcaseTexture,
  autoRotate,
  directionalLightPosition,
  directionalLightIntensity,
}: PersistentSceneProps) {
  const showcaseRef = useRef<THREE.Group>(null);
  const threejsIntroRef = useRef<THREE.Group>(null);
  const r3fFirstSceneRef = useRef<THREE.Mesh>(null);
  const r3fBasicsRef = useRef<THREE.Mesh>(null);
  const r3fMaterialsRef = useRef<THREE.Group>(null);
  const r3fGeometriesRef = useRef<THREE.Group>(null);

  const lightConfig: LightConfig = {
    directionalLightPosition,
    directionalLightIntensity,
  };

  // Handle animations
  useSceneAnimation({
    mode,
    autoRotate,
    refs: {
      showcase: showcaseRef,
      threejsIntro: threejsIntroRef,
      r3fFirstScene: r3fFirstSceneRef,
      r3fBasics: r3fBasicsRef,
      r3fMaterials: r3fMaterialsRef,
      r3fGeometries: r3fGeometriesRef,
    },
  });

  return (
    <>
      <SceneLights lightConfig={lightConfig} />

      {/* Route to appropriate scene based on mode */}
      {mode === 'intro' && <IntroScene />}
      {mode === 'vertices' && <VerticesScene />}
      {mode === 'edges' && <EdgesScene />}
      {mode === 'faces' && <FacesScene />}
      {mode === 'threejs-intro' && <ThreeJSIntroScene ref={threejsIntroRef} />}
      {mode === 'r3f-first-scene' && <R3FFirstScene ref={r3fFirstSceneRef} />}
      {mode === 'r3f-basics' && <R3FBasicsScene ref={r3fBasicsRef} />}
      {mode === 'r3f-materials' && <R3FMaterialsScene ref={r3fMaterialsRef} />}
      {mode === 'r3f-geometries' && <R3FGeometriesScene ref={r3fGeometriesRef} />}
      {mode === 'showcase' && <ShowcaseScene texturePath={showcaseTexture} ref={showcaseRef} />}

      <OrbitControls makeDefault enableZoom={true} enablePan={true} />
    </>
  );
}
