'use client';

import { useMemo, useRef, useLayoutEffect, forwardRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Edges, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { SlideMode } from '../../three-d/types';
import { BEER_CAN_GEOMETRY, ANIMATION_SPEEDS, COLORS, MATERIAL_PROPERTIES } from './constants';
import { createCheckerboardTexture } from './utils/textureUtils';
import { getCssVariableAsHex } from './utils/colorUtils';
import { isMesh, isMaterialArray, type ThreeMaterial } from './threeTypes';

// Beer Can Component with Texture Swapping
const BeerCanWithTexture = forwardRef<THREE.Group, { texturePath: string }>(
  ({ texturePath }, ref) => {
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
        // Dispose old texture (useTexture handles disposal, but we ensure it's removed from materials first)
        // Note: useTexture from drei handles texture disposal automatically, but we need to remove it from materials
        try {
          if (previousTextureRef.current && previousTextureRef.current !== texture) {
            // Only dispose if it's not managed by useTexture (which handles its own disposal)
            // We're just ensuring it's removed from materials
          }
        } catch (error) {
          console.warn('Error cleaning up previous texture:', error);
        }
      }

      // Apply new texture only to the "Can" material
      // The GLTF has 3 materials: "Can" (0), "Metal" (1), and "Material" (2)
      // We only want to apply the texture to the "Can" material
      scene.traverse(obj => {
        if (isMesh(obj) && obj.material) {
          if (isMaterialArray(obj.material)) {
            // For material arrays, apply texture only to the first material (Can)
            // The first primitive uses material 0 (Can), second uses material 1 (Metal)
            if (obj.material.length > 0) {
              const canMaterial = obj.material[0];
              if (canMaterial instanceof THREE.MeshStandardMaterial) {
                canMaterial.map = texture;
                canMaterial.needsUpdate = true;
              }
            }
          } else {
            const mat = obj.material as ThreeMaterial;
            // Check if this is the Can material by name or by checking if it's the Can material from the materials object
            const isCanMaterial =
              mat.name === 'Can' ||
              (materials?.Can && mat === materials.Can) ||
              // If material already has a map, it's likely the Can material (from GLTF)
              (mat instanceof THREE.MeshStandardMaterial &&
                mat.map !== null &&
                mat.map !== undefined);

            // Exclude Metal and Material materials
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
    }, [scene, texture]);

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
    }, [scene]);

    return (
      <group ref={ref} dispose={null}>
        <primitive object={scene} dispose={null} />
      </group>
    );
  },
);

BeerCanWithTexture.displayName = 'BeerCanWithTexture';

export const PersistentScene = ({
  mode,
  showcaseTexture,
  autoRotate,
  directionalLightPosition = [10, 10, 5],
  directionalLightIntensity = 1,
}: {
  mode: SlideMode;
  showcaseTexture: string;
  autoRotate: boolean;
  directionalLightPosition?: [number, number, number];
  directionalLightIntensity?: number;
}) => {
  // Beer can geometry - cylinder for the can body
  const canGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(
      BEER_CAN_GEOMETRY.radiusTop,
      BEER_CAN_GEOMETRY.radiusBottom,
      BEER_CAN_GEOMETRY.height,
      BEER_CAN_GEOMETRY.radialSegments,
    );
  }, []);

  const pointsGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(
      BEER_CAN_GEOMETRY.radiusTop,
      BEER_CAN_GEOMETRY.radiusBottom,
      BEER_CAN_GEOMETRY.height,
      BEER_CAN_GEOMETRY.radialSegments,
    );
    const positions = geometry.attributes.position.array;
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    // Dispose the temporary geometry
    geometry.dispose();
    return bufferGeometry;
  }, []);

  const edgesGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(
      BEER_CAN_GEOMETRY.radiusTop,
      BEER_CAN_GEOMETRY.radiusBottom,
      BEER_CAN_GEOMETRY.height,
      BEER_CAN_GEOMETRY.radialSegments,
    );
    return new THREE.EdgesGeometry(geometry);
  }, []);

  const showcaseRef = useRef<THREE.Group>(null);
  const threejsIntroRef = useRef<THREE.Group>(null);
  const r3fFirstSceneRef = useRef<THREE.Mesh>(null);
  const r3fBasicsRef = useRef<THREE.Mesh>(null);
  const r3fMaterialsRef = useRef<THREE.Group>(null);
  const r3fGeometriesRef = useRef<THREE.Group>(null);

  // Checkerboard texture for materials mode - must be at top level (Rules of Hooks)
  const checkerboardTexture = useMemo(
    () => createCheckerboardTexture({ color1: COLORS.purple, color2: '#6d28d9' }),
    [],
  );

  // Auto-rotation animations
  useFrame(state => {
    const elapsedTime = state.clock.elapsedTime;

    if (mode === 'showcase' && showcaseRef.current && autoRotate) {
      // Rotate only on Y-axis (vertical rotation) for beer can
      showcaseRef.current.rotation.y = elapsedTime * ANIMATION_SPEEDS.showcase.y;
    }
    if (mode === 'threejs-intro' && threejsIntroRef.current) {
      threejsIntroRef.current.rotation.y = elapsedTime * ANIMATION_SPEEDS.threejsIntro.y;
    }
    if (mode === 'r3f-first-scene' && r3fFirstSceneRef.current) {
      r3fFirstSceneRef.current.rotation.y = elapsedTime * ANIMATION_SPEEDS.r3fFirstScene.y;
    }
    if (mode === 'r3f-basics' && r3fBasicsRef.current) {
      r3fBasicsRef.current.rotation.y = elapsedTime * ANIMATION_SPEEDS.r3fBasics.y;
    }
    if (mode === 'r3f-materials' && r3fMaterialsRef.current) {
      r3fMaterialsRef.current.rotation.y = elapsedTime * ANIMATION_SPEEDS.r3fMaterials.y;
    }
    if (mode === 'r3f-geometries' && r3fGeometriesRef.current) {
      r3fGeometriesRef.current.rotation.y = elapsedTime * ANIMATION_SPEEDS.r3fGeometries.y;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={directionalLightPosition} intensity={directionalLightIntensity} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Three.js Intro Mode - Multiple Geometric Shapes */}
      {mode === 'threejs-intro' && (
        <group ref={threejsIntroRef}>
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
      )}

      {/* Intro Mode - Beer Can */}
      {mode === 'intro' && (
        <mesh geometry={canGeometry}>
          <meshStandardMaterial
            color={COLORS.gold}
            metalness={MATERIAL_PROPERTIES.metallic.metalness}
            roughness={MATERIAL_PROPERTIES.metallic.roughness}
          />
        </mesh>
      )}

      {/* Vertices Mode - Points */}
      {mode === 'vertices' && (
        <points geometry={pointsGeometry}>
          <pointsMaterial size={0.05} color={COLORS.green} sizeAttenuation />
        </points>
      )}

      {/* Edges Mode - Wireframe */}
      {mode === 'edges' && (
        <mesh geometry={canGeometry}>
          <meshBasicMaterial transparent opacity={0} />
          <Edges color={COLORS.blue} threshold={0} />
        </mesh>
      )}

      {/* Faces Mode - Solid Beer Can */}
      {mode === 'faces' && (
        <mesh geometry={canGeometry}>
          <meshStandardMaterial
            color={getCssVariableAsHex('--color-accent', COLORS.teal)}
            metalness={MATERIAL_PROPERTIES.metallic.metalness}
            roughness={MATERIAL_PROPERTIES.metallic.roughness}
          />
          <Edges geometry={edgesGeometry} color="#000000" threshold={0} />
        </mesh>
      )}

      {/* Showcase Mode - Interactive Beer Can with Texture Swapping */}
      {mode === 'showcase' && (
        <BeerCanWithTexture ref={showcaseRef} texturePath={showcaseTexture} />
      )}

      {/* R3F First Scene Mode - Basic box with lights */}
      {mode === 'r3f-first-scene' && (
        <>
          <mesh ref={r3fFirstSceneRef}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial />
          </mesh>
          <ambientLight intensity={0.1} />
          <directionalLight position={[0, 0, 5]} color="red" intensity={0.8} />
        </>
      )}

      {/* R3F Basics Mode - Show props and transformations */}
      {mode === 'r3f-basics' && (
        <mesh ref={r3fBasicsRef} position={[1, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color={COLORS.hotpink} />
        </mesh>
      )}

      {/* R3F Materials Mode - Show different material types and textures */}
      {mode === 'r3f-materials' && (
        <group ref={r3fMaterialsRef}>
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
      )}

      {/* R3F Geometries Mode - Show different shapes */}
      {mode === 'r3f-geometries' && (
        <group ref={r3fGeometriesRef}>
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
      )}

      <OrbitControls makeDefault enableZoom={true} enablePan={true} />
    </>
  );
};

// Preload the beer can model
useGLTF.preload('/beer2.gltf');

// Preload all textures to enable caching
const texturePaths = [
  '/Regular - texture.jpg',
  '/Blueberry - texture.jpg',
  '/Mango - texture.jpg',
  '/Bearnaise - texture.jpg',
];

// Preload textures at module level (runs once when module loads)
// This ensures textures are loaded and cached before use to prevent context loss
if (globalThis.window !== undefined) {
  texturePaths.forEach(path => {
    try {
      useTexture.preload(path);
    } catch (error) {
      console.warn(`Failed to preload texture ${path}:`, error);
    }
  });
}
