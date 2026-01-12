import type * as THREE from 'three';

// Three.js type extensions for better type safety
export interface ThreeMesh extends THREE.Mesh {
  material: THREE.Material | THREE.Material[];
  geometry: THREE.BufferGeometry;
}

export interface ThreeMaterial extends Omit<THREE.Material, 'needsUpdate'> {
  needsUpdate?: boolean;
  map?: THREE.Texture | null;
}

export interface GLTFScene extends THREE.Group {
  traverse: (callback: (object: THREE.Object3D) => void) => void;
}

export interface GLTFResult {
  scene: GLTFScene;
  materials?: Record<string, ThreeMaterial>;
  nodes?: Record<string, ThreeMesh>;
}

// Type guard for checking if object is a mesh
export function isMesh(object: THREE.Object3D): object is ThreeMesh {
  return (object as ThreeMesh).isMesh === true;
}

// Type guard for checking if material is an array
export function isMaterialArray(
  material: THREE.Material | THREE.Material[],
): material is THREE.Material[] {
  return Array.isArray(material);
}
