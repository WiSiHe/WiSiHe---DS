'use client';

import { useTheme } from '@/app/providers';
import Grainient from '@/components/Grainient';

const NeonBackdrop = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  return (
    <div aria-hidden="true" className="neon-backdrop">
      <div className="grainient-layer">
        <Grainient
          key={resolvedTheme ?? 'light'}
          className="grainient-canvas"
          timeSpeed={isDarkMode ? 0.1 : 0.13}
          colorBalance={isDarkMode ? -0.02 : 0.03}
          warpStrength={isDarkMode ? 0.44 : 0.52}
          warpFrequency={isDarkMode ? 3.4 : 3.8}
          warpSpeed={isDarkMode ? 0.85 : 1.05}
          warpAmplitude={isDarkMode ? 74 : 84}
          blendAngle={isDarkMode ? -8 : 6}
          blendSoftness={0.32}
          rotationAmount={220}
          noiseScale={1.35}
          grainAmount={isDarkMode ? 0.12 : 0.1}
          grainScale={2.9}
          grainAnimated
          contrast={isDarkMode ? 1.08 : 1.1}
          gamma={1.0}
          saturation={isDarkMode ? 0.88 : 0.92}
          zoom={1.06}
          color1="var(--color-accent)"
          color2="var(--color-info)"
          color3="var(--color-success)"
        />
      </div>
      <div className="grainient-vignette" />
      <div className="neon-blob neon-blob--1" />
      <div className="neon-blob neon-blob--2" />
      <div className="neon-blob neon-blob--3" />
    </div>
  );
};

export default NeonBackdrop;
