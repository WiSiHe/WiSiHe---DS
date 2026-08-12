import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  cycleTheme: () => void;
}

function applyThemeClass(theme: ThemePreference) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: 'system',
      setTheme: theme => {
        applyThemeClass(theme);
        set({ theme });
      },
      cycleTheme: () =>
        set(state => {
          const next: ThemePreference =
            state.theme === 'light' ? 'dark' : state.theme === 'dark' ? 'system' : 'light';
          applyThemeClass(next);
          return { theme: next };
        }),
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => state => {
        if (state?.theme) applyThemeClass(state.theme);
      },
    },
  ),
);

export function getResolvedTheme(theme: ThemePreference): 'light' | 'dark' {
  if (theme !== 'system') return theme;
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
