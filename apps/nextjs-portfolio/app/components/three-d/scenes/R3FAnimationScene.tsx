'use client';

import { useFrame } from '@react-three/fiber';
import { forwardRef, useRef } from 'react';
import type * as THREE from 'three';

export const R3FAnimationScene = forwardRef<THREE.Mesh>((_props, ref) => {
  const internalRef = useRef<THREE.Mesh>(null);
  const meshRef = (ref as React.RefObject<THREE.Mesh>) || internalRef;

  // The useFrame hook runs on every single frame render
  // delta: time since last frame in seconds (recommended over deprecated THREE.Clock)
  useFrame((_state, delta) => {
    // Check if ref is attached
    if (meshRef.current) {
      // Rotate the mesh slightly every frame
      // Using delta ensures rotation speed is consistent on all devices
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color='orange' />
    </mesh>
  );
});

R3FAnimationScene.displayName = 'R3FAnimationScene';
