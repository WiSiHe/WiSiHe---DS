'use client';

import { forwardRef } from 'react';
import type * as THREE from 'three';
import { COLORS, MATERIAL_PROPERTIES } from '../constants';

export const ThreeJSIntroScene = forwardRef<THREE.Group>((_props, ref) => {
  return (
    <group ref={ref}>
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={COLORS.blue}
          metalness={MATERIAL_PROPERTIES.standard.metalness}
          roughness={MATERIAL_PROPERTIES.standard.roughness}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color={COLORS.green}
          metalness={MATERIAL_PROPERTIES.standard.metalness}
          roughness={MATERIAL_PROPERTIES.standard.roughness}
        />
      </mesh>
      <mesh position={[2, 0, 0]}>
        <torusGeometry args={[0.5, 0.2, 16, 100]} />
        <meshStandardMaterial
          color={COLORS.purple}
          metalness={MATERIAL_PROPERTIES.standard.metalness}
          roughness={MATERIAL_PROPERTIES.standard.roughness}
        />
      </mesh>
    </group>
  );
});

ThreeJSIntroScene.displayName = 'ThreeJSIntroScene';
