'use client';

import { useEffect } from 'react';

/**
 * Loads react-scan only in development after hydration so the script is not part of SSR HTML.
 * That avoids hydration mismatches when extensions or other tools inject scripts into <head>.
 */
export function ReactScanDev() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const existing = document.querySelector('script[data-react-scan-dev]');
    if (existing) return;
    const s = document.createElement('script');
    s.setAttribute('data-react-scan-dev', '');
    s.crossOrigin = 'anonymous';
    s.src = 'https://unpkg.com/react-scan/dist/auto.global.js';
    document.head.appendChild(s);
  }, []);

  return null;
}
