'use client';

import { IconArrowLeft, IconArrowRight, IconBrandThreejs, IconSparkles } from '@tabler/icons-react';
import { createFileRoute, Link, useLocation } from '@tanstack/react-router';
import { lazy, Suspense, useEffect, useState } from 'react';
import { WebGPUSupportBanner } from '../../../components/three-d/benchmark/WebGPUSupportBanner';
import { ShaderControlsHUD } from '../../../components/three-d/shaders/ShaderControlsHUD';
import {
  DEFAULT_SHADER_CONFIG,
  type ShaderConfig,
  type ShaderPalette,
  type ShaderScene,
} from '../../../components/three-d/shaders/types';
import { buildHead } from '../../../lib/seo';

const LazyShaderCanvas = lazy(() =>
  import('../../../components/three-d/shaders/WebGPUShaderCanvas').then(mod => ({
    default: mod.WebGPUShaderCanvas,
  })),
);

export const Route = createFileRoute('/three-d/shaders/')({
  head: () =>
    buildHead({
      title: 'Procedural TSL Shaders | 3D Graphics Lab | WiSiHe',
      description:
        'Real-time procedural Three Shading Language (TSL) shaders running natively on WebGPU with dynamic vertex displacement and iridescence.',
      path: '/three-d/shaders',
    }),
  component: ShadersPage,
});

function ShadersPage() {
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

  const [config, setConfig] = useState<ShaderConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT_SHADER_CONFIG;
    const searchParams = new URLSearchParams(window.location.search);
    const sceneParam = searchParams.get('scene') as ShaderScene;
    const paletteParam = searchParams.get('palette') as ShaderPalette;
    const dispParam = searchParams.get('disp');
    const freqParam = searchParams.get('freq');
    const speedParam = searchParams.get('speed');

    return {
      scene: sceneParam || DEFAULT_SHADER_CONFIG.scene,
      palette: paletteParam || DEFAULT_SHADER_CONFIG.palette,
      displacement: dispParam ? parseFloat(dispParam) : DEFAULT_SHADER_CONFIG.displacement,
      frequency: freqParam ? parseFloat(freqParam) : DEFAULT_SHADER_CONFIG.frequency,
      speed: speedParam ? parseFloat(speedParam) : DEFAULT_SHADER_CONFIG.speed,
      roughness: DEFAULT_SHADER_CONFIG.roughness,
      metalness: DEFAULT_SHADER_CONFIG.metalness,
      wireframe: searchParams.get('wire') === 'true',
    };
  });

  const handleConfigChange = (newConfig: Partial<ShaderConfig>) => {
    const next = { ...config, ...newConfig };
    setConfig(next);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      params.set('scene', next.scene);
      params.set('palette', next.palette);
      params.set('disp', next.displacement.toString());
      params.set('freq', next.frequency.toString());
      params.set('speed', next.speed.toString());
      if (next.wireframe) params.set('wire', 'true');
      window.history.replaceState(null, '', `/three-d/shaders?${params.toString()}`);
    }
  };

  if (!mounted) {
    return (
      <div className='flex h-screen w-screen items-center justify-center bg-[#04050d] text-cyan-400 font-mono text-sm'>
        <div className='flex flex-col items-center gap-3'>
          <div className='size-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent' />
          <span>Compiling WebGPU Procedural Shaders...</span>
        </div>
      </div>
    );
  }

  return (
    <main className='relative h-screen w-screen overflow-hidden select-none'>
      {/* Top Bar Navigation */}
      <header className='pointer-events-none fixed top-4 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6'>
        {/* Left: Back to 3D Lab (spaced past Home Logo button) */}
        <div className='pointer-events-auto flex items-center gap-2 pl-14 sm:pl-16 md:pl-20'>
          <Link
            to='/three-d'
            className='group flex items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-xs font-medium text-white/80 backdrop-blur-md transition-all hover:border-white/20 hover:bg-black/70 hover:text-white'
          >
            <IconArrowLeft className='size-4 transition-transform group-hover:-translate-x-0.5' />
            <span className='hidden sm:inline'>3D Lab Hub</span>
            <span className='sm:hidden'>Hub</span>
          </Link>
        </div>

        {/* Center: Title Pill */}
        <div className='pointer-events-auto absolute left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-2xl border border-cyan-500/30 bg-black/60 px-4 py-2 shadow-2xl backdrop-blur-xl'>
          <IconSparkles className='size-4 text-cyan-400' />
          <span className='font-mono text-xs font-semibold text-cyan-200'>
            TSL Procedural Shaders
          </span>
        </div>

        {/* Right: Particle Benchmark Link (spaced before Theme Toggle button) */}
        <div className='pointer-events-auto flex items-center gap-2 pr-14 sm:pr-16'>
          <Link
            to='/three-d/webgpu'
            className='group hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-xs font-medium text-white/80 backdrop-blur-md transition-all hover:border-white/20 hover:bg-black/70 hover:text-white'
          >
            <IconBrandThreejs className='size-4 text-cyan-400' />
            <span>Particle Benchmark</span>
            <IconArrowRight className='size-3.5 transition-transform group-hover:translate-x-0.5' />
          </Link>
        </div>
      </header>

      {/* WebGPU Unsupported Diagnostic Alert */}
      <WebGPUSupportBanner currentQuery={queryString} />

      {/* Fullscreen 3D Shader Canvas */}
      <Suspense
        fallback={
          <div className='flex h-full w-full items-center justify-center bg-[#04050d] text-cyan-400 font-mono text-sm'>
            <div className='flex flex-col items-center gap-3'>
              <div className='size-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent' />
              <span>Compiling WebGPU Procedural Shaders...</span>
            </div>
          </div>
        }
      >
        <LazyShaderCanvas config={config} />
      </Suspense>

      {/* Controls Overlay & TSL Inspector */}
      <ShaderControlsHUD config={config} onChangeConfig={handleConfigChange} />
    </main>
  );
}
