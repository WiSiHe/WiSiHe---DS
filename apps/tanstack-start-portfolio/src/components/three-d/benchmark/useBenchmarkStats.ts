'use client';

import { useRef, useState } from 'react';
import type { BenchmarkMetrics } from './types';

export function useBenchmarkStats(isWebGPU: boolean) {
  const [metrics, setMetrics] = useState<BenchmarkMetrics>({
    fps: 60,
    frameTime: 16.6,
    drawCalls: 1,
    triangles: 0,
    backend: isWebGPU ? 'WebGPU (Detecting...)' : 'WebGL 2.0',
    isWebGPU,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const lastFrameTimestampRef = useRef(performance.now());
  const rollingFrameTimesRef = useRef<number[]>([]);

  const recordFrame = (drawCalls = 1, triangles = 0, backendInfo?: string) => {
    const now = performance.now();
    const frameDelta = now - lastFrameTimestampRef.current;
    lastFrameTimestampRef.current = now;

    // Rolling frame time
    const rolling = rollingFrameTimesRef.current;
    rolling.push(frameDelta);
    if (rolling.length > 30) rolling.shift();

    frameCountRef.current += 1;

    // Update state roughly every 250ms to prevent React re-render thrashing
    if (now - lastTimeRef.current >= 250) {
      const elapsed = (now - lastTimeRef.current) / 1000;
      const currentFps = Math.round(frameCountRef.current / elapsed);
      const avgFrameTime = rolling.reduce((acc, val) => acc + val, 0) / (rolling.length || 1);

      setMetrics({
        fps: Math.min(currentFps, 240),
        frameTime: Math.round(avgFrameTime * 10) / 10,
        drawCalls,
        triangles,
        backend: backendInfo ?? (isWebGPU ? 'WebGPU (WGSL Compute)' : 'WebGL 2.0 (GLSL)'),
        isWebGPU,
      });

      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
  };

  return { metrics, recordFrame };
}
