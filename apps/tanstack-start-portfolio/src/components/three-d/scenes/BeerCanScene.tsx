'use client';

import { useGLTF, useTexture } from '@react-three/drei';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { isMaterialArray, isMesh, type ThreeMaterial } from '../types';

interface BeerCanSceneProps {
  texturePath: string;
}

export const BeerCanScene = forwardRef<THREE.Group, BeerCanSceneProps>(({ texturePath }, ref) => {
  const { scene, materials } = useGLTF('/beer2.gltf') as {
    scene: THREE.Group;
    materials?: Record<string, ThreeMaterial>;
  };
  const texture = useTexture(texturePath);
  const previousTextureRef = useRef<THREE.Texture | null>(null);

  // Optimize texture settings to reduce memory usage
  useLayoutEffect(() => {
    if (!texture) return;

    // Fix upside down texture - WebGL uses bottom-left origin, images use top-left
    texture.flipY = false;

    // Set texture filtering to reduce GPU memory
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;

    // Limit texture size if too large (max 2048x2048)
    if (texture.image && typeof texture.image === 'object' && texture.image !== null) {
      const image = texture.image as { width?: number; height?: number };
      if (image.width && image.height) {
        const maxSize = 2048;
        if (image.width > maxSize || image.height > maxSize) {
          console.warn(
            `Texture ${texturePath} is ${image.width}x${image.height}, larger than recommended ${maxSize}x${maxSize}`,
          );
        }

        // Log texture memory estimate for monitoring
        const memoryEstimate = (image.width * image.height * 4) / 1024 / 1024; // MB
        console.debug(
          `Texture ${texturePath} loaded: ${image.width}x${image.height} (~${memoryEstimate.toFixed(2)} MB)`,
        );
      }
    }
  }, [texture, texturePath]);

  // Apply texture to the model's materials with proper cleanup
  useLayoutEffect(() => {
    if (!texture) return;

    // Cleanup previous texture if it changed (only from Can materials)
    if (previousTextureRef.current && previousTextureRef.current !== texture) {
      scene.traverse(obj => {
        if (isMesh(obj) && obj.material) {
          // Remove old texture from materials
          if (isMaterialArray(obj.material)) {
            // Only remove from first material (Can)
            if (
              obj.material.length > 0 &&
              obj.material[0] instanceof THREE.MeshStandardMaterial &&
              obj.material[0].map === previousTextureRef.current
            ) {
              obj.material[0].map = null;
              obj.material[0].needsUpdate = true;
            }
          } else {
            const mat = obj.material as ThreeMaterial;
            const isCanMaterial =
              mat.name === 'Can' ||
              (materials?.Can && mat === materials.Can) ||
              (mat instanceof THREE.MeshStandardMaterial &&
                mat.map !== null &&
                mat.map !== undefined);
            const isExcludedMaterial = mat.name === 'Metal' || mat.name === 'Material';

            if (
              isCanMaterial &&
              !isExcludedMaterial &&
              mat instanceof THREE.MeshStandardMaterial &&
              mat.map === previousTextureRef.current
            ) {
              mat.map = null;
              mat.needsUpdate = true;
            }
          }
        }
      });
    }

    // Apply new texture only to the "Can" material
    scene.traverse(obj => {
      if (isMesh(obj) && obj.material) {
        if (isMaterialArray(obj.material)) {
          // For material arrays, apply texture only to the first material (Can)
          if (obj.material.length > 0) {
            const canMaterial = obj.material[0];
            if (canMaterial instanceof THREE.MeshStandardMaterial) {
              canMaterial.map = texture;
              canMaterial.needsUpdate = true;
            }
          }
        } else {
          const mat = obj.material as ThreeMaterial;
          const isCanMaterial =
            mat.name === 'Can' ||
            (materials?.Can && mat === materials.Can) ||
            (mat instanceof THREE.MeshStandardMaterial &&
              mat.map !== null &&
              mat.map !== undefined);
          const isExcludedMaterial = mat.name === 'Metal' || mat.name === 'Material';

          if (isCanMaterial && !isExcludedMaterial && mat instanceof THREE.MeshStandardMaterial) {
            mat.map = texture;
            mat.needsUpdate = true;
          }
        }
      }
    });

    // Store current texture as previous for next change
    previousTextureRef.current = texture;
  }, [scene, texture, materials]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Remove texture from materials on unmount (only from Can materials)
      if (previousTextureRef.current) {
        scene.traverse(obj => {
          if (isMesh(obj) && obj.material) {
            if (isMaterialArray(obj.material)) {
              // Only remove from first material (Can)
              if (
                obj.material.length > 0 &&
                obj.material[0] instanceof THREE.MeshStandardMaterial &&
                obj.material[0].map === previousTextureRef.current
              ) {
                obj.material[0].map = null;
                obj.material[0].needsUpdate = true;
              }
            } else {
              const mat = obj.material as ThreeMaterial;
              const isCanMaterial =
                mat.name === 'Can' ||
                (materials?.Can && mat === materials.Can) ||
                (mat instanceof THREE.MeshStandardMaterial &&
                  mat.map !== null &&
                  mat.map !== undefined);
              const isExcludedMaterial = mat.name === 'Metal' || mat.name === 'Material';

              if (
                isCanMaterial &&
                !isExcludedMaterial &&
                mat instanceof THREE.MeshStandardMaterial &&
                mat.map === previousTextureRef.current
              ) {
                mat.map = null;
                mat.needsUpdate = true;
              }
            }
          }
        });
      }
    };
  }, [scene, materials]);

  return (
    <group ref={ref} dispose={null}>
      <primitive object={scene} dispose={null} />
    </group>
  );
});

BeerCanScene.displayName = 'BeerCanScene';
