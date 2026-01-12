'use client';

import { forwardRef } from 'react';
import * as THREE from 'three';
import { COLORS } from '../constants';

export const R3FBasicsScene = forwardRef<THREE.Mesh>((props, ref) => {
  return (
    <mesh ref={ref} position={[1, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={COLORS.hotpink} />
    </mesh>
  );
});

R3FBasicsScene.displayName = 'R3FBasicsScene';
