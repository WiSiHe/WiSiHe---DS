'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'motion/react';
import { PersistentScene } from '../scenes';
import type { SlideMode } from '../../../three-d/types';

interface TechnicalCanvasPanelProps {
  mode: SlideMode;
  showcaseTexture: string;
  autoRotate: boolean;
  directionalLightPosition?: [number, number, number];
  directionalLightIntensity?: number;
}

export function TechnicalCanvasPanel({
  mode,
  showcaseTexture,
  autoRotate,
  directionalLightPosition = [10, 10, 5],
  directionalLightIntensity = 1,
}: TechnicalCanvasPanelProps) {
  const [contextLost, setContextLost] = useState(false);
  const [contextError, setContextError] = useState<string | null>(null);

  useEffect(() => {
    // Reset context lost state after a delay (context should restore automatically)
    if (contextLost) {
      const timer = setTimeout(() => {
        setContextLost(false);
        setContextError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [contextLost]);

  return (
    <div className="flex-1 lg:w-1/2 h-full relative bg-linear-to-br from-surface/30 via-background to-surface/20 border-l border-border/30 overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />



      {/* Context Lost Error Message */}
      {contextLost && contextError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-elevated border-2 border-red-500/50 rounded-xl p-6 max-w-md mx-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">WebGL Context Lost</h3>
                <p className="text-sm text-foreground/70">Attempting to restore...</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80 mb-4">{contextError}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Refresh Page
            </button>
          </motion.div>
        </div>
      )}

      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-foreground/60 font-medium">Loading 3D Scene...</div>
            </motion.div>
          </div>
        }
      >
        <Canvas
          camera={
            mode === 'showcase'
              ? { position: [0, 2, 8], fov: 45 }
              : { position: [0, 0, 5], fov: 50 }
          }
          gl={{
            antialias: true,
            preserveDrawingBuffer: false,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
            alpha: true,
            premultipliedAlpha: false,
            stencil: false,
            depth: true,
          }}
          dpr={1}
          className="w-full h-full"
          onCreated={({ gl, scene }) => {
            // Handle WebGL context loss
            const canvas = gl.domElement;

            const handleContextLost = (event: Event) => {
              event.preventDefault();
              setContextLost(true);
              setContextError('WebGL context lost - attempting to restore...');
              console.warn('WebGL context lost - attempting to preserve state');

              // Log comprehensive resource info
              if ('memory' in performance) {
                const mem = (performance as { memory: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
                const memoryInfo = {
                  used: `${(mem.usedJSHeapSize / 1048576).toFixed(2)} MB`,
                  total: `${(mem.totalJSHeapSize / 1048576).toFixed(2)} MB`,
                  usagePercent: `${((mem.usedJSHeapSize / mem.totalJSHeapSize) * 100).toFixed(1)}%`,
                };
                console.warn('Memory usage:', memoryInfo);

                // Warn if memory usage is high
                const usagePercent = (mem.usedJSHeapSize / mem.totalJSHeapSize) * 100;
                if (usagePercent > 80) {
                  console.warn(`High memory usage: ${usagePercent.toFixed(1)}% - this may cause context loss`);
                }
              }

              // Log WebGL info
              const webglContext = gl.getContext() || canvas.getContext('webgl') || canvas.getContext('webgl2');
              if (webglContext) {
                try {
                  const maxTextureSize = webglContext.getParameter(webglContext.MAX_TEXTURE_SIZE);
                  const maxCombinedTextureImageUnits = webglContext.getParameter(webglContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
                  console.warn('WebGL limits:', {
                    maxTextureSize,
                    maxCombinedTextureImageUnits,
                  });
                } catch (error) {
                  console.warn('Could not get WebGL parameters:', error);
                }
              }
            };

            const handleContextRestored = () => {
              console.log('WebGL context restored - reinitializing');
              setContextLost(false);
              setContextError(null);

              // Force a complete reinitialization
              try {
                // Reinitialize the renderer
                gl.setSize(gl.domElement.width, gl.domElement.height);
                // Clear any stale state - use Three.js API
                gl.setClearColor(0x000000, 0);
                // Reset renderer state
                gl.resetState();
                console.log('WebGL context successfully restored');
              } catch (error) {
                console.error('Error during context restoration:', error);
                setContextError('Failed to restore WebGL context. Please refresh the page.');
              }
            };

            // Set clear color to transparent
            gl.setClearColor(0x000000, 0);

            // Set resource limits to prevent context loss
            // Get WebGL context to check extensions
            const webglContext = gl.getContext() || canvas.getContext('webgl') || canvas.getContext('webgl2');
            if (webglContext && 'getSupportedExtensions' in webglContext) {
              try {
                const extensions = webglContext.getSupportedExtensions();
                if (extensions) {
                  // Log available extensions for debugging
                  console.debug('WebGL extensions:', extensions);
                }
              } catch (error) {
                // Silently fail if extensions can't be accessed
                console.debug('Could not access WebGL extensions:', error);
              }
            }

            canvas.addEventListener('webglcontextlost', handleContextLost, false);
            canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

            // Cleanup function
            return () => {
              canvas.removeEventListener('webglcontextlost', handleContextLost, false);
              canvas.removeEventListener('webglcontextrestored', handleContextRestored, false);
            };
          }}
        >
          <PersistentScene
            mode={mode}
            showcaseTexture={showcaseTexture}
            autoRotate={autoRotate}
            directionalLightPosition={directionalLightPosition}
            directionalLightIntensity={directionalLightIntensity}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
