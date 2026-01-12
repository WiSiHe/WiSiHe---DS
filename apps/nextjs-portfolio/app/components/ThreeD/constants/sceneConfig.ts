import { DEFAULT_LIGHT_POSITION, DEFAULT_LIGHT_INTENSITY } from './index';

// Scene configuration constants
export const SCENE_CONFIG = {
  ambientLight: {
    intensity: 0.5,
  },
  directionalLight: {
    position: DEFAULT_LIGHT_POSITION,
    intensity: DEFAULT_LIGHT_INTENSITY,
  },
  pointLight: {
    position: [-10, -10, -5] as [number, number, number],
    intensity: 0.5,
  },
} as const;
