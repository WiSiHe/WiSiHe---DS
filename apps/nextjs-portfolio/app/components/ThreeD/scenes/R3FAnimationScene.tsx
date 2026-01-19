'use client';

import { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const R3FAnimationScene = forwardRef<THREE.Mesh>((props, ref) => {
  const internalRef = useRef<THREE.Mesh>(null);
  const meshRef = (ref as React.RefObject<THREE.Mesh>) || internalRef;

  // The useFrame hook runs on every single frame render
  // state: contains clock, mouse, viewport, etc.
  // delta: time since last frame (for smooth animation regardless of framerate)
  useFrame((state, delta) => {
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
      <meshStandardMaterial color="orange" />
    </mesh>
  );
});

R3FAnimationScene.displayName = 'R3FAnimationScene';
