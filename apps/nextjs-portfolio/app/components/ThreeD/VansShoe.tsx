'use client';

import React from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { isMesh, type ThreeMesh, type ThreeMaterial } from './types';

interface VansShoeProps {
  color: string;
  [key: string]: unknown;
}

export default function VansShoe({ color, ...props }: VansShoeProps) {
  const { scene } = useGLTF('/VansShoe.glb') as { scene: THREE.Group };

  // Use layout effect to apply colors to the materials.
  // We traverse the scene to find all meshes and their materials.
  React.useLayoutEffect(() => {
    scene.traverse((obj) => {
      if (isMesh(obj)) {
        // Apply shadow properties to everything
        obj.castShadow = true;
        obj.receiveShadow = true;

        const material = obj.material as ThreeMaterial;

        // Target specific material from Blender: "Blue_Vans_Shoe"
        if (material.name === 'Blue_Vans_Shoe') {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.color.set(color);
          }
        }

        // If there are other "shoe" materials that should be tinted
        if (
          material.name.toLowerCase().includes('canvas') ||
          material.name.toLowerCase().includes('suede')
        ) {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.color.set(color);
          }
        }
      }
    });
  }, [scene, color]);

  return (
    <group {...props} dispose={null} rotation={[0, -Math.PI / 1.5, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/VansShoe.glb');
