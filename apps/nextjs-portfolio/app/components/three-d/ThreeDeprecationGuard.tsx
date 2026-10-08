'use client';

import { useEffect } from 'react';
import * as THREE from 'three';

// Polyfill / interceptor to shield from third-party library calls to deprecated THREE.Clock
// (such as @react-three/fiber v9 root store which instantiates `new THREE.Clock()`)
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('THREE.Clock: This module has been deprecated')
    ) {
      // Suppress known internal deprecation from R3F v9 default store
      return;
    }
    originalWarn.apply(console, args);
  };
}

export function ThreeDeprecationGuard() {
  useEffect(() => {
    // Ensure THREE is configured with modern color management
    THREE.ColorManagement.enabled = true;
  }, []);

  return null;
}
