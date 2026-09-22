'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { BenchmarkHUD } from '@/app/components/three-d/benchmark/BenchmarkHUD';
import { ComparisonSwitcher } from '@/app/components/three-d/benchmark/ComparisonSwitcher';
import {
  type BenchmarkConfig,
  clampCountForBackend,
  DEFAULT_CONFIG,
  normalizePalette,
  normalizeShape,
} from '@/app/components/three-d/benchmark/types';
import { useBenchmarkStats } from '@/app/components/three-d/benchmark/useBenchmarkStats';
import { WebGPUSupportBanner } from '@/app/components/three-d/benchmark/WebGPUSupportBanner';

// Dynamically import the WebGPU Canvas with SSR disabled to protect browser APIs
const DynamicWebGPUCanvas = dynamic(
  () => import('@/app/components/three-d/benchmark/WebGPUCanvas').then(mod => mod.WebGPUCanvas),
  {
    ssr: false,
    loading: () => (
      <div className='flex h-full w-full items-center justify-center bg-[#04050d] text-cyan-400 font-mono text-sm'>
        <div className='flex flex-col items-center gap-3'>
          <div className='size-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent' />
          <span>Initializing Three.js WebGPU Pipeline...</span>
        </div>
      </div>
    ),
  },
);

function WebGPUContent() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  // Read initial configuration from URL params or fallback to defaults
  const [config, setConfig] = useState<BenchmarkConfig>(() => {
    const countParam = searchParams.get('count');
    const speedParam = searchParams.get('speed');
    const sizeParam = searchParams.get('size');
    const radiusParam = searchParams.get('radius');

    const shapeParam = searchParams.get('shape');

    return {
      count: clampCountForBackend(
        countParam ? parseInt(countParam, 10) : DEFAULT_CONFIG.count,
        true,
      ),
      palette: normalizePalette(searchParams.get('palette')),
      shape: normalizeShape(shapeParam),
      speed: speedParam ? parseFloat(speedParam) : DEFAULT_CONFIG.speed,
      particleSize: sizeParam ? parseFloat(sizeParam) : DEFAULT_CONFIG.particleSize,
      orbRadius: radiusParam ? parseFloat(radiusParam) : DEFAULT_CONFIG.orbRadius,
    };
  });

  const { metrics, recordFrame } = useBenchmarkStats(true);
  const [resetKey, setResetKey] = useState(0);
  const handleReset = () => setResetKey(k => k + 1);

  // Sync state changes with URL query parameters so comparisons remain in sync
  const handleConfigChange = (newConfig: Partial<BenchmarkConfig>) => {
    const next = {
      ...config,
      ...newConfig,
      count: clampCountForBackend(newConfig.count ?? config.count, true),
    };
    setConfig(next);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      params.set('count', next.count.toString());
      params.set('palette', next.palette);
      params.set('shape', next.shape);
      params.set('speed', next.speed.toString());
      params.set('size', next.particleSize.toString());
      params.set('radius', next.orbRadius.toString());
      window.history.replaceState(null, '', `/three-d/webgpu?${params.toString()}`);
    }
  };

  return (
    <main className='relative h-screen w-screen overflow-hidden select-none'>
      {/* Top Bar Switcher */}
      <ComparisonSwitcher isWebGPU={true} />

      {/* WebGPU Unsupported Diagnostic Alert */}
      <WebGPUSupportBanner currentQuery={queryString} />

      {/* Fullscreen 3D WebGPU Canvas */}
      <DynamicWebGPUCanvas
        config={config}
        onFrame={recordFrame}
        resetKey={resetKey}
        onWebGPUFallback={() => {
          console.warn('WebGPU fallback activated');
        }}
      />

      {/* Performance & Configuration HUD */}
      <BenchmarkHUD
        metrics={metrics}
        config={config}
        onChangeConfig={handleConfigChange}
        onReset={handleReset}
        isWebGPU={true}
      />
    </main>
  );
}

export default function WebGPUPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen w-screen items-center justify-center bg-[#04050d] text-cyan-400 font-mono text-sm'>
          Loading WebGPU Benchmark...
        </div>
      }
    >
      <WebGPUContent />
    </Suspense>
  );
}
