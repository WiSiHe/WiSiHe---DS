'use client';

import {
  IconArrowLeft,
  IconArrowsRightLeft,
  IconBrandThreejs,
  IconCpu,
  IconSparkles,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function ComparisonSwitcher({ isWebGPU }: { isWebGPU: boolean }) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const targetPath = isWebGPU ? '/three-d/webgl' : '/three-d/webgpu';
  const targetHref = queryString ? `${targetPath}?${queryString}` : targetPath;

  return (
    <header className='pointer-events-none fixed top-4 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6'>
      {/* Left: Back to 3D Lab Hub (spaced past Home Logo button) */}
      <div className='pointer-events-auto flex items-center gap-2 pl-14 sm:pl-16 md:pl-20'>
        <Link
          href='/three-d'
          className='group flex items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-xs font-medium text-white/80 backdrop-blur-md transition-all hover:border-white/20 hover:bg-black/70 hover:text-white'
        >
          <IconArrowLeft className='size-4 transition-transform group-hover:-translate-x-0.5' />
          <span className='hidden sm:inline'>3D Lab Hub</span>
          <span className='sm:hidden'>Hub</span>
        </Link>
      </div>

      {/* Center: Mode Indicator & Quick Switcher */}
      <div className='pointer-events-auto absolute left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-2xl border border-white/15 bg-black/60 p-1.5 shadow-2xl backdrop-blur-xl'>
        {/* Active badge */}
        <div
          className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold ${
            isWebGPU
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30'
              : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30'
          }`}
        >
          {isWebGPU ? (
            <>
              <IconSparkles className='size-3.5 text-cyan-400' />
              <span className='hidden sm:inline'>Three.js WebGPU</span>
              <span className='sm:hidden'>WebGPU</span>
            </>
          ) : (
            <>
              <IconCpu className='size-3.5 text-amber-400' />
              <span className='hidden sm:inline'>Three.js WebGL (Legacy)</span>
              <span className='sm:hidden'>WebGL</span>
            </>
          )}
        </div>

        {/* Switch button */}
        <Link
          href={targetHref}
          onClick={e => {
            if (typeof window !== 'undefined') {
              const currentSearch = window.location.search;
              if (currentSearch) {
                e.preventDefault();
                window.location.href = `${targetPath}${currentSearch}`;
              }
            }
          }}
          className='flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white'
          title={`Switch to ${isWebGPU ? 'WebGL' : 'WebGPU'} benchmark`}
        >
          <IconArrowsRightLeft className='size-3.5' />
          <span className='hidden md:inline'>Switch to {isWebGPU ? 'WebGL' : 'WebGPU'}</span>
          <span className='md:hidden'>{isWebGPU ? 'WebGL' : 'WebGPU'}</span>
        </Link>
      </div>

      {/* Right: Three.js badge (spaced before Theme Toggle button) */}
      <div className='pointer-events-auto hidden lg:flex items-center gap-2 pr-14 sm:pr-16'>
        <div className='flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs font-mono text-white/60 backdrop-blur-md'>
          <IconBrandThreejs className='size-4 text-white/80' />
          <span>Three.js r184</span>
        </div>
      </div>
    </header>
  );
}
