import { Environment } from '@react-three/drei';
import { DEFAULT_LIGHT_INTENSITY, DEFAULT_LIGHT_POSITION } from '../constants';
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
      <Environment preset='city' />
      <ambientLight intensity={isShowcase ? 0.3 : 0.4} />
      <directionalLight position={directionalPosition} intensity={directionalIntensity} />

      {isShowcase && <directionalLight position={[-5, 5, -5]} intensity={0.6} />}

      <pointLight position={[-10, -10, -5]} intensity={0.3} />
    </>
  );
}
