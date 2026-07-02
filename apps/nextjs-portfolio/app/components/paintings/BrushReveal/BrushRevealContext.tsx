'use client';

import { createContext, type ReactNode, useContext } from 'react';

import type { BrushStrokeProfile } from '@/app/components/marketing/HeroSection/brushStrokeConstants';

export type BrushRevealContextValue = {
  isActive: boolean;
  reduceMotion: boolean;
  liteMode: boolean;
  profile: BrushStrokeProfile;
};

const BrushRevealContext = createContext<BrushRevealContextValue | null>(null);

export function BrushRevealProvider({
  value,
  children,
}: {
  value: BrushRevealContextValue;
  children: ReactNode;
}) {
  return <BrushRevealContext.Provider value={value}>{children}</BrushRevealContext.Provider>;
}

export function useBrushReveal(): BrushRevealContextValue {
  const ctx = useContext(BrushRevealContext);
  if (!ctx) {
    return { isActive: false, reduceMotion: false, liteMode: false, profile: 'masonry' };
  }
  return ctx;
}
