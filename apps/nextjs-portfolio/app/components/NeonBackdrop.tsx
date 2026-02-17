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
          timeSpeed={isDarkMode ? 0.2 : 0.28}
          colorBalance={isDarkMode ? -0.08 : 0.12}
          warpStrength={isDarkMode ? 0.92 : 1.08}
          warpFrequency={isDarkMode ? 4.7 : 5.3}
          warpSpeed={isDarkMode ? 1.7 : 2.2}
          warpAmplitude={isDarkMode ? 44 : 54}
          blendAngle={isDarkMode ? -12 : 8}
          blendSoftness={0.2}
          rotationAmount={420}
          noiseScale={2.2}
          grainAmount={isDarkMode ? 0.055 : 0.075}
          grainScale={2.4}
          grainAnimated
          contrast={isDarkMode ? 1.32 : 1.44}
          gamma={1.0}
          saturation={isDarkMode ? 1.14 : 1.22}
          zoom={0.94}
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
