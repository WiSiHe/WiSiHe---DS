'use client';

import { useMemo, forwardRef } from 'react';
import * as THREE from 'three';
import { COLORS, MATERIAL_PROPERTIES } from '../constants';
import { createCheckerboardTexture } from '../utils/textureUtils';

export const R3FMaterialsScene = forwardRef<THREE.Group>((props, ref) => {
  const checkerboardTexture = useMemo(
    () => createCheckerboardTexture({ color1: COLORS.purple, color2: '#6d28d9' }),
    [],
  );

  return (
    <group ref={ref}>
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={COLORS.blue} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="gold"
          metalness={MATERIAL_PROPERTIES.metallic.metalness}
          roughness={MATERIAL_PROPERTIES.metallic.roughness}
        />
      </mesh>
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={COLORS.purple}
          metalness={MATERIAL_PROPERTIES.standard.metalness}
          roughness={MATERIAL_PROPERTIES.standard.roughness}
          map={checkerboardTexture}
        />
      </mesh>
    </group>
  );
});

R3FMaterialsScene.displayName = 'R3FMaterialsScene';
