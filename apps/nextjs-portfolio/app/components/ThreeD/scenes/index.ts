// Preload the beer can model
import { useGLTF } from '@react-three/drei';
import { useTexture } from '@react-three/drei';
import { TEXTURE_OPTIONS } from '../constants';

// Preload the beer can model
if (typeof globalThis.window !== 'undefined') {
  useGLTF.preload('/beer2.gltf');
}

// Preload all textures to enable caching
if (typeof globalThis.window !== 'undefined') {
  TEXTURE_OPTIONS.forEach(({ value: path }) => {
    try {
      useTexture.preload(path);
    } catch (error) {
      console.warn(`Failed to preload texture ${path}:`, error);
    }
  });
}

// Export all scenes
export { PersistentScene } from './PersistentScene';
export { SceneLights } from './SceneLights';
export { BeerCanScene } from './BeerCanScene';
export { IntroScene } from './IntroScene';
export { VerticesScene } from './VerticesScene';
export { EdgesScene } from './EdgesScene';
export { FacesScene } from './FacesScene';
export { ThreeJSIntroScene } from './ThreeJSIntroScene';
export { R3FFirstScene } from './R3FFirstScene';
export { R3FBasicsScene } from './R3FBasicsScene';
export { R3FMaterialsScene } from './R3FMaterialsScene';
export { R3FGeometriesScene } from './R3FGeometriesScene';
export { ShowcaseScene } from './ShowcaseScene';
