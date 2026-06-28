'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useWakeLock() {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const enabledRef = useRef(false);

  const release = useCallback(async () => {
    if (!sentinelRef.current) return;
    try {
      await sentinelRef.current.release();
    } catch {
      // Sentinel may already be released by the browser.
    }
    sentinelRef.current = null;
    setIsActive(false);
  }, []);

  const request = useCallback(async () => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return false;

    try {
      await release();
      const sentinel = await navigator.wakeLock.request('screen');
      sentinelRef.current = sentinel;
      setIsActive(true);

      sentinel.addEventListener('release', () => {
        sentinelRef.current = null;
        setIsActive(false);
      });

      return true;
    } catch {
      enabledRef.current = false;
      setIsActive(false);
      return false;
    }
  }, [release]);

  const enable = useCallback(async () => {
    enabledRef.current = true;
    return request();
  }, [request]);

  const disable = useCallback(async () => {
    enabledRef.current = false;
    await release();
  }, [release]);

  const toggle = useCallback(async () => {
    if (enabledRef.current) {
      await disable();
    } else {
      await enable();
    }
  }, [disable, enable]);

  useEffect(() => {
    setIsSupported(typeof navigator !== 'undefined' && 'wakeLock' in navigator);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabledRef.current) {
        void request();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [request]);

  useEffect(() => {
    return () => {
      enabledRef.current = false;
      void release();
    };
  }, [release]);

  return { isSupported, isActive, enable, disable, toggle };
}
