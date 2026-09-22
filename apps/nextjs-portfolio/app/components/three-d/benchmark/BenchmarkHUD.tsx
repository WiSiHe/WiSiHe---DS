'use client';

import {
  IconArrowsRightLeft,
  IconBolt,
  IconChartBar,
  IconChevronDown,
  IconChevronUp,
  IconCpu,
  IconDatabase,
  IconDeviceDesktopAnalytics,
  IconLayersLinked,
  IconRotate,
  IconScale,
  IconSparkles,
  IconX,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { type BenchmarkConfig, type BenchmarkMetrics, COUNT_PRESETS } from './types';

interface BenchmarkHUDProps {
  metrics: BenchmarkMetrics;
  config: BenchmarkConfig;
  onChangeConfig: (newConfig: Partial<BenchmarkConfig>) => void;
  onReset?: () => void;
  isWebGPU: boolean;
}

interface ComparisonRow {
  category: string;
  icon: any;
  legacyTitle: string;
  legacyDesc: string;
  modernTitle: string;
  modernDesc: string;
  advantage: string;
}

const COMPARISON_MATRIX: ComparisonRow[] = [
  {
    category: 'Compute & Pipeline Architecture',
    icon: IconBolt,
    legacyTitle: 'Fixed Rasterization (GLSL)',
    legacyDesc:
      'Traditional vertex/fragment pipeline only. No general-purpose compute shaders. Simulation is forced into procedural vertex displacement or CPU loops.',
    modernTitle: 'WGSL Compute Workgroups',
    modernDesc:
      'Direct GPU compute shaders executing in parallel across hardware workgroups. Reads and writes freely to arbitrary storage buffers in VRAM.',
    advantage: 'Arbitrary general-purpose GPU computing',
  },
  {
    category: 'Simulation & Physics State',
    icon: IconDeviceDesktopAnalytics,
    legacyTitle: 'Stateless Closed-Form Math',
    legacyDesc:
      'Particles have no persistent memory across frames. True momentum, dynamic fluid viscosity, and inter-particle forces cannot be stored or integrated.',
    modernTitle: 'Stateful VRAM Integration',
    modernDesc:
      'True numerical physics integration with persistent velocity, inertia, fluid damping, and physical memory residing entirely in GPU storage.',
    advantage: 'Persistent physical mass and momentum',
  },
  {
    category: 'Memory & PCIe Bus Bandwidth',
    icon: IconDatabase,
    legacyTitle: 'CPU-to-GPU Bus Bottleneck',
    legacyDesc:
      'Dynamic physics calculated on CPU requires re-uploading typed arrays over the PCIe/unified bus every frame (needsUpdate = true), saturating bandwidth.',
    modernTitle: 'Dedicated GPU Storage Buffers',
    modernDesc:
      'Particle positions and velocities are allocated and mutated directly inside VRAM. Zero CPU-to-GPU data transfer during the animation loop.',
    advantage: 'Zero bus transfer during frame dispatch',
  },
  {
    category: 'Scalability at 1M+ Particles',
    icon: IconChartBar,
    legacyTitle: 'Struggles Beyond 100K–250K',
    legacyDesc:
      'Draw call overhead, CPU thread saturation, and fragment overdraw cause noticeable framerate drops as particle counts scale up.',
    modernTitle: 'Sustained 60 FPS at 1M+',
    modernDesc:
      'Massive parallel occupancy allows the GPU to compute and billboard millions of particles effortlessly without taxing the CPU.',
    advantage: 'High hardware thread occupancy at scale',
  },
  {
    category: 'Driver Overhead & CPU Stalls',
    icon: IconLayersLinked,
    legacyTitle: 'Synchronous OpenGL ES Validation',
    legacyDesc:
      'Browser driver validates state and flushes graphics caches synchronously per draw call on the JavaScript main thread.',
    modernTitle: 'Pre-Baked Pipeline State Objects',
    modernDesc:
      'Low-level explicit command buffers pre-validate state ahead of time, dropping driver overhead to near zero.',
    advantage: 'Predictable frame pacing and low CPU usage',
  },
];

export function BenchmarkHUD({
  metrics,
  config,
  onChangeConfig,
  onReset,
  isWebGPU,
}: BenchmarkHUDProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString();

  const targetPath = isWebGPU ? '/three-d/webgl' : '/three-d/webgpu';
  const targetHref = queryString ? `${targetPath}?${queryString}` : targetPath;

  // FPS color indicator
  const fpsColor =
    metrics.fps >= 55
      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
      : metrics.fps >= 30
        ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
        : 'text-rose-400 border-rose-500/30 bg-rose-500/10';

  return (
    <>
      {/* Floating Benchmark HUD */}
      <div className='pointer-events-none fixed bottom-4 left-4 right-4 z-40 flex flex-col items-center sm:items-end sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md'>
        <div className='pointer-events-auto w-full rounded-2xl border border-white/15 bg-black/80 p-4 shadow-2xl backdrop-blur-2xl transition-all duration-300'>
          {/* Header Row: Metrics Summary & Quick Actions */}
          <div className='flex items-center justify-between gap-2.5'>
            <div className='flex items-center gap-2'>
              {/* FPS Badge */}
              <div
                className={`flex items-baseline gap-1 rounded-xl border px-3 py-1 font-mono text-sm font-bold transition-colors ${fpsColor}`}
              >
                <span>{metrics.fps}</span>
                <span className='text-[10px] font-normal uppercase opacity-75'>FPS</span>
              </div>

              {/* Frame ms */}
              <div className='flex items-baseline gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-white/80'>
                <span>{metrics.frameTime}</span>
                <span className='text-[9px] text-white/50'>ms</span>
              </div>

              {/* Particles Count */}
              <div className='rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-white/90'>
                {config.count >= 1_000_000
                  ? `${(config.count / 1_000_000).toFixed(0)}M`
                  : `${Math.round(config.count / 1000)}K`}{' '}
                <span className='text-[10px] text-white/50'>pts</span>
              </div>
            </div>

            <div className='flex items-center gap-1.5'>
              {/* Old vs New Architectural Matrix Button */}
              <button
                type='button'
                onClick={() => setShowDrawer(true)}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-medium transition-all ${
                  isWebGPU
                    ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/25'
                    : 'border-amber-500/40 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25'
                }`}
                title='Open Old vs New Architectural Comparison Matrix'
                aria-label='Open Old vs New Architectural Comparison Matrix'
              >
                <IconScale className='size-3.5' />
                <span className='hidden xs:inline sm:inline font-mono text-[11px] font-semibold'>
                  Old vs New
                </span>
              </button>

              {onReset && (
                <button
                  type='button'
                  onClick={onReset}
                  className='rounded-xl border border-white/10 bg-white/5 p-1.5 text-white/70 hover:bg-white/15 hover:text-white transition-colors'
                  title='Reset camera view and 3D simulation'
                  aria-label='Reset camera & scene'
                >
                  <IconRotate className='size-4' />
                </button>
              )}

              <button
                type='button'
                onClick={() => setCollapsed(!collapsed)}
                className='rounded-xl border border-white/10 bg-white/5 p-1.5 text-white/70 hover:bg-white/15 hover:text-white transition-colors'
                aria-label={collapsed ? 'Expand HUD' : 'Collapse HUD'}
              >
                {collapsed ? (
                  <IconChevronUp className='size-4' />
                ) : (
                  <IconChevronDown className='size-4' />
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Body Controls */}
          {!collapsed && (
            <div className='mt-4 space-y-4 border-t border-white/10 pt-3 text-xs'>
              {/* Backend status info */}
              <div className='flex items-center justify-between text-[11px] font-mono'>
                <span className='text-white/50'>Active Backend</span>
                <span
                  className={`font-semibold flex items-center gap-1.5 ${isWebGPU ? 'text-cyan-400' : 'text-amber-400'}`}
                >
                  {isWebGPU ? (
                    <IconSparkles className='size-3.5' />
                  ) : (
                    <IconCpu className='size-3.5' />
                  )}
                  {metrics.backend}
                </span>
              </div>

              {/* 3D Instance Count Presets */}
              <div className='space-y-1.5'>
                <div className='flex items-center justify-between text-[11px] font-mono text-white/60'>
                  <span className='flex items-center gap-1.5'>
                    <IconChartBar className='size-3.5 text-white/70' />
                    Particle Count
                  </span>
                  <span className='font-bold text-white/90'>{config.count.toLocaleString()}</span>
                </div>

                <div className='grid grid-cols-6 gap-1'>
                  {COUNT_PRESETS.map(preset => (
                    <button
                      key={preset.value}
                      type='button'
                      onClick={() => onChangeConfig({ count: preset.value })}
                      className={`rounded-lg py-1 text-center font-mono text-[11px] font-semibold transition-all ${
                        config.count === preset.value
                          ? isWebGPU
                            ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                            : 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                          : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders: Spin Speed, Orb Radius & Particle Glow */}
              <div className='grid grid-cols-3 gap-2.5 pt-1'>
                <div className='space-y-1'>
                  <div className='flex items-center justify-between text-[10px] font-mono text-white/60'>
                    <span>Spin Speed</span>
                    <span className='text-white/80'>{config.speed.toFixed(1)}x</span>
                  </div>
                  <input
                    type='range'
                    min='0.2'
                    max='2.5'
                    step='0.1'
                    value={config.speed}
                    onChange={e => onChangeConfig({ speed: parseFloat(e.target.value) })}
                    className='w-full accent-white h-1 bg-white/20 rounded-lg cursor-pointer'
                  />
                </div>

                <div className='space-y-1'>
                  <div className='flex items-center justify-between text-[10px] font-mono text-white/60'>
                    <span>Orb Radius</span>
                    <span className='text-white/80'>{config.orbRadius.toFixed(0)}</span>
                  </div>
                  <input
                    type='range'
                    min='8'
                    max='24'
                    step='1'
                    value={config.orbRadius}
                    onChange={e => onChangeConfig({ orbRadius: parseFloat(e.target.value) })}
                    className='w-full accent-white h-1 bg-white/20 rounded-lg cursor-pointer'
                  />
                </div>

                <div className='space-y-1'>
                  <div className='flex items-center justify-between text-[10px] font-mono text-white/60'>
                    <span>Particle Glow</span>
                    <span className='text-white/80'>{config.particleSize.toFixed(1)}px</span>
                  </div>
                  <input
                    type='range'
                    min='0.8'
                    max='4.5'
                    step='0.1'
                    value={config.particleSize}
                    onChange={e => onChangeConfig({ particleSize: parseFloat(e.target.value) })}
                    className='w-full accent-white h-1 bg-white/20 rounded-lg cursor-pointer'
                  />
                </div>
              </div>

              {/* Interaction Tip & Old vs New Quick Link */}
              <div className='flex items-center justify-between pt-1.5 border-t border-white/10 text-[10px] text-white/50 font-mono'>
                <span className='flex items-center gap-1.5'>
                  <span className='inline-block size-1.5 rounded-full bg-cyan-400 animate-pulse' />
                  Drag to orbit · Hover to perturb · Click to burst
                </span>
                <button
                  type='button'
                  onClick={() => setShowDrawer(true)}
                  className='text-white/70 hover:text-white underline underline-offset-2'
                >
                  Architectural Matrix →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Persistent 'Old vs New' Architectural Comparison Drawer           */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {showDrawer && (
        <aside
          aria-label='Old vs New Architectural Comparison'
          className='fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity'
          onClick={() => setShowDrawer(false)}
        >
          <div
            className='h-full w-full max-w-2xl overflow-y-auto border-l border-white/15 bg-zinc-950/95 p-6 shadow-2xl backdrop-blur-2xl text-foreground sm:p-8'
            onClick={e => e.stopPropagation()}
          >
            {/* Header with Title and Close Button */}
            <div className='flex items-start justify-between border-b border-white/10 pb-5'>
              <div className='space-y-1.5'>
                <div className='flex items-center gap-2'>
                  <div className='flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-white/15'>
                    <IconScale className='size-4 text-white' />
                  </div>
                  <h2 className='font-serif text-xl sm:text-2xl font-bold text-white'>
                    Old vs New: Architecture Matrix
                  </h2>
                </div>
                <p className='text-xs text-white/60 leading-relaxed'>
                  Direct head-to-head comparison of traditional WebGL 2.0 rasterization versus
                  next-generation WebGPU compute.
                </p>
              </div>

              <button
                type='button'
                onClick={() => setShowDrawer(false)}
                className='rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/15 hover:text-white transition-colors'
                aria-label='Close drawer'
              >
                <IconX className='size-4' />
              </button>
            </div>

            {/* Live Context Card & Quick Switcher */}
            <div className='my-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs font-mono text-white/50'>Currently Running:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold border ${
                      isWebGPU
                        ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                        : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full animate-pulse ${isWebGPU ? 'bg-cyan-400' : 'bg-amber-400'}`}
                    />
                    {isWebGPU ? 'Three.js WebGPU (The New)' : 'Three.js WebGL 2.0 (The Old)'}
                  </span>
                </div>

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
                  className='inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition-colors'
                >
                  <IconArrowsRightLeft className='size-3.5' />
                  <span>Switch to {isWebGPU ? 'WebGL Benchmark' : 'WebGPU Benchmark'}</span>
                </Link>
              </div>

              {/* Current Telemetry Pill */}
              <div className='grid grid-cols-3 gap-2 pt-2 border-t border-white/5 font-mono text-[11px]'>
                <div className='rounded-lg bg-black/40 p-2 border border-white/5'>
                  <div className='text-white/40 text-[10px] uppercase'>FPS</div>
                  <div className={`font-bold text-sm ${fpsColor.split(' ')[0]}`}>{metrics.fps}</div>
                </div>
                <div className='rounded-lg bg-black/40 p-2 border border-white/5'>
                  <div className='text-white/40 text-[10px] uppercase'>Frame Time</div>
                  <div className='font-bold text-sm text-white/90'>{metrics.frameTime} ms</div>
                </div>
                <div className='rounded-lg bg-black/40 p-2 border border-white/5'>
                  <div className='text-white/40 text-[10px] uppercase'>Workload</div>
                  <div className='font-bold text-sm text-white/90'>
                    {config.count.toLocaleString()} pts
                  </div>
                </div>
              </div>
            </div>

            {/* Feature-by-Feature Matrix Cards */}
            <div className='space-y-4'>
              <h3 className='font-mono text-xs uppercase tracking-wider text-white/40'>
                Architectural Breakdown
              </h3>

              {COMPARISON_MATRIX.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className='rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3 transition-colors hover:border-white/20 hover:bg-white/[0.04]'
                  >
                    {/* Row Header */}
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2 text-white font-semibold text-xs'>
                        <IconComponent className='size-4 text-white/70' />
                        <span>{item.category}</span>
                      </div>
                      <span className='rounded-md bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/70'>
                        {item.advantage}
                      </span>
                    </div>

                    {/* Side-by-Side Cards: Old vs New */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1'>
                      {/* WebGL Card (The Old) */}
                      <div
                        className={`rounded-xl border p-3 text-xs space-y-1.5 transition-all ${
                          !isWebGPU
                            ? 'border-amber-500/50 bg-amber-500/10 text-amber-100 shadow-sm'
                            : 'border-white/10 bg-black/40 text-white/70'
                        }`}
                      >
                        <div className='flex items-center justify-between font-mono text-[11px]'>
                          <span className='text-amber-400 font-bold'>WebGL 2.0 (The Old)</span>
                          {!isWebGPU && (
                            <span className='rounded bg-amber-500/30 px-1.5 py-0.2 text-[9px] font-bold text-amber-200 uppercase'>
                              Active
                            </span>
                          )}
                        </div>
                        <div className='font-semibold text-white/90 text-xs'>
                          {item.legacyTitle}
                        </div>
                        <p className='text-[11px] leading-relaxed opacity-80'>{item.legacyDesc}</p>
                      </div>

                      {/* WebGPU Card (The New) */}
                      <div
                        className={`rounded-xl border p-3 text-xs space-y-1.5 transition-all ${
                          isWebGPU
                            ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-100 shadow-sm'
                            : 'border-white/10 bg-black/40 text-white/70'
                        }`}
                      >
                        <div className='flex items-center justify-between font-mono text-[11px]'>
                          <span className='text-cyan-400 font-bold'>WebGPU (The New)</span>
                          {isWebGPU && (
                            <span className='rounded bg-cyan-500/30 px-1.5 py-0.2 text-[9px] font-bold text-cyan-200 uppercase'>
                              Active
                            </span>
                          )}
                        </div>
                        <div className='font-semibold text-white/90 text-xs'>
                          {item.modernTitle}
                        </div>
                        <p className='text-[11px] leading-relaxed opacity-80'>{item.modernDesc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Key Takeaway Banner */}
            <div className='mt-6 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 to-blue-950/20 p-4 space-y-2 text-xs leading-relaxed'>
              <div className='flex items-center gap-2 font-bold text-cyan-300 font-mono text-[11px]'>
                <IconSparkles className='size-4' />
                <span>Why This Matters for Modern Web Graphics</span>
              </div>
              <p className='text-white/80'>
                WebGPU maps directly to modern low-overhead native graphics APIs (Metal on
                macOS/iOS, Vulkan on Linux/Android, DirectX 12 on Windows). By moving particle
                simulation from single-threaded JavaScript CPU loops into GPU compute pipelines, the
                browser gains access to massive GPU concurrency with zero per-frame bus bandwidth
                overhead.
              </p>
            </div>

            {/* Close footer button */}
            <div className='mt-6 flex justify-end'>
              <button
                type='button'
                onClick={() => setShowDrawer(false)}
                className='rounded-xl bg-white/10 hover:bg-white/20 px-5 py-2 text-xs font-semibold text-white transition-colors'
              >
                Close Matrix
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
