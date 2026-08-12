// Preload the beer can model
import { useGLTF, useTexture } from '@react-three/drei';
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

export { BeerCanScene } from './BeerCanScene';
export { EdgesScene } from './EdgesScene';
export { FacesScene } from './FacesScene';
export { IntroScene } from './IntroScene';
// Export all scenes
export { PersistentScene } from './PersistentScene';
export { R3FAnimationScene } from './R3FAnimationScene';
export { R3FBasicsScene } from './R3FBasicsScene';
export { R3FFirstScene } from './R3FFirstScene';
export { R3FGeometriesScene } from './R3FGeometriesScene';
export { R3FInteractionScene } from './R3FInteractionScene';
export { R3FMaterialsScene } from './R3FMaterialsScene';
export { SceneLights } from './SceneLights';
export { ShowcaseScene } from './ShowcaseScene';
export { ThreeJSIntroScene } from './ThreeJSIntroScene';
export { VerticesScene } from './VerticesScene';
