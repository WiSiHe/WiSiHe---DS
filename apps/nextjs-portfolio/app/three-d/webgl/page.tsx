'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { BenchmarkHUD } from '@/app/components/three-d/benchmark/BenchmarkHUD';
import { ComparisonSwitcher } from '@/app/components/three-d/benchmark/ComparisonSwitcher';
import {
  type BenchmarkConfig,
  DEFAULT_CONFIG,
  normalizePalette,
  normalizeShape,
} from '@/app/components/three-d/benchmark/types';
import { useBenchmarkStats } from '@/app/components/three-d/benchmark/useBenchmarkStats';

// Dynamically import the WebGL Canvas with SSR disabled
const DynamicWebGLCanvas = dynamic(
  () => import('@/app/components/three-d/benchmark/WebGLCanvas').then(mod => mod.WebGLCanvas),
  {
    ssr: false,
    loading: () => (
      <div className='flex h-full w-full items-center justify-center bg-[#0d0402] text-amber-400 font-mono text-sm'>
        <div className='flex flex-col items-center gap-3'>
          <div className='size-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent' />
          <span>Initializing Three.js WebGL Pipeline...</span>
        </div>
      </div>
    ),
  },
);

function WebGLContent() {
  const searchParams = useSearchParams();

  // Read initial configuration from URL params or fallback to defaults
  const [config, setConfig] = useState<BenchmarkConfig>(() => {
    const countParam = searchParams.get('count');
    const speedParam = searchParams.get('speed');
    const sizeParam = searchParams.get('size');
    const radiusParam = searchParams.get('radius');
    const shapeParam = searchParams.get('shape');

    return {
      count: countParam ? parseInt(countParam, 10) : DEFAULT_CONFIG.count,
      palette: normalizePalette(searchParams.get('palette')),
      shape: normalizeShape(shapeParam),
      speed: speedParam ? parseFloat(speedParam) : DEFAULT_CONFIG.speed,
      particleSize: sizeParam ? parseFloat(sizeParam) : DEFAULT_CONFIG.particleSize,
      orbRadius: radiusParam ? parseFloat(radiusParam) : DEFAULT_CONFIG.orbRadius,
    };
  });

  const { metrics, recordFrame } = useBenchmarkStats(false);
  const [resetKey, setResetKey] = useState(0);
  const handleReset = () => setResetKey(k => k + 1);

  // Sync state changes with URL query parameters
  const handleConfigChange = (newConfig: Partial<BenchmarkConfig>) => {
    const next = { ...config, ...newConfig };
    setConfig(next);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      params.set('count', next.count.toString());
      params.set('palette', next.palette);
      params.set('shape', next.shape);
      params.set('speed', next.speed.toString());
      params.set('size', next.particleSize.toString());
      params.set('radius', next.orbRadius.toString());
      window.history.replaceState(null, '', `/three-d/webgl?${params.toString()}`);
    }
  };

  return (
    <main className='relative h-screen w-screen overflow-hidden select-none'>
      {/* Top Bar Switcher */}
      <ComparisonSwitcher isWebGPU={false} />

      {/* Fullscreen 3D WebGL Canvas */}
      <DynamicWebGLCanvas config={config} onFrame={recordFrame} resetKey={resetKey} />

      {/* Performance & Configuration HUD */}
      <BenchmarkHUD
        metrics={metrics}
        config={config}
        onChangeConfig={handleConfigChange}
        onReset={handleReset}
        isWebGPU={false}
      />
    </main>
  );
}

export default function WebGLPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen w-screen items-center justify-center bg-[#0d0402] text-amber-400 font-mono text-sm'>
          Loading WebGL Benchmark...
        </div>
      }
    >
      <WebGLContent />
    </Suspense>
  );
}
