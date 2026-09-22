'use client';

import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconCode,
  IconCopy,
  IconFlame,
  IconGridDots,
  IconPalette,
  IconPlanet,
  IconRotateClockwise,
  IconSparkles,
  IconWand,
} from '@tabler/icons-react';
import { useState } from 'react';
import {
  DEFAULT_SHADER_CONFIG,
  SHADER_PALETTES,
  type ShaderConfig,
  type ShaderPalette,
  TSL_CODE_SNIPPETS,
} from './types';

interface ShaderControlsHUDProps {
  config: ShaderConfig;
  onChangeConfig: (newConfig: Partial<ShaderConfig>) => void;
}

export function ShaderControlsHUD({ config, onChangeConfig }: ShaderControlsHUDProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeSnippet = TSL_CODE_SNIPPETS[config.scene];

  const handleCopyCode = async () => {
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(activeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className='pointer-events-none fixed bottom-4 left-4 right-4 z-40 flex flex-col items-center sm:items-start sm:left-6 sm:bottom-6 sm:max-w-md'>
        <div className='pointer-events-auto w-full rounded-2xl border border-white/15 bg-black/80 p-4 shadow-2xl backdrop-blur-2xl transition-all duration-300'>
          {/* Header Row */}
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-3 py-1 text-xs font-mono font-bold text-cyan-300'>
                <IconSparkles className='size-3.5' />
                <span>TSL WebGPU Shader</span>
              </div>
            </div>

            <div className='flex items-center gap-1.5'>
              <button
                type='button'
                onClick={() => setShowCodeModal(true)}
                className='flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-white/80 transition-colors hover:bg-white/15 hover:text-white'
                title='View TSL shader source code'
              >
                <IconCode className='size-3.5 text-cyan-400' />
                <span className='hidden sm:inline'>View TSL</span>
              </button>

              <button
                type='button'
                onClick={() => setCollapsed(!collapsed)}
                className='rounded-xl border border-white/10 bg-white/5 p-1.5 text-white/70 transition-colors hover:bg-white/15 hover:text-white'
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

          {/* Body Controls */}
          {!collapsed && (
            <div className='mt-4 space-y-4 border-t border-white/10 pt-3 text-xs'>
              {/* Scene Switcher */}
              <div className='space-y-1.5'>
                <div className='flex items-center gap-1.5 font-mono text-[11px] text-white/60'>
                  <IconWand className='size-3.5 text-white/70' />
                  Procedural Shader Scene
                </div>
                <div className='grid grid-cols-3 gap-1.5'>
                  {(
                    [
                      { id: 'plasma', label: 'Plasma Orb', icon: IconPlanet },
                      { id: 'gyroid', label: 'Gyroid', icon: IconFlame },
                      { id: 'wave', label: 'Wave Grid', icon: IconGridDots },
                    ] as const
                  ).map(item => {
                    const Icon = item.icon;
                    const isSelected = config.scene === item.id;
                    return (
                      <button
                        key={item.id}
                        type='button'
                        onClick={() => onChangeConfig({ scene: item.id })}
                        className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-[11px] font-semibold transition-all border ${
                          isSelected
                            ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-200 shadow-md shadow-cyan-500/10'
                            : 'border-white/5 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className='size-3.5 shrink-0' />
                        <span className='truncate'>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Palette Selector */}
              <div className='space-y-1.5'>
                <div className='flex items-center gap-1.5 font-mono text-[11px] text-white/60'>
                  <IconPalette className='size-3.5 text-white/70' />
                  Color Theme
                </div>
                <div className='grid grid-cols-4 gap-1.5'>
                  {(Object.keys(SHADER_PALETTES) as ShaderPalette[]).map(key => {
                    const pal = SHADER_PALETTES[key];
                    const isSelected = config.palette === key;
                    return (
                      <button
                        key={key}
                        type='button'
                        onClick={() => onChangeConfig({ palette: key })}
                        className={`flex items-center gap-1.5 rounded-xl p-1 text-[11px] transition-all border ${
                          isSelected
                            ? 'border-white/40 bg-white/15 text-white'
                            : 'border-white/5 bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <div
                          className='size-3 rounded-full shrink-0'
                          style={{
                            background: `linear-gradient(135deg, ${pal.primary}, ${pal.secondary})`,
                          }}
                        />
                        <span className='truncate text-[10px]'>{pal.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliders Grid */}
              <div className='grid grid-cols-2 gap-3 pt-1'>
                {/* Displacement */}
                <div className='space-y-1'>
                  <div className='flex items-center justify-between font-mono text-[10px] text-white/60'>
                    <span>Displacement</span>
                    <span className='text-white/80'>{config.displacement.toFixed(1)}</span>
                  </div>
                  <input
                    type='range'
                    min='0.1'
                    max='2.0'
                    step='0.05'
                    value={config.displacement}
                    onChange={e => onChangeConfig({ displacement: parseFloat(e.target.value) })}
                    className='w-full accent-cyan-400 h-1 bg-white/20 rounded-lg cursor-pointer'
                  />
                </div>

                {/* Frequency */}
                <div className='space-y-1'>
                  <div className='flex items-center justify-between font-mono text-[10px] text-white/60'>
                    <span>Frequency</span>
                    <span className='text-white/80'>{config.frequency.toFixed(1)}</span>
                  </div>
                  <input
                    type='range'
                    min='0.5'
                    max='3.5'
                    step='0.1'
                    value={config.frequency}
                    onChange={e => onChangeConfig({ frequency: parseFloat(e.target.value) })}
                    className='w-full accent-cyan-400 h-1 bg-white/20 rounded-lg cursor-pointer'
                  />
                </div>

                {/* Speed */}
                <div className='space-y-1'>
                  <div className='flex items-center justify-between font-mono text-[10px] text-white/60'>
                    <span>Speed</span>
                    <span className='text-white/80'>{config.speed.toFixed(1)}x</span>
                  </div>
                  <input
                    type='range'
                    min='0.2'
                    max='2.5'
                    step='0.1'
                    value={config.speed}
                    onChange={e => onChangeConfig({ speed: parseFloat(e.target.value) })}
                    className='w-full accent-cyan-400 h-1 bg-white/20 rounded-lg cursor-pointer'
                  />
                </div>

                {/* Metalness */}
                <div className='space-y-1'>
                  <div className='flex items-center justify-between font-mono text-[10px] text-white/60'>
                    <span>Metalness</span>
                    <span className='text-white/80'>{config.metalness.toFixed(1)}</span>
                  </div>
                  <input
                    type='range'
                    min='0.0'
                    max='1.0'
                    step='0.05'
                    value={config.metalness}
                    onChange={e => onChangeConfig({ metalness: parseFloat(e.target.value) })}
                    className='w-full accent-cyan-400 h-1 bg-white/20 rounded-lg cursor-pointer'
                  />
                </div>
              </div>

              {/* Wireframe toggle & Reset */}
              <div className='flex items-center justify-between border-t border-white/10 pt-2 text-[11px] font-mono'>
                <label className='flex items-center gap-2 cursor-pointer text-white/70 hover:text-white'>
                  <input
                    type='checkbox'
                    checked={config.wireframe}
                    onChange={e => onChangeConfig({ wireframe: e.target.checked })}
                    className='size-3.5 rounded accent-cyan-400 cursor-pointer'
                  />
                  <span>Wireframe Mesh</span>
                </label>

                <button
                  type='button'
                  onClick={() => onChangeConfig(DEFAULT_SHADER_CONFIG)}
                  className='flex items-center gap-1 text-white/40 hover:text-white/80 transition-colors'
                >
                  <IconRotateClockwise className='size-3' />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TSL Code Inspector Modal */}
      {showCodeModal && (
        <aside
          aria-label='Three Shading Language Shader Code'
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md'
        >
          <div className='w-full max-w-2xl rounded-2xl border border-white/20 bg-zinc-950 p-6 shadow-2xl text-foreground text-sm space-y-4'>
            <div className='flex items-center justify-between border-b border-white/10 pb-3'>
              <div>
                <h2 className='text-base font-bold text-white flex items-center gap-2'>
                  <IconCode className='size-5 text-cyan-400' />
                  <span>{activeSnippet.title}</span>
                </h2>
                <p className='text-xs text-zinc-400 mt-0.5'>{activeSnippet.description}</p>
              </div>

              <button
                type='button'
                onClick={() => setShowCodeModal(false)}
                className='text-white/60 hover:text-white text-lg font-mono px-2'
              >
                ✕
              </button>
            </div>

            <div className='relative rounded-xl border border-white/10 bg-black/70 p-4 font-mono text-xs overflow-x-auto text-cyan-200/90 leading-relaxed'>
              <pre>
                <code>{activeSnippet.code}</code>
              </pre>

              <button
                type='button'
                onClick={handleCopyCode}
                className='absolute top-3 right-3 flex items-center gap-1 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-mono text-white/80 hover:bg-white/20 transition-colors'
              >
                {copied ? (
                  <>
                    <IconCheck className='size-3 text-emerald-400' />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <IconCopy className='size-3 text-white/70' />
                    <span>Copy TSL</span>
                  </>
                )}
              </button>
            </div>

            <div className='flex justify-between items-center pt-2 text-xs text-zinc-500'>
              <span>Three Shading Language (TSL) · WebGPU Engine</span>
              <button
                type='button'
                onClick={() => setShowCodeModal(false)}
                className='rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors'
              >
                Close
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
