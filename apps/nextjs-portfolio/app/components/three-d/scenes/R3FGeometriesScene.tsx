'use client';

import { forwardRef } from 'react';
import type * as THREE from 'three';
import { COLORS } from '../constants';

export const R3FGeometriesScene = forwardRef<THREE.Group>((_props, ref) => {
  return (
    <group ref={ref}>
      <mesh position={[-2.5, 0, 0]}>
        <boxGeometry args={[1, 1.5, 0.5]} />
        <meshStandardMaterial color={COLORS.blue} />
      </mesh>
      <mesh position={[-0.8, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color={COLORS.green} />
      </mesh>
      <mesh position={[0.8, 0, 0]}>
        <torusGeometry args={[0.5, 0.15, 16, 100]} />
        <meshStandardMaterial color={COLORS.purple} />
      </mesh>
      <mesh position={[2.5, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshStandardMaterial color={COLORS.orange} />
      </mesh>
    </group>
  );
});

R3FGeometriesScene.displayName = 'R3FGeometriesScene';
