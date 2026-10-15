'use client';

import { IconAlertTriangle, IconArrowRight, IconInfoCircle } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export function WebGPUSupportBanner({ currentQuery }: { currentQuery: string }) {
  const [supportState, setSupportState] = useState<'checking' | 'supported' | 'unsupported'>(
    'checking',
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    async function checkWebGPU() {
      if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
        setSupportState('unsupported');
        return;
      }
      try {
        const adapter = await navigator.gpu.requestAdapter();
        if (adapter) {
          setSupportState('supported');
        } else {
          setSupportState('unsupported');
        }
      } catch {
        setSupportState('unsupported');
      }
    }
    checkWebGPU();
  }, []);

  if (supportState !== 'unsupported') return null;

  const webglHref = `/three-d/webgl${currentQuery ? `?${currentQuery}` : ''}`;

  return (
    <aside
      aria-label='WebGPU compatibility notice'
      className='fixed top-20 left-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 rounded-2xl border border-amber-500/30 bg-amber-950/40 p-4 text-amber-200 shadow-2xl backdrop-blur-xl'
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-start gap-3'>
          <IconAlertTriangle className='mt-0.5 size-5 shrink-0 text-amber-400' aria-hidden />
          <div className='space-y-1 text-sm'>
            <p className='font-semibold text-amber-200'>
              WebGPU is not enabled or supported on this browser
            </p>
            <p className='text-xs text-amber-200/80 leading-relaxed'>
              Three.js is attempting to fall back to WebGL2 compatibility mode. For the native
              WebGPU compute pipeline, use a modern Chromium (Chrome/Edge/Brave) or Safari 17.4+
              browser.
            </p>
          </div>
        </div>

        <Link
          to={webglHref}
          className='flex shrink-0 items-center gap-1.5 rounded-xl border border-amber-400/40 bg-amber-400/15 px-3 py-1.5 text-xs font-semibold text-amber-200 transition-colors hover:bg-amber-400/25'
        >
          View WebGL
          <IconArrowRight className='size-3.5' />
        </Link>
      </div>

      <div className='mt-3 flex items-center justify-between border-t border-amber-500/20 pt-2 text-xs'>
        <button
          type='button'
          onClick={() => setDetailsOpen(!detailsOpen)}
          className='flex items-center gap-1 text-amber-300/80 hover:text-amber-200'
        >
          <IconInfoCircle className='size-3.5' />
          {detailsOpen ? 'Hide troubleshooting' : 'How to enable WebGPU'}
        </button>
        <span className='font-mono text-[10px] text-amber-400/60'>navigator.gpu: null</span>
      </div>

      {detailsOpen && (
        <div className='mt-3 rounded-lg bg-black/40 p-3 text-xs text-amber-100/90 space-y-1.5 font-mono text-[11px]'>
          <p>
            • <strong>Chrome / Edge</strong>: Enabled by default on macOS, Windows, Android. If
            disabled, check{' '}
            <code className='text-amber-300'>chrome://flags/#enable-unsafe-webgpu</code>.
          </p>
          <p>
            • <strong>Safari</strong>: macOS Sonoma 14.4+ / iOS 17.4+ has WebGPU enabled by default.
          </p>
          <p>
            • <strong>Firefox</strong>: Set{' '}
            <code className='text-amber-300'>dom.webgpu.enabled = true</code> in{' '}
            <code className='text-amber-300'>about:config</code>.
          </p>
        </div>
      )}
    </aside>
  );
}
