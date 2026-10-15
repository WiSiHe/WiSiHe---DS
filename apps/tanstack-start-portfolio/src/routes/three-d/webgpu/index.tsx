'use client';

import { createFileRoute, useLocation } from '@tanstack/react-router';
import { lazy, Suspense, useEffect, useState } from 'react';
import { BenchmarkHUD } from '../../../components/three-d/benchmark/BenchmarkHUD';
import { ComparisonSwitcher } from '../../../components/three-d/benchmark/ComparisonSwitcher';
import {
  type BenchmarkConfig,
  clampCountForBackend,
  DEFAULT_CONFIG,
  normalizePalette,
  normalizeShape,
} from '../../../components/three-d/benchmark/types';
import { useBenchmarkStats } from '../../../components/three-d/benchmark/useBenchmarkStats';
import { WebGPUSupportBanner } from '../../../components/three-d/benchmark/WebGPUSupportBanner';
import { buildHead } from '../../../lib/seo';

const LazyWebGPUCanvas = lazy(() =>
  import('../../../components/three-d/benchmark/WebGPUCanvas').then(mod => ({
    default: mod.WebGPUCanvas,
  })),
);

export const Route = createFileRoute('/three-d/webgpu/')({
  head: () =>
    buildHead({
      title: 'Three.js WebGPU Benchmark | 3D Graphics Lab | WiSiHe',
      description:
        'Benchmark next-generation Three.js WebGPU compute shaders against legacy rendering with up to 100,000 GPU-computed particles and real-time telemetry.',
      path: '/three-d/webgpu',
    }),
  component: WebGPUPage,
});

function WebGPUPage() {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const queryString =
    typeof window !== 'undefined'
      ? window.location.search.replace(/^\?/, '')
      : location.search
        ? new URLSearchParams(location.search as unknown as Record<string, string>).toString()
        : '';

  useEffect(() => {
    setMounted(true);
  }, []);

  const [config, setConfig] = useState<BenchmarkConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT_CONFIG;
    const searchParams = new URLSearchParams(window.location.search);
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

  if (!mounted) {
    return (
      <div className='flex h-screen w-screen items-center justify-center bg-[#04050d] text-cyan-400 font-mono text-sm'>
        <div className='flex flex-col items-center gap-3'>
          <div className='size-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent' />
          <span>Initializing Three.js WebGPU Pipeline...</span>
        </div>
      </div>
    );
  }

  return (
    <main className='relative h-screen w-screen overflow-hidden select-none'>
      {/* Top Bar Switcher */}
      <ComparisonSwitcher isWebGPU={true} />

      {/* WebGPU Unsupported Diagnostic Alert */}
      <WebGPUSupportBanner currentQuery={queryString} />

      {/* Fullscreen 3D WebGPU Canvas */}
      <Suspense
        fallback={
          <div className='flex h-full w-full items-center justify-center bg-[#04050d] text-cyan-400 font-mono text-sm'>
            <div className='flex flex-col items-center gap-3'>
              <div className='size-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent' />
              <span>Initializing Three.js WebGPU Pipeline...</span>
            </div>
          </div>
        }
      >
        <LazyWebGPUCanvas
          config={config}
          onFrame={recordFrame}
          resetKey={resetKey}
          onWebGPUFallback={() => {
            console.warn('WebGPU fallback activated');
          }}
        />
      </Suspense>

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
