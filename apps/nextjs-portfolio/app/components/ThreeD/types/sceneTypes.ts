import type * as THREE from 'three';
import type { SlideMode } from '../../../three-d/types';

// Light configuration interface
export interface LightConfig {
  directionalLightPosition?: [number, number, number];
  directionalLightIntensity?: number;
}

// Scene props interface
export interface SceneProps {
  mode: SlideMode;
  autoRotate?: boolean;
  lightConfig?: LightConfig;
}

// Showcase scene props
export interface ShowcaseSceneProps extends SceneProps {
  texturePath: string;
}

// Animation config for scenes
export interface AnimationConfig {
  speed: number;
  axis?: 'x' | 'y' | 'z';
}

// Scene refs type
export type SceneRef = THREE.Group | THREE.Mesh | null;

// Showcase controls interface
export interface ShowcaseControls {
  texture: string;
  onTextureChange: (texture: string) => void;
  textureOptions: Array<{ name: string; value: string }>;
  autoRotate: boolean;
  onAutoRotateChange: (enabled: boolean) => void;
}

// Light controls interface
export interface LightControls {
  directionalLightPosition: [number, number, number];
  onDirectionalLightPositionChange: (position: [number, number, number]) => void;
  directionalLightIntensity: number;
  onDirectionalLightIntensityChange: (intensity: number) => void;
}
