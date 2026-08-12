import { useMemo } from 'react';
import { getCssVariableAsHex } from '@/lib/cssColor';

export type JourneyMapColors = {
  accent: string;
  accentBright: string;
  accentSoft: string;
  routeFaded: string;
  routeShadow: string;
};

export function readJourneyMapColors(): JourneyMapColors {
  return {
    accent: getCssVariableAsHex('--color-accent', '#e02e00'),
    accentBright: getCssVariableAsHex('--color-neon-yellow-400', '#facc15'),
    accentSoft: getCssVariableAsHex('--color-brand-2-400', '#a78bfa'),
    routeFaded: getCssVariableAsHex('--color-foreground-muted', '#94a3b8'),
    routeShadow: getCssVariableAsHex('--color-background', '#0f172a'),
  };
}

export function useJourneyMapColors(themeKey: string): JourneyMapColors {
  return useMemo(() => readJourneyMapColors(), [themeKey]);
}
