'use client';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import React, { useEffect, createContext, useContext, useState } from 'react';
import PostHogPageView from './components/PostHogPageView/PostHogPageView';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// eslint-disable-next-line no-undef
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// eslint-disable-next-line no-undef
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('theme', theme);

    // Determine resolved theme
    let resolved: 'light' | 'dark';
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = theme;
    }

    setResolvedTheme(resolved);

    // Apply theme to document
    const root = document.documentElement;
    if (resolved === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (posthogKey && posthogHost) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        capture_pageview: false,
        capture_pageleave: true, // Enable pageleave capture
        person_profiles: 'identified_only',
      });
    } else {
      console.error('PostHog key or host is not defined');
    }
  }, []);

  return (
    <ThemeProvider>
      <PHProvider client={posthog}>
        <PostHogPageView />
        {children}
      </PHProvider>
    </ThemeProvider>
  );
}
