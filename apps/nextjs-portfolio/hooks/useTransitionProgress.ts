'use client';

import { startTransition } from 'react';
import { useProgress } from 'react-transition-progress';

/**
 * Custom hook that provides a convenient way to trigger progress bars
 * during React transitions. This wraps the useProgress hook with
 * additional functionality for common use cases.
 */
export function useTransitionProgress() {
  const startProgress = useProgress();

  /**
   * Wraps a function with startTransition and automatically shows
   * the progress bar during the transition.
   */
  const withProgress = <T extends (...args: any[]) => any>(fn: T): T => {
    return ((...args: Parameters<T>) => {
      return new Promise<ReturnType<T>>((resolve, reject) => {
        startTransition(async () => {
          try {
            startProgress();
            const result = await fn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });
    }) as T;
  };

  /**
   * Executes a function with progress indication.
   * Useful for async operations that should show progress.
   */
  const executeWithProgress = async <T>(fn: () => Promise<T> | T): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      startTransition(async () => {
        try {
          startProgress();
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  return {
    startProgress,
    withProgress,
    executeWithProgress,
  };
}
