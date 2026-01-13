'use client';

import { DEFAULT_LIGHT_POSITION, DEFAULT_LIGHT_INTENSITY } from '../constants';
import type { LightConfig } from '../types';

interface SceneLightsProps {
  lightConfig?: LightConfig;
  mode?: string; // Pass mode to determine if showcase lighting should be used
}

export function SceneLights({ lightConfig, mode }: SceneLightsProps) {
  const directionalPosition = lightConfig?.directionalLightPosition ?? DEFAULT_LIGHT_POSITION;
  const directionalIntensity = lightConfig?.directionalLightIntensity ?? DEFAULT_LIGHT_INTENSITY;
  const isShowcase = mode === 'showcase';

  return (
    <>
      {/* Ambient light - slightly reduced for showcase for better contrast */}
      <ambientLight intensity={isShowcase ? 0.4 : 0.5} />
      
      {/* Primary directional light - main light source */}
      <directionalLight position={directionalPosition} intensity={directionalIntensity} />
      
      {/* Rim light for showcase - adds depth and separation from background */}
      {isShowcase && (
        <directionalLight position={[-5, 5, -5]} intensity={0.6} />
      )}
      
      {/* Fill light - subtle point light for overall illumination */}
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
    </>
  );
}
