'use client';

import { DEFAULT_LIGHT_POSITION, DEFAULT_LIGHT_INTENSITY } from '../constants';
import type { LightConfig } from '../types';

interface SceneLightsProps {
  lightConfig?: LightConfig;
}

export function SceneLights({ lightConfig }: SceneLightsProps) {
  const directionalPosition = lightConfig?.directionalLightPosition ?? DEFAULT_LIGHT_POSITION;
  const directionalIntensity = lightConfig?.directionalLightIntensity ?? DEFAULT_LIGHT_INTENSITY;

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={directionalPosition} intensity={directionalIntensity} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
    </>
  );
}
