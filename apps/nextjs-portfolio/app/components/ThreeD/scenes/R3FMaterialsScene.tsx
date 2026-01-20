'use client';

import { forwardRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { COLORS } from '../constants';

export const R3FMaterialsScene = forwardRef<THREE.Group>((props, ref) => {
  // Using the requested earth texture
  const texture = useTexture('/images/earth-texture.jpg');

  return (
    <group ref={ref}>
      {/* Basic Material - No Lighting */}
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={COLORS.blue} />
      </mesh>

      {/* Standard Material - Metallic */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="gold"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Textured Material (Sphere for Earth) */}
      <mesh position={[2, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
});

R3FMaterialsScene.displayName = 'R3FMaterialsScene';
