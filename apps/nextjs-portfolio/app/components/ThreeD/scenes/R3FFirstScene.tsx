'use client';

import { forwardRef } from 'react';
import * as THREE from 'three';

export const R3FFirstScene = forwardRef<THREE.Mesh>((props, ref) => {
  return (
    <>
      <mesh ref={ref}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial />
      </mesh>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="red" intensity={0.8} />
    </>
  );
});

R3FFirstScene.displayName = 'R3FFirstScene';
